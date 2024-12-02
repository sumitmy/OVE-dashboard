
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy import create_engine
import requests
import pandas as pd
from flask import Blueprint, jsonify, request

email_blueprint = Blueprint('email', __name__)
# app = Flask(__name__)

current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current system time

# MS SQL Database Connection
DATABASE_URL = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
engine = create_engine(DATABASE_URL)

# Email configuration
SMTP_SERVER = 'smtp.gmail.com'  # Example for Gmail
SMTP_PORT = 587  # TLS port
SENDER_EMAIL = 'sumitmy2018@gmail.com'  # Replace with your email address
SENDER_PASSWORD = 'ozzy vddb rjcv appv'  # Replace with your email password
RECIPIENT_EMAIL = ['sumit@optimalvirtualemployee.com', 'sumitmy2017@gmail.com', 'samta@optimalvirtualemployee.com']  # Add more recipients as needed

current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
def update_database_from_api():
    """
    Fetch employee data from DeskTime API, process it, and update the database.
    """
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


def send_email(subject, body):
    """Send email with given subject and body in HTML format."""
    try:
        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = ', '.join(RECIPIENT_EMAIL)  # Join the list of recipients into a comma-separated string
        msg['Subject'] = subject

        # Attach the body with the email
        msg.attach(MIMEText(body, 'html'))  # Specify 'html' for HTML content

        # Establish connection with the SMTP server and send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()  # Secure the connection
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
            print("Email sent successfully.")

    except Exception as e:
        print(f"Error sending email: {e}")


def fetch_missed_logins():
    """
    Fetch employees who are late (i.e., have logged in after their scheduled shift start time),
    and calculate the time difference between arrival and shift start.
    """
    try:
        # SQL query to fetch late employees
        query = text("""
            SELECT
                id,
                name,
                work_starts,
                arrived
            FROM EmployeesData
            WHERE late = 1
        """)

        # Execute the query and fetch the results
        with engine.connect() as connection:
            result = connection.execute(query)
            rows = result.fetchall()

            if rows:
                missed_logins = []
                for row in rows:
                    work_starts = row[2]
                    arrived = row[3]

                    # Parse work_starts as a time object
                    work_starts_time = datetime.strptime(work_starts, "%H:%M:%S").time()

                    # Parse arrived as a datetime object and extract the time
                    arrived_datetime = datetime.strptime(arrived, "%Y-%m-%d %H:%M:%S")
                    arrived_time = arrived_datetime.time()

                    # Calculate the time difference in seconds
                    work_starts_datetime = datetime.combine(arrived_datetime.date(), work_starts_time)
                    time_diff = arrived_datetime - work_starts_datetime
                    time_diff_seconds = time_diff.total_seconds()  # Get the difference in seconds

                    # Convert time difference into HH:MM:SS format
                    time_diff_formatted = str(timedelta(seconds=time_diff_seconds))

                    # Only include employees with a time difference greater than 15 minutes
                    if time_diff_seconds > 15 * 60:  # 15 minutes in seconds
                        missed_logins.append({
                            "id": row[0],
                            "name": row[1],
                            "work_starts": work_starts_time.strftime("%H:%M:%S"),
                            "arrived": arrived_time.strftime("%H:%M:%S"),
                            "time_diff": time_diff_formatted
                        })

                # Sort employees by time_diff in descending order
                missed_logins.sort(key=lambda x: x['time_diff'], reverse=True)

                return missed_logins
            else:
                print("No late employees found.")
                return []

    except Exception as e:
        return {"error": str(e)}, 500


def fetch_productivity_data():
    """
    Fetch productivity data for all employees including their name, ID, and efficiency.
    """
    try:
        # SQL query to fetch employee productivity data
        query = text("""
            SELECT
                id,
                name,
                efficiency,
                productivity
            FROM EmployeesData
        """)

        # Execute the query and fetch the results
        with engine.connect() as connection:
            result = connection.execute(query)
            rows = result.fetchall()

            if rows:
                productivity_data = []
                for row in rows:
                    productivity_data.append({
                        "id": row[0],
                        "name": row[1],
                        "efficiency": row[2],
                        "productivity": row[3]
                    })

                productivity_data.sort(key=lambda x: x['efficiency'], reverse=False)
                return productivity_data
            else:
                print("No productivity data found.")
                return []

    except Exception as e:
        return {"error": str(e)}, 500

