from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text
import pandas as pd
import pickle
import numpy as np
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Flask app initialization
app = Flask(__name__)
CORS(app, origins=["http://staging.optimaldevelopments.com"])

# MS SQL Database Connection
DATABASE_URL = 'mssql+pyodbc://optimal:optimal123@localhost/EmployeeProductivityDashboard?driver=ODBC+Driver+17+for+SQL+Server'
engine = create_engine(DATABASE_URL)

# Email configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
SENDER_EMAIL = 'sumitmy2018@gmail.com'
SENDER_PASSWORD = 'ozzy vddb rjcv appv'
RECIPIENT_EMAIL = ['sumit@optimalvirtualemployee.com', 'sumitmy2017@gmail.com']

# Load your saved model
model = pickle.load(open('best_resignation_prediction_model_random_forest.pkl', 'rb'))


# Fetch prediction data from database
def fetch_prediction_data_from_db():
    query = """
    SELECT * FROM Prediction
    WHERE [Monthly Average Efficiency] IS NOT NULL AND [Monthly Average Efficiency] != 0
      AND [Benchmark Salary] IS NOT NULL AND [Benchmark Salary] != 0
      AND [Job Satisfaction] IS NOT NULL AND [Job Satisfaction] != 0
    """
    try:
        df = pd.read_sql(query, con=engine)
        df = df.where(pd.notnull(df), None)
        return df.to_dict(orient="records")
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise


# Prediction route
@app.route('/api/prediction', methods=['GET'])
def get_predictions():
    try:
        prediction_data = fetch_prediction_data_from_db()
        return jsonify(prediction_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Prediction model route
@app.route('/prediction/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = [
            [
                employee['Benchmark Salary'],
                employee['Job Satisfaction'],
                employee['Monthly Average Efficiency'],
            ]
            for employee in data['employees']
        ]
        predictions = model.predict_proba(features)[:, 1]
        response = [
            {
                'Employee ID': employee['Employee ID'],
                'Employee Name': employee['Employee Name'],
                'Resignation Probability': round(prob, 2),
            }
            for employee, prob in zip(data['employees'], predictions)
        ]
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 400


# Email sending function
def send_email(subject, body):
    try:
        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = ', '.join(RECIPIENT_EMAIL)
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
            print("Email sent successfully.")
    except Exception as e:
        print(f"Error sending email: {e}")


# Fetch missed logins data
def fetch_missed_logins():
    try:
        query = text("""
            SELECT id, name, work_starts, arrived
            FROM EmployeesData
            WHERE late = 1
        """)
        with engine.connect() as connection:
            result = connection.execute(query)
            rows = result.fetchall()

            if rows:
                missed_logins = []
                for row in rows:
                    work_starts_time = datetime.strptime(row[2], "%H:%M:%S").time()
                    arrived_datetime = datetime.strptime(row[3], "%Y-%m-%d %H:%M:%S")
                    time_diff = arrived_datetime - datetime.combine(arrived_datetime.date(), work_starts_time)
                    time_diff_seconds = time_diff.total_seconds()

                    if time_diff_seconds > 15 * 60:
                        missed_logins.append({
                            "id": row[0],
                            "name": row[1],
                            "work_starts": work_starts_time.strftime("%H:%M:%S"),
                            "arrived": arrived_datetime.time().strftime("%H:%M:%S"),
                            "time_diff": str(timedelta(seconds=time_diff_seconds))
                        })
                missed_logins.sort(key=lambda x: x['time_diff'], reverse=True)
                return missed_logins
            else:
                return []
    except Exception as e:
        return {"error": str(e)}, 500


# Fetch productivity data
def fetch_productivity_data():
    try:
        query = text("""
            SELECT id, name, efficiency, productivity
            FROM EmployeesData
        """)
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
                return []
    except Exception as e:
        return {"error": str(e)}, 500


# Background scheduled task to fetch missed logins and send email
def run_scheduled_task():
    missed_logins = fetch_missed_logins()
    if isinstance(missed_logins, list) and missed_logins:
        email_body = """
            <html>
                <head>
                    <style>
                        table {width: 100%; border-collapse: collapse;}
                        th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
                        th {background-color: #cf2e2e; color: white;}
                    </style>
                </head>
                <body>
                    <h2>Late Login - Desktime</h2>
                    <table>
                        <tr>
                            <th>ID</th><th>Name</th><th>Delayed Arrivals</th><th>Shift Start Time</th><th>Arrival Time</th>
                        </tr>
        """
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
        email_body += "</table></body></html>"
        send_email("Late Employees Report", email_body)


# Background scheduled task to fetch productivity data and send email
def run_productivity_task():
    productivity_data = fetch_productivity_data()
    if isinstance(productivity_data, list) and productivity_data:
        email_body = """
            <html>
                <head>
                    <style>
                        table {width: 100%; border-collapse: collapse;}
                        th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}
                        th {background-color: #cf2e2e; color: white;}
                    </style>
                </head>
                <body>
                    <h2>Employee Productivity Report</h2>
                    <table>
                        <tr>
                            <th>ID</th><th>Name</th><th>Efficiency (Asc)</th><th>Productivity</th>
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
        send_email("Employee Productivity Report", email_body)


# Set up the scheduler
scheduler = BackgroundScheduler()

# Cron triggers for the tasks
trigger_late_logins = CronTrigger(minute=15, hour='9,10,11,12,14,16', day_of_week='0-4')
trigger_productivity = CronTrigger(minute=28, hour='14,15,16,17', day_of_week='0-4')

# Schedule the jobs
scheduler.add_job(run_scheduled_task, trigger_late_logins)
scheduler.add_job(run_productivity_task, trigger_productivity)

# Start the scheduler
scheduler.start()


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
