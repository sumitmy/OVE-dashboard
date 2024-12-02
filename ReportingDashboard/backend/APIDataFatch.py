
# create table in database


# import requests
# import pandas as pd
# from sqlalchemy import create_engine, exc
# from datetime import datetime
#
# # API Key and URL
# API_KEY = "b30f8d97bca4f11b2310dcbc1c241e1a"
# url = f'https://desktime.com/api/v2/json/employees?apiKey={API_KEY}'
#
# # Set headers
# headers = {"Content-Type": "application/json", "Accept-Encoding": "deflate"}
#
# # Create a connection to the database
# database_url = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
# engine = create_engine(database_url)
# table_name = 'EmployeesData'
#
# try:
#     # Send request to DeskTime API
#     response = requests.get(url, headers=headers)
#
#     if response.status_code != 200:
#         raise ValueError(f"Failed to fetch data: {response.status_code}")
#     print("Data successfully fetched from the API.")
#
#     # Process response data
#     responseData = response.json()
#     employees_data = responseData.get('employees', {})
#
#     # Flatten nested data
#     employee_list = []
#     for date_key, employees in employees_data.items():
#         for emp_id, emp_data in employees.items():
#             emp_data['date'] = date_key
#             employee_list.append(emp_data)
#
#     # Normalize to DataFrame
#     df = pd.json_normalize(employee_list)
#
#     # Add a timestamp column to each row
#     df['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
#
#     # Handle missing (NaN) values by replacing them with None or a default value
#     df = df.where(pd.notnull(df), None)  # Replace NaN values with None
#
#     # Ensure correct column names for your database
#     required_columns = [
#         'id', 'name', 'email', 'groupId', 'group', 'profileUrl', 'isOnline',
#         'arrived', 'left', 'late', 'onlineTime', 'offlineTime', 'desktimeTime',
#         'atWorkTime', 'afterWorkTime', 'beforeWorkTime', 'productiveTime',
#         'productivity', 'efficiency', 'work_starts', 'work_ends',
#         'activeProject.project_id', 'activeProject.project_title', 'activeProject.task_id',
#         'activeProject.task_title', 'activeProject.duration', 'notes', 'date', 'timestamp'
#     ]
#
#     # Filter DataFrame to keep only the required columns
#     df = df[required_columns]
#
#     # Insert or Update the data
#     for _, row in df.iterrows():
#         with engine.connect() as connection:
#             # Check if data for the same id and date already exists
#             query = f"""
#                 SELECT COUNT(*)
#                 FROM EmployeesData
#                 WHERE id = {row['id']} AND date = '{row['date']}'
#             """
#             result = connection.execute(query).fetchone()
#
#             if result[0] > 0:
#                 # Record exists, so update it
#                 update_query = f"""
#                     UPDATE EmployeesData
#                     SET name = ?,
#                         email = ?,
#                         groupId = ?,
#                         group = ?,
#                         profileUrl = ?,
#                         isOnline = ?,
#                         arrived = ?,
#                         left = ?,
#                         late = ?,
#                         onlineTime = ?,
#                         offlineTime = ?,
#                         desktimeTime = ?,
#                         atWorkTime = ?,
#                         afterWorkTime = ?,
#                         beforeWorkTime = ?,
#                         productiveTime = ?,
#                         productivity = ?,
#                         efficiency = ?,
#                         work_starts = ?,
#                         work_ends = ?,
#                         activeProject_project_id = ?,
#                         activeProject_project_title = ?,
#                         activeProject_task_id = ?,
#                         activeProject_task_title = ?,
#                         activeProject_duration = ?,
#                         notes = ?,
#                         timestamp = ?
#                     WHERE id = ? AND date = ?
#                 """
#                 parameters = (
#                     row['name'], row['email'], row['groupId'], row['group'], row['profileUrl'],
#                     row['isOnline'], row['arrived'], row['left'], row['late'], row['onlineTime'],
#                     row['offlineTime'], row['desktimeTime'], row['atWorkTime'], row['afterWorkTime'],
#                     row['beforeWorkTime'], row['productiveTime'], row['productivity'], row['efficiency'],
#                     row['work_starts'], row['work_ends'], row['activeProject.project_id'],
#                     row['activeProject.project_title'], row['activeProject.task_id'],
#                     row['activeProject.task_title'], row['activeProject.duration'], row['notes'],
#                     row['timestamp'], row['id'], row['date']
#                 )
#                 connection.execute(update_query, parameters)
#                 print(f"Updated record for Employee ID {row['id']} on {row['date']}.")
#             else:
#                 # No existing record, insert a new row
#                 row.to_sql(table_name, con=engine, index=False, if_exists='append')
#                 print(f"Inserted new record for Employee ID {row['id']} on {row['date']}.")
#
#     print("Data successfully inserted/updated in the database.")
#
# except requests.exceptions.RequestException as e:
#     print(f"Error with API request: {e}")
# except exc.SQLAlchemyError as e:
#     print(f"SQLAlchemy error: {e}")
# except Exception as e:
#     print(f"Error while inserting/updating data into the database: {e}")


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
        'activeProject.task_title', 'activeProject.duration', 'notes', 'date',
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

