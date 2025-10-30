// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    }
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
}

// Sidebar Toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
}

// Active Navigation Link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// DSA Practice - LeetCode API Integration
const API_BASE_URL = 'https://alfa-leetcode-api.onrender.com';

// State management
let filters = {
    difficulty: '',
    tags: [],
    limit: 20,
    skip: 0
};

let currentProblems = [];

// Set difficulty filter
function setDifficulty(difficulty) {
    filters.difficulty = difficulty;
    
    // Update button states
    document.querySelectorAll('[data-testid^="button-difficulty-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (difficulty === '') {
        document.querySelector('[data-testid="button-difficulty-all"]').classList.add('active');
    } else {
        document.querySelector(`[data-testid="button-difficulty-${difficulty.toLowerCase()}"]`).classList.add('active');
    }
}

// Toggle tag filter
function toggleTag(tag) {
    const index = filters.tags.indexOf(tag);
    if (index > -1) {
        filters.tags.splice(index, 1);
    } else {
        filters.tags.push(tag);
    }
    
    // Update button states
    const tagButtons = document.querySelectorAll('[data-testid^="button-tag-"]');
    tagButtons.forEach(btn => {
        const btnTag = btn.textContent.toLowerCase().replace(/\s+/g, '-');
        if (filters.tags.includes(btnTag)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Set limit
function setLimit(limit) {
    filters.limit = limit;
    
    // Update button states
    document.querySelectorAll('[data-testid^="button-limit-"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-testid="button-limit-${limit}"]`).classList.add('active');
}

// Apply skip
function applySkip() {
    const skipInput = document.getElementById('skipInput');
    filters.skip = parseInt(skipInput.value) || 0;
    fetchProblems();
}

// Reset all filters
function resetFilters() {
    filters = {
        difficulty: '',
        tags: [],
        limit: 20,
        skip: 0
    };
    
    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[data-testid="button-difficulty-all"]').classList.add('active');
    document.querySelector('[data-testid="button-limit-20"]').classList.add('active');
    document.getElementById('skipInput').value = 0;
    
    fetchProblems();
}

// Build API URL
function buildApiUrl() {
    let url = `${API_BASE_URL}/problems?`;
    const params = [];
    
    if (filters.difficulty) {
        params.push(`difficulty=${filters.difficulty}`);
    }
    
    if (filters.tags.length > 0) {
        params.push(`tags=${filters.tags.join('+')}`);
    }
    
    if (filters.limit) {
        params.push(`limit=${filters.limit}`);
    }
    
    if (filters.skip > 0) {
        params.push(`skip=${filters.skip}`);
    }
    
    return url + params.join('&');
}

// Fetch problems from API
async function fetchProblems() {
    const loadingState = document.getElementById('loadingState');
    const problemsContainer = document.getElementById('problemsContainer');
    const statsBar = document.getElementById('statsBar');
    
    // Show loading state
    loadingState.style.display = 'block';
    problemsContainer.innerHTML = '';
    statsBar.style.display = 'none';
    
    try {
        const url = buildApiUrl();
        console.log('Fetching from:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        currentProblems = data.problemsetQuestionList || [];
        
        // Hide loading, show stats and problems
        loadingState.style.display = 'none';
        statsBar.style.display = 'flex';
        
        // Update stats
        updateStats();
        
        // Render problems
        renderProblems(currentProblems);
        
        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
    } catch (error) {
        console.error('Error fetching problems:', error);
        loadingState.style.display = 'none';
        problemsContainer.innerHTML = `
            <div class="card" style="padding: 2rem; text-align: center;">
                <h3 style="color: var(--danger); margin-bottom: 1rem;">Error Loading Problems</h3>
                <p style="color: var(--muted-foreground); margin-bottom: 1rem;">
                    ${error.message}
                </p>
                <p style="color: var(--muted-foreground); font-size: 0.875rem;">
                    The API might be temporarily unavailable. Please try again later.
                </p>
                <button class="btn btn-primary" onclick="fetchProblems()" style="margin-top: 1rem;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Update stats display
function updateStats() {
    const problemCount = document.getElementById('problemCount');
    const activeFilters = document.getElementById('activeFilters');
    
    problemCount.textContent = `${currentProblems.length} problem${currentProblems.length !== 1 ? 's' : ''}`;
    
    const filterParts = [];
    if (filters.difficulty) filterParts.push(filters.difficulty);
    if (filters.tags.length > 0) filterParts.push(filters.tags.join(', '));
    if (filters.skip > 0) filterParts.push(`skip ${filters.skip}`);
    
    activeFilters.textContent = filterParts.length > 0 ? filterParts.join(' • ') : 'No filters';
}

// Get difficulty class
function getDifficultyClass(difficulty) {
    if (!difficulty) return 'difficulty-medium';
    const level = difficulty.toLowerCase();
    if (level === 'easy') return 'difficulty-easy';
    if (level === 'medium') return 'difficulty-medium';
    if (level === 'hard') return 'difficulty-hard';
    return 'difficulty-medium';
}

// Render problems
function renderProblems(problems) {
    const container = document.getElementById('problemsContainer');
    
    if (problems.length === 0) {
        container.innerHTML = `
            <div class="card" style="padding: 2rem; text-align: center;">
                <h3 style="margin-bottom: 1rem;">No Problems Found</h3>
                <p style="color: var(--muted-foreground);">
                    Try adjusting your filters or reset them to see all problems.
                </p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = problems.map(problem => {
        const difficulty = problem.difficulty || 'Medium';
        const title = problem.title || problem.questionTitle || 'Untitled';
        const titleSlug = problem.titleSlug || '';
        const acRate = problem.acRate ? parseFloat(problem.acRate).toFixed(1) : 'N/A';
        const topics = problem.topicTags || [];
        
        return `
            <div class="problem-card" data-testid="card-problem-${titleSlug}">
                <div class="problem-header">
                    <div>
                        <div class="problem-title">${title}</div>
                        <div class="problem-tags">
                            <span class="tag ${getDifficultyClass(difficulty)}">${difficulty}</span>
                            ${topics.slice(0, 5).map(topic => `
                                <span class="tag">${topic.name || topic}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.875rem; color: var(--muted-foreground);">
                            ${acRate}% AC
                        </div>
                        ${titleSlug ? `
                            <button class="btn btn-outline" onclick="fetchSolution('${titleSlug}')" 
                                    style="margin-top: 0.5rem; font-size: 0.75rem; padding: 0.25rem 0.75rem;"
                                    data-testid="button-solution-${titleSlug}">
                                <i data-lucide="lightbulb" style="width: 14px; height: 14px;"></i>
                                Solution
                            </button>
                        ` : ''}
                    </div>
                </div>
                ${titleSlug ? `
                    <div style="margin-top: 1rem;">
                        <a href="https://leetcode.com/problems/${titleSlug}" 
                           target="_blank" 
                           class="btn btn-primary"
                           style="font-size: 0.875rem; padding: 0.5rem 1rem;"
                           data-testid="link-leetcode-${titleSlug}">
                            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                            Open on LeetCode
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Fetch official solution
async function fetchSolution(titleSlug) {
    const solutionModal = document.getElementById('solutionModal');
    const solutionContent = document.getElementById('solutionContent');
    
    solutionContent.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading solution...</div>';
    solutionModal.style.display = 'block';
    
    try {
        const response = await fetch(`${API_BASE_URL}/officialSolution?titleSlug=${titleSlug}`);
        
        if (!response.ok) {
            throw new Error('Solution not available');
        }
        
        const data = await response.json();
        
        if (data && data.content) {
            // Display solution content
            solutionContent.innerHTML = `
                <h4 style="margin-bottom: 1rem;">${data.title || 'Official Solution'}</h4>
                <div style="white-space: pre-wrap;">${data.content || 'No solution content available'}</div>
            `;
        } else {
            solutionContent.innerHTML = `
                <div style="text-align: center; color: var(--muted-foreground);">
                    <p>Official solution is not available for this problem.</p>
                    <p style="margin-top: 1rem; font-size: 0.875rem;">
                        Try solving it yourself or check the LeetCode discussion section!
                    </p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching solution:', error);
        solutionContent.innerHTML = `
            <div style="text-align: center; color: var(--danger);">
                <p>Failed to load solution: ${error.message}</p>
                <p style="margin-top: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
                    The solution might not be available for this problem.
                </p>
            </div>
        `;
    }
    
    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Close solution modal
function closeSolution() {
    document.getElementById('solutionModal').style.display = 'none';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active states
    document.querySelector('[data-testid="button-difficulty-all"]').classList.add('active');
    document.querySelector('[data-testid="button-limit-20"]').classList.add('active');
    
    // Load initial problems
    fetchProblems();
});

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
