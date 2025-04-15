// Enhanced TablePlanner Component for WeWeb
// This file contains the enhanced table planner functionality with 3D preview and advanced features

import Vue from 'vue';
import interact from 'interactjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { SupabaseClient } from '@supabase/supabase-js';

export default {
  name: 'EnhancedTablePlanner',
  
  props: {
    // WeWeb component properties
    supabaseUrl: {
      type: String,
      default: ''
    },
    supabaseKey: {
      type: String,
      default: ''
    },
    weddingId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: '2d', // '2d' or '3d'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    theme: {
      type: Object,
      default: () => ({
        primaryColor: '#4285F4',
        secondaryColor: '#EA4335',
        accentColor: '#FBBC05',
        backgroundColor: '#FFFFFF',
        textColor: '#333333'
      })
    }
  },
  
  data() {
    return {
      // Supabase client
      supabase: null,
      
      // Loading state
      loading: true,
      
      // Tools
      tools: [
        { id: 'select', label: 'Auswählen', icon: '👆' },
        { id: 'round-table', label: 'Runder Tisch', icon: '⭕' },
        { id: 'rectangular-table', label: 'Rechteckiger Tisch', icon: '🔲' },
        { id: 'oval-table', label: 'Ovaler Tisch', icon: '🔶' },
        { id: 'dance-floor', label: 'Tanzfläche', icon: '💃' },
        { id: 'stage', label: 'Bühne', icon: '🎭' },
        { id: 'bar', label: 'Bar', icon: '🍸' },
        { id: 'entrance', label: 'Eingang', icon: '🚪' },
        { id: 'wall', label: 'Wand', icon: '🧱' },
        { id: 'plant', label: 'Pflanze', icon: '🌿' },
        { id: 'custom', label: 'Benutzerdefiniert', icon: '✏️' }
      ],
      currentTool: 'select',
      
      // Canvas items (tables, dance floor, etc.)
      canvasItems: [],
      selectedItemIndex: null,
      selectedSeatIndex: null,
      
      // Room dimensions
      roomWidth: 1000,
      roomHeight: 800,
      roomName: 'Hochzeitssaal',
      
      // Guests
      guests: [],
      guestSearch: '',
      
      // 3D view
      threeScene: null,
      threeCamera: null,
      threeRenderer: null,
      threeControls: null,
      threeObjects: {},
      
      // UI state
      viewMode: '2d', // '2d' or '3d'
      sidebarTab: 'items', // 'items', 'guests', 'settings'
      showGrid: true,
      snapToGrid: true,
      gridSize: 20,
      
      // Undo/Redo
      history: [],
      historyIndex: -1,
      
      // Auto-save
      autoSaveInterval: null,
      lastSaved: null,
      
      // Templates
      templates: [
        { 
          id: 'wedding-50',
          name: 'Hochzeit (50 Gäste)',
          description: 'Standardlayout für eine Hochzeit mit 50 Gästen',
          thumbnail: 'wedding-50.jpg'
        },
        { 
          id: 'wedding-100',
          name: 'Hochzeit (100 Gäste)',
          description: 'Standardlayout für eine Hochzeit mit 100 Gästen',
          thumbnail: 'wedding-100.jpg'
        },
        { 
          id: 'wedding-150',
          name: 'Hochzeit (150 Gäste)',
          description: 'Standardlayout für eine Hochzeit mit 150 Gästen',
          thumbnail: 'wedding-150.jpg'
        },
        { 
          id: 'u-shape',
          name: 'U-Form',
          description: 'Tische in U-Form angeordnet',
          thumbnail: 'u-shape.jpg'
        },
        { 
          id: 'theater',
          name: 'Theater',
          description: 'Theaterartige Anordnung mit Bühne',
          thumbnail: 'theater.jpg'
        }
      ],
      
      // Table styles
      tableStyles: [
        {
          id: 'classic',
          name: 'Klassisch',
          description: 'Klassische Tische in Weiß',
          preview: 'table-classic.jpg'
        },
        {
          id: 'rustic',
          name: 'Rustikal',
          description: 'Rustikale Holztische',
          preview: 'table-rustic.jpg'
        },
        {
          id: 'modern',
          name: 'Modern',
          description: 'Moderne Tische in Schwarz',
          preview: 'table-modern.jpg'
        },
        {
          id: 'elegant',
          name: 'Elegant',
          description: 'Elegante Tische mit Goldakzenten',
          preview: 'table-elegant.jpg'
        }
      ],
      selectedTableStyle: 'classic',
      
      // Collision detection
      collisionDetection: true,
      
      // Statistics
      stats: {
        totalGuests: 0,
        assignedGuests: 0,
        unassignedGuests: 0,
        totalTables: 0,
        totalSeats: 0,
        occupiedSeats: 0,
        emptySeats: 0
      },
      
      // Export options
      exportOptions: {
        format: 'pdf', // 'pdf', 'png', 'jpg'
        showGuestNames: true,
        showTableNumbers: true,
        showLegend: true,
        orientation: 'landscape', // 'portrait', 'landscape'
        paperSize: 'a4' // 'a4', 'letter', 'legal'
      },
      
      // Print options
      printOptions: {
        showGuestNames: true,
        showTableNumbers: true,
        includeGuestList: true,
        includeLegend: true
      },
      
      // Collaboration
      collaborators: [],
      
      // Notifications
      notifications: []
    };
  },
  
  computed: {
    // Filtered guests based on search
    filteredGuests() {
      if (!this.guestSearch) return this.guests;
      
      const search = this.guestSearch.toLowerCase();
      return this.guests.filter(guest => 
        guest.name.toLowerCase().includes(search) ||
        (guest.email && guest.email.toLowerCase().includes(search)) ||
        (guest.group && guest.group.toLowerCase().includes(search))
      );
    },
    
    // Tables only
    tables() {
      return this.canvasItems.filter(item => item.type.includes('table'));
    },
    
    // Room elements only
    roomElements() {
      return this.canvasItems.filter(item => !item.type.includes('table'));
    },
    
    // Guests by table
    guestsByTable() {
      const result = {};
      
      this.tables.forEach(table => {
        result[table.id] = this.guests.filter(guest => guest.tableId === table.id);
      });
      
      return result;
    },
    
    // Guests by status
    guestsByStatus() {
      return {
        confirmed: this.guests.filter(guest => guest.rsvp === 'confirmed'),
        pending: this.guests.filter(guest => guest.rsvp === 'pending'),
        declined: this.guests.filter(guest => guest.rsvp === 'declined')
      };
    },
    
    // Can undo
    canUndo() {
      return this.historyIndex > 0;
    },
    
    // Can redo
    canRedo() {
      return this.historyIndex < this.history.length - 1;
    },
    
    // Grid style
    gridStyle() {
      if (!this.showGrid) return {};
      
      return {
        backgroundSize: `${this.gridSize}px ${this.gridSize}px`,
        backgroundImage: `
          linear-gradient(to right, ${this.theme.primaryColor}10 1px, transparent 1px),
          linear-gradient(to bottom, ${this.theme.primaryColor}10 1px, transparent 1px)
        `
      };
    },
    
    // Current theme CSS variables
    themeStyles() {
      return {
        '--primary-color': this.theme.primaryColor,
        '--secondary-color': this.theme.secondaryColor,
        '--accent-color': this.theme.accentColor,
        '--background-color': this.theme.backgroundColor,
        '--text-color': this.theme.textColor
      };
    }
  },
  
  watch: {
    // Watch for prop changes
    weddingId: {
      handler(newVal) {
        if (newVal) {
          this.loadData();
        }
      },
      immediate: true
    },
    
    mode: {
      handler(newVal) {
        this.viewMode = newVal;
        
        if (newVal === '3d') {
          this.$nextTick(() => {
            this.init3DView();
          });
        }
      },
      immediate: true
    },
    
    // Watch for canvas changes to update 3D view
    canvasItems: {
      handler() {
        if (this.viewMode === '3d' && this.threeScene) {
          this.update3DView();
        }
        
        // Update statistics
        this.updateStatistics();
        
        // Add to history for undo/redo
        this.addToHistory();
      },
      deep: true
    },
    
    // Watch for guest changes
    guests: {
      handler() {
        // Update statistics
        this.updateStatistics();
      },
      deep: true
    }
  },
  
  created() {
    // Initialize Supabase client
    if (this.supabaseUrl && this.supabaseKey) {
      this.supabase = new SupabaseClient(this.supabaseUrl, this.supabaseKey);
    }
  },
  
  mounted() {
    // Initialize the component
    this.initialize();
    
    // Set up auto-save
    this.autoSaveInterval = setInterval(() => {
      this.autoSave();
    }, 30000); // Auto-save every 30 seconds
  },
  
  beforeDestroy() {
    // Clean up
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    // Clean up 3D view
    if (this.threeRenderer) {
      this.threeRenderer.dispose();
    }
  },
  
  methods: {
    // Initialize the component
    async initialize() {
      // Load data if wedding ID is provided
      if (this.weddingId) {
        await this.loadData();
      } else {
        // Create empty layout
        this.createEmptyLayout();
      }
      
      // Initialize drag and resize functionality
      this.$nextTick(() => {
        this.initDragAndResize();
      });
      
      // Initialize 3D view if in 3D mode
      if (this.viewMode === '3d') {
        this.$nextTick(() => {
          this.init3DView();
        });
      }
      
      // Add initial state to history
      this.addToHistory();
      
      // Set loading to false
      this.loading = false;
    },
    
    // Create empty layout
    createEmptyLayout() {
      this.canvasItems = [];
      this.guests = [];
    },
    
    // Load data from Supabase
    async loadData() {
      if (!this.supabase || !this.weddingId) return;
      
      try {
        // Load tables
        const { data: tables, error: tablesError } = await this.supabase
          .from('tables')
          .select('*')
          .eq('wedding_id', this.weddingId);
        
        if (tablesError) throw tablesError;
        
        // Load room elements
        const { data: elements, error: elementsError } = await this.supabase
          .from('room_elements')
          .select('*')
          .eq('wedding_id', this.weddingId);
        
        if (elementsError) throw elementsError;
        
        // Load guests
        const { data: guests, error: guestsError } = await this.supabase
          .from('guests')
          .select('*')
          .eq('wedding_id', this.weddingId);
        
        if (guestsError) throw guestsError;
        
        // Load room settings
        const { data: settings, error: settingsError } = await this.supabase
          .from('settings')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('type', 'table_planner')
          .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
        
        // Process tables
        this.canvasItems = [
          ...tables.map(table => ({
            id: table.id,
            type: table.type,
            x: table.position_x,
            y: table.position_y,
            width: table.width,
            height: table.height,
            rotation: table.rotation || 0,
            number: table.number,
            name: table.name,
            capacity: table.capacity,
            category: table.category,
            style: table.style || 'classic'
          })),
          ...elements.map(element => ({
            id: element.id,
            type: element.type,
            x: element.position_x,
            y: element.position_y,
            width: element.width,
            height: element.height,
            rotation: element.rotation || 0,
            name: element.name
          }))
        ];
        
        // Process guests
        this.guests = guests.map(guest => ({
          id: guest.id,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          rsvp: guest.rsvp_status,
          group: guest.group_name,
          tableId: guest.table_id,
          seatNumber: guest.seat_number,
          dietaryRestrictions: guest.dietary_restrictions,
          plusOne: guest.plus_one,
          notes: guest.notes
        }));
        
        // Process settings
        if (settings) {
          this.roomWidth = settings.room_width || 1000;
          this.roomHeight = settings.room_height || 800;
          this.roomName = settings.room_name || 'Hochzeitssaal';
          this.selectedTableStyle = settings.table_style || 'classic';
          this.showGrid = settings.show_grid !== undefined ? settings.show_grid : true;
          this.snapToGrid = settings.snap_to_grid !== undefined ? settings.snap_to_grid : true;
          this.gridSize = settings.grid_size || 20;
        }
        
        // Update statistics
        this.updateStatistics();
        
      } catch (error) {
        console.error('Error loading data:', error);
        this.addNotification({
          type: 'error',
          message: 'Fehler beim Laden der Daten: ' + error.message
        });
        
        // Create empty layout as fallback
        this.createEmptyLayout();
      }
    },
    
    // Save data to Supabase
    async saveData() {
      if (!this.supabase || !this.weddingId) return;
      
      try {
        // Start transaction
        const { error: transactionError } = await this.supabase.rpc('begin_transaction');
        if (transactionError) throw transactionError;
        
        // Save tables
        const tables = this.canvasItems.filter(item => item.type.includes('table')).map(table => ({
          id: table.id,
          wedding_id: this.weddingId,
          type: table.type,
          position_x: table.x,
          position_y: table.y,
          width: table.width,
          height: table.height,
          rotation: table.rotation || 0,
          number: table.number,
          name: table.name,
          capacity: table.capacity,
          category: table.category,
          style: table.style || 'classic'
        }));
        
        const { error: tablesError } = await this.supabase
          .from('tables')
          .upsert(tables);
        
        if (tablesError) throw tablesError;
        
        // Save room elements
        const elements = this.canvasItems.filter(item => !item.type.includes('table')).map(element => ({
          id: element.id,
          wedding_id: this.weddingId,
          type: element.type,
          position_x: element.x,
          position_y: element.y,
          width: element.width,
          height: element.height,
          rotation: element.rotation || 0,
          name: element.name
        }));
        
        const { error: elementsError } = await this.supabase
          .from('room_elements')
          .upsert(elements);
        
        if (elementsError) throw elementsError;
        
        // Save guests
        const guests = this.guests.map(guest => ({
          id: guest.id,
          wedding_id: this.weddingId,
          name: guest.name,
          email: guest.email,
          phone: guest.phone,
          rsvp_status: guest.rsvp,
          group_name: guest.group,
          table_id: guest.tableId,
          seat_number: guest.seatNumber,
          dietary_restrictions: guest.dietaryRestrictions,
          plus_one: guest.plusOne,
          notes: guest.notes
        }));
        
        const { error: guestsError } = await this.supabase
          .from('guests')
          .upsert(guests);
        
        if (guestsError) throw guestsError;
        
        // Save settings
        const settings = {
          wedding_id: this.weddingId,
          type: 'table_planner',
          room_width: this.roomWidth,
          room_height: this.roomHeight,
          room_name: this.roomName,
          table_style: this.selectedTableStyle,
          show_grid: this.showGrid,
          snap_to_grid: this.snapToGrid,
          grid_size: this.gridSize
        };
        
        const { error: settingsError } = await this.supabase
          .from('settings')
          .upsert(settings);
        
        if (settingsError) throw settingsError;
        
        // Commit transaction
        const { error: commitError } = await this.supabase.rpc('commit_transaction');
        if (commitError) throw commitError;
        
        // Update last saved timestamp
        this.lastSaved = new Date();
        
        // Add notification
        this.addNotification({
          type: 'success',
          message: 'Tischplan erfolgreich gespeichert'
        });
        
        return true;
      } catch (error) {
        console.error('Error saving data:', error);
        
        // Rollback transaction
        await this.supabase.rpc('rollback_transaction');
        
        this.addNotification({
          type: 'error',
          message: 'Fehler beim Speichern der Daten: ' + error.message
        });
        
        return false;
      }
    },
    
    // Auto-save
    async autoSave() {
      if (this.readOnly) return;
      
      await this.saveData();
    },
    
    // Tool selection
    selectTool(toolId) {
      this.currentTool = toolId;
    },
    
    // Canvas click handler
    handleCanvasClick(event) {
      // If select tool is active, deselect current item
      if (this.currentTool === 'select') {
        this.selectedItemIndex = null;
        this.selectedSeatIndex = null;
        return;
      }
      
      // If read-only mode, do nothing
      if (this.readOnly) return;
      
      // If a table or element tool is active, add new item
      if (this.currentTool !== 'select') {
        const canvasRect = this.$refs.canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        
        // Snap to grid if enabled
        const snappedX = this.snapToGrid ? Math.round(x / this.gridSize) * this.gridSize : x;
        const snappedY = this.snapToGrid ? Math.round(y / this.gridSize) * this.gridSize : y;
        
        let newItem = {
          id: this.generateId(),
          type: this.currentTool,
          x: snappedX,
          y: snappedY,
          rotation: 0
        };
        
        // Set dimensions based on type
        if (this.currentTool === 'round-table') {
          newItem.width = 120;
          newItem.height = 120;
          newItem.number = this.getNextTableNumber();
          newItem.capacity = 8;
          newItem.name = 'Tisch ' + newItem.number;
          newItem.category = 'family';
          newItem.style = this.selectedTableStyle;
        } else if (this.currentTool === 'rectangular-table') {
          newItem.width = 180;
          newItem.height = 100;
          newItem.number = this.getNextTableNumber();
          newItem.capacity = 6;
          newItem.name = 'Tisch ' + newItem.number;
          newItem.category = 'family';
          newItem.style = this.selectedTableStyle;
        } else if (this.currentTool === 'oval-table') {
          newItem.width = 160;
          newItem.height = 100;
          newItem.number = this.getNextTableNumber();
          newItem.capacity = 6;
          newItem.name = 'Tisch ' + newItem.number;
          newItem.category = 'family';
          newItem.style = this.selectedTableStyle;
        } else if (this.currentTool === 'dance-floor') {
          newItem.width = 200;
          newItem.height = 200;
          newItem.name = 'Tanzfläche';
        } else if (this.currentTool === 'stage') {
          newItem.width = 300;
          newItem.height = 100;
          newItem.name = 'Bühne';
        } else if (this.currentTool === 'bar') {
          newItem.width = 150;
          newItem.height = 80;
          newItem.name = 'Bar';
        } else if (this.currentTool === 'entrance') {
          newItem.width = 80;
          newItem.height = 40;
          newItem.name = 'Eingang';
        } else if (this.currentTool === 'wall') {
          newItem.width = 200;
          newItem.height = 20;
          newItem.name = 'Wand';
        } else if (this.currentTool === 'plant') {
          newItem.width = 60;
          newItem.height = 60;
          newItem.name = 'Pflanze';
        } else if (this.currentTool === 'custom') {
          newItem.width = 100;
          newItem.height = 100;
          newItem.name = 'Benutzerdefiniert';
          
          // Prompt for custom element name
          const customName = prompt('Name des benutzerdefinierten Elements:', 'Benutzerdefiniert');
          if (customName) {
            newItem.name = customName;
          }
        }
        
        // Check for collisions if enabled
        if (this.collisionDetection && this.checkCollision(newItem)) {
          this.addNotification({
            type: 'warning',
            message: 'Element kann nicht platziert werden: Kollision mit bestehendem Element'
          });
          return;
        }
        
        // Add new item
        this.canvasItems.push(newItem);
        
        // Select the new item
        this.selectedItemIndex = this.canvasItems.length - 1;
        
        // Switch back to select tool
        this.currentTool = 'select';
      }
    },
    
    // Generate unique ID
    generateId() {
      return 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    },
    
    // Get next available table number
    getNextTableNumber() {
      const tableNumbers = this.canvasItems
        .filter(item => item.type.includes('table'))
        .map(table => table.number);
      
      if (tableNumbers.length === 0) return 1;
      
      return Math.max(...tableNumbers) + 1;
    },
    
    // Check for collisions
    checkCollision(newItem) {
      if (!this.collisionDetection) return false;
      
      return this.canvasItems.some(item => {
        // Skip collision check with self
        if (newItem.id === item.id) return false;
        
        // Simple rectangle collision detection
        return !(
          newItem.x + newItem.width < item.x ||
          newItem.x > item.x + item.width ||
          newItem.y + newItem.height < item.y ||
          newItem.y > item.y + item.height
        );
      });
    },
    
    // Get style for canvas item
    getItemStyle(item) {
      const style = {
        left: item.x + 'px',
        top: item.y + 'px',
        width: item.width + 'px',
        height: item.height + 'px',
        transform: `rotate(${item.rotation || 0}deg)`
      };
      
      // Add table style
      if (item.type.includes('table') && item.style) {
        style.backgroundImage = `url(assets/table-styles/${item.style}.png)`;
      }
      
      return style;
    },
    
    // Get table seats
    getTableSeats(table) {
      const seats = [];
      const capacity = table.capacity || 0;
      
      for (let i = 0; i < capacity; i++) {
        // Find guest assigned to this seat
        const guest = this.guests.find(g => g.tableId === table.id && g.seatNumber === i);
        seats.push({ index: i, guest });
      }
      
      return seats;
    },
    
    // Get seat style based on table type and position
    getSeatStyle(table, seatIndex, totalSeats) {
      let angle, radius;
      
      if (table.type === 'round-table') {
        // For round tables, position seats in a circle
        angle = (seatIndex / totalSeats) * 2 * Math.PI;
        radius = Math.min(table.width, table.height) / 2 - 15;
        
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        
        return {
          left: x + '%',
          top: y + '%',
          transform: 'translate(-50%, -50%)'
        };
      } else if (table.type === 'rectangular-table') {
        // For rectangular tables, position seats around the perimeter
        const halfSeats = Math.ceil(totalSeats / 2);
        
        if (seatIndex < halfSeats) {
          // Top side
          return {
            left: (100 / halfSeats) * (seatIndex + 0.5) + '%',
            top: '0',
            transform: 'translate(-50%, -50%)'
          };
        } else {
          // Bottom side
          return {
            left: (100 / halfSeats) * (totalSeats - seatIndex - 0.5) + '%',
            top: '100%',
            transform: 'translate(-50%, -50%)'
          };
        }
      } else if (table.type === 'oval-table') {
        // For oval tables, position seats in an oval
        angle = (seatIndex / totalSeats) * 2 * Math.PI;
        const a = table.width / 2 - 15;
        const b = table.height / 2 - 15;
        
        const x = 50 + a * Math.cos(angle);
        const y = 50 + b * Math.sin(angle);
        
        return {
          left: x + '%',
          top: y + '%',
          transform: 'translate(-50%, -50%)'
        };
      }
      
      return {};
    },
    
    // Select seat
    selectSeat(tableIndex, seatIndex) {
      if (this.readOnly) return;
      
      this.selectedItemIndex = tableIndex;
      this.selectedSeatIndex = seatIndex;
      
      const table = this.canvasItems[tableIndex];
      const seats = this.getTableSeats(table);
      const seat = seats[seatIndex];
      
      if (seat.guest) {
        // If seat already has a guest, unassign
        this.unassignGuestFromSeat(tableIndex, seatIndex);
      } else {
        // If seat is empty, show available guests
        this.showGuestSelectionForSeat(tableIndex, seatIndex);
      }
    },
    
    // Unassign guest from seat
    unassignGuestFromSeat(tableIndex, seatIndex) {
      const table = this.canvasItems[tableIndex];
      const seats = this.getTableSeats(table);
      const seat = seats[seatIndex];
      
      if (!seat.guest) return;
      
      // Find guest in guests list
      const guestIndex = this.guests.findIndex(g => 
        g.tableId === table.id && g.seatNumber === seatIndex
      );
      
      if (guestIndex !== -1) {
        // Update guest
        this.guests[guestIndex].tableId = null;
        this.guests[guestIndex].seatNumber = null;
        
        // Add notification
        this.addNotification({
          type: 'info',
          message: `${this.guests[guestIndex].name} wurde von Tisch ${table.number} entfernt`
        });
      }
    },
    
    // Show guest selection for seat
    showGuestSelectionForSeat(tableIndex, seatIndex) {
      // In a real implementation, this would show a modal or dropdown
      // For this enhanced version, we'll implement a proper selection dialog
      
      const table = this.canvasItems[tableIndex];
      
      // Get unassigned guests
      const unassignedGuests = this.guests.filter(g => g.tableId === null);
      
      if (unassignedGuests.length === 0) {
        this.addNotification({
          type: 'warning',
          message: 'Keine unzugewiesenen Gäste verfügbar'
        });
        return;
      }
      
      // Show guest selection dialog
      this.$emit('show-guest-selection', {
        tableId: table.id,
        tableName: table.name,
        tableNumber: table.number,
        seatIndex,
        unassignedGuests,
        onSelect: (guest) => {
          this.assignGuestToSeat(guest, tableIndex, seatIndex);
        }
      });
    },
    
    // Assign guest to seat
    assignGuestToSeat(guest, tableIndex, seatIndex) {
      const table = this.canvasItems[tableIndex];
      
      // Find guest in guests list
      const guestIndex = this.guests.findIndex(g => g.id === guest.id);
      
      if (guestIndex !== -1) {
        // Update guest
        this.guests[guestIndex].tableId = table.id;
        this.guests[guestIndex].seatNumber = seatIndex;
        
        // Add notification
        this.addNotification({
          type: 'success',
          message: `${guest.name} wurde Tisch ${table.number}, Platz ${seatIndex + 1} zugewiesen`
        });
      }
    },
    
    // Get initials from name
    getInitials(name) {
      if (!name) return '';
      
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('');
    },
    
    // Initialize drag and resize functionality
    initDragAndResize() {
      if (this.readOnly) return;
      
      const self = this;
      
      interact('.canvas-item')
        .draggable({
          inertia: true,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: '.table-canvas',
              endOnly: true
            })
          ],
          autoScroll: true,
          listeners: {
            start(event) {
              const index = self.canvasItems.findIndex(item => 
                item.id === event.target.getAttribute('data-id')
              );
              
              self.selectedItemIndex = index;
            },
            move(event) {
              const index = self.canvasItems.findIndex(item => 
                item.id === event.target.getAttribute('data-id')
              );
              
              const item = self.canvasItems[index];
              
              let newX = item.x + event.dx;
              let newY = item.y + event.dy;
              
              // Snap to grid if enabled
              if (self.snapToGrid) {
                newX = Math.round(newX / self.gridSize) * self.gridSize;
                newY = Math.round(newY / self.gridSize) * self.gridSize;
              }
              
              // Update position
              item.x = newX;
              item.y = newY;
            },
            end(event) {
              // Check for collisions if enabled
              if (self.collisionDetection) {
                const index = self.canvasItems.findIndex(item => 
                  item.id === event.target.getAttribute('data-id')
                );
                
                const item = self.canvasItems[index];
                
                if (self.checkCollision(item)) {
                  // Revert to previous position
                  const historyItem = self.history[self.historyIndex];
                  const historyItemData = historyItem.find(i => i.id === item.id);
                  
                  if (historyItemData) {
                    item.x = historyItemData.x;
                    item.y = historyItemData.y;
                    
                    self.addNotification({
                      type: 'warning',
                      message: 'Element kann nicht platziert werden: Kollision mit bestehendem Element'
                    });
                  }
                }
              }
            }
          }
        })
        .resizable({
          edges: { left: true, right: true, bottom: true, top: true },
          modifiers: [
            interact.modifiers.restrictSize({
              min: { width: 50, height: 50 }
            })
          ],
          listeners: {
            move(event) {
              const index = self.canvasItems.findIndex(item => 
                item.id === event.target.getAttribute('data-id')
              );
              
              const item = self.canvasItems[index];
              
              let x = item.x;
              let y = item.y;
              let width = item.width;
              let height = item.height;
              
              // Update element dimensions and position
              if (event.edges.left) {
                x += event.deltaRect.left;
                width -= event.deltaRect.left;
              } else if (event.edges.right) {
                width += event.deltaRect.right;
              }
              
              if (event.edges.top) {
                y += event.deltaRect.top;
                height -= event.deltaRect.top;
              } else if (event.edges.bottom) {
                height += event.deltaRect.bottom;
              }
              
              // Snap to grid if enabled
              if (self.snapToGrid) {
                x = Math.round(x / self.gridSize) * self.gridSize;
                y = Math.round(y / self.gridSize) * self.gridSize;
                width = Math.round(width / self.gridSize) * self.gridSize;
                height = Math.round(height / self.gridSize) * self.gridSize;
              }
              
              // Update item
              Object.assign(item, { x, y, width, height });
            },
            end(event) {
              // Check for collisions if enabled
              if (self.collisionDetection) {
                const index = self.canvasItems.findIndex(item => 
                  item.id === event.target.getAttribute('data-id')
                );
                
                const item = self.canvasItems[index];
                
                if (self.checkCollision(item)) {
                  // Revert to previous size and position
                  const historyItem = self.history[self.historyIndex];
                  const historyItemData = historyItem.find(i => i.id === item.id);
                  
                  if (historyItemData) {
                    item.x = historyItemData.x;
                    item.y = historyItemData.y;
                    item.width = historyItemData.width;
                    item.height = historyItemData.height;
                    
                    self.addNotification({
                      type: 'warning',
                      message: 'Element kann nicht vergrößert werden: Kollision mit bestehendem Element'
                    });
                  }
                }
              }
            }
          }
        });
    },
    
    // Initialize 3D view
    init3DView() {
      if (!this.$refs.canvas3d) return;
      
      // Create scene
      this.threeScene = new THREE.Scene();
      this.threeScene.background = new THREE.Color(0xf0f0f0);
      
      // Create camera
      this.threeCamera = new THREE.PerspectiveCamera(
        75,
        this.$refs.canvas3d.clientWidth / this.$refs.canvas3d.clientHeight,
        0.1,
        1000
      );
      this.threeCamera.position.set(0, 5, 5);
      
      // Create renderer
      this.threeRenderer = new THREE.WebGLRenderer({ antialias: true });
      this.threeRenderer.setSize(
        this.$refs.canvas3d.clientWidth,
        this.$refs.canvas3d.clientHeight
      );
      this.threeRenderer.shadowMap.enabled = true;
      
      // Add renderer to DOM
      this.$refs.canvas3d.appendChild(this.threeRenderer.domElement);
      
      // Add controls
      this.threeControls = new OrbitControls(
        this.threeCamera,
        this.threeRenderer.domElement
      );
      this.threeControls.enableDamping = true;
      this.threeControls.dampingFactor = 0.25;
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.threeScene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
      this.threeScene.add(directionalLight);
      
      // Add floor
      const floorGeometry = new THREE.PlaneGeometry(
        this.roomWidth / 100,
        this.roomHeight / 100
      );
      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        side: THREE.DoubleSide
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      this.threeScene.add(floor);
      
      // Add grid
      const grid = new THREE.GridHelper(
        Math.max(this.roomWidth, this.roomHeight) / 100,
        Math.max(this.roomWidth, this.roomHeight) / this.gridSize
      );
      grid.position.y = 0.01;
      this.threeScene.add(grid);
      
      // Load 3D models
      this.load3DModels();
      
      // Update 3D view with canvas items
      this.update3DView();
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        this.threeControls.update();
        this.threeRenderer.render(this.threeScene, this.threeCamera);
      };
      
      animate();
      
      // Handle window resize
      window.addEventListener('resize', this.resize3DView);
    },
    
    // Load 3D models
    load3DModels() {
      const loader = new GLTFLoader();
      
      // Load table models
      const tableTypes = ['round-table', 'rectangular-table', 'oval-table'];
      const tableStyles = ['classic', 'rustic', 'modern', 'elegant'];
      
      tableTypes.forEach(type => {
        tableStyles.forEach(style => {
          const modelKey = `${type}-${style}`;
          
          loader.load(
            `assets/models/${modelKey}.glb`,
            (gltf) => {
              this.threeObjects[modelKey] = gltf.scene;
            },
            undefined,
            (error) => {
              console.error('Error loading 3D model:', error);
            }
          );
        });
      });
      
      // Load other element models
      const elementTypes = [
        'dance-floor',
        'stage',
        'bar',
        'entrance',
        'wall',
        'plant'
      ];
      
      elementTypes.forEach(type => {
        loader.load(
          `assets/models/${type}.glb`,
          (gltf) => {
            this.threeObjects[type] = gltf.scene;
          },
          undefined,
          (error) => {
            console.error('Error loading 3D model:', error);
          }
        );
      });
    },
    
    // Update 3D view
    update3DView() {
      if (!this.threeScene) return;
      
      // Clear existing items
      this.threeScene.children.forEach(child => {
        if (child.userData.isCanvasItem) {
          this.threeScene.remove(child);
        }
      });
      
      // Add canvas items to 3D scene
      this.canvasItems.forEach(item => {
        let model;
        
        if (item.type.includes('table')) {
          const modelKey = `${item.type}-${item.style || 'classic'}`;
          
          if (this.threeObjects[modelKey]) {
            model = this.threeObjects[modelKey].clone();
          } else {
            // Fallback if model not loaded yet
            const geometry = item.type === 'round-table'
              ? new THREE.CylinderGeometry(item.width / 200, item.width / 200, 0.5, 32)
              : new THREE.BoxGeometry(item.width / 100, 0.5, item.height / 100);
            
            const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
            model = new THREE.Mesh(geometry, material);
          }
          
          // Add table number
          const textGeometry = new THREE.TextGeometry(item.number.toString(), {
            font: new THREE.Font(), // Need to load a font
            size: 0.2,
            height: 0.05
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(0, 0.5, 0);
          model.add(textMesh);
        } else {
          if (this.threeObjects[item.type]) {
            model = this.threeObjects[item.type].clone();
          } else {
            // Fallback if model not loaded yet
            const geometry = new THREE.BoxGeometry(
              item.width / 100,
              0.5,
              item.height / 100
            );
            const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
            model = new THREE.Mesh(geometry, material);
          }
        }
        
        // Position and scale model
        model.position.set(
          (item.x - this.roomWidth / 2) / 100,
          0.25,
          (item.y - this.roomHeight / 2) / 100
        );
        
        model.rotation.y = THREE.MathUtils.degToRad(item.rotation || 0);
        
        // Mark as canvas item
        model.userData.isCanvasItem = true;
        model.userData.itemId = item.id;
        
        // Add to scene
        this.threeScene.add(model);
      });
    },
    
    // Resize 3D view
    resize3DView() {
      if (!this.threeCamera || !this.threeRenderer || !this.$refs.canvas3d) return;
      
      this.threeCamera.aspect = this.$refs.canvas3d.clientWidth / this.$refs.canvas3d.clientHeight;
      this.threeCamera.updateProjectionMatrix();
      
      this.threeRenderer.setSize(
        this.$refs.canvas3d.clientWidth,
        this.$refs.canvas3d.clientHeight
      );
    },
    
    // Delete selected item
    deleteSelectedItem() {
      if (this.selectedItemIndex === null || this.readOnly) return;
      
      const item = this.canvasItems[this.selectedItemIndex];
      
      // If it's a table, unassign all guests
      if (item.type.includes('table')) {
        this.guests.forEach(guest => {
          if (guest.tableId === item.id) {
            guest.tableId = null;
            guest.seatNumber = null;
          }
        });
      }
      
      // Remove item
      this.canvasItems.splice(this.selectedItemIndex, 1);
      this.selectedItemIndex = null;
      
      // Add notification
      this.addNotification({
        type: 'info',
        message: `${item.name || item.type} wurde gelöscht`
      });
    },
    
    // Clear canvas
    clearCanvas() {
      if (this.readOnly) return;
      
      if (confirm('Sind Sie sicher, dass Sie alle Tische und Elemente löschen möchten?')) {
        // Unassign all guests
        this.guests.forEach(guest => {
          guest.tableId = null;
          guest.seatNumber = null;
        });
        
        // Clear canvas items
        this.canvasItems = [];
        this.selectedItemIndex = null;
        
        // Add notification
        this.addNotification({
          type: 'info',
          message: 'Tischplan wurde geleert'
        });
      }
    },
    
    // Save layout
    async saveLayout() {
      if (this.readOnly) return;
      
      const success = await this.saveData();
      
      if (success) {
        this.addNotification({
          type: 'success',
          message: 'Tischplan erfolgreich gespeichert'
        });
      }
    },
    
    // Export layout
    exportLayout() {
      // In a real implementation, this would generate a PDF or image
      this.$emit('export-layout', {
        canvasItems: this.canvasItems,
        guests: this.guests,
        roomWidth: this.roomWidth,
        roomHeight: this.roomHeight,
        roomName: this.roomName,
        options: this.exportOptions
      });
      
      this.addNotification({
        type: 'info',
        message: 'Tischplan wird exportiert...'
      });
    },
    
    // Print layout
    printLayout() {
      this.$emit('print-layout', {
        canvasItems: this.canvasItems,
        guests: this.guests,
        roomWidth: this.roomWidth,
        roomHeight: this.roomHeight,
        roomName: this.roomName,
        options: this.printOptions
      });
      
      this.addNotification({
        type: 'info',
        message: 'Tischplan wird gedruckt...'
      });
    },
    
    // Load template
    loadTemplate(templateId) {
      if (this.readOnly) return;
      
      if (this.canvasItems.length > 0) {
        if (!confirm('Sind Sie sicher, dass Sie den aktuellen Tischplan überschreiben möchten?')) {
          return;
        }
      }
      
      // In a real implementation, this would load a template from the server
      this.$emit('load-template', {
        templateId,
        onLoad: (template) => {
          // Unassign all guests
          this.guests.forEach(guest => {
            guest.tableId = null;
            guest.seatNumber = null;
          });
          
          // Load template
          this.canvasItems = template.canvasItems;
          
          // Add notification
          this.addNotification({
            type: 'success',
            message: `Vorlage "${template.name}" wurde geladen`
          });
        }
      });
    },
    
    // Save as template
    saveAsTemplate() {
      if (this.readOnly) return;
      
      // Prompt for template name
      const templateName = prompt('Name der Vorlage:', 'Meine Vorlage');
      
      if (!templateName) return;
      
      // In a real implementation, this would save the template to the server
      this.$emit('save-template', {
        name: templateName,
        canvasItems: this.canvasItems,
        onSave: () => {
          this.addNotification({
            type: 'success',
            message: `Vorlage "${templateName}" wurde gespeichert`
          });
        }
      });
    },
    
    // Update statistics
    updateStatistics() {
      const tables = this.canvasItems.filter(item => item.type.includes('table'));
      
      this.stats = {
        totalGuests: this.guests.length,
        assignedGuests: this.guests.filter(guest => guest.tableId !== null).length,
        unassignedGuests: this.guests.filter(guest => guest.tableId === null).length,
        totalTables: tables.length,
        totalSeats: tables.reduce((sum, table) => sum + (table.capacity || 0), 0),
        occupiedSeats: this.guests.filter(guest => guest.tableId !== null).length,
        emptySeats: tables.reduce((sum, table) => sum + (table.capacity || 0), 0) - 
                   this.guests.filter(guest => guest.tableId !== null).length
      };
    },
    
    // Add to history for undo/redo
    addToHistory() {
      // Don't add to history in read-only mode
      if (this.readOnly) return;
      
      // Create deep copy of canvas items
      const historyItem = JSON.parse(JSON.stringify(this.canvasItems));
      
      // If we're not at the end of the history, truncate it
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      
      // Add to history
      this.history.push(historyItem);
      this.historyIndex = this.history.length - 1;
      
      // Limit history size
      if (this.history.length > 50) {
        this.history.shift();
        this.historyIndex--;
      }
    },
    
    // Undo
    undo() {
      if (!this.canUndo || this.readOnly) return;
      
      this.historyIndex--;
      this.canvasItems = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      
      this.addNotification({
        type: 'info',
        message: 'Aktion rückgängig gemacht'
      });
    },
    
    // Redo
    redo() {
      if (!this.canRedo || this.readOnly) return;
      
      this.historyIndex++;
      this.canvasItems = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      
      this.addNotification({
        type: 'info',
        message: 'Aktion wiederhergestellt'
      });
    },
    
    // Add notification
    addNotification(notification) {
      const id = Date.now();
      
      this.notifications.push({
        id,
        ...notification,
        timestamp: new Date()
      });
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    },
    
    // Remove notification
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    // Toggle view mode
    toggleViewMode() {
      this.viewMode = this.viewMode === '2d' ? '3d' : '2d';
      
      if (this.viewMode === '3d') {
        this.$nextTick(() => {
          this.init3DView();
        });
      }
    },
    
    // Toggle sidebar tab
    toggleSidebarTab(tab) {
      this.sidebarTab = tab;
    },
    
    // Toggle grid
    toggleGrid() {
      this.showGrid = !this.showGrid;
    },
    
    // Toggle snap to grid
    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid;
    },
    
    // Change grid size
    changeGridSize(size) {
      this.gridSize = size;
    },
    
    // Change table style
    changeTableStyle(style) {
      this.selectedTableStyle = style;
    },
    
    // Rotate selected item
    rotateSelectedItem(degrees) {
      if (this.selectedItemIndex === null || this.readOnly) return;
      
      const item = this.canvasItems[this.selectedItemIndex];
      
      item.rotation = (item.rotation || 0) + degrees;
      
      // Normalize rotation
      while (item.rotation >= 360) {
        item.rotation -= 360;
      }
      
      while (item.rotation < 0) {
        item.rotation += 360;
      }
    },
    
    // Duplicate selected item
    duplicateSelectedItem() {
      if (this.selectedItemIndex === null || this.readOnly) return;
      
      const item = this.canvasItems[this.selectedItemIndex];
      
      // Create deep copy
      const newItem = JSON.parse(JSON.stringify(item));
      
      // Generate new ID
      newItem.id = this.generateId();
      
      // Offset position
      newItem.x += 20;
      newItem.y += 20;
      
      // If it's a table, update number
      if (newItem.type.includes('table')) {
        newItem.number = this.getNextTableNumber();
        newItem.name = 'Tisch ' + newItem.number;
      }
      
      // Add to canvas items
      this.canvasItems.push(newItem);
      
      // Select new item
      this.selectedItemIndex = this.canvasItems.length - 1;
      
      // Add notification
      this.addNotification({
        type: 'success',
        message: `${item.name || item.type} wurde dupliziert`
      });
    },
    
    // Change room dimensions
    changeRoomDimensions(width, height) {
      if (this.readOnly) return;
      
      this.roomWidth = width;
      this.roomHeight = height;
      
      // Update 3D view
      if (this.viewMode === '3d' && this.threeScene) {
        // Update floor
        this.threeScene.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry) {
            child.geometry.dispose();
            child.geometry = new THREE.PlaneGeometry(
              this.roomWidth / 100,
              this.roomHeight / 100
            );
          }
        });
        
        // Update grid
        this.threeScene.children.forEach(child => {
          if (child instanceof THREE.GridHelper) {
            this.threeScene.remove(child);
            
            const grid = new THREE.GridHelper(
              Math.max(this.roomWidth, this.roomHeight) / 100,
              Math.max(this.roomWidth, this.roomHeight) / this.gridSize
            );
            grid.position.y = 0.01;
            this.threeScene.add(grid);
          }
        });
      }
    },
    
    // Change room name
    changeRoomName(name) {
      if (this.readOnly) return;
      
      this.roomName = name;
    },
    
    // Add guest
    addGuest(guest) {
      if (this.readOnly) return;
      
      // Generate ID if not provided
      if (!guest.id) {
        guest.id = 'guest_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      }
      
      // Add to guests
      this.guests.push(guest);
      
      // Add notification
      this.addNotification({
        type: 'success',
        message: `Gast ${guest.name} wurde hinzugefügt`
      });
    },
    
    // Edit guest
    editGuest(guestId, updatedGuest) {
      if (this.readOnly) return;
      
      const index = this.guests.findIndex(g => g.id === guestId);
      
      if (index !== -1) {
        this.guests[index] = { ...this.guests[index], ...updatedGuest };
        
        // Add notification
        this.addNotification({
          type: 'success',
          message: `Gast ${this.guests[index].name} wurde aktualisiert`
        });
      }
    },
    
    // Delete guest
    deleteGuest(guestId) {
      if (this.readOnly) return;
      
      const index = this.guests.findIndex(g => g.id === guestId);
      
      if (index !== -1) {
        const guestName = this.guests[index].name;
        
        // Remove guest
        this.guests.splice(index, 1);
        
        // Add notification
        this.addNotification({
          type: 'info',
          message: `Gast ${guestName} wurde gelöscht`
        });
      }
    },
    
    // Import guests
    importGuests(guestList) {
      if (this.readOnly) return;
      
      // Add guests
      guestList.forEach(guest => {
        // Generate ID if not provided
        if (!guest.id) {
          guest.id = 'guest_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        }
        
        // Add to guests
        this.guests.push(guest);
      });
      
      // Add notification
      this.addNotification({
        type: 'success',
        message: `${guestList.length} Gäste wurden importiert`
      });
    },
    
    // Export guests
    exportGuests() {
      return this.guests;
    },
    
    // Auto-assign guests
    autoAssignGuests() {
      if (this.readOnly) return;
      
      // Get unassigned guests
      const unassignedGuests = this.guests.filter(g => g.tableId === null);
      
      if (unassignedGuests.length === 0) {
        this.addNotification({
          type: 'info',
          message: 'Keine unzugewiesenen Gäste vorhanden'
        });
        return;
      }
      
      // Get tables
      const tables = this.canvasItems.filter(item => item.type.includes('table'));
      
      if (tables.length === 0) {
        this.addNotification({
          type: 'warning',
          message: 'Keine Tische vorhanden'
        });
        return;
      }
      
      // Group guests by group
      const guestGroups = {};
      
      unassignedGuests.forEach(guest => {
        const group = guest.group || 'Keine Gruppe';
        
        if (!guestGroups[group]) {
          guestGroups[group] = [];
        }
        
        guestGroups[group].push(guest);
      });
      
      // Assign guests to tables
      let assignedCount = 0;
      
      // First, try to keep groups together
      Object.values(guestGroups).forEach(group => {
        // Find table with enough empty seats
        const table = tables.find(table => {
          const assignedGuests = this.guests.filter(g => g.tableId === table.id);
          return (table.capacity || 0) - assignedGuests.length >= group.length;
        });
        
        if (table) {
          // Assign group to table
          group.forEach(guest => {
            // Find first empty seat
            const assignedGuests = this.guests.filter(g => g.tableId === table.id);
            const emptySeatIndices = [];
            
            for (let i = 0; i < (table.capacity || 0); i++) {
              if (!assignedGuests.some(g => g.seatNumber === i)) {
                emptySeatIndices.push(i);
              }
            }
            
            if (emptySeatIndices.length > 0) {
              const guestIndex = this.guests.findIndex(g => g.id === guest.id);
              
              if (guestIndex !== -1) {
                this.guests[guestIndex].tableId = table.id;
                this.guests[guestIndex].seatNumber = emptySeatIndices.shift();
                assignedCount++;
              }
            }
          });
        }
      });
      
      // Then, assign remaining guests
      unassignedGuests.forEach(guest => {
        if (guest.tableId !== null) return; // Already assigned
        
        // Find table with empty seats
        for (const table of tables) {
          const assignedGuests = this.guests.filter(g => g.tableId === table.id);
          
          if (assignedGuests.length < (table.capacity || 0)) {
            // Find first empty seat
            const emptySeatIndices = [];
            
            for (let i = 0; i < (table.capacity || 0); i++) {
              if (!assignedGuests.some(g => g.seatNumber === i)) {
                emptySeatIndices.push(i);
              }
            }
            
            if (emptySeatIndices.length > 0) {
              const guestIndex = this.guests.findIndex(g => g.id === guest.id);
              
              if (guestIndex !== -1) {
                this.guests[guestIndex].tableId = table.id;
                this.guests[guestIndex].seatNumber = emptySeatIndices[0];
                assignedCount++;
                break;
              }
            }
          }
        }
      });
      
      // Add notification
      this.addNotification({
        type: 'success',
        message: `${assignedCount} Gäste wurden automatisch zugewiesen`
      });
    },
    
    // Clear all guest assignments
    clearGuestAssignments() {
      if (this.readOnly) return;
      
      if (confirm('Sind Sie sicher, dass Sie alle Gästezuweisungen löschen möchten?')) {
        // Unassign all guests
        this.guests.forEach(guest => {
          guest.tableId = null;
          guest.seatNumber = null;
        });
        
        // Add notification
        this.addNotification({
          type: 'info',
          message: 'Alle Gästezuweisungen wurden gelöscht'
        });
      }
    }
  }
};
