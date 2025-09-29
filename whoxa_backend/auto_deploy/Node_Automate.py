import os
import subprocess
import sys

def install_nodejs(version):
    # Update package index
    os.system("sudo apt-get update")
    
    # Install prerequisites
    os.system("sudo apt-get install -y curl")
    
    # Download and install the specific Node.js version
    os.system(f"curl -fsSL https://deb.nodesource.com/setup_{version}.x | sudo -E bash -")
    os.system("sudo apt-get install -y nodejs")

    # Verify installation
    node_version = subprocess.getoutput("node -v")
    if version in node_version:
        print(f"Node.js {version} installed successfully!")
    else:
        print(f"Failed to install Node.js {version}. Installed version is {node_version}.")
        sys.exit(1)

if __name__ == "__main__":
    # Define the specific version to install
    specific_version = "20"  # Replace with your major version of Node.js
    
    # Install the selected Node.js version
    print(f"Installing Node.js version {specific_version}...")
    install_nodejs(specific_version)
