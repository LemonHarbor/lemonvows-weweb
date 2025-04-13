<template>
  <div class="lv-timeline">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-timeline-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Zeitplan & Checkliste' }}</h2>
                <p>{{ content.subtitle || 'Verfolgen Sie wichtige Meilensteine und Aufgaben für Ihre Hochzeit' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ content.totalMilestones || '25' }}</div>
                    <div class="lv-stat-label">{{ content.totalMilestonesLabel || 'Meilensteine' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ content.completedMilestones || '12' }}</div>
                    <div class="lv-stat-label">{{ content.completedMilestonesLabel || 'Erledigt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ content.inProgressMilestones || '8' }}</div>
                    <div class="lv-stat-label">{{ content.inProgressMilestonesLabel || 'In Bearbeitung' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-danger">{{ content.pendingMilestones || '5' }}</div>
                    <div class="lv-stat-label">{{ content.pendingMilestonesLabel || 'Ausstehend' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- View Toggle -->
      <div class="lv-view-toggle lv-mb-3">
        <button 
          class="lv-toggle-btn" 
          :class="{ 'lv-toggle-active': activeView === 'timeline' }"
          @click="setActiveView('timeline')">
          {{ content.timelineViewBtn || 'Zeitplan' }}
        </button>
        <button 
          class="lv-toggle-btn" 
          :class="{ 'lv-toggle-active': activeView === 'checklist' }"
          @click="setActiveView('checklist')">
          {{ content.checklistViewBtn || 'Checkliste' }}
        </button>
      </div>
      
      <!-- Timeline View -->
      <div class="lv-timeline-view" v-if="activeView === 'timeline'">
        <!-- Timeline Header -->
        <div class="lv-action-bar lv-mb-3">
          <div class="lv-row">
            <div class="lv-col lv-col-md-6">
              <div class="lv-filter-group">
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'all' }"
                  @click="setActiveFilter('all')">
                  {{ content.allFilterBtn || 'Alle' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'completed' }"
                  @click="setActiveFilter('completed')">
                  {{ content.completedFilterBtn || 'Erledigt' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'in-progress' }"
                  @click="setActiveFilter('in-progress')">
                  {{ content.inProgressFilterBtn || 'In Bearbeitung' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'pending' }"
                  @click="setActiveFilter('pending')">
                  {{ content.pendingFilterBtn || 'Ausstehend' }}
                </button>
              </div>
            </div>
            <div class="lv-col lv-col-md-6 lv-text-right">
              <button class="lv-btn lv-btn-primary" @click="addMilestone">
                {{ content.addMilestoneBtn || 'Meilenstein hinzufügen' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Timeline Content -->
        <div class="lv-timeline-content">
          <div 
            v-for="(section, sectionIndex) in filteredTimelineSections" 
            :key="sectionIndex"
            class="lv-timeline-section lv-mb-4">
            <div class="lv-timeline-section-header">
              <h3>{{ section.title }}</h3>
              <div class="lv-progress-container">
                <div class="lv-progress-bar">
                  <div 
                    class="lv-progress-segment lv-progress-success" 
                    :style="{ width: section.progress + '%' }">
                  </div>
                </div>
                <div class="lv-progress-label">{{ section.progress }}% {{ content.completedLabel || 'erledigt' }}</div>
              </div>
            </div>
            <div class="lv-timeline-items">
              <div 
                v-for="(item, itemIndex) in section.items" 
                :key="itemIndex"
                class="lv-timeline-item" 
                :class="'lv-timeline-' + item.status"
                :data-status="item.status"
                v-show="shouldShowItem(item)">
                <div class="lv-timeline-marker"></div>
                <div class="lv-timeline-content">
                  <div class="lv-timeline-date">{{ item.date }}</div>
                  <div class="lv-timeline-title">{{ item.title }}</div>
                  <div class="lv-timeline-description">{{ item.description }}</div>
                  <div class="lv-timeline-actions">
                    <button class="lv-btn-icon" @click="editMilestone(item)">✏️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Checklist View -->
      <div class="lv-checklist-view" v-if="activeView === 'checklist'">
        <!-- Checklist Header -->
        <div class="lv-action-bar lv-mb-3">
          <div class="lv-row">
            <div class="lv-col lv-col-md-6">
              <div class="lv-filter-group">
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'all' }"
                  @click="setActiveFilter('all')">
                  {{ content.allFilterBtn || 'Alle' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'completed' }"
                  @click="setActiveFilter('completed')">
                  {{ content.completedFilterBtn || 'Erledigt' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'in-progress' }"
                  @click="setActiveFilter('in-progress')">
                  {{ content.inProgressFilterBtn || 'In Bearbeitung' }}
                </button>
                <button 
                  class="lv-filter-btn" 
                  :class="{ 'lv-filter-active': activeFilter === 'pending' }"
                  @click="setActiveFilter('pending')">
                  {{ content.pendingFilterBtn || 'Ausstehend' }}
                </button>
              </div>
            </div>
            <div class="lv-col lv-col-md-6 lv-text-right">
              <button class="lv-btn lv-btn-primary" @click="addMilestone">
                {{ content.addTaskBtn || 'Aufgabe hinzufügen' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Checklist Content -->
        <div class="lv-checklist-content">
          <div class="lv-card">
            <div class="lv-card-body">
              <div class="lv-checklist-items">
                <div 
                  v-for="(section, sectionIndex) in filteredTimelineSections" 
                  :key="sectionIndex"
                  class="lv-checklist-section">
                  <div class="lv-checklist-section-header">
                    <h3>{{ section.title }}</h3>
                  </div>
                  <div class="lv-checklist-section-items">
                    <div 
                      v-for="(item, itemIndex) in section.items" 
                      :key="itemIndex"
                      class="lv-checklist-item"
                      v-show="shouldShowItem(item)">
                      <div class="lv-checklist-item-checkbox">
                        <input 
                          type="checkbox" 
                          :id="'task-' + item.id" 
                          :checked="item.status === 'completed'"
                          @change="toggleTaskStatus(item)">
                        <label :for="'task-' + item.id"></label>
                      </div>
                      <div class="lv-checklist-item-content">
                        <div class="lv-checklist-item-title">{{ item.title }}</div>
                        <div class="lv-checklist-item-details">
                          <span class="lv-checklist-item-date">{{ item.date }}</span>
                          <span class="lv-checklist-item-description">{{ item.description }}</span>
                        </div>
                      </div>
                      <div class="lv-checklist-item-actions">
                        <button class="lv-btn-icon" @click="editMilestone(item)">✏️</button>
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
    
    <!-- Add/Edit Milestone Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-active': showMilestoneModal }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditMode ? (content.editMilestoneTitle || 'Meilenstein bearbeiten') : (content.addMilestoneTitle || 'Meilenstein hinzufügen') }}</h3>
            <button class="lv-modal-close" @click="closeMilestoneModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <form @submit.prevent="saveMilestone">
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.milestoneTitleLabel || 'Titel' }}</label>
                <input type="text" class="lv-form-control" v-model="editingMilestone.title" required>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.milestoneDateLabel || 'Datum' }}</label>
                <input type="date" class="lv-form-control" v-model="editingMilestone.date" required>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.milestoneDescriptionLabel || 'Beschreibung' }}</label>
                <textarea class="lv-form-control" v-model="editingMilestone.description" rows="3"></textarea>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.milestoneStatusLabel || 'Status' }}</label>
                <select class="lv-form-control" v-model="editingMilestone.status">
                  <option value="pending">{{ content.pendingStatusOption || 'Ausstehend' }}</option>
                  <option value="in-progress">{{ content.inProgressStatusOption || 'In Bearbeitung' }}</option>
                  <option value="completed">{{ content.completedStatusOption || 'Erledigt' }}</option>
                </select>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.milestoneSectionLabel || 'Zeitabschnitt' }}</label>
                <select class="lv-form-control" v-model="editingMilestone.sectionId">
                  <option 
                    v-for="(section, index) in timelineSections" 
                    :key="index" 
                    :value="index">
                    {{ section.title }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeMilestoneModal">
              {{ content.cancelBtn || 'Abbrechen' }}
            </button>
            <button class="lv-btn lv-btn-primary" @click="saveMilestone">
              {{ content.saveBtn || 'Speichern' }}
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
      activeView: 'timeline',
      activeFilter: 'all',
      showMilestoneModal: false,
      isEditMode: false,
      editingMilestone: {
        id: '',
        title: '',
        date: '',
        description: '',
        status: 'pending',
        sectionId: 0
      },
      timelineSections: [
        {
          title: '12+ Monate vor der Hochzeit',
          progress: 100,
          items: [
            {
              id: '1',
              date: '15. August 2024',
              title: 'Hochzeitsdatum festlegen',
              description: 'Datum für die Hochzeit festgelegt: 15. August 2025',
              status: 'completed'
            },
            {
              id: '2',
              date: '20. August 2024',
              title: 'Budget festlegen',
              description: 'Gesamtbudget von 25.000 € festgelegt',
              status: 'completed'
            },
            {
              id: '3',
              date: '1. September 2024',
              title: 'Location buchen',
              description: 'Schloss Elmau als Hochzeitslocation gebucht',
              status: 'completed'
            }
          ]
        },
        {
          title: '9-12 Monate vor der Hochzeit',
          progress: 75,
          items: [
            {
              id: '4',
              date: '15. September 2024',
              title: 'Gästeliste erstellen',
              description: 'Vorläufige Gästeliste mit 120 Personen erstellt',
              status: 'completed'
            },
            {
              id: '5',
              date: '1. Oktober 2024',
              title: 'Catering buchen',
              description: 'Gourmet Catering für die Hochzeit gebucht',
              status: 'completed'
            },
            {
              id: '6',
              date: '15. Oktober 2024',
              title: 'Fotografen buchen',
              description: 'Fotograf für die Hochzeit noch nicht gebucht',
              status: 'completed'
            },
            {
              id: '7',
              date: '1. November 2024',
              title: 'DJ/Band buchen',
              description: 'In Gesprächen mit verschiedenen DJs',
              status: 'in-progress'
            }
          ]
        },
        {
          title: '6-9 Monate vor der Hochzeit',
          progress: 50,
          items: [
            {
              id: '8',
              date: '15. November 2024',
              title: 'Brautkleid aussuchen',
              description: 'Brautkleid bei Brautmoden Schneider ausgesucht',
              status: 'completed'
            },
            {
              id: '9',
              date: '1. Dezember 2024',
              title: 'Anzug für den Bräutigam',
              description: 'Anzug noch nicht ausgesucht',
              status: 'completed'
            },
            {
              id: '10',
              date: '15. Dezember 2024',
              title: 'Blumendekoration planen',
              description: 'In Gesprächen mit Blumen Schmidt',
              status: 'in-progress'
            },
            {
              id: '11',
              date: '1. Januar 2025',
              title: 'Save-the-Date versenden',
              description: 'Entwürfe in Arbeit',
              status: 'in-progress'
            }
          ]
        },
        {
          title: '3-6 Monate vor der Hochzeit',
          progress: 25,
          items: [
            {
              id: '12',
              date: '15. Februar 2025',
              title: 'Hochzeitstorte bestellen',
              description: 'Torte bei Konditorei Meyer bestellt',
              status: 'completed'
            },
            {
              id: '13',
              date: '1. März 2025',
              title: 'Einladungen versenden',
              description: 'Einladungen in Produktion',
              status: 'in-progress'
            },
            {
              id: '14',
              date: '15. März 2025',
              title: 'Trauringe aussuchen',
              description: 'Termin beim Juwelier vereinbart',
              status: 'in-progress'
            },
            {
              id: '15',
              date: '1. April 2025',
              title: 'Menü festlegen',
              description: 'Termin mit Caterer noch nicht vereinbart',
              status: 'pending'
            }
          ]
        },
        {
          title: '1-3 Monate vor der Hochzeit',
          progress: 0,
          items: [
            {
              id: '16',
              date: '15. Mai 2025',
              title: 'Sitzplan erstellen',
              description: 'Noch nicht begonnen',
              status: 'pending'
            },
            {
              id: '17',
              date: '1. Juni 2025',
              title: 'Ablaufplan erstellen',
              description: 'Noch nicht begonnen',
              status: 'pending'
            },
            {
              id: '18',
              date: '15. Juni 2025',
              title: 'Probeessen',
              description: 'Termin noch nicht vereinbart',
              status: 'pending'
            },
            {
              id: '19',
              date: '1. Juli 2025',
              title: 'Friseurtermin buchen',
              description: 'Noch nicht gebucht',
              status: 'pending'
            }
          ]
        },
        {
          title: 'Letzte Wochen vor der Hochzeit',
          progress: 0,
          items: [
            {
              id: '20',
              date: '15. Juli 2025',
              title: 'Finale Gästeliste',
              description: 'Noch nicht erstellt',
              status: 'pending'
            },
            {
              id: '21',
              date: '1. August 2025',
              title: 'Letzte Anprobe',
              description: 'Termin noch nicht vereinbart',
              status: 'pending'
            },
            {
              id: '22',
              date: '10. August 2025',
              title: 'Tischdekoration abholen',
              description: 'Noch nicht bestellt',
              status: 'pending'
            }
          ]
        }
      ]
    };
  },
  computed: {
    filteredTimelineSections() {
      if (this.activeFilter === 'all') {
        return this.timelineSections;
      }
      
      // Create a deep copy of the sections to avoid modifying the original data
      const filteredSections = JSON.parse(JSON.stringify(this.timelineSections));
      
      // For each section, filter the items based on the active filter
      filteredSections.forEach(section => {
        section.items = section.items.filter(item => item.status === this.activeFilter);
      });
      
      // Only return sections that have items after filtering
      return filteredSections.filter(section => section.items.length > 0);
    }
  },
  methods: {
    setActiveView(view) {
      this.activeView = view;
    },
    setActiveFilter(filter) {
      this.activeFilter = filter;
    },
    shouldShowItem(item) {
      return this.activeFilter === 'all' || item.status === this.activeFilter;
    },
    addMilestone() {
      this.isEditMode = false;
      this.editingMilestone = {
        id: Date.now().toString(), // Generate a unique ID
        title: '',
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        description: '',
        status: 'pending',
        sectionId: 0
      };
      this.showMilestoneModal = true;
    },
    editMilestone(milestone) {
      this.isEditMode = true;
      
      // Find the section that contains this milestone
      let sectionId = 0;
      for (let i = 0; i < this.timelineSections.length; i++) {
        if (this.timelineSections[i].items.some(item => item.id === milestone.id)) {
          sectionId = i;
          break;
        }
      }
      
      this.editingMilestone = {
        ...milestone,
        sectionId
      };
      this.showMilestoneModal = true;
    },
    closeMilestoneModal() {
      this.showMilestoneModal = false;
    },
    saveMilestone() {
      if (!this.editingMilestone.title || !this.editingMilestone.date) {
        alert(this.content.requiredFieldsMessage || 'Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      if (this.isEditMode) {
        // Find and update the existing milestone
        for (const section of this.timelineSections) {
          const index = section.items.findIndex(item => item.id === this.editingMilestone.id);
          if (index !== -1) {
            // Remove from current section
            section.items.splice(index, 1);
            break;
          }
        }
      }
      
      // Add to the selected section (whether it's a new milestone or moved from another section)
      const targetSection = this.timelineSections[this.editingMilestone.sectionId];
      targetSection.items.push({
        id: this.editingMilestone.id,
        title: this.editingMilestone.title,
        date: this.editingMilestone.date,
        description: this.editingMilestone.description,
        status: this.editingMilestone.status
      });
      
      // Update progress for all sections
      this.updateSectionsProgress();
      
      this.closeMilestoneModal();
    },
    toggleTaskStatus(item) {
      // Toggle between completed and pending
      item.status = item.status === 'completed' ? 'pending' : 'completed';
      
      // Update progress for all sections
      this.updateSectionsProgress();
    },
    updateSectionsProgress() {
      // For each section, calculate the percentage of completed items
      this.timelineSections.forEach(section => {
        const totalItems = section.items.length;
        if (totalItems === 0) {
          section.progress = 0;
          return;
        }
        
        const completedItems = section.items.filter(item => item.status === 'completed').length;
        section.progress = Math.round((completedItems / totalItems) * 100);
      });
    }
  }
};
</script>

<style scoped>
/* Timeline styles */
.lv-timeline {
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

.lv-mb-4 {
  margin-bottom: 1.5rem;
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

/* View toggle styles */
.lv-view-toggle {
  display: flex;
  border-bottom: 1px solid #eee;
}

.lv-toggle-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
}

.lv-toggle-active {
  border-bottom-color: #f8c630;
  color: #f8c630;
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
  color: #6c757d;
  background-color: transparent;
  border-color: #6c757d;
}

.lv-btn-outline:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.lv-btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  opacity: 0.7;
}

.lv-btn-icon:hover {
  opacity: 1;
}

/* Timeline section styles */
.lv-timeline-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.lv-timeline-section-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.lv-progress-container {
  width: 200px;
}

.lv-progress-bar {
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.lv-progress-segment {
  height: 100%;
  border-radius: 4px;
}

.lv-progress-success {
  background-color: #28a745;
}

.lv-progress-label {
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.25rem;
  color: #666;
}

/* Timeline item styles */
.lv-timeline-items {
  position: relative;
  padding-left: 2rem;
}

.lv-timeline-items::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.75rem;
  width: 2px;
  background-color: #eee;
}

.lv-timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.lv-timeline-marker {
  position: absolute;
  left: -2rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #ccc;
  top: 0;
}

.lv-timeline-completed .lv-timeline-marker {
  background-color: #28a745;
  border-color: #28a745;
}

.lv-timeline-in-progress .lv-timeline-marker {
  background-color: #ffc107;
  border-color: #ffc107;
}

.lv-timeline-pending .lv-timeline-marker {
  background-color: #dc3545;
  border-color: #dc3545;
}

.lv-timeline-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.lv-timeline-date {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.lv-timeline-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.lv-timeline-description {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.lv-timeline-actions {
  display: flex;
  justify-content: flex-end;
}

/* Checklist styles */
.lv-checklist-section {
  margin-bottom: 1.5rem;
}

.lv-checklist-section-header {
  margin-bottom: 0.5rem;
}

.lv-checklist-section-header h3 {
  margin: 0;
  font-size: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.lv-checklist-item {
  display: flex;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.lv-checklist-item:last-child {
  border-bottom: none;
}

.lv-checklist-item-checkbox {
  margin-right: 1rem;
  position: relative;
}

.lv-checklist-item-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

.lv-checklist-item-checkbox label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.lv-checklist-item-checkbox input[type="checkbox"]:checked + label {
  background-color: #28a745;
  border-color: #28a745;
}

.lv-checklist-item-checkbox input[type="checkbox"]:checked + label::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.lv-checklist-item-content {
  flex: 1;
}

.lv-checklist-item-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.lv-checklist-item-details {
  font-size: 0.875rem;
  color: #666;
}

.lv-checklist-item-date {
  margin-right: 0.5rem;
}

.lv-checklist-item-actions {
  margin-left: 1rem;
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

@media (max-width: 768px) {
  .lv-timeline-section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lv-progress-container {
    width: 100%;
    margin-top: 0.5rem;
  }
  
  .lv-stats-container {
    flex-direction: column;
    align-items: center;
  }
  
  .lv-stat-item {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .lv-filter-group {
    margin-bottom: 1rem;
  }
  
  .lv-action-bar .lv-col-md-6.lv-text-right {
    text-align: left;
    margin-top: 1rem;
  }
}
</style>
