import os
from datetime import datetime
from pymongo import MongoClient, ASCENDING
from bson import ObjectId

# Uses your existing env var style (recommended)
# Put these in backend/.env (or Render env):
# MONGO_URI=...
# DB_NAME=ace_dating_db

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI") or "mongodb://localhost:27017"
DB_NAME = os.getenv("DB_NAME") or os.getenv("MONGODB_DB") or "ace_dating_db"

COLLECTION_NAME = "letters"

def main():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    existing = COLLECTION_NAME in db.list_collection_names()
    if not existing:
        # Optional: create with JSON schema validation (recommended)
        db.create_collection(
            COLLECTION_NAME,
            validator={
                "$jsonSchema": {
                    "bsonType": "object",
                    "required": ["sender_id", "receiver_id", "letter", "created_at"],
                    "properties": {
                        "sender_id": {"bsonType": "objectId"},
                        "receiver_id": {"bsonType": "objectId"},
                        "letter": {"bsonType": "string", "minLength": 1, "maxLength": 2000},
                        "created_at": {"bsonType": "date"},
                        "read_at": {"bsonType": ["date", "null"]},
                    },
                }
            },
        )
        print(f"✅ Created collection '{COLLECTION_NAME}' with schema validation")
    else:
        print(f"ℹ️ Collection '{COLLECTION_NAME}' already exists")

    letters = db[COLLECTION_NAME]

    # Indexes
    letters.create_index([("receiver_id", ASCENDING), ("created_at", ASCENDING)])
    letters.create_index([("sender_id", ASCENDING), ("created_at", ASCENDING)])
    letters.create_index([("sender_id", ASCENDING), ("receiver_id", ASCENDING), ("created_at", ASCENDING)])

    print("✅ Indexes created/ensured")

    # Optional: insert a tiny test doc (comment out if you don't want)
    # letters.insert_one({
    #     "sender_id": ObjectId("6998c559437c78d944abe0d4"),
    #     "receiver_id": ObjectId("6998b84261fac6dc483c64e2"),
    #     "letter": "Hi! I liked your profile 🙂",
    #     "created_at": datetime.utcnow(),
    #     "read_at": None,
    # })

    client.close()

if __name__ == "__main__":
    main()