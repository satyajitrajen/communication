import json
import shutil
import os

# Load deployment_data.json
def load_deployment_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Generate config.json based on deployment_data
def create_config_json(deployment_data, output_file):
    config = {
        "development": {
            "username": deployment_data["DBuser"],
            "password": deployment_data["DBpassword"],
            "database": deployment_data["DBname"],
            "host": "127.0.0.1",  # Assuming localhost for development
            "dialect": "mysql"
        },
        "test": {
            "username": "root",
            "password": None,
            "database": "database_test",
            "host": "127.0.0.1",
            "dialect": "mysql"
        },
        "production": {
            "username": "root",
            "password": deployment_data["rootMysqlPass"],
            "database": deployment_data["DBname"],
            "host": deployment_data["DBIP"],
            "dialect": "mysql"
        }
    }

    # Save the config data to config.json
    with open(output_file, 'w') as file:
        json.dump(config, file, indent=4)

# Move config.json to a specific folder inside the projectLocation
def move_config_file(output_file, project_location, target_folder):
    # Construct the full target directory path
    target_directory = os.path.join(project_location, target_folder)
    
    # Ensure target directory exists
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)
    
    # Construct the target path for config.json
    target_path = os.path.join(target_directory, 'config.json')
    
    # Move the file
    shutil.move(output_file, target_path)
    print(f"Config file moved to {target_path}")

# Main execution
if __name__ == "__main__":
    # Path to deployment_data.json
    deployment_file = 'deployment_data.json'
    # Temporary path to save config.json
    output_file = 'config.json'

    # Load the deployment data
    deployment_data = load_deployment_data(deployment_file)

    # Create the config.json
    create_config_json(deployment_data, output_file)

    # Move config.json to the folder inside project location specified in deployment_data.json
    project_location = deployment_data["projectLocation"]
    target_folder = "config"  # The folder inside the project location where config.json should be moved
    move_config_file(output_file, project_location, target_folder)
