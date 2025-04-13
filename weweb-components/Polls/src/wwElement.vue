<template>
  <div class="lv-polls">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-polls-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Umfragen & Ankündigungen' }}</h2>
                <p>{{ content.subtitle || 'Kommunizieren Sie mit Ihren Gästen und sammeln Sie Feedback' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div v-for="(stat, index) in content.pollStats" :key="index" class="lv-stat-item">
                    <div class="lv-stat-value">{{ stat.value }}</div>
                    <div class="lv-stat-label">{{ stat.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="lv-tabs lv-mb-3">
        <div class="lv-tab-header">
          <button 
            v-for="(tab, index) in content.tabs" 
            :key="index" 
            class="lv-tab-btn" 
            :class="{ 'lv-tab-active': activeTab === tab.id }"
            @click="setActiveTab(tab.id)">
            {{ tab.label }}
          </button>
        </div>
      </div>
      
      <!-- Announcements Tab Content -->
      <div class="lv-tab-content" :class="{ 'lv-tab-content-active': activeTab === 'announcements' }">
        <div class="lv-action-bar lv-mb-3">
          <div class="lv-row">
            <div class="lv-col lv-col-md-6">
              <div class="lv-filter-group">
                <button 
                  v-for="(filter, index) in content.announcementFilters" 
                  :key="index" 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': currentAnnouncementFilter === filter.value }"
                  @click="setAnnouncementFilter(filter.value)">
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="lv-col lv-col-md-6 lv-text-right">
              <button class="lv-btn lv-btn-primary" @click="openCreateAnnouncementModal">
                {{ content.createAnnouncementButtonText || 'Ankündigung erstellen' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="lv-announcements-list">
          <div 
            v-for="(announcement, index) in filteredAnnouncements" 
            :key="index" 
            class="lv-announcement-card" 
            :data-announcement-id="announcement.id" 
            :data-visibility="announcement.visibility">
            <div class="lv-announcement-header">
              <div class="lv-announcement-title">{{ announcement.title }}</div>
              <div class="lv-announcement-date">{{ announcement.date }}</div>
            </div>
            <div class="lv-announcement-body" v-html="announcement.content"></div>
            <div class="lv-announcement-footer">
              <div class="lv-announcement-visibility" :class="'lv-visibility-' + announcement.visibility">
                {{ getVisibilityLabel(announcement.visibility) }}
              </div>
              <div class="lv-announcement-actions">
                <button class="lv-btn lv-btn-sm lv-btn-outline" @click="editAnnouncement(index)">
                  {{ content.editButtonText || 'Bearbeiten' }}
                </button>
                <button class="lv-btn lv-btn-sm lv-btn-outline lv-btn-danger" @click="openDeleteAnnouncementModal(index)">
                  {{ content.deleteButtonText || 'Löschen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Polls Tab Content -->
      <div class="lv-tab-content" :class="{ 'lv-tab-content-active': activeTab === 'polls' }">
        <div class="lv-action-bar lv-mb-3">
          <div class="lv-row">
            <div class="lv-col lv-col-md-6">
              <div class="lv-filter-group">
                <button 
                  v-for="(filter, index) in content.pollFilters" 
                  :key="index" 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': currentPollFilter === filter.value }"
                  @click="setPollFilter(filter.value)">
                  {{ filter.label }}
                </button>
              </div>
            </div>
            <div class="lv-col lv-col-md-6 lv-text-right">
              <button class="lv-btn lv-btn-primary" @click="openCreatePollModal">
                {{ content.createPollButtonText || 'Umfrage erstellen' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="lv-polls-list">
          <div 
            v-for="(poll, index) in filteredPolls" 
            :key="index" 
            class="lv-poll-card" 
            :data-poll-id="poll.id" 
            :data-status="poll.status">
            <div class="lv-poll-header">
              <div class="lv-poll-title">{{ poll.title }}</div>
              <div class="lv-poll-status" :class="'lv-status-' + poll.status">
                {{ poll.status === 'active' ? content.activePollStatusText + ' ' + poll.endDate : content.closedPollStatusText + ' ' + poll.endDate }}
              </div>
            </div>
            <div class="lv-poll-body">
              <div class="lv-poll-description">
                <p>{{ poll.description }}</p>
              </div>
              <div class="lv-poll-options">
                <div 
                  v-for="(option, optionIndex) in poll.options" 
                  :key="optionIndex" 
                  class="lv-poll-option">
                  <div class="lv-poll-option-label">
                    <input 
                      :type="poll.multipleChoice ? 'checkbox' : 'radio'" 
                      :name="'poll' + poll.id" 
                      :id="'poll' + poll.id + '_option' + optionIndex" 
                      :value="optionIndex"
                      v-model="poll.selectedOptions"
                      :disabled="poll.status === 'closed' || poll.userVoted">
                    <label :for="'poll' + poll.id + '_option' + optionIndex">{{ option.text }}</label>
                  </div>
                  <div class="lv-poll-option-bar">
                    <div class="lv-poll-option-progress" :style="{ width: option.percentage + '%' }"></div>
                    <div class="lv-poll-option-percentage">{{ option.percentage }}%</div>
                  </div>
                  <div class="lv-poll-option-count">{{ option.votes }} {{ content.votesText || 'Stimmen' }}</div>
                </div>
              </div>
              <div class="lv-poll-actions" v-if="poll.status === 'active' && !poll.userVoted">
                <button class="lv-btn lv-btn-primary" @click="votePoll(index)">
                  {{ content.voteButtonText || 'Abstimmen' }}
                </button>
              </div>
            </div>
            <div class="lv-poll-footer">
              <div class="lv-poll-meta">
                <div class="lv-poll-votes">{{ poll.totalVotes }} {{ poll.multipleChoice ? (content.participantsText || 'Teilnehmer') : (content.totalVotesText || 'Stimmen insgesamt') }}</div>
                <div class="lv-poll-visibility">{{ poll.visibility }}</div>
              </div>
              <div class="lv-poll-admin-actions">
                <button class="lv-btn lv-btn-sm lv-btn-outline" @click="editPoll(index)">
                  {{ content.editButtonText || 'Bearbeiten' }}
                </button>
                <button class="lv-btn lv-btn-sm lv-btn-outline lv-btn-danger" @click="openDeletePollModal(index)">
                  {{ content.deleteButtonText || 'Löschen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Announcement Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isAnnouncementModalOpen }">
    <div class="lv-modal-dialog lv-modal-lg">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ isEditMode ? content.editAnnouncementTitle || 'Ankündigung bearbeiten' : content.createAnnouncementTitle || 'Ankündigung erstellen' }}</h3>
          <button class="lv-modal-close" @click="closeAnnouncementModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="announcementForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="announcementTitle">{{ content.announcementTitleLabel || 'Titel' }}*</label>
              <input type="text" class="lv-form-control" id="announcementTitle" required v-model="currentAnnouncement.title">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="announcementContent">{{ content.announcementContentLabel || 'Inhalt' }}*</label>
              <textarea class="lv-form-control" id="announcementContent" rows="6" required v-model="currentAnnouncement.content"></textarea>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="announcementDate">{{ content.announcementDateLabel || 'Datum' }}</label>
              <input type="date" class="lv-form-control" id="announcementDate" v-model="currentAnnouncement.date">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.visibilityLabel || 'Sichtbarkeit' }}</label>
              <div class="lv-radio-group">
                <div v-for="(option, index) in content.visibilityOptions" :key="index" class="lv-radio">
                  <input 
                    type="radio" 
                    :id="'visibility' + option.value" 
                    name="announcementVisibility" 
                    :value="option.value" 
                    v-model="currentAnnouncement.visibility">
                  <label :for="'visibility' + option.value">{{ option.label }}</label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeAnnouncementModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="saveAnnouncement">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Poll Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isPollModalOpen }">
    <div class="lv-modal-dialog lv-modal-lg">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ isEditMode ? content.editPollTitle || 'Umfrage bearbeiten' : content.createPollTitle || 'Umfrage erstellen' }}</h3>
          <button class="lv-modal-close" @click="closePollModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="pollForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="pollTitle">{{ content.pollTitleLabel || 'Titel' }}*</label>
              <input type="text" class="lv-form-control" id="pollTitle" required v-model="currentPoll.title">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="pollDescription">{{ content.pollDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="pollDescription" rows="3" v-model="currentPoll.description"></textarea>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="pollEndDate">{{ content.pollEndDateLabel || 'Enddatum' }}</label>
              <input type="date" class="lv-form-control" id="pollEndDate" v-model="currentPoll.endDate">
            </div>
            
            <div class="lv-form-group">
              <div class="lv-checkbox-container">
                <input type="checkbox" id="pollMultipleChoice" class="lv-checkbox" v-model="currentPoll.multipleChoice">
                <label for="pollMultipleChoice">{{ content.multipleChoiceLabel || 'Mehrfachauswahl erlauben' }}</label>
              </div>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.pollOptionsLabel || 'Antwortmöglichkeiten' }}*</label>
              <div class="lv-poll-options-editor">
                <div v-for="(option, index) in currentPoll.options" :key="index" class="lv-poll-option-editor">
                  <input type="text" class="lv-form-control" v-model="option.text" :placeholder="content.optionPlaceholder || 'Antwortmöglichkeit ' + (index + 1)">
                  <button type="button" class="lv-btn lv-btn-icon lv-remove-option-btn" @click="removeOption(index)">&times;</button>
                </div>
                <button type="button" class="lv-btn lv-btn-outline lv-add-option-btn" @click="addOption">
                  {{ content.addOptionButtonText || 'Antwortmöglichkeit hinzufügen' }}
                </button>
              </div>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.visibilityLabel || 'Sichtbarkeit' }}</label>
              <div class="lv-radio-group">
                <div v-for="(option, index) in content.pollVisibilityOptions" :key="index" class="lv-radio">
                  <input 
                    type="radio" 
                    :id="'pollVisibility' + option.value" 
                    name="pollVisibility" 
                    :value="option.value" 
                    v-model="currentPoll.visibility">
                  <label :for="'pollVisibility' + option.value">{{ option.label }}</label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closePollModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="savePoll">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
    <div class="lv-modal-dialog lv-modal-sm">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ deleteType === 'announcement' ? content.deleteAnnouncementTitle || 'Ankündigung löschen' : content.deletePollTitle || 'Umfrage löschen' }}</h3>
          <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <p>{{ deleteType === 'announcement' ? content.deleteAnnouncementConfirmationText || 'Sind Sie sicher, dass Sie diese Ankündigung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' : content.deletePollConfirmationText || 'Sind Sie sicher, dass Sie diese Umfrage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-danger" @click="confirmDelete">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      activeTab: 'announcements',
      currentAnnouncementFilter: 'all',
      currentPollFilter: 'all',
      filteredAnnouncements: [],
      filteredPolls: [],
      isAnnouncementModalOpen: false,
      isPollModalOpen: false,
      isDeleteModalOpen: false,
      isEditMode: false,
      deleteType: '',
      deleteIndex: -1,
      currentAnnouncement: {
        id: '',
        title: '',
        content: '',
        date: '',
        visibility: 'public'
      },
      currentPoll: {
        id: '',
        title: '',
        description: '',
        endDate: '',
        status: 'active',
        multipleChoice: false,
        options: [
          { text: '', votes: 0, percentage: 0 }
        ],
        selectedOptions: [],
        totalVotes: 0,
        visibility: 'all',
        userVoted: false
      }
    };
  },
  mounted() {
    this.filterAnnouncements();
    this.filterPolls();
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    getVisibilityLabel(visibility) {
      const visibilityMap = {
        public: this.content.publicLabel || 'Öffentlich',
        private: this.content.privateLabel || 'Privat (nur enge Freunde)'
      };
      return visibilityMap[visibility] || visibility;
    },
    setAnnouncementFilter(filter) {
      this.currentAnnouncementFilter = filter;
      this.filterAnnouncements();
    },
    setPollFilter(filter) {
      this.currentPollFilter = filter;
      this.filterPolls();
    },
    filterAnnouncements() {
      let filtered = [...(this.content.announcements || [])];
      
      if (this.currentAnnouncementFilter !== 'all') {
        filtered = filtered.filter(announcement => announcement.visibility === this.currentAnnouncementFilter);
      }
      
      this.filteredAnnouncements = filtered;
    },
    filterPolls() {
      let filtered = [...(this.content.polls || [])];
      
      if (this.currentPollFilter !== 'all') {
        filtered = filtered.filter(poll => poll.status === this.currentPollFilter);
      }
      
      this.filteredPolls = filtered;
    },
    openCreateAnnouncementModal() {
      this.isEditMode = false;
      this.currentAnnouncement = {
        id: '',
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        visibility: 'public'
      };
      this.isAnnouncementModalOpen = true;
    },
    closeAnnouncementModal() {
      this.isAnnouncementModalOpen = false;
    },
    editAnnouncement(index) {
      this.isEditMode = true;
      this.currentAnnouncement = { ...this.filteredAnnouncements[index] };
      this.isAnnouncementModalOpen = true;
    },
    saveAnnouncement() {
      if (!this.currentAnnouncement.title || !this.currentAnnouncement.content) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      // Generate a unique ID for new announcements
      if (!this.isEditMode) {
        this.currentAnnouncement.id = 'announcement_' + Date.now();
      }
      
      // In a real application, you would save the announcement to the database
      console.log('Saving announcement:', this.currentAnnouncement);
      
      this.closeAnnouncementModal();
      this.filterAnnouncements();
    },
    openDeleteAnnouncementModal(index) {
      this.deleteType = 'announcement';
      this.deleteIndex = index;
      this.isDeleteModalOpen = true;
    },
    openCreatePollModal() {
      this.isEditMode = false;
      this.currentPoll = {
        id: '',
        title: '',
        description: '',
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'active',
        multipleChoice: false,
        options: [
          { text: '', votes: 0, percentage: 0 },
          { text: '', votes: 0, percentage: 0 }
        ],
        selectedOptions: [],
        totalVotes: 0,
        visibility: 'all',
        userVoted: false
      };
      this.isPollModalOpen = true;
    },
    closePollModal() {
      this.isPollModalOpen = false;
    },
    editPoll(index) {
      this.isEditMode = true;
      this.currentPoll = JSON.parse(JSON.stringify(this.filteredPolls[index]));
      this.isPollModalOpen = true;
    },
    addOption() {
      this.currentPoll.options.push({ text: '', votes: 0, percentage: 0 });
    },
    removeOption(index) {
      if (this.currentPoll.options.length > 1) {
        this.currentPoll.options.splice(index, 1);
      }
    },
    savePoll() {
      if (!this.currentPoll.title || this.currentPoll.options.some(option => !option.text)) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      // Generate a unique ID for new polls
      if (!this.isEditMode) {
        this.currentPoll.id = 'poll_' + Date.now();
      }
      
      // In a real application, you would save the poll to the database
      console.log('Saving poll:', this.currentPoll);
      
      this.closePollModal();
      this.filterPolls();
    },
    openDeletePollModal(index) {
      this.deleteType = 'poll';
      this.deleteIndex = index;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },
    confirmDelete() {
      if (this.deleteType === 'announcement') {
        // In a real application, you would delete the announcement from the database
        console.log('Deleting announcement:', this.filteredAnnouncements[this.deleteIndex]);
        this.filterAnnouncements();
      } else if (this.deleteType === 'poll') {
        // In a real application, you would delete the poll from the database
        console.log('Deleting poll:', this.filteredPolls[this.deleteIndex]);
        this.filterPolls();
      }
      
      this.closeDeleteModal();
    },
    votePoll(index) {
      const poll = this.filteredPolls[index];
      
      if (!poll.selectedOptions || (Array.isArray(poll.selectedOptions) && poll.selectedOptions.length === 0)) {
        alert('Bitte wählen Sie mindestens eine Option aus.');
        return;
      }
      
      // In a real application, you would save the vote to the database
      console.log('Voting for poll:', poll.id, 'Selected options:', poll.selectedOptions);
      
      // Mark poll as voted by user
      poll.userVoted = true;
    }
  }
};
</script>

