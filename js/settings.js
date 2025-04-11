class UserSettings {
    constructor() {
        this.settings = {
            profile: {
                visibility: 'public',
                showResume: true,
                allowMessages: true,
                emailNotifications: true
            },
            jobPreferences: {
                desiredSalary: {
                    min: 800000,
                    max: 3000000,
                    currency: 'MMK'
                },
                jobTypes: ['full-time', 'part-time'],
                locations: ['Yangon', 'Mandalay'],
                remotePreference: 'hybrid',
                industries: ['technology', 'marketing'],
                experienceLevel: 'mid-level'
            },
            notifications: {
                email: {
                    jobAlerts: true,
                    applicationUpdates: true,
                    companyMessages: true,
                    newsletters: false
                },
                push: {
                    newJobs: true,
                    applicationStatus: true,
                    messages: true
                },
                frequency: 'daily'
            },
            privacy: {
                profileVisibility: 'public',
                resumeVisibility: 'connections',
                showContactInfo: false,
                dataSharing: 'minimal'
            },
            appearance: {
                theme: 'light',
                fontSize: 'medium',
                language: 'en',
                timeZone: 'Asia/Yangon'
            },
            security: {
                twoFactorAuth: false,
                loginAlerts: true,
                deviceManagement: [],
                passwordLastChanged: null
            }
        };

        this.initializeSettings();
    }

    async initializeSettings() {
        try {
            // Load settings from backend
            const savedSettings = await this.loadSettingsFromBackend();
            if (savedSettings) {
                this.settings = { ...this.settings, ...savedSettings };
            }
            this.renderSettings();
            this.attachEventListeners();
        } catch (error) {
            console.error('Error initializing settings:', error);
        }
    }

    async loadSettingsFromBackend() {
        // TODO: Implement API call to load user settings
        return null;
    }

    async saveSettings(section, data) {
        try {
            // TODO: Implement API call to save settings
            console.log(`Saving ${section} settings:`, data);
            return true;
        } catch (error) {
            console.error(`Error saving ${section} settings:`, error);
            return false;
        }
    }

    renderSettings() {
        const settingsContainer = document.getElementById('settingsContainer');
        if (!settingsContainer) return;

        settingsContainer.innerHTML = `
            <div class="settings-sections">
                <div class="settings-nav">
                    <button class="settings-nav-item active" data-section="profile">Profile Settings</button>
                    <button class="settings-nav-item" data-section="jobs">Job Preferences</button>
                    <button class="settings-nav-item" data-section="notifications">Notifications</button>
                    <button class="settings-nav-item" data-section="privacy">Privacy</button>
                    <button class="settings-nav-item" data-section="appearance">Appearance</button>
                    <button class="settings-nav-item" data-section="security">Security</button>
                </div>
                
                <div class="settings-content">
                    ${this.renderProfileSettings()}
                    ${this.renderJobPreferences()}
                    ${this.renderNotificationSettings()}
                    ${this.renderPrivacySettings()}
                    ${this.renderAppearanceSettings()}
                    ${this.renderSecuritySettings()}
                </div>
            </div>
        `;
    }

    renderProfileSettings() {
        return `
            <div class="settings-section active" id="profileSettings">
                <h2>Profile Settings</h2>
                <div class="setting-group">
                    <label>Profile Visibility</label>
                    <select name="visibility">
                        <option value="public" ${this.settings.profile.visibility === 'public' ? 'selected' : ''}>Public</option>
                        <option value="connections" ${this.settings.profile.visibility === 'connections' ? 'selected' : ''}>Connections Only</option>
                        <option value="private" ${this.settings.profile.visibility === 'private' ? 'selected' : ''}>Private</option>
                    </select>
                </div>
                <!-- Add more profile settings -->
            </div>
        `;
    }

    renderJobPreferences() {
        return `
            <div class="settings-section" id="jobPreferences">
                <h2>Job Preferences</h2>
                <div class="setting-group">
                    <label>Desired Salary Range (MMK)</label>
                    <div class="salary-range">
                        <input type="number" name="minSalary" value="${this.settings.jobPreferences.desiredSalary.min}">
                        <span>to</span>
                        <input type="number" name="maxSalary" value="${this.settings.jobPreferences.desiredSalary.max}">
                    </div>
                </div>
                <!-- Add more job preference settings -->
            </div>
        `;
    }

    renderNotificationSettings() {
        return `
            <div class="settings-section" id="notificationSettings">
                <h2>Notification Settings</h2>
                <div class="setting-group">
                    <label>Email Notifications</label>
                    <div class="notification-options">
                        <label class="checkbox">
                            <input type="checkbox" name="jobAlerts" ${this.settings.notifications.email.jobAlerts ? 'checked' : ''}>
                            Job Alerts
                        </label>
                        <!-- Add more notification options -->
                    </div>
                </div>
            </div>
        `;
    }

    renderPrivacySettings() {
        return `
            <div class="settings-section" id="privacySettings">
                <h2>Privacy Settings</h2>
                <div class="setting-group">
                    <label>Profile Visibility</label>
                    <select name="profileVisibility">
                        <option value="public" ${this.settings.privacy.profileVisibility === 'public' ? 'selected' : ''}>Public</option>
                        <option value="connections" ${this.settings.privacy.profileVisibility === 'connections' ? 'selected' : ''}>Connections Only</option>
                        <option value="private" ${this.settings.privacy.profileVisibility === 'private' ? 'selected' : ''}>Private</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderAppearanceSettings() {
        return `
            <div class="settings-section" id="appearanceSettings">
                <h2>Appearance Settings</h2>
                <div class="setting-group">
                    <label>Theme</label>
                    <select name="theme">
                        <option value="light" ${this.settings.appearance.theme === 'light' ? 'selected' : ''}>Light</option>
                        <option value="dark" ${this.settings.appearance.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="system" ${this.settings.appearance.theme === 'system' ? 'selected' : ''}>System</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderSecuritySettings() {
        return `
            <div class="settings-section" id="securitySettings">
                <h2>Security Settings</h2>
                <div class="setting-group">
                    <label>Two-Factor Authentication</label>
                    <div class="toggle-switch">
                        <input type="checkbox" name="twoFactorAuth" ${this.settings.security.twoFactorAuth ? 'checked' : ''}>
                        <span class="slider"></span>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Navigation
        document.querySelectorAll('.settings-nav-item').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Form submissions
        document.querySelectorAll('.settings-section form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const section = e.target.closest('.settings-section').id;
                const formData = new FormData(e.target);
                this.handleSettingsUpdate(section, formData);
            });
        });

        // Individual setting changes
        document.querySelectorAll('.setting-group input, .setting-group select').forEach(input => {
            input.addEventListener('change', (e) => {
                const section = e.target.closest('.settings-section').id;
                const setting = e.target.name;
                const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                this.handleSettingChange(section, setting, value);
            });
        });
    }

    switchSection(sectionId) {
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.settings-nav-item').forEach(button => {
            button.classList.remove('active');
        });
        
        document.querySelector(`#${sectionId}Settings`).classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    }

    async handleSettingChange(section, setting, value) {
        try {
            // Update local state
            const sectionPath = section.replace('Settings', '');
            if (this.settings[sectionPath]) {
                if (setting.includes('.')) {
                    const [parent, child] = setting.split('.');
                    this.settings[sectionPath][parent][child] = value;
                } else {
                    this.settings[sectionPath][setting] = value;
                }
            }

            // Save to backend
            await this.saveSettings(sectionPath, { [setting]: value });
            
            // Show success message
            this.showNotification('Settings updated successfully', 'success');
        } catch (error) {
            this.showNotification('Failed to update settings', 'error');
            console.error('Error updating setting:', error);
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize settings when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.userSettings = new UserSettings();
}); 