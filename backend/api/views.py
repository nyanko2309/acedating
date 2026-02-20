from datetime import datetime
from uuid import uuid4

from bson import ObjectId
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .mongo import get_db

def oid(x):
    """Safe ObjectId converter for ids coming as strings."""
    if isinstance(x, ObjectId):
        return x
    if isinstance(x, str) and ObjectId.is_valid(x.strip()):
        return ObjectId(x.strip())
    return x


def serialize_mongo(doc):
    """
    Convert Mongo fields that break JSON (ObjectId, datetime) into safe values.
    - _id / user_id become strings
    - datetime becomes ISO string
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


class SignUpView(APIView):
    """
    POST /api/auth/signup
    Body: { username, password, name, age, orientation, looking_for, image_url, city, gender, info, contact }
    Creates user + profile and returns token.
    """

    def post(self, request):
        db = get_db()
        users = db["users"]
        profiles = db["profiles"]

        data = request.data

        username = (data.get("username") or "").strip()
        password = data.get("password") or ""

        if not username or not password:
            return Response({"error": "username and password are required"}, status=400)

        # Unique username
        if users.find_one({"username": username}):
            return Response({"error": "username already exists"}, status=400)

        # Validate age
        try:
            age = int(data.get("age"))
        except Exception:
            return Response({"error": "age must be a number"}, status=400)

        now = datetime.utcnow()

        # Create user (Mongo assigns ObjectId)
        token = str(uuid4())
        user_doc = {
            "username": username,
            "password_hash": make_password(password),
            "session_token": token,
            "created_at": now,
            "updated_at": now,
        }
        user_id = users.insert_one(user_doc).inserted_id  # ObjectId

        # Create profile (store user_id as ObjectId)
        profile_doc = {
            "user_id": user_id,
            "username": username,
            "name": (data.get("name") or "").strip() or None,
            "age": age,
            "orientation": data.get("orientation"),
            "looking_for": data.get("looking_for"),
            "image_url": data.get("image_url"),
            "city": data.get("city"),
            "gender": data.get("gender"),
            "info": data.get("info"),
            "contact": data.get("contact"),
        }
        profiles.insert_one(profile_doc)

        # IMPORTANT: return ids as strings for React
        return Response(
            {"message": "Signup successful", "token": token, "user_id": str(user_id)},
            status=status.HTTP_201_CREATED,
        )

class PingView(APIView):
    def get(self, request):
        return Response({"message": "pong"}, status=status.HTTP_200_OK)

        
class LoginView(APIView):
    """
    POST /api/auth/login
    Body: { username, password }
    Returns token.
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

        # Refresh token on login + touch updated_at
        token = str(uuid4())
        users.update_one(
            {"_id": user["_id"]},
            {"$set": {"session_token": token, "updated_at": datetime.utcnow()}},
        )

        return Response(
            {"message": "Login successful", "token": token, "user_id": str(user["_id"])},
            status=200,
        )
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
            out[k] = v.isoformat() + "Z"
        else:
            out[k] = v
    return out


class ProfilesListView(APIView):
    """
    GET /api/profiles?limit=24&cursor=<last_id>
    Returns: { items: [...], next_cursor: "...", has_more: true/false }
    """

    def get(self, request):
        db = get_db()
        profiles = db["profiles"]

        try:
            limit = int(request.query_params.get("limit", 24))
        except Exception:
            limit = 24
        limit = max(1, min(limit, 60))  # protect server

        cursor = request.query_params.get("cursor")
        q = {}
        if cursor:
            c = oid(cursor)
            if c:
                q["_id"] = {"$gt": c}

        # only return safe fields (no password hashes etc.)
        projection = {
            "user_id": 1,
            "username": 1,
            "name": 1,
            "age": 1,
            "orientation": 1,
            "looking_for": 1,
            "image_url": 1,
            "city": 1,
            "gender": 1,
            "info": 1,
            "contact": 1,
        }

        docs = list(
            profiles.find(q, projection).sort("_id", 1).limit(limit + 1)
        )

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