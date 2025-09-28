document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------
    // Element references
    // -------------------------------
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");
    const faqContainer = document.querySelector(".faq-container");
    let questionCount = 0;

    // -------------------------------
    // Add social links dynamically in header
    // -------------------------------
    const addSocialLinks = () => {
        const header = document.querySelector(".chat-header");
        if (!header) return;

        const socialContainer = document.createElement("div");
        socialContainer.className = "social-links";
        socialContainer.innerHTML = `
            <a href="https://www.linkedin.com/in/dhanush-babu-mamuduru-3863a2276" target="_blank">LinkedIn</a>
            <a href="https://github.com/dhanush-babu-M" target="_blank">GitHub</a>
            <a href="https://www.instagram.com/just._.dhanush69/" target="_blank">Instagram</a>
        `;
        header.appendChild(socialContainer);
    };

    // -------------------------------
    // Mobile FAQ toggle button
    // -------------------------------
    const setupMobileToggle = () => {
        const toggleButton = document.createElement("button");
        toggleButton.className = "faq-toggle-btn";
        toggleButton.textContent = "☰ Ask Me";
        document.body.prepend(toggleButton);

        toggleButton.addEventListener("click", () => faqContainer.classList.toggle("open"));

        // Close FAQ on mobile after selecting a question
        faqContainer.addEventListener("click", (e) => {
            if (e.target.tagName === "LI" && window.innerWidth <= 768) {
                faqContainer.classList.remove("open");

                // Highlight selected question
                const allItems = faqContainer.querySelectorAll("li");
                allItems.forEach(li => li.classList.remove("selected"));
                e.target.classList.add("selected");
            }
        });

        // Ensure FAQ closes on resize if screen > 768px
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) faqContainer.classList.remove("open");
        });
    };

    // -------------------------------
    // Smooth scroll for chat
    // -------------------------------
    const scrollToBottom = () => chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: "smooth" });

    // -------------------------------
    // Add message to chat
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
    // Bot typing animation
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
    // Chatbot responses
    // -------------------------------
    const chatbotResponses = {
        "do you know python": "Yes, I know Python. I can help with basics, syntax, and logic building.",
        "do you know java": "Yes, I am familiar with Java and its use in full stack development.",
        "tell about yourself": "I am EchoDesk, your virtual helpdesk chatbot created to answer your questions.",
        "what is your purpose?": "I am designed to assist users by answering questions and providing helpful information."
        // Add more Q&A here
    };
    const supportedQuestions = Object.keys(chatbotResponses);

    // -------------------------------
    // Render FAQ
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

    // -------------------------------
    // Handle question selection
    // -------------------------------
    const handleQuestion = async (question) => {
        questionCount++;
        addMessage(`${questionCount}. ${question.charAt(0).toUpperCase() + question.slice(1)}`, "user");

        const answer = typeof chatbotResponses[question] === "function"
            ? chatbotResponses[question]()
            : chatbotResponses[question] || "I currently answer only the listed professional questions.";

        await botTyping(answer);
    };

    // -------------------------------
    // Handle user input
    // -------------------------------
    const handleSend = () => {
        const msg = userInput.value.trim();
        if (!msg) return;

        const lowerMsg = msg.toLowerCase();
        if (chatbotResponses[lowerMsg]) {
            handleQuestion(lowerMsg);
        } else {
            addMessage(msg, "user");
            botTyping("I don't have a pre-defined answer for that. Please select a question from the left.");
        }

        userInput.value = "";
    };

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", e => {
        if (e.key === "Enter") handleSend();
    });

    // -------------------------------
    // Initialize everything
    // -------------------------------
    addSocialLinks();
    setupMobileToggle();
    renderFAQ();

    // Initial greeting with quote
    setTimeout(() => {
        const greeting = getGreeting();
        botTyping(`${greeting} Hello! I am EchoDesk, your professional AI assistant. Click any question on the left or type your own to start.\nHere's a motivational quote for today:\n"${getRandomQuote()}"`);
    }, 500);
});
