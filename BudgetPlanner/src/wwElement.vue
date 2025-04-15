<template>
  <div class="lv-budget-planner">
    <div class="lv-container">
      <!-- Header Section with Stats -->
      <div class="lv-budget-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Budgetplaner' }}</h2>
                <p>{{ content.subtitle || 'Verwalten Sie Ihr Hochzeitsbudget und verfolgen Sie Ihre Ausgaben' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ formatCurrency(totalBudget) }}</div>
                    <div class="lv-stat-label">{{ content.totalBudgetLabel || 'Gesamtbudget' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ formatCurrency(totalSpent) }}</div>
                    <div class="lv-stat-label">{{ content.totalSpentLabel || 'Ausgegeben' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value" :class="budgetStatus.class">{{ formatCurrency(remainingBudget) }}</div>
                    <div class="lv-stat-label">{{ content.remainingLabel || 'Verbleibend' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ Math.round(percentSpent) }}%</div>
                    <div class="lv-stat-label">{{ content.percentSpentLabel || 'Prozent ausgegeben' }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Budget Progress Bar -->
            <div class="lv-budget-progress lv-mt-3">
              <div class="lv-progress-bar">
                <div class="lv-progress-fill" :style="{ width: `${percentSpent}%`, backgroundColor: budgetStatus.color }"></div>
              </div>
              <div class="lv-progress-labels">
                <div>0%</div>
                <div>50%</div>
                <div>100%</div>
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
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Budgetposten suchen...'" v-model="searchQuery" @input="filterBudgetItems">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-outline" @click="openTotalBudgetModal">{{ content.setTotalBudgetBtn || 'Gesamtbudget festlegen' }}</button>
              <button class="lv-btn lv-btn-primary" @click="openBudgetItemModal">{{ content.addItemButtonText || 'Posten hinzufügen' }}</button>
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
          <select class="lv-form-control lv-filter-select" v-model="currentCategoryFilter" @change="filterBudgetItems">
            <option value="all">{{ content.allCategoriesLabel || 'Alle Kategorien' }}</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Budget Categories and Items -->
      <div class="lv-budget-categories lv-mb-3">
        <div v-for="category in filteredCategories" :key="category.id" class="lv-category-section lv-mb-3">
          <div class="lv-category-header" @click="toggleCategory(category.id)">
            <div class="lv-category-name">
              <span class="lv-category-icon" :style="{ backgroundColor: category.color }">{{ getCategoryIcon(category) }}</span>
              {{ category.name }}
            </div>
            <div class="lv-category-info">
              <div class="lv-category-amount">{{ formatCurrency(getCategoryTotal(category.id)) }}</div>
              <div class="lv-category-toggle">
                <span v-if="expandedCategories.includes(category.id)">▼</span>
                <span v-else>▶</span>
              </div>
            </div>
          </div>
          
          <div v-if="expandedCategories.includes(category.id)" class="lv-category-items">
            <div class="lv-card">
              <div class="lv-card-body lv-p-0">
                <table class="lv-table">
                  <thead>
                    <tr>
                      <th>{{ content.itemNameHeader || 'Posten' }}</th>
                      <th>{{ content.estimatedCostHeader || 'Geschätzt' }}</th>
                      <th>{{ content.actualCostHeader || 'Tatsächlich' }}</th>
                      <th>{{ content.paidHeader || 'Bezahlt' }}</th>
                      <th>{{ content.actionsHeader || 'Aktionen' }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in getCategoryItems(category.id)" :key="item.id">
                      <td>
                        <div class="lv-item-name">{{ item.name }}</div>
                        <div class="lv-item-description">{{ item.description }}</div>
                      </td>
                      <td>{{ formatCurrency(item.estimated_cost) }}</td>
                      <td>{{ formatCurrency(item.actual_cost) }}</td>
                      <td>
                        <div class="lv-checkbox-container">
                          <input 
                            type="checkbox" 
                            :id="'paid-' + item.id" 
                            class="lv-checkbox" 
                            :checked="item.is_paid" 
                            @change="togglePaidStatus(item)"
                          >
                          <label :for="'paid-' + item.id"></label>
                        </div>
                      </td>
                      <td>
                        <div class="lv-action-buttons">
                          <button class="lv-btn-icon lv-edit-item" @click="editBudgetItem(item)">✏️</button>
                          <button class="lv-btn-icon lv-delete-item" @click="openDeleteModal(item)">🗑️</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="getCategoryItems(category.id).length === 0">
                      <td colspan="5" class="lv-text-center">{{ content.noItemsMessage || 'Keine Posten in dieser Kategorie' }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td><strong>{{ content.categoryTotalLabel || 'Kategorie Gesamt' }}</strong></td>
                      <td><strong>{{ formatCurrency(getCategoryEstimatedTotal(category.id)) }}</strong></td>
                      <td><strong>{{ formatCurrency(getCategoryActualTotal(category.id)) }}</strong></td>
                      <td colspan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div class="lv-category-actions lv-mt-2">
              <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addItemToCategory(category)">
                {{ content.addToCategoryBtn || 'Posten zu dieser Kategorie hinzufügen' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredCategories.length === 0" class="lv-empty-state">
          <div class="lv-card">
            <div class="lv-card-body lv-text-center lv-p-5">
              <div class="lv-empty-icon">💰</div>
              <h3>{{ content.emptyStateTitle || 'Keine Budgetposten gefunden' }}</h3>
              <p>{{ content.emptyStateMessage || 'Beginnen Sie mit der Erstellung von Budgetkategorien und -posten für Ihre Hochzeit.' }}</p>
              <button class="lv-btn lv-btn-primary lv-mt-3" @click="openCategoryModal">
                {{ content.createCategoryBtn || 'Kategorie erstellen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Set Total Budget Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isTotalBudgetModalOpen }">
      <div class="lv-modal-dialog lv-modal-sm">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.setTotalBudgetTitle || 'Gesamtbudget festlegen' }}</h3>
            <button class="lv-modal-close" @click="closeTotalBudgetModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="totalBudgetInput">{{ content.totalBudgetLabel || 'Gesamtbudget' }}</label>
              <div class="lv-input-group">
                <span class="lv-input-group-text">€</span>
                <input 
                  type="number" 
                  class="lv-form-control" 
                  id="totalBudgetInput" 
                  v-model="totalBudgetInput" 
                  min="0" 
                  step="100"
                >
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeTotalBudgetModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveTotalBudget">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Category Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isCategoryModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditingCategory ? content.editCategoryTitle || 'Kategorie bearbeiten' : content.addCategoryTitle || 'Kategorie hinzufügen' }}</h3>
            <button class="lv-modal-close" @click="closeCategoryModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="categoryName">{{ content.categoryNameLabel || 'Kategoriename' }}*</label>
              <input type="text" class="lv-form-control" id="categoryName" v-model="currentCategory.name" required>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.categoryColorLabel || 'Farbe' }}</label>
              <div class="lv-color-picker">
                <div 
                  v-for="(color, index) in categoryColors" 
                  :key="index"
                  class="lv-color-option" 
                  :class="{ 'lv-color-active': currentCategory.color === color }"
                  :style="{ backgroundColor: color }"
                  @click="currentCategory.color = color">
                </div>
              </div>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="categoryIcon">{{ content.categoryIconLabel || 'Icon' }}</label>
              <input type="text" class="lv-form-control" id="categoryIcon" v-model="currentCategory.icon" :placeholder="content.iconPlaceholder || 'Emoji oder Icon-Name'">
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeCategoryModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveCategory">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Budget Item Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isBudgetItemModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditingItem ? content.editItemTitle || 'Budgetposten bearbeiten' : content.addItemTitle || 'Budgetposten hinzufügen' }}</h3>
            <button class="lv-modal-close" @click="closeBudgetItemModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-row">
              <div class="lv-col lv-col-md-8">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="itemName">{{ content.itemNameLabel || 'Name' }}*</label>
                  <input type="text" class="lv-form-control" id="itemName" v-model="currentItem.name" required>
                </div>
              </div>
              <div class="lv-col lv-col-md-4">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="itemCategory">{{ content.itemCategoryLabel || 'Kategorie' }}*</label>
                  <select class="lv-form-control" id="itemCategory" v-model="currentItem.category_id" required>
                    <option value="">{{ content.selectCategoryPlaceholder || 'Bitte wählen' }}</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="itemEstimatedCost">{{ content.estimatedCostLabel || 'Geschätzte Kosten' }}</label>
                  <div class="lv-input-group">
                    <span class="lv-input-group-text">€</span>
                    <input type="number" class="lv-form-control" id="itemEstimatedCost" v-model="currentItem.estimated_cost" min="0" step="0.01">
                  </div>
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="itemActualCost">{{ content.actualCostLabel || 'Tatsächliche Kosten' }}</label>
                  <div class="lv-input-group">
                    <span class="lv-input-group-text">€</span>
                    <input type="number" class="lv-form-control" id="itemActualCost" v-model="currentItem.actual_cost" min="0" step="0.01">
                  </div>
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="itemPaymentDate">{{ content.paymentDateLabel || 'Zahlungsdatum' }}</label>
                  <input type="date" class="lv-form-control" id="itemPaymentDate" v-model="currentItem.payment_date">
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <div class="lv-checkbox-container lv-mt-4">
                    <input type="checkbox" id="itemPaid" class="lv-checkbox" v-model="currentItem.is_paid">
                    <label for="itemPaid">{{ content.paidLabel || 'Bezahlt' }}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="itemDescription">{{ content.descriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="itemDescription" v-model="currentItem.description" rows="3"></textarea>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="itemNotes">{{ content.notesLabel || 'Notizen' }}</label>
              <textarea class="lv-form-control" id="itemNotes" v-model="currentItem.notes" rows="2"></textarea>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeBudgetItemModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveBudgetItem">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
      <div class="lv-modal-dialog lv-modal-sm">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.deleteItemTitle || 'Posten löschen' }}</h3>
            <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <p>{{ content.deleteConfirmationText || 'Sind Sie sicher, dass Sie diesen Budgetposten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deleteBudgetItem">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      
      // Budget data
      totalBudget: 0,
      categories: [],
      budgetItems: [],
      filteredItems: [],
      filteredCategories: [],
      expandedCategories: [],
      
      // UI state
      searchQuery: '',
      currentStatusFilter: 'all',
      currentCategoryFilter: 'all',
      
      // Modals
      isTotalBudgetModalOpen: false,
      isCategoryModalOpen: false,
      isBudgetItemModalOpen: false,
      isDeleteModalOpen: false,
      isEditingCategory: false,
      isEditingItem: false,
      totalBudgetInput: 0,
      currentCategory: this.getEmptyCategory(),
      currentItem: this.getEmptyBudgetItem(),
      itemToDelete: null,
      
      // Options
      statusFilters: [
        { value: 'all', label: 'Alle Posten' },
        { value: 'paid', label: 'Bezahlt' },
        { value: 'unpaid', label: 'Unbezahlt' }
      ],
      categoryColors: [
        '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
        '#FF6D01', '#46BDC6', '#7BAAF7', '#F6AEA9', 
        '#FDE293', '#A8DAB5', '#FDC69C', '#A1E4EB'
      ]
    };
  },
  computed: {
    totalSpent() {
      return this.budgetItems.reduce((total, item) => {
        return total + (parseFloat(item.actual_cost) || 0);
      }, 0);
    },
    remainingBudget() {
      return this.totalBudget - this.totalSpent;
    },
    percentSpent() {
      if (this.totalBudget === 0) return 0;
      return Math.min(100, (this.totalSpent / this.totalBudget) * 100);
    },
    budgetStatus() {
      if (this.percentSpent > 100) {
        return { class: 'lv-text-danger', color: '#dc3545' };
      } else if (this.percentSpent > 90) {
        return { class: 'lv-text-warning', color: '#ffc107' };
      } else {
        return { class: 'lv-text-success', color: '#28a745' };
      }
    }
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get wedding ID for current user
    await this.getCurrentWeddingId();
    
    // Load data
    if (this.weddingId) {
      await Promise.all([
        this.loadTotalBudget(),
        this.loadCategories(),
        this.loadBudgetItems()
      ]);
      
      // Initialize filtered data
      this.filterBudgetItems();
      this.updateFilteredCategories();
      
      // Expand all categories by default
      this.expandedCategories = this.categories.map(cat => cat.id);
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
    
    async loadTotalBudget() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get total budget from settings table
        const { data, error } = await this.supabase
          .from('settings')
          .select('setting_value')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'total_budget')
          .eq('is_active', true)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
          throw error;
        }
        
        if (data) {
          this.totalBudget = parseFloat(data.setting_value) || 0;
          this.totalBudgetInput = this.totalBudget;
        }
      } catch (error) {
        console.error('Error loading total budget:', error);
      }
    },
    
    async loadCategories() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('budget_categories')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.categories = data || [];
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    },
    
    async loadBudgetItems() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('budget_items')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.budgetItems = data || [];
      } catch (error) {
        console.error('Error loading budget items:', error);
      }
    },
    
    async saveTotalBudget() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const budget = parseFloat(this.totalBudgetInput) || 0;
        
        // Check if setting already exists
        const { data: existingData, error: checkError } = await this.supabase
          .from('settings')
          .select('id')
          .eq('wedding_id', this.weddingId)
          .eq('setting_key', 'total_budget')
          .eq('is_active', true);
        
        if (checkError) throw checkError;
        
        if (existingData && existingData.length > 0) {
          // Update existing setting
          const { error } = await this.supabase
            .from('settings')
            .update({ setting_value: budget.toString() })
            .eq('id', existingData[0].id);
          
          if (error) throw error;
        } else {
          // Create new setting
          const { error } = await this.supabase
            .from('settings')
            .insert([{
              wedding_id: this.weddingId,
              setting_key: 'total_budget',
              setting_value: budget.toString()
            }]);
          
          if (error) throw error;
        }
        
        // Update local state
        this.totalBudget = budget;
        this.closeTotalBudgetModal();
      } catch (error) {
        console.error('Error saving total budget:', error);
        alert('Es gab ein Problem beim Speichern des Gesamtbudgets. Bitte versuchen Sie es erneut.');
      }
    },
    
    async addCategory(categoryData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newCategory = {
          ...categoryData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('budget_categories')
          .insert([newCategory])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add category to local state
          this.categories.push(data[0]);
          this.updateFilteredCategories();
          
          // Expand the new category
          this.expandedCategories.push(data[0].id);
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding category:', error);
        return null;
      }
    },
    
    async updateCategory(categoryData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('budget_categories')
          .update(categoryData)
          .eq('id', categoryData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.categories.findIndex(c => c.id === categoryData.id);
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            ...categoryData
          };
        }
        
        this.updateFilteredCategories();
        
        return true;
      } catch (error) {
        console.error('Error updating category:', error);
        return false;
      }
    },
    
    async addBudgetItem(itemData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newItem = {
          ...itemData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('budget_items')
          .insert([newItem])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add item to local state
          this.budgetItems.push(data[0]);
          this.filterBudgetItems();
          
          // Make sure the category is expanded
          if (!this.expandedCategories.includes(data[0].category_id)) {
            this.expandedCategories.push(data[0].category_id);
          }
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding budget item:', error);
        return null;
      }
    },
    
    async updateBudgetItem(itemData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('budget_items')
          .update(itemData)
          .eq('id', itemData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.budgetItems.findIndex(i => i.id === itemData.id);
        if (index !== -1) {
          this.budgetItems[index] = {
            ...this.budgetItems[index],
            ...itemData
          };
        }
        
        this.filterBudgetItems();
        
        return true;
      } catch (error) {
        console.error('Error updating budget item:', error);
        return false;
      }
    },
    
    async removeBudgetItem(itemId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('budget_items')
          .update({ is_active: false })
          .eq('id', itemId);
        
        if (error) throw error;
        
        // Remove from local state
        this.budgetItems = this.budgetItems.filter(i => i.id !== itemId);
        this.filterBudgetItems();
        
        return true;
      } catch (error) {
        console.error('Error removing budget item:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyCategory() {
      return {
        name: '',
        color: this.categoryColors[0],
        icon: ''
      };
    },
    
    getEmptyBudgetItem() {
      return {
        name: '',
        description: '',
        category_id: '',
        estimated_cost: 0,
        actual_cost: 0,
        payment_date: null,
        is_paid: false,
        notes: ''
      };
    },
    
    formatCurrency(amount) {
      const value = parseFloat(amount) || 0;
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    },
    
    getCategoryIcon(category) {
      return category.icon || '💰';
    },
    
    getCategoryTotal(categoryId) {
      return this.budgetItems
        .filter(item => item.category_id === categoryId)
        .reduce((total, item) => total + (parseFloat(item.actual_cost) || 0), 0);
    },
    
    getCategoryEstimatedTotal(categoryId) {
      return this.budgetItems
        .filter(item => item.category_id === categoryId)
        .reduce((total, item) => total + (parseFloat(item.estimated_cost) || 0), 0);
    },
    
    getCategoryActualTotal(categoryId) {
      return this.budgetItems
        .filter(item => item.category_id === categoryId)
        .reduce((total, item) => total + (parseFloat(item.actual_cost) || 0), 0);
    },
    
    getCategoryItems(categoryId) {
      return this.filteredItems.filter(item => item.category_id === categoryId);
    },
    
    filterBudgetItems() {
      let filtered = [...this.budgetItems];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) || 
          (item.description && item.description.toLowerCase().includes(query)) ||
          (item.notes && item.notes.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentStatusFilter === 'paid') {
        filtered = filtered.filter(item => item.is_paid);
      } else if (this.currentStatusFilter === 'unpaid') {
        filtered = filtered.filter(item => !item.is_paid);
      }
      
      // Apply category filter
      if (this.currentCategoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category_id === this.currentCategoryFilter);
      }
      
      this.filteredItems = filtered;
      this.updateFilteredCategories();
    },
    
    updateFilteredCategories() {
      if (this.currentCategoryFilter !== 'all') {
        // If a specific category is selected, only show that category
        this.filteredCategories = this.categories.filter(cat => cat.id === this.currentCategoryFilter);
      } else {
        // Otherwise, show categories that have items matching the current filters
        const categoryIds = new Set(this.filteredItems.map(item => item.category_id));
        
        if (this.searchQuery || this.currentStatusFilter !== 'all') {
          // If we're filtering, only show categories with matching items
          this.filteredCategories = this.categories.filter(cat => categoryIds.has(cat.id));
        } else {
          // If no filters, show all categories
          this.filteredCategories = [...this.categories];
        }
      }
    },
    
    setStatusFilter(status) {
      this.currentStatusFilter = status;
      this.filterBudgetItems();
    },
    
    toggleCategory(categoryId) {
      const index = this.expandedCategories.indexOf(categoryId);
      if (index === -1) {
        this.expandedCategories.push(categoryId);
      } else {
        this.expandedCategories.splice(index, 1);
      }
    },
    
    async togglePaidStatus(item) {
      const updatedItem = {
        ...item,
        is_paid: !item.is_paid
      };
      
      await this.updateBudgetItem(updatedItem);
    },
    
    // Modal Management
    openTotalBudgetModal() {
      this.totalBudgetInput = this.totalBudget;
      this.isTotalBudgetModalOpen = true;
    },
    
    closeTotalBudgetModal() {
      this.isTotalBudgetModalOpen = false;
    },
    
    openCategoryModal() {
      this.isEditingCategory = false;
      this.currentCategory = this.getEmptyCategory();
      this.isCategoryModalOpen = true;
    },
    
    editCategory(category) {
      this.isEditingCategory = true;
      this.currentCategory = { ...category };
      this.isCategoryModalOpen = true;
    },
    
    closeCategoryModal() {
      this.isCategoryModalOpen = false;
    },
    
    async saveCategory() {
      if (!this.currentCategory.name) {
        alert('Bitte geben Sie einen Kategorienamen ein.');
        return;
      }
      
      let success = false;
      
      if (this.isEditingCategory) {
        // Update existing category
        success = await this.updateCategory(this.currentCategory);
      } else {
        // Add new category
        const newCategory = await this.addCategory(this.currentCategory);
        success = !!newCategory;
      }
      
      if (success) {
        this.closeCategoryModal();
      } else {
        alert('Es gab ein Problem beim Speichern der Kategorie. Bitte versuchen Sie es erneut.');
      }
    },
    
    openBudgetItemModal() {
      this.isEditingItem = false;
      this.currentItem = this.getEmptyBudgetItem();
      this.isBudgetItemModalOpen = true;
    },
    
    addItemToCategory(category) {
      this.isEditingItem = false;
      this.currentItem = this.getEmptyBudgetItem();
      this.currentItem.category_id = category.id;
      this.isBudgetItemModalOpen = true;
    },
    
    editBudgetItem(item) {
      this.isEditingItem = true;
      this.currentItem = { ...item };
      this.isBudgetItemModalOpen = true;
    },
    
    closeBudgetItemModal() {
      this.isBudgetItemModalOpen = false;
    },
    
    async saveBudgetItem() {
      if (!this.currentItem.name || !this.currentItem.category_id) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      let success = false;
      
      if (this.isEditingItem) {
        // Update existing item
        success = await this.updateBudgetItem(this.currentItem);
      } else {
        // Add new item
        const newItem = await this.addBudgetItem(this.currentItem);
        success = !!newItem;
      }
      
      if (success) {
        this.closeBudgetItemModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Budgetpostens. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteModal(item) {
      this.itemToDelete = item;
      this.isDeleteModalOpen = true;
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.itemToDelete = null;
    },
    
    async deleteBudgetItem() {
      if (!this.itemToDelete) return;
      
      const success = await this.removeBudgetItem(this.itemToDelete.id);
      
      if (success) {
        this.closeDeleteModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Budgetpostens. Bitte versuchen Sie es erneut.');
      }
    }
  }
};
</script>

