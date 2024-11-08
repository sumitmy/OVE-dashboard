# import mysql.connector
# from mysql.connector import Error
# import pandas as pd
# import requests
# import sqlalchemy
#
#
# # Function to create a MySQL connection
# def create_connection():
#     try:
#         # Establish connection to the MySQL database
#         connection = mysql.connector.connect(
#             host='localhost',  # Database host
#             user='root',  # Username
#             password='1234',  # Password
#             database='employeeProductivityDashboard'  # Database name
#         )
#
#         if connection.is_connected():
#             print("Connection established successfully!")
#         return connection
#
#     except Error as e:
#         print(f"Error: {e}")
#         return None
#
#
# # Function to fetch data from DeskTime API
# def fetch_data_from_api():
#     API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a"
#
#     # API URL with correct string interpolation
#     url = f'https://desktime.com/api/v2/json/employees?apiKey={API_KEY}'
#
#     # Set headers
#     header = {"content-type": "application/json", "Accept-Encoding": "deflate"}
#
#     # Send GET request
#     response = requests.get(url, headers=header)
#     responseData = response.json()
#
#     # Check if the request was successful
#     if response.status_code == 200:
#         print("Request was successful!")
#     else:
#         print(f"Request failed with status code {response.status_code}")
#         return None
#
#     # Check if 'employees' key exists and normalize it
#     if 'employees' in responseData:
#         df = pd.json_normalize(responseData['employees'])
#         return df
#     else:
#         print("'employees' key not found in the response.")
#         return None
#
#
# # Main function to run the program
# def main():
#     # Create MySQL connection
#     connection = create_connection()
#     if not connection:
#         return
#
#     # Fetch data from API
#     df = fetch_data_from_api()
#     if df is not None:
#         # MySQL database connection string using SQLAlchemy
#         engine = sqlalchemy.create_engine(
#             'mysql+mysqlconnector://root:1234@localhost/employeeProductivityDashboard'
#             # Replace 'root' with your MySQL username, '1234' with your MySQL password,
#             # and 'employeeProductivityDashboard' with your database name
#         )
#
#         # Save DataFrame to MySQL database
#         try:
#             df.to_sql(name='ApiData', con=engine, index=False, if_exists='fail')
#             print("Data successfully saved to the database!")
#         except Exception as e:
#             print(f"Error saving data to MySQL: {e}")
#
#     # Close the connection
#     if connection.is_connected():
#         connection.close()
#         print("Connection closed.")
#
#
# # Run the main function
# if __name__ == "__main__":
#     main()

import pyodbc
import pandas as pd
import requests
import sqlalchemy

# Function to create a SQL Server connection
def create_connection():
    try:
        # Establish connection to the SQL Server database
        connection = pyodbc.connect(
            r'DRIVER={ODBC Driver 17 for SQL Server};'  # Ensure you have the correct ODBC driver
            r'SERVER=SUMIT\SQLEXPRESS;'  # SQL Server instance name (named instance)
            r'DATABASE=employeeProductivityDashboard;'  # Database name
            r'UID=sa;'  # Username for SQL Server Authentication
            r'PWD=1234;'  # Password for SQL Server Authentication
        )

        if connection:
            print("Connection established successfully!")
        return connection

    except pyodbc.Error as e:
        # Catch and print detailed error message for SQL Server connection issues
        print(f"Error connecting to SQL Server: {e}")
        return None


# Function to fetch data from DeskTime API
def fetch_data_from_api():
    API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a"
    url = f'https://desktime.com/api/v2/json/employees?apiKey={API_KEY}'

    # Set headers
    headers = {"Content-Type": "application/json", "Accept-Encoding": "deflate"}

    # Send GET request
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print("API request was successful!")
        responseData = response.json()

        # Check if 'employees' key exists and normalize it
        if 'employees' in responseData:
            df = pd.json_normalize(responseData['employees'])
            return df
        else:
            print("'employees' key not found in the response.")
            return None
    else:
        print(f"API request failed with status code {response.status_code}")
        return None


# Main function to run the program
def main():
    # Create SQL Server connection
    connection = create_connection()
    if not connection:
        return

    # Fetch data from API
    df = fetch_data_from_api()
    if df is not None:
        # SQLAlchemy connection string for SQL Server
        try:
            engine = sqlalchemy.create_engine(
                r'mssql+pyodbc://sa:1234@SUMIT\SQLEXPRESS/employeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
            )
            # Save DataFrame to SQL Server database
            df.to_sql(name='ApiData', con=engine, index=False, if_exists='replace')  # Change 'replace' to 'append' or 'fail' as needed
            print("Data successfully saved to the database!")
        except Exception as e:
            print(f"Error creating SQLAlchemy engine or saving data: {e}")

    # Close the connection
    if connection:
        connection.close()
        print("Connection closed.")


# Run the main function
if __name__ == "__main__":
    main()
