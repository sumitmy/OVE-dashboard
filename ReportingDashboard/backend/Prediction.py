# import requests
# import pandas as pd
# from sqlalchemy import create_engine
# from datetime import datetime, timedelta
#
# # API Key and URL
# API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a"
# url = f'https://desktime.com/api/v2/json/employees?apiKey={API_KEY}'
#
# # Set headers
# headers = {"Content-Type": "application/json", "Accept-Encoding": "deflate"}
#
# # Function to fetch data for the last 30 days and calculate average efficiency
# def fetch_monthly_efficiency_data():
#     employee_data = []
#
#     # Get today's date and the date 30 days ago
#     today = datetime.today()
#     start_date = today - timedelta(days=30)
#
#     # Format dates to string (e.g., '2024-10-11')
#     start_date_str = start_date.strftime('%Y-%m-%d')
#     today_str = today.strftime('%Y-%m-%d')
#
#     # Dictionary to store employee efficiency over the past 30 days
#     efficiency_data = {}
#
#     # Loop over the past 30 days and fetch data for each day
#     for single_date in pd.date_range(start=start_date_str, end=today_str):
#         date_str = single_date.strftime('%Y-%m-%d')
#
#         # Define the endpoint for DeskTime API to fetch employees' data for a particular day
#         response = requests.get(f"{url}&date={date_str}", headers=headers)
#
#         if response.status_code == 200:
#             data = response.json()
#             employees_data = data.get('employees', {})
#
#             for date_key, employees in employees_data.items():
#                 for emp_id, emp_info in employees.items():
#                     emp_name = emp_info.get("name")
#                     group = emp_info.get("group", "Not Assigned")  # Default to "Not Assigned" if no group found
#                     efficiency = emp_info.get("efficiency", 0)  # Default to 0 if no efficiency found
#
#                     # Track efficiency data for each employee
#                     if emp_id not in efficiency_data:
#                         efficiency_data[emp_id] = {
#                             "Employee Name": emp_name,
#                             "Group": group,
#                             "Efficiency Values": []
#                         }
#                     efficiency_data[emp_id]["Efficiency Values"].append(efficiency)
#         else:
#             print(f"Failed to fetch data for {date_str}. Status code: {response.status_code}")
#
#     # Calculate monthly average efficiency for each employee
#     for emp_id, emp_info in efficiency_data.items():
#         avg_efficiency = round(sum(emp_info["Efficiency Values"]) / len(emp_info["Efficiency Values"]),
#                                2)  # Average efficiency
#         employee_data.append({
#             "Employee ID": emp_id,
#             "Employee Name": emp_info["Employee Name"],
#             "Group": emp_info["Group"],
#             "Monthly Average Efficiency": avg_efficiency
#         })
#
#     return employee_data
#
# # Function to read data from CSV
# def read_additional_data_from_csv(file_path):
#     return pd.read_csv(file_path)
#
# # Fetch the data for the past 30 days
# employee_data = fetch_monthly_efficiency_data()
#
# # Convert the list of employee data into a pandas DataFrame
# df_api = pd.DataFrame(employee_data)
#
# # Read the additional data (like benchmark salary, job satisfaction) from the CSV file
# csv_file_path = 'employee_dashboard.csv'  # Update with your file path
# df_excel = read_additional_data_from_csv(csv_file_path)
#
# # Print column names of the CSV file to understand the structure
# print("CSV Column Names: ", df_excel.columns)
#
# # Merge the API data with the CSV data on Employee ID (not 'id')
# df = pd.merge(df_api, df_excel[['Employee ID', 'Benchmark Salary', 'Job Satisfaction']], how='left', on='Employee ID')
#
# # Print merged DataFrame column names
# print("Merged DataFrame Columns: ", df.columns)
#
# # Now select the required columns: Employee ID, Employee Name, Group, Monthly Average Efficiency, Benchmark Salary, Job Satisfaction
# df_prediction = df[['Employee ID', 'Employee Name', 'Group', 'Monthly Average Efficiency', 'Benchmark Salary', 'Job Satisfaction']]
#
# # Create the database connection
# database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
# engine = create_engine(database_url)
#
# # Insert data into the Prediction table
# table_name = 'Prediction'
# df_prediction.to_sql(table_name, con=engine, index=False, if_exists='replace')  # Use 'replace' or 'append' as needed
# print("Data successfully inserted into Prediction table.")
# from flask import Flask, jsonify
# from flask_cors import CORS
# from sqlalchemy import create_engine
# import pandas as pd
#
# # Create a Flask application instance
# app = Flask(__name__)
#
# # Enable CORS for all routes (allows cross-origin requests)
# CORS(app)
#
# # Database connection URL
# database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
# engine = create_engine(database_url)
#
# # Function to fetch data from the database
# def fetch_prediction_data_from_db():
#     query = "SELECT * FROM Prediction"
#     # Fetch data from the database
#     df = pd.read_sql(query, con=engine)
#     # Convert the DataFrame to a dictionary and return as JSON
#     return df.to_dict(orient="records")
#
# # Create an API route to get prediction data
# @app.route('/prediction', methods=['GET'])
# def get_predictions():
#     try:
#         # Fetch data from the database
#         prediction_data = fetch_prediction_data_from_db()
#         # Return data as JSON response
#         return jsonify(prediction_data), 200
#     except Exception as e:
#         # Handle errors and send an appropriate response
#         return jsonify({"error": str(e)}), 500
#
# # Run the Flask application
# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)  # Run on 0.0.0.0 to be accessible from external networks
#
# from flask import Flask, jsonify
# from flask_cors import CORS
# from sqlalchemy import create_engine
# import pandas as pd
#
# app = Flask(__name__)
# CORS(app)
# # CORS(app, origins=["http://localhost:3000"])  # Assuming React runs on localhost:3000
# CORS(app, origins=["http://staging.optimaldevelopments.com:80"])
#
#
# # Allow the React app to make requests from staging
# # CORS setup
# # CORS(app, origins=["http://localhost:3000", "http://staging.optimaldevelopments.com"])
#
#
# database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
# engine = create_engine(database_url)
#
# def fetch_prediction_data_from_db():
#     query = "SELECT * FROM Prediction"
#     try:
#         df = pd.read_sql(query, con=engine)
#         # print(df.head())  # Log sample data for debugging
#         df = df.where(pd.notnull(df), None)  # Replace NaN with None
#         print(df)
#         return df.to_dict(orient="records")
#     except Exception as e:
#         print(f"Error fetching data: {e}")
#         raise
#
# # @app.route('/prediction', methods=['GET'])
# @app.route('/api/prediction', methods=['GET'])
# def get_predictions():
#     try:
#         prediction_data = fetch_prediction_data_from_db()  # Ensure this function works
#         return jsonify(prediction_data), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#
# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port= 5000)
#
#
# from flask import Flask, jsonify
# from flask_cors import CORS
# from sqlalchemy import create_engine
# import pandas as pd
#
# app = Flask(__name__)
# CORS(app, origins=["http://staging.optimaldevelopments.com"])
#
# database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
# engine = create_engine(database_url)
#
# def fetch_prediction_data_from_db():
#     query = "SELECT * FROM Prediction"
#     try:
#         df = pd.read_sql(query, con=engine)
#         df = df.where(pd.notnull(df), None)  # Replace NaN with None
#         print("df: ",df.to_dict(orient="records"))
#         return df.to_dict(orient="records")
#     except Exception as e:
#         print(f"Error fetching data: {e}")
#         raise
#
# @app.route('/api/prediction', methods=['GET'])
# def get_predictions():
#     try:
#         prediction_data = fetch_prediction_data_from_db()
#         return jsonify(prediction_data), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
#
# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["http://staging.optimaldevelopments.com"])

database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
engine = create_engine(database_url)

def fetch_prediction_data_from_db():
    # Updated SQL query to filter out records with NULL or 0 in the specified columns
    query = """
    SELECT * FROM Prediction
    WHERE [Monthly Average Efficiency] IS NOT NULL AND [Monthly Average Efficiency] != 0
      AND [Benchmark Salary] IS NOT NULL AND [Benchmark Salary] != 0
      AND [Job Satisfaction] IS NOT NULL AND [Job Satisfaction] != 0
    """
    try:
        df = pd.read_sql(query, con=engine)
        df = df.where(pd.notnull(df), None)  # Replace NaN with None

        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise

@app.route('/api/prediction', methods=['GET'])
def get_predictions():
    try:
        prediction_data = fetch_prediction_data_from_db()
        return jsonify(prediction_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

