#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define relative paths for the status file and log file
STATUS_FILE="$SCRIPT_DIR/temp/script_status.txt"
LOG_FILE="$SCRIPT_DIR/temp/script_execution.log"

# Ensure the temp directory exists
mkdir -p "$SCRIPT_DIR/temp"
#!/bin/bash

function check_apache_install() {
    if ! command -v apache2ctl &> /dev/null; then
        echo "Apache2 is not installed. Installing now..."
        # Assuming you're using a Debian/Ubuntu-based system
        sudo apt update
        sudo apt install apache2 -y
    fi

    # Check for the specific folder
    folder_path="/var/www/whoxa"
#    folder_path="/mnt/Omkar/aaa"
    if [ ! -d "$folder_path" ]; then
        echo "Creating folder: $folder_path"
        sudo mkdir -p "$folder_path"
    fi
}
# Call the function
check_apache_install
sudo kill -9 $(sudo lsof -t -i :3000)
sudo kill -9 $(sudo lsof -t -i :8000)
sudo ufw allow 8000
sudo ufw allow 3000

# Function to update the status and log
update_status() {
    echo "$1" | tee -a "$LOG_FILE" > "$STATUS_FILE"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run a command with sudo password
run_with_sudo() {
    echo "$SUDO_PASSWORD" | sudo -S "$@"
}

# Get sudo password from JSON file
get_sudo_password() {
    python3 -c "
import json
json_file_path = 'deployment_data.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)
    print(data.get('sudoPassword', ''))  # Use get to avoid KeyError
"
}

# Run the FastAPI setup.py to create the JSON configuration
run_setup_py() {
    if [ -f "setup.py" ]; then
        update_status "Running FastAPI setup.py to collect setup details..."
        nohup python3 setup.py >setup.log 2>&1 &
        SETUP_PID=$!
        SERVER_IP=$(hostname -I | awk '{print $1}')
        update_status "FastAPI server is running at: http://$SERVER_IP:8000/static/index.html"
        echo "FastAPI server is running at: http://$SERVER_IP:8000/static/index.html"

        # Wait for the JSON file
        while [ ! -f "deployment_data.json" ]; do
            sleep 2
        done

        update_status "deployment_data.json file has been created."
    else
        update_status "setup.py not found."
        exit 1
    fi
}

# Start logging to the log file
echo "Script execution started at $(date)" > "$LOG_FILE"

# Update the system
update_status "Updating system packages..."
run_with_sudo apt update

# Ensure Python is installed
if command_exists python3; then
    update_status "Python3 is already installed."
else
    update_status "Python3 is not installed. Installing Python3..."
    run_with_sudo apt install -y python3
fi

# Ensure PIP is installed
if command_exists pip3; then
    update_status "PIP3 is already installed."
else
    update_status "PIP3 is not installed. Installing PIP3..."
    run_with_sudo apt install -y python3-pip
fi

# Ensure python3-venv is installed
if command_exists python3-venv; then
    update_status "python3-venv is already installed."
else
    update_status "python3-venv is not installed. Installing python3-venv..."
    run_with_sudo apt install -y python3-venv
fi

# Create a virtual environment
# Create a virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    update_status "Creating a virtual environment..."
    python3 -m venv venv || { update_status "Failed to create virtual environment."; exit 1; }
else
    update_status "Virtual environment already exists."
fi

# Activate the virtual environment
source venv/bin/activate

# Install dependencies using pip from the virtual environment
if [ -f "requirements.txt" ]; then
    update_status "Installing dependencies from requirements.txt..."
    ./venv/bin/pip install -r requirements.txt || { update_status "Failed to install requirements."; exit 1; }
else
    update_status "requirements.txt not found."
fi

# Ensure python-multipart is installed
update_status "Ensuring python-multipart is installed..."
pip install python-multipart || { update_status "Failed to install python-multipart."; exit 1; }

# Run FastAPI setup.py to collect setup details
run_setup_py

# Get sudo password from the JSON file
SUDO_PASSWORD=$(get_sudo_password)

if [[ -z "$SUDO_PASSWORD" ]]; then
    update_status "Error: Sudo password is empty. Check your JSON file."
    exit 1
fi

# Function to run scripts without interrupting the FastAPI server
run_script() {
    local script="$1"
    if [ -f "$script" ]; then
        update_status "Running the Python script: $script..."
        python3 "$script" || { update_status "Failed to run $script."; exit 1; }
    else
        update_status "Python script '$script' not found."
    fi
}

# Run automation scripts
declare -a scripts=("unzip_automation.py" "Node_Automate.py" "mysqlSetup.py" "configCreator.py" "envCreator.py")

for script in "${scripts[@]}"; do
    run_script "$script"
done

# Run automate-deploy.py if it exists
if [ -f "autmate-deply.py" ]; then
    run_script "autmate-deply.py"
else
    update_status "Python script 'autmate-deply.py' not found."
fi

# Finalize by stopping the FastAPI server only if it was started
if [ -n "$SETUP_PID" ]; then
    update_status "Stopping FastAPI server..."
    sleep 3600  # Wait for 1 hour (3600 seconds)
    kill "$SETUP_PID"
fi


# Final status
update_status "Execution completed successfully!"

