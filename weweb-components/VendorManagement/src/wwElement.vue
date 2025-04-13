<template>
  <div class="lv-vendor-management">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-vendor-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Dienstleister-Management' }}</h2>
                <p>{{ content.subtitle || 'Verwalten Sie alle Dienstleister für Ihre Hochzeit an einem Ort' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ content.totalVendors || '15' }}</div>
                    <div class="lv-stat-label">{{ content.totalVendorsLabel || 'Dienstleister' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ content.bookedVendors || '8' }}</div>
                    <div class="lv-stat-label">{{ content.bookedVendorsLabel || 'Gebucht' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ content.contactedVendors || '4' }}</div>
                    <div class="lv-stat-label">{{ content.contactedVendorsLabel || 'In Kontakt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-danger">{{ content.pendingVendors || '3' }}</div>
                    <div class="lv-stat-label">{{ content.pendingVendorsLabel || 'Offen' }}</div>
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
            <div class="lv-filter-group">
              <button 
                class="lv-filter-btn" 
                :class="{ 'lv-filter-active': activeStatusFilter === 'all' }"
                @click="setStatusFilter('all')">
                {{ content.allFilterBtn || 'Alle' }}
              </button>
              <button 
                class="lv-filter-btn" 
                :class="{ 'lv-filter-active': activeStatusFilter === 'booked' }"
                @click="setStatusFilter('booked')">
                {{ content.bookedFilterBtn || 'Gebucht' }}
              </button>
              <button 
                class="lv-filter-btn" 
                :class="{ 'lv-filter-active': activeStatusFilter === 'contacted' }"
                @click="setStatusFilter('contacted')">
                {{ content.contactedFilterBtn || 'In Kontakt' }}
              </button>
              <button 
                class="lv-filter-btn" 
                :class="{ 'lv-filter-active': activeStatusFilter === 'pending' }"
                @click="setStatusFilter('pending')">
                {{ content.pendingFilterBtn || 'Offen' }}
              </button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-search-container lv-mb-2">
              <input 
                type="text" 
                class="lv-search-input" 
                v-model="searchQuery" 
                :placeholder="content.searchPlaceholder || 'Dienstleister suchen...'">
            </div>
            <button class="lv-btn lv-btn-primary" @click="openAddVendorModal">
              {{ content.addVendorBtn || 'Dienstleister hinzufügen' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Category Filter -->
      <div class="lv-category-filter lv-mb-3">
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'all' }"
          @click="setCategoryFilter('all')">
          {{ content.allCategoriesBtn || 'Alle Kategorien' }}
        </button>
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'venue' }"
          @click="setCategoryFilter('venue')">
          {{ content.venueCategoryBtn || 'Location' }}
        </button>
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'catering' }"
          @click="setCategoryFilter('catering')">
          {{ content.cateringCategoryBtn || 'Catering' }}
        </button>
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'photography' }"
          @click="setCategoryFilter('photography')">
          {{ content.photographyCategoryBtn || 'Fotografie' }}
        </button>
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'music' }"
          @click="setCategoryFilter('music')">
          {{ content.musicCategoryBtn || 'Musik' }}
        </button>
        <button 
          class="lv-category-btn" 
          :class="{ 'lv-category-active': activeCategoryFilter === 'decoration' }"
          @click="setCategoryFilter('decoration')">
          {{ content.decorationCategoryBtn || 'Dekoration' }}
        </button>
      </div>
      
      <!-- Vendor Cards -->
      <div class="lv-vendor-grid">
        <div 
          v-for="vendor in filteredVendors" 
          :key="vendor.id"
          class="lv-vendor-card" 
          :data-vendor-id="vendor.id" 
          :data-category="vendor.category" 
          :data-status="vendor.status">
          <div class="lv-vendor-card-header">
            <div class="lv-vendor-category">{{ getCategoryLabel(vendor.category) }}</div>
            <div class="lv-vendor-status" :class="'lv-status-' + vendor.status">{{ getStatusLabel(vendor.status) }}</div>
          </div>
          <div class="lv-vendor-card-body">
            <h3 class="lv-vendor-name">{{ vendor.name }}</h3>
            <div class="lv-vendor-contact">
              <div class="lv-contact-item" v-if="vendor.contactPerson">
                <span class="lv-contact-label">{{ content.contactLabel || 'Kontakt:' }}</span>
                <span class="lv-contact-value">{{ vendor.contactPerson }}</span>
              </div>
              <div class="lv-contact-item" v-if="vendor.phone">
                <span class="lv-contact-label">{{ content.phoneLabel || 'Telefon:' }}</span>
                <span class="lv-contact-value">{{ vendor.phone }}</span>
              </div>
              <div class="lv-contact-item" v-if="vendor.email">
                <span class="lv-contact-label">{{ content.emailLabel || 'E-Mail:' }}</span>
                <span class="lv-contact-value">{{ vendor.email }}</span>
              </div>
            </div>
            <div class="lv-vendor-price" v-if="vendor.price">
              <span class="lv-price-label">{{ content.priceLabel || 'Preis:' }}</span>
              <span class="lv-price-value">{{ vendor.price }}</span>
            </div>
            <div class="lv-vendor-notes" v-if="vendor.notes">
              <p>{{ vendor.notes }}</p>
            </div>
          </div>
          <div class="lv-vendor-card-footer">
            <button class="lv-btn lv-btn-sm lv-btn-outline" @click="viewVendorDetails(vendor)">
              {{ content.detailsBtn || 'Details' }}
            </button>
            <button class="lv-btn lv-btn-sm lv-btn-outline" @click="editVendor(vendor)">
              {{ content.editBtn || 'Bearbeiten' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Vendor Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-active': showVendorModal }">
      <div class="lv-modal-dialog lv-modal-lg">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditMode ? (content.editVendorTitle || 'Dienstleister bearbeiten') : (content.addVendorTitle || 'Dienstleister hinzufügen') }}</h3>
            <button class="lv-modal-close" @click="closeVendorModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <form @submit.prevent="saveVendor">
              <input type="hidden" v-model="editingVendor.id">
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.nameLabel || 'Name*' }}</label>
                    <input type="text" class="lv-form-control" v-model="editingVendor.name" required :placeholder="content.namePlaceholder || 'Name des Dienstleisters'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.categoryLabel || 'Kategorie*' }}</label>
                    <select class="lv-form-control" v-model="editingVendor.category" required>
                      <option value="">{{ content.categoryPlaceholder || 'Bitte wählen' }}</option>
                      <option value="venue">{{ content.venueCategoryBtn || 'Location' }}</option>
                      <option value="catering">{{ content.cateringCategoryBtn || 'Catering' }}</option>
                      <option value="photography">{{ content.photographyCategoryBtn || 'Fotografie' }}</option>
                      <option value="music">{{ content.musicCategoryBtn || 'Musik' }}</option>
                      <option value="decoration">{{ content.decorationCategoryBtn || 'Dekoration' }}</option>
                      <option value="cake">{{ content.cakeCategoryBtn || 'Hochzeitstorte' }}</option>
                      <option value="transportation">{{ content.transportationCategoryBtn || 'Transport' }}</option>
                      <option value="attire">{{ content.attireCategoryBtn || 'Kleidung' }}</option>
                      <option value="beauty">{{ content.beautyCategoryBtn || 'Friseur & Make-up' }}</option>
                      <option value="other">{{ content.otherCategoryBtn || 'Sonstiges' }}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.contactPersonLabel || 'Kontaktperson' }}</label>
                    <input type="text" class="lv-form-control" v-model="editingVendor.contactPerson" :placeholder="content.contactPersonPlaceholder || 'Name der Kontaktperson'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.statusLabel || 'Status' }}</label>
                    <select class="lv-form-control" v-model="editingVendor.status">
                      <option value="pending">{{ content.pendingStatusOption || 'Offen' }}</option>
                      <option value="contacted">{{ content.contactedStatusOption || 'In Kontakt' }}</option>
                      <option value="quote">{{ content.quoteStatusOption || 'Angebot erhalten' }}</option>
                      <option value="booked">{{ content.bookedStatusOption || 'Gebucht' }}</option>
                      <option value="rejected">{{ content.rejectedStatusOption || 'Abgelehnt' }}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.phoneLabel || 'Telefon' }}</label>
                    <input type="tel" class="lv-form-control" v-model="editingVendor.phone" :placeholder="content.phonePlaceholder || 'Telefonnummer'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.emailLabel || 'E-Mail' }}</label>
                    <input type="email" class="lv-form-control" v-model="editingVendor.email" :placeholder="content.emailPlaceholder || 'E-Mail-Adresse'">
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.websiteLabel || 'Website' }}</label>
                    <input type="url" class="lv-form-control" v-model="editingVendor.website" :placeholder="content.websitePlaceholder || 'Website-URL'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.priceLabel || 'Preiskategorie' }}</label>
                    <select class="lv-form-control" v-model="editingVendor.price">
                      <option value="€">{{ content.priceLowOption || '€ (günstig)' }}</option>
                      <option value="€€">{{ content.priceMediumOption || '€€ (mittel)' }}</option>
                      <option value="€€€">{{ content.priceHighOption || '€€€ (gehoben)' }}</option>
                      <option value="€€€€">{{ content.priceLuxuryOption || '€€€€ (luxus)' }}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.notesLabel || 'Notizen' }}</label>
                <textarea class="lv-form-control" v-model="editingVendor.notes" rows="3" :placeholder="content.notesPlaceholder || 'Zusätzliche Informationen zum Dienstleister'"></textarea>
              </div>
            </form>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeVendorModal">
              {{ content.cancelBtn || 'Abbrechen' }}
            </button>
            <button class="lv-btn lv-btn-primary" @click="saveVendor">
              {{ content.saveBtn || 'Speichern' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- View Vendor Details Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-active': showDetailsModal }">
      <div class="lv-modal-dialog lv-modal-lg">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.vendorDetailsTitle || 'Dienstleister Details' }}</h3>
            <button class="lv-modal-close" @click="closeDetailsModal">&times;</button>
          </div>
          <div class="lv-modal-body" v-if="selectedVendor">
            <div class="lv-vendor-details">
              <div class="lv-detail-header">
                <h2>{{ selectedVendor.name }}</h2>
                <div class="lv-detail-category">{{ getCategoryLabel(selectedVendor.category) }}</div>
                <div class="lv-detail-status" :class="'lv-status-' + selectedVendor.status">{{ getStatusLabel(selectedVendor.status) }}</div>
              </div>
              
              <div class="lv-detail-section">
                <h4>{{ content.contactInfoTitle || 'Kontaktinformationen' }}</h4>
                <div class="lv-detail-item" v-if="selectedVendor.contactPerson">
                  <div class="lv-detail-label">{{ content.contactLabel || 'Kontakt:' }}</div>
                  <div class="lv-detail-value">{{ selectedVendor.contactPerson }}</div>
                </div>
                <div class="lv-detail-item" v-if="selectedVendor.phone">
                  <div class="lv-detail-label">{{ content.phoneLabel || 'Telefon:' }}</div>
                  <div class="lv-detail-value">{{ selectedVendor.phone }}</div>
                </div>
                <div class="lv-detail-item" v-if="selectedVendor.email">
                  <div class="lv-detail-label">{{ content.emailLabel || 'E-Mail:' }}</div>
                  <div class="lv-detail-value">{{ selectedVendor.email }}</div>
                </div>
                <div class="lv-detail-item" v-if="selectedVendor.website">
                  <div class="lv-detail-label">{{ content.websiteLabel || 'Website:' }}</div>
                  <div class="lv-detail-value">
                    <a :href="selectedVendor.website" target="_blank">{{ selectedVendor.website }}</a>
                  </div>
                </div>
              </div>
              
              <div class="lv-detail-section">
                <h4>{{ content.detailsTitle || 'Details' }}</h4>
                <div class="lv-detail-item" v-if="selectedVendor.price">
                  <div class="lv-detail-label">{{ content.priceLabel || 'Preis:' }}</div>
                  <div class="lv-detail-value">{{ selectedVendor.price }}</div>
                </div>
                <div class="lv-detail-item" v-if="selectedVendor.notes">
                  <div class="lv-detail-label">{{ content.notesLabel || 'Notizen:' }}</div>
                  <div class="lv-detail-value">{{ selectedVendor.notes }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="editVendor(selectedVendor)">
              {{ content.editBtn || 'Bearbeiten' }}
            </button>
            <button class="lv-btn lv-btn-primary" @click="closeDetailsModal">
              {{ content.closeBtn || 'Schließen' }}
            </button>
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
      activeStatusFilter: 'all',
      activeCategoryFilter: 'all',
      searchQuery: '',
      showVendorModal: false,
      showDetailsModal: false,
      isEditMode: false,
      selectedVendor: null,
      editingVendor: {
        id: '',
        name: '',
        category: '',
        contactPerson: '',
        status: 'pending',
        phone: '',
        email: '',
        website: '',
        price: '€€',
        notes: ''
      },
      vendors: [
        {
          id: '1',
          name: 'Schloss Elmau',
          category: 'venue',
          contactPerson: 'Frau Müller',
          status: 'booked',
          phone: '+49 123 456789',
          email: 'info@schloss-elmau.de',
          website: 'https://www.schloss-elmau.de',
          price: '€€€€',
          notes: 'Vertrag unterschrieben am 01.09.2024. Anzahlung von 5.000 € geleistet.'
        },
        {
          id: '2',
          name: 'Gourmet Catering',
          category: 'catering',
          contactPerson: 'Herr Schmidt',
          status: 'booked',
          phone: '+49 987 654321',
          email: 'info@gourmet-catering.de',
          website: 'https://www.gourmet-catering.de',
          price: '€€€',
          notes: 'Vertrag unterschrieben am 01.10.2024. Menüverkostung am 15.03.2025 geplant.'
        },
        {
          id: '3',
          name: 'Moments Photography',
          category: 'photography',
          contactPerson: 'Frau Weber',
          status: 'contacted',
          phone: '+49 555 123456',
          email: 'info@moments-photography.de',
          website: 'https://www.moments-photography.de',
          price: '€€',
          notes: 'Angebot angefordert am 15.10.2024. Termin für Kennenlerngespräch vereinbaren.'
        },
        {
          id: '4',
          name: 'DJ Groove',
          category: 'music',
          contactPerson: 'Herr Becker',
          status: 'contacted',
          phone: '+49 333 777888',
          email: 'info@dj-groove.de',
          website: 'https://www.dj-groove.de',
          price: '€€',
          notes: 'Angebot erhalten am 01.11.2024. Songwünsche zusammenstellen.'
        },
        {
          id: '5',
          name: 'Blumen Schmidt',
          category: 'decoration',
          contactPerson: 'Frau Schmidt',
          status: 'pending',
          phone: '+49 222 444666',
          email: 'info@blumen-schmidt.de',
          website: 'https://www.blumen-schmidt.de',
          price: '€€',
          notes: 'Noch nicht kontaktiert. Termin für Beratungsgespräch vereinbaren.'
        }
      ]
    };
  },
  computed: {
    filteredVendors() {
      return this.vendors.filter(vendor => {
        // Filter by status
        const statusMatch = this.activeStatusFilter === 'all' || vendor.status === this.activeStatusFilter;
        
        // Filter by category
        const categoryMatch = this.activeCategoryFilter === 'all' || vendor.category === this.activeCategoryFilter;
        
        // Filter by search query
        const searchMatch = this.searchQuery === '' || 
          vendor.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (vendor.notes && vendor.notes.toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        return statusMatch && categoryMatch && searchMatch;
      });
    }
  },
  methods: {
    setStatusFilter(status) {
      this.activeStatusFilter = status;
    },
    setCategoryFilter(category) {
      this.activeCategoryFilter = category;
    },
    getCategoryLabel(category) {
      const categoryMap = {
        'venue': this.content.venueCategoryBtn || 'Location',
        'catering': this.content.cateringCategoryBtn || 'Catering',
        'photography': this.content.photographyCategoryBtn || 'Fotografie',
        'music': this.content.musicCategoryBtn || 'Musik',
        'decoration': this.content.decorationCategoryBtn || 'Dekoration',
        'cake': this.content.cakeCategoryBtn || 'Hochzeitstorte',
        'transportation': this.content.transportationCategoryBtn || 'Transport',
        'attire': this.content.attireCategoryBtn || 'Kleidung',
        'beauty': this.content.beautyCategoryBtn || 'Friseur & Make-up',
        'other': this.content.otherCategoryBtn || 'Sonstiges'
      };
      
      return categoryMap[category] || category;
    },
    getStatusLabel(status) {
      const statusMap = {
        'pending': this.content.pendingStatusOption || 'Offen',
        'contacted': this.content.contactedStatusOption || 'In Kontakt',
        'quote': this.content.quoteStatusOption || 'Angebot erhalten',
        'booked': this.content.bookedStatusOption || 'Gebucht',
        'rejected': this.content.rejectedStatusOption || 'Abgelehnt'
      };
      
      return statusMap[status] || status;
    },
    openAddVendorModal() {
      this.isEditMode = false;
      this.editingVendor = {
        id: Date.now().toString(), // Generate a unique ID
        name: '',
        category: '',
        contactPerson: '',
        status: 'pending',
        phone: '',
        email: '',
        website: '',
        price: '€€',
        notes: ''
      };
      this.showVendorModal = true;
    },
    editVendor(vendor) {
      this.isEditMode = true;
      this.editingVendor = { ...vendor };
      this.showVendorModal = true;
      
      // If details modal is open, close it
      if (this.showDetailsModal) {
        this.showDetailsModal = false;
      }
    },
    viewVendorDetails(vendor) {
      this.selectedVendor = vendor;
      this.showDetailsModal = true;
    },
    closeVendorModal() {
      this.showVendorModal = false;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
    },
    saveVendor() {
      if (!this.editingVendor.name || !this.editingVendor.category) {
        alert(this.content.requiredFieldsMessage || 'Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      if (this.isEditMode) {
        // Find and update the existing vendor
        const index = this.vendors.findIndex(v => v.id === this.editingVendor.id);
        if (index !== -1) {
          this.vendors.splice(index, 1, { ...this.editingVendor });
          
          // If this vendor is currently selected in the details view, update it
          if (this.selectedVendor && this.selectedVendor.id === this.editingVendor.id) {
            this.selectedVendor = { ...this.editingVendor };
          }
        }
      } else {
        // Add new vendor
        this.vendors.push({ ...this.editingVendor });
      }
      
      this.closeVendorModal();
    }
  }
};
</script>

<style scoped>
/* Vendor Management styles */
.lv-vendor-management {
  padding: 20px 0;
}

.lv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.lv-mb-2 {
  margin-bottom: 0.5rem;
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

.lv-text-right {
  text-align: right;
}

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
}

.lv-card-body {
  padding: 1rem;
}

/* Stats styles */
.lv-stats-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  text-align: center;
}

