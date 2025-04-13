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
                    <div class="lv-stat-value">{{ content.totalGuests || '120' }}</div>
                    <div class="lv-stat-label">{{ content.totalGuestsLabel || 'Gäste gesamt' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-success">{{ content.seatedGuests || '85' }}</div>
                    <div class="lv-stat-label">{{ content.seatedGuestsLabel || 'Platziert' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value lv-text-warning">{{ content.unseatedGuests || '35' }}</div>
                    <div class="lv-stat-label">{{ content.unseatedGuestsLabel || 'Nicht platziert' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ content.totalTables || '12' }}</div>
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
                    :style="{ left: table.left + 'px', top: table.top + 'px', backgroundColor: table.color }"
                    :data-table-id="table.id"
                    @mousedown="startDrag($event, table)"
                    @dblclick="openTableProperties(table)">
                    <div class="lv-table-number">{{ table.number }}</div>
                    <div class="lv-table-capacity">{{ table.capacity }} {{ content.seatsLabel || 'Plätze' }}</div>
                    <div class="lv-table-guests">
                      <!-- Seats -->
                      <div 
                        v-for="seat in table.seats" 
                        :key="seat.id"
                        class="lv-seat" 
                        :class="{ 'lv-seat-occupied': seat.guestId }"
                        :data-seat-id="seat.id"
                        :data-guest-id="seat.guestId"
                        @click="openGuestAssignment(seat)">
                        <div class="lv-seat-number">{{ seat.number }}</div>
                        <div v-if="seat.guestId" class="lv-seat-guest">
                          {{ getGuestName(seat.guestId) }}
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
                    :style="{ left: element.left + 'px', top: element.top + 'px' }"
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
                <select class="lv-form-control" v-model="editingSeat.guestId">
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
      // Table planner state
      tables: [],
      roomElements: [],
      guests: [],
      
      // UI state
      tableSize: 'medium',
      selectedColor: '#ffffff',
      guestSearch: '',
      guestFilter: 'unassigned',
      zoomLevel: 1,
      
      // Drag and drop state
      isDragging: false,
      draggedItem: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      
      // Modal state
      showTablePropertiesModal: false,
      showGuestAssignmentModal: false,
      editingTable: {
        id: '',
        number: '',
        capacity: 8,
        color: '#ffffff',
        notes: ''
      },
      editingSeat: {
        id: '',
        guestId: '',
        notes: ''
      }
    };
  },
  computed: {
    filteredGuests() {
      let result = this.guests;
      
      // Apply search filter
      if (this.guestSearch) {
        const search = this.guestSearch.toLowerCase();
        result = result.filter(guest => 
          guest.name.toLowerCase().includes(search) || 
          guest.info.toLowerCase().includes(search)
        );
      }
      
      // Apply assignment filter
      if (this.guestFilter === 'unassigned') {
        result = result.filter(guest => !this.isGuestAssigned(guest.id));
      }
      
      return result;
    },
    availableGuests() {
      // Return all guests that are not assigned to any seat
      // plus the guest currently assigned to the editing seat
      return this.guests.filter(guest => 
        !this.isGuestAssigned(guest.id) || guest.id === this.editingSeat.guestId
      );
    }
  },
  mounted() {
    // Initialize with sample data
    this.initializeSampleData();
    
    // Add event listeners for drag operations
    document.addEventListener('mousemove', this.drag);
    document.addEventListener('mouseup', this.endDrag);
  },
  beforeDestroy() {
    // Remove event listeners
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this.endDrag);
  },
  methods: {
    initializeSampleData() {
      // Initialize sample guests
      this.guests = [
        { id: '1', name: 'Anna Schmidt', info: 'Familie der Braut' },
        { id: '2', name: 'Thomas Müller', info: 'Familie des Bräutigams' },
        { id: '3', name: 'Julia Weber', info: 'Freundin der Braut' },
        { id: '4', name: 'Michael Schneider', info: 'Freund des Bräutigams' },
        { id: '5', name: 'Sarah Fischer', info: 'Kollegin der Braut' },
        { id: '6', name: 'Markus Wagner', info: 'Kollege des Bräutigams' },
        { id: '7', name: 'Laura Becker', info: 'Cousine der Braut' },
        { id: '8', name: 'Daniel Hoffmann', info: 'Cousin des Bräutigams' }
      ];
      
      // Initialize sample tables
      this.tables = [
        {
          id: '1',
          type: 'round',
          number: '1',
          capacity: 8,
          color: '#ffffff',
          left: 100,
          top: 150,
          notes: '',
          seats: this.generateSeats('1', 8)
        },
        {
          id: '2',
          type: 'rect',
          number: '2',
          capacity: 8,
          color: '#ffffff',
          left: 300,
          top: 150,
          notes: '',
          seats: this.generateSeats('2', 8)
        }
      ];
      
      // Initialize sample room elements
      this.roomElements = [
        {
          id: 'df1',
          type: 'dance-floor',
          label: this.content.danceFloorLabel || 'Tanzfläche',
          left: 200,
          top: 300
        }
      ];
    },
    generateSeats(tableId, count) {
      const seats = [];
      for (let i = 1; i <= count; i++) {
        seats.push({
          id: `${tableId}-${i}`,
          number: i,
          guestId: '',
          notes: ''
        });
      }
      return seats;
    },
    addTable(type) {
      const tableId = `table-${Date.now()}`;
      const capacity = this.getCapacityFromSize(this.tableSize);
      
      const newTable = {
        id: tableId,
        type: type,
        number: (this.tables.length + 1).toString(),
        capacity: capacity,
        color: this.selectedColor,
        left: 100,
        top: 100,
        notes: '',
        seats: this.generateSeats(tableId, capacity)
      };
      
      this.tables.push(newTable);
    },
    getCapacityFromSize(size) {
      switch (size) {
        case 'small': return 6;
        case 'medium': return 8;
        case 'large': return 10;
        case 'xl': return 12;
        default: return 8;
      }
    },
    addRoomElement(type) {
      const elementId = `${type}-${Date.now()}`;
      let label = '';
      
      switch (type) {
        case 'danceFloor':
          label = this.content.danceFloorLabel || 'Tanzfläche';
          type = 'dance-floor';
          break;
        case 'bar':
          label = this.content.barLabel || 'Bar';
          break;
        case 'stage':
          label = this.content.stageLabel || 'Bühne';
          break;
      }
      
      const newElement = {
        id: elementId,
        type: type,
        label: label,
        left: 100,
        top: 100
      };
      
      this.roomElements.push(newElement);
    },
    selectColor(color) {
      this.selectedColor = color;
    },
    setGuestFilter(filter) {
      this.guestFilter = filter;
    },
    isGuestAssigned(guestId) {
      // Check if guest is assigned to any seat
      for (const table of this.tables) {
        for (const seat of table.seats) {
          if (seat.guestId === guestId) {
            return true;
          }
        }
      }
      return false;
    },
    getGuestName(guestId) {
      const guest = this.guests.find(g => g.id === guestId);
      return guest ? guest.name : '';
    },
    // Drag and drop for tables and room elements
    startDrag(event, item) {
      this.isDragging = true;
      this.draggedItem = item;
      
      const rect = event.target.getBoundingClientRect();
      this.dragOffsetX = event.clientX - rect.left;
      this.dragOffsetY = event.clientY - rect.top;
      
      event.preventDefault();
    },
    drag(event) {
      if (!this.isDragging || !this.draggedItem) return;
      
      const floorPlan = this.$refs.floorPlan;
      const rect = floorPlan.getBoundingClientRect();
      
      // Calculate new position, accounting for zoom level
      const newLeft = (event.clientX - rect.left - this.dragOffsetX) / this.zoomLevel;
      const newTop = (event.clientY - rect.top - this.dragOffsetY) / this.zoomLevel;
      
      // Update position
      this.draggedItem.left = Math.max(0, newLeft);
      this.draggedItem.top = Math.max(0, newTop);
      
      event.preventDefault();
    },
    endDrag() {
      this.isDragging = false;
      this.draggedItem = null;
    },
    // Drag and drop for guests
    dragStart(event, guest) {
      event.dataTransfer.setData('guest-id', guest.id);
    },
    dragOver(event) {
      event.preventDefault();
    },
    drop(event) {
      const guestId = event.dataTransfer.getData('guest-id');
      if (!guestId) return;
      
      // Find the seat element that received the drop
      let seatElement = event.target;
      while (seatElement && !seatElement.dataset.seatId) {
        seatElement = seatElement.parentElement;
      }
      
      if (seatElement && seatElement.dataset.seatId) {
        // Find the seat in our data model
        const seatId = seatElement.dataset.seatId;
        for (const table of this.tables) {
          const seat = table.seats.find(s => s.id === seatId);
          if (seat) {
            // Assign guest to seat
            seat.guestId = guestId;
            break;
          }
        }
      }
    },
    // Zoom controls
    zoomIn() {
      this.zoomLevel = Math.min(2, this.zoomLevel + 0.1);
    },
    zoomOut() {
      this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.1);
    },
    resetView() {
      this.zoomLevel = 1;
    },
    // Table properties modal
    openTableProperties(table) {
      this.editingTable = { ...table };
      this.showTablePropertiesModal = true;
    },
    closeTablePropertiesModal() {
      this.showTablePropertiesModal = false;
    },
    saveTableProperties() {
      // Find the table in our data model and update it
      const table = this.tables.find(t => t.id === this.editingTable.id);
      if (table) {
        table.number = this.editingTable.number;
        table.capacity = this.editingTable.capacity;
        table.color = this.editingTable.color;
        table.notes = this.editingTable.notes;
        
        // Update seats if capacity changed
        if (table.seats.length !== table.capacity) {
          // Keep existing seat assignments if possible
          const existingSeats = table.seats;
          table.seats = this.generateSeats(table.id, table.capacity);
          
          // Restore guest assignments for seats that still exist
          for (let i = 0; i < Math.min(existingSeats.length, table.seats.length); i++) {
            table.seats[i].guestId = existingSeats[i].guestId;
            table.seats[i].notes = existingSeats[i].notes;
          }
        }
      }
      
      this.closeTablePropertiesModal();
    },
    // Guest assignment modal
    openGuestAssignment(seat) {
      this.editingSeat = { ...seat };
      this.showGuestAssignmentModal = true;
    },
    closeGuestAssignmentModal() {
      this.showGuestAssignmentModal = false;
    },
    saveGuestAssignment() {
      // Find the seat in our data model and update it
      for (const table of this.tables) {
        const seat = table.seats.find(s => s.id === this.editingSeat.id);
        if (seat) {
          seat.guestId = this.editingSeat.guestId;
          seat.notes = this.editingSeat.notes;
          break;
        }
      }
      
      this.closeGuestAssignmentModal();
    },
    // Action buttons
    deleteSelected() {
      // In a real implementation, this would delete the selected item
      alert(this.content.deleteSelectedMessage || 'Ausgewähltes Element löschen');
    },
    clearAll() {
      if (confirm(this.content.clearAllConfirmMessage || 'Möchten Sie wirklich alle Elemente zurücksetzen?')) {
        this.tables = [];
        this.roomElements = [];
      }
    },
    saveLayout() {
      // In a real implementation, this would save the layout to the server
      alert(this.content.saveLayoutMessage || 'Layout gespeichert');
    },
    printLayout() {
      // In a real implementation, this would open a print dialog
      alert(this.content.printLayoutMessage || 'Druckansicht wird geöffnet');
    }
  }
};
</script>

