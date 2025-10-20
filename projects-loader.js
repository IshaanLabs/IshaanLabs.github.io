// Dynamic Projects Loader with Filter Integration and Pagination
class ProjectsLoader {
    constructor() {
        this.projectsContainer = document.getElementById('projects-grid');
        this.projects = [];
        this.filteredProjects = [];
        this.currentPage = 1;
        this.projectsPerPage = 6;
        this.activeFilter = 'all';
        this.searchTerm = '';
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.sortProjectsByIndex();
        this.applyFilters();
        this.initializeFilters();
        this.initializePagination();
    }
    
    async loadProjects() {
        try {
            const response = await fetch('./projects.json');
            const data = await response.json();
            this.projects = data.projects;
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.projects = [];
        }
    }
    
    sortProjectsByIndex() {
        this.projects.sort((a, b) => (b.index || 0) - (a.index || 0));
    }
    
    renderProjects() {
        if (!this.projectsContainer) return;
        
        this.projectsContainer.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * this.projectsPerPage;
        const endIndex = startIndex + this.projectsPerPage;
        const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);
        
        if (projectsToShow.length === 0) {
            this.showNoResults();
            this.hidePagination();
            return;
        }
        
        this.hideNoResults();
        
        projectsToShow.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsContainer.appendChild(projectCard);
        });
        
        this.updatePagination();
    }
    
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tags', project.tags.join(','));
        
        card.innerHTML = `
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${this.createProjectLinks(project.links)}
                </div>
            </div>
        `;
        
        return card;
    }
    
    createProjectLinks(links) {
        let linksHtml = '';
        
        if (links.github) {
            linksHtml += `<a href="${links.github}" target="_blank" class="project-link" title="GitHub Repository"><i class="fab fa-github"></i></a>`;
        }
        
        if (links.linkedin) {
            linksHtml += `<a href="${links.linkedin}" target="_blank" class="project-link" title="LinkedIn Post"><i class="fab fa-linkedin"></i></a>`;
        }
        
        if (links.demo) {
            linksHtml += `<a href="${links.demo}" target="_blank" class="project-link" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>`;
        }
        
        return linksHtml;
    }
    
    initializeFilters() {
        const searchInput = document.getElementById('project-search-input');
        const projectTags = document.querySelectorAll('.project-tag');
        
        if (!searchInput) return;
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase().trim();
            this.currentPage = 1;
            this.applyFilters();
        });
        
        // Tag filter functionality
        projectTags.forEach(tag => {
            tag.addEventListener('click', () => {
                // Update active tag
                projectTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                
                this.activeFilter = tag.dataset.filter;
                this.currentPage = 1;
                this.applyFilters();
            });
        });
    }
    
    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Check search match
            const searchMatch = this.searchTerm === '' || 
                project.title.toLowerCase().includes(this.searchTerm) || 
                project.description.toLowerCase().includes(this.searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchTerm)) ||
                project.tags.some(tag => tag.includes(this.searchTerm));
            
            // Check filter match
            const filterMatch = this.activeFilter === 'all' || project.tags.includes(this.activeFilter);
            
            return searchMatch && filterMatch;
        });
        
        this.renderProjects();
    }
    
    initializePagination() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProjects();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProjects();
                }
            });
        }
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredProjects.length / this.projectsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');
        
        if (totalPages <= 1) {
            this.hidePagination();
            return;
        }
        
        if (paginationContainer) paginationContainer.style.display = 'flex';
        if (currentPageSpan) currentPageSpan.textContent = this.currentPage;
        if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
    }
    
    hidePagination() {
        const paginationContainer = document.getElementById('pagination-container');
        if (paginationContainer) paginationContainer.style.display = 'none';
    }
    
    showNoResults() {
        const noResultsMessage = document.getElementById('no-projects-found');
        if (noResultsMessage) noResultsMessage.style.display = 'block';
    }
    
    hideNoResults() {
        const noResultsMessage = document.getElementById('no-projects-found');
        if (noResultsMessage) noResultsMessage.style.display = 'none';
    }
}

// Make ProjectsLoader available globally
window.ProjectsLoader = ProjectsLoader;

// Initialize projects loader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsLoader();
});