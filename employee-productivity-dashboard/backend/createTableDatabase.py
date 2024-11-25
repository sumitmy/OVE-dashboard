
import pyodbc

# Database connection details
server = 'localhost'  # e.g., 'localhost' or '127.0.0.1'
database = 'EmployeeProductivityDashboard'
username = 'optimal'
password = 'optimal123'

try:
    # Creating connection
    connection = pyodbc.connect(
        f"DRIVER={{ODBC Driver 17 for SQL Server}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password}"
    )
    print("Connection to database established successfully!")

    # Creating a cursor object
    cursor = connection.cursor()

    # SQL query to create a new table
    create_table_query = """CREATE TABLE EmployeesData (
        id INT,                                 
        name VARCHAR(255),                      
        email VARCHAR(255),                     
        groupId INT,                            
        [group] VARCHAR(255),                   
        profileUrl TEXT,                        
        isOnline BIT,                           
        arrived DATETIME,                       
        [left] DATETIME,                          
        late BIT,                              
        onlineTime INT,                         
        offlineTime INT,                       
        desktimeTime INT,                       
        atWorkTime INT,                         
        afterWorkTime INT,                      
        beforeWorkTime INT,                     
        productiveTime INT,                     
        productivity DECIMAL(5, 2),             
        efficiency DECIMAL(5, 2),               
        work_starts TIME,                       
        work_ends TIME,                         
        activeProject_id INT,                   
        activeProject_title VARCHAR(255),      
        activeTask_id INT,                      
        activeTask_title VARCHAR(255),         
        activeTask_duration INT,               
        notes TEXT,                             
        record_date DATE,                       
        PRIMARY KEY (id, record_date)
    );"""
    
    # Execute the SQL query
    cursor.execute(create_table_query)
    print("Table 'EmployeesData' created successfully!")

    # Committing the changes
    connection.commit()

    # Closing the connection
    connection.close()
    print("Connection closed.")

except Exception as e:
    print(f"Error: {e}")
