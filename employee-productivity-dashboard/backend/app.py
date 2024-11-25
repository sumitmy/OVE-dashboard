from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Load the model
model = joblib.load('resignation_prediction_model.pkl')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/predict', methods=['POST'])
def predict():
    # Get the employee data from the request
    data = request.json  # This should be a list of employee records

    # Convert the data to a DataFrame
    df = pd.DataFrame(data)

    # Predict for all employees
    predictions = model.predict(df[['Job_Satisfaction', 'Benchmark_Salary_%', 'Performance_Rating']])
    probabilities = model.predict_proba(df[['Job_Satisfaction', 'Benchmark_Salary_%', 'Performance_Rating']])[:, 1]

    # Prepare the result with employee ID, prediction, and probability
    results = [
        {'Employee_ID': emp['Employee_ID'], 'Resignation_Risk': int(pred), 'Resignation_Probability': round(prob, 2)}
        for emp, pred, prob in zip(data, predictions, probabilities)
    ]

    # Return results as JSON
    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True)
