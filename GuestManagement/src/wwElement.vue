<template>
  <div class="lv-guest-management">
    <div class="lv-container">
      <!-- Header Section with Stats -->
      <div class="lv-guest-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Gästemanagement' }}</h2>
                <p>{{ content.subtitle || 'Verwalten Sie Ihre Gästeliste und verfolgen Sie RSVP-Status' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ totalGuests }}</div>
                    <div class="lv-stat-label">{{ content.totalGuestsLabel || 'Gäste gesamt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ confirmedGuests }}</div>
                    <div class="lv-stat-label">{{ content.confirmedGuestsLabel || 'Zugesagt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-danger">{{ declinedGuests }}</div>
                    <div class="lv-stat-label">{{ content.declinedGuestsLabel || 'Abgesagt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ pendingGuests }}</div>
                    <div class="lv-stat-label">{{ content.pendingGuestsLabel || 'Ausstehend' }}</div>
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
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Gäste suchen...'" v-model="searchQuery" @input="filterGuests">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-outline lv-import-btn" @click="importGuests">{{ content.importButtonText || 'Importieren' }}</button>
              <button class="lv-btn lv-btn-primary lv-add-guest-btn" @click="openGuestModal">{{ content.addGuestButtonText || 'Gast hinzufügen' }}</button>
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
        <div class="lv-filter-group">
          <select class="lv-form-control lv-filter-select" v-model="currentGroupFilter" @change="filterGuests">
            <option value="all">{{ content.allGroupsLabel || 'Alle Gruppen' }}</option>
            <option v-for="group in groupOptions" :key="group.value" :value="group.value">
              {{ group.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Guest List -->
      <div class="lv-guest-list lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-0">
            <table class="lv-table">
              <thead>
                <tr>
                  <th v-for="(column, index) in tableColumns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(guest, index) in paginatedGuests" :key="guest.id" :data-status="guest.status" :data-group="guest.group_type">
                  <td>
                    <div class="lv-guest-name">
                      <div class="lv-guest-avatar">{{ getInitials(guest.name) }}</div>
                      <div>
                        <div class="lv-guest-fullname">{{ guest.name }}</div>
                        <div class="lv-guest-notes">{{ guest.notes }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{{ guest.email || '-' }}</div>
                    <div>{{ guest.phone || '-' }}</div>
                  </td>
                  <td>{{ guest.group_label }}</td>
                  <td><span class="lv-badge" :class="'lv-badge-' + guest.status">{{ getRsvpLabel(guest.status) }}</span></td>
                  <td>{{ guest.meal || '-' }}</td>
                  <td>{{ guest.plus_one ? 'Ja - ' + (guest.plus_one_name || 'Unbenannt') : 'Nein' }}</td>
                  <td>
                    <div class="lv-action-buttons">
                      <button class="lv-btn-icon lv-edit-guest" @click="editGuest(guest)">✏️</button>
                      <button class="lv-btn-icon lv-delete-guest" @click="openDeleteModal(guest)">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="lv-pagination">
        <button class="lv-pagination-btn lv-pagination-prev" :disabled="currentPage === 1" @click="prevPage">&laquo; {{ content.prevPageText || 'Zurück' }}</button>
        <div class="lv-pagination-pages">
          <button 
            v-for="page in totalPages" 
            :key="page" 
            class="lv-pagination-page" 
            :class="{ 'lv-pagination-active': currentPage === page }"
            @click="goToPage(page)">
            {{ page }}
          </button>
        </div>
        <button class="lv-pagination-btn lv-pagination-next" :disabled="currentPage === totalPages" @click="nextPage">{{ content.nextPageText || 'Weiter' }} &raquo;</button>
      </div>
    </div>
  </div>

  <!-- Add/Edit Guest Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isGuestModalOpen }">
    <div class="lv-modal-dialog">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ isEditMode ? content.editGuestTitle || 'Gast bearbeiten' : content.addGuestTitle || 'Gast hinzufügen' }}</h3>
          <button class="lv-modal-close" @click="closeGuestModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="guestForm">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestName">{{ content.nameLabel || 'Name' }}*</label>
                  <input type="text" class="lv-form-control" id="guestName" required v-model="currentGuest.name" :placeholder="content.namePlaceholder || 'Vollständiger Name'">
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestEmail">{{ content.emailLabel || 'E-Mail' }}</label>
                  <input type="email" class="lv-form-control" id="guestEmail" v-model="currentGuest.email" :placeholder="content.emailPlaceholder || 'E-Mail-Adresse'">
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestPhone">{{ content.phoneLabel || 'Telefon' }}</label>
                  <input type="tel" class="lv-form-control" id="guestPhone" v-model="currentGuest.phone" :placeholder="content.phonePlaceholder || 'Telefonnummer'">
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestGroup">{{ content.groupLabel || 'Gruppe' }}*</label>
                  <select class="lv-form-control" id="guestGroup" required v-model="currentGuest.group_type">
                    <option value="">{{ content.selectGroupPlaceholder || 'Bitte wählen' }}</option>
                    <option v-for="group in groupOptions" :key="group.value" :value="group.value">
                      {{ group.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestRsvp">{{ content.rsvpLabel || 'RSVP-Status' }}</label>
                  <select class="lv-form-control" id="guestRsvp" v-model="currentGuest.status">
                    <option v-for="status in rsvpOptions" :key="status.value" :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestMeal">{{ content.mealLabel || 'Menüwahl' }}</label>
                  <select class="lv-form-control" id="guestMeal" v-model="currentGuest.meal">
                    <option value="">{{ content.selectMealPlaceholder || 'Bitte wählen' }}</option>
                    <option v-for="meal in mealOptions" :key="meal.value" :value="meal.value">
                      {{ meal.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <div class="lv-checkbox-container">
                    <input type="checkbox" id="guestPlusOne" class="lv-checkbox" v-model="currentGuest.plus_one">
                    <label for="guestPlusOne">{{ content.plusOneLabel || 'Plus-Eins erlaubt' }}</label>
                  </div>
                </div>
              </div>
              <div class="lv-col lv-col-md-6" v-show="currentGuest.plus_one">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestPlusOneName">{{ content.plusOneNameLabel || 'Name der Begleitperson' }}</label>
                  <input type="text" class="lv-form-control" id="guestPlusOneName" v-model="currentGuest.plus_one_name" :placeholder="content.plusOneNamePlaceholder || 'Name der Begleitperson'">
                </div>
              </div>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="guestNotes">{{ content.notesLabel || 'Notizen' }}</label>
              <textarea class="lv-form-control" id="guestNotes" rows="3" v-model="currentGuest.notes" :placeholder="content.notesPlaceholder || 'Zusätzliche Informationen'"></textarea>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeGuestModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="saveGuest">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
    <div class="lv-modal-dialog lv-modal-sm">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ content.deleteGuestTitle || 'Gast löschen' }}</h3>
          <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <p>{{ content.deleteConfirmationText || 'Sind Sie sicher, dass Sie diesen Gast löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-danger" @click="deleteGuest">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      
      // Guests data
      guests: [],
      filteredGuests: [],
      
      // UI state
      searchQuery: '',
      currentStatusFilter: 'all',
      currentGroupFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      isGuestModalOpen: false,
      isDeleteModalOpen: false,
      isEditMode: false,
      currentGuest: this.getEmptyGuest(),
      guestToDelete: null,
      
      // Options for dropdowns
      statusFilters: [
        { value: 'all', label: 'Alle Status' },
        { value: 'confirmed', label: 'Zugesagt' },
        { value: 'declined', label: 'Abgesagt' },
        { value: 'pending', label: 'Ausstehend' }
      ],
      rsvpOptions: [
        { value: 'confirmed', label: 'Zugesagt' },
        { value: 'declined', label: 'Abgesagt' },
        { value: 'pending', label: 'Ausstehend' }
      ],
      groupOptions: [],
      mealOptions: [
        { value: 'meat', label: 'Fleisch' },
        { value: 'fish', label: 'Fisch' },
        { value: 'vegetarian', label: 'Vegetarisch' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'special', label: 'Spezielle Anforderungen' }
      ],
      tableColumns: [
        'Name',
        'Kontakt',
        'Gruppe',
        'RSVP',
        'Menü',
        'Plus-Eins',
        'Aktionen'
      ]
    };
  },
  computed: {
    totalGuests() {
      return this.guests.length;
    },
    confirmedGuests() {
      return this.guests.filter(guest => guest.status === 'confirmed').length;
    },
    declinedGuests() {
      return this.guests.filter(guest => guest.status === 'declined').length;
    },
    pendingGuests() {
      return this.guests.filter(guest => guest.status === 'pending').length;
    },
    totalPages() {
      return Math.ceil(this.filteredGuests.length / this.itemsPerPage);
    },
    paginatedGuests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredGuests.slice(start, end);
    }
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get wedding ID for current user
    await this.getCurrentWeddingId();
    
    // Load data
    if (this.weddingId) {
      await this.loadGuests();
      this.setupGroupOptions();
    }
    
    // Initialize filtered guests
    this.filterGuests();
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
    
    async getCurrentWeddingId() {
      try {
        if (!this.supabase) return;
        
        // Get current user
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return;
        
        // Get user profile with wedding ID
        const { data: userData, error: userError } = await this.supabase
          .from('users')
          .select('wedding_id')
          .eq('id', user.id)
          .single();
        
        if (userError) throw userError;
        
        this.weddingId = userData.wedding_id;
      } catch (error) {
        console.error('Error getting wedding ID:', error);
      }
    },
    
    async loadGuests() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.guests = data || [];
      } catch (error) {
        console.error('Error loading guests:', error);
      }
    },
    
    setupGroupOptions() {
      // Extract unique group types and create options
      const uniqueGroups = [...new Set(this.guests.map(guest => guest.group_type))];
      
      this.groupOptions = uniqueGroups.map(group => {
        const guest = this.guests.find(g => g.group_type === group);
        return {
          value: group,
          label: guest ? guest.group_label : group
        };
      });
    },
    
    // Guest Operations
    async addGuest(guestData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newGuest = {
          ...guestData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('guests')
          .insert([newGuest])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add guest to local state
          this.guests.push(data[0]);
          this.setupGroupOptions();
          this.filterGuests();
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding guest:', error);
        return null;
      }
    },
    
    async updateGuest(guestData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('guests')
          .update(guestData)
          .eq('id', guestData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.guests.findIndex(g => g.id === guestData.id);
        if (index !== -1) {
          this.guests[index] = {
            ...this.guests[index],
            ...guestData
          };
        }
        
        this.setupGroupOptions();
        this.filterGuests();
        
        return true;
      } catch (error) {
        console.error('Error updating guest:', error);
        return false;
      }
    },
    
    async removeGuest(guestId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('guests')
          .update({ is_active: false })
          .eq('id', guestId);
        
        if (error) throw error;
        
        // Remove from local state
        this.guests = this.guests.filter(g => g.id !== guestId);
        this.setupGroupOptions();
        this.filterGuests();
        
        return true;
      } catch (error) {
        console.error('Error removing guest:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyGuest() {
      return {
        name: '',
        email: '',
        phone: '',
        group_type: '',
        group_label: '',
        status: 'pending',
        meal: '',
        plus_one: false,
        plus_one_name: '',
        notes: ''
      };
    },
    
    getInitials(name) {
      if (!name) return '';
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    
    getRsvpLabel(status) {
      const statusMap = {
        confirmed: 'Zugesagt',
        declined: 'Abgesagt',
        pending: 'Ausstehend'
      };
      return statusMap[status] || 'Ausstehend';
    },
    
    filterGuests() {
      let filtered = [...this.guests];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(guest => 
          guest.name.toLowerCase().includes(query) || 
          (guest.email && guest.email.toLowerCase().includes(query)) ||
          (guest.phone && guest.phone.includes(query)) ||
          (guest.notes && guest.notes.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentStatusFilter !== 'all') {
        filtered = filtered.filter(guest => guest.status === this.currentStatusFilter);
      }
      
      // Apply group filter
      if (this.currentGroupFilter !== 'all') {
        filtered = filtered.filter(guest => guest.group_type === this.currentGroupFilter);
      }
      
      this.filteredGuests = filtered;
      
      // Reset to first page when filters change
      if (this.currentPage > 1) {
        this.currentPage = 1;
      }
    },
    
    setStatusFilter(status) {
      this.currentStatusFilter = status;
      this.filterGuests();
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    goToPage(page) {
      this.currentPage = page;
    },
    
    openGuestModal() {
      this.isEditMode = false;
      this.currentGuest = this.getEmptyGuest();
      this.isGuestModalOpen = true;
    },
    
    closeGuestModal() {
      this.isGuestModalOpen = false;
    },
    
    editGuest(guest) {
      this.isEditMode = true;
      this.currentGuest = { ...guest };
      this.isGuestModalOpen = true;
    },
    
    async saveGuest() {
      if (!this.currentGuest.name || !this.currentGuest.group_type) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      // Find the group label if it exists
      const groupOption = this.groupOptions.find(g => g.value === this.currentGuest.group_type);
      if (groupOption) {
        this.currentGuest.group_label = groupOption.label;
      } else {
        // If it's a new group, use the value as the label
        this.currentGuest.group_label = this.currentGuest.group_type;
      }
      
      let success = false;
      
      if (this.isEditMode) {
        // Update existing guest
        success = await this.updateGuest(this.currentGuest);
      } else {
        // Add new guest
        const newGuest = await this.addGuest(this.currentGuest);
        success = !!newGuest;
      }
      
      if (success) {
        this.closeGuestModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Gastes. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteModal(guest) {
      this.guestToDelete = guest;
      this.isDeleteModalOpen = true;
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.guestToDelete = null;
    },
    
    async deleteGuest() {
      if (!this.guestToDelete) return;
      
      const success = await this.removeGuest(this.guestToDelete.id);
      
      if (success) {
        this.closeDeleteModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Gastes. Bitte versuchen Sie es erneut.');
      }
    },
    
    importGuests() {
      // This would typically open a file upload dialog or similar
      alert('Importfunktion wird implementiert...');
    }
  }
};
</script>

<style>
.lv-guest-management {
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

.lv-col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.lv-mb-2 {
  margin-bottom: 10px;
}

.lv-mb-3 {
  margin-bottom: 15px;
}

.lv-p-3 {
  padding: 15px;
}

.lv-text-right {
  text-align: right;
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

.lv-card-body.lv-p-0 {
  padding: 0;
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

.lv-text-success {
  color: #28a745;
}

.lv-text-danger {
  color: #dc3545;
}

.lv-text-warning {
  color: #ffc107;
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
  justify-content: space-between;
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

.lv-filter-select {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.lv-table {
  width: 100%;
  border-collapse: collapse;
}

.lv-table th, .lv-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.lv-table th {
  background-color: #f8f9fa;
  font-weight: 500;
}

.lv-guest-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lv-guest-avatar {
  width: 36px;
  height: 36px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #495057;
}

.lv-guest-fullname {
  font-weight: 500;
}

.lv-guest-notes {
  font-size: 12px;
  color: #6c757d;
}

.lv-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.lv-badge-confirmed {
  background-color: #d4edda;
  color: #155724;
}

.lv-badge-declined {
  background-color: #f8d7da;
  color: #721c24;
}

.lv-badge-pending {
  background-color: #fff3cd;
  color: #856404;
}

.lv-action-buttons {
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

.lv-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.lv-pagination-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
}

.lv-pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lv-pagination-pages {
  display: flex;
  gap: 5px;
}

.lv-pagination-page {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lv-pagination-active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .lv-filter-bar {
    flex-direction: column;
    gap: 10px;
  }
  
  .lv-filter-group {
    width: 100%;
  }
  
  .lv-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
