#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Verify Python 3 is installed, and install if missing
if ! command_exists python3; then
    echo "Python 3 is not installed. Installing Python 3..."
    sudo apt update
    sudo apt install -y python3
else
    echo "Python 3 is already installed."
fi

# Step 2: Install necessary dependencies
echo "Installing build-essential, libssl-dev, libffi-dev, and python3-dev..."
sudo apt install -y build-essential libssl-dev libffi-dev python3-dev

# Step 3: Install pip for Python 3
if ! command_exists pip3; then
    echo "pip3 is not installed. Installing pip3..."
    sudo apt install -y python3-pip
else
    echo "pip3 is already installed."
fi

# Step 4: Install python3.12-venv
if ! dpkg -l | grep -q python3.12-venv; then
    echo "Installing python3.12-venv..."
    sudo apt install -y python3.12-venv
else
    echo "python3.12-venv is already installed."
fi

# Step 5: Create and set up the virtual environment
echo "Creating a virtual environment..."
python3 -m venv myvenv

# Step 6: Ensure the activate script is executable
chmod +x myvenv/bin/activate

# Step 7: Activate the virtual environment
echo "Activating the virtual environment..."
source myvenv/bin/activate

# Step 8: Install Django
echo "Installing Django..."
pip3 install Django

# Confirm installation
if command_exists django-admin; then
    echo "Django has been installed successfully!"
else
    echo "There was an issue installing Django. Please check the logs above."
fis
