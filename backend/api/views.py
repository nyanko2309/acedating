from datetime import datetime
from uuid import uuid4
from datetime import timezone
from pymongo.errors import DuplicateKeyError
import requests
import time
from django.http import JsonResponse
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
    if isinstance(x, ObjectId):
        return x
    if isinstance(x, str) and ObjectId.is_valid(x.strip()):
        return ObjectId(x.strip())
    return None


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


def require_session(request, users, claimed_user_id):
    """
    Verifies the caller actually owns claimed_user_id by checking
    X-Session-Token against what's stored in Mongo for that user.

    Returns (uid, None) on success, or (None, error_response) on failure.
    claimed_user_id can come from a URL path segment or the body — either
    way, it's just an attacker-controlled claim until proven with the token.
    """
    uid = oid(claimed_user_id)
    if not uid:
        return None, Response({"error": "Invalid user id"}, status=400)

    token = request.headers.get("X-Session-Token")
    if not token:
        return None, Response({"error": "Missing session token"}, status=401)

    user = users.find_one({"_id": uid}, {"session_token": 1})
    if not user or user.get("session_token") != token:
        return None, Response({"error": "Invalid or expired session"}, status=401)

    return uid, None


PROFILE_ALLOWED_FIELDS = {
    "username",
    "name",
    "age",
    "preference",
    "city",
    "gender",
    "orientation",
    "romantic_orientation",
    "looking_for",
    "info",
    "contact",
    "image_url",
    "image_public_id",
    "email",
}


# ----------------------------
# Auth
# ----------------------------
class SignUpView(APIView):
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

        preference = (data.get("preference") or "").strip()
        romantic_orientation = (data.get("romantic_orientation") or "").strip()
        email = (data.get("email") or "").strip().lower()

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
            "preference": preference,

            "orientation": (data.get("orientation") or "").strip() or None,
            "romantic_orientation": romantic_orientation,

            "looking_for": (data.get("looking_for") or "").strip() or None,
            "image_url": data.get("image_url"),
            "image_public_id": data.get("image_public_id"),
            "city": data.get("city"),
            "gender": data.get("gender"),
            "info": data.get("info"),
            "contact": data.get("contact"),
            "email": email,

            "liked": [],
        }

        user_id = users.insert_one(user_doc).inserted_id
        return Response(
            {"message": "Signup successful", "token": token, "user_id": str(user_id)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
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


class ResetPasswordView(APIView):
    def post(self, request):
        db = get_db()
        users = db["users"]

        data = request.data or {}
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        new_password = data.get("new_password") or ""

        if not username or not new_password:
            return Response({"error": "username and new_password are required"}, status=400)

        if len(new_password) < 6:
            return Response({"error": "Password must be at least 6 characters"}, status=400)

        user = users.find_one({"username": username})
        if not user:
            return Response({"message": "If the user exists, password was updated"}, status=200)

        stored_email = (user.get("email") or "").strip().lower()

        if stored_email and email != stored_email:
            return Response({"error": "Email does not match our records"}, status=403)

        token = str(uuid4())
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "password_hash": make_password(new_password),
                "session_token": token,
                "updated_at": datetime.utcnow()
            }},
        )

        return Response({"message": "Password updated"}, status=status.HTTP_200_OK)


class PingView(APIView):
    def get(self, request):
        return Response({"message": "pong"}, status=status.HTTP_200_OK)


