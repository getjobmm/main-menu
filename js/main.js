// Sample job data (in a real application, this would come from a backend)
const sampleJobs = [
    {
        id: 1,
        title: 'Senior Software Developer',
        company: 'Tech Solutions Myanmar',
        location: 'Yangon',
        salary: '2,000,000 - 3,000,000 MMK',
        type: 'Full-time',
        posted: '2 days ago'
    },
    {
        id: 2,
        title: 'Marketing Manager',
        company: 'Global Brands Co.',
        location: 'Mandalay',
        salary: '1,500,000 - 2,000,000 MMK',
        type: 'Full-time',
        posted: '1 day ago'
    },
    {
        id: 3,
        title: 'Customer Service Representative',
        company: 'Myanmar Services',
        location: 'Yangon',
        salary: '800,000 - 1,200,000 MMK',
        type: 'Part-time',
        posted: '3 days ago'
    },
    {
        id: 4,
        title: 'UI/UX Designer',
        company: 'Digital Innovations',
        location: 'Yangon',
        salary: '1,200,000 - 1,800,000 MMK',
        type: 'Full-time',
        posted: '5 days ago'
    },
    {
        id: 5,
        title: 'Sales Executive',
        company: 'Myanmar Trading Co.',
        location: 'Mandalay',
        salary: '900,000 - 1,500,000 MMK',
        type: 'Full-time',
        posted: '1 week ago'
    },
    {
        id: 6,
        title: 'Content Writer',
        company: 'Media Group Myanmar',
        location: 'Yangon',
        salary: '700,000 - 1,000,000 MMK',
        type: 'Part-time',
        posted: '2 days ago'
    }
];

