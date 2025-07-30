from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

devices_db = []

@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(devices_db)

@app.route('/api/devices', methods=['POST'])
def add_device():
    data = request.get_json()
    devices_db.append(data)
    return jsonify({"message": "Device added successfully"}), 201

@app.route('/api/devices/detect', methods=['GET'])
def detect_devices():
    detected_devices = [
        {
            "mac": f"AA:BB:CC:DD:{i:02X}",
            "type": random.choice(["Phone", "Laptop", "Tablet"]),
            "signal_strength": random.randint(-90, -30),
            "x": random.uniform(1.0, 10.0),
            "y": random.uniform(1.0, 10.0)
        }
        for i in range(3)
    ]
    return jsonify(detected_devices)

if __name__ == '__main__':
    app.run(debug=True)