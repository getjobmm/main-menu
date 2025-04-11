// Initialize all components when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeNotifications();
    initializeSearch();
    initializeApplicationsChart();
    initializeCategoriesChart();
    setupEventListeners();
    startRealTimeUpdates();
});

// Sidebar functionality
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const mainContent = document.querySelector('.main-content');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle sidebar
    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Handle active menu items
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Notifications system
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationBadge = document.querySelector('.notification-badge');
    let notifications = [];

    async function fetchNotifications() {
        try {
            const response = await fetch('/api/notifications');
            const data = await response.json();
            notifications = data;
            updateNotificationBadge();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            showToast('Error loading notifications', 'error');
        }
    }

    function updateNotificationBadge() {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationBadge.textContent = unreadCount;
        notificationBadge.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    // Refresh notifications every minute
    fetchNotifications();
    setInterval(fetchNotifications, 60000);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;

    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = e.target.value.trim();
            if (query.length < 2) return;

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const results = await response.json();
                displaySearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                showToast('Error performing search', 'error');
            }
        }, 300);
    });
}

// Charts initialization
function initializeApplicationsChart() {
    const ctx = document.getElementById('applicationsChart')?.getContext('2d');
    if (!ctx) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June'];
    const applicationData = [1250, 1450, 1800, 1600, 2100, 1800];
    const placementData = [450, 550, 680, 590, 780, 650];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Job Applications',
                    data: applicationData,
                    borderColor: '#4763E4',
                    backgroundColor: 'rgba(71, 99, 228, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                },
                {
                    label: 'Successful Placements',
                    data: placementData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        boxWidth: 6,
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        callback: function(value) {
                            return value.toLocaleString();
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 6,
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 10
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    radius: 0,
                    hoverRadius: 6
                },
                line: {
                    borderWidth: 2
                }
            }
        }
    });
}

function initializeCategoriesChart() {
    const ctx = document.getElementById('categoriesChart')?.getContext('2d');
    if (!ctx) return;

    const categories = [
        'IT & Software',
        'Sales & Marketing',
        'Engineering',
        'Finance & Banking',
        'Design & Creative',
        'Customer Service'
    ];

    const jobCounts = [450, 380, 320, 280, 220, 180];

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Active Jobs',
                data: jobCounts,
                backgroundColor: [
                    '#4763E4',
                    '#22c55e',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6',
                    '#ec4899'
                ],
                borderRadius: 8,
                maxBarThickness: 35,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 10,
                    left: 20
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toLocaleString()} jobs`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        callback: function(value) {
                            return value.toLocaleString();
                        },
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 11
                        },
                        padding: 10
                    }
                }
            }
        }
    });
}

// Event listeners setup
function setupEventListeners() {
    // Handle approval/rejection
    document.addEventListener('click', async (e) => {
        if (e.target.matches('.approve-btn, .reject-btn')) {
            const action = e.target.classList.contains('approve-btn') ? 'approve' : 'reject';
            const itemId = e.target.dataset.id;
            const itemType = e.target.dataset.type;

            try {
                const response = await fetch(`/api/${itemType}/${itemId}/${action}`, {
                    method: 'POST'
                });
                
                if (response.ok) {
                    showToast(`${itemType} ${action}d successfully`, 'success');
                    updateDashboardStats();
                } else {
                    throw new Error('Action failed');
                }
            } catch (error) {
                console.error(`Error ${action}ing ${itemType}:`, error);
                showToast(`Error ${action}ing ${itemType}`, 'error');
            }
        }
    });

    // Handle delete actions
    document.addEventListener('click', async (e) => {
        if (e.target.matches('.delete-btn')) {
            if (!confirm('Are you sure you want to delete this item?')) return;

            const itemId = e.target.dataset.id;
            const itemType = e.target.dataset.type;

            try {
                const response = await fetch(`/api/${itemType}/${itemId}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToast(`${itemType} deleted successfully`, 'success');
                    e.target.closest('tr')?.remove();
                    updateDashboardStats();
                } else {
                    throw new Error('Delete failed');
                }
            } catch (error) {
                console.error(`Error deleting ${itemType}:`, error);
                showToast(`Error deleting ${itemType}`, 'error');
            }
        }
    });

    // File upload handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    showToast('File uploaded successfully', 'success');
                } else {
                    throw new Error('Upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                showToast('Error uploading file', 'error');
            }
        });
    });
}

// Real-time updates
function startRealTimeUpdates() {
    // Update dashboard statistics every 5 minutes
    setInterval(updateDashboardStats, 300000);

    // Check for new notifications every minute
    setInterval(checkNewNotifications, 60000);
}

// Update dashboard statistics
async function updateDashboardStats() {
    try {
        const response = await fetch('/api/dashboard/stats');
        const stats = await response.json();
        
        // Update stats cards
        Object.entries(stats).forEach(([key, value]) => {
            const statElement = document.querySelector(`#${key}Stat`);
            if (statElement) {
                statElement.textContent = value.toLocaleString();
            }
        });

        // Update trend indicators
        Object.entries(stats.trends).forEach(([key, value]) => {
            const trendElement = document.querySelector(`#${key}Trend`);
            if (trendElement) {
                const isPositive = value > 0;
                trendElement.className = `stat-trend ${isPositive ? 'positive' : 'negative'}`;
                trendElement.innerHTML = `
                    <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
                    ${Math.abs(value)}%
                `;
            }
        });
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger reflow to enable animation
    toast.offsetHeight;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Helper function to format dates
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`/api/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        showToast('An error occurred while processing your request', 'error');
        throw error;
    }
}