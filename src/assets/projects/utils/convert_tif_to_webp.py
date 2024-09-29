import os
from PIL import Image

def convert_tif_to_webp(folder_path, quality=50):
    """
    Converts all .tif files in a folder to .webp with the specified quality (compression).

    Args:
    folder_path (str): The path to the folder containing the .tif files.
    quality (int): The quality of the output .webp files (1-100, where 100 is the best quality).
    """
    # Make sure the folder exists
    if not os.path.exists(folder_path):
        print(f"The folder {folder_path} does not exist.")
        return
    
    # Loop through all files in the folder
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.tif') or filename.lower().endswith('.tiff'):
            # Create full file path
            file_path = os.path.join(folder_path, filename)
            
            # Open the image
            with Image.open(file_path) as img:
                # Convert filename to .webp
                new_filename = f"{os.path.splitext(filename)[0]}.webp"
                new_file_path = os.path.join(folder_path, new_filename)
                
                # Save the image in .webp format with specified quality (50% compression)
                img.save(new_file_path, 'webp', quality=quality)
                print(f"Converted {file_path} to {new_file_path}")

if __name__ == "__main__":
    # Example usage
    folder_path = input("Enter the folder path containing .tif files: ")
    convert_tif_to_webp(folder_path, quality=50)
