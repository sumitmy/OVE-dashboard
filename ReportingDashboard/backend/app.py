# from flask import Flask, request, jsonify
# import pickle
# import numpy as np
#
# app = Flask(__name__)
#
# # Load your saved model
# model = pickle.load(open('best_resignation_prediction_model_random_forest.pkl', 'rb'))
#
#
# @app.route('/prediction/predict', methods=['POST'])
# def predict():
#     try:
#         # Get data from request
#         data = request.get_json()
#
#         # Extract features from the input
#         features = [
#             [
#                 employee['Benchmark Salary'],
#                 employee['Job Satisfaction'],
#                 employee['Monthly Average Efficiency'],
#             ]
#             for employee in data['employees']
#         ]
#
#         # Make predictions
#         predictions = model.predict_proba(features)[:, 1]  # Assuming binary classification
#
#         # Create response
#         response = [
#             {
#                 'Employee ID': employee['Employee ID'],
#                 'Employee Name': employee['Employee Name'],
#                 'Resignation Probability': round(prob, 2),
#             }
#             for employee, prob in zip(data['employees'], predictions)
#         ]
#
#         return jsonify(response)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 400
#
#
# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask
from flask_cors import CORS
from api_routes import api_blueprint
from email_routes import email_blueprint

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=["http://staging.optimaldevelopments.com"])

# Register blueprints
app.register_blueprint(api_blueprint)
app.register_blueprint(email_blueprint)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