<style scoped>
/* Polls styles */
.lv-polls {
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
  .lv-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.lv-card-body {
  padding: 1rem;
}

/* Stats styles */
.lv-stats-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.lv-stat-item {
  text-align: center;
  padding: 0.5rem;
  flex: 1;
  min-width: 80px;
}

.lv-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.lv-stat-label {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.25rem;
}

/* Tabs styles */
.lv-tabs {
  margin-bottom: 1rem;
}

.lv-tab-header {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.lv-tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.lv-tab-btn:hover {
  background-color: #f5f5f5;
}

.lv-tab-active {
  border-bottom-color: #f8c630;
  color: #f8c630;
}

.lv-tab-content {
  display: none;
}

.lv-tab-content-active {
  display: block;
}

/* Filter styles */
.lv-filter-group {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}

.lv-filter-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.375rem 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.lv-filter-btn:hover {
  background-color: #f5f5f5;
}

.lv-filter-active {
  background-color: #f8c630;
  color: white;
  border-color: #f8c630;
}

/* Announcement styles */
.lv-announcements-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lv-announcement-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.lv-announcement-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.lv-announcement-date {
  color: #777;
  font-size: 0.9rem;
}

.lv-announcement-body {
  padding: 1rem;
}

.lv-announcement-body p {
  margin-bottom: 0.75rem;
}

.lv-announcement-body p:last-child {
  margin-bottom: 0;
}

.lv-announcement-body ul {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
}

.lv-announcement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.lv-announcement-visibility {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.lv-visibility-public {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-visibility-private {
  background-color: #e8eaf6;
  color: #3f51b5;
}

.lv-announcement-actions {
  display: flex;
  gap: 0.5rem;
}

/* Poll styles */
.lv-polls-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lv-poll-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-poll-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.lv-poll-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.lv-poll-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.lv-status-active {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-status-closed {
  background-color: #ffebee;
  color: #f44336;
}

.lv-poll-body {
  padding: 1rem;
}

.lv-poll-description {
  margin-bottom: 1rem;
}

.lv-poll-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.lv-poll-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lv-poll-option-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lv-poll-option-bar {
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  position: relative;
  margin: 0.25rem 0;
}

.lv-poll-option-progress {
  height: 100%;
  background-color: #f8c630;
  border-radius: 4px;
}

.lv-poll-option-percentage {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 0.8rem;
  color: #777;
}

.lv-poll-option-count {
  font-size: 0.8rem;
  color: #777;
}

.lv-poll-actions {
  margin-top: 1rem;
}

.lv-poll-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.lv-poll-meta {
  font-size: 0.8rem;
  color: #777;
}

.lv-poll-votes {
  margin-bottom: 0.25rem;
}

.lv-poll-admin-actions {
  display: flex;
  gap: 0.5rem;
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

.lv-btn-danger {
  color: #fff;
  background-color: #f44336;
  border-color: #f44336;
}

.lv-btn-danger:hover {
  background-color: #e53935;
  border-color: #e53935;
}

.lv-btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  color: #777;
}

.lv-btn-icon:hover {
  color: #f44336;
}

.lv-text-right {
  text-align: right;
}

/* Modal styles */
.lv-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  overflow: auto;
}

.lv-modal-open {
  display: flex;
  align-items: center;
  justify-content: center;
}

.lv-modal-dialog {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 1.75rem auto;
}

.lv-modal-lg {
  max-width: 800px;
}

.lv-modal-sm {
  max-width: 400px;
}

.lv-modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 0.3rem;
  outline: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
}

.lv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.lv-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.lv-modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  cursor: pointer;
}

.lv-modal-close:hover {
  opacity: 0.75;
}

.lv-modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  overflow-y: auto;
}

.lv-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.lv-modal-footer > .lv-btn {
  margin-left: 0.5rem;
}

/* Form styles */
.lv-form-group {
  margin-bottom: 1rem;
}

.lv-form-label {
  display: inline-block;
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

.lv-checkbox-container {
  display: flex;
  align-items: center;
}

.lv-checkbox {
  margin-right: 0.5rem;
}

/* Poll options editor */
.lv-poll-options-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lv-poll-option-editor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lv-add-option-btn {
  margin-top: 0.5rem;
  align-self: flex-start;
}

.lv-remove-option-btn {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .lv-text-right {
    text-align: left;
    margin-top: 1rem;
  }
  
  .lv-tab-header {
    flex-wrap: wrap;
  }
  
  .lv-tab-btn {
    flex: 1;
    text-align: center;
    padding: 0.5rem;
  }
  
  .lv-poll-header,
  .lv-announcement-header,
  .lv-poll-footer,
  .lv-announcement-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lv-poll-status,
  .lv-announcement-date,
  .lv-poll-admin-actions,
  .lv-announcement-actions {
    margin-top: 0.5rem;
  }
}
</style>
