import os

def rename_files_and_folders(root_dir, new_number):
    """
    Recursively renames files and folders by replacing 'NNN.' with a specific 3-digit number.
    
    Args:
    root_dir (str): The root directory from where to start renaming.
    new_number (str): The 3-digit number to replace 'NNN.' with.
    """
    if len(new_number) != 3 or not new_number.isdigit():
        raise ValueError("Please provide a valid 3-digit number.")

    # Walk through all directories and files in the root_dir
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        # Rename files
        for filename in filenames:
            if 'NNN.' in filename:
                new_filename = filename.replace('NNN.', f'{new_number}.')
                old_file_path = os.path.join(dirpath, filename)
                new_file_path = os.path.join(dirpath, new_filename)
                os.rename(old_file_path, new_file_path)
                print(f'Renamed file: {old_file_path} -> {new_file_path}')
        
        # Rename directories
        for dirname in dirnames:
            if 'NNN.' in dirname:
                new_dirname = dirname.replace('NNN.', f'{new_number}.')
                old_dir_path = os.path.join(dirpath, dirname)
                new_dir_path = os.path.join(dirpath, new_dirname)
                os.rename(old_dir_path, new_dir_path)
                print(f'Renamed folder: {old_dir_path} -> {new_dir_path}')

if __name__ == "__main__":
    # Example usage
    root_directory = input("Enter the root directory path: ")
    three_digit_number = input("Enter the 3-digit number to replace 'NNN.': ")
    rename_files_and_folders(root_directory, three_digit_number)
