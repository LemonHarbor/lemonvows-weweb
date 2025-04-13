<template>
  <div class="lv-budget-planner">
    <div class="lv-container">
      <!-- Header Section with Budget Overview -->
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
                  <div v-for="(stat, index) in content.budgetStats" :key="index" class="lv-stat-item">
                    <div class="lv-stat-value" :class="stat.textClass">{{ stat.value }}</div>
                    <div class="lv-stat-label">{{ stat.label }}</div>
                  </div>
                </div>
                <div class="lv-progress-container lv-mt-2">
                  <div class="lv-progress-bar">
                    <div class="lv-progress-segment lv-progress-info" :style="{ width: content.budgetPercentage + '%' }"></div>
                  </div>
                  <div class="lv-progress-label">{{ content.budgetPercentage }}% des Budgets ausgegeben</div>
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
            <div class="lv-budget-settings">
              <div class="lv-form-group lv-d-flex lv-align-items-center">
                <label class="lv-form-label lv-mb-0 lv-mr-2">{{ content.totalBudgetLabel || 'Gesamtbudget:' }}</label>
                <input type="number" class="lv-form-control" v-model="totalBudget">
                <span class="lv-currency">€</span>
                <button class="lv-btn lv-btn-outline lv-ml-2" @click="updateBudget">{{ content.updateButtonText || 'Aktualisieren' }}</button>
              </div>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <button class="lv-btn lv-btn-primary lv-add-expense-btn" @click="openExpenseModal">{{ content.addExpenseButtonText || 'Neue Ausgabe' }}</button>
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
            :class="{ 'lv-filter-active': currentStatusFilter === filter.value, 'lv-filter-warning': filter.warning }"
            @click="setStatusFilter(filter.value)">
            {{ filter.label }}
          </button>
        </div>
        <div class="lv-filter-group">
          <select class="lv-form-control lv-filter-select" v-model="currentCategoryFilter" @change="filterExpenses">
            <option v-for="(category, index) in content.categoryFilters" :key="'category-' + index" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Budget Categories -->
      <div class="lv-budget-categories lv-mb-3">
        <div class="lv-row">
          <div v-for="(category, index) in filteredCategories" :key="index" class="lv-col lv-col-md-6 lv-col-lg-4 lv-mb-3">
            <div class="lv-category-card" :data-category="category.id">
              <div class="lv-category-header">
                <div class="lv-category-icon">{{ category.icon }}</div>
                <div class="lv-category-title">{{ category.title }}</div>
              </div>
              <div class="lv-category-content">
                <div class="lv-category-stats">
                  <div class="lv-category-budget">{{ category.budget }}</div>
                  <div class="lv-category-spent">{{ category.spent }} ({{ category.percentage }}%)</div>
                </div>
                <div class="lv-progress-bar lv-progress-sm">
                  <div class="lv-progress-segment lv-progress-info" :style="{ width: category.percentage + '%' }"></div>
                </div>
                <div class="lv-category-expenses">
                  <div v-if="category.expenses && category.expenses.length > 0">
                    <div v-for="(expense, expIndex) in category.expenses" :key="expIndex" class="lv-expense-item">
                      <div class="lv-expense-name">{{ expense.name }}</div>
                      <div class="lv-expense-amount">{{ expense.amount }}</div>
                    </div>
                  </div>
                  <div v-else class="lv-empty-expenses">{{ content.noExpensesText || 'Keine Ausgaben' }}</div>
                </div>
                <button class="lv-add-expense-category-btn" @click="openExpenseModalForCategory(category.id)">
                  + {{ content.addExpenseToCategoryText || 'Ausgabe hinzufügen' }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="lv-col lv-col-md-6 lv-col-lg-4 lv-mb-3">
            <div class="lv-category-card lv-category-add" @click="openCategoryModal">
              <div class="lv-category-add-content">
                <div class="lv-category-add-icon">+</div>
                <div class="lv-category-add-text">{{ content.addCategoryText || 'Neue Kategorie hinzufügen' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Expense List -->
      <div class="lv-expense-list lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-header">
            <h3>{{ content.expenseListTitle || 'Alle Ausgaben' }}</h3>
          </div>
          <div class="lv-card-body lv-p-0">
            <table class="lv-table">
              <thead>
                <tr>
                  <th v-for="(column, index) in content.expenseTableColumns" :key="index">{{ column }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(expense, index) in filteredExpenses" :key="index" :data-status="expense.status" :data-category="expense.categoryId">
                  <td>{{ expense.name }}</td>
                  <td>{{ getCategoryTitle(expense.categoryId) }}</td>
                  <td>{{ expense.amount }}</td>
                  <td><span class="lv-badge" :class="'lv-badge-' + expense.status">{{ getStatusLabel(expense.status) }}</span></td>
                  <td>{{ expense.dueDate }}</td>
                  <td>
                    <div class="lv-action-buttons">
                      <button class="lv-btn-icon lv-edit-expense" @click="editExpense(index)">✏️</button>
                      <button class="lv-btn-icon lv-delete-expense" @click="openDeleteExpenseModal(index)">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Expense Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isExpenseModalOpen }">
    <div class="lv-modal-dialog">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ isEditMode ? content.editExpenseTitle || 'Ausgabe bearbeiten' : content.addExpenseTitle || 'Neue Ausgabe hinzufügen' }}</h3>
          <button class="lv-modal-close" @click="closeExpenseModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="expenseForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="expenseName">{{ content.expenseNameLabel || 'Bezeichnung' }}*</label>
              <input type="text" class="lv-form-control" id="expenseName" required v-model="currentExpense.name">
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="expenseCategory">{{ content.expenseCategoryLabel || 'Kategorie' }}*</label>
                  <select class="lv-form-control" id="expenseCategory" required v-model="currentExpense.categoryId">
                    <option v-for="category in content.categories" :key="category.id" :value="category.id">
                      {{ category.title }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="expenseAmount">{{ content.expenseAmountLabel || 'Betrag' }}*</label>
                  <div class="lv-input-group">
                    <input type="number" class="lv-form-control" id="expenseAmount" required v-model="currentExpense.amount">
                    <span class="lv-input-group-text">€</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="expenseStatus">{{ content.expenseStatusLabel || 'Status' }}</label>
                  <select class="lv-form-control" id="expenseStatus" v-model="currentExpense.status">
                    <option v-for="(status, index) in content.expenseStatusOptions" :key="index" :value="status.value">
                      {{ status.label }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="expenseDueDate">{{ content.expenseDueDateLabel || 'Fälligkeitsdatum' }}</label>
                  <input type="date" class="lv-form-control" id="expenseDueDate" v-model="currentExpense.dueDate">
                </div>
              </div>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="expenseNotes">{{ content.expenseNotesLabel || 'Notizen' }}</label>
              <textarea class="lv-form-control" id="expenseNotes" rows="3" v-model="currentExpense.notes"></textarea>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeExpenseModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="saveExpense">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Category Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isCategoryModalOpen }">
    <div class="lv-modal-dialog">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ content.addCategoryTitle || 'Neue Kategorie hinzufügen' }}</h3>
          <button class="lv-modal-close" @click="closeCategoryModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="categoryForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="categoryTitle">{{ content.categoryTitleLabel || 'Titel' }}*</label>
              <input type="text" class="lv-form-control" id="categoryTitle" required v-model="currentCategory.title">
            </div>
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="categoryIcon">{{ content.categoryIconLabel || 'Icon' }}</label>
                  <input type="text" class="lv-form-control" id="categoryIcon" v-model="currentCategory.icon" placeholder="🏰">
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="categoryBudget">{{ content.categoryBudgetLabel || 'Budget' }}*</label>
                  <div class="lv-input-group">
                    <input type="number" class="lv-form-control" id="categoryBudget" required v-model="currentCategory.budgetAmount">
                    <span class="lv-input-group-text">€</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeCategoryModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="saveCategory">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
    <div class="lv-modal-dialog lv-modal-sm">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ content.deleteExpenseTitle || 'Ausgabe löschen' }}</h3>
          <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <p>{{ content.deleteConfirmationText || 'Sind Sie sicher, dass Sie diese Ausgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-danger" @click="deleteExpense">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      totalBudget: 25000,
      currentStatusFilter: 'all',
      currentCategoryFilter: 'all',
      isExpenseModalOpen: false,
      isCategoryModalOpen: false,
      isDeleteModalOpen: false,
      isEditMode: false,
      currentExpenseIndex: -1,
      currentExpense: this.getEmptyExpense(),
      currentCategory: this.getEmptyCategory(),
      filteredExpenses: [],
      filteredCategories: []
    };
  },
  mounted() {
    this.totalBudget = this.content.totalBudget || 25000;
    this.filterExpenses();
    this.filterCategories();
  },
  methods: {
    getEmptyExpense() {
      return {
        name: '',
        categoryId: '',
        amount: 0,
        status: 'pending',
        dueDate: '',
        notes: ''
      };
    },
    getEmptyCategory() {
      return {
        id: '',
        title: '',
        icon: '📁',
        budgetAmount: 0,
        spent: 0,
        percentage: 0,
        expenses: []
      };
    },
    updateBudget() {
      // In a real application, you would update this in a database
      console.log('Total budget updated:', this.totalBudget);
      // For now, we'll just update the local state
    },
    getCategoryTitle(categoryId) {
      const category = (this.content.categories || []).find(c => c.id === categoryId);
      return category ? category.title : '';
    },
    getStatusLabel(status) {
      const statusMap = {
        paid: 'Bezahlt',
        pending: 'Ausstehend',
        'over-budget': 'Überbudget'
      };
      return statusMap[status] || 'Ausstehend';
    },
    setStatusFilter(status) {
      this.currentStatusFilter = status;
      this.filterExpenses();
    },
    filterExpenses() {
      let filtered = [...(this.content.expenses || [])];
      
      // Apply status filter
      if (this.currentStatusFilter !== 'all') {
        filtered = filtered.filter(expense => expense.status === this.currentStatusFilter);
      }
      
      // Apply category filter
      if (this.currentCategoryFilter !== 'all') {
        filtered = filtered.filter(expense => expense.categoryId === this.currentCategoryFilter);
      }
      
      this.filteredExpenses = filtered;
    },
    filterCategories() {
      this.filteredCategories = [...(this.content.categories || [])];
    },
    openExpenseModal() {
      this.isEditMode = false;
      this.currentExpense = this.getEmptyExpense();
      this.isExpenseModalOpen = true;
    },
    openExpenseModalForCategory(categoryId) {
      this.isEditMode = false;
      this.currentExpense = this.getEmptyExpense();
      this.currentExpense.categoryId = categoryId;
      this.isExpenseModalOpen = true;
    },
    closeExpenseModal() {
      this.isExpenseModalOpen = false;
    },
    editExpense(index) {
      this.isEditMode = true;
      this.currentExpenseIndex = index;
      this.currentExpense = { ...this.filteredExpenses[index] };
      this.isExpenseModalOpen = true;
    },
    saveExpense() {
      if (!this.currentExpense.name || !this.currentExpense.categoryId || this.currentExpense.amount <= 0) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      if (this.isEditMode) {
        // Update existing expense
        // In a real application, you would update this in a database
        console.log('Expense updated:', this.currentExpense);
      } else {
        // Add new expense
        // In a real application, you would save this to a database
        const updatedExpenses = [...(this.content.expenses || [])];
        updatedExpenses.push({...this.currentExpense});
        
        // In WeWeb, you would typically use a workflow to update the content
        console.log('New expense added:', this.currentExpense);
      }
      
      this.closeExpenseModal();
      this.filterExpenses();
    },
    openCategoryModal() {
      this.currentCategory = this.getEmptyCategory();
      this.isCategoryModalOpen = true;
    },
    closeCategoryModal() {
      this.isCategoryModalOpen = false;
    },
    saveCategory() {
      if (!this.currentCategory.title || this.currentCategory.budgetAmount <= 0) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      // Generate a unique ID for the new category
      this.currentCategory.id = 'cat_' + Date.now();
      
      // Add new category
      // In a real application, you would save this to a database
      const updatedCategories = [...(this.content.categories || [])];
      updatedCategories.push({
        ...this.currentCategory,
        spent: '0 €',
        percentage: 0,
        expenses: []
      });
      
      // In WeWeb, you would typically use a workflow to update the content
      console.log('New category added:', this.currentCategory);
      
      this.closeCategoryModal();
      this.filterCategories();
    },
    openDeleteExpenseModal(index) {
      this.currentExpenseIndex = index;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },
    deleteExpense() {
      // In a real application, you would delete this from a database
      console.log('Expense deleted:', this.filteredExpenses[this.currentExpenseIndex]);
      
      this.closeDeleteModal();
      this.filterExpenses();
    }
  }
};
</script>

