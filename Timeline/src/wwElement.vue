<template>
  <div class="lv-timeline">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-timeline-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Zeitplan' }}</h2>
                <p>{{ content.subtitle || 'Planen Sie den Ablauf Ihres Hochzeitstages' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ events.length }}</div>
                    <div class="lv-stat-label">{{ content.eventsLabel || 'Ereignisse' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ daysUntilWedding }}</div>
                    <div class="lv-stat-label">{{ content.daysUntilLabel || 'Tage bis zur Hochzeit' }}</div>
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
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Ereignisse suchen...'" v-model="searchQuery" @input="filterEvents">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-outline" @click="toggleView">
                {{ isCalendarView ? content.listViewBtn || 'Listenansicht' : content.calendarViewBtn || 'Kalenderansicht' }}
              </button>
              <button class="lv-btn lv-btn-primary" @click="openEventModal">{{ content.addEventBtn || 'Ereignis hinzufügen' }}</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Filter Bar -->
      <div class="lv-filter-bar lv-mb-3">
        <div class="lv-filter-group">
          <button 
            v-for="(filter, index) in categoryFilters" 
            :key="'category-' + index" 
            class="lv-filter-btn" 
            :class="{ 'lv-filter-active': currentCategoryFilter === filter.value }"
            @click="setCategoryFilter(filter.value)">
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <!-- Calendar View -->
      <div v-if="isCalendarView" class="lv-calendar-view lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-calendar-header">
              <button class="lv-btn lv-btn-sm lv-btn-outline" @click="prevMonth">&laquo;</button>
              <h3>{{ currentMonthName }} {{ currentYear }}</h3>
              <button class="lv-btn lv-btn-sm lv-btn-outline" @click="nextMonth">&raquo;</button>
            </div>
            
            <div class="lv-calendar-grid">
              <div class="lv-calendar-weekdays">
                <div v-for="day in weekdays" :key="day" class="lv-calendar-weekday">{{ day }}</div>
              </div>
              
              <div class="lv-calendar-days">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date" 
                  class="lv-calendar-day" 
                  :class="{ 
                    'lv-calendar-day-other-month': !day.isCurrentMonth,
                    'lv-calendar-day-today': day.isToday,
                    'lv-calendar-day-wedding': day.isWeddingDay,
                    'lv-calendar-day-has-events': day.events.length > 0
                  }"
                  @click="day.isCurrentMonth ? selectDate(day.date) : null"
                >
                  <div class="lv-calendar-day-number">{{ day.dayNumber }}</div>
                  <div class="lv-calendar-day-events">
                    <div 
                      v-for="(event, index) in day.events.slice(0, 3)" 
                      :key="index" 
                      class="lv-calendar-event-dot"
                      :style="{ backgroundColor: getCategoryColor(event.category) }"
                      :title="event.title"
                    ></div>
                    <div v-if="day.events.length > 3" class="lv-calendar-event-more">+{{ day.events.length - 3 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Selected Date Events -->
        <div v-if="selectedDate && getEventsForDate(selectedDate).length > 0" class="lv-selected-date-events lv-mt-3">
          <div class="lv-card">
            <div class="lv-card-body lv-p-3">
              <h3>{{ formatDate(selectedDate) }}</h3>
              <div class="lv-events-list">
                <div v-for="event in getEventsForDate(selectedDate)" :key="event.id" class="lv-event-item" @click="openEventDetails(event)">
                  <div class="lv-event-time">{{ formatTime(event.start_time) }}</div>
                  <div class="lv-event-content">
                    <div class="lv-event-title">
                      <span class="lv-event-category-indicator" :style="{ backgroundColor: getCategoryColor(event.category) }"></span>
                      {{ event.title }}
                    </div>
                    <div class="lv-event-description" v-if="event.description">{{ event.description }}</div>
                  </div>
                  <div class="lv-event-actions">
                    <button class="lv-btn-icon lv-edit-event" @click.stop="editEvent(event)">✏️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- List View -->
      <div v-else class="lv-list-view">
        <div v-for="(group, date) in groupedEvents" :key="date" class="lv-date-group lv-mb-3">
          <div class="lv-date-header">
            <h3>{{ formatDate(date) }}</h3>
            <div class="lv-date-badge" v-if="isWeddingDay(date)">{{ content.weddingDayLabel || 'Hochzeitstag' }}</div>
          </div>
          
          <div class="lv-card">
            <div class="lv-card-body lv-p-0">
              <div class="lv-events-list">
                <div v-for="event in group" :key="event.id" class="lv-event-item" @click="openEventDetails(event)">
                  <div class="lv-event-time">{{ formatTime(event.start_time) }}</div>
                  <div class="lv-event-content">
                    <div class="lv-event-title">
                      <span class="lv-event-category-indicator" :style="{ backgroundColor: getCategoryColor(event.category) }"></span>
                      {{ event.title }}
                    </div>
                    <div class="lv-event-description" v-if="event.description">{{ event.description }}</div>
                    <div class="lv-event-location" v-if="event.location">
                      <span class="lv-event-location-icon">📍</span> {{ event.location }}
                    </div>
                  </div>
                  <div class="lv-event-actions">
                    <button class="lv-btn-icon lv-edit-event" @click.stop="editEvent(event)">✏️</button>
                    <button class="lv-btn-icon lv-delete-event" @click.stop="openDeleteModal(event)">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="Object.keys(groupedEvents).length === 0" class="lv-empty-state">
          <div class="lv-card">
            <div class="lv-card-body lv-text-center lv-p-5">
              <div class="lv-empty-icon">📅</div>
              <h3>{{ content.emptyStateTitle || 'Keine Ereignisse gefunden' }}</h3>
              <p>{{ content.emptyStateMessage || 'Fügen Sie Ereignisse hinzu, um Ihren Hochzeitstag zu planen.' }}</p>
              <button class="lv-btn lv-btn-primary lv-mt-3" @click="openEventModal">
                {{ content.addEventBtn || 'Ereignis hinzufügen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Event Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isEventModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditingEvent ? content.editEventTitle || 'Ereignis bearbeiten' : content.addEventTitle || 'Ereignis hinzufügen' }}</h3>
            <button class="lv-modal-close" @click="closeEventModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="eventTitle">{{ content.eventTitleLabel || 'Titel' }}*</label>
              <input type="text" class="lv-form-control" id="eventTitle" v-model="currentEvent.title" required>
            </div>
            
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="eventDate">{{ content.eventDateLabel || 'Datum' }}*</label>
                  <input type="date" class="lv-form-control" id="eventDate" v-model="currentEvent.date" required>
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="eventCategory">{{ content.eventCategoryLabel || 'Kategorie' }}</label>
                  <select class="lv-form-control" id="eventCategory" v-model="currentEvent.category">
                    <option v-for="category in categories" :key="category.value" :value="category.value">
                      {{ category.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="eventStartTime">{{ content.eventStartTimeLabel || 'Startzeit' }}</label>
                  <input type="time" class="lv-form-control" id="eventStartTime" v-model="currentEvent.start_time">
                </div>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-form-group">
                  <label class="lv-form-label" for="eventEndTime">{{ content.eventEndTimeLabel || 'Endzeit' }}</label>
                  <input type="time" class="lv-form-control" id="eventEndTime" v-model="currentEvent.end_time">
                </div>
              </div>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="eventLocation">{{ content.eventLocationLabel || 'Ort' }}</label>
              <input type="text" class="lv-form-control" id="eventLocation" v-model="currentEvent.location">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="eventDescription">{{ content.eventDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="eventDescription" v-model="currentEvent.description" rows="3"></textarea>
            </div>
            
            <div class="lv-form-group">
              <div class="lv-checkbox-container">
                <input type="checkbox" id="eventNotify" class="lv-checkbox" v-model="currentEvent.notify_guests">
                <label for="eventNotify">{{ content.notifyGuestsLabel || 'Gäste benachrichtigen' }}</label>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeEventModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveEvent">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event Details Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isEventDetailsModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ selectedEvent ? selectedEvent.title : '' }}</h3>
            <button class="lv-modal-close" @click="closeEventDetailsModal">&times;</button>
          </div>
          <div class="lv-modal-body" v-if="selectedEvent">
            <div class="lv-event-details">
              <div class="lv-event-detail-item">
                <div class="lv-event-detail-label">{{ content.dateLabel || 'Datum' }}:</div>
                <div class="lv-event-detail-value">{{ formatDate(selectedEvent.date) }}</div>
              </div>
              
              <div class="lv-event-detail-item" v-if="selectedEvent.start_time">
                <div class="lv-event-detail-label">{{ content.timeLabel || 'Zeit' }}:</div>
                <div class="lv-event-detail-value">
                  {{ formatTime(selectedEvent.start_time) }}
                  {{ selectedEvent.end_time ? ' - ' + formatTime(selectedEvent.end_time) : '' }}
                </div>
              </div>
              
              <div class="lv-event-detail-item" v-if="selectedEvent.location">
                <div class="lv-event-detail-label">{{ content.locationLabel || 'Ort' }}:</div>
                <div class="lv-event-detail-value">{{ selectedEvent.location }}</div>
              </div>
              
              <div class="lv-event-detail-item" v-if="selectedEvent.category">
                <div class="lv-event-detail-label">{{ content.categoryLabel || 'Kategorie' }}:</div>
                <div class="lv-event-detail-value">
                  <span 
                    class="lv-event-category-badge"
                    :style="{ backgroundColor: getCategoryColor(selectedEvent.category) }"
                  >
                    {{ getCategoryLabel(selectedEvent.category) }}
                  </span>
                </div>
              </div>
              
              <div class="lv-event-detail-item" v-if="selectedEvent.description">
                <div class="lv-event-detail-label">{{ content.descriptionLabel || 'Beschreibung' }}:</div>
                <div class="lv-event-detail-value lv-event-description">{{ selectedEvent.description }}</div>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="editEvent(selectedEvent)">{{ content.editButtonText || 'Bearbeiten' }}</button>
            <button class="lv-btn lv-btn-primary" @click="closeEventDetailsModal">{{ content.closeButtonText || 'Schließen' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteModalOpen }">
      <div class="lv-modal-dialog lv-modal-sm">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.deleteEventTitle || 'Ereignis löschen' }}</h3>
            <button class="lv-modal-close" @click="closeDeleteModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <p>{{ content.deleteConfirmationText || 'Sind Sie sicher, dass Sie dieses Ereignis löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeleteModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deleteEvent">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      weddingDate: null,
      
      // Data
      events: [],
      filteredEvents: [],
      
      // UI state
      searchQuery: '',
      currentCategoryFilter: 'all',
      isCalendarView: true,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDate: null,
      selectedEvent: null,
      
      // Modals
      isEventModalOpen: false,
      isEventDetailsModalOpen: false,
      isDeleteModalOpen: false,
      
      // Editing state
      isEditingEvent: false,
      currentEvent: this.getEmptyEvent(),
      eventToDelete: null,
      
      // Options
      weekdays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      months: [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
      ],
      categories: [
        { value: 'ceremony', label: 'Zeremonie', color: '#4285F4' },
        { value: 'reception', label: 'Empfang', color: '#EA4335' },
        { value: 'meal', label: 'Essen', color: '#FBBC05' },
        { value: 'party', label: 'Feier', color: '#34A853' },
        { value: 'photo', label: 'Fotoshooting', color: '#FF6D01' },
        { value: 'transport', label: 'Transport', color: '#46BDC6' },
        { value: 'preparation', label: 'Vorbereitung', color: '#7BAAF7' },
        { value: 'other', label: 'Sonstiges', color: '#A8DAB5' }
      ],
      categoryFilters: [
        { value: 'all', label: 'Alle Kategorien' }
        // Will be populated with categories in mounted
      ]
    };
  },
  computed: {
    currentMonthName() {
      return this.months[this.currentMonth];
    },
    
    calendarDays() {
      const days = [];
      
      // Get first day of the month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay();
      
      // Add days from previous month to fill the first week
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(this.currentYear, this.currentMonth - 1, prevMonthLastDay - i);
        days.push({
          date: this.formatDateISO(date),
          dayNumber: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: this.isToday(date),
          isWeddingDay: this.isWeddingDay(this.formatDateISO(date)),
          events: this.getEventsForDate(this.formatDateISO(date))
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          date: this.formatDateISO(date),
          dayNumber: i,
          isCurrentMonth: true,
          isToday: this.isToday(date),
          isWeddingDay: this.isWeddingDay(this.formatDateISO(date)),
          events: this.getEventsForDate(this.formatDateISO(date))
        });
      }
      
      // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({
          date: this.formatDateISO(date),
          dayNumber: i,
          isCurrentMonth: false,
          isToday: this.isToday(date),
          isWeddingDay: this.isWeddingDay(this.formatDateISO(date)),
          events: this.getEventsForDate(this.formatDateISO(date))
        });
      }
      
      return days;
    },
    
    groupedEvents() {
      // Group events by date
      const grouped = {};
      
      this.filteredEvents.forEach(event => {
        if (!grouped[event.date]) {
          grouped[event.date] = [];
        }
        grouped[event.date].push(event);
      });
      
      // Sort each group by start_time
      Object.keys(grouped).forEach(date => {
        grouped[date].sort((a, b) => {
          if (!a.start_time) return 1;
          if (!b.start_time) return -1;
          return a.start_time.localeCompare(b.start_time);
        });
      });
      
      // Sort dates
      const sortedGrouped = {};
      Object.keys(grouped).sort().forEach(date => {
        sortedGrouped[date] = grouped[date];
      });
      
      return sortedGrouped;
    },
    
    daysUntilWedding() {
      if (!this.weddingDate) return '-';
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weddingDate = new Date(this.weddingDate);
      weddingDate.setHours(0, 0, 0, 0);
      
      const diffTime = weddingDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return 0;
      return diffDays;
    }
  },
  async mounted() {
    // Initialize Supabase client
    this.initSupabase();
    
    // Get wedding ID and date for current user
    await this.getCurrentWeddingInfo();
    
    // Load data
    if (this.weddingId) {
      await this.loadEvents();
      
      // Initialize filtered events
      this.filterEvents();
      
      // Set up category filters
      this.setupCategoryFilters();
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
    
    async getCurrentWeddingInfo() {
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
        
        // Get wedding date
        if (this.weddingId) {
          const { data: weddingData, error: weddingError } = await this.supabase
            .from('weddings')
            .select('wedding_date')
            .eq('id', this.weddingId)
            .single();
          
          if (weddingError) throw weddingError;
          
          if (weddingData) {
            this.weddingDate = weddingData.wedding_date;
            
            // Set calendar to wedding month if wedding date is in the future
            const today = new Date();
            const weddingDate = new Date(this.weddingDate);
            
            if (weddingDate > today) {
              this.currentMonth = weddingDate.getMonth();
              this.currentYear = weddingDate.getFullYear();
            }
          }
        }
      } catch (error) {
        console.error('Error getting wedding info:', error);
      }
    },
    
    async loadEvents() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('timeline_events')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.events = data || [];
      } catch (error) {
        console.error('Error loading events:', error);
      }
    },
    
    async addEvent(eventData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newEvent = {
          ...eventData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('timeline_events')
          .insert([newEvent])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add event to local state
          this.events.push(data[0]);
          this.filterEvents();
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding event:', error);
        return null;
      }
    },
    
    async updateEvent(eventData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('timeline_events')
          .update(eventData)
          .eq('id', eventData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.events.findIndex(e => e.id === eventData.id);
        if (index !== -1) {
          this.events[index] = {
            ...this.events[index],
            ...eventData
          };
        }
        
        this.filterEvents();
        
        return true;
      } catch (error) {
        console.error('Error updating event:', error);
        return false;
      }
    },
    
    async removeEvent(eventId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('timeline_events')
          .update({ is_active: false })
          .eq('id', eventId);
        
        if (error) throw error;
        
        // Remove from local state
        this.events = this.events.filter(e => e.id !== eventId);
        this.filterEvents();
        
        return true;
      } catch (error) {
        console.error('Error removing event:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyEvent() {
      const today = new Date();
      return {
        title: '',
        description: '',
        date: this.formatDateISO(today),
        start_time: null,
        end_time: null,
        location: '',
        category: 'other',
        notify_guests: false
      };
    },
    
    formatDateISO(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const day = date.getDate();
      const month = this.months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${day}. ${month} ${year}`;
    },
    
    formatTime(timeString) {
      if (!timeString) return '';
      return timeString;
    },
    
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    },
    
    isWeddingDay(dateString) {
      if (!this.weddingDate) return false;
      return dateString === this.weddingDate;
    },
    
    getCategoryColor(categoryValue) {
      const category = this.categories.find(c => c.value === categoryValue);
      return category ? category.color : '#ccc';
    },
    
    getCategoryLabel(categoryValue) {
      const category = this.categories.find(c => c.value === categoryValue);
      return category ? category.label : 'Sonstiges';
    },
    
    getEventsForDate(dateString) {
      return this.events.filter(event => event.date === dateString);
    },
    
    setupCategoryFilters() {
      // Add categories to filters
      this.categoryFilters = [
        { value: 'all', label: 'Alle Kategorien' },
        ...this.categories.map(category => ({
          value: category.value,
          label: category.label
        }))
      ];
    },
    
    filterEvents() {
      let filtered = [...this.events];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) || 
          (event.description && event.description.toLowerCase().includes(query)) ||
          (event.location && event.location.toLowerCase().includes(query))
        );
      }
      
      // Apply category filter
      if (this.currentCategoryFilter !== 'all') {
        filtered = filtered.filter(event => event.category === this.currentCategoryFilter);
      }
      
      this.filteredEvents = filtered;
    },
    
    setCategoryFilter(category) {
      this.currentCategoryFilter = category;
      this.filterEvents();
    },
    
    toggleView() {
      this.isCalendarView = !this.isCalendarView;
    },
    
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    
    selectDate(date) {
      this.selectedDate = date;
    },
    
    // Event Operations
    openEventModal() {
      this.isEditingEvent = false;
      this.currentEvent = this.getEmptyEvent();
      
      // If a date is selected in calendar view, use that date
      if (this.selectedDate) {
        this.currentEvent.date = this.selectedDate;
      }
      
      this.isEventModalOpen = true;
    },
    
    editEvent(event) {
      if (!event) return;
      
      this.isEditingEvent = true;
      this.currentEvent = { ...event };
      
      // Close details modal if open
      if (this.isEventDetailsModalOpen) {
        this.closeEventDetailsModal();
      }
      
      this.isEventModalOpen = true;
    },
    
    closeEventModal() {
      this.isEventModalOpen = false;
    },
    
    openEventDetails(event) {
      this.selectedEvent = event;
      this.isEventDetailsModalOpen = true;
    },
    
    closeEventDetailsModal() {
      this.isEventDetailsModalOpen = false;
      this.selectedEvent = null;
    },
    
    async saveEvent() {
      if (!this.currentEvent.title || !this.currentEvent.date) {
        alert('Bitte füllen Sie alle Pflichtfelder aus.');
        return;
      }
      
      let success = false;
      
      if (this.isEditingEvent) {
        // Update existing event
        success = await this.updateEvent(this.currentEvent);
      } else {
        // Add new event
        const newEvent = await this.addEvent(this.currentEvent);
        success = !!newEvent;
      }
      
      if (success) {
        this.closeEventModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Ereignisses. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteModal(event) {
      this.eventToDelete = event;
      this.isDeleteModalOpen = true;
    },
    
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.eventToDelete = null;
    },
    
    async deleteEvent() {
      if (!this.eventToDelete) return;
      
      const success = await this.removeEvent(this.eventToDelete.id);
      
      if (success) {
        this.closeDeleteModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Ereignisses. Bitte versuchen Sie es erneut.');
      }
    }
  }
};
</script>

<style>
.lv-timeline {
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

.lv-mt-3 {
  margin-top: 15px;
}

.lv-p-0 {
  padding: 0;
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

/* Calendar View */
.lv-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.lv-calendar-header h3 {
  margin: 0;
}

.lv-calendar-grid {
  display: flex;
  flex-direction: column;
}

.lv-calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 500;
  margin-bottom: 5px;
}

.lv-calendar-weekday {
  padding: 5px;
}

.lv-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 5px;
}

.lv-calendar-day {
  height: 80px;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.lv-calendar-day:hover {
  background-color: #f8f9fa;
}

.lv-calendar-day-other-month {
  color: #ccc;
  background-color: #f8f9fa;
}

.lv-calendar-day-today {
  border-color: #007bff;
  font-weight: bold;
}

.lv-calendar-day-wedding {
  background-color: #ffebee;
}

.lv-calendar-day-number {
  font-size: 14px;
  margin-bottom: 5px;
}

.lv-calendar-day-events {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.lv-calendar-event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 2px;
}

.lv-calendar-event-more {
  font-size: 10px;
  color: #666;
}

/* List View */
.lv-date-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.lv-date-header h3 {
  margin: 0;
  margin-right: 10px;
}

.lv-date-badge {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.lv-events-list {
  display: flex;
  flex-direction: column;
}

.lv-event-item {
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.lv-event-item:hover {
  background-color: #f8f9fa;
}

.lv-event-item:last-child {
  border-bottom: none;
}

.lv-event-time {
  width: 80px;
  font-weight: 500;
  color: #666;
}

.lv-event-content {
  flex: 1;
}

.lv-event-title {
  font-weight: 500;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.lv-event-category-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.lv-event-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.lv-event-location {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
}

.lv-event-location-icon {
  margin-right: 5px;
}

.lv-event-actions {
  display: flex;
  gap: 5px;
  align-items: flex-start;
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

/* Event Details */
.lv-event-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lv-event-detail-item {
  display: flex;
}

.lv-event-detail-label {
  width: 120px;
  font-weight: 500;
}

.lv-event-detail-value {
  flex: 1;
}

.lv-event-category-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: white;
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
  
  .lv-calendar-day {
    height: 60px;
  }
  
  .lv-event-item {
    flex-direction: column;
  }
  
  .lv-event-time {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .lv-event-actions {
    margin-top: 10px;
  }
  
  .lv-modal-dialog {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
}
</style>
