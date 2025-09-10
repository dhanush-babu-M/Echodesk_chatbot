from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
from datetime import datetime
import random

# Step 1: Create the chatbot with logic adapter
echo_bot = ChatBot(
    "EchoDesk",
    storage_adapter="chatterbot.storage.SQLStorageAdapter",
    database_uri="sqlite:///echodesk_db.sqlite3",
    logic_adapters=[
        {
            "import_path": "chatterbot.logic.BestMatch",
            "default_response": "Sorry, I don't know that yet. 🤔",
            "maximum_similarity_threshold": 0.80
        }
    ]
)

# Step 2: Create the corpus trainer and train with English corpus
corpus_trainer = ChatterBotCorpusTrainer(echo_bot)
corpus_trainer.train("chatterbot.corpus.english")

# Step 3: Train with custom YAML file
corpus_trainer.train("./custom.yml")   # make sure this file exists

# Step 4: Define motivational quotes
quotes = [
    "Be good and help others!",
    "Discipline is the bridge between goals and achievement.",
    "Small steps every day lead to big results.",
    "Believe in yourself and all that you are.",
    "Every day is a new opportunity to grow."
]

# Step 5: Time-based greeting
hour = datetime.now().hour
if hour < 12:
    print("EchoDesk: Good morning! ☀️ I am EchoDesk. Type 'exit' to quit.")
elif hour < 18:
    print("EchoDesk: Good afternoon! 🌤️ I am EchoDesk. Type 'exit' to quit.")
else:
    print("EchoDesk: Good evening! 🌙 I am EchoDesk. Type 'exit' to quit.")

# Step 6: Chat loop
greetings = ["hi", "hello", "hey"]

while True:
    user_input = input("You: ").strip().lower()

    # Exit commands
    if user_input in ["exit", "quit", "bye"]:
        print("EchoDesk: Goodbye! 👋 Have a great day ahead.")
        break

    # Greetings
    if user_input in greetings:
        print("EchoDesk: Hi there! How can I help you today?")
        continue

    # Quotes
    if "quote" in user_input:
        print("EchoDesk:", random.choice(quotes))
        continue

    # Get response from chatbot
    response = echo_bot.get_response(user_input)
    print("EchoDesk:", response)
