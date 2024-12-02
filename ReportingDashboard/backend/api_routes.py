
from flask import Blueprint, jsonify, request
import pandas as pd
from sqlalchemy import create_engine
import joblib

# Initialize blueprint
api_blueprint = Blueprint('api', __name__)

# Database connection
DATABASE_URL = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
engine = create_engine(DATABASE_URL)

# Load model
model_file_name = 'best_resignation_prediction_model_random_forest_2.pkl'
best_model = joblib.load(model_file_name)


# Fetch prediction data from database
def fetch_prediction_data_from_db():
    query = """
    SELECT * FROM Prediction
    WHERE [Monthly Average Efficiency] IS NOT NULL AND [Monthly Average Efficiency] != 0
      AND [Benchmark Salary] IS NOT NULL AND [Benchmark Salary] != 0
      AND [Job Satisfaction] IS NOT NULL AND [Job Satisfaction] != 0
    """
    df = pd.read_sql(query, con=engine)
    df = df.where(pd.notnull(df), None)
    return df.to_dict(orient="records")


# Route to get prediction data
@api_blueprint.route('/api/prediction', methods=['GET'])
def get_predictions():
    try:
        prediction_data = fetch_prediction_data_from_db()
        return jsonify(prediction_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to make predictions
@api_blueprint.route('/api/prediction/predict', methods=['POST'])
def predict():
    try:
        # Parse the employee data from the request
        data = request.get_json()
        features = [
            [

                employee['Job Satisfaction'],
                employee['Benchmark Salary'],
                employee['Monthly Average Efficiency'],
            ]
            for employee in data['employees']
        ]

        # Predict using the loaded model
        predictions = best_model.predict_proba(features)[:, 1]*100

        # Prepare the response data
        response = [
            {
                'Employee ID': employee['Employee ID'],
                'Employee Name': employee['Employee Name'],
                'Resignation Probability': round(prob, 2),
            }
            for employee, prob in zip(data['employees'], predictions)
        ]
        return jsonify(response)  # Send predictions back to the frontend
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Route to update predictions
@api_blueprint.route('/api/prediction/update', methods=['PUT'])
def update_predictions():
    try:
        data = request.json.get('updatedData', [])
        with engine.connect() as connection:
            for item in data:
                employee_id = item['Employee ID']
                benchmark_salary = item['editedSalary']
                job_satisfaction = item['editedSatisfaction']
                monthly_efficiency = item['editedEfficiency']

                # Update the database using raw SQL
                update_query = """
                UPDATE Prediction
                SET [Benchmark Salary] = :benchmark_salary,
                    [Job Satisfaction] = :job_satisfaction,
                    [Monthly Average Efficiency] = :monthly_efficiency
                WHERE [Employee ID] = :employee_id
                """
                connection.execute(
                    update_query,
                    {
                        'benchmark_salary': benchmark_salary,
                        'job_satisfaction': job_satisfaction,
                        'monthly_efficiency': monthly_efficiency,
                        'employee_id': employee_id,
                    }
                )
        return jsonify({'message': 'Data updated successfully'}), 200
    except Exception as e:
        print(f"Error updating data: {e}")
        return jsonify({'error': 'Failed to update data'}), 500
