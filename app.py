import yaml
from flask import Flask, render_template, request, jsonify
import random
from datetime import datetime

app = Flask(__name__)

# --- NEW: Smarter Chatbot Engine ---

# 1. Load the training data from the new YAML format
try:
    with open("custom.yml", 'r') as stream:
        chatbot_data = yaml.safe_load(stream).get('conversations', [])
except FileNotFoundError:
    print("Error: custom.yml file not found. Please make sure it's in the same directory.")
    chatbot_data = []

# 2. Define "stop words" - common words to ignore to find the real meaning
stop_words = {'a', 'an', 'the', 'is', 'in', 'it', 'of', 'for', 'what', 'who', 'where', 'how', 'do', 'you', 'your', 'me', 'can', 'tell'}

# 3. The main function to get a smart response based on keyword matching
def get_smart_response(user_text):
    user_text = user_text.lower().strip()

    # --- Step A: Check for simple greetings first ---
    greetings = ["hi", "hello", "hey", "hello there", "good morning", "good evening"]
    if user_text in greetings:
        # Give a time-based response
        hour = datetime.now().hour
        if hour < 12: return "Good morning! How can I help you today?"
        elif hour < 18: return "Good afternoon! How can I help you?"
        else: return "Good evening! How may I assist you?"

    # --- Step B: The Keyword Matching Logic ---
    user_keywords = set(user_text.split()) - stop_words
    
    best_match_score = 0
    best_answer = "I'm sorry, I don't have a specific answer for that yet. I am still learning. Maybe try asking about the creator or the project?"

    # Loop through every question in our YAML file
    for qa in chatbot_data:
        question_keywords = set(qa['question'].lower().split()) - stop_words
        
        # Find how many keywords match
        matching_keywords = user_keywords.intersection(question_keywords)
        score = len(matching_keywords)
        
        # If this question is a better match than the last one, save it
        if score > best_match_score:
            best_match_score = score
            best_answer = qa['answer']

    # We need at least one keyword to match to be confident
    if best_match_score > 0:
        return best_answer
    else:
        # Fallback response if no keywords match
        return "I'm sorry, I don't have an answer for that yet. Please try asking in a different way."

# --- API Routes ---
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get")
def get_bot_response():
    user_text = request.args.get('msg')
    response = get_smart_response(user_text)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