// DOM Elements
const jobCardsContainer = document.getElementById('jobCards');
const searchInputs = document.querySelectorAll('.search-box input');
const searchButton = document.querySelector('.search-btn');
const themeToggle = document.getElementById('themeToggle');
const loginButton = document.querySelector('.btn-login');
const registerButton = document.querySelector('.btn-register');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeButtons = document.querySelectorAll('.close-modal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Theme Toggle Functionality
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (newTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set correct icon
    const icon = themeToggle.querySelector('i');
    if (savedTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Create job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <h3>${job.title}</h3>
        <p class="company">${job.company}</p>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
        <p class="salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</p>
        <p class="type"><i class="fas fa-clock"></i> ${job.type}</p>
        <p class="posted"><i class="fas fa-calendar"></i> ${job.posted}</p>
        <div class="job-actions">
            <button class="apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</button>
            <button class="btn btn-secondary save-job" data-job-id="${job.id}">
                <i class="far fa-bookmark"></i>
            </button>
        </div>
    `;
    
    // Add click event to apply button
    const applyBtn = card.querySelector('.apply-btn');
    applyBtn.addEventListener('click', () => {
        // Check if user is logged in (in a real app)
        const isLoggedIn = false; // This would be a real check in a production app
        
        if (isLoggedIn) {
            alert(`Application submitted for ${job.title} at ${job.company}`);
        } else {
            // Show login modal
            openModal(loginModal);
        }
    });

    // Add click event to save button
    const saveBtn = card.querySelector('.save-job');
    saveBtn.addEventListener('click', () => {
        const icon = saveBtn.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            saveBtn.setAttribute('title', 'Job Saved');
            showToast('Job saved to your bookmarks!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            saveBtn.setAttribute('title', 'Save Job');
            showToast('Job removed from your bookmarks!');
        }
    });
    
    return card;
}

// Display job cards
function displayJobs(jobs) {
    jobCardsContainer.innerHTML = '';
    jobs.forEach(job => {
        jobCardsContainer.appendChild(createJobCard(job));
    });
}

// Search functionality
function searchJobs() {
    const keyword = searchInputs[0].value.toLowerCase();
    const location = searchInputs[1].value.toLowerCase();
    
    const filteredJobs = sampleJobs.filter(job => {
        const matchesKeyword = job.title.toLowerCase().includes(keyword) ||
                             job.company.toLowerCase().includes(keyword);
        const matchesLocation = job.location.toLowerCase().includes(location);
        return matchesKeyword && matchesLocation;
    });
    
    displayJobs(filteredJobs);
}

// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);

searchButton.addEventListener('click', searchJobs);

searchInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchJobs();
        }
    });
});

loginButton.addEventListener('click', () => {
    openModal(loginModal);
});

registerButton.addEventListener('click', () => {
    openModal(registerModal);
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Form submissions
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // In a real app, this would send data to a server
    console.log('Login attempt:', { email, password });
    
    // Simulate successful login
    alert('Login successful!');
    closeModal(loginModal);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // In a real app, this would send data to a server
    console.log('Registration attempt:', { fullName, email, password });
    
    // Simulate successful registration
    alert('Registration successful! Please login.');
    closeModal(registerModal);
    openModal(loginModal);
});

// Social login buttons
document.querySelector('.btn-google').addEventListener('click', () => {
    alert('Google login functionality coming soon!');
});

document.querySelector('.btn-facebook').addEventListener('click', () => {
    alert('Facebook login functionality coming soon!');
});

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS for toast notifications
const style = document.createElement('style');
style.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 2000;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .toast i {
        font-size: 1.2em;
    }
    
    .toast-error {
        background-color: var(--error-color);
    }
    
    .toast-warning {
        background-color: var(--warning-color);
    }
`;
document.head.appendChild(style);

// Handle More Filters button
const filtersBtn = document.querySelector('.search-filters .btn:first-child');
filtersBtn.addEventListener('click', () => {
    // In a real app, this would open a filters modal or expand a filters section
    showToast('Advanced filters coming soon!', 'warning');
});

// Handle Save Search button
const saveSearchBtn = document.querySelector('.search-filters .btn:last-child');
saveSearchBtn.addEventListener('click', () => {
    // In a real app, this would save the current search parameters
    showToast('Search preferences saved!');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    displayJobs(sampleJobs);
    
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
    
    // Add animation to job cards on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all job cards
    document.querySelectorAll('.job-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        themeToggle.querySelector('i').className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        // Ready for backend
        saveUserPreference('theme', isDark ? 'light' : 'dark');
    });

    // Navigation Dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const content = dropdown.querySelector('.dropdown-content');
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                content.style.display = 'none';
            }
        });
    });

    // Search Functionality
    const searchForm = document.querySelector('.search-box');
    const jobTitleInput = searchForm.querySelector('input[placeholder="Job title or keywords"]');
    const locationInput = searchForm.querySelector('input[placeholder="City or township"]');
    const searchBtn = searchForm.querySelector('.search-btn');

    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const searchData = {
            query: jobTitleInput.value,
            location: locationInput.value
        };
        performSearch(searchData);
    });

    // Quick Filter Tags
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const filterValue = this.textContent.trim();
            applyFilter(filterValue);
        });
    });

    // Job Cards Apply Buttons
    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const jobCard = this.closest('.job-card');
            const jobData = {
                title: jobCard.querySelector('h3').textContent,
                company: jobCard.querySelector('.company').textContent,
                jobId: jobCard.dataset.jobId
            };
            handleJobApplication(jobData);
        });
    });

    // Auth Modals
    const loginBtn = document.querySelector('.btn-login');
    const registerBtn = document.querySelector('.btn-register');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeBtns = document.querySelectorAll('.close-modal');

    // Login Form
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };
        handleLogin(formData);
    });

    // Register Form
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        handleRegistration(formData);
    });

    // Social Login
    const socialButtons = document.querySelectorAll('.btn-google, .btn-facebook');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'google' : 'facebook';
            handleSocialLogin(provider);
        });
    });

    // Modal Controls
    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Helper Functions (to be implemented with backend)
    function saveUserPreference(key, value) {
        // TODO: Implement API call to save user preferences
        console.log('Saving preference:', key, value);
    }

    function performSearch(searchData) {
        // TODO: Implement API call for job search
        console.log('Searching with data:', searchData);
    }

    function applyFilter(filterValue) {
        // TODO: Implement API call for filtering
        console.log('Applying filter:', filterValue);
    }

    function handleJobApplication(jobData) {
        // TODO: Implement API call for job application
        console.log('Applying for job:', jobData);
        if (!isUserLoggedIn()) {
            loginModal.style.display = 'block';
            return;
        }
        // Show application confirmation
        alert('Application submitted successfully!');
    }

    function handleLogin(formData) {
        // TODO: Implement API call for login
        console.log('Logging in with:', formData);
    }

    function handleRegistration(formData) {
        // TODO: Implement API call for registration
        console.log('Registering with:', formData);
    }

    function handleSocialLogin(provider) {
        // TODO: Implement API call for social login
        console.log('Social login with:', provider);
    }

    function isUserLoggedIn() {
        // TODO: Implement actual auth check
        return false;
    }

    // Update Apply Buttons
    function updateApplyButtons() {
        document.querySelectorAll('.apply-btn').forEach(btn => {
            if (!btn.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-paper-plane';
                btn.prepend(icon);
            }
        });
    }
    updateApplyButtons();
}); 