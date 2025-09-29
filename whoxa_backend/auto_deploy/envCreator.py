import json
import shutil
import os
import socket
import shutil

def copy_config_file(src_file, dest_folder):
    # Copy the source file to the destination folder
    shutil.copy(src_file, dest_folder)
    print(f"File {src_file} copied to {dest_folder}")

# Load deployment_data.json
def load_deployment_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def get_dynamic_ip():
    try:
        # Create a socket connection to an external server (Google's public DNS)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))  # Connecting to an external server
        ip_address = s.getsockname()[0]  # Get the IP address
    finally:
        s.close()  # Close the socket connection
    return ip_address
# Generate config.json based on deployment_data
def create_env_file(deployment_data, output_file):
    env_data = {
        "baseUrl": f'"http://{get_dynamic_ip()}:3000/"',  # This will remain unchanged
        "DB_USER": f'"{deployment_data["DBuser"]}"',
        "TWILIO_FROM_NUMBER": f'"{deployment_data["TWILIO_FROM_NUMBER"]}"',
        "TWILIO_AUTH_TOKEN": f'"{deployment_data["TWILIO_AUTH_TOKEN"]}"',
        "TWILIO_ACCOUNT_SID": f'"{deployment_data["TWILIO_ACCOUNT_SID"]}"',
        "JWT_SECRET_KEY": '"ijfdikj3848%$%$%#$#$#$$%^TFDdfeR4348$#$#$73736@883f%747&*8$#$#((((()()(3344*(*^8$#$#&*#%#$%RFSDFdfw#$3438fdD#4udeudnej"',
    }

    # Save the environment data to .env file
    with open(output_file, 'w') as file:
        for key, value in env_data.items():
            file.write(f"{key}={value}\n")

# Move config.json to a specific folder inside the projectLocation
def move_config_file(output_file, project_location):
    # Construct the full target directory path
    target_directory = os.path.join(project_location)

    # Ensure target directory exists
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)

    # Construct the target path for config.json
    target_path = os.path.join(target_directory, os.path.basename(output_file))

    # Check if the file already exists, and delete it if so
    if os.path.exists(target_path):
        os.remove(target_path)
        print(f"Existing config file at {target_path} has been removed.")

    # Move the file
    shutil.move(output_file, target_path)
    print(f"Config file moved to {target_path}")
# Main execution
if __name__ == "__main__":
    # Path to deployment_data.json
    deployment_file = 'deployment_data.json'
    # Temporary path to save config.json
    output_file = '.env'

    # Load the deployment data
    deployment_data = load_deployment_data(deployment_file)

    # Create the config.json
    create_env_file(deployment_data, output_file)

    # Move config.json to the folder inside project location specified in deployment_data.json
    project_location = "/var/www/whoxa"
    # project_location = "/mnt/Omkar/aaa"
    move_config_file(output_file, project_location)
    copy_config_file("validatedToken.txt", project_location)
