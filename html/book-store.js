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

// Book Store Data
const careerBooks = [
    {
        id: 1,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Entrepreneurship",
        price: 24.99,
        rating: 4.5,
        description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
        coverColor: "bg-blue-500",
        relevance: "Essential for startup founders and product managers"
    },
    {
        id: 2,
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
        category: "Technical Interview",
        price: 39.99,
        rating: 4.8,
        description: "189 programming questions and solutions to help you ace your technical interview.",
        coverColor: "bg-green-500",
        relevance: "Must-read for software engineers"
    },
    {
        id: 3,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Improvement",
        price: 19.99,
        rating: 4.9,
        description: "An easy & proven way to build good habits & break bad ones.",
        coverColor: "bg-purple-500",
        relevance: "Build career success through small habits"
    },
    {
        id: 4,
        title: "Deep Work",
        author: "Cal Newport",
        category: "Productivity",
        price: 22.99,
        rating: 4.6,
        description: "Rules for focused success in a distracted world.",
        coverColor: "bg-indigo-500",
        relevance: "Maximize your productivity and output"
    },
    {
        id: 5,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        category: "Design",
        price: 27.99,
        rating: 4.7,
        description: "Fundamental principles of design for both designers and non-designers.",
        coverColor: "bg-pink-500",
        relevance: "Essential for UX/UI designers"
    },
    {
        id: 6,
        title: "Soft Skills",
        author: "John Sonmez",
        category: "Career Development",
        price: 21.99,
        rating: 4.4,
        description: "The software developer's life manual covering career, productivity, and personal finance.",
        coverColor: "bg-orange-500",
        relevance: "Complete career guide for developers"
    },
    {
        id: 7,
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        category: "System Design",
        price: 49.99,
        rating: 4.9,
        description: "The big ideas behind reliable, scalable, and maintainable systems.",
        coverColor: "bg-red-500",
        relevance: "Critical for backend engineers"
    },
    {
        id: 8,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Software Craftsmanship",
        price: 44.99,
        rating: 4.7,
        description: "A handbook of agile software craftsmanship.",
        coverColor: "bg-teal-500",
        relevance: "Write better, maintainable code"
    },
    {
        id: 9,
        title: "The Manager's Path",
        author: "Camille Fournier",
        category: "Leadership",
        price: 32.99,
        rating: 4.6,
        description: "A guide for tech leaders navigating growth and change.",
        coverColor: "bg-cyan-500",
        relevance: "For aspiring engineering managers"
    },
    {
        id: 10,
        title: "Think Like a Programmer",
        author: "V. Anton Spraul",
        category: "Problem Solving",
        price: 29.99,
        rating: 4.5,
        description: "An introduction to creative problem solving.",
        coverColor: "bg-yellow-500",
        relevance: "Improve problem-solving skills"
    },
    {
        id: 11,
        title: "The Pragmatic Programmer",
        author: "David Thomas & Andrew Hunt",
        category: "Software Development",
        price: 42.99,
        rating: 4.8,
        description: "Your journey to mastery in software development.",
        coverColor: "bg-emerald-500",
        relevance: "Timeless advice for all developers"
    },
    {
        id: 12,
        title: "Never Split the Difference",
        author: "Chris Voss",
        category: "Negotiation",
        price: 18.99,
        rating: 4.7,
        description: "Negotiating as if your life depended on it.",
        coverColor: "bg-violet-500",
        relevance: "Master salary negotiations"
    }
];

let selectedCategory = 'All';
let searchQuery = '';

// Get unique categories
const categories = ['All', ...Array.from(new Set(careerBooks.map(book => book.category)))];

// Render category filters
function renderCategoryFilters() {
    const filtersContainer = document.getElementById('categoryFilters');
    filtersContainer.innerHTML = categories.map(category => 
        `<span class="badge ${selectedCategory === category ? 'badge-primary' : 'badge-outline'}" data-category="${category}" style="cursor: pointer;">${category}</span>`
    ).join('');
    
    // Add click handlers
    document.querySelectorAll('[data-category]').forEach(badge => {
        badge.addEventListener('click', () => {
            selectedCategory = badge.getAttribute('data-category');
            renderCategoryFilters();
            renderBooks();
        });
    });
}

// Filter books
function filterBooks() {
    return careerBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             book.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
}

// Render books
function renderBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const noResults = document.getElementById('noResults');
    const filteredBooks = filterBooks();
    
    if (filteredBooks.length === 0) {
        booksGrid.classList.add('hidden');
        noResults.classList.remove('hidden');
    } else {
        booksGrid.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        booksGrid.innerHTML = filteredBooks.map(book => `
            <div class="card">
                <div class="card-header">
                    <div class="flex items-start gap-4">
                        <div class="${book.coverColor} rounded-md" style="height: 96px; width: 64px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="book-open" style="width: 32px; height: 32px; color: white;"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <h3 class="card-title text-lg" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${book.title}</h3>
                            <p class="text-sm text-muted mt-1">${book.author}</p>
                            <div class="flex items-center gap-1 mt-2">
                                <i data-lucide="star" style="width: 16px; height: 16px; fill: #facc15; color: #facc15;"></i>
                                <span class="text-sm font-medium">${book.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-content space-y-3">
                    <span class="badge badge-secondary">${book.category}</span>
                    <p class="text-sm text-muted" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${book.description}</p>
                    <p class="text-xs text-primary font-medium">📚 ${book.relevance}</p>
                    <div class="flex items-center justify-between pt-2">
                        <span class="text-2xl font-bold">$${book.price}</span>
                        <div class="flex gap-2">
                            <button class="btn btn-outline btn-sm" onclick="window.open('https://www.amazon.com/s?k=${encodeURIComponent(book.title)}', '_blank')">
                                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="addToCart('${book.title}')">
                                <i data-lucide="shopping-cart" style="width: 16px; height: 16px; margin-right: 4px;"></i>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    lucide.createIcons();
}

// Add to cart function
function addToCart(bookTitle) {
    alert(`"${bookTitle}" has been added to your reading list!`);
}

// Search input handler
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderBooks();
    });
}

// Initialize
renderCategoryFilters();
renderBooks();

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
