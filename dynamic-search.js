// Dynamic Search System
class DynamicSearch {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchClear = document.getElementById('search-clear');
        this.searchData = null;
        
        this.init();
    }
    
    async init() {
        this.searchData = await this.buildSearchIndex();
        
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchClear.addEventListener('click', () => this.clearSearch());
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });
    }
    
    async buildSearchIndex() {
        let projects = [];
        
        try {
            const response = await fetch('./projects.json');
            const data = await response.json();
            projects = data.projects.map(project => ({
                ...project,
                section: 'projects'
            }));
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
        
        return {
            projects: projects,
            skills: [
                { name: 'Python', category: 'Programming Languages', section: 'skills' },
                { name: 'LangChain', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'RAG', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'FAISS', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'ChromaDB', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'CrewAI', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'LangGraph', category: 'Generative AI & LLMs', section: 'skills' },
                { name: 'AWS', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'Azure', category: 'Cloud & Deployment', section: 'skills' },
                { name: 'FastAPI', category: 'Microservices, Backend & Version Control', section: 'skills' }
            ],
            experience: [
                {
                    title: 'Associate Consultant (GenerativeAI/Data Science/Software Development)',
                    company: 'Kiya.ai',
                    description: 'Generative AI, RAG Chatbots, LLM Workflows, No-Code AI Platforms, FinTech AI, Anomaly Detection, Multilingual AI Systems, Voice-Enabled Banking Apps, Context-Aware Automation, Microservices Architecture, AWS, Azure, OpenAI, Anthropic, Mistral, LLaMA, CrewAI, LangGraph, SBERT, NER, Zero-Shot Classification',
                    section: 'experience'
                },
                {
                    title: 'Data Scientist',
                    company: 'Kiya.ai',
                    description: 'Data Science, Generative AI, RAG Chatbots, Contextual QA Systems, SBERT, LangChain, LlamaIndex, FAISS, ChromaDB, NLP Pipelines, Conversation Summarization, Sentiment Analysis, Intent Analysis, Latency Reduction, Web2 AI Integration, Web3 AI Integration, Metaverse AI Integration, FastAPI',
                    section: 'experience'
                },
                {
                    title: 'Research Analyst Intern',
                    company: 'Findem',
                    description: 'AI-Driven Automation, Candidate Classification, Python Workflows, Data Analysis, Preprocessing Optimization, Machine Learning Models, Lead Conversion Optimization, Targeted Outreach, Data Extraction, Workflow Automation',
                    section: 'experience'
                }
            ]
        };
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
        if (!this.searchData) return { projects: [], skills: [], experience: [] };
        
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
        
        results.projects.sort((a, b) => b.score - a.score);
        return results;
    }
    
    calculateRelevance(searchTerm, project) {
        let score = 0;
        
        if (project.title.toLowerCase().includes(searchTerm)) score += 10;
        if (project.description.toLowerCase().includes(searchTerm)) score += 5;
        if (project.technologies && project.technologies.some(tech => 
            tech.toLowerCase().includes(searchTerm))) score += 3;
        if (project.tags && project.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm))) score += 3;
        
        return score;
    }
    
    displayResults(results, query) {
        let html = '';
        
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
        this.searchInput.blur();
    }
}

// Initialize dynamic search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicSearch();
});