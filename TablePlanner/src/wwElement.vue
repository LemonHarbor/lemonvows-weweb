<template>
  <div class="lv-table-planner">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-table-planner-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Tischplaner' }}</h2>
                <p>{{ content.subtitle || 'Erstellen Sie Ihre perfekte Sitzordnung für die Hochzeitsfeier' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ totalGuests }}</div>
                    <div class="lv-stat-label">{{ content.totalGuestsLabel || 'Gäste gesamt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ seatedGuests }}</div>
                    <div class="lv-stat-label">{{ content.seatedGuestsLabel || 'Platziert' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ unseatedGuests }}</div>
                    <div class="lv-stat-label">{{ content.unseatedGuestsLabel || 'Nicht platziert' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ tables.length }}</div>
                    <div class="lv-stat-label">{{ content.totalTablesLabel || 'Tische' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="lv-row">
        <!-- Control Panel -->
        <div class="lv-col lv-col-md-3">
          <div class="lv-control-panel lv-mb-3">
            <div class="lv-card">
              <div class="lv-card-header">
                <h3>{{ content.controlPanelTitle || 'Steuerung' }}</h3>
              </div>
              <div class="lv-card-body">
                <div class="lv-control-section lv-mb-3">
                  <h4>{{ content.tablesTitle || 'Tische' }}</h4>
                  <div class="lv-btn-group lv-mb-2">
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addTable('round')">
                      {{ content.roundTableBtn || 'Rund' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addTable('rect')">
                      {{ content.rectTableBtn || 'Rechteckig' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addTable('oval')">
                      {{ content.ovalTableBtn || 'Oval' }}
                    </button>
                  </div>
                  <div class="lv-form-group lv-mb-2">
                    <label class="lv-form-label">{{ content.tableSizeLabel || 'Tischgröße' }}</label>
                    <select class="lv-form-control" v-model="tableSize">
                      <option v-for="(option, index) in content.tableSizeOptions" :key="index" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div class="lv-form-group">
                    <label class="lv-form-label">{{ content.tableColorLabel || 'Tischfarbe' }}</label>
                    <div class="lv-color-picker">
                      <div 
                        v-for="(color, index) in content.tableColors" 
                        :key="index"
                        class="lv-color-option" 
                        :class="{ 'lv-color-active': selectedColor === color }"
                        :style="{ backgroundColor: color }"
                        @click="selectColor(color)">
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="lv-control-section lv-mb-3">
                  <h4>{{ content.roomElementsTitle || 'Raumelemente' }}</h4>
                  <div class="lv-btn-group lv-mb-2">
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addRoomElement('danceFloor')">
                      {{ content.danceFloorBtn || 'Tanzfläche' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addRoomElement('bar')">
                      {{ content.barBtn || 'Bar' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="addRoomElement('stage')">
                      {{ content.stageBtn || 'Bühne' }}
                    </button>
                  </div>
                </div>
                
                <div class="lv-control-section">
                  <h4>{{ content.actionsTitle || 'Aktionen' }}</h4>
                  <div class="lv-btn-group lv-mb-2">
                    <button class="lv-btn lv-btn-sm lv-btn-outline lv-btn-danger" @click="deleteSelected">
                      {{ content.deleteSelectedBtn || 'Löschen' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="clearAll">
                      {{ content.clearAllBtn || 'Alles zurücksetzen' }}
                    </button>
                  </div>
                  <div class="lv-btn-group">
                    <button class="lv-btn lv-btn-sm lv-btn-primary" @click="saveLayout">
                      {{ content.saveLayoutBtn || 'Layout speichern' }}
                    </button>
                    <button class="lv-btn lv-btn-sm lv-btn-outline" @click="printLayout">
                      {{ content.printLayoutBtn || 'Drucken' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Guest List Panel -->
          <div class="lv-guest-panel">
            <div class="lv-card">
              <div class="lv-card-header">
                <h3>{{ content.guestListTitle || 'Gästeliste' }}</h3>
                <div class="lv-search-container">
                  <input 
                    type="text" 
                    class="lv-search-input" 
                    v-model="guestSearch" 
                    :placeholder="content.guestSearchPlaceholder || 'Gäste suchen...'"
                  >
                </div>
              </div>
              <div class="lv-card-body">
                <div class="lv-guest-filter lv-mb-2">
                  <button 
                    class="lv-filter-btn" 
                    :class="{ 'lv-filter-active': guestFilter === 'unassigned' }"
                    @click="setGuestFilter('unassigned')">
                    {{ content.unassignedFilterBtn || 'Nicht platziert' }}
                  </button>
                  <button 
                    class="lv-filter-btn" 
                    :class="{ 'lv-filter-active': guestFilter === 'all' }"
                    @click="setGuestFilter('all')">
                    {{ content.allGuestsFilterBtn || 'Alle Gäste' }}
                  </button>
                </div>
                <div class="lv-guest-list">
                  <!-- Filtered Guests -->
                  <div 
                    v-for="guest in filteredGuests" 
                    :key="guest.id"
                    class="lv-guest-item" 
                    draggable="true"
                    @dragstart="dragStart($event, guest)"
                    :data-guest-id="guest.id">
                    <div class="lv-guest-name">{{ guest.name }}</div>
                    <div class="lv-guest-info">{{ guest.info }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Floor Plan -->
        <div class="lv-col lv-col-md-9">
          <div class="lv-floor-plan-container">
            <div class="lv-card">
              <div class="lv-card-header">
                <h3>{{ content.floorPlanTitle || 'Raumplan' }}</h3>
                <div class="lv-view-controls">
                  <button class="lv-btn lv-btn-sm lv-btn-outline" @click="zoomIn">+</button>
                  <button class="lv-btn lv-btn-sm lv-btn-outline" @click="zoomOut">-</button>
                  <button class="lv-btn lv-btn-sm lv-btn-outline" @click="resetView">
                    {{ content.resetViewBtn || 'Reset' }}
                  </button>
                </div>
              </div>
              <div class="lv-card-body">
                <div 
                  class="lv-floor-plan" 
                  ref="floorPlan"
                  @dragover="dragOver"
                  @drop="drop"
                  :style="{ transform: `scale(${zoomLevel})` }">
                  
                  <!-- Tables -->
                  <div 
                    v-for="table in tables" 
                    :key="table.id"
                    class="lv-table" 
                    :class="'lv-table-' + table.type"
                    :style="{ left: table.position_x + 'px', top: table.position_y + 'px', backgroundColor: table.color }"
                    :data-table-id="table.id"
                    @mousedown="startDrag($event, table)"
                    @dblclick="openTableProperties(table)">
                    <div class="lv-table-number">{{ table.number }}</div>
                    <div class="lv-table-capacity">{{ table.capacity }} {{ content.seatsLabel || 'Plätze' }}</div>
                    <div class="lv-table-guests">
                      <!-- Seats -->
                      <div 
                        v-for="seat in getTableSeats(table.id)" 
                        :key="seat.id"
                        class="lv-seat" 
                        :class="{ 'lv-seat-occupied': seat.guest_id }"
                        :data-seat-id="seat.id"
                        :data-guest-id="seat.guest_id"
                        @click="openGuestAssignment(seat)">
                        <div class="lv-seat-number">{{ seat.number }}</div>
                        <div v-if="seat.guest_id" class="lv-seat-guest">
                          {{ getGuestName(seat.guest_id) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Room Elements -->
                  <div 
                    v-for="element in roomElements" 
                    :key="element.id"
                    class="lv-room-element" 
                    :class="'lv-' + element.type"
                    :style="{ left: element.position_x + 'px', top: element.position_y + 'px' }"
                    :data-element-id="element.id"
                    @mousedown="startDrag($event, element)">
                    <div class="lv-element-label">{{ element.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Table Properties Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-active': showTablePropertiesModal }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.tablePropertiesTitle || 'Tischeigenschaften' }}</h3>
            <button class="lv-modal-close" @click="closeTablePropertiesModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <form @submit.prevent="saveTableProperties">
              <input type="hidden" v-model="editingTable.id">
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.tableNameLabel || 'Tischname/Nummer' }}</label>
                <input 
                  type="text" 
                  class="lv-form-control" 
                  v-model="editingTable.number"
                  :placeholder="content.tableNamePlaceholder || 'z.B. 1, 2, A, B oder \'Brautpaar\''"
                >
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.tableCapacityLabel || 'Kapazität' }}</label>
                <select class="lv-form-control" v-model="editingTable.capacity">
                  <option v-for="(option, index) in content.capacityOptions" :key="index" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.tableColorLabel || 'Tischfarbe' }}</label>
                <div class="lv-color-picker">
                  <div 
                    v-for="(color, index) in content.tableColors" 
                    :key="index"
                    class="lv-color-option" 
                    :class="{ 'lv-color-active': editingTable.color === color }"
                    :style="{ backgroundColor: color }"
                    @click="editingTable.color = color">
                  </div>
                </div>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.tableNotesLabel || 'Tischnotizen' }}</label>
                <textarea 
                  class="lv-form-control" 
                  v-model="editingTable.notes"
                  rows="3"
                  :placeholder="content.tableNotesPlaceholder || 'Zusätzliche Informationen zum Tisch'">
                </textarea>
              </div>
            </form>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeTablePropertiesModal">
              {{ content.cancelBtn || 'Abbrechen' }}
            </button>
            <button class="lv-btn lv-btn-primary" @click="saveTableProperties">
              {{ content.saveBtn || 'Speichern' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Guest Assignment Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-active': showGuestAssignmentModal }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.guestAssignmentTitle || 'Gast zuweisen' }}</h3>
            <button class="lv-modal-close" @click="closeGuestAssignmentModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <form @submit.prevent="saveGuestAssignment">
              <input type="hidden" v-model="editingSeat.id">
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.selectGuestLabel || 'Gast auswählen' }}</label>
                <select class="lv-form-control" v-model="editingSeat.guest_id">
                  <option value="">{{ content.selectGuestPlaceholder || '-- Bitte wählen --' }}</option>
                  <option 
                    v-for="guest in availableGuests" 
                    :key="guest.id" 
                    :value="guest.id">
                    {{ guest.name }}
                  </option>
                </select>
              </div>
              <div class="lv-form-group">
                <label class="lv-form-label">{{ content.seatNotesLabel || 'Sitzplatznotizen' }}</label>
                <textarea 
                  class="lv-form-control" 
                  v-model="editingSeat.notes"
                  rows="3"
                  :placeholder="content.seatNotesPlaceholder || 'Besondere Anforderungen oder Notizen'">
                </textarea>
              </div>
            </form>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeGuestAssignmentModal">
              {{ content.cancelBtn || 'Abbrechen' }}
            </button>
            <button class="lv-btn lv-btn-primary" @click="saveGuestAssignment">
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
      // Supabase client (will be initialized in mounted)
      supabase: null,
      weddingId: null,
      
      // Tables data
      tables: [],
      seats: [],
      roomElements: [],
      guests: [],
      
      // UI state
      tableSize: 'medium',
      selectedColor: '#ffffff',
      guestSearch: '',
      guestFilter: 'all',
      zoomLevel: 1,
      
      // Drag and drop
      isDragging: false,
      draggedElement: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      
      // Modals
      showTablePropertiesModal: false,
      showGuestAssignmentModal: false,
      editingTable: {
        id: '',
        number: '',
        type: 'round',
        capacity: 8,
        color: '#ffffff',
        notes: ''
      },
      editingSeat: {
        id: '',
        table_id: '',
        number: 0,
        guest_id: '',
        notes: ''
      }
    };
  },
  computed: {
    totalGuests() {
      return this.guests.length;
    },
    seatedGuests() {
      return this.seats.filter(seat => seat.guest_id).length;
    },
    unseatedGuests() {
      return this.totalGuests - this.seatedGuests;
    },
    filteredGuests() {
      let filtered = [...this.guests];
      
      // Apply search filter
      if (this.guestSearch) {
        const query = this.guestSearch.toLowerCase();
        filtered = filtered.filter(guest => 
          guest.name.toLowerCase().includes(query)
        );
      }
      
      // Apply unassigned filter
      if (this.guestFilter === 'unassigned') {
        const assignedGuestIds = this.seats
          .filter(seat => seat.guest_id)
          .map(seat => seat.guest_id);
        
        filtered = filtered.filter(guest => !assignedGuestIds.includes(guest.id));
      }
      
      return filtered;
    },
    availableGuests() {
      // For guest assignment modal - show all guests or only unassigned ones
      const assignedGuestIds = this.seats
        .filter(seat => seat.guest_id && seat.id !== this.editingSeat.id)
        .map(seat => seat.guest_id);
      
      return this.guests.filter(guest => 
        !assignedGuestIds.includes(guest.id) || guest.id === this.editingSeat.guest_id
      );
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
        this.loadTables(),
        this.loadSeats(),
        this.loadRoomElements(),
        this.loadGuests()
      ]);
    }
    
    // Set up event listeners for drag and drop
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  },
  beforeDestroy() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
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
    
    async loadTables() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('tables')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.tables = data || [];
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    },
    
    async loadSeats() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get all seats for tables in this wedding
        const { data: tableIds } = await this.supabase
          .from('tables')
          .select('id')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (!tableIds || tableIds.length === 0) {
          this.seats = [];
          return;
        }
        
        const ids = tableIds.map(t => t.id);
        
        const { data, error } = await this.supabase
          .from('seats')
          .select('*')
          .in('table_id', ids)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.seats = data || [];
      } catch (error) {
        console.error('Error loading seats:', error);
      }
    },
    
    async loadRoomElements() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('room_elements')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.roomElements = data || [];
      } catch (error) {
        console.error('Error loading room elements:', error);
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
    
    // Table Operations
    async addTable(type) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get capacity based on table size
        const capacityMap = {
          small: 6,
          medium: 8,
          large: 10,
          xl: 12
        };
        
        const capacity = capacityMap[this.tableSize] || 8;
        
        // Calculate position (center of floor plan)
        const floorPlan = this.$refs.floorPlan;
        const centerX = floorPlan ? floorPlan.clientWidth / 2 : 300;
        const centerY = floorPlan ? floorPlan.clientHeight / 2 : 200;
        
        // Create new table
        const { data, error } = await this.supabase
          .from('tables')
          .insert([{
            wedding_id: this.weddingId,
            number: `Tisch ${this.tables.length + 1}`,
            type: type,
            capacity: capacity,
            color: this.selectedColor,
            position_x: centerX,
            position_y: centerY
          }])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add table to local state
          this.tables.push(data[0]);
          
          // Create seats for the table
          await this.createSeatsForTable(data[0].id, capacity);
        }
      } catch (error) {
        console.error('Error adding table:', error);
      }
    },
    
    async createSeatsForTable(tableId, capacity) {
      try {
        if (!this.supabase) return;
        
        // Create seats array
        const seatsToCreate = [];
        for (let i = 1; i <= capacity; i++) {
          seatsToCreate.push({
            table_id: tableId,
            number: i
          });
        }
        
        // Insert seats
        const { data, error } = await this.supabase
          .from('seats')
          .insert(seatsToCreate)
          .select();
        
        if (error) throw error;
        
        // Add seats to local state
        if (data) {
          this.seats = [...this.seats, ...data];
        }
      } catch (error) {
        console.error('Error creating seats:', error);
      }
    },
    
    async updateTablePosition(table) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('tables')
          .update({
            position_x: table.position_x,
            position_y: table.position_y
          })
          .eq('id', table.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating table position:', error);
      }
    },
    
    async saveTableProperties() {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('tables')
          .update({
            number: this.editingTable.number,
            capacity: this.editingTable.capacity,
            color: this.editingTable.color,
            notes: this.editingTable.notes
          })
          .eq('id', this.editingTable.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.tables.findIndex(t => t.id === this.editingTable.id);
        if (index !== -1) {
          this.tables[index] = {
            ...this.tables[index],
            number: this.editingTable.number,
            capacity: this.editingTable.capacity,
            color: this.editingTable.color,
            notes: this.editingTable.notes
          };
        }
        
        // Close modal
        this.closeTablePropertiesModal();
      } catch (error) {
        console.error('Error saving table properties:', error);
      }
    },
    
    // Room Element Operations
    async addRoomElement(type) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get label based on type
        const labelMap = {
          danceFloor: this.content.danceFloorLabel || 'Tanzfläche',
          bar: this.content.barLabel || 'Bar',
          stage: this.content.stageLabel || 'Bühne'
        };
        
        // Calculate position (center of floor plan)
        const floorPlan = this.$refs.floorPlan;
        const centerX = floorPlan ? floorPlan.clientWidth / 2 : 300;
        const centerY = floorPlan ? floorPlan.clientHeight / 2 : 200;
        
        // Create new room element
        const { data, error } = await this.supabase
          .from('room_elements')
          .insert([{
            wedding_id: this.weddingId,
            type: type,
            label: labelMap[type] || type,
            position_x: centerX,
            position_y: centerY,
            width: 100,
            height: 100
          }])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add room element to local state
          this.roomElements.push(data[0]);
        }
      } catch (error) {
        console.error('Error adding room element:', error);
      }
    },
    
    async updateRoomElementPosition(element) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('room_elements')
          .update({
            position_x: element.position_x,
            position_y: element.position_y
          })
          .eq('id', element.id);
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating room element position:', error);
      }
    },
    
    // Guest Assignment Operations
    async saveGuestAssignment() {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('seats')
          .update({
            guest_id: this.editingSeat.guest_id || null,
            notes: this.editingSeat.notes
          })
          .eq('id', this.editingSeat.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.seats.findIndex(s => s.id === this.editingSeat.id);
        if (index !== -1) {
          this.seats[index] = {
            ...this.seats[index],
            guest_id: this.editingSeat.guest_id || null,
            notes: this.editingSeat.notes
          };
        }
        
        // Close modal
        this.closeGuestAssignmentModal();
      } catch (error) {
        console.error('Error saving guest assignment:', error);
      }
    },
    
    // UI Interaction Methods
    selectColor(color) {
      this.selectedColor = color;
    },
    
    setGuestFilter(filter) {
      this.guestFilter = filter;
    },
    
    zoomIn() {
      if (this.zoomLevel < 2) {
        this.zoomLevel += 0.1;
      }
    },
    
    zoomOut() {
      if (this.zoomLevel > 0.5) {
        this.zoomLevel -= 0.1;
      }
    },
    
    resetView() {
      this.zoomLevel = 1;
    },
    
    openTableProperties(table) {
      this.editingTable = { ...table };
      this.showTablePropertiesModal = true;
    },
    
    closeTablePropertiesModal() {
      this.showTablePropertiesModal = false;
    },
    
    openGuestAssignment(seat) {
      this.editingSeat = { ...seat };
      this.showGuestAssignmentModal = true;
    },
    
    closeGuestAssignmentModal() {
      this.showGuestAssignmentModal = false;
    },
    
    // Drag and Drop
    startDrag(event, element) {
      this.isDragging = true;
      this.draggedElement = element;
      
      const rect = event.target.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      
      event.preventDefault();
    },
    
    onMouseMove(event) {
      if (!this.isDragging || !this.draggedElement) return;
      
      const floorPlan = this.$refs.floorPlan;
      if (!floorPlan) return;
      
      const rect = floorPlan.getBoundingClientRect();
      const x = event.clientX - rect.left - this.dragOffsetX;
      const y = event.clientY - rect.top - this.dragOffsetY;
      
      // Update element position
      if (this.draggedElement.type) {
        // It's a table
        const tableIndex = this.tables.findIndex(t => t.id === this.draggedElement.id);
        if (tableIndex !== -1) {
          this.tables[tableIndex].position_x = x;
          this.tables[tableIndex].position_y = y;
        }
      } else {
        // It's a room element
        const elementIndex = this.roomElements.findIndex(e => e.id === this.draggedElement.id);
        if (elementIndex !== -1) {
          this.roomElements[elementIndex].position_x = x;
          this.roomElements[elementIndex].position_y = y;
        }
      }
    },
    
    async onMouseUp() {
      if (!this.isDragging || !this.draggedElement) return;
      
      // Save position to database
      if (this.draggedElement.type) {
        // It's a table
        await this.updateTablePosition(this.draggedElement);
      } else {
        // It's a room element
        await this.updateRoomElementPosition(this.draggedElement);
      }
      
      this.isDragging = false;
      this.draggedElement = null;
    },
    
    dragStart(event, guest) {
      event.dataTransfer.setData('guest-id', guest.id);
    },
    
    dragOver(event) {
      event.preventDefault();
    },
    
    async drop(event) {
      event.preventDefault();
      
      const guestId = event.dataTransfer.getData('guest-id');
      if (!guestId) return;
      
      // Find closest empty seat
      const seats = this.seats.filter(seat => !seat.guest_id);
      if (seats.length === 0) return;
      
      // Assign guest to first available seat
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('seats')
          .update({ guest_id: guestId })
          .eq('id', seats[0].id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.seats.findIndex(s => s.id === seats[0].id);
        if (index !== -1) {
          this.seats[index].guest_id = guestId;
        }
      } catch (error) {
        console.error('Error assigning guest to seat:', error);
      }
    },
    
    // Helper Methods
    getTableSeats(tableId) {
      return this.seats.filter(seat => seat.table_id === tableId);
    },
    
    getGuestName(guestId) {
      const guest = this.guests.find(g => g.id === guestId);
      return guest ? guest.name : '';
    },
    
    async deleteSelected() {
      // Not implemented yet
      alert(this.content.deleteSelectedMessage || 'Ausgewähltes Element löschen');
    },
    
    async clearAll() {
      if (!confirm(this.content.clearAllConfirmMessage || 'Möchten Sie wirklich alle Elemente zurücksetzen?')) {
        return;
      }
      
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Clear all seats
        await this.supabase
          .from('seats')
          .update({ is_active: false })
          .in('table_id', this.tables.map(t => t.id));
        
        // Clear all tables
        await this.supabase
          .from('tables')
          .update({ is_active: false })
          .eq('wedding_id', this.weddingId);
        
        // Clear all room elements
        await this.supabase
          .from('room_elements')
          .update({ is_active: false })
          .eq('wedding_id', this.weddingId);
        
        // Clear local state
        this.tables = [];
        this.seats = [];
        this.roomElements = [];
      } catch (error) {
        console.error('Error clearing all elements:', error);
      }
    },
    
    async saveLayout() {
      // Just show a message for now
      alert(this.content.saveLayoutMessage || 'Layout gespeichert');
    },
    
    printLayout() {
      // Just show a message for now
      alert(this.content.printLayoutMessage || 'Druckansicht wird geöffnet');
    }
  }
};
</script>

