document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const form = document.getElementById('profileForm');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const progressSteps = Array.from(document.querySelectorAll('.progress-step'));
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentStepSpan = document.querySelector('.current-step');
    let currentStep = 1;

    // Profile photo handling
    const profilePhoto = document.getElementById('profilePhoto');
    const photoInput = document.getElementById('photoInput');
    const photoOverlay = document.querySelector('.photo-overlay');

    if (profilePhoto && photoInput) {
        profilePhoto.parentElement.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePhoto.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Skills input handling
    const skillInput = document.getElementById('skillInput');
    const skillsContainer = document.querySelector('.skills-tags');
    const skills = new Set();

    if (skillInput) {
        skillInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const skill = skillInput.value.trim();
                if (skill && !skills.has(skill)) {
                    addSkill(skill);
                    skillInput.value = '';
                }
            }
        });
    }

    function addSkill(skill) {
        skills.add(skill);
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            ${skill}
            <button type="button" onclick="removeSkill(this, '${skill}')">×</button>
        `;
        skillsContainer.appendChild(skillTag);
    }

    window.removeSkill = (button, skill) => {
        skills.delete(skill);
        button.parentElement.remove();
    };

    // Education entries handling
    const educationEntries = document.querySelector('.education-entries');
    const addEntryBtn = document.querySelector('.add-entry-btn');

    if (addEntryBtn) {
        addEntryBtn.addEventListener('click', () => {
            const entry = document.createElement('div');
            entry.className = 'education-entry';
            entry.innerHTML = `
                <div class="form-grid">
                    <div class="form-group">
                        <label>Degree Level *</label>
                        <select required>
                            <option value="">Select degree level</option>
                            <option value="high_school">High School</option>
                            <option value="bachelor">Bachelor's Degree</option>
                            <option value="master">Master's Degree</option>
                            <option value="phd">Ph.D.</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Field of Study *</label>
                        <input type="text" required placeholder="e.g., Computer Science">
                    </div>
                    <div class="form-group">
                        <label>Institution *</label>
                        <input type="text" required placeholder="Enter institution name">
                    </div>
                    <div class="form-group">
                        <label>Graduation Year *</label>
                        <input type="number" required min="1900" max="2099">
                    </div>
                </div>
                <button type="button" class="remove-entry" onclick="removeEducation(this)"><i class="fas fa-trash"></i></button>
            `;
            educationEntries.appendChild(entry);
        });
    }

    window.removeEducation = (button) => {
        button.parentElement.remove();
    };

    // Form navigation
    function updateFormStep() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep - 1);
        });

        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep - 1);
            step.classList.toggle('completed', index < currentStep - 1);
        });

        currentStepSpan.textContent = currentStep;
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === steps.length ? 'Save Profile' : 'Next';
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormStep();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length) {
                currentStep++;
                updateFormStep();
            } else {
                saveProfile();
            }
        }
    });

    function validateStep(step) {
        const currentStepElement = steps[step - 1];
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                showError(field);
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    function showError(field) {
        const existingError = field.parentElement.querySelector('.error-message');
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = 'This field is required';
            field.parentElement.appendChild(errorDiv);
        }
    }

    // Form submission
    function saveProfile() {
        // Collect all form data
        const formData = new FormData(form);
        const profileData = {
            personalInfo: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dob: formData.get('dob'),
                gender: formData.get('gender'),
                nationality: formData.get('nationality'),
                address: formData.get('address')
            },
            professionalInfo: {
                currentPosition: formData.get('currentPosition'),
                company: formData.get('company'),
                experience: formData.get('experience'),
                expectedSalary: formData.get('expectedSalary'),
                skills: Array.from(skills),
                bio: formData.get('bio')
            },
            education: Array.from(educationEntries.children).map(entry => ({
                degreeLevel: entry.querySelector('select').value,
                fieldOfStudy: entry.querySelector('input[placeholder*="Computer Science"]').value,
                institution: entry.querySelector('input[placeholder*="institution"]').value,
                graduationYear: entry.querySelector('input[type="number"]').value
            })),
            preferences: {
                jobTypes: Array.from(document.querySelectorAll('input[name="jobType"]:checked')).map(cb => cb.value),
                workLocation: Array.from(document.querySelectorAll('input[name="workLocation"]:checked')).map(cb => cb.value),
                additionalPreferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value),
                noticePeriod: formData.get('notice-period')
            }
        };

        // In a real application, you would send this data to your backend
        console.log('Profile data to be saved:', profileData);
        
        // Show success message
        showNotification('Profile saved successfully!', 'success');
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Initialize form
    updateFormStep();
}); 