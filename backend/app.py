from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Permite requisições do seu app mobile

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "message": "Backend do NETGI funcionando!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) # O host '0.0.0.0' é essencial para o emulador/celular acessar