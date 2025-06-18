// Animated headline (typewriter effect)
const headline = document.getElementById('animated-headline');
const headlineText = 'blogging';
let headlineIndex = 0;
let typingForward = true;
function animateHeadline() {
    if (typingForward) {
        headlineIndex++;
        if (headlineIndex > headlineText.length) {
            typingForward = false;
            setTimeout(animateHeadline, 1200);
            return;
        }
    } else {
        headlineIndex--;
        if (headlineIndex < 0) {
            typingForward = true;
            setTimeout(animateHeadline, 600);
            return;
        }
    }
    headline.textContent = headlineText.slice(0, headlineIndex);
    setTimeout(animateHeadline, typingForward ? 120 : 60);
}
if (headline) animateHeadline();

// Badge pop effect (already animated in CSS)

// Search feedback
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const searchFeedback = document.getElementById('search-feedback');

function showSearchFeedback(msg, isError = true) {
    searchFeedback.textContent = msg;
    searchFeedback.style.color = isError ? '#b91c1c' : '#22c55e';
}

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const value = searchInput.value.trim().toLowerCase();
        if (!value) {
            showSearchFeedback('No results found. Try another keyword!');
            showBlogGrid(true, blogPosts);
        } else {
            // Check if the search matches a category
            const categoryMatch = ['technology', 'startup', 'lifestyle', 'finance', 'food', 'travel'].find(cat => cat === value);
            let filtered;
            if (categoryMatch) {
                filtered = blogPosts.filter(post => post.category.toLowerCase() === value);
            } else {
                filtered = blogPosts.filter(post =>
                    post.title.toLowerCase().includes(value) ||
                    post.desc.toLowerCase().includes(value) ||
                    post.category.toLowerCase().includes(value)
                );
            }
            if (filtered.length === 0) {
                showSearchFeedback('No results found. Try another keyword!');
            } else {
                showSearchFeedback('');
            }
            showBlogGrid(true, filtered);
        }
    });
    searchInput.addEventListener('focus', () => searchFeedback.textContent = '');
}

// Category button interactivity
const catBtns = document.querySelectorAll('.cat-btn');
catBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        catBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 400);
    });
    btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Accessibility: focus management for category buttons
catBtns.forEach(btn => {
    btn.addEventListener('focus', function () {
        this.classList.add('focus-visible');
    });
    btn.addEventListener('blur', function () {
        this.classList.remove('focus-visible');
    });
});

// Blog data (sample)
const blogPosts = [
    {
        title: "A detailed step by step guide to manage your lifestyle",
        desc: "A Simple Step-by-Step Guide to Managing Your Lifestyle",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
        category: "Lifestyle"
    },
    {
        title: "How to create an effective startup roadmap or ideas",
        desc: "Creating an effective startup roadmap helps you turn an idea into a structure",
        image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
        category: "Startup"
    },
    {
        title: "Learning new technology to boost your career in software",
        desc: "Learning New Tech to Boost Your Software Career",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
        category: "Technology"
    },
    {
        title: "Tips for getting the most out of apps and software",
        desc: "Tips for Getting the Most Out of Apps and Software\nWe use tons of app",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
        category: "Technology"
    },
    {
        title: "Enhancing your skills and capturing memorable moments",
        desc: "",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        category: "Lifestyle"
    },
    {
        title: "Maximizing returns by minimizing resources in your startup",
        desc: "",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
        category: "Startup"
    },
    {
        title: "Taxes on Luxury Houses",
        desc: "",
        image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
        category: "Finance"
    },
    {
        title: "The New Way of Study",
        desc: "The New Way of Study in the Digital Era",
        image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
        category: "Startup"
    },
    {
        title: "Exploring the World: Top Travel Destinations for 2024",
        desc: "Discover the most exciting places to visit this year and what makes them special.",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
        category: "Travel"
    },
    {
        title: "Healthy Eating on a Budget",
        desc: "Tips and tricks for maintaining a healthy diet without breaking the bank.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        category: "Food"
    },
    {
        title: "The Rise of Remote Work",
        desc: "How remote work is changing the landscape of modern employment.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
        category: "Technology"
    },
    {
        title: "Mindfulness for Beginners",
        desc: "Simple mindfulness practices to reduce stress and improve well-being.",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        category: "Lifestyle"
    },
    {
        title: "Investing 101: Getting Started with Stocks",
        desc: "A beginner's guide to understanding and investing in the stock market.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
        category: "Finance"
    },
    {
        title: "Travel Photography Tips",
        desc: "How to capture stunning photos on your next adventure.",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
        category: "Travel"
    }
];

function renderBlogGrid(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    grid.innerHTML = posts.map(post => `
    <div class="blog-card">
      <a href="blog.html?id=${post.id || ''}" class="blog-card-link" style="text-decoration:none;color:inherit;display:block;height:100%">
        <img class="blog-card-img" src="${post.image}" alt="${post.title}">
        <div class="blog-card-content">
          <span class="blog-card-badge">${post.category}</span>
          <div class="blog-card-title">${post.title}</div>
          <div class="blog-card-desc">${post.desc}</div>
        </div>
      </a>
    </div>
  `).join('');
}

function showBlogGrid(show, posts = []) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    grid.style.display = show ? 'grid' : 'none';
    if (show) renderBlogGrid(posts);
}

// Show blogs when a category is clicked
catBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const category = this.textContent.trim();
        if (category === 'All') {
            showBlogGrid(true, blogPosts);
        } else {
            const filtered = blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
            showBlogGrid(true, filtered);
        }
    });
});

// Optionally, show blogs on page load if 'All' is active
window.addEventListener('DOMContentLoaded', () => {
    const allBtn = Array.from(catBtns).find(btn => btn.textContent.trim() === 'All');
    if (allBtn && allBtn.classList.contains('active')) {
        showBlogGrid(true, blogPosts);
    }
});

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners to category tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            tags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
        });
    });

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add scroll event listener for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = 'white';
    }
});

// Show/Hide Password Toggle
function setupPasswordToggles() {
    document.querySelectorAll('.password-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input[type="password"], input[type="text"]');
        const btn = wrapper.querySelector('.toggle-password');
        if (input && btn) {
            btn.addEventListener('click', function () {
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                    btn.setAttribute('aria-label', 'Hide password');
                } else {
                    input.type = 'password';
                    btn.innerHTML = '<i class="fas fa-eye"></i>';
                    btn.setAttribute('aria-label', 'Show password');
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', setupPasswordToggles);

// Handle Signup Form Submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('signup-password').value;
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({ name, email }));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (err) {
            alert('Signup failed');
        }
    });
}

// Handle Login Form Submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
                window.location.href = 'dashboard.html';
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            alert('Login failed');
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (typeof renderBlogGrid === 'function') {
        renderBlogGrid(blogPosts);
    }
});

// Add this after successful blog addition in your add blog form handler
// Example:
const addBlogForm = document.getElementById('addBlogForm');
if (addBlogForm) {
    addBlogForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        // ... your blog creation logic ...
        // On success:
        window.location.href = 'blog-list.html';
    });
} 