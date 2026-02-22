from pymongo import MongoClient, ReturnDocument
from datetime import datetime
from bson import ObjectId

# ============================
# MongoDB Setup
# ============================
client = MongoClient("mongodb+srv://yanazlatin:Yana2309@profiles.jrwyitf.mongodb.net/")
db = client["ace_dating_db"]
users = db["users"]

def now_utc():
    return datetime.utcnow()

def to_objectid(x):
    """Return ObjectId if possible, else None."""
    if isinstance(x, ObjectId):
        return x
    if isinstance(x, str):
        s = x.strip()
        if ObjectId.is_valid(s):
            return ObjectId(s)
    return None

# ============================
# Allowed fields
# ============================
PROFILE_FIELDS = {
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

AUTH_FIELDS = {
    "password_hash",
    "session_token",
    "created_at",
    "updated_at",
}

USER_FIELDS = PROFILE_FIELDS | AUTH_FIELDS | {"liked"}

SAFE_USER_PROJECTION = {
    "password_hash": 0,
    "session_token": 0,
}

# ============================
# Generic getters / setters
# ============================
def get_user_field_by_id(user_id, field):
    if field not in USER_FIELDS and field != "_id":
        return None
    uid = to_objectid(user_id)
    if not uid:
        return None
    doc = users.find_one({"_id": uid}, {field: 1})
    return doc.get(field) if doc else None

def set_user_field_by_id(user_id, field, value, touch_updated_at=True):
    if field not in USER_FIELDS:
        return False
    uid = to_objectid(user_id)
    if not uid:
        return False

    update_doc = {"$set": {field: value}}
    if touch_updated_at and field != "updated_at":
        update_doc["$set"]["updated_at"] = now_utc()

    res = users.update_one({"_id": uid}, update_doc)
    return res.matched_count > 0

def get_user_info(user_id, include_sensitive=False):
    """
    include_sensitive=False will hide password_hash + session_token.
    """
    uid = to_objectid(user_id)
    if not uid:
        return None
    projection = None if include_sensitive else SAFE_USER_PROJECTION
    return users.find_one({"_id": uid}, projection)

# ============================
# Authentication helper (legacy)
# NOTE: your Django views use check_password() with password_hash.
# This function is only useful if you already have a raw hash match.
# ============================
def login(username, password_hash):
    user = users.find_one({"username": username, "password_hash": password_hash})
    return str(user["_id"]) if user else None

# ============================
# Create / Update helpers
# ============================
def create_user(
    username,
    password_hash,
    name=None,
    age=None,
    city=None,
    gender=None,
    orientation=None,
    looking_for=None,
    info=None,
    contact=None,
    image_url=None,
):
    now = now_utc()
    doc = {
        "username": username,
        "password_hash": password_hash,
        "session_token": None,
        "created_at": now,
        "updated_at": now,

        "name": name,
        "age": age,
        "city": city,
        "gender": gender,
        "orientation": orientation,
        "looking_for": looking_for,
        "info": info,
        "contact": contact,
        "image_url": image_url,

        "liked": [],
    }
    return users.insert_one(doc).inserted_id

def update_user(user_id, **fields):
    uid = to_objectid(user_id)
    if not uid:
        return None

    update_fields = {k: v for k, v in fields.items() if k in USER_FIELDS}
    if not update_fields:
        return None

    update_fields["updated_at"] = now_utc()

    return users.find_one_and_update(
        {"_id": uid},
        {"$set": update_fields},
        return_document=ReturnDocument.AFTER,
        projection=SAFE_USER_PROJECTION,
    )

# ============================
# Field-specific getters
# ============================
def get_user_age_by_id(user_id): return get_user_field_by_id(user_id, "age")
def get_user_city_by_id(user_id): return get_user_field_by_id(user_id, "city")
def get_user_contact_by_id(user_id): return get_user_field_by_id(user_id, "contact")
def get_user_created_at_by_id(user_id): return get_user_field_by_id(user_id, "created_at")
def get_user_gender_by_id(user_id): return get_user_field_by_id(user_id, "gender")
def get_user_image_url_by_id(user_id): return get_user_field_by_id(user_id, "image_url")
def get_user_info_text_by_id(user_id): return get_user_field_by_id(user_id, "info")
def get_user_looking_for_by_id(user_id): return get_user_field_by_id(user_id, "looking_for")
def get_user_name_by_id(user_id): return get_user_field_by_id(user_id, "name")
def get_user_orientation_by_id(user_id): return get_user_field_by_id(user_id, "orientation")
def get_user_password_hash_by_id(user_id): return get_user_field_by_id(user_id, "password_hash")
def get_user_updated_at_by_id(user_id): return get_user_field_by_id(user_id, "updated_at")
def get_user_username_by_id(user_id): return get_user_field_by_id(user_id, "username")

# ============================
# Field-specific setters
# ============================
def set_user_age(user_id, age): return set_user_field_by_id(user_id, "age", age)
def set_user_city(user_id, city): return set_user_field_by_id(user_id, "city", city)
def set_user_contact(user_id, contact): return set_user_field_by_id(user_id, "contact", contact)
def set_user_gender(user_id, gender): return set_user_field_by_id(user_id, "gender", gender)
def set_user_image_url(user_id, image_url): return set_user_field_by_id(user_id, "image_url", image_url)
def set_user_info_text(user_id, info): return set_user_field_by_id(user_id, "info", info)
def set_user_looking_for(user_id, looking_for): return set_user_field_by_id(user_id, "looking_for", looking_for)
def set_user_name(user_id, name): return set_user_field_by_id(user_id, "name", name)
def set_user_orientation(user_id, orientation): return set_user_field_by_id(user_id, "orientation", orientation)
def set_user_username(user_id, username): return set_user_field_by_id(user_id, "username", username)

def set_user_password_hash(user_id, password_hash):
    return set_user_field_by_id(user_id, "password_hash", password_hash, touch_updated_at=True)

def set_user_created_at(user_id, dt):
    return set_user_field_by_id(user_id, "created_at", dt, touch_updated_at=False)

def set_user_updated_at(user_id, dt):
    return set_user_field_by_id(user_id, "updated_at", dt, touch_updated_at=False)

# ============================
# Password reset
# ============================
def reset_user_password_by_username(username: str, new_password_hash: str) -> bool:
    res = users.update_one(
        {"username": username},
        {"$set": {"password_hash": new_password_hash, "updated_at": now_utc()}}
    )
    return res.matched_count > 0

def reset_user_password_by_contact(contact_value: str, new_password_hash: str) -> bool:
    res = users.update_one(
        {"contact": contact_value},
        {"$set": {"password_hash": new_password_hash, "updated_at": now_utc()}}
    )
    return res.matched_count > 0

# ============================
# Likes
# ============================
def ensure_liked_field_exists_for_all_users():
    """One-time migration helper: adds liked: [] to users that don't have it."""
    users.update_many({"liked": {"$exists": False}}, {"$set": {"liked": []}})

def get_user_liked(user_id):
    """Return liked list as strings (JSON-safe)."""
    uid = to_objectid(user_id)
    if not uid:
        return []
    doc = users.find_one({"_id": uid}, {"liked": 1})
    liked = (doc or {}).get("liked", [])
    return [str(x) for x in liked]

def add_liked_profile(user_id, liked_user_id) -> bool:
    """Add one user id to liked list (no duplicates)."""
    uid = to_objectid(user_id)
    pid = to_objectid(liked_user_id)
    if not uid or not pid:
        return False
    if uid == pid:
        return False

    res = users.update_one(
        {"_id": uid},
        {"$addToSet": {"liked": pid}, "$set": {"updated_at": now_utc()}},
    )
    return res.matched_count > 0

def remove_liked_profile(user_id, liked_user_id) -> bool:
    """Remove one user id from liked list."""
    uid = to_objectid(user_id)
    pid = to_objectid(liked_user_id)
    if not uid or not pid:
        return False

    res = users.update_one(
        {"_id": uid},
        {"$pull": {"liked": pid}, "$set": {"updated_at": now_utc()}},
    )
    return res.matched_count > 0

def get_liked_profiles(user_id):
    """
    Return FULL docs for liked users (no password_hash/session_token).
    """
    uid = to_objectid(user_id)
    if not uid:
        return []

    doc = users.find_one({"_id": uid}, {"liked": 1})
    liked_ids = (doc or {}).get("liked", [])
    liked_ids = [x for x in liked_ids if isinstance(x, ObjectId)] + [
        to_objectid(x) for x in liked_ids if not isinstance(x, ObjectId)
    ]
    liked_ids = [x for x in liked_ids if x is not None]

    if not liked_ids:
        return []

    liked_docs = list(users.find({"_id": {"$in": liked_ids}}, SAFE_USER_PROJECTION))

    # keep order
    order = {str(x): i for i, x in enumerate(liked_ids)}
    liked_docs.sort(key=lambda d: order.get(str(d.get("_id")), 10**9))

    # stringify _id for frontend
    for d in liked_docs:
        d["_id"] = str(d["_id"])
    return liked_docs