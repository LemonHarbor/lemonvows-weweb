<template>
  <div class="lv-settings">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-settings-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Einstellungen' }}</h2>
                <p>{{ content.subtitle || 'Verwalten Sie Ihre Hochzeitseinstellungen und Präferenzen' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Settings Sections -->
      <div class="lv-settings-sections">
        <!-- Wedding Details Section -->
        <div class="lv-settings-section lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-header">
              <h3>{{ content.weddingDetailsTitle || 'Hochzeitsdetails' }}</h3>
            </div>
            <div class="lv-card-body lv-p-3">
              <form @submit.prevent="saveWeddingDetails">
                <div class="lv-row">
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="weddingTitle">{{ content.weddingTitleLabel || 'Hochzeitstitel' }}*</label>
                      <input type="text" class="lv-form-control" id="weddingTitle" v-model="weddingDetails.title" required>
                    </div>
                  </div>
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="weddingDate">{{ content.weddingDateLabel || 'Hochzeitsdatum' }}*</label>
                      <input type="date" class="lv-form-control" id="weddingDate" v-model="weddingDetails.date" required>
                    </div>
                  </div>
                </div>
                
                <div class="lv-row">
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="partner1Name">{{ content.partner1NameLabel || 'Name Partner 1' }}*</label>
                      <input type="text" class="lv-form-control" id="partner1Name" v-model="weddingDetails.partner1_name" required>
                    </div>
                  </div>
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="partner2Name">{{ content.partner2NameLabel || 'Name Partner 2' }}*</label>
                      <input type="text" class="lv-form-control" id="partner2Name" v-model="weddingDetails.partner2_name" required>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label" for="weddingLocation">{{ content.weddingLocationLabel || 'Hochzeitsort' }}</label>
                  <input type="text" class="lv-form-control" id="weddingLocation" v-model="weddingDetails.location">
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label" for="weddingDescription">{{ content.weddingDescriptionLabel || 'Beschreibung' }}</label>
                  <textarea class="lv-form-control" id="weddingDescription" v-model="weddingDetails.description" rows="3"></textarea>
                </div>
                
                <div class="lv-form-actions">
                  <button type="submit" class="lv-btn lv-btn-primary">{{ content.saveButtonText || 'Speichern' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Appearance Settings Section -->
        <div class="lv-settings-section lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-header">
              <h3>{{ content.appearanceTitle || 'Erscheinungsbild' }}</h3>
            </div>
            <div class="lv-card-body lv-p-3">
              <form @submit.prevent="saveAppearanceSettings">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.colorSchemeLabel || 'Farbschema' }}</label>
                  <div class="lv-color-scheme-selector">
                    <div 
                      v-for="scheme in colorSchemes" 
                      :key="scheme.id" 
                      class="lv-color-scheme-option" 
                      :class="{ 'lv-color-scheme-active': appearanceSettings.color_scheme === scheme.id }"
                      @click="selectColorScheme(scheme.id)"
                    >
                      <div class="lv-color-scheme-preview">
                        <div class="lv-color-primary" :style="{ backgroundColor: scheme.primary }"></div>
                        <div class="lv-color-secondary" :style="{ backgroundColor: scheme.secondary }"></div>
                        <div class="lv-color-accent" :style="{ backgroundColor: scheme.accent }"></div>
                      </div>
                      <div class="lv-color-scheme-name">{{ scheme.name }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.fontLabel || 'Schriftart' }}</label>
                  <div class="lv-font-selector">
                    <div 
                      v-for="font in fonts" 
                      :key="font.id" 
                      class="lv-font-option" 
                      :class="{ 'lv-font-active': appearanceSettings.font === font.id }"
                      @click="selectFont(font.id)"
                      :style="{ fontFamily: font.family }"
                    >
                      {{ font.name }}
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label" for="headerImage">{{ content.headerImageLabel || 'Header-Bild' }}</label>
                  <div class="lv-image-upload">
                    <div class="lv-image-preview" v-if="headerImagePreview">
                      <img :src="headerImagePreview" alt="Header-Bild Vorschau">
                      <button type="button" class="lv-btn-icon lv-remove-image" @click="removeHeaderImage">&times;</button>
                    </div>
                    <div class="lv-upload-placeholder" v-else @click="triggerHeaderImageUpload">
                      <span class="lv-upload-icon">📷</span>
                      <span>{{ content.uploadImageText || 'Bild hochladen' }}</span>
                    </div>
                    <input 
                      type="file" 
                      id="headerImage" 
                      ref="headerImageInput" 
                      style="display: none" 
                      accept="image/*" 
                      @change="handleHeaderImageUpload"
                    >
                  </div>
                </div>
                
                <div class="lv-form-actions">
                  <button type="submit" class="lv-btn lv-btn-primary">{{ content.saveButtonText || 'Speichern' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Notification Settings Section -->
        <div class="lv-settings-section lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-header">
              <h3>{{ content.notificationsTitle || 'Benachrichtigungen' }}</h3>
            </div>
            <div class="lv-card-body lv-p-3">
              <form @submit.prevent="saveNotificationSettings">
                <div class="lv-form-group">
                  <div class="lv-checkbox-container">
                    <input type="checkbox" id="emailNotifications" class="lv-checkbox" v-model="notificationSettings.email_enabled">
                    <label for="emailNotifications">{{ content.emailNotificationsLabel || 'E-Mail-Benachrichtigungen aktivieren' }}</label>
                  </div>
                </div>
                
                <div class="lv-form-group" v-if="notificationSettings.email_enabled">
                  <label class="lv-form-label">{{ content.notifyOnLabel || 'Benachrichtigen bei' }}</label>
                  <div class="lv-checkbox-list">
                    <div class="lv-checkbox-container">
                      <input type="checkbox" id="notifyRsvp" class="lv-checkbox" v-model="notificationSettings.notify_rsvp">
                      <label for="notifyRsvp">{{ content.rsvpUpdatesLabel || 'RSVP-Aktualisierungen' }}</label>
                    </div>
                    <div class="lv-checkbox-container">
                      <input type="checkbox" id="notifyComments" class="lv-checkbox" v-model="notificationSettings.notify_comments">
                      <label for="notifyComments">{{ content.commentNotificationsLabel || 'Neue Kommentare' }}</label>
                    </div>
                    <div class="lv-checkbox-container">
                      <input type="checkbox" id="notifyPhotos" class="lv-checkbox" v-model="notificationSettings.notify_photos">
                      <label for="notifyPhotos">{{ content.photoUploadsLabel || 'Neue Fotos' }}</label>
                    </div>
                    <div class="lv-checkbox-container">
                      <input type="checkbox" id="notifyPolls" class="lv-checkbox" v-model="notificationSettings.notify_polls">
                      <label for="notifyPolls">{{ content.pollVotesLabel || 'Umfrage-Abstimmungen' }}</label>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <div class="lv-checkbox-container">
                    <input type="checkbox" id="reminderEnabled" class="lv-checkbox" v-model="notificationSettings.reminders_enabled">
                    <label for="reminderEnabled">{{ content.remindersLabel || 'Erinnerungen aktivieren' }}</label>
                  </div>
                </div>
                
                <div class="lv-form-group" v-if="notificationSettings.reminders_enabled">
                  <label class="lv-form-label" for="reminderDays">{{ content.reminderDaysLabel || 'Tage vor der Hochzeit erinnern' }}</label>
                  <select class="lv-form-control" id="reminderDays" v-model="notificationSettings.reminder_days">
                    <option value="1">1 Tag</option>
                    <option value="3">3 Tage</option>
                    <option value="7">1 Woche</option>
                    <option value="14">2 Wochen</option>
                    <option value="30">1 Monat</option>
                  </select>
                </div>
                
                <div class="lv-form-actions">
                  <button type="submit" class="lv-btn lv-btn-primary">{{ content.saveButtonText || 'Speichern' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Privacy Settings Section -->
        <div class="lv-settings-section lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-header">
              <h3>{{ content.privacyTitle || 'Datenschutz' }}</h3>
            </div>
            <div class="lv-card-body lv-p-3">
              <form @submit.prevent="savePrivacySettings">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.guestAccessLabel || 'Gastzugriff' }}</label>
                  <div class="lv-radio-list">
                    <div class="lv-radio-container">
                      <input type="radio" id="accessPublic" name="accessLevel" class="lv-radio" value="public" v-model="privacySettings.access_level">
                      <label for="accessPublic">{{ content.publicAccessLabel || 'Öffentlich (Jeder mit dem Link kann zugreifen)' }}</label>
                    </div>
                    <div class="lv-radio-container">
                      <input type="radio" id="accessInvited" name="accessLevel" class="lv-radio" value="invited" v-model="privacySettings.access_level">
                      <label for="accessInvited">{{ content.invitedOnlyLabel || 'Nur eingeladene Gäste (Anmeldung erforderlich)' }}</label>
                    </div>
                    <div class="lv-radio-container">
                      <input type="radio" id="accessPassword" name="accessLevel" class="lv-radio" value="password" v-model="privacySettings.access_level">
                      <label for="accessPassword">{{ content.passwordProtectedLabel || 'Passwortgeschützt' }}</label>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group" v-if="privacySettings.access_level === 'password'">
                  <label class="lv-form-label" for="sitePassword">{{ content.passwordLabel || 'Passwort' }}</label>
                  <input type="password" class="lv-form-control" id="sitePassword" v-model="privacySettings.site_password">
                </div>
                
                <div class="lv-form-group">
                  <div class="lv-checkbox-container">
                    <input type="checkbox" id="showGuestList" class="lv-checkbox" v-model="privacySettings.show_guest_list">
                    <label for="showGuestList">{{ content.showGuestListLabel || 'Gästeliste für alle Gäste sichtbar machen' }}</label>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <div class="lv-checkbox-container">
                    <input type="checkbox" id="showRsvpStatus" class="lv-checkbox" v-model="privacySettings.show_rsvp_status">
                    <label for="showRsvpStatus">{{ content.showRsvpStatusLabel || 'RSVP-Status für alle Gäste sichtbar machen' }}</label>
                  </div>
                </div>
                
                <div class="lv-form-actions">
                  <button type="submit" class="lv-btn lv-btn-primary">{{ content.saveButtonText || 'Speichern' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Account Settings Section -->
        <div class="lv-settings-section lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-header">
              <h3>{{ content.accountTitle || 'Konto' }}</h3>
            </div>
            <div class="lv-card-body lv-p-3">
              <form @submit.prevent="saveAccountSettings">
                <div class="lv-row">
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="accountName">{{ content.nameLabel || 'Name' }}</label>
                      <input type="text" class="lv-form-control" id="accountName" v-model="accountSettings.name">
                    </div>
                  </div>
                  <div class="lv-col lv-col-md-6">
                    <div class="lv-form-group">
                      <label class="lv-form-label" for="accountEmail">{{ content.emailLabel || 'E-Mail' }}</label>
                      <input type="email" class="lv-form-control" id="accountEmail" v-model="accountSettings.email" disabled>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <button type="button" class="lv-btn lv-btn-outline" @click="showChangePasswordForm = !showChangePasswordForm">
                    {{ content.changePasswordButtonText || 'Passwort ändern' }}
                  </button>
                </div>
                
                <div v-if="showChangePasswordForm">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="currentPassword">{{ content.currentPasswordLabel || 'Aktuelles Passwort' }}</label>
                    <input type="password" class="lv-form-control" id="currentPassword" v-model="passwordChange.current_password">
                  </div>
                  
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="newPassword">{{ content.newPasswordLabel || 'Neues Passwort' }}</label>
                    <input type="password" class="lv-form-control" id="newPassword" v-model="passwordChange.new_password">
                  </div>
                  
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="confirmPassword">{{ content.confirmPasswordLabel || 'Passwort bestätigen' }}</label>
                    <input type="password" class="lv-form-control" id="confirmPassword" v-model="passwordChange.confirm_password">
                  </div>
                  
                  <div class="lv-form-group">
                    <button type="button" class="lv-btn lv-btn-primary" @click="changePassword">
                      {{ content.updatePasswordButtonText || 'Passwort aktualisieren' }}
                    </button>
                  </div>
                </div>
                
                <div class="lv-form-actions">
                  <button type="submit" class="lv-btn lv-btn-primary">{{ content.saveButtonText || 'Speichern' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Success Message Toast -->
    <div class="lv-toast lv-toast-success" :class="{ 'lv-toast-visible': showSuccessToast }">
      <div class="lv-toast-icon">✓</div>
      <div class="lv-toast-message">{{ successMessage }}</div>
    </div>
    
    <!-- Error Message Toast -->
    <div class="lv-toast lv-toast-error" :class="{ 'lv-toast-visible': showErrorToast }">
      <div class="lv-toast-icon">✗</div>
      <div class="lv-toast-message">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: { type: Object, required: true },
  },
  data() {
    return {
      // Supabase client (will be initialized in mounted)
      supabase: null,
      weddingId: null,
      userId: null,
      
      // Settings data
      weddingDetails: {
        title: '',
        date: '',
        partner1_name: '',
        partner2_name: '',
        location: '',
        description: ''
      },
      
      appearanceSettings: {
        color_scheme: 'classic',
        font: 'roboto',
        header_image_url: null
      },
      
      notificationSettings: {
        email_enabled: true,
        notify_rsvp: true,
        notify_comments: true,
        notify_photos: true,
        notify_polls: true,
        reminders_enabled: true,
        reminder_days: '7'
      },
      
      privacySettings: {
        access_level: 'invited',
        site_password: '',
        show_guest_list: true,
        show_rsvp_status: true
      },
      
      accountSettings: {
        name: '',
        email: ''
      },
      
      // UI state
      showChangePasswordForm: false,
      passwordChange: {
        current_password: '',
        new_password: '',
        confirm_password: ''
      },
      headerImageFile: null,
      headerImagePreview: null,
      showSuccessToast: false,
      showErrorToast: false,
      successMessage: '',
      errorMessage: '',
      
      // Options
      colorSchemes: [
        { id: 'classic', name: 'Klassisch', primary: '#4285F4', secondary: '#EA4335', accent: '#FBBC05' },
        { id: 'romantic', name: 'Romantisch', primary: '#E91E63', secondary: '#9C27B0', accent: '#FF9800' },
        { id: 'natural', name: 'Natürlich', primary: '#4CAF50', secondary: '#8BC34A', accent: '#FFC107' },
        { id: 'elegant', name: 'Elegant', primary: '#3F51B5', secondary: '#673AB7', accent: '#00BCD4' },
        { id: 'rustic', name: 'Rustikal', primary: '#795548', secondary: '#FF5722', accent: '#CDDC39' }
      ],
      fonts: [
        { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif' },
        { id: 'opensans', name: 'Open Sans', family: 'Open Sans, sans-serif' },
        { id: 'lato', name: 'Lato', family: 'Lato, sans-serif' },
        { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif' },
        { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display, serif' }
      ]
    };
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get user and wedding info
    await this.getCurrentUserInfo();
    
    // Load settings
    if (this.weddingId) {
      await Promise.all([
        this.loadWeddingDetails(),
        this.loadAppearanceSettings(),
        this.loadNotificationSettings(),
        this.loadPrivacySettings()
      ]);
    }
  },
  methods: {
    // Supabase Integration
    initSupabase() {
      // Get Supabase client from window (initialized in WeWeb)
      if (window.supabase) {
        this.supabase = window.supabase;
      } else {
        console.error('Supabase client not found');
      }
    },
    
    async getCurrentUserInfo() {
      try {
        if (!this.supabase) return;
        
        // Get current user
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return;
        
        this.userId = user.id;
        this.accountSettings.email = user.email;
        
        // Get user profile with wedding ID and name
        const { data: userData, error: userError } = await this.supabase
          .from('users')
          .select('wedding_id, name')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        this.weddingId = userData.wedding_id;
        this.accountSettings.name = userData.name;
      } catch (error) {
        console.error('Error getting user info:', error);
        this.showError('Fehler beim Laden der Benutzerinformationen.');
      }
    },
    
    async loadWeddingDetails() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('weddings')
          .select('*')
          .eq('id', this.weddingId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          this.weddingDetails = {
            title: data.title || '',
            date: data.wedding_date || '',
            partner1_name: data.partner1_name || '',
            partner2_name: data.partner2_name || '',
            location: data.location || '',
            description: data.description || ''
          };
        }
      } catch (error) {
        console.error('Error loading wedding details:', error);
        this.showError('Fehler beim Laden der Hochzeitsdetails.');
      }
    },
    
    async loadAppearanceSettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get appearance settings from settings table
        const { data, error } = await this.supabase
          .from('settings')
          .select('setting_value')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'appearance')
          .eq('is_active', true)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          const settings = JSON.parse(data.setting_value);
          this.appearanceSettings = {
            ...this.appearanceSettings,
            ...settings
          };
          
          // Set header image preview if exists
          if (this.appearanceSettings.header_image_url) {
            this.headerImagePreview = this.appearanceSettings.header_image_url;
          }
        }
      } catch (error) {
        console.error('Error loading appearance settings:', error);
        this.showError('Fehler beim Laden der Erscheinungsbildeinstellungen.');
      }
    },
    
    async loadNotificationSettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get notification settings from settings table
        const { data, error } = await this.supabase
          .from('settings')
          .select('setting_value')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'notifications')
          .eq('is_active', true)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          const settings = JSON.parse(data.setting_value);
          this.notificationSettings = {
            ...this.notificationSettings,
            ...settings
          };
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        this.showError('Fehler beim Laden der Benachrichtigungseinstellungen.');
      }
    },
    
    async loadPrivacySettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get privacy settings from settings table
        const { data, error } = await this.supabase
          .from('settings')
          .select('setting_value')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'privacy')
          .eq('is_active', true)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          const settings = JSON.parse(data.setting_value);
          this.privacySettings = {
            ...this.privacySettings,
            ...settings
          };
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error);
        this.showError('Fehler beim Laden der Datenschutzeinstellungen.');
      }
    },
    
    async saveWeddingDetails() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Update wedding details
        const { error } = await this.supabase
          .from('weddings')
          .update({
            title: this.weddingDetails.title,
            wedding_date: this.weddingDetails.date,
            partner1_name: this.weddingDetails.partner1_name,
            partner2_name: this.weddingDetails.partner2_name,
            location: this.weddingDetails.location,
            description: this.weddingDetails.description
          })
          .eq('id', this.weddingId);
        
        if (error) throw error;
        
        this.showSuccess('Hochzeitsdetails erfolgreich gespeichert.');
      } catch (error) {
        console.error('Error saving wedding details:', error);
        this.showError('Fehler beim Speichern der Hochzeitsdetails.');
      }
    },
    
    async saveAppearanceSettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Upload header image if selected
        if (this.headerImageFile) {
          await this.uploadHeaderImage();
        }
        
        // Check if setting already exists
        const { data: existingData, error: checkError } = await this.supabase
          .from('settings')
          .select('id')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'appearance')
          .eq('is_active', true);
        
        if (checkError) throw checkError;
        
        const settingValue = JSON.stringify(this.appearanceSettings);
        
        if (existingData && existingData.length > 0) {
          // Update existing setting
          const { error } = await this.supabase
            .from('settings')
            .update({ setting_value: settingValue })
            .eq('id', existingData[0].id);
          
          if (error) throw error;
        } else {
          // Create new setting
          const { error } = await this.supabase
            .from('settings')
            .insert([{
              wedding_id: this.weddingId,
              setting_key: 'appearance',
              setting_value: settingValue
            }]);
          
          if (error) throw error;
        }
        
        this.showSuccess('Erscheinungsbildeinstellungen erfolgreich gespeichert.');
      } catch (error) {
        console.error('Error saving appearance settings:', error);
        this.showError('Fehler beim Speichern der Erscheinungsbildeinstellungen.');
      }
    },
    
    async saveNotificationSettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Check if setting already exists
        const { data: existingData, error: checkError } = await this.supabase
          .from('settings')
          .select('id')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'notifications')
          .eq('is_active', true);
        
        if (checkError) throw checkError;
        
        const settingValue = JSON.stringify(this.notificationSettings);
        
        if (existingData && existingData.length > 0) {
          // Update existing setting
          const { error } = await this.supabase
            .from('settings')
            .update({ setting_value: settingValue })
            .eq('id', existingData[0].id);
          
          if (error) throw error;
        } else {
          // Create new setting
          const { error } = await this.supabase
            .from('settings')
            .insert([{
              wedding_id: this.weddingId,
              setting_key: 'notifications',
              setting_value: settingValue
            }]);
          
          if (error) throw error;
        }
        
        this.showSuccess('Benachrichtigungseinstellungen erfolgreich gespeichert.');
      } catch (error) {
        console.error('Error saving notification settings:', error);
        this.showError('Fehler beim Speichern der Benachrichtigungseinstellungen.');
      }
    },
    
    async savePrivacySettings() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Check if setting already exists
        const { data: existingData, error: checkError } = await this.supabase
          .from('settings')
          .select('id')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'privacy')
          .eq('is_active', true);
        
        if (checkError) throw checkError;
        
        const settingValue = JSON.stringify(this.privacySettings);
        
        if (existingData && existingData.length > 0) {
          // Update existing setting
          const { error } = await this.supabase
            .from('settings')
            .update({ setting_value: settingValue })
            .eq('id', existingData[0].id);
          
          if (error) throw error;
        } else {
          // Create new setting
          const { error } = await this.supabase
            .from('settings')
            .insert([{
              wedding_id: this.weddingId,
              setting_key: 'privacy',
              setting_value: settingValue
            }]);
          
          if (error) throw error;
        }
        
        this.showSuccess('Datenschutzeinstellungen erfolgreich gespeichert.');
      } catch (error) {
        console.error('Error saving privacy settings:', error);
        this.showError('Fehler beim Speichern der Datenschutzeinstellungen.');
      }
    },
    
    async saveAccountSettings() {
      try {
        if (!this.supabase || !this.userId) return;
        
        // Update user profile
        const { error } = await this.supabase
          .from('users')
          .update({
            name: this.accountSettings.name
          })
          .eq('id', this.userId);
        
        if (error) throw error;
        
        this.showSuccess('Kontoeinstellungen erfolgreich gespeichert.');
      } catch (error) {
        console.error('Error saving account settings:', error);
        this.showError('Fehler beim Speichern der Kontoeinstellungen.');
      }
    },
    
    async changePassword() {
      try {
        if (!this.supabase) return;
        
        // Validate passwords
        if (!this.passwordChange.current_password) {
          this.showError('Bitte geben Sie Ihr aktuelles Passwort ein.');
          return;
        }
        
        if (!this.passwordChange.new_password) {
          this.showError('Bitte geben Sie ein neues Passwort ein.');
          return;
        }
        
        if (this.passwordChange.new_password !== this.passwordChange.confirm_password) {
          this.showError('Die Passwörter stimmen nicht überein.');
          return;
        }
        
        // Update password
        const { error } = await this.supabase.auth.updateUser({
          password: this.passwordChange.new_password
        });
        
        if (error) throw error;
        
        // Reset form
        this.passwordChange = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
        this.showChangePasswordForm = false;
        
        this.showSuccess('Passwort erfolgreich geändert.');
      } catch (error) {
        console.error('Error changing password:', error);
        this.showError('Fehler beim Ändern des Passworts.');
      }
    },
    
    async uploadHeaderImage() {
      try {
        if (!this.supabase || !this.headerImageFile || !this.weddingId) return;
        
        // Generate a unique file name
        const fileExt = this.headerImageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${this.weddingId}/header/${fileName}`;
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await this.supabase.storage
          .from('wedding_images')
          .upload(filePath, this.headerImageFile);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = this.supabase.storage
          .from('wedding_images')
          .getPublicUrl(filePath);
        
        // Update appearance settings with new header image URL
        this.appearanceSettings.header_image_url = publicUrl;
        
        // Reset file input
        this.headerImageFile = null;
      } catch (error) {
        console.error('Error uploading header image:', error);
        this.showError('Fehler beim Hochladen des Header-Bildes.');
      }
    },
    
    // UI Interaction Methods
    selectColorScheme(schemeId) {
      this.appearanceSettings.color_scheme = schemeId;
    },
    
    selectFont(fontId) {
      this.appearanceSettings.font = fontId;
    },
    
    triggerHeaderImageUpload() {
      this.$refs.headerImageInput.click();
    },
    
    handleHeaderImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        this.showError('Bitte wählen Sie ein gültiges Bildformat (JPEG, PNG, GIF, WebP).');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showError('Das Bild darf nicht größer als 5MB sein.');
        return;
      }
      
      this.headerImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        this.headerImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    removeHeaderImage() {
      this.headerImageFile = null;
      this.headerImagePreview = null;
      this.appearanceSettings.header_image_url = null;
    },
    
    showSuccess(message) {
      this.successMessage = message;
      this.showSuccessToast = true;
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);
    },
    
    showError(message) {
      this.errorMessage = message;
      this.showErrorToast = true;
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showErrorToast = false;
      }, 3000);
    }
  }
};
</script>

<style>
.lv-settings {
  font-family: 'Roboto', sans-serif;
  color: #333;
  position: relative;
}

.lv-container {
  padding: 15px;
}

.lv-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.lv-col {
  padding: 0 15px;
  flex: 1;
}

.lv-col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.lv-mb-3 {
  margin-bottom: 15px;
}

.lv-mt-3 {
  margin-top: 15px;
}

.lv-p-3 {
  padding: 15px;
}

.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-card-header {
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.lv-card-header h3 {
  margin: 0;
  font-size: 18px;
}

.lv-card-body {
  padding: 15px;
}

.lv-form-group {
  margin-bottom: 15px;
}

.lv-form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.lv-form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.lv-form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.lv-checkbox-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lv-checkbox {
  margin-right: 5px;
}

.lv-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.lv-radio-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.lv-radio-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lv-radio {
  margin-right: 5px;
}

.lv-form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.lv-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.lv-btn-primary {
  background-color: #007bff;
  color: white;
}

.lv-btn-primary:hover {
  background-color: #0069d9;
}

.lv-btn-outline {
  background-color: transparent;
  border: 1px solid #ccc;
}

.lv-btn-outline:hover {
  background-color: #f8f9fa;
}

.lv-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  border-radius: 4px;
}

.lv-color-scheme-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.lv-color-scheme-option {
  width: 100px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 10px;
  transition: all 0.2s;
}

.lv-color-scheme-option:hover {
  background-color: #f8f9fa;
}

.lv-color-scheme-active {
  border-color: #007bff;
  background-color: #f0f7ff;
}

.lv-color-scheme-preview {
  display: flex;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 5px;
}

.lv-color-primary, .lv-color-secondary, .lv-color-accent {
  flex: 1;
}

.lv-color-scheme-name {
  font-size: 12px;
  text-align: center;
}

.lv-font-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.lv-font-option {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.lv-font-option:hover {
  background-color: #f8f9fa;
}

.lv-font-active {
  border-color: #007bff;
  background-color: #f0f7ff;
}

.lv-image-upload {
  margin-top: 10px;
}

.lv-image-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
}

.lv-image-preview img {
  width: 100%;
  display: block;
}

.lv-remove-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

.lv-upload-placeholder {
  width: 100%;
  max-width: 300px;
  height: 150px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lv-upload-placeholder:hover {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.lv-upload-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.lv-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.lv-toast-visible {
  transform: translateY(0);
  opacity: 1;
}

.lv-toast-success {
  background-color: #d4edda;
  color: #155724;
}

.lv-toast-error {
  background-color: #f8d7da;
  color: #721c24;
}

.lv-toast-icon {
  font-size: 20px;
  font-weight: bold;
}

.lv-toast-message {
  font-size: 14px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .lv-color-scheme-selector {
    justify-content: center;
  }
  
  .lv-font-selector {
    flex-direction: column;
  }
}
</style>
