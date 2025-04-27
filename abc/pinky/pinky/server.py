from flask import Flask, request, jsonify, render_template
import json
import os
from datetime import datetime

app = Flask(__name__)
DATA_FILE = 'transactions.json'

# Load data from JSON
def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump([], f)
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

# Save data to JSON
def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/transactions', methods=['GET', 'POST'])
def transactions_route():
    if request.method == 'GET':
        return jsonify(load_data())
    elif request.method == 'POST':
        transactions = load_data()
        new_transaction = request.json
        transactions.append(new_transaction)
        save_data(transactions)
        return jsonify({'message': 'Transaction added successfully'}), 201

if __name__ == "__main__":
    app.run(debug=True)
