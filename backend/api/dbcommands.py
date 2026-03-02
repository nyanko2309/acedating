from pymongo import MongoClient
from datetime import datetime

# ====== CONFIG ======
MONGO_URI = "mongodb+srv://yanazlatin:Yana2309@profiles.jrwyitf.mongodb.net/"
DB_NAME = "ace_dating_db"
COLL_NAME = "users"

# Canonical values you want in DB
ORIENTATION_CANON = ["Ace", "Aro", "Aroace", "Demi", "Grey-asexual"]
LOOKING_FOR_CANON = ["Friendship", "Monogamy-romance", "Qpr", "Polyamory-romance"]
GENDER_CANON = ["Man", "Woman", "Non-binary", "Other"]

def now_utc():
    return datetime.utcnow()

def build_map(canon_list):
    """
    Map lowercase -> canonical string.
    Example: 'ace' -> 'Ace'
    """
    return {c.lower(): c for c in canon_list}

ORI_MAP = build_map(ORIENTATION_CANON)
LF_MAP = build_map(LOOKING_FOR_CANON)
GENDER_MAP = build_map(GENDER_CANON)

def normalize_field(value, mapping):
    """
    If value matches mapping case-insensitively, return canonical.
    Otherwise return None (meaning: don't change it).
    """
    if value is None:
        return None
    if not isinstance(value, str):
        return None
    key = value.strip().lower()
    if not key:
        return None
    return mapping.get(key)  # returns canonical or None

def main():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users = db[COLL_NAME]

    scanned = 0
    updated = 0

    cursor = users.find({}, {"orientation": 1, "looking_for": 1, "gender": 1})
    for doc in cursor:
        scanned += 1
        sets = {}

        new_ori = normalize_field(doc.get("orientation"), ORI_MAP)
        if new_ori is not None and doc.get("orientation") != new_ori:
            sets["orientation"] = new_ori

        new_lf = normalize_field(doc.get("looking_for"), LF_MAP)
        if new_lf is not None and doc.get("looking_for") != new_lf:
            sets["looking_for"] = new_lf

        new_gender = normalize_field(doc.get("gender"), GENDER_MAP)
        if new_gender is not None and doc.get("gender") != new_gender:
            sets["gender"] = new_gender

        if sets:
            sets["updated_at"] = now_utc()
            users.update_one({"_id": doc["_id"]}, {"$set": sets})
            updated += 1

    print(f"Done. Scanned: {scanned}, Updated: {updated}")

if __name__ == "__main__":
    main()