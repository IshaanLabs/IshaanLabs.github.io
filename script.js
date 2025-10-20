// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Set default to dark theme
document.documentElement.setAttribute('data-theme', 'dark');

// Get saved theme or keep dark as default
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme !== 'dark') {
    document.documentElement.setAttribute('data-theme', savedTheme);
}
updateThemeIcon(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateNavbarBackground();
});

// Function to update navbar background based on current theme
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    } else {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.9)';
        }
    }
}

function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Mobile Navigation with Enhanced Animation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Add pulse animation to hamburger
            hamburger.classList.add('pulse');
            setTimeout(() => {
                hamburger.classList.remove('pulse');
            }, 600);
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});



// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', updateNavbarBackground);

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Contact form is now handled by Google Forms
// The embedded Google Form handles its own submission and validation

// Typing animation for hero section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 100);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Skills animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill items for animation
document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
});

// Add custom cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Scroll to top functionality
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(45deg, #4facfe, #00f2fe);
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Floating Contact Button
const floatingContact = document.getElementById('floating-contact');

floatingContact.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
    floatingContact.classList.add('bounce');
    setTimeout(() => {
        floatingContact.classList.remove('bounce');
    }, 1000);
});

// Show/hide floating contact button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        floatingContact.classList.add('show');
    } else {
        floatingContact.classList.remove('show');
    }
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Button Loading States and Ripple Effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add loading state
        const originalText = this.textContent;
        this.style.pointerEvents = 'none';
        this.textContent = 'Loading...';
        
        // Remove loading state after 2 seconds
        setTimeout(() => {
            this.textContent = originalText;
            this.style.pointerEvents = 'auto';
        }, 2000);
    });
});

// Enhanced micro-interactions handled by init3DProjectCards() function

// Projects Search & Filter Functionality
class ProjectsGrid {
    constructor() {
        this.searchInput = document.getElementById('project-search-input');
        this.searchClear = document.getElementById('project-search-clear');
        this.projectTags = document.querySelectorAll('.project-tag');
        this.noResultsMessage = document.getElementById('no-projects-found');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        // Search input events
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showSearchClear());
        
        // Clear search button
        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => this.clearSearch());
        }
        
        // Filter tag events
        this.projectTags.forEach(tag => {
            tag.addEventListener('click', () => this.handleFilter(tag.dataset.filter, tag));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.searchInput.focus();
            }
            if (e.key === 'Escape' && document.activeElement === this.searchInput) {
                this.clearSearch();
            }
        });
    }
    
    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            this.searchClear.classList.add('show');
        } else {
            this.searchClear.classList.remove('show');
        }
        
        this.filterProjects(searchTerm, this.activeFilter);
    }
    
    handleFilter(filter, tagElement) {
        // Update active tag
        this.projectTags.forEach(tag => tag.classList.remove('active'));
        tagElement.classList.add('active');
        
        this.activeFilter = filter;
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        
        this.filterProjects(searchTerm, filter);
    }
    
    filterProjects(searchTerm, filter) {
        // Get current project cards (they might be dynamically loaded)
        const projectCards = document.querySelectorAll('.project-card');
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.project-tech span'))
                .map(span => span.textContent.toLowerCase());
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',') : [];
            
            // Check search match
            const searchMatch = searchTerm === '' || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) ||
                techTags.some(tech => tech.includes(searchTerm)) ||
                cardTags.some(tag => tag.includes(searchTerm));
            
            // Check filter match
            const filterMatch = filter === 'all' || cardTags.includes(filter);
            
            // Show/hide card
            if (searchMatch && filterMatch) {
                this.showCard(card);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });
        
        // Show/hide no results message
        if (this.noResultsMessage) {
            if (visibleCount === 0) {
                this.noResultsMessage.style.display = 'block';
            } else {
                this.noResultsMessage.style.display = 'none';
            }
        }
        
        // Add stagger animation to visible cards
        this.staggerAnimation();
    }
    
    showCard(card) {
        card.classList.remove('hidden');
        card.style.display = 'block';
    }
    
    hideCard(card) {
        card.classList.add('hidden');
        setTimeout(() => {
            if (card.classList.contains('hidden')) {
                card.style.display = 'none';
            }
        }, 300);
    }
    
    staggerAnimation() {
        const visibleCards = Array.from(this.projectCards).filter(card => 
            !card.classList.contains('hidden')
        );
        
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('animate-in');
        });
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.searchClear.classList.remove('show');
        this.filterProjects('', this.activeFilter);
        this.searchInput.blur();
    }
    
    showSearchClear() {
        if (this.searchInput.value.length > 0) {
            this.searchClear.classList.add('show');
        }
    }
}

