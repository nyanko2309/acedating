from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timezone

MONGO_URI = "mongodb+srv://yanazlatin:Yana2309@profiles.jrwyitf.mongodb.net/"
DB_NAME = "ace_dating_db"

# ✅ run once with DRY_RUN=True (prints what it WOULD do)
DRY_RUN = False

# ✅ only set True AFTER you confirm merge worked
DROP_PROFILES_AFTER = False

PROFILE_FIELDS = [
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
]

def main():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users = db["users"]

    res = users.update_many({}, {"$set": {"preference": ""}})

    print(f"Matched: {res.matched_count}")
    print(f"Modified: {res.modified_count}")
    print("DONE ✅")

if __name__ == "__main__":
    main()