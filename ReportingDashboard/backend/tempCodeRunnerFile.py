
import pyodbc
import pandas as pd
import requests
import sqlalchemy

# Function to create a SQL Server connection
def create_connection():
    try:
        # Establish connection to the SQL Server database
        connection = pyodbc.connect(
            r'DRIVER={ODBC Driver 17 for SQL Server};'
            r'SERVER=SUMIT\SQLEXPRESS;'
            r'DATABASE=APIDatabase;'
            r'UID=APITestUser;'
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
                r'mssql+pyodbc://APITestUser:1234@SUMIT\SQLEXPRESS/APIDatabase?driver=ODBC+Driver+17+for+SQL+Server'
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