def run_scheduled_task():
    """This function will be run at the scheduled times for late login report."""
    update_database_from_api()
    missed_logins = fetch_missed_logins()

    if isinstance(missed_logins, list):
        if missed_logins:
            # Create the email body with HTML table formatting for late login report
            email_body = f"""
                        <html>
                        <head>
                            <style>
                                table {{
                                    width: 100%;
                                    border-collapse: collapse;
                                }}
                                th, td {{
                                    border: 1px solid #ddd;
                                    padding: 8px;
                                    text-align: left;
                                }}
                                th {{
                                    background-color: #cf2e2e;
                                    color: white;
                                }}
                                tr {{
                                    color: rgb(9, 9, 9);
                                }}
                                tr:nth-child(odd) {{
                                    background-color: #fdfcfcb7;
                                }}
                                tr:nth-child(even) {{
                                    background-color: #ffffff;
                                }}
                            </style>
                        </head>
                        <body>
                            <h2 style="color:rgb(9, 9, 9);">Late Login - Desktime ({current_time})</h2>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Delayed Arrivals</th>
                                    <th>Shift Start Time</th>
                                    <th>Arrival Time</th>
                                </tr>
                        """
            # Add table rows with data for each employee
            for emp in missed_logins:
                email_body += f"""
                                <tr>
                                    <td>{emp['id']}</td>
                                    <td>{emp['name']}</td>
                                    <td>{emp['time_diff']}</td>
                                    <td>{emp['work_starts']}</td>
                                    <td>{emp['arrived']}</td>
                                </tr>
                            """

            email_body += """
                            </table>
                        </body>
                        </html>
                        """

            # Send the email for late login report
            send_email("Late Employees Report", email_body)

from datetime import datetime

def run_productivity_task():
    """This function will fetch productivity data and perform actions at scheduled times."""
    update_database_from_api()
    productivity_data = fetch_productivity_data()
    # current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # Current system time

    if isinstance(productivity_data, list) and productivity_data:
        # Create the email body with current time in the heading
        email_body = f"""
                    <html>
                    <head>
                        <style>
                            table {{
                             width: 100%; 
                             border-collapse: collapse; 
                            }}
                            th, td {{ 
                            border: 1px solid #ddd; 
                            padding: 8px; text-align: left; 
                            }}
                            th {{ 
                            background-color: #cf2e2e; 
                            color: white; 
                            }}
                            tr:nth-child(even) {{ 
                            background-color: #f2f2f2; 
                            }}
                        </style>
                    </head>
                    <body>
                        <h2>Employee Productivity Report ({current_time})</h2>
                        <table>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Efficiency (Asc)</th>
                                <th>Productivity</th>
                            </tr>
            """
        for emp in productivity_data:
            email_body += f"""
                            <tr>
                                <td>{emp['id']}</td>
                                <td>{emp['name']}</td>
                                <td>{emp['efficiency']}%</td>
                                <td>{emp['productivity']}%</td>
                            </tr>
                        """
        email_body += "</table></body></html>"

        # Send email
        send_email("Employee Productivity Report", email_body)
    else:
        print("No productivity data to process.")


# Set up the scheduler to run the tasks at specific times
scheduler = BackgroundScheduler()

# Cron trigger for late login task (9:15, 10:15, 11:15, 12:15, 2:15)
trigger_late_logins = CronTrigger(minute=15, hour='9,10,11,12,14,16', day_of_week='0-4', month='*', day='*')


trigger_productivity = CronTrigger(minute=15, hour='14,17', day_of_week='0-4', month='*', day='*')

# Schedule the jobs
scheduler.add_job(run_scheduled_task, trigger_late_logins)
scheduler.add_job(run_productivity_task, trigger_productivity)


# Start the scheduler
scheduler.start()




