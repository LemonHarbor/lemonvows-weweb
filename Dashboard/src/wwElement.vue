<template>
  <div class="lv-dashboard">
    <div class="lv-container">
      <!-- Welcome Section with Countdown -->
      <div class="lv-dashboard-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2 class="lv-welcome-title">Willkommen, <span class="lv-user-name">{{ content.coupleNames || 'Anna & Thomas' }}</span>!</h2>
                <p class="lv-wedding-date">Eure Hochzeit ist am <span class="lv-date">{{ content.weddingDate || '15. August 2025' }}</span></p>
                <p class="lv-wedding-location">Location: <span class="lv-location">{{ content.weddingLocation || 'Schloss Elmau' }}</span></p>
              </div>
              <div class="lv-col lv-col-md-6 lv-text-center">
                <div class="lv-countdown">
                  <div class="lv-countdown-value">{{ content.daysUntilWedding || '127' }}</div>
                  <div class="lv-countdown-label">Tage bis zur Hochzeit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Access Tiles -->
      <div class="lv-dashboard-tiles lv-mb-3">
        <div class="lv-row">
          <div v-for="(tile, index) in content.quickAccessTiles" :key="index" class="lv-col lv-col-sm-6 lv-col-md-4 lv-col-lg-3 lv-mb-2">
            <div class="lv-tile" @click="navigateTo(tile.link)">
              <div class="lv-tile-icon">{{ tile.icon }}</div>
              <div class="lv-tile-content">
                <h3>{{ tile.title }}</h3>
                <p>{{ tile.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tasks and Stats Section -->
      <div class="lv-dashboard-content">
        <div class="lv-row">
          <!-- Tasks List -->
          <div class="lv-col lv-col-lg-6 lv-mb-3">
            <div class="lv-card">
              <div class="lv-card-header lv-d-flex lv-justify-content-between lv-align-items-center">
                <h3>{{ content.tasksTitle || 'Anstehende Aufgaben' }}</h3>
                <button class="lv-btn lv-btn-primary lv-add-task-btn" @click="openTaskModal">+ Aufgabe</button>
              </div>
              <div class="lv-card-body">
                <ul class="lv-task-list">
                  <li v-for="(task, index) in content.tasks" :key="index" class="lv-task-item" :class="{ 'lv-task-completed': task.completed }">
                    <div class="lv-task-checkbox">
                      <input type="checkbox" :id="'task' + index" class="lv-task-check" v-model="task.completed" @change="updateTaskStatus(index)">
                      <label :for="'task' + index"></label>
                    </div>
                    <div class="lv-task-content">
                      <h4>{{ task.title }}</h4>
                      <p>Fällig: {{ task.dueDate }}</p>
                    </div>
                    <div class="lv-task-priority" :class="'lv-priority-' + task.priority">{{ getPriorityLabel(task.priority) }}</div>
                  </li>
                </ul>
                <div class="lv-text-center lv-mt-2">
                  <a :href="content.allTasksLink || '#timeline'" class="lv-btn lv-btn-outline">Alle Aufgaben anzeigen</a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div class="lv-col lv-col-lg-6">
            <!-- Guest Stats -->
            <div class="lv-card lv-mb-3">
              <div class="lv-card-header">
                <h3>{{ content.guestStatsTitle || 'Gästeübersicht' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-stats-container">
                  <div v-for="(stat, index) in content.guestStats" :key="index" class="lv-stat-item">
                    <div class="lv-stat-value" :class="stat.textClass">{{ stat.value }}</div>
                    <div class="lv-stat-label">{{ stat.label }}</div>
                  </div>
                </div>
                <div class="lv-progress-container lv-mt-2">
                  <div class="lv-progress-bar">
                    <div v-for="(segment, index) in content.guestStatsProgress" :key="index" 
                         class="lv-progress-segment" 
                         :class="'lv-progress-' + segment.type" 
                         :style="{ width: segment.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Budget Stats -->
            <div class="lv-card">
              <div class="lv-card-header">
                <h3>{{ content.budgetStatsTitle || 'Budgetübersicht' }}</h3>
              </div>
              <div class="lv-card-body">
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
                <div class="lv-budget-categories lv-mt-2">
                  <div v-for="(category, index) in content.budgetCategories" :key="index" class="lv-budget-category">
                    <div class="lv-d-flex lv-justify-content-between">
                      <span>{{ category.name }}</span>
                      <span>{{ category.spent }} / {{ category.total }}</span>
                    </div>
                    <div class="lv-progress-bar lv-progress-sm">
                      <div class="lv-progress-segment lv-progress-info" :style="{ width: category.percentage + '%' }"></div>
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

  <!-- Add Task Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isTaskModalOpen }">
    <div class="lv-modal-dialog">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>Neue Aufgabe hinzufügen</h3>
          <button class="lv-modal-close" @click="closeTaskModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="addTaskForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="taskTitle">Titel</label>
              <input type="text" class="lv-form-control" id="taskTitle" placeholder="Aufgabentitel eingeben" v-model="newTask.title">
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="taskDescription">Beschreibung</label>
              <textarea class="lv-form-control" id="taskDescription" rows="3" placeholder="Beschreibung eingeben" v-model="newTask.description"></textarea>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="taskCategory">Kategorie</label>
              <select class="lv-form-control" id="taskCategory" v-model="newTask.category">
                <option value="location">Location</option>
                <option value="catering">Catering</option>
                <option value="decoration">Dekoration</option>
                <option value="music">Musik</option>
                <option value="attire">Kleidung</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="taskDueDate">Fälligkeitsdatum</label>
              <input type="date" class="lv-form-control" id="taskDueDate" v-model="newTask.dueDate">
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="taskPriority">Priorität</label>
              <select class="lv-form-control" id="taskPriority" v-model="newTask.priority">
                <option value="high">Hoch</option>
                <option value="medium">Mittel</option>
                <option value="low">Niedrig</option>
              </select>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeTaskModal">Abbrechen</button>
          <button class="lv-btn lv-btn-primary" @click="saveTask">Speichern</button>
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
      isTaskModalOpen: false,
      newTask: {
        title: '',
        description: '',
        category: 'other',
        dueDate: '',
        priority: 'medium',
        completed: false
      }
    };
  },
  methods: {
    navigateTo(link) {
      if (link) {
        window.location.href = link;
      }
    },
    openTaskModal() {
      this.isTaskModalOpen = true;
      this.resetNewTask();
    },
    closeTaskModal() {
      this.isTaskModalOpen = false;
    },
    resetNewTask() {
      this.newTask = {
        title: '',
        description: '',
        category: 'other',
        dueDate: '',
        priority: 'medium',
        completed: false
      };
    },
    saveTask() {
      // In a real application, you would save this to a database
      // For now, we'll just add it to the tasks array in content
      if (this.newTask.title && this.newTask.dueDate) {
        // Create a copy of the tasks array to maintain reactivity
        const updatedTasks = [...(this.content.tasks || [])];
        updatedTasks.push({...this.newTask});
        
        // In WeWeb, you would typically use a workflow to update the content
        // For this example, we'll just log it
        console.log('New task added:', this.newTask);
        
        this.closeTaskModal();
      }
    },
    updateTaskStatus(index) {
      // In a real application, you would update this in a database
      console.log('Task status updated:', index, this.content.tasks[index].completed);
    },
    getPriorityLabel(priority) {
      const labels = {
        high: 'Hoch',
        medium: 'Mittel',
        low: 'Niedrig'
      };
      return labels[priority] || 'Mittel';
    }
  }
};
</script>

