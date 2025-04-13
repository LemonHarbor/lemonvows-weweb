<template>
  <div class="lv-settings">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-settings-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <h2>{{ content.title || 'Einstellungen' }}</h2>
            <p>{{ content.subtitle || 'Passen Sie Ihre Hochzeitsplanungs-App an Ihre Bedürfnisse an' }}</p>
          </div>
        </div>
      </div>
      
      <!-- Settings Navigation and Content -->
      <div class="lv-row">
        <!-- Settings Navigation -->
        <div class="lv-col lv-col-md-3">
          <div class="lv-settings-nav lv-mb-3">
            <div 
              v-for="(item, index) in content.navigationItems" 
              :key="index" 
              class="lv-settings-nav-item" 
              :class="{ 'lv-settings-nav-active': activeTab === item.id }"
              @click="setActiveTab(item.id)">
              <div class="lv-settings-nav-icon">{{ item.icon }}</div>
              <div class="lv-settings-nav-text">{{ item.label }}</div>
            </div>
          </div>
        </div>
        
        <!-- Settings Content -->
        <div class="lv-col lv-col-md-9">
          <!-- Design Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'design' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.colorSchemeTitle || 'Farbschema' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.predefinedPalettesLabel || 'Vordefinierte Farbpaletten' }}</label>
                  <div class="lv-color-palettes">
                    <div 
                      v-for="(palette, index) in content.colorPalettes" 
                      :key="index" 
                      class="lv-color-palette" 
                      :class="{ 'lv-color-palette-active': selectedPalette === palette.id }"
                      @click="selectPalette(palette.id)">
                      <div 
                        v-for="(color, colorIndex) in palette.colors" 
                        :key="colorIndex" 
                        class="lv-color-swatch" 
                        :style="{ backgroundColor: color }">
                      </div>
                      <div class="lv-color-palette-name">{{ palette.name }}</div>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.customColorsLabel || 'Individuelle Farben' }}</label>
                  <div class="lv-row">
                    <div class="lv-col lv-col-md-6">
                      <div class="lv-color-picker-group">
                        <label class="lv-color-picker-label">{{ content.primaryColorLabel || 'Primärfarbe' }}</label>
                        <div class="lv-color-picker">
                          <input type="color" v-model="customColors.primary" @change="updateCustomColors">
                          <span class="lv-color-value">{{ customColors.primary }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="lv-col lv-col-md-6">
                      <div class="lv-color-picker-group">
                        <label class="lv-color-picker-label">{{ content.secondaryColorLabel || 'Sekundärfarbe' }}</label>
                        <div class="lv-color-picker">
                          <input type="color" v-model="customColors.secondary" @change="updateCustomColors">
                          <span class="lv-color-value">{{ customColors.secondary }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lv-row">
                    <div class="lv-col lv-col-md-6">
                      <div class="lv-color-picker-group">
                        <label class="lv-color-picker-label">{{ content.accentColorLabel || 'Akzentfarbe' }}</label>
                        <div class="lv-color-picker">
                          <input type="color" v-model="customColors.accent" @change="updateCustomColors">
                          <span class="lv-color-value">{{ customColors.accent }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="lv-col lv-col-md-6">
                      <div class="lv-color-picker-group">
                        <label class="lv-color-picker-label">{{ content.textColorLabel || 'Textfarbe' }}</label>
                        <div class="lv-color-picker">
                          <input type="color" v-model="customColors.text" @change="updateCustomColors">
                          <span class="lv-color-value">{{ customColors.text }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.fontsTitle || 'Schriftarten' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.headingFontLabel || 'Überschriften' }}</label>
                  <select class="lv-form-control" v-model="selectedFonts.heading" @change="updateFonts">
                    <option v-for="(font, index) in content.headingFonts" :key="index" :value="font">{{ font }}</option>
                  </select>
                  <div class="lv-font-preview" :style="{ fontFamily: selectedFonts.heading }">
                    <h2>{{ content.headingPreviewText || 'Überschrift Vorschau' }}</h2>
                    <h3>{{ content.subheadingPreviewText || 'Unterüberschrift Vorschau' }}</h3>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.bodyFontLabel || 'Fließtext' }}</label>
                  <select class="lv-form-control" v-model="selectedFonts.body" @change="updateFonts">
                    <option v-for="(font, index) in content.bodyFonts" :key="index" :value="font">{{ font }}</option>
                  </select>
                  <div class="lv-font-preview" :style="{ fontFamily: selectedFonts.body }">
                    <p>{{ content.bodyPreviewText1 || 'Dies ist ein Beispieltext, um die ausgewählte Schriftart zu demonstrieren. Der Text sollte gut lesbar sein und angenehm wirken.' }}</p>
                    <p>{{ content.bodyPreviewText2 || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.appearanceTitle || 'Erscheinungsbild' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.darkModeLabel || 'Dunkelmodus' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="darkModeToggle" v-model="appearance.darkMode" @change="updateAppearance">
                    <label for="darkModeToggle"></label>
                    <span class="lv-toggle-label">{{ appearance.darkMode ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                  <small class="lv-form-text">{{ content.darkModeDescription || 'Der Dunkelmodus reduziert die Helligkeit des Bildschirms und ist angenehmer für die Augen bei schlechten Lichtverhältnissen.' }}</small>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.cardCornersLabel || 'Kartenecken' }}</label>
                  <div class="lv-radio-group">
                    <div v-for="(option, index) in content.cornerOptions" :key="index" class="lv-radio">
                      <input 
                        type="radio" 
                        :id="'corner' + option.value" 
                        name="cardCorners" 
                        :value="option.value" 
                        v-model="appearance.cardCorners"
                        @change="updateAppearance">
                      <label :for="'corner' + option.value">{{ option.label }}</label>
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.buttonStyleLabel || 'Button-Stil' }}</label>
                  <div class="lv-radio-group">
                    <div v-for="(option, index) in content.buttonStyleOptions" :key="index" class="lv-radio">
                      <input 
                        type="radio" 
                        :id="'button' + option.value" 
                        name="buttonStyle" 
                        :value="option.value" 
                        v-model="appearance.buttonStyle"
                        @change="updateAppearance">
                      <label :for="'button' + option.value">{{ option.label }}</label>
                    </div>
                  </div>
                  <div class="lv-button-preview">
                    <button class="lv-btn lv-btn-primary" :class="'lv-btn-' + appearance.buttonStyle">{{ content.primaryButtonText || 'Primär-Button' }}</button>
                    <button class="lv-btn lv-btn-outline" :class="'lv-btn-' + appearance.buttonStyle">{{ content.secondaryButtonText || 'Sekundär-Button' }}</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.previewTitle || 'Vorschau' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-preview-toggle">
                  <button 
                    v-for="(option, index) in content.previewOptions" 
                    :key="index" 
                    class="lv-preview-toggle-btn" 
                    :class="{ 'lv-preview-toggle-active': previewMode === option.value }"
                    @click="setPreviewMode(option.value)">
                    <span class="lv-preview-toggle-icon">{{ option.icon }}</span>
                    <span class="lv-preview-toggle-text">{{ option.label }}</span>
                  </button>
                </div>
                
                <div class="lv-preview-container">
                  <div class="lv-preview" :class="{ 'lv-preview-active': previewMode === 'desktop' }">
                    <div class="lv-preview-frame" :class="{ 'lv-preview-dark': appearance.darkMode }">
                      <div class="lv-preview-content">
                        <div class="lv-preview-header">
                          <div class="lv-preview-logo">{{ content.previewLogoText || 'LemonVows' }}</div>
                          <div class="lv-preview-nav">
                            <div class="lv-preview-nav-item lv-preview-nav-active">{{ content.previewNavItem1 || 'Dashboard' }}</div>
                            <div class="lv-preview-nav-item">{{ content.previewNavItem2 || 'Gäste' }}</div>
                            <div class="lv-preview-nav-item">{{ content.previewNavItem3 || 'Budget' }}</div>
                            <div class="lv-preview-nav-item">{{ content.previewNavItem4 || 'Zeitleiste' }}</div>
                          </div>
                        </div>
                        <div class="lv-preview-body">
                          <div class="lv-preview-card" :class="'lv-preview-card-' + appearance.cardCorners">
                            <div class="lv-preview-card-header">{{ content.previewCardTitle1 || 'Willkommen zurück!' }}</div>
                            <div class="lv-preview-card-body">
                              <div class="lv-preview-text-block"></div>
                              <div class="lv-preview-text-block"></div>
                            </div>
                          </div>
                          <div class="lv-preview-card" :class="'lv-preview-card-' + appearance.cardCorners">
                            <div class="lv-preview-card-header">{{ content.previewCardTitle2 || 'Nächste Aufgaben' }}</div>
                            <div class="lv-preview-card-body">
                              <div class="lv-preview-list-item"></div>
                              <div class="lv-preview-list-item"></div>
                              <div class="lv-preview-list-item"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="lv-preview" :class="{ 'lv-preview-active': previewMode === 'mobile' }">
                    <div class="lv-preview-frame lv-preview-frame-mobile" :class="{ 'lv-preview-dark': appearance.darkMode }">
                      <div class="lv-preview-content">
                        <div class="lv-preview-header-mobile">
                          <div class="lv-preview-logo">{{ content.previewLogoText || 'LemonVows' }}</div>
                          <div class="lv-preview-menu-icon">☰</div>
                        </div>
                        <div class="lv-preview-body">
                          <div class="lv-preview-card" :class="'lv-preview-card-' + appearance.cardCorners">
                            <div class="lv-preview-card-header">{{ content.previewCardTitle1 || 'Willkommen zurück!' }}</div>
                            <div class="lv-preview-card-body">
                              <div class="lv-preview-text-block"></div>
                              <div class="lv-preview-text-block"></div>
                            </div>
                          </div>
                          <div class="lv-preview-card" :class="'lv-preview-card-' + appearance.cardCorners">
                            <div class="lv-preview-card-header">{{ content.previewCardTitle2 || 'Nächste Aufgaben' }}</div>
                            <div class="lv-preview-card-body">
                              <div class="lv-preview-list-item"></div>
                              <div class="lv-preview-list-item"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-form-actions">
              <button class="lv-btn lv-btn-outline" @click="resetSettings">{{ content.resetButtonText || 'Zurücksetzen' }}</button>
              <button class="lv-btn lv-btn-primary" @click="saveSettings">{{ content.saveButtonText || 'Speichern' }}</button>
            </div>
          </div>
          
          <!-- Account Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'account' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.profileTitle || 'Profil' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-profile-section">
                  <div class="lv-profile-avatar">
                    <img :src="account.avatar || 'https://via.placeholder.com/100'" alt="Profilbild">
                    <button class="lv-profile-avatar-edit">{{ content.changePhotoText || 'Ändern' }}</button>
                  </div>
                  <div class="lv-profile-info">
                    <div class="lv-form-group">
                      <label class="lv-form-label">{{ content.nameLabel || 'Name' }}</label>
                      <input type="text" class="lv-form-control" v-model="account.name">
                    </div>
                    <div class="lv-form-group">
                      <label class="lv-form-label">{{ content.emailLabel || 'E-Mail' }}</label>
                      <input type="email" class="lv-form-control" v-model="account.email">
                    </div>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.weddingDateLabel || 'Hochzeitsdatum' }}</label>
                  <input type="date" class="lv-form-control" v-model="account.weddingDate">
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.partnerNameLabel || 'Name des Partners/der Partnerin' }}</label>
                  <input type="text" class="lv-form-control" v-model="account.partnerName">
                </div>
              </div>
            </div>
            
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.passwordTitle || 'Passwort ändern' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.currentPasswordLabel || 'Aktuelles Passwort' }}</label>
                  <input type="password" class="lv-form-control" v-model="account.currentPassword">
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.newPasswordLabel || 'Neues Passwort' }}</label>
                  <input type="password" class="lv-form-control" v-model="account.newPassword">
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.confirmPasswordLabel || 'Passwort bestätigen' }}</label>
                  <input type="password" class="lv-form-control" v-model="account.confirmPassword">
                </div>
              </div>
            </div>
            
            <div class="lv-form-actions">
              <button class="lv-btn lv-btn-primary" @click="saveAccount">{{ content.saveButtonText || 'Speichern' }}</button>
            </div>
          </div>
          
          <!-- Notifications Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'notifications' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.notificationsTitle || 'Benachrichtigungen' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.emailNotificationsLabel || 'E-Mail-Benachrichtigungen' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="emailNotificationsToggle" v-model="notifications.email" @change="updateNotifications">
                    <label for="emailNotificationsToggle"></label>
                    <span class="lv-toggle-label">{{ notifications.email ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.pushNotificationsLabel || 'Push-Benachrichtigungen' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="pushNotificationsToggle" v-model="notifications.push" @change="updateNotifications">
                    <label for="pushNotificationsToggle"></label>
                    <span class="lv-toggle-label">{{ notifications.push ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.reminderNotificationsLabel || 'Erinnerungen' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="reminderNotificationsToggle" v-model="notifications.reminders" @change="updateNotifications">
                    <label for="reminderNotificationsToggle"></label>
                    <span class="lv-toggle-label">{{ notifications.reminders ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.guestResponsesLabel || 'Gäste-Rückmeldungen' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="guestResponsesToggle" v-model="notifications.guestResponses" @change="updateNotifications">
                    <label for="guestResponsesToggle"></label>
                    <span class="lv-toggle-label">{{ notifications.guestResponses ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.marketingLabel || 'Marketing und Angebote' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="marketingToggle" v-model="notifications.marketing" @change="updateNotifications">
                    <label for="marketingToggle"></label>
                    <span class="lv-toggle-label">{{ notifications.marketing ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-form-actions">
              <button class="lv-btn lv-btn-primary" @click="saveNotifications">{{ content.saveButtonText || 'Speichern' }}</button>
            </div>
          </div>
          
          <!-- Privacy Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'privacy' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.privacyTitle || 'Datenschutz' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.dataCollectionLabel || 'Datenerfassung' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="dataCollectionToggle" v-model="privacy.dataCollection" @change="updatePrivacy">
                    <label for="dataCollectionToggle"></label>
                    <span class="lv-toggle-label">{{ privacy.dataCollection ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                  <small class="lv-form-text">{{ content.dataCollectionDescription || 'Erlauben Sie uns, anonymisierte Nutzungsdaten zu sammeln, um unsere App zu verbessern.' }}</small>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.thirdPartyLabel || 'Teilen mit Drittanbietern' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="thirdPartyToggle" v-model="privacy.thirdParty" @change="updatePrivacy">
                    <label for="thirdPartyToggle"></label>
                    <span class="lv-toggle-label">{{ privacy.thirdParty ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                  <small class="lv-form-text">{{ content.thirdPartyDescription || 'Erlauben Sie uns, Ihre Daten mit vertrauenswürdigen Partnern zu teilen, um Ihnen relevante Angebote zu unterbreiten.' }}</small>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.cookiesLabel || 'Cookies' }}</label>
                  <div class="lv-toggle-switch">
                    <input type="checkbox" id="cookiesToggle" v-model="privacy.cookies" @change="updatePrivacy">
                    <label for="cookiesToggle"></label>
                    <span class="lv-toggle-label">{{ privacy.cookies ? (content.onText || 'An') : (content.offText || 'Aus') }}</span>
                  </div>
                  <small class="lv-form-text">{{ content.cookiesDescription || 'Erlauben Sie die Verwendung von Cookies, um Ihre Nutzererfahrung zu verbessern.' }}</small>
                </div>
              </div>
            </div>
            
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.visibilityTitle || 'Sichtbarkeit' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.profileVisibilityLabel || 'Profil-Sichtbarkeit' }}</label>
                  <select class="lv-form-control" v-model="privacy.profileVisibility" @change="updatePrivacy">
                    <option v-for="(option, index) in content.visibilityOptions" :key="index" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.guestListVisibilityLabel || 'Gästeliste-Sichtbarkeit' }}</label>
                  <select class="lv-form-control" v-model="privacy.guestListVisibility" @change="updatePrivacy">
                    <option v-for="(option, index) in content.visibilityOptions" :key="index" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="lv-form-actions">
              <button class="lv-btn lv-btn-primary" @click="savePrivacy">{{ content.saveButtonText || 'Speichern' }}</button>
            </div>
          </div>
          
          <!-- Language Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'language' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.languageTitle || 'Sprache' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.appLanguageLabel || 'App-Sprache' }}</label>
                  <select class="lv-form-control" v-model="language.appLanguage" @change="updateLanguage">
                    <option v-for="(option, index) in content.languageOptions" :key="index" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.dateFormatLabel || 'Datumsformat' }}</label>
                  <select class="lv-form-control" v-model="language.dateFormat" @change="updateLanguage">
                    <option v-for="(option, index) in content.dateFormatOptions" :key="index" :value="option.value">{{ option.label }}</option>
                  </select>
                </div>
                
                <div class="lv-form-group">
                  <label class="lv-form-label">{{ content.timeFormatLabel || 'Zeitformat' }}</label>
                  <div class="lv-radio-group">
                    <div v-for="(option, index) in content.timeFormatOptions" :key="index" class="lv-radio">
                      <input 
                        type="radio" 
                        :id="'timeFormat' + option.value" 
                        name="timeFormat" 
                        :value="option.value" 
                        v-model="language.timeFormat"
                        @change="updateLanguage">
                      <label :for="'timeFormat' + option.value">{{ option.label }}</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="lv-form-actions">
              <button class="lv-btn lv-btn-primary" @click="saveLanguage">{{ content.saveButtonText || 'Speichern' }}</button>
            </div>
          </div>
          
          <!-- Export Settings Tab -->
          <div class="lv-settings-tab" :class="{ 'lv-settings-tab-active': activeTab === 'export' }">
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.exportTitle || 'Daten exportieren' }}</h3>
              </div>
              <div class="lv-card-body">
                <p>{{ content.exportDescription || 'Exportieren Sie Ihre Hochzeitsplanungsdaten in verschiedenen Formaten.' }}</p>
                
                <div class="lv-export-options">
                  <div class="lv-export-option">
                    <div class="lv-export-option-icon">📊</div>
                    <div class="lv-export-option-content">
                      <h4>{{ content.exportGuestListTitle || 'Gästeliste' }}</h4>
                      <p>{{ content.exportGuestListDescription || 'Exportieren Sie Ihre Gästeliste mit allen Details.' }}</p>
                      <div class="lv-export-option-formats">
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('guests', 'csv')">CSV</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('guests', 'excel')">Excel</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('guests', 'pdf')">PDF</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="lv-export-option">
                    <div class="lv-export-option-icon">💰</div>
                    <div class="lv-export-option-content">
                      <h4>{{ content.exportBudgetTitle || 'Budget' }}</h4>
                      <p>{{ content.exportBudgetDescription || 'Exportieren Sie Ihre Budgetplanung und Ausgaben.' }}</p>
                      <div class="lv-export-option-formats">
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('budget', 'csv')">CSV</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('budget', 'excel')">Excel</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('budget', 'pdf')">PDF</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="lv-export-option">
                    <div class="lv-export-option-icon">📅</div>
                    <div class="lv-export-option-content">
                      <h4>{{ content.exportTimelineTitle || 'Zeitleiste' }}</h4>
                      <p>{{ content.exportTimelineDescription || 'Exportieren Sie Ihre Hochzeitszeitleiste und Aufgaben.' }}</p>
                      <div class="lv-export-option-formats">
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('timeline', 'csv')">CSV</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('timeline', 'excel')">Excel</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('timeline', 'pdf')">PDF</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('timeline', 'ical')">iCal</button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="lv-export-option">
                    <div class="lv-export-option-icon">📦</div>
                    <div class="lv-export-option-content">
                      <h4>{{ content.exportAllDataTitle || 'Alle Daten' }}</h4>
                      <p>{{ content.exportAllDataDescription || 'Exportieren Sie alle Ihre Hochzeitsplanungsdaten.' }}</p>
                      <div class="lv-export-option-formats">
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('all', 'json')">JSON</button>
                        <button class="lv-btn lv-btn-sm lv-btn-outline" @click="exportData('all', 'zip')">ZIP</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      activeTab: 'design',
      selectedPalette: 'default',
      customColors: {
        primary: '#FFD166',
        secondary: '#06D6A0',
        accent: '#118AB2',
        text: '#073B4C'
      },
      selectedFonts: {
        heading: 'Playfair Display',
        body: 'Open Sans'
      },
      appearance: {
        darkMode: false,
        cardCorners: 'rounded',
        buttonStyle: 'rounded'
      },
      previewMode: 'desktop',
      account: {
        avatar: 'https://via.placeholder.com/100',
        name: 'Anna & Thomas',
        email: 'anna.thomas@example.com',
        weddingDate: '2025-05-15',
        partnerName: 'Thomas Schmidt',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notifications: {
        email: true,
        push: true,
        reminders: true,
        guestResponses: true,
        marketing: false
      },
      privacy: {
        dataCollection: true,
        thirdParty: false,
        cookies: true,
        profileVisibility: 'friends',
        guestListVisibility: 'private'
      },
      language: {
        appLanguage: 'de',
        dateFormat: 'dd.mm.yyyy',
        timeFormat: '24h'
      }
    };
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    selectPalette(paletteId) {
      this.selectedPalette = paletteId;
      
      // Update custom colors based on selected palette
      const palette = this.content.colorPalettes.find(p => p.id === paletteId);
      if (palette && palette.colors.length >= 4) {
        this.customColors = {
          primary: palette.colors[0],
          secondary: palette.colors[1],
          accent: palette.colors[2],
          text: palette.colors[3]
        };
      }
    },
    updateCustomColors() {
      // In a real application, this would update the theme
      console.log('Custom colors updated:', this.customColors);
    },
    updateFonts() {
      // In a real application, this would update the fonts
      console.log('Fonts updated:', this.selectedFonts);
    },
    updateAppearance() {
      // In a real application, this would update the appearance
      console.log('Appearance updated:', this.appearance);
    },
    setPreviewMode(mode) {
      this.previewMode = mode;
    },
    resetSettings() {
      // Reset to default settings
      this.selectedPalette = 'default';
      this.customColors = {
        primary: '#FFD166',
        secondary: '#06D6A0',
        accent: '#118AB2',
        text: '#073B4C'
      };
      this.selectedFonts = {
        heading: 'Playfair Display',
        body: 'Open Sans'
      };
      this.appearance = {
        darkMode: false,
        cardCorners: 'rounded',
        buttonStyle: 'rounded'
      };
    },
    saveSettings() {
      // In a real application, this would save the settings to the database
      console.log('Settings saved:', {
        palette: this.selectedPalette,
        colors: this.customColors,
        fonts: this.selectedFonts,
        appearance: this.appearance
      });
      
      // Show success message
      alert(this.content.settingsSavedMessage || 'Einstellungen wurden erfolgreich gespeichert.');
    },
    saveAccount() {
      // In a real application, this would save the account settings to the database
      console.log('Account settings saved:', this.account);
      
      // Show success message
      alert(this.content.accountSavedMessage || 'Kontoeinstellungen wurden erfolgreich gespeichert.');
    },
    updateNotifications() {
      // In a real application, this would update the notification settings
      console.log('Notifications updated:', this.notifications);
    },
    saveNotifications() {
      // In a real application, this would save the notification settings to the database
      console.log('Notification settings saved:', this.notifications);
      
      // Show success message
      alert(this.content.notificationsSavedMessage || 'Benachrichtigungseinstellungen wurden erfolgreich gespeichert.');
    },
    updatePrivacy() {
      // In a real application, this would update the privacy settings
      console.log('Privacy settings updated:', this.privacy);
    },
    savePrivacy() {
      // In a real application, this would save the privacy settings to the database
      console.log('Privacy settings saved:', this.privacy);
      
      // Show success message
      alert(this.content.privacySavedMessage || 'Datenschutzeinstellungen wurden erfolgreich gespeichert.');
    },
    updateLanguage() {
      // In a real application, this would update the language settings
      console.log('Language settings updated:', this.language);
    },
    saveLanguage() {
      // In a real application, this would save the language settings to the database
      console.log('Language settings saved:', this.language);
      
      // Show success message
      alert(this.content.languageSavedMessage || 'Spracheinstellungen wurden erfolgreich gespeichert.');
    },
    exportData(dataType, format) {
      // In a real application, this would export the data in the specified format
      console.log(`Exporting ${dataType} data in ${format} format`);
      
      // Show success message
      alert(this.content.exportSuccessMessage || `Die Daten wurden erfolgreich im ${format.toUpperCase()}-Format exportiert.`);
    }
  }
};
</script>

