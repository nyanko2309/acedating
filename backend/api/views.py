from datetime import datetime
from uuid import uuid4
from datetime import timezone

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


def serialize_letter(doc):
    def s_oid(v):
        return str(v) if isinstance(v, ObjectId) else (str(v) if v else None)

    def s_dt(v):
        if not v:
            return None
        # ensure timezone-aware ISO
        if isinstance(v, datetime) and v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        return v.isoformat()

    return {
        "_id": s_oid(doc.get("_id")),
        "sender_id": s_oid(doc.get("sender_id")),
        "receiver_id": s_oid(doc.get("receiver_id")),
        "letter": doc.get("letter", "") or "",
        "created_at": s_dt(doc.get("created_at")),
        "read_at": s_dt(doc.get("read_at")),
    }

def serialize_mongo(doc):
    if doc is None:
        return None

    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        elif isinstance(v, datetime):
            if v.tzinfo is None:
                v = v.replace(tzinfo=timezone.utc)
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


PROFILE_ALLOWED_FIELDS = {
    "username",
    "name",
    "age",
    "preference",
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
    Body: { username, password, name, age, orientation, looking_for, image_url, city, gender, info, contact, preference }
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

        # ✅ default preference to empty string
        preference = (data.get("preference") or "").strip()

        now = datetime.utcnow()
        token = str(uuid4())

        user_doc = {
            "username": username,
            "password_hash": make_password(password),
            "session_token": token,
            "created_at": now,
            "updated_at": now,

            "name": (data.get("name") or "").strip() or None,
            "age": age,
            "preference": preference,  # ✅ fixed
            "orientation": data.get("orientation"),
            "looking_for": data.get("looking_for"),
            "image_url": data.get("image_url"),
            "city": data.get("city"),
            "gender": data.get("gender"),
            "info": data.get("info"),
            "contact": data.get("contact"),

            "liked": [],
        }

        user_id = users.insert_one(user_doc).inserted_id
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

        # ---------- identify viewer ----------
        viewer_id = request.headers.get("X-User-Id") or request.query_params.get("viewer_id")
        viewer_oid = oid(viewer_id) if viewer_id else None

        viewer_gender = None
        if viewer_oid:
            viewer_doc = users.find_one({"_id": viewer_oid}, {"gender": 1})
            viewer_gender = (viewer_doc.get("gender") if viewer_doc else None)

        # ---------- base query ----------
        q = {}

        if cursor:
            c = oid(cursor)
            if c:
                q["_id"] = {"$gt": c}

        # exclude self if we know viewer
        if viewer_oid:
            q["_id"] = q.get("_id", {})
            if isinstance(q["_id"], dict):
                q["_id"]["$ne"] = viewer_oid
            else:
                # in case you ever change _id filter structure
                q["_id"] = {"$ne": viewer_oid}

        # ---------- preference filter ----------
        # If viewer has gender, only return profiles that prefer that gender OR have empty/no preference
        if viewer_gender in {"woman", "man", "non-binary", "other"}:
            q["$or"] = [
                {"preference": viewer_gender},
                {"preference": ""},
                {"preference": None},
                {"preference": {"$exists": False}},
            ]

        # ---------- projection ----------
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
            
class WriteLatterView(APIView):
    """
    POST /api/writelatter/<user_id>/<profile_id>
    Body: { "letter": "..." }
    Saves one introduction letter from sender(user_id) to receiver(profile_id).
    """

    def post(self, request, user_id, profile_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        sender = oid(user_id)
        receiver = oid(profile_id)

        if not sender or not receiver:
            return Response({"error": "Invalid user id / profile id"}, status=400)

        if sender == receiver:
            return Response({"error": "You can't send a letter to yourself"}, status=400)

        # ensure both users exist
        if not users.find_one({"_id": sender}, {"_id": 1}):
            return Response({"error": "Sender not found"}, status=404)
        if not users.find_one({"_id": receiver}, {"_id": 1}):
            return Response({"error": "Receiver not found"}, status=404)

        letter = (request.data.get("letter") or "").strip()
        if not letter:
            return Response({"error": "Letter is required"}, status=400)
        if len(letter) > 2000:
            return Response({"error": "Letter is too long (max 2000)"}, status=400)

        # Optional: only one letter per pair
        existing = letters.find_one({"sender_id": sender, "receiver_id": receiver})
        if existing:
            return Response({"error": "You already sent a letter to this user"}, status=409)

        doc = {
            "sender_id": sender,
            "receiver_id": receiver,
            "letter": letter,
            "created_at": datetime.utcnow(),
            "read_at": None,
        }
        inserted_id = letters.insert_one(doc).inserted_id

        return Response({"ok": True, "letter_id": str(inserted_id)}, status=status.HTTP_201_CREATED)
    
class InboxView(APIView):
    """
    GET /api/inbox/<user_id>
    Returns letters received (newest first), includes sender username.
    """
    def get(self, request, user_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        uid = oid(user_id)
        if not uid:
            return Response({"items": []}, status=200)

        docs = list(letters.find({"receiver_id": uid}).sort("created_at", -1).limit(200))

        # collect sender ids
        sender_ids = []
        for d in docs:
            sid = d.get("sender_id")
            if sid:
                sender_ids.append(sid)

        # fetch usernames in one query
        sender_map = {}
        if sender_ids:
            sender_profiles = users.find(
                {"_id": {"$in": list(set(sender_ids))}},
                {"username": 1, "name": 1}
            )
            for sp in sender_profiles:
                sender_map[str(sp["_id"])] = sp.get("username") or sp.get("name") or "Unknown"

        out = []
        for d in docs:
            item = serialize_letter(d)
            sid = item.get("sender_id")
            item["sender_username"] = sender_map.get(str(sid), "Unknown")
            out.append(item)

        return Response({"items": out}, status=200)
    
class MarkLetterReadView(APIView):
    # POST /api/letters/<letter_id>/read
    def post(self, request, letter_id):
        db = get_db()
        letters = db["letters"]

        lid = oid(letter_id)
        if not lid:
            return Response({"error": "Invalid letter id"}, status=400)

        # optional: make sure only receiver can mark read
        uid = oid(request.data.get("user_id"))
        if not uid:
            return Response({"error": "Invalid user id"}, status=400)

        doc = letters.find_one({"_id": lid})
        if not doc:
            return Response({"error": "Letter not found"}, status=404)

        if doc.get("receiver_id") != uid:
            return Response({"error": "Not allowed"}, status=403)

        now = datetime.now(timezone.utc)  # "today's date" stored as UTC ISO
        letters.update_one(
            {"_id": lid},
            {"$set": {"read_at": now}}
        )

        return Response({"ok": True, "read_at": now.isoformat()}, status=200)
    
class DeleteLetterView(APIView):
    # DELETE /api/letters/<letter_id>?user_id=<receiver_id>
    def delete(self, request, letter_id):
        db = get_db()
        letters = db["letters"]

        lid = oid(letter_id)
        if not lid:
            return Response({"error": "Invalid letter id"}, status=400)

        uid = oid(request.query_params.get("user_id"))
        if not uid:
            return Response({"error": "Invalid user id"}, status=400)

        doc = letters.find_one({"_id": lid})
        if not doc:
            return Response({"error": "Letter not found"}, status=404)

        # only receiver can delete
        if doc.get("receiver_id") != uid:
            return Response({"error": "Not allowed"}, status=403)

        letters.delete_one({"_id": lid})
        return Response({"ok": True}, status=200)