<style scoped>
/* Dashboard styles */
.lv-dashboard {
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
@media (min-width: 576px) {
  .lv-col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 768px) {
  .lv-col-md-4 {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
  
  .lv-col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (min-width: 992px) {
  .lv-col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }
  
  .lv-col-lg-6 {
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

.lv-card-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.lv-card-body {
  padding: 1rem;
}

.lv-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Welcome section styles */
.lv-welcome-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.lv-user-name {
  color: #f8c630;
  font-weight: 700;
}

.lv-wedding-date, .lv-wedding-location {
  margin-bottom: 0.5rem;
  color: #555;
}

.lv-date, .lv-location {
  font-weight: 600;
}

.lv-countdown {
  background-color: #f8c630;
  color: #fff;
  border-radius: 8px;
  padding: 1rem;
  display: inline-block;
  min-width: 150px;
}

.lv-countdown-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.lv-countdown-label {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* Tile styles */
.lv-tile {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.lv-tile:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.lv-tile-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.lv-tile-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.lv-tile-content p {
  margin: 0;
  color: #777;
  font-size: 0.9rem;
}

/* Task list styles */
.lv-task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.lv-task-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
}

.lv-task-item:last-child {
  border-bottom: none;
}

.lv-task-checkbox {
  margin-right: 1rem;
}

.lv-task-check {
  display: none;
}

.lv-task-check + label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.lv-task-check:checked + label:after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 3px;
  color: #4CAF50;
  font-weight: bold;
}

.lv-task-content {
  flex: 1;
}

.lv-task-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.lv-task-content p {
  margin: 0;
  color: #777;
  font-size: 0.85rem;
}

.lv-task-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lv-priority-high {
  background-color: #ffebee;
  color: #f44336;
}

.lv-priority-medium {
  background-color: #fff8e1;
  color: #ffc107;
}

.lv-priority-low {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-task-completed .lv-task-content h4 {
  text-decoration: line-through;
  color: #aaa;
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
  display: flex;
}

.lv-progress-sm {
  height: 4px;
}

.lv-progress-segment {
  height: 100%;
}

.lv-progress-success {
  background-color: #4caf50;
}

.lv-progress-danger {
  background-color: #f44336;
}

.lv-progress-warning {
  background-color: #ffc107;
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

/* Budget categories styles */
.lv-budget-categories {
  margin-top: 1rem;
}

.lv-budget-category {
  margin-bottom: 0.5rem;
}

.lv-d-flex {
  display: flex;
}

.lv-justify-content-between {
  justify-content: space-between;
}

.lv-align-items-center {
  align-items: center;
}

.lv-text-center {
  text-align: center;
}

.lv-text-right {
  text-align: right;
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
  max-width: 500px;
  margin: 1.75rem auto;
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
</style>
