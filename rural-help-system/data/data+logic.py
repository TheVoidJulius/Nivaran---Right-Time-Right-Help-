import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_json(filename):
    path = os.path.join(BASE_DIR, "data", filename)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


agriculture_data = load_json("agriculture.json")
finance_data = load_json("finance.json")
health_data = load_json("health.json")
education_data = load_json("education.json")



