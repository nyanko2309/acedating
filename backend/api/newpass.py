# reset_mongo_password.py
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from django.conf import settings
from django.contrib.auth.hashers import make_password

# ---- Django hasher config (so make_password works) ----
if not settings.configured:
    settings.configure(
        PASSWORD_HASHERS=["django.contrib.auth.hashers.PBKDF2PasswordHasher"]
    )

MONGO_URI = "mongodb+srv://yanazlatin:Yana2309@profiles.jrwyitf.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "ace_dating_db"
COLL_NAME = "users"

USER_ID = "69a5bce176af6919267837ce"
NEW_PASSWORD = "Aa123456!"

def main():
    client = MongoClient(MONGO_URI)
    users = client[DB_NAME][COLL_NAME]

    new_hash = make_password(NEW_PASSWORD)

    res = users.update_one(
        {"_id": ObjectId(USER_ID)},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.utcnow(), "session_token": None}},
    )

    if res.matched_count == 0:
        print("No user found with that _id.")
        return

    print("✅ Password updated.")
    print("New password_hash:", new_hash)

if __name__ == "__main__":
    main()