<style>
.lv-table-planner {
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

.lv-col-md-3 {
  flex: 0 0 25%;
  max-width: 25%;
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

.lv-p-3 {
  padding: 15px;
}

.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.lv-card-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.lv-btn-group {
  display: flex;
  gap: 5px;
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

.lv-guest-filter {
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

.lv-guest-list {
  max-height: 300px;
  overflow-y: auto;
}

.lv-guest-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: grab;
}

.lv-guest-item:hover {
  background-color: #f8f9fa;
}

.lv-guest-name {
  font-weight: 500;
}

.lv-guest-info {
  font-size: 12px;
  color: #666;
}

.lv-floor-plan-container {
  height: 600px;
}

.lv-floor-plan {
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #f8f9fa;
  border: 1px solid #eee;
  transform-origin: top left;
}

.lv-view-controls {
  display: flex;
  gap: 5px;
}

.lv-table {
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #fff;
  border: 2px solid #333;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
}

.lv-table-rect {
  border-radius: 4px;
}

.lv-table-oval {
  border-radius: 50% / 30%;
}

.lv-table-number {
  font-weight: bold;
}

.lv-table-capacity {
  font-size: 12px;
}

.lv-table-guests {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  margin-top: 5px;
}

.lv-seat {
  width: 20px;
  height: 20px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  cursor: pointer;
}

.lv-seat-occupied {
  background-color: #28a745;
  color: white;
}

.lv-room-element {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
}

.lv-danceFloor {
  width: 150px;
  height: 150px;
  background-color: rgba(0, 123, 255, 0.2);
  border: 2px dashed #007bff;
}

.lv-bar {
  width: 100px;
  height: 50px;
  background-color: rgba(255, 193, 7, 0.2);
  border: 2px solid #ffc107;
}

.lv-stage {
  width: 150px;
  height: 80px;
  background-color: rgba(108, 117, 125, 0.2);
  border: 2px solid #6c757d;
}

.lv-element-label {
  font-size: 12px;
  font-weight: 500;
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

.lv-modal-active {
  display: flex;
}

.lv-modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: 30px auto;
}

.lv-modal-sm {
  max-width: 300px;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-3, .lv-col-md-6, .lv-col-md-9 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .lv-floor-plan-container {
    height: 400px;
  }
  
  .lv-floor-plan {
    height: 300px;
  }
}
</style>