<style scoped>
/* Budget Planner styles */
.lv-budget-planner {
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

.lv-mt-2 {
  margin-top: 0.5rem;
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

/* Responsive columns */
@media (min-width: 768px) {
  .lv-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .lv-col-lg-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.lv-card-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.lv-card-body {
  padding: 1rem;
}

.lv-card-body.lv-p-0 {
  padding: 0;
}

.lv-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
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

.lv-text-info {
  color: #2196f3;
}

/* Progress bar styles */
.lv-progress-container {
  margin: 0.5rem 0;
}

.lv-progress-bar {
  height: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}

.lv-progress-sm {
  height: 4px;
}

.lv-progress-segment {
  height: 100%;
  background-color: #2196f3;
}

.lv-progress-info {
  background-color: #2196f3;
}

.lv-progress-label {
  font-size: 0.8rem;
  color: #777;
  margin-top: 0.25rem;
  text-align: center;
}

/* Action bar styles */
.lv-budget-settings {
  display: flex;
  align-items: center;
}

.lv-form-group {
  margin-bottom: 1rem;
}

.lv-form-label {
  display: inline-block;
  margin-bottom: 0.5rem;
}

.lv-mb-0 {
  margin-bottom: 0;
}

.lv-mr-2 {
  margin-right: 0.5rem;
}

.lv-ml-2 {
  margin-left: 0.5rem;
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

.lv-currency {
  margin-left: 0.5rem;
}

.lv-d-flex {
  display: flex;
}

.lv-align-items-center {
  align-items: center;
}

/* Filter bar styles */
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

.lv-filter-warning {
  border-color: #ffc107;
  color: #ffc107;
}

.lv-filter-warning.lv-filter-active {
  background-color: #ffc107;
  color: white;
}

.lv-filter-select {
  min-width: 150px;
}

/* Category card styles */
.lv-category-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
}

.lv-category-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.lv-category-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
}

.lv-category-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.lv-category-content {
  padding: 1rem;
}

.lv-category-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.lv-category-budget {
  font-weight: 600;
}

.lv-category-spent {
  color: #777;
}

.lv-category-expenses {
  margin: 1rem 0;
  max-height: 150px;
  overflow-y: auto;
}

.lv-expense-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.lv-expense-item:last-child {
  border-bottom: none;
}

.lv-expense-name {
  font-weight: 500;
}

.lv-expense-amount {
  color: #777;
}

.lv-empty-expenses {
  text-align: center;
  color: #999;
  padding: 1rem 0;
}

.lv-add-expense-category-btn {
  width: 100%;
  background: none;
  border: 1px dashed #ddd;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: #777;
  transition: all 0.3s;
}

.lv-add-expense-category-btn:hover {
  background-color: #f5f5f5;
  border-color: #f8c630;
  color: #f8c630;
}

.lv-category-add {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  cursor: pointer;
  border: 2px dashed #ddd;
  transition: all 0.3s;
}

.lv-category-add:hover {
  border-color: #f8c630;
}

.lv-category-add-content {
  text-align: center;
  padding: 2rem 1rem;
}

.lv-category-add-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #999;
}

.lv-category-add-text {
  color: #777;
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

.lv-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lv-badge-paid {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-badge-pending {
  background-color: #fff8e1;
  color: #ffc107;
}

.lv-badge-over-budget {
  background-color: #ffebee;
  color: #f44336;
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

/* Input group styles */
.lv-input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

.lv-input-group .lv-form-control {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  margin-bottom: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.lv-input-group-text {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0 0.25rem 0.25rem 0;
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
  
  .lv-budget-settings .lv-d-flex {
    flex-wrap: wrap;
  }
  
  .lv-budget-settings .lv-form-control {
    width: 100px;
  }
}
</style>
