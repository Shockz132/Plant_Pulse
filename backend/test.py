import spacy
import requests

nlp = spacy.load("en_core_web_sm")

def extract_entities(user_input):
    doc = nlp(user_input)
    entities = {ent.label_: ent.text for ent in doc.ents}
    return entities

def get_generative_response(user_input):
    response = requests.post("http://localhost:8000/generate", json={"input_text": user_input})
    return response.json()["response"]

def chatbot_response(user_input):
    # Use spaCy to extract entities
    entities = extract_entities(user_input)
    print(f"Extracted Entities: {entities}")

    # Get a generative response
    generative_response = get_generative_response(user_input)

    # Combine spaCy and generative model outputs (example logic)
    if 'plant' in entities:
        response = f"You asked about {entities['plant']}. {generative_response}"
    else:
        response = generative_response

    return response

# Example usage
user_input = "What is the best soil for growing tomatoes in summer?"
print(chatbot_response(user_input))