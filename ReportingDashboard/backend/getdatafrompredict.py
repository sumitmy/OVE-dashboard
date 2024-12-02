from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/prediction/predict', methods=['POST'])
def receive_data():
    data = request.json['data']
    print('Received data:', data)
    return jsonify({'message': 'Data received successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
