#!/bin/bash

# Get the current directory
CURRENT_DIR=$(pwd)

# Find the first .zip file in the current directory
ZIP_FILE=$(find "$CURRENT_DIR" -maxdepth 1 -type f -iname "auto_deploy.zip" | head -n 1)

if [[ -z "$ZIP_FILE" ]]; then
  echo "No zip file found in the current directory."
  exit 1
fi

# Extract the zip file (same directory as the zip file)
echo "Extracting $ZIP_FILE..."
unzip "$ZIP_FILE" -d "$CURRENT_DIR"

# Check if extraction was successful
if [[ $? -ne 0 ]]; then
  echo "Failed to extract the zip file."
  exit 1
fi

echo "Extraction complete."

# Run the specific shell script after extraction
# Replace 'your_shell_script.sh' with the actual shell script name
SCRIPT_TO_RUN="$CURRENT_DIR/automate_deploy.sh"

if [[ -f "$SCRIPT_TO_RUN" && -x "$SCRIPT_TO_RUN" ]]; then
  echo "Running $SCRIPT_TO_RUN..."
  bash "$SCRIPT_TO_RUN"
else
  echo "Shell script '$SCRIPT_TO_RUN' not found or not executable."
  exit 1
fi

echo "Process complete."
