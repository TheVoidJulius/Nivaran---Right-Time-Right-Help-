from flask import Flask, request, jsonify
from logic import analyze_problem
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    problem_text = data.get("problem", "")

    result = analyze_problem(problem_text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
