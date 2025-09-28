document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------
    // Element references
    // -------------------------------
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");

    // Create left-side FAQ container
    const faqContainer = document.createElement("div");
    faqContainer.className = "faq-container";
    document.body.prepend(faqContainer);

    let questionCount = 0;

    // -------------------------------
    // Smooth scroll
    // -------------------------------
    const scrollToBottom = () => chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });

    // -------------------------------
    // Add a message
    // -------------------------------
    const addMessage = (message, sender = "user") => {
        const wrapper = document.createElement("div");
        wrapper.className = `chat-message ${sender}-message fade-in`;

        const avatar = document.createElement("div");
        avatar.className = "avatar";
        avatar.textContent = sender === "user" ? "🧑" : "🤖";

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.innerHTML = `<p>${message}</p>`;

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);

        scrollToBottom();
        return bubble.querySelector("p");
    };

    // -------------------------------
    // Bot typing effect
    // -------------------------------
    const botTyping = async (message) => {
        return new Promise(resolve => {
            const wrapper = document.createElement("div");
            wrapper.className = "chat-message bot-message typing";

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            avatar.textContent = "🤖";

            const bubble = document.createElement("div");
            bubble.className = "bubble";
            bubble.innerHTML = `<p><span class="dots">...</span></p>`;

            wrapper.appendChild(avatar);
            wrapper.appendChild(bubble);
            chatBox.appendChild(wrapper);
            scrollToBottom();

            let index = 0;
            const p = document.createElement("p");
            bubble.innerHTML = "";
            bubble.appendChild(p);

            const typeChar = () => {
                if (index < message.length) {
                    p.textContent += message[index++];
                    scrollToBottom();
                    setTimeout(typeChar, 35);
                } else {
                    wrapper.classList.remove("typing");
                    wrapper.querySelector(".bubble").style.animation = "fadeIn 0.5s ease-in-out";
                    resolve();
                }
            };
            setTimeout(typeChar, 500);
        });
    };

    // -------------------------------
    // Time-based greeting
    // -------------------------------
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning! 🌞";
        if (hour < 18) return "Good afternoon! 🌤️";
        return "Good evening! 🌙";
    };

    // -------------------------------
    // Quote of the day
    // -------------------------------
    const quotes = [
        "“The only way to do great work is to love what you do.” – Steve Jobs",
        "“Learning never exhausts the mind.” – Leonardo da Vinci",
        "“Success is not final, failure is not fatal: It is the courage to continue that counts.” – Winston Churchill",
        "“Code is like humor. When you have to explain it, it’s bad.” – Cory House",
        "“Simplicity is the soul of efficiency.” – Austin Freeman"
    ];
    const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

    // -------------------------------
    // Professional chatbot responses
    // -------------------------------
    const chatbotResponses = {
        // ------------------ About the Chatbot ------------------
        "tell me about yourself": 
            "Hello! I am EchoDesk, a futuristic AI-powered chatbot designed to provide professional IT guidance, answer programming queries, and assist users with structured information efficiently.",
        "who created you": 
            "I was developed by Dhanush Babu Mamuduru, an Electronics & Communication Engineer from Nellore, Andhra Pradesh, as part of his AI-based projects to showcase modern chatbot capabilities.",
        "what makes you special": 
            "I combine rule-based logic with basic machine learning techniques, offering instant, accurate responses while continuously learning from interactions.",
        "how can you help me": 
            "I provide guidance on programming, career advice in IT/software, AI/ML project insights, and structured responses for professional queries.",
        "what are your key features": 
            "Instant response, professional knowledge base, AI-assisted suggestions, and user-friendly interaction for learning or guidance.",
        "give me a quotation": () => getRandomQuote(),

        // ------------------ About Dhanush ------------------
        "tell me about dhanush": 
            "Dhanush Babu Mamuduru is from Nellore, Andhra Pradesh, and completed B.Tech in Electronics & Communication Engineering. He completed a two-month internship in Artificial Intelligence at EduStation and developed the EchoDesk chatbot as part of his learning.",
        "what are dhanush's strengths": 
            "Dhanush has strong programming skills, problem-solving ability, quick learning, and experience in AI/ML and full-stack development.",
        "what are dhanush's career goals": 
            "Dhanush aims to work in software development, focusing on AI, full-stack applications, and building innovative projects that solve real-world problems.",
        "what inspired dhanush to build you": 
            "He wanted to combine AI knowledge with practical experience and create a professional chatbot that can assist users in learning and IT guidance.",
        "what kind of projects has dhanush worked on": 
            "Dhanush has worked on AI-based chatbots, accident detection using GPS/GSM, and environmental awareness projects.",
        "what is dhanush's approach to learning": 
            "He follows hands-on practice, builds small projects, and gradually scales to more complex applications.",
        "does dhanush prefer any programming language": 
            "He enjoys Python for AI/ML projects and Java for full-stack development, depending on the project requirements.",
        "any advice from dhanush for beginners": 
            "Start with fundamentals, practice consistently, work on small projects, and gradually explore modern technologies.",

        // ------------------ Technical/Professional Questions ------------------
        "what programming languages do you know": 
            "Dhanush is proficient in Python, Java, SQL, C, C++, HTML, CSS, and JavaScript. He also uses Python libraries like NumPy, Pandas, Matplotlib, and Scikit-learn for AI/ML projects.",
        "what technologies/tools did you use and why": 
            "Python → core programming language\nNumPy & Pandas → data preprocessing & analysis\nMatplotlib → visualization\nScikit-learn → building/testing ML models\nThese are industry-standard tools for AI/ML projects.",
        "which platform/ide did you use": 
            "Jupyter Notebook for step-by-step testing and visualization. For bigger projects, PyCharm, IntelliJ, or Eclipse would be ideal.",
        "can you explain your internship in simple terms": 
            "Dhanush completed a two-month AI internship at EduStation, learning fundamentals of AI & ML with Python, and developed a simple AI-based chatbot.",
        "what problem does your project solve": 
            "The EchoDesk chatbot automates basic customer support, answering common queries instantly, saving time and improving user experience.",
        "what challenges did you face": 
            "Challenges included handling diverse user inputs and limited sample data. Preprocessing and testing improved chatbot accuracy.",
        "what was your role in the project": 
            "Dhanush learned the concepts and implemented them in EchoDesk, preparing sample questions and testing responses.",
        "how is this useful in real life": 
            "Chatbots are used in banking, e-commerce, and customer support. EchoDesk provided practical experience in applying AI & ML in real-world problems.",
        "how is this internship useful for IT/software jobs": 
            "It improved programming, data handling, problem-solving, and project experience — skills transferable to Java development & full-stack projects.",
        "if you were to improve the chatbot project, what would you add": 
            "Integrate NLP libraries like NLTK or spaCy for better understanding and connect the bot to web/mobile interfaces.",
        "how did you prepare the chatbot": 
            "Collected questions/responses, preprocessed text, and implemented logic to match user inputs.",
        "what type of chatbot did you build": 
            "A rule-based chatbot with basic AI elements and simple ML techniques.",
        "did you use machine learning for the chatbot": 
            "Yes, Scikit-learn was used for text classification to categorize inputs into greetings, FAQs, or closing statements.",
        "how long did it take to build you": 
            "The development of EchoDesk, including learning, designing, and testing, took approximately 2 months.",
        "can you handle multiple questions": 
            "Yes, I can answer multiple professional queries one after another and provide structured guidance."
    };

    const supportedQuestions = Object.keys(chatbotResponses);

    // -------------------------------
    // Render professional FAQ
    // -------------------------------
    const renderFAQ = () => {
        const title = document.createElement("h3");
        title.textContent = "Ask Me Professionally:";
        faqContainer.appendChild(title);

        const list = document.createElement("ul");
        supportedQuestions.forEach(q => {
            const li = document.createElement("li");
            li.textContent = q;
            li.className = "faq-item";
            li.addEventListener("click", () => handleQuestion(q));
            list.appendChild(li);
        });
        faqContainer.appendChild(list);
    };
    renderFAQ();

    // -------------------------------
    // Handle question
    // -------------------------------
    const handleQuestion = async (question) => {
        questionCount++;
        addMessage(`${questionCount}. ${question}`, "user");
        const answer = typeof chatbotResponses[question] === "function"
            ? chatbotResponses[question]()
            : chatbotResponses[question] || "I currently answer only the listed professional questions.";
        await botTyping(answer);
    };

    // -------------------------------
    // Send user input
    // -------------------------------
    const handleSend = () => {
        const msg = userInput.value.trim();
        if (!msg) return;
        handleQuestion(msg);
        userInput.value = "";
    };

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleSend();
    });

    // -------------------------------
    // Initial greeting
    // -------------------------------
    setTimeout(() => {
        const greeting = getGreeting();
        botTyping(`${greeting} Hello! I am EchoDesk, your professional AI assistant. Click any question on the left or type your own to start.\nHere's a motivational quote for today:\n"${getRandomQuote()}"`);
    }, 500);
});
