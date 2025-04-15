<template>
  <div class="lv-polls">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-polls-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Umfragen' }}</h2>
                <p>{{ content.subtitle || 'Erstellen Sie Umfragen und sammeln Sie Feedback von Ihren Gästen' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ activePolls.length }}</div>
                    <div class="lv-stat-label">{{ content.activePollsLabel || 'Aktive Umfragen' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ closedPolls.length }}</div>
                    <div class="lv-stat-label">{{ content.closedPollsLabel || 'Abgeschlossene Umfragen' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ totalVotes }}</div>
                    <div class="lv-stat-label">{{ content.totalVotesLabel || 'Abgegebene Stimmen' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Action Bar -->
      <div class="lv-action-bar lv-mb-3">
        <div class="lv-row">
          <div class="lv-col lv-col-md-6">
            <div class="lv-search-container">
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Umfragen suchen...'" v-model="searchQuery" @input="filterPolls">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-primary" @click="openPollModal">{{ content.createPollBtn || 'Umfrage erstellen' }}</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filter Bar -->
      <div class="lv-filter-bar lv-mb-3">
        <div class="lv-filter-group">
          <button 
            v-for="(filter, index) in statusFilters" 
            :key="'status-' + index" 
            class="lv-filter-btn" 
            :class="{ 'lv-filter-active': currentStatusFilter === filter.value }"
            @click="setStatusFilter(filter.value)">
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <!-- Polls List -->
      <div class="lv-polls-list">
        <div v-for="poll in filteredPolls" :key="poll.id" class="lv-poll-card lv-mb-3">
          <div class="lv-card">
            <div class="lv-card-body lv-p-3">
              <div class="lv-poll-header">
                <div class="lv-poll-title-container">
                  <h3 class="lv-poll-title">{{ poll.title }}</h3>
                  <span class="lv-poll-status" :class="getPollStatusClass(poll)">
                    {{ getPollStatusLabel(poll) }}
                  </span>
                </div>
                <div class="lv-poll-actions">
                  <button class="lv-btn-icon lv-edit-poll" @click="editPoll(poll)" v-if="canEditPoll(poll)">✏️</button>
                  <button class="lv-btn-icon lv-delete-poll" @click="openDeleteModal(poll)" v-if="canEditPoll(poll)">🗑️</button>
                </div>
              </div>
              
              <div class="lv-poll-description" v-if="poll.description">
                {{ poll.description }}
              </div>
              
              <div class="lv-poll-meta">
                <div class="lv-poll-date">
                  {{ content.createdLabel || 'Erstellt' }}: {{ formatDate(poll.created_at) }}
                </div>
                <div class="lv-poll-votes">
                  {{ getPollVotesCount(poll.id) }} {{ content.votesLabel || 'Stimmen' }}
                </div>
              </div>
              
              <!-- Poll Options -->
              <div class="lv-poll-options lv-mt-3">
                <div v-for="option in getPollOptions(poll.id)" :key="option.id" class="lv-poll-option">
                  <div class="lv-poll-option-header">
                    <div class="lv-poll-option-text">{{ option.text }}</div>
                    <div class="lv-poll-option-votes">{{ getOptionVotesCount(option.id) }} {{ content.votesLabel || 'Stimmen' }}</div>
                  </div>
                  
                  <div class="lv-poll-option-progress">
                    <div class="lv-progress-bar">
                      <div 
                        class="lv-progress-fill" 
                        :style="{ 
                          width: `${getOptionPercentage(option.id, poll.id)}%`,
                          backgroundColor: option.color || '#007bff'
                        }">
                      </div>
                    </div>
                    <div class="lv-poll-option-percentage">{{ getOptionPercentage(option.id, poll.id) }}%</div>
                  </div>
                  
                  <!-- Vote Button (only for active polls and if user hasn't voted yet) -->
                  <button 
                    v-if="poll.status === 'active' && !hasUserVoted(poll.id)" 
                    class="lv-btn lv-btn-sm lv-btn-outline lv-vote-btn"
                    @click="voteForOption(option.id, poll.id)">
                    {{ content.voteButtonText || 'Abstimmen' }}
                  </button>
                </div>
              </div>
              
              <!-- Poll Controls (for poll owner) -->
              <div class="lv-poll-controls lv-mt-3" v-if="canEditPoll(poll)">
                <button 
                  v-if="poll.status === 'active'" 
                  class="lv-btn lv-btn-sm lv-btn-outline"
                  @click="closePoll(poll)">
                  {{ content.closePollBtn || 'Umfrage schließen' }}
                </button>
                <button 
                  v-if="poll.status === 'closed'" 
                  class="lv-btn lv-btn-sm lv-btn-outline"
                  @click="reopenPoll(poll)">
                  {{ content.reopenPollBtn || 'Umfrage wieder öffnen' }}
                </button>
              </div>
              
              <!-- User already voted message -->
              <div class="lv-poll-voted-message lv-mt-3" v-if="poll.status === 'active' && hasUserVoted(poll.id)">
                {{ content.alreadyVotedMessage || 'Sie haben bereits an dieser Umfrage teilgenommen.' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredPolls.length === 0" class="lv-empty-state">
          <div class="lv-card">
            <div class="lv-card-body lv-text-center lv-p-5">
              <div class="lv-empty-icon">📊</div>
              <h3>{{ content.emptyStateTitle || 'Keine Umfragen gefunden' }}</h3>
              <p>{{ content.emptyStateMessage || 'Erstellen Sie Ihre erste Umfrage, um Feedback von Ihren Gästen zu sammeln.' }}</p>
              <button class="lv-btn lv-btn-primary lv-mt-3" @click="openPollModal">
                {{ content.createPollBtn || 'Umfrage erstellen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Poll Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isPollModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditingPoll ? content.editPollTitle || 'Umfrage bearbeiten' : content.createPollTitle || 'Umfrage erstellen' }}</h3>
            <button class="lv-modal-close" @click="closePollModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="pollTitle">{{ content.pollTitleLabel || 'Titel' }}*</label>
              <input type="text" class="lv-form-control" id="pollTitle" v-model="currentPoll.title" required>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="pollDescription">{{ content.pollDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="pollDescription" v-model="currentPoll.description" rows="3"></textarea>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.pollOptionsLabel || 'Antwortmöglichkeiten' }}*</label>
              <div class="lv-poll-options-editor">
                <div v-for="(option, index) in currentPollOptions" :key="index" class="lv-poll-option-editor">
                  <div class="lv-row">
                    <div class="lv-col lv-col-md-9">
                      <input 
                        type="text" 
                        class="lv-form-control" 
                        :placeholder="content.optionPlaceholder || 'Antwortmöglichkeit eingeben...'" 
                        v-model="option.text"
                      >
                    </div>
                    <div class="lv-col lv-col-md-2">
                      <div class="lv-color-picker-container">
                        <input type="color" class="lv-color-picker" v-model="option.color">
                      </div>
                    </div>
                    <div class="lv-col lv-col-md-1">
                      <button class="lv-btn-icon lv-remove-option" @click="removeOption(index)" v-if="currentPollOptions.length > 2">&times;</button>
                    </div>
                  </div>
                </div>
                
                <button class="lv-btn lv-btn-sm lv-btn-outline lv-mt-2" @click="addOption">
                  {{ content.addOptionBtn || 'Antwortmöglichkeit hinzufügen' }}
                </button>
              </div>
            </div>
            
            <div class="lv-form-group">
              <div class="lv-checkbox-container">
                <input type="checkbox" id="pollMultipleVotes" class="lv-checkbox" v-model="currentPoll.allow_multiple_votes">
                <label for="pollMultipleVotes">{{ content.allowMultipleVotesLabel || 'Mehrfachabstimmung erlauben' }}</label>
              </div>
            </div>
            
            <div class="lv-form-group">
              <div class="lv-checkbox-container">
                <input type="checkbox" id="pollAnonymous" class="lv-checkbox" v-model="currentPoll.is_anonymous">
                <label for="pollAnonymous">{{ content.anonymousPollLabel || 'Anonyme Umfrage (Namen der Abstimmenden nicht anzeigen)' }}</label>
              </div>
            </div>
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
            <h3>{{ content.deletePollTitle || 'Umfrage löschen' }}</h3>
            <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <p>{{ content.deletePollConfirmation || 'Sind Sie sicher, dass Sie diese Umfrage löschen möchten? Alle abgegebenen Stimmen werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deletePoll">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      // Supabase client (will be initialized in mounted)
      supabase: null,
      weddingId: null,
      currentUserId: null,
      
      // Data
      polls: [],
      pollOptions: [],
      votes: [],
      filteredPolls: [],
      
      // UI state
      searchQuery: '',
      currentStatusFilter: 'all',
      
      // Modals
      isPollModalOpen: false,
      isDeleteModalOpen: false,
      
      // Editing state
      isEditingPoll: false,
      currentPoll: this.getEmptyPoll(),
      currentPollOptions: [],
      pollToDelete: null,
      
      // Options
      statusFilters: [
        { value: 'all', label: 'Alle Umfragen' },
        { value: 'active', label: 'Aktive Umfragen' },
        { value: 'closed', label: 'Abgeschlossene Umfragen' }
      ],
      defaultColors: [
        '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
        '#FF6D01', '#46BDC6', '#7BAAF7', '#F6AEA9'
      ]
    };
  },
  computed: {
    activePolls() {
      return this.polls.filter(poll => poll.status === 'active');
    },
    closedPolls() {
      return this.polls.filter(poll => poll.status === 'closed');
    },
    totalVotes() {
      return this.votes.length;
    }
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get wedding ID and user ID
    await this.getCurrentUserInfo();
    
    // Load data
    if (this.weddingId) {
      await Promise.all([
        this.loadPolls(),
        this.loadPollOptions(),
        this.loadVotes()
      ]);
      
      // Initialize filtered polls
      this.filterPolls();
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
        
        this.currentUserId = user.id;
        
        // Get user profile with wedding ID
        const { data: userData, error: userError } = await this.supabase
          .from('users')
          .select('wedding_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        this.weddingId = userData.wedding_id;
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    },
    
    async loadPolls() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('polls')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.polls = data || [];
      } catch (error) {
        console.error('Error loading polls:', error);
      }
    },
    
    async loadPollOptions() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get all poll IDs for this wedding
        const pollIds = this.polls.map(poll => poll.id);
        
        if (pollIds.length === 0) {
          this.pollOptions = [];
          return;
        }
        
        const { data, error } = await this.supabase
          .from('poll_options')
          .select('*')
          .in('poll_id', pollIds)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.pollOptions = data || [];
      } catch (error) {
        console.error('Error loading poll options:', error);
      }
    },
    
    async loadVotes() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get all poll IDs for this wedding
        const pollIds = this.polls.map(poll => poll.id);
        
        if (pollIds.length === 0) {
          this.votes = [];
          return;
        }
        
        const { data, error } = await this.supabase
          .from('poll_votes')
          .select('*')
          .in('poll_id', pollIds);
        
        if (error) throw error;
        
        this.votes = data || [];
      } catch (error) {
        console.error('Error loading votes:', error);
      }
    },
    
    async addPoll(pollData, options) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newPoll = {
          ...pollData,
          wedding_id: this.weddingId,
          created_by: this.currentUserId
        };
        
        // Insert poll
        const { data: pollData, error: pollError } = await this.supabase
          .from('polls')
          .insert([newPoll])
          .select();
        
        if (pollError) throw pollError;
        
        if (pollData && pollData.length > 0) {
          const pollId = pollData[0].id;
          
          // Insert options
          const optionsWithPollId = options.map(option => ({
            ...option,
            poll_id: pollId
          }));
          
          const { data: optionsData, error: optionsError } = await this.supabase
            .from('poll_options')
            .insert(optionsWithPollId)
            .select();
          
          if (optionsError) throw optionsError;
          
          // Add poll to local state
          this.polls.push(pollData[0]);
          
          // Add options to local state
          if (optionsData) {
            this.pollOptions = [...this.pollOptions, ...optionsData];
          }
          
          this.filterPolls();
        }
        
        return pollData[0];
      } catch (error) {
        console.error('Error adding poll:', error);
        return null;
      }
    },
    
    async updatePoll(pollData, options) {
      try {
        if (!this.supabase) return;
        
        // Update poll
        const { error: pollError } = await this.supabase
          .from('polls')
          .update(pollData)
          .eq('id', pollData.id);
        
        if (pollError) throw pollError;
        
        // Handle options
        for (const option of options) {
          if (option.id) {
            // Update existing option
            await this.supabase
              .from('poll_options')
              .update({ text: option.text, color: option.color })
              .eq('id', option.id);
          } else {
            // Add new option
            await this.supabase
              .from('poll_options')
              .insert([{
                poll_id: pollData.id,
                text: option.text,
                color: option.color
              }]);
          }
        }
        
        // Get updated poll data
        const { data: updatedPoll, error: getError } = await this.supabase
          .from('polls')
          .select('*')
          .eq('id', pollData.id)
          .single();
        
        if (getError) throw getError;
        
        // Get updated options
        const { data: updatedOptions, error: getOptionsError } = await this.supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', pollData.id)
          .eq('is_active', true);
        
        if (getOptionsError) throw getOptionsError;
        
        // Update local state
        const pollIndex = this.polls.findIndex(p => p.id === pollData.id);
        if (pollIndex !== -1) {
          this.polls[pollIndex] = updatedPoll;
        }
        
        // Update options in local state
        this.pollOptions = this.pollOptions.filter(o => o.poll_id !== pollData.id);
        this.pollOptions = [...this.pollOptions, ...updatedOptions];
        
        this.filterPolls();
        
        return true;
      } catch (error) {
        console.error('Error updating poll:', error);
        return false;
      }
    },
    
    async removePoll(pollId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('polls')
          .update({ is_active: false })
          .eq('id', pollId);
        
        if (error) throw error;
        
        // Also soft delete all options for this poll
        await this.supabase
          .from('poll_options')
          .update({ is_active: false })
          .eq('poll_id', pollId);
        
        // Remove from local state
        this.polls = this.polls.filter(p => p.id !== pollId);
        this.pollOptions = this.pollOptions.filter(o => o.poll_id !== pollId);
        
        this.filterPolls();
        
        return true;
      } catch (error) {
        console.error('Error removing poll:', error);
        return false;
      }
    },
    
    async voteForOption(optionId, pollId) {
      try {
        if (!this.supabase || !this.currentUserId) return;
        
        // Check if user has already voted on this poll
        if (this.hasUserVoted(pollId)) {
          alert('Sie haben bereits an dieser Umfrage teilgenommen.');
          return false;
        }
        
        // Add vote
        const { data, error } = await this.supabase
          .from('poll_votes')
          .insert([{
            poll_id: pollId,
            option_id: optionId,
            user_id: this.currentUserId
          }])
          .select();
        
        if (error) throw error;
        
        // Add to local state
        if (data && data.length > 0) {
          this.votes.push(data[0]);
        }
        
        return true;
      } catch (error) {
        console.error('Error voting:', error);
        return false;
      }
    },
    
    async updatePollStatus(pollId, status) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('polls')
          .update({ status })
          .eq('id', pollId);
        
        if (error) throw error;
        
        // Update local state
        const index = this.polls.findIndex(p => p.id === pollId);
        if (index !== -1) {
          this.polls[index].status = status;
        }
        
        this.filterPolls();
        
        return true;
      } catch (error) {
        console.error('Error updating poll status:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyPoll() {
      return {
        title: '',
        description: '',
        status: 'active',
        allow_multiple_votes: false,
        is_anonymous: false
      };
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    getPollStatusLabel(poll) {
      return poll.status === 'active' 
        ? (this.content.activeLabel || 'Aktiv') 
        : (this.content.closedLabel || 'Abgeschlossen');
    },
    
    getPollStatusClass(poll) {
      return poll.status === 'active' ? 'lv-status-active' : 'lv-status-closed';
    },
    
    getPollOptions(pollId) {
      return this.pollOptions.filter(option => option.poll_id === pollId);
    },
    
    getPollVotesCount(pollId) {
      return this.votes.filter(vote => vote.poll_id === pollId).length;
    },
    
    getOptionVotesCount(optionId) {
      return this.votes.filter(vote => vote.option_id === optionId).length;
    },
    
    getOptionPercentage(optionId, pollId) {
      const totalVotes = this.getPollVotesCount(pollId);
      if (totalVotes === 0) return 0;
      
      const optionVotes = this.getOptionVotesCount(optionId);
      return Math.round((optionVotes / totalVotes) * 100);
    },
    
    hasUserVoted(pollId) {
      if (!this.currentUserId) return false;
      return this.votes.some(vote => vote.poll_id === pollId && vote.user_id === this.currentUserId);
    },
    
    canEditPoll(poll) {
      return poll.created_by === this.currentUserId;
    },
    
    filterPolls() {
      let filtered = [...this.polls];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(poll => 
          poll.title.toLowerCase().includes(query) || 
          (poll.description && poll.description.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentStatusFilter !== 'all') {
        filtered = filtered.filter(poll => poll.status === this.currentStatusFilter);
      }
      
      this.filteredPolls = filtered;
    },
    
    setStatusFilter(status) {
      this.currentStatusFilter = status;
      this.filterPolls();
    },
    
    // Poll Operations
    openPollModal() {
      this.isEditingPoll = false;
      this.currentPoll = this.getEmptyPoll();
      this.currentPollOptions = [
        { text: '', color: this.defaultColors[0] },
        { text: '', color: this.defaultColors[1] }
      ];
      this.isPollModalOpen = true;
    },
    
    editPoll(poll) {
      this.isEditingPoll = true;
      this.currentPoll = { ...poll };
      
      // Get options for this poll
      const options = this.getPollOptions(poll.id);
      this.currentPollOptions = options.map(option => ({ ...option }));
      
      // Add at least two options if none exist
      if (this.currentPollOptions.length === 0) {
        this.currentPollOptions = [
          { text: '', color: this.defaultColors[0] },
          { text: '', color: this.defaultColors[1] }
        ];
      }
      
      this.isPollModalOpen = true;
    },
    
    closePollModal() {
      this.isPollModalOpen = false;
    },
    
    addOption() {
      const colorIndex = this.currentPollOptions.length % this.defaultColors.length;
      this.currentPollOptions.push({ 
        text: '', 
        color: this.defaultColors[colorIndex] 
      });
    },
    
    removeOption(index) {
      if (this.currentPollOptions.length > 2) {
        this.currentPollOptions.splice(index, 1);
      }
    },
    
    async savePoll() {
      // Validate
      if (!this.currentPoll.title) {
        alert('Bitte geben Sie einen Titel für die Umfrage ein.');
        return;
      }
      
      // Validate options
      const validOptions = this.currentPollOptions.filter(option => option.text.trim() !== '');
      if (validOptions.length < 2) {
        alert('Bitte geben Sie mindestens zwei Antwortmöglichkeiten ein.');
        return;
      }
      
      let success = false;
      
      if (this.isEditingPoll) {
        // Update existing poll
        success = await this.updatePoll(this.currentPoll, validOptions);
      } else {
        // Add new poll
        const newPoll = await this.addPoll(this.currentPoll, validOptions);
        success = !!newPoll;
      }
      
      if (success) {
        this.closePollModal();
      } else {
        alert('Es gab ein Problem beim Speichern der Umfrage. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteModal(poll) {
      this.pollToDelete = poll;
      this.isDeleteModalOpen = true;
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.pollToDelete = null;
    },
    
    async deletePoll() {
      if (!this.pollToDelete) return;
      
      const success = await this.removePoll(this.pollToDelete.id);
      
      if (success) {
        this.closeDeleteModal();
      } else {
        alert('Es gab ein Problem beim Löschen der Umfrage. Bitte versuchen Sie es erneut.');
      }
    },
    
    async closePoll(poll) {
      const success = await this.updatePollStatus(poll.id, 'closed');
      
      if (!success) {
        alert('Es gab ein Problem beim Schließen der Umfrage. Bitte versuchen Sie es erneut.');
      }
    },
    
    async reopenPoll(poll) {
      const success = await this.updatePollStatus(poll.id, 'active');
      
      if (!success) {
        alert('Es gab ein Problem beim Wiedereröffnen der Umfrage. Bitte versuchen Sie es erneut.');
      }
    }
  }
};
</script>

<style>
.lv-polls {
  font-family: 'Roboto', sans-serif;
  color: #333;
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

.lv-col-md-1 {
  flex: 0 0 8.333333%;
  max-width: 8.333333%;
}

.lv-col-md-2 {
  flex: 0 0 16.666667%;
  max-width: 16.666667%;
}

.lv-col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.lv-col-md-9 {
  flex: 0 0 75%;
  max-width: 75%;
}

.lv-mb-2 {
  margin-bottom: 10px;
}

.lv-mb-3 {
  margin-bottom: 15px;
}

.lv-mt-2 {
  margin-top: 10px;
}

.lv-mt-3 {
  margin-top: 15px;
}

.lv-p-3 {
  padding: 15px;
}

.lv-p-5 {
  padding: 25px;
}

.lv-text-right {
  text-align: right;
}

.lv-text-center {
  text-align: center;
}

.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-card-body {
  padding: 15px;
}

.lv-stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.lv-stat-item {
  text-align: center;
  padding: 10px;
  flex: 1;
  min-width: 80px;
}

.lv-stat-value {
  font-size: 24px;
  font-weight: bold;
}

.lv-stat-label {
  font-size: 12px;
  color: #666;
}

.lv-search-container {
  position: relative;
}

.lv-search-input {
  width: 100%;
  padding: 8px 30px 8px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.lv-search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
}

.lv-button-group {
  display: flex;
  gap: 10px;
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

.lv-btn-sm {
  padding: 5px 10px;
  font-size: 12px;
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

.lv-btn-danger {
  background-color: #dc3545;
  color: white;
}

.lv-btn-danger:hover {
  background-color: #c82333;
}

.lv-filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.lv-filter-group {
  display: flex;
  gap: 5px;
}

.lv-filter-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  font-size: 12px;
}

.lv-filter-active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.lv-poll-card {
  margin-bottom: 20px;
}

.lv-poll-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.lv-poll-title-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lv-poll-title {
  margin: 0;
  font-size: 18px;
}

.lv-poll-status {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.lv-status-active {
  background-color: #d4edda;
  color: #155724;
}

.lv-status-closed {
  background-color: #f8d7da;
  color: #721c24;
}

.lv-poll-actions {
  display: flex;
  gap: 5px;
}

.lv-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  border-radius: 4px;
}

.lv-btn-icon:hover {
  background-color: #f8f9fa;
}

.lv-poll-description {
  margin-bottom: 10px;
  font-size: 14px;
}

.lv-poll-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 15px;
}

.lv-poll-options {
  margin-top: 15px;
}

.lv-poll-option {
  margin-bottom: 15px;
}

.lv-poll-option-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.lv-poll-option-text {
  font-weight: 500;
}

.lv-poll-option-votes {
  font-size: 12px;
  color: #666;
}

.lv-poll-option-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lv-progress-bar {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  flex: 1;
}

.lv-progress-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

.lv-poll-option-percentage {
  font-size: 12px;
  min-width: 40px;
  text-align: right;
}

.lv-vote-btn {
  margin-top: 5px;
}

.lv-poll-controls {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}

.lv-poll-voted-message {
  font-size: 14px;
  font-style: italic;
  color: #666;
  margin-top: 15px;
}

.lv-empty-state {
  text-align: center;
  padding: 30px 0;
}

.lv-empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.lv-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.lv-modal-open {
  display: flex;
}

.lv-modal-dialog {
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
}

.lv-modal-sm {
  max-width: 400px;
}

.lv-modal-content {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.lv-modal-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lv-modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.lv-modal-body {
  padding: 15px;
}

.lv-modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.lv-checkbox-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lv-checkbox {
  margin-right: 5px;
}

.lv-poll-options-editor {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  background-color: #f8f9fa;
}

.lv-poll-option-editor {
  margin-bottom: 10px;
}

.lv-color-picker-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.lv-color-picker {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.lv-remove-option {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-1, .lv-col-md-2, .lv-col-md-6, .lv-col-md-9 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .lv-poll-title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .lv-poll-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .lv-modal-dialog {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
}
</style>
