class TerminalAnimation {
    constructor() {
        this.terminalContent = document.getElementById('terminal-content');
        this.snippets = [];
        this.currentSnippetIndex = 0;
        this.currentLineIndex = 0;
        this.currentCharIndex = 0;
        this.isTyping = false;
        this.config = {
            typingSpeed: 50,
            pauseBetweenLines: 800,
            pauseBetweenSnippets: 3000,
            loopDelay: 5000
        };
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadSnippets();
            this.startAnimation();
        } catch (error) {
            console.error('Failed to load terminal snippets:', error);
            this.startFallbackAnimation();
        }
    }
    
    async loadSnippets() {
        const response = await fetch('terminal-snippets.json');
        const data = await response.json();
        this.snippets = data.snippets;
        this.config = { ...this.config, ...data.config };
    }
    
    startFallbackAnimation() {
        // Fallback snippets if JSON fails to load
        this.snippets = [
            {
                id: "rag_demo",
                title: "RAG System Demo",
                commands: [
                    "$ python rag_system.py",
                    "> Initializing RAG pipeline...",
                    "> Loading documents...",
                    "> Creating embeddings...",
                    "> ✅ RAG system ready!",
                    "> Query: 'What is machine learning?'",
                    "> 🤖 Generating response...",
                    "> Response: 'ML is a subset of AI that enables...'",
                    "> ✅ Query processed successfully!"
                ]
            }
        ];
        this.startAnimation();
    }
    
    startAnimation() {
        if (this.snippets.length === 0) return;
        
        // Clear terminal and start typing
        this.clearTerminal();
        this.typeCurrentSnippet();
    }
    
    clearTerminal() {
        this.terminalContent.innerHTML = `
            <div class="terminal-line">
                <span class="terminal-prompt">ishaan@ai-developer:~/projects$</span>
                <span class="terminal-cursor">_</span>
            </div>
        `;
    }
    
    async typeCurrentSnippet() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        const snippet = this.snippets[this.currentSnippetIndex];
        
        for (let lineIndex = 0; lineIndex < snippet.commands.length; lineIndex++) {
            await this.typeLine(snippet.commands[lineIndex]);
            
            if (lineIndex < snippet.commands.length - 1) {
                await this.delay(this.config.pauseBetweenLines);
            }
        }
        
        this.isTyping = false;
        
        // Move to next snippet after delay
        await this.delay(this.config.pauseBetweenSnippets);
        this.nextSnippet();
    }
    
    async typeLine(line) {
        const lineElement = document.createElement('div');
        lineElement.className = 'terminal-line';
        
        // Style different types of lines
        if (line.startsWith('$')) {
            lineElement.innerHTML = `<span class="terminal-prompt">${line}</span>`;
        } else if (line.startsWith('>')) {
            lineElement.innerHTML = `<span class="terminal-text">${line}</span>`;
        } else if (line.includes('✅')) {
            lineElement.innerHTML = `<span class="terminal-success">${line}</span>`;
        } else if (line.includes('❌') || line.includes('Error')) {
            lineElement.innerHTML = `<span class="terminal-error">${line}</span>`;
        } else if (line.startsWith('#') || line.startsWith('//')) {
            lineElement.innerHTML = `<span class="terminal-comment">${line}</span>`;
        } else if (line.includes('import') || line.includes('from') || line.includes('def') || line.includes('class')) {
            lineElement.innerHTML = `<span class="terminal-keyword">${this.highlightSyntax(line)}</span>`;
        } else if (line.includes('"') || line.includes("'")) {
            lineElement.innerHTML = `<span class="terminal-string">${this.highlightStrings(line)}</span>`;
        } else {
            lineElement.innerHTML = `<span class="terminal-text">${line}</span>`;
        }
        
        // Remove cursor from last line
        const lastCursor = this.terminalContent.querySelector('.terminal-cursor');
        if (lastCursor) {
            lastCursor.remove();
        }
        
        this.terminalContent.appendChild(lineElement);
        
        // Add cursor to new line
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '_';
        lineElement.appendChild(cursor);
        
        // Simulate typing effect for longer lines
        if (line.length > 20) {
            await this.delay(this.config.typingSpeed * 2);
        } else {
            await this.delay(this.config.typingSpeed);
        }
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    highlightSyntax(line) {
        return line
            .replace(/(import|from|def|class|if|else|for|while|try|except|return)/g, '<span class="terminal-keyword">$1</span>')
            .replace(/(['"].*?['"])/g, '<span class="terminal-string">$1</span>');
    }
    
    highlightStrings(line) {
        return line.replace(/(['"].*?['"])/g, '<span class="terminal-string">$1</span>');
    }
    
    scrollToBottom() {
        const terminalBody = this.terminalContent.parentElement;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    nextSnippet() {
        this.currentSnippetIndex = (this.currentSnippetIndex + 1) % this.snippets.length;
        
        // Clear terminal after showing all snippets once
        if (this.currentSnippetIndex === 0) {
            setTimeout(() => {
                this.clearTerminal();
                setTimeout(() => this.typeCurrentSnippet(), 1000);
            }, this.config.loopDelay);
        } else {
            this.typeCurrentSnippet();
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Public methods for control
    pause() {
        this.isTyping = false;
    }
    
    resume() {
        if (!this.isTyping) {
            this.typeCurrentSnippet();
        }
    }
    
    restart() {
        this.currentSnippetIndex = 0;
        this.clearTerminal();
        this.typeCurrentSnippet();
    }
}

// Initialize terminal animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only start if terminal background exists
    const terminalBackground = document.getElementById('terminal-background');
    if (terminalBackground) {
        window.terminalAnimation = new TerminalAnimation();
    }
});

// Pause animation when page is not visible (performance optimization)
document.addEventListener('visibilitychange', () => {
    if (window.terminalAnimation) {
        if (document.hidden) {
            window.terminalAnimation.pause();
        } else {
            window.terminalAnimation.resume();
        }
    }
});