// ProjectsGrid class available but not auto-initialized (handled by ProjectsLoader)
window.ProjectsGrid = ProjectsGrid;

// Advanced Search Functionality
class AdvancedSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchClear = document.getElementById('search-clear');
        this.searchData = this.buildSearchIndex();
        this.suggestions = [ 'Python', 'RAG', 'LangChain', 'AI/ML', 'AWS', 'Ollama'];
        
        this.init();
    }
    
    init() {
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        this.searchClear.addEventListener('click', () => this.clearSearch());
        
        // Add click-to-close functionality for search icon
        const searchIcon = document.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                if (this.searchResults.classList.contains('show')) {
                    this.clearSearch();
                } else {
                    this.searchInput.focus();
                }
            });
        }
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
        
        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    buildSearchIndex() {
        const data = {
            projects: [
                {
                    title: 'StudyBuddy – An Open Source Alternative to Google’s NotebookLM',
                    description: 'StudyBuddy addresses the challenge of extracting insights from static PDFs by enabling interactive, AI‑powered learning. Designed for students and researchers, it provides contextual Q&A, smart summaries, and topic modeling. Built with FastAPI, FAISS, and Ollama‑powered LLMs, it transforms documents into a secure, open‑source knowledge companion.',
                    technologies: ['LangChain', 'FAISS', 'ollama', 'Python', 'FastAPI','Docling'],
                    section: 'projects'
                },
                {
                    title: 'संवाद : Your Smart Hindi RAG Chatbot',
                    description: 'Sanvad solves the gap in Hindi AI chat systems by enabling contextual Q&A on custom documents. Built with LangChain, FAISS, and Sarvam‑m LLM, it retrieves precise information and delivers accurate Hindi responses. With a plug‑and‑play architecture, Sanvad empowers multilingual document intelligence across local and cloud environments.',
                    technologies: ['Sarvam‑m LLM', 'FAISS', 'LangChain', 'Flask', 'Hugging Face','Streamlit'],
                    section: 'projects'
                },
                {
                    title: 'CodeBuddy : AI-Powered Code & HTML Generator',
                    description: 'CodeBuddy addresses the challenge of converting design layouts into functional code by automating design‑to‑code workflows. Built with LangChain, EasyOCR, and CodeLlama, it extracts layout details from images and generates HTML, Python, SQL, or other languages. This open‑source tool streamlines development, empowering faster, smarter, and customizable code generation.',
                    technologies: ['Langchain', 'Ollama', 'Codellama', 'EasyOCR', 'Streamlit'],
                    section: 'projects'
                },
                {
                    title: 'QwenStack-RAG',
                    description: 'QwenStack‑RAG demonstrates how to transform documents into conversational knowledge using the full Qwen AI stack. It combines Qwen3 embeddings for semantic search, a reranker for passage prioritization, and a 4B LLM for fluent answers. Orchestrated with LangChain, ChromaDB, and Gradio, it delivers scalable, end‑to‑end Wikipedia QA and enterprise search.',
                    technologies: ['Langchain', 'ChromaDB', 'Ollama', 'Gradio', 'Qwen3-Embedding & Reranker'],
                    section: 'projects'
                },
                {
                    title: 'Model Context Protocol (MCP): Standardizing LLM‑Tool Integration',
                    description: 'Model Context Protocol (MCP) solves the challenge of connecting LLMs to real‑world tools by providing a standardized interface for APIs, databases, and services. Acting as a translator layer, MCP abstracts integration complexity, enabling scalable, extensible AI assistants that seamlessly perform tasks beyond text generation in enterprise and developer workflows.',
                    technologies: ['Langchain', 'Python', 'Ollama', 'langchain-mcp-adapters'],
                    section: 'projects'
                },
                {
                    title: 'AI PowerDeck: Your Dynamic Presentation Partner',
                    description: 'AI PowerDeck solves the challenge of creating presentations by using Generative AI and LLMs to automatically design dynamic, context‑aware slides. It enables users to generate compelling, topic‑driven presentations with ease and efficiency, transforming manual slide creation into an intelligent, automated process for education, business, and professional use.',
                    technologies: ['Langchain', 'Python', 'CTransformers', 'Streamlit'],
                    section: 'projects'
                }
                
            ],
            skills: [
                { name: 'Python', category: 'Programming Languages', section: 'skills' },
                { name: 'SQL (MySQL, MSSQL Server)', category: 'Programming Languages', section: 'skills' },
                { name: 'Machine Learning', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'Deep Learning', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'Neural Networks', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'Pandas', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'Data Visualization', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'Exploratory Data Analysis (EDA)', category: 'Machine Learning & Data Science', section: 'skills' },
                { name: 'NLP', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'Transformers', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'Hugging Face', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'Multilingual NLP (Translation, Transcription, Synthesis)', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'BERT', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'SBERT', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'OCR', category: 'Natural Language Processing (NLP)', section: 'skills' },
                { name: 'LLMs (Large Language Models)', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'RAG (Retrieval Augmented Generation)', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'LangChain', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'LangGraph', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'CrewAI', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'Agentic AI', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'LlamaIndex', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'ChromaDB', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'Qdrant', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'FAISS', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'LLMOps', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'Ollama', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'OpenAI', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'Finetuning LLMs', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'PEFT & LoRA', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'Chatbot Development', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'Workflow Orchestration', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'Prompt Engineering', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'Context Engineering', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'MCP (Model Context Protocol)', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'A2A (Agent to Agent Protocol)', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'Langflow', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'n8n', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'CrewAI', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'Autogen', category: 'AI-Powered Chatbots, Agents & Workflow Automation', section: 'skills' },
                { name: 'FastAPI', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'FlaskAPI', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'Microservices', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'Git', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'GitHub', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'GitLab', category: 'Microservices, Backend & Version Control', section: 'skills' },
                { name: 'LLMOps', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'AWS', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'AWS Bedrock', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'Azure Cloud', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'Azure AI', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'Google Vertex', category: 'Cloud & Deployment', section: 'skills' }
            ],
            experience: [
                {
                    title: 'Associate Consultant (GenerativeAI/Data Science/Software Development)',
                    company: 'Kiya.ai',
                    description: 'I have engineered Generative AI platforms that reduced deployment time by 60%, scaled to 2,500+ users, and boosted automation by 50% through RAG chatbots and LLM workflows. I also designed FinTech AI pipelines improving anomaly detection accuracy by 35% and developed a multilingual UPI app supporting 12+ languages for secure, scalable digital banking.',
                    section: 'experience'
                },
                {
                    title: 'Data Scientist',
                    company: 'Kiya.ai',
                    description: 'As a Data Scientist, I transformed chatbots into RAG‑powered Generative AI assistants, improving response accuracy by 25%, workflow efficiency by 40%, and reducing latency with LangChain, LlamaIndex, and vector databases. I also engineered NLP pipelines and integrated AI solutions across Web2, Web3, and Metaverse, collaborating with 25+ engineers to cut release cycles by 30%.',
                    section: 'experience'
                },
                {
                    title: 'Research Analyst Intern',
                    company: 'Findem',
                    description: 'Improved candidate classification accuracy by 15% through AI‑driven automation, engineered Python workflows boosting preprocessing by 40%, and drove 15% higher lead conversions with targeted outreach.',
                    section: 'experience'
                }
            ]
        };
        
        return data;
    }
    
    handleSearch(query) {
        if (query.length === 0) {
            this.searchClear.classList.remove('show');
            this.hideResults();
            return;
        }
        
        this.searchClear.classList.add('show');
        const results = this.performSearch(query);
        this.displayResults(results, query);
    }
    
    performSearch(query) {
        const searchTerm = query.toLowerCase();
        const results = { projects: [], skills: [], experience: [] };
        
        // Search projects
        this.searchData.projects.forEach(project => {
            const score = this.calculateRelevance(searchTerm, project);
            if (score > 0) {
                results.projects.push({ ...project, score });
            }
        });
        
        // Search skills
        this.searchData.skills.forEach(skill => {
            if (skill.name.toLowerCase().includes(searchTerm) || 
                skill.category.toLowerCase().includes(searchTerm)) {
                results.skills.push(skill);
            }
        });
        
        // Search experience
        this.searchData.experience.forEach(exp => {
            if (exp.title.toLowerCase().includes(searchTerm) || 
                exp.company.toLowerCase().includes(searchTerm) ||
                exp.description.toLowerCase().includes(searchTerm)) {
                results.experience.push(exp);
            }
        });
        
        // Sort projects by relevance
        results.projects.sort((a, b) => b.score - a.score);
        
        return results;
    }
    
    calculateRelevance(searchTerm, project) {
        let score = 0;
        
        // Title match (highest weight)
        if (project.title.toLowerCase().includes(searchTerm)) score += 10;
        
        // Description match
        if (project.description.toLowerCase().includes(searchTerm)) score += 5;
        
        // Technology match
        project.technologies.forEach(tech => {
            if (tech.toLowerCase().includes(searchTerm)) score += 3;
        });
        
        return score;
    }
    
    displayResults(results, query) {
        let html = '';
        
        // Show suggestions if query is short
        if (query.length <= 2) {
            html += this.generateSuggestions(query);
        }
        
        // Display results by category
        if (results.projects.length > 0) {
            html += this.generateCategoryResults('Projects', results.projects, query);
        }
        
        if (results.skills.length > 0) {
            html += this.generateCategoryResults('Skills', results.skills, query);
        }
        
        if (results.experience.length > 0) {
            html += this.generateCategoryResults('Experience', results.experience, query);
        }
        
        if (html === '' && query.length > 2) {
            html = '<div class="search-no-results">No results found for "' + query + '"</div>';
        }
        
        this.searchResults.innerHTML = html;
        this.showResults();
        this.attachResultListeners();
    }
    
    generateSuggestions(query) {
        return ''; // Suggestions disabled
    }
    
    generateCategoryResults(category, items, query) {
        let html = `<div class="search-category">`;
        html += `<div class="search-category-title">${category}</div>`;
        
        items.slice(0, 3).forEach(item => {
            const title = item.title || item.name;
            const description = item.description || item.company || item.category;
            
            html += `<div class="search-item" data-section="${item.section}">`;
            html += `<div class="search-item-title">${this.highlightText(title, query)}</div>`;
            if (description) {
                html += `<div class="search-item-description">${this.highlightText(description, query)}</div>`;
            }
            html += `</div>`;
        });
        
        html += '</div>';
        return html;
    }
    
    highlightText(text, query) {
        if (query.length < 2) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    attachResultListeners() {
        // Handle suggestion clicks
        document.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                this.searchInput.value = suggestion.dataset.suggestion;
                this.handleSearch(suggestion.dataset.suggestion);
            });
        });
        
        // Handle result clicks
        document.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateToSection(section);
                this.clearSearch();
            });
        });
    }
    
    navigateToSection(section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showSuggestions() {
        // Suggestions disabled
    }
    
    showResults() {
        this.searchResults.classList.add('show');
    }
    
    hideResults() {
        this.searchResults.classList.remove('show');
    }
    
    clearSearch() {
        this.searchInput.value = '';
        this.searchClear.classList.remove('show');
        this.hideResults();
        this.searchInput.blur(); // Dismiss mobile keyboard
    }
    
    handleKeyboard(e) {
        // ESC key to close
        if (e.key === 'Escape') {
            this.clearSearch();
            this.searchInput.blur();
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedSearch();
});

// Phase 1 Interactive Features

// Animated Counter Function
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        if (start >= target) {
            clearInterval(timer);
            element.textContent = target + '+';
        }
    }, 16);
}

