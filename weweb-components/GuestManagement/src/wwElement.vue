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
                  <div v-for="(stat, index) in content.guestStats" :key="index" class="lv-stat-item">
                    <div class="lv-stat-value" :class="stat.textClass">{{ stat.value }}</div>
                    <div class="lv-stat-label">{{ stat.label }}</div>
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
            v-for="(filter, index) in content.statusFilters" 
            :key="'status-' + index" 
            class="lv-filter-btn" 
            :class="{ 'lv-filter-active': currentStatusFilter === filter.value }"
            @click="setStatusFilter(filter.value)">
            {{ filter.label }}
          </button>
        </div>
        <div class="lv-filter-group">
          <select class="lv-form-control lv-filter-select" v-model="currentGroupFilter" @change="filterGuests">
            <option v-for="(group, index) in content.groupFilters" :key="'group-' + index" :value="group.value">
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
                  <th v-for="(column, index) in content.tableColumns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(guest, index) in filteredGuests" :key="index" :data-status="guest.status" :data-group="guest.group">
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
                    <div>{{ guest.email }}</div>
                    <div>{{ guest.phone }}</div>
                  </td>
                  <td>{{ guest.groupLabel }}</td>
                  <td><span class="lv-badge" :class="'lv-badge-' + guest.status">{{ getRsvpLabel(guest.status) }}</span></td>
                  <td>{{ guest.meal || '-' }}</td>
                  <td>{{ guest.plusOne ? 'Ja - ' + guest.plusOneName : 'Nein' }}</td>
                  <td>
                    <div class="lv-action-buttons">
                      <button class="lv-btn-icon lv-edit-guest" @click="editGuest(index)">✏️</button>
                      <button class="lv-btn-icon lv-delete-guest" @click="openDeleteModal(index)">🗑️</button>
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
                  <select class="lv-form-control" id="guestGroup" required v-model="currentGuest.group">
                    <option value="">{{ content.selectGroupPlaceholder || 'Bitte wählen' }}</option>
                    <option v-for="(group, index) in content.groupOptions" :key="index" :value="group.value">
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
                    <option v-for="(status, index) in content.rsvpOptions" :key="index" :value="status.value">
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
                    <option v-for="(meal, index) in content.mealOptions" :key="index" :value="meal.value">
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
                    <input type="checkbox" id="guestPlusOne" class="lv-checkbox" v-model="currentGuest.plusOne">
                    <label for="guestPlusOne">{{ content.plusOneLabel || 'Plus-Eins erlaubt' }}</label>
                  </div>
                </div>
              </div>
              <div class="lv-col lv-col-md-6" v-show="currentGuest.plusOne">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="guestPlusOneName">{{ content.plusOneNameLabel || 'Name der Begleitperson' }}</label>
                  <input type="text" class="lv-form-control" id="guestPlusOneName" v-model="currentGuest.plusOneName" :placeholder="content.plusOneNamePlaceholder || 'Name der Begleitperson'">
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
      searchQuery: '',
      currentStatusFilter: 'all',
      currentGroupFilter: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      isGuestModalOpen: false,
      isDeleteModalOpen: false,
      isEditMode: false,
      currentGuestIndex: -1,
      currentGuest: this.getEmptyGuest(),
      filteredGuests: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredGuests.length / this.itemsPerPage);
    },
    paginatedGuests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredGuests.slice(start, end);
    }
  },
  mounted() {
    this.filterGuests();
  },
  methods: {
    getEmptyGuest() {
      return {
        name: '',
        email: '',
        phone: '',
        group: '',
        groupLabel: '',
        status: 'pending',
        meal: '',
        plusOne: false,
        plusOneName: '',
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
      let filtered = [...(this.content.guests || [])];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(guest => 
          guest.name.toLowerCase().includes(query) || 
          guest.email.toLowerCase().includes(query) ||
          guest.phone.includes(query) ||
          (guest.notes && guest.notes.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentStatusFilter !== 'all') {
        filtered = filtered.filter(guest => guest.status === this.currentStatusFilter);
      }
      
      // Apply group filter
      if (this.currentGroupFilter !== 'all') {
        filtered = filtered.filter(guest => guest.group === this.currentGroupFilter);
      }
      
      this.filteredGuests = filtered;
      this.currentPage = 1; // Reset to first page when filters change
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
    editGuest(index) {
      this.isEditMode = true;
      this.currentGuestIndex = index;
      this.currentGuest = { ...this.filteredGuests[index] };
      this.isGuestModalOpen = true;
    },
    saveGuest() {
      if (!this.currentGuest.name || !this.currentGuest.group) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      // Find the group label
      const groupOption = (this.content.groupOptions || []).find(g => g.value === this.currentGuest.group);
      if (groupOption) {
        this.currentGuest.groupLabel = groupOption.label;
      }
      
      if (this.isEditMode) {
        // Update existing guest
        // In a real application, you would update this in a database
        console.log('Guest updated:', this.currentGuest);
      } else {
        // Add new guest
        // In a real application, you would save this to a database
        const updatedGuests = [...(this.content.guests || [])];
        updatedGuests.push({...this.currentGuest});
        
        // In WeWeb, you would typically use a workflow to update the content
        console.log('New guest added:', this.currentGuest);
      }
      
      this.closeGuestModal();
      this.filterGuests();
    },
    openDeleteModal(index) {
      this.currentGuestIndex = index;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },
    deleteGuest() {
      // In a real application, you would delete this from a database
      console.log('Guest deleted:', this.filteredGuests[this.currentGuestIndex]);
      
      this.closeDeleteModal();
      this.filterGuests();
    },
    importGuests() {
      // This would typically open a file picker or import dialog
      console.log('Import guests functionality would be implemented here');
      // In a real application, you would handle file upload and parsing
    }
  }
};
</script>

<style scoped>
/* Guest Management styles */
.lv-guest-management {
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

.lv-card-body.lv-p-0 {
  padding: 0;
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

.lv-text-success {
  color: #4caf50;
}

.lv-text-danger {
  color: #f44336;
}

.lv-text-warning {
  color: #ffc107;
}

/* Search and action bar */
.lv-search-container {
  position: relative;
}

.lv-search-input {
  padding-right: 40px;
}

.lv-search-btn {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 40px;
  background: none;
  border: none;
  cursor: pointer;
}

.lv-button-group {
  display: flex;
  justify-content: flex-end;
}

.lv-button-group .lv-btn {
  margin-left: 0.5rem;
}

/* Filter bar */
.lv-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.lv-filter-group {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.lv-filter-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.375rem 0.75rem;
  margin-right: 0.5rem;
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

.lv-filter-select {
  min-width: 150px;
}

/* Table styles */
.lv-table {
  width: 100%;
  border-collapse: collapse;
}

.lv-table th,
.lv-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.lv-table th {
  font-weight: 600;
  background-color: #f9f9f9;
}

.lv-guest-name {
  display: flex;
  align-items: center;
}

.lv-guest-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f8c630;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.75rem;
}

.lv-guest-fullname {
  font-weight: 600;
}

.lv-guest-notes {
  font-size: 0.8rem;
  color: #777;
}

.lv-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lv-badge-confirmed {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-badge-declined {
  background-color: #ffebee;
  color: #f44336;
}

.lv-badge-pending {
  background-color: #fff8e1;
  color: #ffc107;
}

.lv-action-buttons {
  display: flex;
}

.lv-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25rem;
  margin-right: 0.5rem;
}

/* Pagination */
.lv-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.lv-pagination-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.lv-pagination-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.lv-pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lv-pagination-pages {
  display: flex;
  margin: 0 0.5rem;
}

.lv-pagination-page {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  margin: 0 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.lv-pagination-page:hover {
  background-color: #f5f5f5;
}

.lv-pagination-active {
  background-color: #f8c630;
  color: white;
  border-color: #f8c630;
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

select.lv-form-control {
  height: calc(2.25rem + 2px);
}

.lv-checkbox-container {
  display: flex;
  align-items: center;
}

.lv-checkbox {
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

.lv-text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .lv-text-right {
    text-align: left;
    margin-top: 1rem;
  }
  
  .lv-filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lv-filter-group {
    margin-bottom: 0.5rem;
    width: 100%;
    overflow-x: auto;
  }
  
  .lv-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
