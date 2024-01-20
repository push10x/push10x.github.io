import datetime
import json
import os
import subprocess

filename = 'data.json'

def create_data():
    # To add a custom date to each post
    # while True:
    #   date = input("Enter date (numeric values i.e 01.01.24) or press Enter for today's date: \n")

    #   if date.strip():
    #       if len(date) <= 10:
    #           break
    #       else:
    #           print("Date must be 10 characters or fewer. Please try again.")
    #   else:
    #       # If the user didn't input a date, set it to today's date
    #       date = datetime.datetime.now().strftime("%d.%m.%Y")
    #       break

    # REPLACES THE ABOVE
    # Add todays date automatically
    date = datetime.datetime.now().strftime("%d.%m.%Y")

    # Make the title mandatory
    while True:
        title = input("Enter a title: ")
        if title.strip(): # Check title is not empty/only contains whitespace
            break
        else:
            print("\nTitle cannot be empty. Please try again.")

    link = input("Enter a link URL: ")
    linkText = input("Enter the linkText: ")

    para = input("Enter paragraph text: ")
    
    paraLinkWord = input("Enter the paragraph word to add a link to: ")
    paraLink = input(f"Enter a link URL for {paraLinkWord}: ")
    
    highlightWords = input("Type the words you want highlighted? (or press enter): ")

    new_data = {
        'title': title,
        'date': date,
        'link': link,
        'linkText': linkText,
        'highlightWords': highlightWords,
        'para': para,
        'paraLinkWord': paraLinkWord,
        'paraLink': paraLink
    }

    return new_data

def load_existing_data(filename):
    existing_data = []
    if os.path.exists(filename):
        with open(filename, 'r') as file:
            existing_data = json.load(file)
    return existing_data

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

    while True:
        new_data = create_data()

        save_to_json(new_data)
        print(f"\nAll data has been saved to the json file {filename}.\n")

        # Prompt user for Git operations
        git_prompt = input("Would you like to add, commit, and push to the Git repository? \n(Press y or enter to quit.): \n")

        if git_prompt.lower() == 'y':
            commit_message = input("Enter a commit message: ")
            git_add_commit_push(commit_message)
            print("\nGit operations completed successfully. \n\nGreat job!")
        else:
            print("\nExiting the program without Git operations. \n\nSee you next time!")
        break