.lv-stat-item {
  padding: 0.5rem;
}

.lv-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.lv-stat-label {
  font-size: 0.875rem;
  color: #666;
}

.lv-text-success {
  color: #28a745;
}

.lv-text-warning {
  color: #ffc107;
}

.lv-text-danger {
  color: #dc3545;
}

/* Filter styles */
.lv-filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lv-filter-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
}

.lv-filter-active {
  background-color: #f8c630;
  color: white;
}

/* Category filter styles */
.lv-category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lv-category-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 20px;
  font-size: 0.875rem;
}

.lv-category-active {
  background-color: #f8c630;
  color: white;
  border-color: #f8c630;
}

/* Search styles */
.lv-search-container {
  margin-bottom: 0.5rem;
}

.lv-search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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
  color: #6c757d;
  background-color: transparent;
  border-color: #6c757d;
}

.lv-btn-outline:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Vendor grid styles */
.lv-vendor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

/* Vendor card styles */
.lv-vendor-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.lv-vendor-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.lv-vendor-category {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
}

.lv-vendor-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.lv-status-booked {
  background-color: #d4edda;
  color: #155724;
}

.lv-status-contacted {
  background-color: #fff3cd;
  color: #856404;
}

.lv-status-pending {
  background-color: #f8d7da;
  color: #721c24;
}

