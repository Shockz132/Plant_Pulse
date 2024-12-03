import json
import os
import spacy
from spacy.training.example import Example

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Get the current directory
current_directory = os.path.dirname(__file__)

# Construct the path to the gardening_advisor.json file
file_path = os.path.join(current_directory, "gardening_advisor.json")

# Load training data
with open(file_path) as file:
    data = json.load(file)

# Prepare training data
intents = data["gardening_advisor"]
train_data = []

# process the training data in the json file and add it to train_data list
for intent in intents:
    for pattern in intent["patterns"]:
        # Process the text to create a Doc object
        doc = nlp.make_doc(pattern)
        # adds text annotations to the processed text
        example = Example.from_dict(doc, {"cats": {intent["tag"]: 1.0}})
        # adds the annotated processed text to the training data list
        train_data.append(example)

# Function to train the model
def train_spacy(data, iterations):
    # Add a text categorizer to the pipeline if it doesn't have one
    if "textcat" not in nlp.pipe_names:
        textcat = nlp.add_pipe("textcat", last=True)
    else:
        textcat = nlp.get_pipe("textcat")

    # Add labels to text classifier
    for intent in intents:
        textcat.add_label(intent["tag"])

    # Start training
    optimizer = nlp.begin_training()
    for i in range(iterations):
        losses = {}
        # Use minibatch to divide data into smaller batches for training
        for batch in spacy.util.minibatch(data, size=spacy.util.compounding(4.0, 32.0, 1.001)):
            for example in batch:
                # Update the model with the current batch
                nlp.update([example], sgd=optimizer, losses=losses)
        print(f"Iteration {i+1}, Loss: {losses}")

train_spacy(train_data, 20)

# Save the model to current directory
nlp.to_disk("backend/Sprout")