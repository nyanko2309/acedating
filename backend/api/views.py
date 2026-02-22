from datetime import datetime
from uuid import uuid4

from bson import ObjectId
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from . import dbcommands
from .mongo import get_db
import cloudinary


# ----------------------------
# Helpers
# ----------------------------
def oid(x):
    """Safe ObjectId converter for ids coming as strings."""
    if isinstance(x, ObjectId):
        return x
    if isinstance(x, str) and ObjectId.is_valid(x.strip()):
        return ObjectId(x.strip())
    return None


def serialize_mongo(doc):
    """
    Convert Mongo fields that break JSON (ObjectId, datetime) into safe values.
    NOTE: This is NOT recursive. Option B avoids returning fields like 'liked'
    in endpoints that would otherwise crash due to nested ObjectIds.
    """
    if doc is None:
        return None

    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        elif isinstance(v, datetime):
            out[k] = v.isoformat() + "Z"
        else:
            out[k] = v
    return out


PROFILE_ALLOWED_FIELDS = {
    "username",
    "name",
    "age",
    "city",
    "gender",
    "orientation",
    "looking_for",
    "info",
    "contact",
    "image_url",
}


# ----------------------------
# Auth
# ----------------------------
class SignUpView(APIView):
    """
    POST /api/signup
    Body: { username, password, name, age, orientation, looking_for, image_url, city, gender, info, contact }
    Creates user and returns token + user_id.
    """

    def post(self, request):
        db = get_db()
        users = db["users"]

        data = request.data
        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        if not username or not password:
            return Response({"error": "username and password are required"}, status=400)

        if users.find_one({"username": username}):
            return Response({"error": "username already exists"}, status=400)

        try:
            age = int(data.get("age"))
        except Exception:
            return Response({"error": "age must be a number"}, status=400)

        now = datetime.utcnow()
        token = str(uuid4())

        user_doc = {
            # auth
            "username": username,
            "password_hash": make_password(password),
            "session_token": token,
            "created_at": now,
            "updated_at": now,

            # profile fields
            "name": (data.get("name") or "").strip() or None,
            "age": age,
            "orientation": data.get("orientation"),
            "looking_for": data.get("looking_for"),
            "image_url": data.get("image_url"),
            "city": data.get("city"),
            "gender": data.get("gender"),
            "info": data.get("info"),
            "contact": data.get("contact"),

            # likes list
            "liked": [],
        }

        user_id = users.insert_one(user_doc).inserted_id  # ObjectId

        return Response(
            {"message": "Signup successful", "token": token, "user_id": str(user_id)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/login
    Body: { username, password }
    Returns token + user_id.
    """

    def post(self, request):
        db = get_db()
        users = db["users"]

        data = request.data
        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        if not username or not password:
            return Response({"error": "username and password are required"}, status=400)

        user = users.find_one({"username": username})
        if not user:
            return Response({"error": "Invalid username or password"}, status=401)

        if not check_password(password, user.get("password_hash", "")):
            return Response({"error": "Invalid username or password"}, status=401)

        token = str(uuid4())
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"session_token": token, "updated_at": datetime.utcnow()}},
        )

        return Response(
            {"message": "Login successful", "token": token, "user_id": str(user["_id"])},
            status=200,
        )


class PingView(APIView):
    def get(self, request):
        return Response({"message": "pong"}, status=status.HTTP_200_OK)


# ----------------------------
# Profiles list (feed) - now from users
# OPTION B: exclude 'liked' so ObjectIds in the list never reach JSON renderer
# ----------------------------
class ProfilesListView(APIView):
    def get(self, request):
        db = get_db()
        users = db["users"]

        try:
            limit = int(request.query_params.get("limit", 24))
        except Exception:
            limit = 24
        limit = max(1, min(limit, 60))

        cursor = request.query_params.get("cursor")
        q = {}
        if cursor:
            c = oid(cursor)
            if c:
                q["_id"] = {"$gt": c}

        # exclude sensitive fields + exclude liked (OPTION B FIX)
        projection = {
            "password_hash": 0,
            "session_token": 0,
            "liked": 0,
        }

        docs = list(users.find(q, projection).sort("_id", 1).limit(limit + 1))

        has_more = len(docs) > limit
        docs = docs[:limit]
        next_cursor = str(docs[-1]["_id"]) if (has_more and docs) else None

        return Response(
            {
                "items": [serialize_mongo(d) for d in docs],
                "next_cursor": next_cursor,
                "has_more": has_more,
            },
            status=200,
        )


# ----------------------------
# Saved profiles (liked) - from users.liked
# ----------------------------
class ProfilessavedListView(APIView):
    def get(self, request, user_id):
        db = get_db()
        users = db["users"]

        uid = oid(user_id)
        if not uid:
            return Response({"items": []}, status=200)

        me = users.find_one({"_id": uid}, {"liked": 1})
        liked_raw = (me or {}).get("liked", [])

        liked_ids = []
        for x in liked_raw:
            if isinstance(x, ObjectId):
                liked_ids.append(x)
            else:
                o = oid(x)
                if o:
                    liked_ids.append(o)

        if not liked_ids:
            return Response({"items": []}, status=200)

        # IMPORTANT: exclude liked here too (otherwise same crash)
        docs = list(
            users.find(
                {"_id": {"$in": liked_ids}},
                {"password_hash": 0, "session_token": 0, "liked": 0},
            )
        )
        return Response({"items": [serialize_mongo(d) for d in docs]}, status=200)


# ----------------------------
# Single profile (me) - now from users
# ----------------------------
class ProfileView(APIView):
    def get(self, request, user_id):
        db = get_db()
        users = db["users"]

        uid = oid(user_id)
        if not uid:
            return Response({"error": "Invalid user id"}, status=400)

        # exclude liked to be safe (optional, but prevents same serialization issue)
        doc = users.find_one({"_id": uid}, {"password_hash": 0, "session_token": 0, "liked": 0})
        if not doc:
            return Response({"error": "Profile not found"}, status=404)

        return Response(serialize_mongo(doc), status=200)

    def put(self, request, user_id):
        db = get_db()
        users = db["users"]

        uid = oid(user_id)
        if not uid:
            return Response({"error": "Invalid user id"}, status=400)

        requester_id = request.headers.get("X-User-Id") or request.data.get("user_id")
        if requester_id and str(requester_id) != str(user_id):
            return Response({"error": "Not allowed"}, status=403)

        data = request.data or {}
        update_fields = {k: data.get(k) for k in PROFILE_ALLOWED_FIELDS if k in data}

        if "age" in update_fields and update_fields["age"] is not None:
            try:
                update_fields["age"] = int(update_fields["age"])
            except Exception:
                return Response({"error": "Age must be a number"}, status=400)

        update_fields["updated_at"] = datetime.utcnow()
        users.update_one({"_id": uid}, {"$set": update_fields})

        # exclude liked to prevent serialization issue
        doc = users.find_one({"_id": uid}, {"password_hash": 0, "session_token": 0, "liked": 0})
        return Response(serialize_mongo(doc), status=200)


class CloudinaryDeleteView(APIView):
    def post(self, request):
        public_id = (request.data.get("public_id") or "").strip()
        if not public_id:
            return Response({"error": "public_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = cloudinary.uploader.destroy(public_id)
            return Response({"result": result.get("result", "unknown")}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikesView(APIView):
    # GET /api/likes/<user_id> -> {"liked": ["id1","id2",...]}
    def get(self, request, user_id):
        try:
            liked_ids = dbcommands.get_user_liked(user_id)
            liked_ids = [str(x) for x in (liked_ids or [])]
            return Response({"liked": liked_ids}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # POST /api/likes/<user_id>/<profile_id> -> like
    def post(self, request, user_id, profile_id):
        try:
            ok = dbcommands.add_liked_profile(user_id, profile_id)
            if not ok:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"ok": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # DELETE /api/likes/<user_id>/<profile_id> -> unlike
    def delete(self, request, user_id, profile_id):
        try:
            ok = dbcommands.remove_liked_profile(user_id, profile_id)
            if not ok:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"ok": True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)