<style>
.lv-budget-planner {
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

.lv-mt-4 {
  margin-top: 20px;
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

.lv-budget-progress {
  margin-top: 15px;
}

.lv-progress-bar {
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
}

.lv-progress-fill {
  height: 100%;
  background-color: #28a745;
  transition: width 0.3s ease;
}

.lv-progress-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
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

.lv-category-section {
  margin-bottom: 15px;
}

.lv-category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lv-category-header:hover {
  background-color: #e9ecef;
}

.lv-category-name {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.lv-category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
  color: white;
  font-size: 12px;
}

.lv-category-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.lv-category-amount {
  font-weight: 500;
}

.lv-category-toggle {
  font-size: 12px;
}

.lv-category-items {
  margin-top: 10px;
}

.lv-category-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
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

.lv-table tfoot td {
  border-top: 2px solid #dee2e6;
  font-weight: 500;
}

.lv-item-name {
  font-weight: 500;
}

.lv-item-description {
  font-size: 12px;
  color: #6c757d;
}

.lv-checkbox-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lv-checkbox {
  margin-right: 5px;
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

.lv-color-picker {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.lv-color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid #ccc;
}

.lv-color-active {
  border: 2px solid #007bff;
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
  
  .lv-table {
    display: block;
    overflow-x: auto;
  }
}
</style>