// Stat Bar Animation (About section only)
function animateStatBars() {
    const statFills = document.querySelectorAll('.stat-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width;
                setTimeout(() => {
                    fill.style.width = width;
                }, 200);
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });
    
    statFills.forEach(fill => {
        observer.observe(fill);
    });
}

// Counter Animation Observer
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Achievement Badge Interactions
function initAchievementBadges() {
    const badges = document.querySelectorAll('.achievement-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px) scale(1.05)';
            const icon = badge.querySelector('.badge-icon');
            icon.style.animation = 'bounce 0.6s ease';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0) scale(1)';
        });
        
        badge.addEventListener('click', () => {
            badge.style.animation = 'pulse 0.6s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 600);
        });
    });
}

// Enhanced Project Card 3D Effects
function init3DProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-15px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// Initialize all Phase 1 features
document.addEventListener('DOMContentLoaded', () => {
    // Delay initialization to ensure DOM is fully loaded
    setTimeout(() => {
        initCounterAnimation();
        animateStatBars();
        initAchievementBadges();
        init3DProjectCards();
    }, 500);
});

// Console greeting
// Experience Section Toggle Details
function toggleDetails(element) {
    const achievements = element.parentElement.querySelector('.experience-achievements');
    const icon = element.querySelector('i');
    const span = element.querySelector('span');
    
    element.classList.toggle('active');
    achievements.classList.toggle('show');
    
    if (achievements.classList.contains('show')) {
        span.textContent = 'Hide Details';
    } else {
        span.textContent = 'View Details';
    }
}

console.log(`
🚀 Welcome to Ishaan Kohli's Portfolio!
📧 Contact: ishaankohli14@gmail.com
🌐 LinkedIn: https://linkedin.com/in/kohli-ishaan/
💻 GitHub: https://github.com/Ginga1402

✨ Enhanced Experience Section Loaded!
🎯 Interactive Cards | 🏢 Company Logos | 📊 Expandable Details | 🎮 Hover Effects

Thanks for checking out my portfolio! 
Feel free to reach out if you'd like to work together.
`);

