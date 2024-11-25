import requests
import pandas as pd
from sqlalchemy import create_engine

# API Key and URL
API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a"
url = f'https://desktime.com/api/v2/json/employees?apiKey={API_KEY}'

# Set headers
headers = {"Content-Type": "application/json", "Accept-Encoding": "deflate"}

try:
    # Send request to DeskTime API
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise ValueError(f"Failed to fetch data: {response.status_code}")
    print("Data successfully fetched from the API.")

    # Process response data
    responseData = response.json()
    employees_data = responseData.get('employees', {})


    # Flatten nested data
    employee_list = []
    for date_key, employees in employees_data.items():
        for emp_id, emp_data in employees.items():
            emp_data['date'] = date_key
            employee_list.append(emp_data)

    # Normalize to DataFrame
    df = pd.json_normalize(employee_list)

    # Ensure correct column names for your database
    required_columns = [
        'id', 'name', 'email', 'groupId', 'group', 'profileUrl', 'isOnline',
        'arrived', 'left', 'late', 'onlineTime', 'offlineTime', 'desktimeTime',
        'atWorkTime', 'afterWorkTime', 'beforeWorkTime', 'productiveTime',
        'productivity', 'efficiency', 'work_starts', 'work_ends',
        'activeProject.project_id', 'activeProject.project_title', 'activeProject.task_id',
        'activeProject.task_title', 'activeProject.duration', 'notes', 'date'
    ]

    # Ensure DataFrame has only the required columns
    df = df[required_columns]

    # Create a connection
    database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
    engine = create_engine(database_url)

    # Create a new table (if not exists)
    table_name = 'EmployeesData'

    # Insert data into the database table
    df.to_sql(table_name, con=engine, index=False, if_exists='replace')  # Replace or append if needed
    print("Data successfully inserted into the database.")

except requests.exceptions.RequestException as e:
    print(f"Error with API request: {e}")
except Exception as e:
    print(f"Error while inserting data into database: {e}")


