from pymongo import MongoClient, UpdateOne
from pymongo.errors import ServerSelectionTimeoutError
from datetime import datetime

MONGO_URI = "mongodb+srv://yanazlatin:Yana2309@profiles.jrwyitf.mongodb.net/"
DB_NAME = "ace_dating_db"
COLL_NAME = "users"

PREFERENCE_CANON = {"Woman", "Man", "Non-binary", "Other"}


def now_utc():
    return datetime.utcnow()


def to_preference_list(raw):
    """
    Converts a legacy scalar preference value into the new array format.
    "" / "any" / "Any" / None -> [] (means "visible to everyone")
    A valid canonical string -> [that string]
    Anything already a list -> cleaned/deduped as-is
    Anything unrecognized -> [] (safer than leaving garbage)
    """
    if raw is None:
        return []
    if isinstance(raw, list):
        return [v for v in raw if isinstance(v, str) and v.strip() in PREFERENCE_CANON]
    if isinstance(raw, str):
        val = raw.strip()
        if not val or val.lower() == "any":
            return []
        if val in PREFERENCE_CANON:
            return [val]
        return []  # unrecognized value — treat as "anyone" rather than guess
    return []


def main():
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000,
    )

    try:
        client.admin.command("ping")
    except ServerSelectionTimeoutError as e:
        print("❌ Could not connect to MongoDB Atlas within 10s.")
        print(f"   Details: {e}")
        return

    db = client[DB_NAME]
    users = db[COLL_NAME]

    scanned = 0
    ops = []
    already_arrays = 0

    for doc in users.find({}, {"preference": 1, "username": 1}):
        scanned += 1
        raw = doc.get("preference")

        if isinstance(raw, list):
            already_arrays += 1
            continue  # already migrated, skip

        new_pref = to_preference_list(raw)
        ops.append(UpdateOne(
            {"_id": doc["_id"]},
            {"$set": {"preference": new_pref, "updated_at": now_utc()}}
        ))

    updated = 0
    if ops:
        result = users.bulk_write(ops)
        updated = result.modified_count

    print(f"Done. Scanned: {scanned}, Already arrays (skipped): {already_arrays}, Updated: {updated}")


if __name__ == "__main__":
    main()