<style scoped>
/* Settings styles */
.lv-settings {
  padding: 20px 0;
}

.lv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.lv-mb-3 {
  margin-bottom: 1rem;
}

.lv-p-3 {
  padding: 1rem;
}

.lv-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.lv-col {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .lv-col-md-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  
  .lv-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .lv-col-md-9 {
    flex: 0 0 75%;
    max-width: 75%;
  }
}

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
}

.lv-card-header {
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.lv-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.lv-card-body {
  padding: 1rem;
}

/* Settings navigation */
.lv-settings-nav {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-settings-nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #eee;
}

.lv-settings-nav-item:last-child {
  border-bottom: none;
}

.lv-settings-nav-item:hover {
  background-color: #f5f5f5;
}

.lv-settings-nav-active {
  background-color: #f8c630;
  color: white;
}

.lv-settings-nav-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.lv-settings-nav-text {
  font-weight: 500;
}

/* Settings tabs */
.lv-settings-tab {
  display: none;
}

.lv-settings-tab-active {
  display: block;
}

/* Form styles */
.lv-form-group {
  margin-bottom: 1.5rem;
}

.lv-form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.lv-form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s;
}

.lv-form-control:focus {
  border-color: #f8c630;
  outline: 0;
}

.lv-form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6c757d;
}

