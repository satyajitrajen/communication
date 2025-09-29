import subprocess
import json
import os
import time


def run_command(command):
    """Run a shell command and return the output."""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e.stderr}")
        return None

# def run_sql_command(command, root_password):
#     """Run a SQL command as the MySQL root user."""
#     try:
#         result = subprocess.run(
#             ["mysql", "-u", "root", "-p" + root_password, "-e", command],
#             capture_output=True,
#             text=True,
#             check=True
#         )
#         print(result.stdout)  # Print output of the command
#     except subprocess.CalledProcessError as e:
#         print(f"Error running SQL command: {e.stderr}")
#         if "Access denied" in e.stderr:
#             print("Access denied! Please check your MySQL root password.")
#         elif "Unknown database" in e.stderr:
#             print("The specified database does not exist.")
#         return None
def run_sql_command( sql_command, root_password):
    try:
        # Append 'exit;' to ensure MySQL exits after executing the command
        sql_command += "; exit;"

        # Construct the MySQL command with the password and SQL query
        command = f'mysql -u root -p{root_password} -e "{sql_command}"'

        # Run the command
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        print(result)
        # Return the output if the command was successful
        return result.stdout
    except subprocess.CalledProcessError as e:
        # Handle errors (e.g., incorrect password, syntax error in SQL)
        return f"Error: {e.stderr}"


# def run_sql_command(command, root_password):
#     """Run a SQL command as the MySQL root user."""
#     try:
#         # Use MYSQL_PWD environment variable for secure password passing
#         result = subprocess.run(
#             ["mysql", "-u", "root", "-e", command],
#             capture_output=True,
#             text=True,
#             check=True,
#             env={"MYSQL_PWD": root_password}
#         )
#         print(result.stdout)  # Print output of the command if successful
#         return True
#     except subprocess.CalledProcessError as e:
#         print(f"Error running SQL command: {e.stderr}")
#         if "Access denied" in e.stderr:
#             print("Access denied! Please check your MySQL root password.")
#         elif "Unknown database" in e.stderr:
#             print("The specified database does not exist.")
#         elif "ERROR 104" in e.stderr:
#             print("An error occurred, but continuing to next command.")
#         return False


def run_sql_command_without_pass(command):
    """Run a SQL command as the MySQL root user."""
    try:
        result = subprocess.run(
            ["sudo", "mysql", "-e", command],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)  # Print output of the command
    except subprocess.CalledProcessError as e:
        print(f"Error running SQL command: {e.stderr}")
        if "Access denied" in e.stderr:
            print("Access denied! Please check your MySQL root password.")
        elif "Unknown database" in e.stderr:
            print("The specified database does not exist.")
        return None

def check_mysql_installed():
    """Check if MySQL is installed by analyzing the output of mysql --version."""
    output = run_command("mysql --version")
    
    if output and "mysql" in output.lower():
        print("MySQL is already installed.")
        return True
    else:
        print("MySQL is not installed.")
        return False

def install_mysql(root_password):
    """Install MySQL server and set the root password."""
    print("MySQL not found. Installing MySQL server...")

    # Update package list
    print("Updating package list...")
    run_command("sudo apt update")

    # Install MySQL server
    print("Installing MySQL server...")
    run_command("sudo apt install -y mysql-server")

    # Set the root password using the ALTER USER command
    try:
        print("Setting up MySQL root password...")
        run_sql_command_without_pass(f"alter user 'root'@'localhost' identified with mysql_native_password by '{root_password}';")
        print("Root password set successfully.")
    except Exception as e:
        print(f"Failed to set root password: {e}")
        return False
    
    return True

def main():
    # Load the JSON file
    with open('deployment_data.json', 'r') as f:
        deployment_data = json.load(f)
    
    # Extract data from JSON
    root_password = deployment_data["rootMysqlPass"]
    dbname = deployment_data["DBname"]
    username = deployment_data["DBuser"]
    user_password = deployment_data["DBpassword"]

    # Check if MySQL is installed
    if not check_mysql_installed():
        if not install_mysql(root_password):
            print("MySQL installation failed. Exiting.")
            return
    
    # Step 1: Show MySQL users
    print("\nShowing MySQL users:")
    query_show_users = "SELECT user FROM mysql.user;"
    run_sql_command(query_show_users, root_password)

    # Step 2: Create a new database
    query_create_database = f"CREATE DATABASE {dbname};"
    run_sql_command(query_create_database, root_password)
    print(f"Database '{dbname}' created successfully.")

    # Step 3: Create a new MySQL user
    query_create_user = f"CREATE USER '{username}'@'localhost' IDENTIFIED WITH mysql_native_password BY '{user_password}';"
    run_sql_command(query_create_user, root_password)
    print(f"User '{username}' created successfully.")

    # Step 4: Grant permissions to the new user on the database
    query_grant_permissions = f"GRANT ALL ON {dbname}.* TO '{username}'@'localhost';"
    run_sql_command(query_grant_permissions, root_password)
    print(f"Granted all privileges on '{dbname}' to '{username}'.")

if __name__ == "__main__":
    main()
