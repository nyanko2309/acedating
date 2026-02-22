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

def now_utc():
    return datetime.now(timezone.utc)

def tag():
    return now_utc().strftime("%Y%m%d_%H%M%S")

def oid(x):
    if isinstance(x, ObjectId):
        return x
    if isinstance(x, str) and ObjectId.is_valid(x.strip()):
        return ObjectId(x.strip())
    return None

def main():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users = db["users"]
    profiles = db["profiles"]

    print("=== counts ===")
    print("users:", users.count_documents({}))
    print("profiles:", profiles.count_documents({}))

    # 0) Backups (safe)
    t = tag()
    users_backup = f"users_backup_{t}"
    profiles_backup = f"profiles_backup_{t}"

    if DRY_RUN:
        print(f"[DRY_RUN] Would backup users -> {users_backup}")
        print(f"[DRY_RUN] Would backup profiles -> {profiles_backup}")
    else:
        print(f"Backing up users -> {users_backup}")
        db["users"].aggregate([{"$match": {}}, {"$out": users_backup}])
        print(f"Backing up profiles -> {profiles_backup}")
        db["profiles"].aggregate([{"$match": {}}, {"$out": profiles_backup}])

    # 1) Merge profile fields into users
    updated = 0
    missing_user = 0
    missing_user_id = 0

    for p in profiles.find({}, {"user_id": 1, **{f: 1 for f in PROFILE_FIELDS}}):
        uid = p.get("user_id")
        uid = oid(uid)
        if not uid:
            missing_user_id += 1
            continue

        set_doc = {}
        for f in PROFILE_FIELDS:
            if f in p:
                set_doc[f] = p.get(f)

        # touch updated_at
        set_doc["updated_at"] = now_utc()

        if DRY_RUN:
            # just check match
            exists = users.count_documents({"_id": uid}, limit=1) > 0
            if not exists:
                missing_user += 1
            else:
                updated += 1
        else:
            res = users.update_one({"_id": uid}, {"$set": set_doc})
            if res.matched_count == 0:
                missing_user += 1
            else:
                updated += 1

    print("=== merge results ===")
    print("profiles merged into users:", updated)
    print("profiles with missing users:", missing_user)
    print("profiles with invalid/missing user_id:", missing_user_id)

    # 2) Ensure liked exists for all users
    if DRY_RUN:
        count_missing_liked = users.count_documents({"liked": {"$exists": False}})
        print(f"[DRY_RUN] users missing liked field: {count_missing_liked}")
    else:
        res = users.update_many({"liked": {"$exists": False}}, {"$set": {"liked": []}})
        print("users updated to include liked: [] where missing:", res.modified_count)

    # 3) Drop profiles if requested
    if DROP_PROFILES_AFTER:
        if DRY_RUN:
            print("[DRY_RUN] Would DROP profiles collection")
        else:
            print("Dropping profiles collection...")
            profiles.drop()
            print("profiles dropped ✅")
    else:
        print("profiles NOT dropped (DROP_PROFILES_AFTER=False)")

    print("DONE ✅")

if __name__ == "__main__":
    main()