.lv-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Color palette styles */
.lv-color-palettes {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lv-color-palette {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.lv-color-palette:hover {
  border-color: #ddd;
}

.lv-color-palette-active {
  border-color: #f8c630;
}

.lv-color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0.25rem;
}

.lv-color-palette-name {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Color picker styles */
.lv-color-picker-group {
  margin-bottom: 1rem;
}

.lv-color-picker-label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.lv-color-picker {
  display: flex;
  align-items: center;
}

.lv-color-picker input[type="color"] {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.lv-color-value {
  font-family: monospace;
  font-size: 0.875rem;
}

/* Font preview styles */
.lv-font-preview {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.lv-font-preview h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.lv-font-preview h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.lv-font-preview p {
  margin-bottom: 0.5rem;
}

/* Toggle switch styles */
.lv-toggle-switch {
  display: flex;
  align-items: center;
}

.lv-toggle-switch input {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
}

.lv-toggle-switch label {
  cursor: pointer;
  width: 50px;
  height: 25px;
  background: #ddd;
  display: block;
  border-radius: 25px;
  position: relative;
  margin-right: 0.5rem;
}

.lv-toggle-switch label:after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 19px;
  height: 19px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}

.lv-toggle-switch input:checked + label {
  background: #f8c630;
}

.lv-toggle-switch input:checked + label:after {
  left: calc(100% - 3px);
  transform: translateX(-100%);
}

.lv-toggle-label {
  font-size: 0.875rem;
}

/* Radio styles */
.lv-radio-group {
  margin-top: 0.5rem;
}

.lv-radio {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.lv-radio input {
  margin-right: 0.5rem;
}

/* Button styles */
.lv-btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s;
  cursor: pointer;
}

.lv-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
}

.lv-btn-primary {
  color: #fff;
  background-color: #f8c630;
  border-color: #f8c630;
}

.lv-btn-primary:hover {
  background-color: #e6b520;
  border-color: #e6b520;
}

.lv-btn-outline {
  color: #f8c630;
  background-color: transparent;
  border-color: #f8c630;
}

.lv-btn-outline:hover {
  color: #fff;
  background-color: #f8c630;
  border-color: #f8c630;
}

.lv-btn-rounded {
  border-radius: 0.25rem;
}

.lv-btn-pill {
  border-radius: 50px;
}

.lv-btn-sharp {
  border-radius: 0;
}

.lv-button-preview {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Preview styles */
.lv-preview-toggle {
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.lv-preview-toggle-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
}

.lv-preview-toggle-active {
  border-bottom-color: #f8c630;
  color: #f8c630;
}

.lv-preview-toggle-icon {
  margin-right: 0.5rem;
}

.lv-preview-container {
  position: relative;
  height: 400px;
}

.lv-preview {
  display: none;
  height: 100%;
}

.lv-preview-active {
  display: block;
}

.lv-preview-frame {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
}

.lv-preview-frame-mobile {
  width: 320px;
  margin: 0 auto;
}

.lv-preview-dark {
  background-color: #333;
  color: #fff;
}

.lv-preview-content {
  padding: 1rem;
}

.lv-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}

.lv-preview-header-mobile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}

.lv-preview-logo {
  font-weight: 700;
  font-size: 1.25rem;
}

.lv-preview-menu-icon {
  font-size: 1.5rem;
}

.lv-preview-nav {
  display: flex;
}

.lv-preview-nav-item {
  margin-left: 1rem;
  padding: 0.25rem 0;
  cursor: pointer;
}

.lv-preview-nav-active {
  border-bottom: 2px solid #f8c630;
  color: #f8c630;
}

.lv-preview-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lv-preview-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
}

