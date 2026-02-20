import os
from pymongo import MongoClient

def get_db():
    uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB", "acedating")

    client = MongoClient(uri)
    return client[db_name]
