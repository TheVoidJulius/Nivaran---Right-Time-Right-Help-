import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def load_data(category):
    path = os.path.join(DATA_DIR, f"{category}.json")
    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)

def analyze_problem(text):
    text = text.lower()

    if any(word in text for word in ["crop", "farmer", "rain", "field"]):
        category = "agriculture"

    elif any(word in text for word in ["loan", "money", "bank", "debt"]):
        category = "finance"

    elif any(word in text for word in ["hospital", "doctor", "medicine", "health"]):
        category = "health"

    elif any(word in text for word in ["school", "college", "fees", "education"]):
        category = "education"

    else:
        return {
            "category": "Unknown",
            "message": "Please describe your problem with more details."
        }

    data = load_data(category)

    return {
        "category": category.capitalize(),
        "schemes": data.get("schemes", []),
        "steps": data.get("steps", []),
        "contact": data.get("contact", "N/A")
    }