.lv-preview-card-rounded {
  border-radius: 8px;
}

.lv-preview-card-sharp {
  border-radius: 0;
}

.lv-preview-card-header {
  padding: 0.75rem;
  background-color: #eee;
  font-weight: 600;
}

.lv-preview-card-body {
  padding: 0.75rem;
}

.lv-preview-text-block {
  height: 10px;
  background-color: #ddd;
  margin-bottom: 0.5rem;
  border-radius: 2px;
}

.lv-preview-list-item {
  height: 20px;
  background-color: #ddd;
  margin-bottom: 0.5rem;
  border-radius: 2px;
}

/* Profile styles */
.lv-profile-section {
  display: flex;
  margin-bottom: 1.5rem;
}

.lv-profile-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin-right: 1.5rem;
}

.lv-profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.lv-profile-avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #f8c630;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.lv-profile-info {
  flex: 1;
}

/* Export styles */
.lv-export-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lv-export-option {
  display: flex;
  align-items: flex-start;
}

.lv-export-option-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.lv-export-option-content {
  flex: 1;
}

.lv-export-option-content h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.lv-export-option-content p {
  margin-bottom: 0.75rem;
}

.lv-export-option-formats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .lv-profile-section {
    flex-direction: column;
    align-items: center;
  }
  
  .lv-profile-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .lv-export-option {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .lv-export-option-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
