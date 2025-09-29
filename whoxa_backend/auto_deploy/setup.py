from fastapi import FastAPI, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import json
import os
import subprocess
import socketio
import asyncio
import logging
import httpx
from fastapi.middleware.cors import CORSMiddleware
import socket
from getmac import get_mac_address


# Add CORS middleware

# Set up logging
logging.basicConfig(
    filename='./setup.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
)

# Initialize FastAPI and Socket.IO
sio = socketio.AsyncServer(async_mode='asgi')
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify specific origins instead of "*"
    allow_credentials=True,
    allow_methods=["*"],  # This allows all HTTP methods, including OPTIONS
    allow_headers=["*"],  # This allows all headers
)
# Paths for saving the JSON data and log files
json_save_path = os.path.join(os.getcwd(), "deployment_data.json")
log_directory = os.path.join(os.getcwd(), 'temp')
log_file_path = os.path.join(log_directory, "script_execution.log")
log_reading_errors_path = os.path.join(log_directory, "log_reading_errors.log")

# Ensure the temp directory exists
os.makedirs(log_directory, exist_ok=True)

# Serve static files (e.g., HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")
import uuid

# Function to get the server's IP address
def get_server_ip():
    # Get the hostname of the machine
    hostname = socket.gethostname()
    # Get the IP address associated with the hostname
    ip_address = socket.gethostbyname(hostname)
    return ip_address

SUDO_PASSWORD = "1142"
PROJECT_LOCATION = "/var/www/whoxa"
# PROJECT_LOCATION = "/mnt/Omkar/aaa"
DB_IP = get_server_ip()


