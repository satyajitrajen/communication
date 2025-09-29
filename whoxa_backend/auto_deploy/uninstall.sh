#!/bin/bash

# Function to display messages
function msg() {
    echo -e "\n\033[1;34m$1\033[0m"
}

# Function to confirm action
function confirm() {
    read -p "$1 [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        msg "Aborting..."
        exit 1
    fi
}

# Confirm uninstallation
confirm "Are you sure you want to uninstall PM2, Node.js, npm, and MySQL?"

# Delete all PM2 processes
msg "Deleting all PM2 processes..."
pm2 delete all || echo "PM2 not found or already uninstalled."

# Uninstall PM2
msg "Uninstalling PM2..."
sudo npm uninstall -g pm2 || echo "npm not found or already uninstalled."

# Uninstall Node.js and npm
msg "Uninstalling Node.js and npm..."
sudo apt-get remove --purge -y nodejs npm || echo "Node.js and npm not found."
sudo apt-get autoremove -y

# Remove any remaining Node.js configuration files
msg "Removing Node.js related files..."
sudo rm -rf /usr/local/lib/nodejs /etc/node /usr/local/include/node /usr/local/bin/node /usr/local/bin/npm

# Fix held or broken packages
msg "Fixing held or broken packages..."
sudo dpkg --configure -a
sudo apt-get install -f

# Uninstall MySQL
msg "Uninstalling MySQL..."
sudo apt-get remove --purge -y mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* || echo "MySQL packages not found."
sudo apt-get purge mysql* || echo "Additional MySQL packages not found."
sudo apt-get autoremove -y
sudo apt-get autoclean

# Remove MySQL configuration and data files
msg "Removing MySQL configuration and data files..."
sudo rm -rf /etc/mysql /var/lib/mysql /var/log/mysql /var/log/mysql* /usr/lib/mysql /usr/share/mysql

# Check if MySQL is still installed
if dpkg -l | grep -i mysql; then
    msg "MySQL packages still detected. Manual removal may be required."
else
    msg "MySQL completely removed."
fi

msg "Uninstallation completed!"
