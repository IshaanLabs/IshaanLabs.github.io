// Projects Search & Filter Functionality
class ProjectsGrid {
    constructor() {
        this.searchInput = document.getElementById('project-search-input');
        this.searchClear = document.getElementById('project-search-clear');
        this.projectTags = document.querySelectorAll('.project-tag');
        this.projectCards = document.querySelectorAll('.project-card');
        this.noResultsMessage = document.getElementById('no-projects-found');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        // Search input events
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showSearchClear());
        
        // Clear search button
        this.searchClear.addEventListener('click', () => this.clearSearch());
        
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
        let visibleCount = 0;
        
        this.projectCards.forEach(card => {
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
        if (visibleCount === 0) {
            this.noResultsMessage.style.display = 'block';
        } else {
            this.noResultsMessage.style.display = 'none';
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsGrid();
});

// Add animation class to CSS
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);