document.addEventListener('DOMContentLoaded', () => {
    // Add profile link navigation
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }

    const jobPosts = document.querySelectorAll('.job-post');

    jobPosts.forEach(post => {
        const description = post.querySelector('.job-description');
        const seeMoreBtn = post.querySelector('.see-more-btn');
        const likeBtn = post.querySelector('.like-btn');
        const commentBtn = post.querySelector('.comment-btn');
        const copyLinkBtn = post.querySelector('.copy-link-btn');
        const shareBtn = post.querySelector('.share-btn');
        const commentsSection = post.querySelector('.comments-section');
        const postId = post.dataset.postId;

        // Check if description needs a "See more..." button
        // Use scrollHeight to get the full height vs clientHeight for the visible height
        if (description.scrollHeight <= description.clientHeight) {
           if (seeMoreBtn) seeMoreBtn.style.display = 'none';
        } else {
           if (seeMoreBtn) seeMoreBtn.style.display = 'block';
        }

        // "See more..." button click handler
        if (seeMoreBtn) {
            seeMoreBtn.addEventListener('click', () => {
                description.classList.toggle('expanded');
                seeMoreBtn.textContent = description.classList.contains('expanded') ? 'See less' : 'See more...';
            });
        }

        // Like button click handler
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                likeBtn.classList.toggle('liked');
                const icon = likeBtn.querySelector('i');
                icon.classList.toggle('far'); // Toggle between regular (unliked)
                icon.classList.toggle('fas'); // and solid (liked)

                // In a real app, you would send this like action to the server
                console.log(`Post ${postId} liked state: ${likeBtn.classList.contains('liked')}`);
            });
        }

        // Comment button click handler
        if (commentBtn) {
            commentBtn.addEventListener('click', () => {
                const isVisible = commentsSection.style.display !== 'none';
                commentsSection.style.display = isVisible ? 'none' : 'block';

                // Add comment input area if it doesn't exist
                if (!isVisible && !commentsSection.querySelector('.comment-input-area')) {
                    const inputArea = document.createElement('div');
                    inputArea.className = 'comment-input-area';
                    inputArea.innerHTML = `
                        <input type="text" class="comment-input" placeholder="Add a comment...">
                        <button class="add-comment-btn">Post</button>
                    `;
                    commentsSection.appendChild(inputArea);

                    const addCommentBtn = inputArea.querySelector('.add-comment-btn');
                    const commentInput = inputArea.querySelector('.comment-input');

                    addCommentBtn.addEventListener('click', () => {
                        const commentText = commentInput.value.trim();
                        if (commentText) {
                            addComment(commentsSection, commentText);
                            commentInput.value = ''; // Clear input
                             // In a real app, send the comment to the server
                            console.log(`Comment added to post ${postId}: ${commentText}`);
                        }
                    });
                }
            });
        }

        // Copy link button click handler
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', async () => {
                const postUrl = `${window.location.origin}${window.location.pathname}?post=${postId}`;
                try {
                    await navigator.clipboard.writeText(postUrl);
                    // Optionally provide user feedback (e.g., change button text, show tooltip)
                    const originalText = copyLinkBtn.querySelector('span').textContent;
                    copyLinkBtn.querySelector('span').textContent = 'Link copied!';
                    copyLinkBtn.disabled = true;
                    setTimeout(() => {
                       copyLinkBtn.querySelector('span').textContent = originalText;
                       copyLinkBtn.disabled = false;
                    }, 2000); // Revert after 2 seconds
                    console.log(`Link copied for post ${postId}: ${postUrl}`);
                } catch (err) {
                    console.error('Failed to copy link: ', err);
                    alert('Failed to copy link.');
                }
            });
        }

        // Share button click handler (Basic Example)
        if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                const postUrl = `${window.location.origin}${window.location.pathname}?post=${postId}`;
                const jobTitle = post.querySelector('.job-title').textContent;
                const shareData = {
                    title: `Job Opportunity: ${jobTitle}`,
                    text: `Check out this job opportunity: ${jobTitle}`,
                    url: postUrl,
                };

                try {
                     if (navigator.share) {
                        await navigator.share(shareData);
                        console.log('Post shared successfully');
                    } else {
                        // Fallback for browsers that don't support Web Share API
                        alert('Sharing is not supported on this browser. You can copy the link instead.\n\n' + postUrl);
                         console.log('Web Share API not supported, showing fallback alert.');
                    }
                } catch (err) {
                    console.error('Error sharing post: ', err);
                }
            });
        }
    });

    // Function to add a comment element
    function addComment(commentsSection, text) {
         const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
         // In a real app, get the author name from the logged-in user
        commentDiv.innerHTML = `
            <span class="comment-author">You:</span>
            <p class="comment-text">${escapeHTML(text)}</p>
        `;
        // Insert the new comment before the input area
        const inputArea = commentsSection.querySelector('.comment-input-area');
        commentsSection.insertBefore(commentDiv, inputArea);
    }

    // Utility function to escape HTML to prevent XSS
     function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

});

