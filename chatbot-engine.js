// Simple FAQ-Based AI Chatbot with Cosine Similarity
class AIChatbot {
    constructor() {
        this.knowledgeBase = null;
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.inputField = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('send-message');
        this.typingIndicator = document.getElementById('typing-indicator');
        
        this.init();
    }
    
    async init() {
        await this.loadKnowledgeBase();
        this.setupEventListeners();
    }
    
    async loadKnowledgeBase() {
        try {
            const response = await fetch('./chatbot-knowledge.json');
            this.knowledgeBase = await response.json();
            this.updateGreetingMessage();
        } catch (error) {
            console.error('Failed to load knowledge base:', error);
            this.knowledgeBase = { 
                faqs: [], 
                fallback_responses: ['Sorry, I cannot access my knowledge base right now.'],
                messages: {
                    greeting: "Hi! I'm Ishaan's AI assistant. Ask me about his RAG expertise, projects, experience, or anything else!",
                    loading_error: "Sorry, I'm still loading my knowledge base. Please try again in a moment.",
                    connection_error: "Sorry, I cannot access my knowledge base right now."
                }
            };
        }
    }
    
    setupEventListeners() {
        // Floating button to open chatbot
        const floatingBtn = document.getElementById('floating-chatbot-btn');
        const overlay = document.getElementById('chatbot-overlay');
        const closeBtn = document.getElementById('close-chatbot');
        
        floatingBtn?.addEventListener('click', () => this.openChatbot());
        closeBtn?.addEventListener('click', () => this.closeChatbot());
        overlay?.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeChatbot();
        });
        
        // Message handling
        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
        
        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                this.sendSuggestionMessage(query);
            });
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeChatbot();
        });
    }
    
    openChatbot() {
        const overlay = document.getElementById('chatbot-overlay');
        overlay?.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Focus input after animation
        setTimeout(() => {
            this.inputField?.focus();
        }, 400);
    }
    
    closeChatbot() {
        const overlay = document.getElementById('chatbot-overlay');
        overlay?.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
    
    async handleUserMessage() {
        const userInput = this.inputField.value.trim();
        if (!userInput) return;
        
        this.addMessage(userInput, 'user');
        this.inputField.value = '';
        this.showTyping();
        
        const response = await this.processMessage(userInput);
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(response, 'bot');
        }, 800 + Math.random() * 800);
    }
    
    async processMessage(userInput) {
        if (!this.knowledgeBase?.faqs) {
            return this.knowledgeBase?.messages?.loading_error || "Sorry, I'm still loading my knowledge base. Please try again in a moment.";
        }
        
        const bestMatch = this.findBestFAQMatch(userInput);
        return bestMatch || this.getFallbackResponse();
    }
    
    findBestFAQMatch(userInput) {
        let bestAnswer = null;
        let highestScore = 0;
        const threshold = 0.25; // 25% similarity threshold
        
        const inputVector = this.createTFIDFVector(userInput);
        
        this.knowledgeBase.faqs.forEach(faq => {
            const questionVector = this.createTFIDFVector(faq.question);
            const similarity = this.cosineSimilarity(inputVector, questionVector);
            
            if (similarity > highestScore && similarity > threshold) {
                highestScore = similarity;
                bestAnswer = faq.answer;
            }
        });
        
        return bestAnswer;
    }
    
    createTFIDFVector(text) {
        // Normalize and tokenize
        const words = text.toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 2);
        
        // Create term frequency map
        const termFreq = {};
        words.forEach(word => {
            termFreq[word] = (termFreq[word] || 0) + 1;
        });
        
        // Convert to normalized TF vector
        const totalWords = words.length;
        const vector = {};
        
        for (const [term, freq] of Object.entries(termFreq)) {
            vector[term] = freq / totalWords; // Simple TF normalization
        }
        
        return vector;
    }
    
    cosineSimilarity(vectorA, vectorB) {
        // Get all unique terms
        const allTerms = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)]);
        
        let dotProduct = 0;
        let magnitudeA = 0;
        let magnitudeB = 0;
        
        // Calculate dot product and magnitudes
        allTerms.forEach(term => {
            const valueA = vectorA[term] || 0;
            const valueB = vectorB[term] || 0;
            
            dotProduct += valueA * valueB;
            magnitudeA += valueA * valueA;
            magnitudeB += valueB * valueB;
        });
        
        // Calculate cosine similarity
        const magnitude = Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);
        return magnitude === 0 ? 0 : dotProduct / magnitude;
    }
    
    getFallbackResponse() {
        const fallbacks = this.knowledgeBase?.fallback_responses || [
            "I'm not sure about that. Try asking about my RAG projects, experience, or skills!"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
    
    updateGreetingMessage() {
        const greetingElement = document.querySelector('.bot-message .message-content p');
        if (greetingElement && this.knowledgeBase?.messages?.greeting) {
            greetingElement.textContent = this.knowledgeBase.messages.greeting;
        }
    }
    
    async sendSuggestionMessage(query) {
        this.addMessage(query, 'user');
        this.showTyping();
        
        const response = await this.processMessage(query);
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(response, 'bot');
        }, 800 + Math.random() * 800);
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        contentDiv.appendChild(textP);
        contentDiv.appendChild(timeDiv);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTyping() {
        this.typingIndicator.classList.add('show');
        this.sendButton.disabled = true;
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.classList.remove('show');
        this.sendButton.disabled = false;
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIChatbot();
});