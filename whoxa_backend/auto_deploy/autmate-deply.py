import os
import subprocess
import re
import json
import time


def run_command(command, cwd=None, use_sudo=False, sudo_password=None):
    """Run a shell command, optionally with sudo and check for errors."""
    try:
        if use_sudo and sudo_password:
            full_command = f"echo {sudo_password} | sudo -S {command}"
            print(f"Running with sudo: {full_command}")
            subprocess.run(full_command, shell=True, check=True, cwd=cwd)
        else:
            print(f"Running: {command}")
            subprocess.run(command, shell=True, check=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"Error executing: {command}. Error: {e}")
        exit(1)


def get_pm2_startup_command(sudo_password):
    """Capture the pm2 startup output and extract the command."""
    try:
        # Use os.system to run the command and capture output in a file
        output_file = "pm2_startup_output.txt"
        command = "pm2 startup systemd > " + output_file + " 2>&1"
        os.system(command)  # Run the command and redirect output to a file

        # Read the output from the file
        with open(output_file, 'r') as f:
            output = f.read()
            print(f"PM2 startup output: {output}")

        # Extract the command using regex
        match = re.search(r'pm2 startup systemd .*', output)
        if match:
            startup_cmd = match.group(0).strip()
            print(f"Extracted PM2 startup command: {startup_cmd}")
            return startup_cmd
        else:
            print("Unable to find the PM2 startup command in the output.")
            exit(1)

    except Exception as e:
        print(f"Error running 'pm2 startup'. Error: {e}")
        exit(1)


def read_project_dir_and_sudo_password_from_json(json_file_path):
    """Read the project directory path and sudo password from a JSON file."""
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
            project_dir = data.get("projectLocation")
            sudo_password = data.get("sudoPassword")  # Get sudo password from JSON
            if not project_dir or not sudo_password:
                raise ValueError("Project directory or sudo password not found in JSON file.")
            return project_dir, sudo_password
    except Exception as e:
        print(f"Error reading JSON file '{json_file_path}': {e}")
        exit(1)


def main():
    # Define paths
    json_file_path = os.path.join(os.path.dirname(__file__),
                                  "deployment_data.json")  # JSON file path in the same folder

    # Read project directory and sudo password from JSON
    project_dir, sudo_password = read_project_dir_and_sudo_password_from_json(json_file_path)

    # Update the system packages
    run_command("apt update", use_sudo=True, sudo_password=sudo_password)

    # Install pm2 globally with sudo
    print("Installing PM2 globally...")
    run_command("npm install -g pm2 && npm install peer -g && npm install sequelize && npm install sequelize-cli", use_sudo=True, sudo_password=sudo_password)

    # Run npm install in the specific project directory
    run_command("npm install", cwd=project_dir)
    time.sleep(5)

    # Start pm2 in the project directory
    run_command(f'cd "{project_dir}" && pm2 start index.js && pm2 start "peerjs --port 4001" --name "peerjs-server"')
    time.sleep(5)

    # Save pm2 process list
    print("Saving the PM2 process list...")
    run_command("pm2 save ")
    time.sleep(5)

    # Get the dynamically generated pm2 startup command from the output
    # startup_command = get_pm2_startup_command(sudo_password)
    time.sleep(5)

    # Run the dynamically captured startup command with sudo
    # run_command(startup_command, use_sudo=True, sudo_password=sudo_password)

    print("Automation completed successfully.")


if __name__ == "__main__":
    main()
