from flask import Flask, request, jsonify
from flask_cors import CORS
from game_logic import get_computer_choice, decide_winner
from database import save_result, collection
from collections import Counter

from datetime import datetime  # needed for formatting timestamps

app = Flask(__name__)
CORS(app)

@app.route('/play', methods=['POST'])
def play_game():
    data = request.json
    user_choice = data.get('choice')
    name = data.get('name', 'Anonymous')

    if user_choice not in ['snake', 'water', 'gun']:
        return jsonify({'error': 'Invalid choice'}), 400

    computer_choice = get_computer_choice()
    result = decide_winner(user_choice, computer_choice)

    save_result(name, user_choice, computer_choice, result)

    return jsonify({
        'name': name,
        'user': user_choice,
        'computer': computer_choice,
        'result': result
    })

@app.route("/leaderboard")
def leaderboard():
    results = collection.find()
    wins = [r["name"] for r in results if r["result"] == "user"]
    top_players = Counter(wins).most_common(10)
    return jsonify([{"name": name, "wins": count} for name, count in top_players])

@app.route("/clear", methods=["DELETE"])
def clear_history():
    result = collection.delete_many({})
    return jsonify({"message": f"Deleted {result.deleted_count} entries."})

# ✅ Step 2: Game History per Player
@app.route("/history/<name>", methods=["GET"])
def get_history(name):
    records = list(collection.find({"name": name}))
    history_data = [
        {
            "user_choice": r["user_choice"],
            "computer_choice": r["computer_choice"],
            "result": r["result"],
            "timestamp": r["timestamp"].strftime("%Y-%m-%d %H:%M:%S")
        }
        for r in records
    ]
    return jsonify(history_data)

if __name__ == '__main__':
    app.run(debug=True)
