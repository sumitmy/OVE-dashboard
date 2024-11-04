import requests
import pandas as pd
from datetime import datetime, timedelta
 
# Your DeskTime API key
api_key = 'b30f8d97bca4f11b2310dcbc1c241e1a'
 
# Define the endpoint for DeskTime API to fetch all employees' data
url = f"https://desktime.com/api/v2/json/employees?apiKey={api_key}"
 
# Send the request to the DeskTime API
response = requests.get(url)
 
# Check if the API key is working and if the request was successful
if response.status_code == 200:
    print("API key is valid.")
   
    # Load the JSON data
    data = response.json()
   
    # Extract the current date
    current_date = datetime.now().strftime("%Y-%m-%d")
   
    # Prepare a list to store employee data for the table
    employee_data = []
   
    # Loop through each employee's data
    for date, employees in data['employees'].items():
        for emp_id, emp_info in employees.items():
            # Convert productiveTime from seconds to hh:mm:ss format
            productive_time_seconds = emp_info.get("productiveTime", 0)
            productive_time_formatted = str(timedelta(seconds=productive_time_seconds))
           
            # Append relevant information to the list
            employee_data.append({
                "Employee ID": emp_info.get("id"),
                "Date": date,
                "Employee Name": emp_info.get("name"),
                "Productive Time": productive_time_formatted                
            })
   
    # Create a pandas DataFrame from the list
    df = pd.DataFrame(employee_data)
   
    # Display the DataFrame as a table
    print(df)
else:
    print(f"API key is invalid or something went wrong. Status code: {response.status_code}")
    print("Error message:", response.text)