.lv-status-quote {
  background-color: #cce5ff;
  color: #004085;
}

.lv-status-rejected {
  background-color: #e2e3e5;
  color: #383d41;
}

.lv-vendor-card-body {
  padding: 1rem;
  flex-grow: 1;
}

.lv-vendor-name {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.lv-vendor-contact {
  margin-bottom: 0.75rem;
}

.lv-contact-item {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.lv-contact-label {
  font-weight: 500;
  margin-right: 0.25rem;
}

.lv-vendor-price {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.lv-price-label {
  font-weight: 500;
  margin-right: 0.25rem;
}

.lv-vendor-notes {
  font-size: 0.875rem;
  color: #666;
}

.lv-vendor-notes p {
  margin: 0;
}

.lv-vendor-card-footer {
  padding: 0.75rem 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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
  z-index: 1000;
  align-items: center;
  justify-content: center;
}

.lv-modal-active {
  display: flex;
}

.lv-modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: 1.75rem auto;
}

.lv-modal-lg {
  max-width: 800px;
}

.lv-modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 0.3rem;
  outline: 0;
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.5);
}

.lv-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
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

.lv-modal-body {
  padding: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}

.lv-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  gap: 0.5rem;
}

/* Form styles */
.lv-form-group {
  margin-bottom: 1rem;
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

/* Vendor details styles */
.lv-vendor-details {
  padding: 1rem;
}

.lv-detail-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.lv-detail-header h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.lv-detail-category {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.lv-detail-status {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.lv-detail-section {
  margin-bottom: 1.5rem;
}

.lv-detail-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.lv-detail-item {
  margin-bottom: 0.75rem;
  display: flex;
}

.lv-detail-label {
  font-weight: 500;
  width: 150px;
  flex-shrink: 0;
}

.lv-detail-value {
  flex-grow: 1;
}

.lv-detail-value a {
  color: #f8c630;
  text-decoration: none;
}

.lv-detail-value a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .lv-vendor-grid {
    grid-template-columns: 1fr;
  }
  
  .lv-filter-group,
  .lv-category-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lv-action-bar .lv-col-md-6.lv-text-right {
    text-align: left;
    margin-top: 1rem;
  }
  
  .lv-detail-item {
    flex-direction: column;
  }
  
  .lv-detail-label {
    width: 100%;
    margin-bottom: 0.25rem;
  }
}
</style>
