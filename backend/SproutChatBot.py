import random
import spacy
import json
import os

try:
    # Get the current directory
    current_directory = os.path.dirname(__file__)
    
    # Construct the path to the intents.json file
    file_path = os.path.join(current_directory, "gardening_advisor.json")
    
    # Load the trained model and intents
    nlp = spacy.load("backend/Sprout")
    with open(file_path) as file:
        intents = json.load(file)["gardening_advisor"]
        
except FileNotFoundError:
    print("Error: Could not find the required files.")

# Function to get the response
def get_response(user_input):
    doc = nlp(user_input)
    if doc.cats:
        # Get the most probable intent from the user's input
        intent = max(doc.cats, key=doc.cats.get)
        for i in intents:
            if i["tag"] == intent:
                return random.choice(i["responses"])
    return "I'm not sure how to respond to that."

# Example usage
# print(get_response("hi"))