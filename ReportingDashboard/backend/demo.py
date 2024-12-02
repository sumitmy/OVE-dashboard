from flask import Flask, jsonify, request
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
from sqlalchemy import create_engine, text
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app)

# MS SQL Database Connection
DATABASE_URL = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
engine = create_engine(DATABASE_URL)

# Email configuration
SMTP_SERVER = 'smtp.gmail.com'  # Example for Gmail
SMTP_PORT = 587  # TLS port
SENDER_EMAIL = 'sumitmy2018@gmail.com'  # Replace with your email address
SENDER_PASSWORD = 'ozzy vddb rjcv appv'  # Replace with your email password
RECIPIENT_EMAIL = ['sumit@optimalvirtualemployee.com', 'sumitmy2017@gmail.com']  # Add more recipients as needed


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


def format_time_difference(seconds):
    """Converts the time difference in seconds to HH:MM:SS format."""
    return str(timedelta(seconds=seconds))


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
                    time_diff_formatted = format_time_difference(time_diff_seconds)


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


def run_scheduled_task():
    """This function will be run at the scheduled times."""
    missed_logins = fetch_missed_logins()
    if isinstance(missed_logins, list):
        if missed_logins:
            # Create the email body with HTML table formatting
            email_body = """
                        <html>
                        <head>
                            <style>
                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                }
                                th, td {
                                    border: 1px solid #ddd;
                                    padding: 8px;
                                    text-align: left;
                                }
                                th {
                                    background-color: #cf2e2e;
                                    color: white;
                                }
                                tr{
                                    color: rgb(9, 9, 9);
                                }
                                tr:nth-child(odd) {
                                    background-color: #fdfcfcb7;
                                }
                                tr:nth-child(even) {
                                    background-color: #ffffff;
                                }

                            </style>
                        </head>
                        <body>
                            <h2 style="color:rgb(9, 9, 9);">Late Login - Desktime</h2>
                            <table>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Delayed Arrivals</th>
                                    <th>Work Start Time</th>
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

            # Send the email
            send_email("Late Employees Report", email_body)


# Set up the scheduler to run the task at specific times
scheduler = BackgroundScheduler()

# Define the times to run the job (9:15, 10:15, 11:15, 12:15, 2:15)
trigger = CronTrigger(minute=15, hour='9,10,11,12,14', day_of_week='0-4', month='*', day='*')

# Schedule the job
scheduler.add_job(run_scheduled_task, trigger)

# Start the scheduler
scheduler.start()


if __name__ == '__main__':
    app.run(debug=True)