# ----------------------------
# Profiles list (feed) - now from users
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

        viewer_id = request.headers.get("X-User-Id") or request.query_params.get("viewer_id")
        viewer_oid = oid(viewer_id) if viewer_id else None

        viewer_gender = None
        if viewer_oid:
            viewer_doc = users.find_one({"_id": viewer_oid}, {"gender": 1})
            viewer_gender = (viewer_doc.get("gender") if viewer_doc else None)

        q = {}

        if cursor:
            c = oid(cursor)
            if c:
                q["_id"] = {"$gt": c}

        if viewer_oid:
            q["_id"] = q.get("_id", {})
            if isinstance(q["_id"], dict):
                q["_id"]["$ne"] = viewer_oid
            else:
                q["_id"] = {"$ne": viewer_oid}

        if viewer_gender in {"Woman", "Man", "Non-binary", "Other"}:
            q["$or"] = [
                {"preference": viewer_gender},
                {"preference": ""},
                {"preference": "Any"},
                {"preference": None},
                {"preference": {"$exists": False}},
            ]

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

        doc = users.find_one({"_id": uid}, {"password_hash": 0, "session_token": 0, "liked": 0})
        if not doc:
            return Response({"error": "Profile not found"}, status=404)

        return Response(serialize_mongo(doc), status=200)

    def put(self, request, user_id):
        db = get_db()
        users = db["users"]

        # ✅ FIXED: real session-token check instead of comparing two
        # attacker-controlled values against each other
        uid, err = require_session(request, users, user_id)
        if err:
            return err

        data = request.data or {}
        update_fields = {k: data.get(k) for k in PROFILE_ALLOWED_FIELDS if k in data}

        if "age" in update_fields and update_fields["age"] is not None:
            try:
                update_fields["age"] = int(update_fields["age"])
            except Exception:
                return Response({"error": "Age must be a number"}, status=400)

        if "preference" in update_fields and update_fields["preference"] is not None:
            pref = str(update_fields["preference"]).strip()
            update_fields["preference"] = "" if pref == "any" else pref

        if "romantic_orientation" in update_fields and update_fields["romantic_orientation"] is not None:
            update_fields["romantic_orientation"] = str(update_fields["romantic_orientation"]).strip()

        if "email" in update_fields and update_fields["email"] is not None:
            update_fields["email"] = str(update_fields["email"]).strip().lower()

        update_fields["updated_at"] = datetime.utcnow()
        try:
            users.update_one({"_id": uid}, {"$set": update_fields})
        except DuplicateKeyError:
            return Response({"error": "Username already exists"}, status=409)
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

#==========================================================================Likes
from datetime import datetime
from bson import ObjectId
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .mongo import get_db


class LikesView(APIView):
    def get(self, request, user_id, profile_id=None):
        db = get_db()
        users = db["users"]

        uid = oid(user_id)
        if not uid:
            return Response({"liked": []}, status=status.HTTP_200_OK)

        me = users.find_one({"_id": uid}, {"liked": 1})
        liked_raw = (me or {}).get("liked", [])

        liked = []
        for x in liked_raw:
            if isinstance(x, ObjectId):
                liked.append(str(x))
            else:
                o = oid(x)
                if o:
                    liked.append(str(o))

        return Response({"liked": liked}, status=status.HTTP_200_OK)

    def post(self, request, user_id, profile_id):
        db = get_db()
        users = db["users"]

        # ✅ FIXED: only the real session owner can like on behalf of user_id
        uid, err = require_session(request, users, user_id)
        if err:
            return err

        pid = oid(profile_id)
        if not pid:
            return Response({"error": "Invalid id"}, status=status.HTTP_400_BAD_REQUEST)
        if uid == pid:
            return Response({"error": "Cannot like yourself"}, status=status.HTTP_400_BAD_REQUEST)

        res = users.update_one(
            {"_id": uid},
            {"$addToSet": {"liked": pid}, "$set": {"updated_at": datetime.utcnow()}},
        )
        if res.matched_count == 0:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"ok": True}, status=status.HTTP_200_OK)

    def delete(self, request, user_id, profile_id):
        db = get_db()
        users = db["users"]

        # ✅ FIXED
        uid, err = require_session(request, users, user_id)
        if err:
            return err

        pid = oid(profile_id)
        if not pid:
            return Response({"error": "Invalid id"}, status=status.HTTP_400_BAD_REQUEST)

        res = users.update_one(
            {"_id": uid},
            {"$pull": {"liked": pid}, "$set": {"updated_at": datetime.utcnow()}},
        )
        if res.matched_count == 0:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"ok": True}, status=status.HTTP_200_OK)

