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

// Typing effect
const fullText = "Find Your Perfect Career with AI";
const typedTextElement = document.getElementById("typedText");
if (typedTextElement) {
    let index = 0;

    function typeText() {
        if (index < fullText.length) {
            const currentText = fullText.slice(0, index + 1);
            typedTextElement.innerHTML = currentText + '<span class="typing-cursor"></span>';
            index++;
            setTimeout(typeText, 50);
        } else {
            typedTextElement.innerHTML = fullText + '<span class="typing-cursor"></span>';
        }
    }

    typeText();
}

// Testimonial rotation
const testimonials = document.querySelectorAll('.testimonial-item');
const dots = document.querySelectorAll('.testimonial-dot');

if (testimonials.length > 0) {
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);

    // Dot click handlers
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentTestimonial = parseInt(dot.dataset.index);
            showTestimonial(currentTestimonial);
        });
    });
}

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}
