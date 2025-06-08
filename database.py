from pymongo import MongoClient
from datetime import datetime
MONGO_URI = "mongodb+srv://singhabhishak2005:gungame@cluster0.acyr06s.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["snake_water_gun_db"]
collection = db["game_results"]

def save_result(name, user_choice, computer_choice, result):
    collection.insert_one({
        "name": name,
        "user_choice": user_choice,
        "computer_choice": computer_choice,
        "result": result,  # this should be "user", "draw", or "computer"
        "timestamp": datetime.now()
    })
