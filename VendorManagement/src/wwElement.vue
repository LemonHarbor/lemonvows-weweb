<template>
  <div class="lv-vendor-management">
    <div class="lv-container">
      <!-- Header Section with Stats -->
      <div class="lv-vendor-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Anbieter-Management' }}</h2>
                <p>{{ content.subtitle || 'Verwalten Sie Ihre Hochzeitsanbieter und Dienstleister' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ vendors.length }}</div>
                    <div class="lv-stat-label">{{ content.totalVendorsLabel || 'Anbieter gesamt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ confirmedVendors }}</div>
                    <div class="lv-stat-label">{{ content.confirmedVendorsLabel || 'Bestätigt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ pendingVendors }}</div>
                    <div class="lv-stat-label">{{ content.pendingVendorsLabel || 'Ausstehend' }}</div>
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
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Anbieter suchen...'" v-model="searchQuery" @input="filterVendors">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-primary lv-add-vendor-btn" @click="openVendorModal">{{ content.addVendorButtonText || 'Anbieter hinzufügen' }}</button>
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
          <select class="lv-form-control lv-filter-select" v-model="currentCategoryFilter" @change="filterVendors">
            <option value="all">{{ content.allCategoriesLabel || 'Alle Kategorien' }}</option>
            <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Vendor List -->
      <div class="lv-vendor-list">
        <div v-for="vendor in filteredVendors" :key="vendor.id" class="lv-vendor-card lv-mb-3" @click="openVendorDetails(vendor)">
          <div class="lv-card">
            <div class="lv-card-body lv-p-3">
              <div class="lv-vendor-header">
                <div class="lv-vendor-info">
                  <div class="lv-vendor-category-icon" :style="{ backgroundColor: getCategoryColor(vendor.category) }">
                    {{ getCategoryIcon(vendor.category) }}
                  </div>
                  <div>
                    <h3 class="lv-vendor-name">{{ vendor.name }}</h3>
                    <div class="lv-vendor-category">{{ getCategoryLabel(vendor.category) }}</div>
                  </div>
                </div>
                <div class="lv-vendor-status">
                  <span class="lv-badge" :class="'lv-badge-' + vendor.status">{{ getStatusLabel(vendor.status) }}</span>
                </div>
              </div>
              
              <div class="lv-vendor-contact lv-mt-2">
                <div class="lv-vendor-contact-item" v-if="vendor.contact_name">
                  <span class="lv-contact-icon">👤</span> {{ vendor.contact_name }}
                </div>
                <div class="lv-vendor-contact-item" v-if="vendor.phone">
                  <span class="lv-contact-icon">📞</span> {{ vendor.phone }}
                </div>
                <div class="lv-vendor-contact-item" v-if="vendor.email">
                  <span class="lv-contact-icon">✉️</span> {{ vendor.email }}
                </div>
              </div>
              
              <div class="lv-vendor-details lv-mt-2" v-if="vendor.price || vendor.notes">
                <div class="lv-vendor-price" v-if="vendor.price">
                  <strong>{{ content.priceLabel || 'Preis' }}:</strong> {{ formatCurrency(vendor.price) }}
                </div>
                <div class="lv-vendor-notes" v-if="vendor.notes">
                  <strong>{{ content.notesLabel || 'Notizen' }}:</strong> {{ truncateText(vendor.notes, 100) }}
                </div>
              </div>
              
              <div class="lv-vendor-actions lv-mt-2">
                <button class="lv-btn lv-btn-sm lv-btn-outline" @click.stop="editVendor(vendor)">
                  {{ content.editButtonText || 'Bearbeiten' }}
                </button>
                <button class="lv-btn lv-btn-sm lv-btn-outline lv-btn-danger" @click.stop="openDeleteModal(vendor)">
                  {{ content.deleteButtonText || 'Löschen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredVendors.length === 0" class="lv-empty-state">
          <div class="lv-card">
            <div class="lv-card-body lv-text-center lv-p-5">
              <div class="lv-empty-icon">🏢</div>
              <h3>{{ content.emptyStateTitle || 'Keine Anbieter gefunden' }}</h3>
              <p>{{ content.emptyStateMessage || 'Fügen Sie Anbieter hinzu, um Ihre Hochzeitsdienstleister zu verwalten.' }}</p>
              <button class="lv-btn lv-btn-primary lv-mt-3" @click="openVendorModal">
                {{ content.addVendorButtonText || 'Anbieter hinzufügen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Vendor Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isVendorModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditMode ? content.editVendorTitle || 'Anbieter bearbeiten' : content.addVendorTitle || 'Anbieter hinzufügen' }}</h3>
            <button class="lv-modal-close" @click="closeVendorModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <form id="vendorForm">
              <div class="lv-row">
                <div class="lv-col lv-col-md-8">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorName">{{ content.nameLabel || 'Name' }}*</label>
                    <input type="text" class="lv-form-control" id="vendorName" required v-model="currentVendor.name" :placeholder="content.namePlaceholder || 'Anbietername'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-4">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorCategory">{{ content.categoryLabel || 'Kategorie' }}*</label>
                    <select class="lv-form-control" id="vendorCategory" required v-model="currentVendor.category">
                      <option value="">{{ content.selectCategoryPlaceholder || 'Bitte wählen' }}</option>
                      <option v-for="category in categoryOptions" :key="category.value" :value="category.value">
                        {{ category.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorContactName">{{ content.contactNameLabel || 'Kontaktperson' }}</label>
                    <input type="text" class="lv-form-control" id="vendorContactName" v-model="currentVendor.contact_name" :placeholder="content.contactNamePlaceholder || 'Name der Kontaktperson'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorStatus">{{ content.statusLabel || 'Status' }}</label>
                    <select class="lv-form-control" id="vendorStatus" v-model="currentVendor.status">
                      <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                        {{ status.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorPhone">{{ content.phoneLabel || 'Telefon' }}</label>
                    <input type="tel" class="lv-form-control" id="vendorPhone" v-model="currentVendor.phone" :placeholder="content.phonePlaceholder || 'Telefonnummer'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorEmail">{{ content.emailLabel || 'E-Mail' }}</label>
                    <input type="email" class="lv-form-control" id="vendorEmail" v-model="currentVendor.email" :placeholder="content.emailPlaceholder || 'E-Mail-Adresse'">
                  </div>
                </div>
              </div>
              
              <div class="lv-row">
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorWebsite">{{ content.websiteLabel || 'Website' }}</label>
                    <input type="url" class="lv-form-control" id="vendorWebsite" v-model="currentVendor.website" :placeholder="content.websitePlaceholder || 'https://...'">
                  </div>
                </div>
                <div class="lv-col lv-col-md-6">
                  <div class="lv-form-group">
                    <label class="lv-form-label" for="vendorPrice">{{ content.priceLabel || 'Preis' }}</label>
                    <div class="lv-input-group">
                      <span class="lv-input-group-text">€</span>
                      <input type="number" class="lv-form-control" id="vendorPrice" v-model="currentVendor.price" min="0" step="0.01">
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="lv-form-group">
                <label class="lv-form-label" for="vendorAddress">{{ content.addressLabel || 'Adresse' }}</label>
                <textarea class="lv-form-control" id="vendorAddress" v-model="currentVendor.address" rows="2" :placeholder="content.addressPlaceholder || 'Straße, Hausnummer, PLZ, Ort'"></textarea>
              </div>
              
              <div class="lv-form-group">
                <label class="lv-form-label" for="vendorNotes">{{ content.notesLabel || 'Notizen' }}</label>
                <textarea class="lv-form-control" id="vendorNotes" v-model="currentVendor.notes" rows="3" :placeholder="content.notesPlaceholder || 'Zusätzliche Informationen'"></textarea>
              </div>
            </form>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeVendorModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveVendor">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Vendor Details Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isDetailsModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ selectedVendor ? selectedVendor.name : '' }}</h3>
            <button class="lv-modal-close" @click="closeDetailsModal">&times;</button>
          </div>
          <div class="lv-modal-body" v-if="selectedVendor">
            <div class="lv-vendor-details-view">
              <div class="lv-vendor-detail-header">
                <div class="lv-vendor-category-badge" :style="{ backgroundColor: getCategoryColor(selectedVendor.category) }">
                  {{ getCategoryLabel(selectedVendor.category) }}
                </div>
                <div class="lv-vendor-status-badge" :class="'lv-badge-' + selectedVendor.status">
                  {{ getStatusLabel(selectedVendor.status) }}
                </div>
              </div>
              
              <div class="lv-vendor-detail-section">
                <h4>{{ content.contactInfoLabel || 'Kontaktinformationen' }}</h4>
                <div class="lv-vendor-detail-grid">
                  <div class="lv-vendor-detail-item" v-if="selectedVendor.contact_name">
                    <div class="lv-detail-label">{{ content.contactNameLabel || 'Kontaktperson' }}:</div>
                    <div class="lv-detail-value">{{ selectedVendor.contact_name }}</div>
                  </div>
                  <div class="lv-vendor-detail-item" v-if="selectedVendor.phone">
                    <div class="lv-detail-label">{{ content.phoneLabel || 'Telefon' }}:</div>
                    <div class="lv-detail-value">
                      <a :href="'tel:' + selectedVendor.phone">{{ selectedVendor.phone }}</a>
                    </div>
                  </div>
                  <div class="lv-vendor-detail-item" v-if="selectedVendor.email">
                    <div class="lv-detail-label">{{ content.emailLabel || 'E-Mail' }}:</div>
                    <div class="lv-detail-value">
                      <a :href="'mailto:' + selectedVendor.email">{{ selectedVendor.email }}</a>
                    </div>
                  </div>
                  <div class="lv-vendor-detail-item" v-if="selectedVendor.website">
                    <div class="lv-detail-label">{{ content.websiteLabel || 'Website' }}:</div>
                    <div class="lv-detail-value">
                      <a :href="selectedVendor.website" target="_blank">{{ selectedVendor.website }}</a>
                    </div>
                  </div>
                  <div class="lv-vendor-detail-item" v-if="selectedVendor.address">
                    <div class="lv-detail-label">{{ content.addressLabel || 'Adresse' }}:</div>
                    <div class="lv-detail-value">{{ selectedVendor.address }}</div>
                  </div>
                </div>
              </div>
              
              <div class="lv-vendor-detail-section" v-if="selectedVendor.price">
                <h4>{{ content.financialInfoLabel || 'Finanzielle Informationen' }}</h4>
                <div class="lv-vendor-detail-grid">
                  <div class="lv-vendor-detail-item">
                    <div class="lv-detail-label">{{ content.priceLabel || 'Preis' }}:</div>
                    <div class="lv-detail-value lv-price">{{ formatCurrency(selectedVendor.price) }}</div>
                  </div>
                </div>
              </div>
              
              <div class="lv-vendor-detail-section" v-if="selectedVendor.notes">
                <h4>{{ content.notesLabel || 'Notizen' }}</h4>
                <div class="lv-vendor-notes-content">
                  {{ selectedVendor.notes }}
                </div>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="editVendor(selectedVendor)">{{ content.editButtonText || 'Bearbeiten' }}</button>
            <button class="lv-btn lv-btn-primary" @click="closeDetailsModal">{{ content.closeButtonText || 'Schließen' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
      <div class="lv-modal-dialog lv-modal-sm">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.deleteVendorTitle || 'Anbieter löschen' }}</h3>
            <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <p>{{ content.deleteConfirmationText || 'Sind Sie sicher, dass Sie diesen Anbieter löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deleteVendor">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      
      // Vendors data
      vendors: [],
      filteredVendors: [],
      
      // UI state
      searchQuery: '',
      currentStatusFilter: 'all',
      currentCategoryFilter: 'all',
      isVendorModalOpen: false,
      isDetailsModalOpen: false,
      isDeleteModalOpen: false,
      isEditMode: false,
      currentVendor: this.getEmptyVendor(),
      selectedVendor: null,
      vendorToDelete: null,
      
      // Options
      statusFilters: [
        { value: 'all', label: 'Alle Status' },
        { value: 'confirmed', label: 'Bestätigt' },
        { value: 'pending', label: 'Ausstehend' },
        { value: 'cancelled', label: 'Storniert' }
      ],
      statusOptions: [
        { value: 'confirmed', label: 'Bestätigt' },
        { value: 'pending', label: 'Ausstehend' },
        { value: 'cancelled', label: 'Storniert' }
      ],
      categoryOptions: [
        { value: 'venue', label: 'Location', icon: '🏰', color: '#4285F4' },
        { value: 'catering', label: 'Catering', icon: '🍽️', color: '#EA4335' },
        { value: 'photography', label: 'Fotografie', icon: '📷', color: '#FBBC05' },
        { value: 'videography', label: 'Videografie', icon: '🎥', color: '#34A853' },
        { value: 'music', label: 'Musik/DJ', icon: '🎵', color: '#FF6D01' },
        { value: 'florist', label: 'Florist', icon: '💐', color: '#46BDC6' },
        { value: 'cake', label: 'Hochzeitstorte', icon: '🎂', color: '#7BAAF7' },
        { value: 'decoration', label: 'Dekoration', icon: '✨', color: '#F6AEA9' },
        { value: 'transportation', label: 'Transport', icon: '🚗', color: '#FDE293' },
        { value: 'attire', label: 'Kleidung', icon: '👗', color: '#A8DAB5' },
        { value: 'beauty', label: 'Beauty/Styling', icon: '💄', color: '#FDC69C' },
        { value: 'officiant', label: 'Standesbeamter', icon: '📜', color: '#A1E4EB' },
        { value: 'other', label: 'Sonstiges', icon: '📋', color: '#CCCCCC' }
      ]
    };
  },
  computed: {
    confirmedVendors() {
      return this.vendors.filter(vendor => vendor.status === 'confirmed').length;
    },
    pendingVendors() {
      return this.vendors.filter(vendor => vendor.status === 'pending').length;
    }
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get wedding ID for current user
    await this.getCurrentWeddingId();
    
    // Load data
    if (this.weddingId) {
      await this.loadVendors();
      
      // Initialize filtered vendors
      this.filterVendors();
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
    
    async loadVendors() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('vendors')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.vendors = data || [];
      } catch (error) {
        console.error('Error loading vendors:', error);
      }
    },
    
    async addVendor(vendorData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newVendor = {
          ...vendorData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('vendors')
          .insert([newVendor])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add vendor to local state
          this.vendors.push(data[0]);
          this.filterVendors();
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding vendor:', error);
        return null;
      }
    },
    
    async updateVendor(vendorData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', vendorData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.vendors.findIndex(v => v.id === vendorData.id);
        if (index !== -1) {
          this.vendors[index] = {
            ...this.vendors[index],
            ...vendorData
          };
        }
        
        // If this is the selected vendor, update it too
        if (this.selectedVendor && this.selectedVendor.id === vendorData.id) {
          this.selectedVendor = {
            ...this.selectedVendor,
            ...vendorData
          };
        }
        
        this.filterVendors();
        
        return true;
      } catch (error) {
        console.error('Error updating vendor:', error);
        return false;
      }
    },
    
    async removeVendor(vendorId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('vendors')
          .update({ is_active: false })
          .eq('id', vendorId);
        
        if (error) throw error;
        
        // Remove from local state
        this.vendors = this.vendors.filter(v => v.id !== vendorId);
        
        // If this was the selected vendor, close the details modal
        if (this.selectedVendor && this.selectedVendor.id === vendorId) {
          this.closeDetailsModal();
        }
        
        this.filterVendors();
        
        return true;
      } catch (error) {
        console.error('Error removing vendor:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyVendor() {
      return {
        name: '',
        category: '',
        contact_name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        price: null,
        notes: '',
        status: 'pending'
      };
    },
    
    formatCurrency(amount) {
      if (amount === null || amount === undefined) return '';
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
    },
    
    truncateText(text, maxLength) {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    },
    
    getCategoryLabel(categoryValue) {
      const category = this.categoryOptions.find(c => c.value === categoryValue);
      return category ? category.label : 'Sonstiges';
    },
    
    getCategoryIcon(categoryValue) {
      const category = this.categoryOptions.find(c => c.value === categoryValue);
      return category ? category.icon : '📋';
    },
    
    getCategoryColor(categoryValue) {
      const category = this.categoryOptions.find(c => c.value === categoryValue);
      return category ? category.color : '#CCCCCC';
    },
    
    getStatusLabel(statusValue) {
      const statusMap = {
        confirmed: 'Bestätigt',
        pending: 'Ausstehend',
        cancelled: 'Storniert'
      };
      return statusMap[statusValue] || 'Ausstehend';
    },
    
    filterVendors() {
      let filtered = [...this.vendors];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(vendor => 
          vendor.name.toLowerCase().includes(query) || 
          (vendor.contact_name && vendor.contact_name.toLowerCase().includes(query)) ||
          (vendor.notes && vendor.notes.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentStatusFilter !== 'all') {
        filtered = filtered.filter(vendor => vendor.status === this.currentStatusFilter);
      }
      
      // Apply category filter
      if (this.currentCategoryFilter !== 'all') {
        filtered = filtered.filter(vendor => vendor.category === this.currentCategoryFilter);
      }
      
      this.filteredVendors = filtered;
    },
    
    setStatusFilter(status) {
      this.currentStatusFilter = status;
      this.filterVendors();
    },
    
    openVendorModal() {
      this.isEditMode = false;
      this.currentVendor = this.getEmptyVendor();
      this.isVendorModalOpen = true;
    },
    
    closeVendorModal() {
      this.isVendorModalOpen = false;
    },
    
    editVendor(vendor) {
      this.isEditMode = true;
      this.currentVendor = { ...vendor };
      
      // Close details modal if open
      if (this.isDetailsModalOpen) {
        this.closeDetailsModal();
      }
      
      this.isVendorModalOpen = true;
    },
    
    openVendorDetails(vendor) {
      this.selectedVendor = vendor;
      this.isDetailsModalOpen = true;
    },
    
    closeDetailsModal() {
      this.isDetailsModalOpen = false;
      this.selectedVendor = null;
    },
    
    async saveVendor() {
      if (!this.currentVendor.name || !this.currentVendor.category) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      let success = false;
      
      if (this.isEditMode) {
        // Update existing vendor
        success = await this.updateVendor(this.currentVendor);
      } else {
        // Add new vendor
        const newVendor = await this.addVendor(this.currentVendor);
        success = !!newVendor;
      }
      
      if (success) {
        this.closeVendorModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Anbieters. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteModal(vendor) {
      this.vendorToDelete = vendor;
      this.isDeleteModalOpen = true;
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.vendorToDelete = null;
    },
    
    async deleteVendor() {
      if (!this.vendorToDelete) return;
      
      const success = await this.removeVendor(this.vendorToDelete.id);
      
      if (success) {
        this.closeDeleteModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Anbieters. Bitte versuchen Sie es erneut.');
      }
    }
  }
};
</script>

<style>
.lv-vendor-management {
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

.lv-col-md-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
}

.lv-col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.lv-col-md-8 {
  flex: 0 0 66.666667%;
  max-width: 66.666667%;
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

.lv-text-success {
  color: #28a745;
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

.lv-btn-outline.lv-btn-danger {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.lv-btn-outline.lv-btn-danger:hover {
  background-color: #f8d7da;
}

.lv-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lv-filter-group {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
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

.lv-vendor-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.lv-vendor-card:hover {
  transform: translateY(-3px);
}

.lv-vendor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.lv-vendor-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.lv-vendor-category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.lv-vendor-name {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.lv-vendor-category {
  font-size: 14px;
  color: #666;
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

.lv-badge-pending {
  background-color: #fff3cd;
  color: #856404;
}

.lv-badge-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.lv-vendor-contact {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.lv-vendor-contact-item {
  font-size: 14px;
  color: #666;
}

.lv-contact-icon {
  margin-right: 5px;
}

.lv-vendor-details {
  margin-top: 10px;
  font-size: 14px;
}

.lv-vendor-price {
  margin-bottom: 5px;
}

.lv-vendor-notes {
  color: #666;
}

.lv-vendor-actions {
  display: flex;
  gap: 10px;
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

/* Vendor Details View */
.lv-vendor-details-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.lv-vendor-detail-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.lv-vendor-category-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.lv-vendor-status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 500;
}

.lv-vendor-detail-section {
  margin-bottom: 20px;
}

.lv-vendor-detail-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.lv-vendor-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.lv-vendor-detail-item {
  margin-bottom: 10px;
}

.lv-detail-label {
  font-weight: 500;
  margin-bottom: 5px;
}

.lv-detail-value {
  color: #333;
}

.lv-detail-value a {
  color: #007bff;
  text-decoration: none;
}

.lv-detail-value a:hover {
  text-decoration: underline;
}

.lv-price {
  font-weight: 500;
  color: #28a745;
}

.lv-vendor-notes-content {
  white-space: pre-line;
  line-height: 1.5;
}

/* Modal */
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
  max-height: 70vh;
  overflow-y: auto;
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

.lv-input-group {
  display: flex;
  align-items: center;
}

.lv-input-group-text {
  padding: 8px;
  background-color: #e9ecef;
  border: 1px solid #ccc;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.lv-input-group .lv-form-control {
  border-radius: 0 4px 4px 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-4, .lv-col-md-6, .lv-col-md-8 {
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
  
  .lv-vendor-detail-grid {
    grid-template-columns: 1fr;
  }
  
  .lv-modal-dialog {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
}
</style>