#======================================================================================Latters
class WriteLatterView(APIView):
    def post(self, request, user_id, profile_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        # ✅ FIXED: only the real session owner can send as user_id
        sender, err = require_session(request, users, user_id)
        if err:
            return err

        receiver = oid(profile_id)
        if not receiver:
            return Response({"error": "Invalid profile id"}, status=400)

        if sender == receiver:
            return Response({"error": "You can't send a letter to yourself"}, status=400)

        if not users.find_one({"_id": receiver}, {"_id": 1}):
            return Response({"error": "Receiver not found"}, status=404)

        letter = (request.data.get("letter") or "").strip()
        if not letter:
            return Response({"error": "Letter is required"}, status=400)
        if len(letter) > 2000:
            return Response({"error": "Letter is too long (max 2000)"}, status=400)

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
    def get(self, request, user_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        # ✅ FIXED: your inbox is private, only you should read it
        uid, err = require_session(request, users, user_id)
        if err:
            return err

        docs = list(letters.find({"receiver_id": uid}).sort("created_at", -1).limit(200))

        sender_ids = []
        for d in docs:
            sid = d.get("sender_id")
            if sid:
                sender_ids.append(sid)

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
            item = serialize_mongo(d)
            sid = item.get("sender_id")
            item["sender_username"] = sender_map.get(str(sid), "Unknown")
            out.append(item)

        return Response({"items": out}, status=200)


class MarkLetterReadView(APIView):
    def post(self, request, letter_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        claimed_user_id = request.data.get("user_id")
        # ✅ FIXED: verify session before trusting the claimed user_id
        uid, err = require_session(request, users, claimed_user_id)
        if err:
            return err

        lid = oid(letter_id)
        if not lid:
            return Response({"error": "Invalid letter id"}, status=400)

        doc = letters.find_one({"_id": lid})
        if not doc:
            return Response({"error": "Letter not found"}, status=404)

        if doc.get("receiver_id") != uid:
            return Response({"error": "Not allowed"}, status=403)

        now = datetime.now(timezone.utc)
        letters.update_one(
            {"_id": lid},
            {"$set": {"read_at": now}}
        )

        return Response({"ok": True, "read_at": now.isoformat()}, status=200)


class DeleteLetterView(APIView):
    def delete(self, request, letter_id):
        db = get_db()
        letters = db["letters"]
        users = db["users"]

        claimed_user_id = request.query_params.get("user_id")
        # ✅ FIXED
        uid, err = require_session(request, users, claimed_user_id)
        if err:
            return err

        lid = oid(letter_id)
        if not lid:
            return Response({"error": "Invalid letter id"}, status=400)

        doc = letters.find_one({"_id": lid})
        if not doc:
            return Response({"error": "Letter not found"}, status=404)

        if doc.get("receiver_id") != uid:
            return Response({"error": "Not allowed"}, status=403)

        letters.delete_one({"_id": lid})
        return Response({"ok": True}, status=200)


class VerifySessionView(APIView):
    def get(self, request):
        db = get_db()
        users = db["users"]

        user_id = request.headers.get("X-User-Id")
        token = request.headers.get("X-Session-Token")

        uid = oid(user_id)
        if not uid or not token:
            return Response({"valid": False}, status=401)

        user = users.find_one({"_id": uid}, {"session_token": 1})
        if not user or user.get("session_token") != token:
            return Response({"valid": False}, status=401)

        return Response({"valid": True}, status=200)


HEALTH_URL = "https://acedating-new.onrender.com/api/health"
from rest_framework.views import APIView
from rest_framework.response import Response

class health(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        return Response({"ok": True})
    
class LikedByView(APIView):
    """
    GET /api/likedby/<user_id>
    Headers: X-Session-Token (must belong to user_id)

    Returns every user who has saved/liked this profile — i.e. every user
    document whose "liked" array contains user_id.
    Private by design: only the account owner can see who saved them.
    """

    def get(self, request, user_id):
        db = get_db()
        users = db["users"]

        # Only the profile owner can see who saved them
        uid, err = require_session(request, users, user_id)
        if err:
            return err

        # find every user doc whose "liked" array contains this uid
        docs = list(
            users.find(
                {"liked": uid},
                {"password_hash": 0, "session_token": 0, "liked": 0},
            )
        )

        return Response(
            {
                "count": len(docs),
                "items": [serialize_mongo(d) for d in docs],
            },
            status=200,
        )