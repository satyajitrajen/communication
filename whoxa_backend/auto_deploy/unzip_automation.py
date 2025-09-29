import os
import zipfile
import json

def unzip_file(zip_file_path, extract_to):
    """Unzip the specified zip file to the given extraction directory."""
    try:
        with zipfile.ZipFile(zip_file_path, 'r') as zip_file:
            zip_file.extractall(extract_to)
        print(f"Successfully extracted '{zip_file_path}' to '{extract_to}'")
    except Exception as e:
        print(f"Error extracting '{zip_file_path}': {e}")

def read_extraction_path_from_json(json_file_path):
    """Read the extraction path from a JSON file."""
    try:
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
            extraction_path = data.get("projectLocation")
            if not extraction_path:
                raise ValueError("Extraction path not found in JSON file.")
            return extraction_path
    except Exception as e:
        print(f"Error reading JSON file '{json_file_path}': {e}")
        exit(1)

def main():
    # Define the paths
    json_file_path = os.path.join(os.path.dirname(__file__), "deployment_data.json")  # JSON file path in the same folder
    zip_file_path = "whoxa.zip"  # Replace with your actual zip file path
    
    # Read extraction path from JSON
    extraction_path = read_extraction_path_from_json(json_file_path)

    # Make sure the extraction path exists
    os.makedirs(extraction_path, exist_ok=True)

    # Unzip the file
    unzip_file(zip_file_path, extraction_path)

if __name__ == "__main__":
    main()