<style scoped>
/* Table Planner styles */
.lv-table-planner {
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

.lv-mb-2 {
  margin-bottom: 0.5rem;
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
}

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
}

.lv-card-header {
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lv-card-header h3 {
  margin: 0;
  font-size: 1.25rem;
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

/* Control panel styles */
.lv-control-section {
  margin-bottom: 1.5rem;
}

.lv-control-section h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.lv-btn-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

.lv-btn-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.lv-btn-danger:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
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

/* Color picker styles */
.lv-color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lv-color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.lv-color-active {
  border-color: #f8c630;
}

/* Guest list styles */
.lv-search-container {
  margin-left: auto;
}

.lv-search-input {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.lv-guest-filter {
  display: flex;
  gap: 0.5rem;
}

.lv-filter-btn {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.lv-filter-active {
  border-bottom-color: #f8c630;
  font-weight: 500;
}

.lv-guest-list {
  max-height: 300px;
  overflow-y: auto;
}

.lv-guest-item {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  cursor: grab;
}

.lv-guest-item:last-child {
  border-bottom: none;
}

.lv-guest-name {
  font-weight: 500;
}

.lv-guest-info {
  font-size: 0.875rem;
  color: #666;
}

/* Floor plan styles */
.lv-floor-plan-container {
  height: 100%;
}

.lv-view-controls {
  display: flex;
  gap: 0.25rem;
}

.lv-floor-plan {
  position: relative;
  width: 100%;
  height: 600px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  overflow: auto;
  transform-origin: top left;
}

/* Table styles */
.lv-table {
  position: absolute;
  cursor: move;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
}

.lv-table-round {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.lv-table-rect {
  width: 200px;
  height: 100px;
  border-radius: 4px;
}

.lv-table-oval {
  width: 180px;
  height: 120px;
  border-radius: 50%;
}

.lv-table-number {
  font-weight: 700;
  font-size: 1.25rem;
}

.lv-table-capacity {
  font-size: 0.875rem;
  color: #666;
}

.lv-table-guests {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Seat styles */
.lv-seat {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lv-seat-occupied {
  background-color: #e9f8f2;
  border-color: #06D6A0;
}

.lv-seat-number {
  font-size: 0.75rem;
  color: #666;
}

.lv-seat-guest {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.75rem;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0.1rem 0.25rem;
  border-radius: 2px;
}

/* Round table seat positioning */
.lv-table-round .lv-seat:nth-child(1) { top: 0; left: 50%; transform: translateX(-50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(2) { top: 14.6%; right: 14.6%; transform: translateX(50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(3) { top: 50%; right: 0; transform: translateX(50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(4) { bottom: 14.6%; right: 14.6%; transform: translateX(50%) translateY(50%); }
.lv-table-round .lv-seat:nth-child(5) { bottom: 0; left: 50%; transform: translateX(-50%) translateY(50%); }
.lv-table-round .lv-seat:nth-child(6) { bottom: 14.6%; left: 14.6%; transform: translateX(-50%) translateY(50%); }
.lv-table-round .lv-seat:nth-child(7) { top: 50%; left: 0; transform: translateX(-50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(8) { top: 14.6%; left: 14.6%; transform: translateX(-50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(9) { top: 7%; left: 50%; transform: translateX(-50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(10) { top: 50%; right: 7%; transform: translateX(50%) translateY(-50%); }
.lv-table-round .lv-seat:nth-child(11) { bottom: 7%; left: 50%; transform: translateX(-50%) translateY(50%); }
.lv-table-round .lv-seat:nth-child(12) { top: 50%; left: 7%; transform: translateX(-50%) translateY(-50%); }

/* Rectangular table seat positioning */
.lv-table-rect .lv-seat:nth-child(1) { top: -15px; left: 25%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(2) { top: -15px; left: 50%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(3) { top: -15px; left: 75%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(4) { bottom: -15px; left: 75%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(5) { bottom: -15px; left: 50%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(6) { bottom: -15px; left: 25%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(7) { top: 50%; left: -15px; transform: translateY(-50%); }
.lv-table-rect .lv-seat:nth-child(8) { top: 50%; right: -15px; transform: translateY(-50%); }
.lv-table-rect .lv-seat:nth-child(9) { top: -15px; left: 12.5%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(10) { top: -15px; left: 87.5%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(11) { bottom: -15px; left: 87.5%; transform: translateX(-50%); }
.lv-table-rect .lv-seat:nth-child(12) { bottom: -15px; left: 12.5%; transform: translateX(-50%); }

/* Oval table seat positioning - similar to rectangular but with adjusted positions */
.lv-table-oval .lv-seat:nth-child(1) { top: -15px; left: 25%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(2) { top: -15px; left: 50%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(3) { top: -15px; left: 75%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(4) { bottom: -15px; left: 75%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(5) { bottom: -15px; left: 50%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(6) { bottom: -15px; left: 25%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(7) { top: 50%; left: -15px; transform: translateY(-50%); }
.lv-table-oval .lv-seat:nth-child(8) { top: 50%; right: -15px; transform: translateY(-50%); }
.lv-table-oval .lv-seat:nth-child(9) { top: -15px; left: 12.5%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(10) { top: -15px; left: 87.5%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(11) { bottom: -15px; left: 87.5%; transform: translateX(-50%); }
.lv-table-oval .lv-seat:nth-child(12) { bottom: -15px; left: 12.5%; transform: translateX(-50%); }

/* Room element styles */
.lv-room-element {
  position: absolute;
  cursor: move;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #aaa;
  text-align: center;
}

.lv-dance-floor {
  width: 150px;
  height: 150px;
  background-color: rgba(173, 216, 230, 0.3);
}

.lv-bar {
  width: 120px;
  height: 60px;
  background-color: rgba(245, 222, 179, 0.3);
  border-radius: 4px;
}

.lv-stage {
  width: 180px;
  height: 80px;
  background-color: rgba(211, 211, 211, 0.3);
  border-radius: 4px;
}

.lv-element-label {
  font-size: 0.875rem;
  color: #666;
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

@media (max-width: 768px) {
  .lv-stats-container {
    flex-direction: column;
    align-items: center;
  }
  
  .lv-stat-item {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .lv-floor-plan {
    height: 400px;
  }
}
</style>
