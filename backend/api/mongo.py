import os
from pymongo import MongoClient

_client = None

def get_db():
    global _client

    # support both env naming styles
    uri = (
        os.getenv("MONGO_URI")
        or os.getenv("MONGODB_URI")
        or "mongodb://localhost:27017"
    )
    db_name = (
        os.getenv("DB_NAME")
        or os.getenv("MONGODB_DB")
        or "ace_dating_db"
    )

    # DEBUG prints (remove later)
    print("Mongo URI:", uri)
    print("Mongo DB:", db_name)

    if _client is None:
        _client = MongoClient(uri, serverSelectionTimeoutMS=5000)

    return _client[db_name]