// Function to format relative time
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// Function to format salary
function formatSalary(min, max, period) {
    if (!min && !max) return 'Salary not specified';
    
    const formatNumber = num => num.toLocaleString('en-US');
    const periodMap = {
        'yearly': '/year',
        'monthly': '/month',
        'hourly': '/hour'
    };
    
    if (min && max) {
        return `$${formatNumber(min)} - $${formatNumber(max)}${periodMap[period] || ''}`;
    } else if (min) {
        return `From $${formatNumber(min)}${periodMap[period] || ''}`;
    } else {
        return `Up to $${formatNumber(max)}${periodMap[period] || ''}`;
    }
}

// Function to create job post HTML
function createJobPostHTML(job) {
    const benefitsList = job.benefits ? job.benefits.join(', ') : '';
    const otherBenefits = job.other_benefits ? `Other benefits: ${job.other_benefits}` : '';
    const benefits = [benefitsList, otherBenefits].filter(Boolean).join('. ');
    
    return `
        <div class="job-post" data-job-id="${job.id}">
            <div class="post-header">
                <img src="images/company-default.png" alt="${job.company}" class="company-logo">
                <div class="poster-info">
                    <span class="company-name">${job.company}</span>
                    <span class="post-time">${getRelativeTime(job.posted_date)}</span>
                    <span class="job-type"><i class="fas fa-briefcase"></i> ${job.job_type}</span>
                    <span class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                </div>
            </div>
            <h2 class="job-title">${job.title}</h2>
            <div class="salary-range">
                <i class="fas fa-money-bill-wave"></i> 
                ${formatSalary(job.salary_min, job.salary_max, job.salary_period)}
            </div>
            <p class="job-description">${job.description}</p>
            ${job.skills ? `
                <div class="job-tags">
                    ${job.skills.map(skill => `<span class="tag">${skill}</span>`).join('')}
                </div>
            ` : ''}
            <div class="benefits-section">
                ${benefits ? `<p class="benefits"><i class="fas fa-gift"></i> ${benefits}</p>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn apply-btn"><i class="fas fa-paper-plane"></i> Quick Apply</button>
                <button class="action-btn"><i class="far fa-heart"></i> Like</button>
                <button class="action-btn"><i class="far fa-comment"></i> Comment</button>
                <button class="action-btn"><i class="fas fa-link"></i> Copy Link</button>
                <button class="action-btn"><i class="fas fa-share-alt"></i> Share</button>
            </div>
            <div class="post-stats">
                <span class="stat-item"><i class="fas fa-user"></i> New</span>
                <span class="stat-item"><i class="far fa-clock"></i> Until ${new Date(job.deadline).toLocaleDateString()}</span>
                <span class="stat-item"><i class="fas fa-users"></i> ${job.positions} position${job.positions > 1 ? 's' : ''}</span>
            </div>
        </div>
    `;
}

// Function to load and display jobs
async function loadJobs() {
    const container = document.querySelector('.newsfeed-container');
    try {
        const response = await fetch('/api/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        
        const jobs = await response.json();
        
        if (jobs.length === 0) {
            container.innerHTML = '<p class="no-jobs">No jobs available at the moment.</p>';
            return;
        }
        
        container.innerHTML = jobs.map(job => createJobPostHTML(job)).join('');
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        container.innerHTML = '<p class="error-message">Failed to load jobs. Please try again later.</p>';
    }
}

// Function to refresh jobs (can be called from superadmin.html)
window.refreshJobs = loadJobs;

// Initial load
document.addEventListener('DOMContentLoaded', loadJobs);

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // TODO: Implement filtering logic
    });
}); 