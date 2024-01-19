import json
import os
import subprocess

filename = 'data.json'

def create_data():
    while True:
        date = input("Enter date (maximum 10 characters): ")

        if len(date) <= 10:
            break
        else:
            print("Date must be 10 characters or fewer. Please try again.")

    # Check if the user wants to exit
    if date.lower() == 'exit':
        return {'date': 'exit', 'link': ''}

    link = input("Enter a link URL: ")
    linkText = input("Enter the linkText: ")

    # Make the title mandatory
    while True:
        title = input("Enter a title: ")
        if title.strip():  # Check if the title is not empty or only contains whitespace
            break
        else:
            print("Title cannot be empty. Please try again.")

    para = input("Enter paragraph text: ")
    highlightWords = input("Type the words you want highlighted? (or press enter): ")

    new_data = {
        'date': date,
        'link': link,
        'linkText': linkText,
        'title': title,
        'highlightWords': highlightWords,
        'para': para,
    }

    return new_data

def load_existing_data(filename):
    existing_data = []
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            existing_data = json.load(file)
    return existing_data[::-1] # Reverse the order when loading

def save_to_json(data, filename=filename):
    existing_data = load_existing_data(filename)
    existing_data.insert(0, data)  # Insert new data at the top of the file

    with open(filename, 'w') as file:
        json.dump(existing_data, file, indent=2)

def git_add_commit_push(commit_message):
    subprocess.run(['git', 'add', filename])
    subprocess.run(['git', 'commit', '-m', commit_message])
    # subprocess.run(['git', 'push'])

if __name__ == "__main__":
    exit_command = 'exit'

    print("Type 'exit' to quit.")

    while True:
        new_data = create_data()

        if new_data['date'].lower() == exit_command.lower():
            print(f"\nAll data has been saved to the json file {filename}.\n")

            # Prompt user for Git operations
            git_prompt = input("Would you like to add, commit, and push to the Git repository? (y/n): ")

            if git_prompt.lower() == 'y':
                commit_message = input("Enter a commit message: ")
                git_add_commit_push(commit_message)
                print("Git operations completed successfully.")
            elif git_prompt.lower() == 'n':
                print("Exiting the program without Git operations.")
            else:
                print("Invalid input. Exiting the program without Git operations.")

            print("Exiting the program.")
            break

        print("Type 'exit' to quit.")
        save_to_json(new_data)