def is_mysql_installed() -> bool:
    """Check if MySQL is installed by checking the version."""
    try:
        result = subprocess.run(["mysql", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.returncode == 0  # Return True if the command succeeded
    except Exception as e:
        logging.error(f"Error checking MySQL installation: {str(e)}")
        return False


def get_server_ip():
    """Retrieve the server's IP address."""
    try:
        result = subprocess.run("hostname -I", shell=True, check=True, capture_output=True, text=True)
        ip = result.stdout.strip().split()[0]  # Extract the first IP address
        logging.info(f"Server IP: {ip}")
        return ip
    except subprocess.CalledProcessError as e:
        logging.error(f"Error retrieving IP address: {e}")
        return "127.0.0.1"


def check_mysql_root_password(root_password: str) -> bool:
    """Check if the provided MySQL root password is correct."""
    try:
        # Attempt to connect to MySQL using the provided root password
        # result = subprocess.run(
        #     ["mysql", "-u", "root", "-p" + root_password, "-e", "SHOW SCHEMAS;"],
        #     stdout=subprocess.PIPE,
        #     stderr=subprocess.PIPE
        # )
        result = subprocess.run(
            ["mysql", "-u", "root", "-e", f"SHOW SCHEMAS;"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={"MYSQL_PWD": root_password}  # Set the password in the environment
        )
        print(result)
        return result.returncode == 0  # Return True if the command succeeded
    except Exception as e:
        logging.error(f"Error checking MySQL root password: {str(e)}")
        return False


def database_exists(db_name: str, root_password: str) -> bool:
    """Check if the specified database exists."""
    try:
        # Using the MYSQL_PWD environment variable for better security
        result = subprocess.run(
            ["mysql", "-u", "root", "-e", f"SHOW DATABASES LIKE '{db_name}';"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env={"MYSQL_PWD": root_password}  # Set the password in the environment
        )
        # Decode the output and error messages
        stderr_output = result.stderr.decode().strip()
        # If the return code is not 0, it means MySQL could not execute the command
        if result.returncode != 0:
            logging.error(f"Error checking if database exists: {stderr_output}")
            # Check for access denied error
            # if "Access denied" in stderr_output:
            #     return False  # Access denied, return False
            return True  # Other errors also return False

        # Decode the output
        output = result.stdout.decode().strip()

        # Split by lines to avoid false positives, and strip any whitespace
        existing_databases = [line.strip() for line in output.splitlines()]
        print(existing_databases)

        # Return True if the database exists, False otherwise
        if db_name in existing_databases : # Exact match checking
            return True

    except Exception as e:
        logging.error(f"Unexpected error while checking database existence: {str(e)}")
        return False
def user_exists(username: str, root_password: str) -> bool:
    """Check if the specified MySQL user exists."""
    try:
        # Attempt to connect to MySQL and check for the user
        result = subprocess.run(
            ["mysql", "-u", "root", "-p" + root_password, "-e",
             f"SELECT User FROM mysql.user WHERE User = '{username}';"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        # Check the output to determine if the user exists
        output = result.stdout.decode().strip()
        existing_user = [line.strip() for line in output.splitlines()]
        print(existing_user)
        if username in existing_user:  # Return False if the user exists
            return False
        else:
            return True
    except Exception as e:
        logging.error(f"Error checking if user exists: {str(e)}")
        return True


def validate_user_password(username: str, password: str) -> bool:
    """Validate the specified user's password."""
    try:
        # Attempt to connect to MySQL using the provided username and password
        result = subprocess.run(
            ["mysql", "-u", username, "-p" + password, "-e", "SELECT 1;"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        return result.returncode !=0  # Return True if the command succeeded
    except Exception as e:
        logging.error(f"Error validating user password: {str(e)}")
        return True


def get_mac_address_of_server():
    # Get the MAC address of the server
    mac_address = get_mac_address()
    return  mac_address

def get_dynamic_ip():
    try:
        # Create a socket connection to an external server (Google's public DNS)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Connecting to an external server
        ip_address = s.getsockname()[0]  # Get the IP address
    finally:
        s.close()  # Close the socket connection
    return ip_address

@app.get("/")
async def read_index():
    return JSONResponse(content={"message": "Static files served. Access the HTML at /static/index.html"})


# Add this new endpoint in your FastAPI application
@app.post("/validate_purchase")
async def validate_purchase(envato_username: str = Form(...), purchase_code: str = Form(...)):
    print("ssss")
    validation_url = "http://62.72.36.245:1142/validate"  # Update with your server URL
    verification_url = "http://62.72.36.245:1142/verify_new"
    # validation_url = "http://192.168.0.27:1142/validate"  # Update with your server URL
    # verification_url = "http://192.168.0.27:1142/verify_new"
    # Prepare the data to send
    data = {
        "username": envato_username,
        "purchase_code": purchase_code
    }

    # Get server IP and MAC address dynamically
    server_ip = get_server_ip()  # Fetch server IP
    mac_address = get_mac_address_of_server()  # Fetch server MAC address

    # Prepare headers to include server IP and MAC address
    headers = {
        "X-Device-IP": server_ip,  # Pass server's IP address
        "X-MAC-Address": mac_address  # Pass server's MAC address
    }

    try:
        if os.path.exists("validatedToken.txt"):
            with open("validatedToken.txt", "r") as token_file:
                token = token_file.read().strip()
                data = {
                    "token": token,
                    "server_ip": server_ip,
                    "mac_address": mac_address
                }
                async with httpx.AsyncClient() as client:
                    response = await client.post(verification_url, json=data, headers=headers)
                    print(response.json)
                    if response.status_code == 200 and response.json().get("success"):
                        return {"status": "true", "message": "Token is valid."}
                    else:
                        return {"status": "false", "message": "Token validation failed."}

        async with httpx.AsyncClient() as client:
            # Send a POST request to the external server with headers
            response = await client.post(validation_url, json=data, headers=headers)
            print(response )
            result = response.json()  # Assuming the response is JSON
            if response.status_code == 200:
                print(result.get("status"))
                # Assuming the external server responds with a JSON object containing success status
                if result.get("status") == "success":
                    # Store the token in validatedToken.txt
                    token = result.get("token")
                    if token:
                        with open("validatedToken.txt", "w") as token_file:
                            token_file.write(token)
                    return {"status": True, "message": "Purchase validated successfully!"}
                elif result.get("status") == "used":
                    return {"status": False, "message": result.get("message")}
                elif result.get("status") == "UserUsed":
                    return {"status": False, "message": result.get("message")}
                else:
                    return {"status": False, "message": result.get("message")}
            if result.get("message") == 'Invalid purchase code or failed validation with Envato.':
                return {"status": False, "message": "InValid Purchase code"}

            # If the response status code is not 200, handle the error
            logging.error(f"Validation server responded with status code: {response.status_code}")
            return {"status": False, "message": "Failed to validate purchase. Please try again."}

    except httpx.HTTPStatusError as e:
        logging.error(f"HTTP error occurred during purchase validation: {str(e)}")
        raise HTTPException(status_code=e.response.status_code, detail="Failed to validate purchase.")
    except Exception as e:
        logging.error(f"Error during purchase validation: {str(e)}")
        raise HTTPException(status_code=404, detail="Invalid Purchase Code")


@app.post("/validate_mysql_root_password")
async def validate_mysql(root_password: str = Form(...)):
    print(root_password , 'Root Pass')
    """API endpoint to validate MySQL installation and root password."""
    if not is_mysql_installed():
        return {"status": True, "message": "MySQL is not installed on this server."}
    print("I am Here")
    if check_mysql_root_password(root_password):
        return {"status": True, "message": "MySQL root password is valid."}
    else:
        return {"status": False, "message": "Invalid MySQL root password."}


@app.post("/check_database")
async def check_database(db_name: str = Form(...), root_password: str = Form(...)):
    print(db_name," ",root_password , 'Db With root')
    """API endpoint to check if a specific database exists."""
    if not is_mysql_installed():
        return {"status": True, "message": "MySQL is not installed on this server."}

    if database_exists(db_name, root_password):
        return {"status": False, "message": f"The database '{db_name}' exists."}
    else:
        return {"status": True, "message": f"The database '{db_name}' does not exist."}


@app.post("/check_database_user")
async def check_user(username: str = Form(...), root_password: str = Form(...)):
    print(username," ",root_password , 'User Name With root')

    """API endpoint to check if a specific MySQL user exists."""
    if not is_mysql_installed():
        return {"status": True, "message": "MySQL is not installed on this server."}

    if not user_exists(username, root_password):
        return {"status": True, "message": f"The user '{username}' exists."}
    else:
        return {"status": True, "message": f"The user '{username}' does not exist."}


@app.post("/validate_user_password")
async def validate_user_password_api(username: str = Form(...), password: str = Form(...) ,root_password: str = Form(...)):
    print(username," ",password , 'User Name With Password')

    """API endpoint to validate a MySQL user's password."""
    if not is_mysql_installed():
        return {"status": True, "message": "MySQL is not installed on this server."}
    if not check_mysql_root_password(root_password):
        return {"status": False, "message": "The root password is invalid."}
    if user_exists(username, root_password):
        return {"status": True, "message": "The password is valid."}
    else:
        if validate_user_password(username, password):
            return {"status": False, "message": "Invalid password."}
        else:
            return {"status": True, "message": "The password is valid."}


@sio.event
async def connect(sid, environ):
    logging.info(f"Client {sid} connected")
    await sio.emit('message', {'data': 'Connected successfully!'})


@sio.event
async def disconnect(sid):
    logging.info(f"Client {sid} disconnected")


async def read_log_file():
    """Continuously read the log file and broadcast updates to clients."""
    last_size = 0
    last_log_data = ""  # Variable to store the last emitted log data
    while True:
        try:
            # Open the log file for reading
            with open(log_file_path, "r") as log_file:
                log_file.seek(last_size)  # Move the cursor to the last known size
                new_data = log_file.read()  # Read new data

                # Log the newly read data
                if new_data:
                    logging.info(f"Read new data: {new_data.strip()}")

                # Emit new log data if it is different from the last emitted
                if new_data and new_data.strip() != last_log_data:
                    last_log_data = new_data.strip()  # Update last emitted data
                    logging.info(f"New log data: {last_log_data}")
                    await sio.emit('log_update', {'log': last_log_data})  # Emit new log data to clients
                    last_size = log_file.tell()  # Update the last known size

        except Exception as e:
            error_message = f"Error reading log file: {e}\n"
            logging.error(error_message)
            with open(log_reading_errors_path, "a") as error_log_file:
                error_log_file.write(error_message)

        await asyncio.sleep(2)  # Sleep for 2 seconds before checking again


@app.post("/submit")
async def handle_form(
        background_tasks: BackgroundTasks,
        root_password: str = Form(...),
        db_name: str = Form(...),
        username: str = Form(...),
        password: str = Form(...),
        TWILIO_AUTH_TOKEN: str = Form(...),
        TWILIO_FROM_NUMBER: str = Form(...),
        TWILIO_ACCOUNT_SID: str = Form(...),

):
    form_data = {
        "sudoPassword": SUDO_PASSWORD,
        "projectLocation": PROJECT_LOCATION,
        "rootMysqlPass": root_password,
        "DBname": db_name,
        "DBIP": DB_IP,
        "DBuser": username,
        "DBpassword": password,
        "TWILIO_AUTH_TOKEN":TWILIO_AUTH_TOKEN,
        "TWILIO_FROM_NUMBER":TWILIO_FROM_NUMBER,
        "TWILIO_ACCOUNT_SID":TWILIO_ACCOUNT_SID,
    }
    print( "sudoPassword",SUDO_PASSWORD,
        "projectLocation",PROJECT_LOCATION,
        "rootMysqlPass", root_password,
        "DBname", db_name,
        "DBIP", DB_IP,
        "DBuser", username,
        "DBpassword", password)
    try:
        # check root Passwprd
        # if not check_mysql_root_password(root_password):
        #    return {"status": "false", "message": "Invalid root Password"}


        # Save form data to JSON
        logging.info("Saving form data to JSON...")
        os.makedirs(os.path.dirname(json_save_path), exist_ok=True)
        with open(json_save_path, "w") as json_file:
            json.dump(form_data, json_file, indent=4)

        logging.info("Form data saved successfully.")

        # Start the log reading in the background
        background_tasks.add_task(read_log_file)
        await sio.emit('start_logging', {'message': 'Started logging process...'})
        AdminIP = "http://"+ get_server_ip() + ":3000/admin"
        clientIP = "http://"+ get_server_ip() + ":3000/"

        return {"status": True, "message": "Data saved successfully!" , 'AdminLink':AdminIP , 'UserLink':clientIP}
    except Exception as e:
        logging.error(f"Failed to save data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save data: {str(e)}")

# Wrap FastAPI app with Socket.IO's ASGI app
app = socketio.ASGIApp(sio, app)

if __name__ == "__main__":
    import uvicorn

    server_ip = get_server_ip()
    print("http://"+ get_server_ip() + ":3000" )
    logging.info(f"Starting server at http://{server_ip}:8000")
    uvicorn.run(app, host=server_ip, port=8000)
    print(get_dynamic_ip())
