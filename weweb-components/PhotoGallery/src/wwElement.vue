<template>
  <div class="lv-photo-gallery">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-gallery-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Fotogalerie' }}</h2>
                <p>{{ content.subtitle || 'Verwalten und teilen Sie Ihre Hochzeitsfotos' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div v-for="(stat, index) in content.galleryStats" :key="index" class="lv-stat-item">
                    <div class="lv-stat-value">{{ stat.value }}</div>
                    <div class="lv-stat-label">{{ stat.label }}</div>
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
                v-for="(filter, index) in content.albumFilters" 
                :key="index" 
                class="lv-filter-btn" 
                :class="{ 'lv-filter-active': currentFilter === filter.value }"
                @click="setFilter(filter.value)">
                {{ filter.label }}
              </button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-search-container lv-mb-2">
              <input type="text" class="lv-search-input" v-model="searchQuery" :placeholder="content.searchPlaceholder || 'Alben durchsuchen...'" @input="filterAlbums">
            </div>
            <button class="lv-btn lv-btn-primary" @click="openCreateAlbumModal">{{ content.createAlbumButtonText || 'Album erstellen' }}</button>
          </div>
        </div>
      </div>
      
      <!-- Albums Grid -->
      <div class="lv-albums-grid">
        <div 
          v-for="(album, index) in filteredAlbums" 
          :key="index" 
          class="lv-album-card" 
          :data-album-id="album.id" 
          :data-status="album.status">
          <div class="lv-album-cover">
            <img :src="album.coverImage" :alt="album.title" class="lv-album-img">
            <div class="lv-album-overlay">
              <div class="lv-album-actions">
                <button class="lv-btn lv-btn-sm lv-btn-light lv-view-album-btn" @click="openAlbumViewer(album)">{{ content.openButtonText || 'Öffnen' }}</button>
                <button class="lv-btn lv-btn-sm lv-btn-light lv-edit-album-btn" @click="openEditAlbumModal(album)">{{ content.editButtonText || 'Bearbeiten' }}</button>
              </div>
            </div>
            <div class="lv-album-status" :class="'lv-status-' + album.status">{{ getStatusLabel(album.status) }}</div>
          </div>
          <div class="lv-album-info">
            <h3 class="lv-album-title">{{ album.title }}</h3>
            <div class="lv-album-meta">
              <span class="lv-album-count">{{ album.photoCount }} {{ content.photosText || 'Fotos' }}</span>
              <span class="lv-album-date">{{ album.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Album Viewer Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isAlbumViewerOpen }">
    <div class="lv-modal-dialog lv-modal-xl">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ currentAlbum.title }}</h3>
          <button class="lv-modal-close" @click="closeAlbumViewer">&times;</button>
        </div>
        <div class="lv-modal-body lv-p-0">
          <div class="lv-photo-viewer">
            <div class="lv-photo-main">
              <div class="lv-photo-container">
                <img :src="currentPhoto.url" :alt="currentPhoto.caption" class="lv-photo-img">
                <div class="lv-photo-nav">
                  <button class="lv-photo-nav-btn lv-photo-prev" @click="prevPhoto" :disabled="currentPhotoIndex === 0">&lt;</button>
                  <button class="lv-photo-nav-btn lv-photo-next" @click="nextPhoto" :disabled="currentPhotoIndex === currentAlbum.photos.length - 1">&gt;</button>
                </div>
              </div>
              <div class="lv-photo-info lv-p-3">
                <div class="lv-photo-caption">{{ currentPhoto.caption }}</div>
                <div class="lv-photo-meta">
                  <span class="lv-photo-date">{{ currentPhoto.date }}</span>
                  <span class="lv-photo-index">{{ currentPhotoIndex + 1 }} {{ content.ofText || 'von' }} {{ currentAlbum.photos.length }}</span>
                </div>
              </div>
            </div>
            <div class="lv-photo-thumbnails lv-p-2">
              <div class="lv-thumbnails-container">
                <div 
                  v-for="(photo, index) in currentAlbum.photos" 
                  :key="index" 
                  class="lv-thumbnail" 
                  :class="{ 'lv-thumbnail-active': index === currentPhotoIndex }"
                  @click="selectPhoto(index)">
                  <img :src="photo.thumbnail" :alt="'Thumbnail ' + (index + 1)" class="lv-thumbnail-img">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lv-modal-footer">
          <div class="lv-photo-actions">
            <button class="lv-btn lv-btn-outline" @click="downloadPhoto">{{ content.downloadButtonText || 'Herunterladen' }}</button>
            <button class="lv-btn lv-btn-outline" @click="sharePhoto">{{ content.shareButtonText || 'Teilen' }}</button>
            <button class="lv-btn lv-btn-outline lv-btn-danger" @click="openDeletePhotoModal">{{ content.deleteButtonText || 'Löschen' }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Album Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isAlbumModalOpen }">
    <div class="lv-modal-dialog lv-modal-lg">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ isEditMode ? content.editAlbumTitle || 'Album bearbeiten' : content.createAlbumTitle || 'Album erstellen' }}</h3>
          <button class="lv-modal-close" @click="closeAlbumModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <form id="albumForm">
            <div class="lv-form-group">
              <label class="lv-form-label" for="albumTitle">{{ content.albumTitleLabel || 'Albumtitel' }}*</label>
              <input type="text" class="lv-form-control" id="albumTitle" required v-model="editingAlbum.title" :placeholder="content.albumTitlePlaceholder || 'Geben Sie einen Titel für das Album ein'">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="albumDescription">{{ content.albumDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="albumDescription" rows="3" v-model="editingAlbum.description" :placeholder="content.albumDescriptionPlaceholder || 'Beschreiben Sie das Album (optional)'"></textarea>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label" for="albumDate">{{ content.albumDateLabel || 'Datum' }}</label>
              <input type="date" class="lv-form-control" id="albumDate" v-model="editingAlbum.date">
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.privacyLabel || 'Privatsphäre' }}</label>
              <div class="lv-radio-group">
                <div v-for="(option, index) in content.privacyOptions" :key="index" class="lv-radio">
                  <input 
                    type="radio" 
                    :id="'privacy' + option.value" 
                    name="albumPrivacy" 
                    :value="option.value" 
                    v-model="editingAlbum.status">
                  <label :for="'privacy' + option.value">{{ option.label }}</label>
                </div>
              </div>
            </div>
            
            <div class="lv-form-group">
              <label class="lv-form-label">{{ content.uploadPhotosLabel || 'Fotos hochladen' }}</label>
              <div class="lv-upload-container">
                <div class="lv-upload-dropzone" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
                  <div class="lv-upload-icon">📷</div>
                  <div class="lv-upload-text">{{ content.dropzoneText || 'Fotos hierher ziehen oder klicken zum Auswählen' }}</div>
                  <input type="file" ref="fileInput" multiple accept="image/*" class="lv-upload-input" @change="onFileSelect" style="display: none;">
                </div>
                <div class="lv-upload-preview">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="lv-upload-preview-item">
                    <img :src="file.preview" :alt="file.name" class="lv-upload-preview-img">
                    <button type="button" class="lv-upload-preview-remove" @click="removeUploadedFile(index)">&times;</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeAlbumModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-primary" @click="saveAlbum">{{ content.saveButtonText || 'Speichern' }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Photo Confirmation Modal -->
  <div class="lv-modal" :class="{ 'lv-modal-open': isDeletePhotoModalOpen }">
    <div class="lv-modal-dialog lv-modal-sm">
      <div class="lv-modal-content">
        <div class="lv-modal-header">
          <h3>{{ content.deletePhotoTitle || 'Foto löschen' }}</h3>
          <button class="lv-modal-close" @click="closeDeletePhotoModal">&times;</button>
        </div>
        <div class="lv-modal-body">
          <p>{{ content.deletePhotoConfirmationText || 'Sind Sie sicher, dass Sie dieses Foto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
        </div>
        <div class="lv-modal-footer">
          <button class="lv-btn lv-btn-outline" @click="closeDeletePhotoModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
          <button class="lv-btn lv-btn-danger" @click="deletePhoto">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      searchQuery: '',
      currentFilter: 'all',
      filteredAlbums: [],
      isAlbumViewerOpen: false,
      isAlbumModalOpen: false,
      isDeletePhotoModalOpen: false,
      isEditMode: false,
      currentAlbum: {
        id: '',
        title: '',
        photos: []
      },
      currentPhotoIndex: 0,
      editingAlbum: {
        id: '',
        title: '',
        description: '',
        date: '',
        status: 'private',
        photos: []
      },
      uploadedFiles: []
    };
  },
  computed: {
    currentPhoto() {
      if (!this.currentAlbum.photos || this.currentAlbum.photos.length === 0) {
        return { url: '', caption: '', date: '' };
      }
      return this.currentAlbum.photos[this.currentPhotoIndex] || { url: '', caption: '', date: '' };
    }
  },
  mounted() {
    this.filteredAlbums = [...(this.content.albums || [])];
  },
  methods: {
    getStatusLabel(status) {
      const statusMap = {
        private: this.content.privateLabel || 'Privat',
        shared: this.content.sharedLabel || 'Geteilt',
        public: this.content.publicLabel || 'Öffentlich'
      };
      return statusMap[status] || status;
    },
    setFilter(filter) {
      this.currentFilter = filter;
      this.filterAlbums();
    },
    filterAlbums() {
      let filtered = [...(this.content.albums || [])];
      
      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(album => 
          album.title.toLowerCase().includes(query) || 
          (album.description && album.description.toLowerCase().includes(query))
        );
      }
      
      // Apply status filter
      if (this.currentFilter !== 'all') {
        filtered = filtered.filter(album => album.status === this.currentFilter);
      }
      
      this.filteredAlbums = filtered;
    },
    openAlbumViewer(album) {
      this.currentAlbum = { ...album };
      this.currentPhotoIndex = 0;
      this.isAlbumViewerOpen = true;
    },
    closeAlbumViewer() {
      this.isAlbumViewerOpen = false;
    },
    prevPhoto() {
      if (this.currentPhotoIndex > 0) {
        this.currentPhotoIndex--;
      }
    },
    nextPhoto() {
      if (this.currentPhotoIndex < this.currentAlbum.photos.length - 1) {
        this.currentPhotoIndex++;
      }
    },
    selectPhoto(index) {
      this.currentPhotoIndex = index;
    },
    downloadPhoto() {
      // In a real application, this would trigger a download
      console.log('Downloading photo:', this.currentPhoto.url);
      // Typically, you would create a temporary anchor element and trigger a click
      // const link = document.createElement('a');
      // link.href = this.currentPhoto.url;
      // link.download = 'photo.jpg';
      // link.click();
    },
    sharePhoto() {
      // In a real application, this would open a sharing dialog
      console.log('Sharing photo:', this.currentPhoto.url);
    },
    openDeletePhotoModal() {
      this.isDeletePhotoModalOpen = true;
    },
    closeDeletePhotoModal() {
      this.isDeletePhotoModalOpen = false;
    },
    deletePhoto() {
      // In a real application, you would delete the photo from the database
      console.log('Deleting photo:', this.currentPhoto);
      
      // Remove the photo from the current album
      if (this.currentAlbum.photos.length > 0) {
        this.currentAlbum.photos.splice(this.currentPhotoIndex, 1);
        
        // Adjust current photo index if needed
        if (this.currentPhotoIndex >= this.currentAlbum.photos.length) {
          this.currentPhotoIndex = Math.max(0, this.currentAlbum.photos.length - 1);
        }
      }
      
      this.closeDeletePhotoModal();
      
      // If no photos left, close the viewer
      if (this.currentAlbum.photos.length === 0) {
        this.closeAlbumViewer();
      }
    },
    openCreateAlbumModal() {
      this.isEditMode = false;
      this.editingAlbum = {
        id: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'private',
        photos: []
      };
      this.uploadedFiles = [];
      this.isAlbumModalOpen = true;
    },
    openEditAlbumModal(album) {
      this.isEditMode = true;
      this.editingAlbum = { ...album };
      this.uploadedFiles = [];
      this.isAlbumModalOpen = true;
    },
    closeAlbumModal() {
      this.isAlbumModalOpen = false;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileSelect(event) {
      this.handleFiles(event.target.files);
    },
    onFileDrop(event) {
      this.handleFiles(event.dataTransfer.files);
    },
    handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedFiles.push({
              name: file.name,
              preview: e.target.result,
              file: file
            });
          };
          reader.readAsDataURL(file);
        }
      }
    },
    removeUploadedFile(index) {
      this.uploadedFiles.splice(index, 1);
    },
    saveAlbum() {
      if (!this.editingAlbum.title) {
        alert('Bitte geben Sie einen Albumtitel ein.');
        return;
      }
      
      // In a real application, you would save the album to the database
      // and upload the photos to a storage service
      console.log('Saving album:', this.editingAlbum);
      console.log('Uploaded files:', this.uploadedFiles);
      
      // Generate a unique ID for new albums
      if (!this.isEditMode) {
        this.editingAlbum.id = 'album_' + Date.now();
      }
      
      // Update the albums list
      if (this.isEditMode) {
        // Update existing album
        const index = this.content.albums.findIndex(a => a.id === this.editingAlbum.id);
        if (index !== -1) {
          // In WeWeb, you would typically use a workflow to update the content
          console.log('Album updated:', this.editingAlbum);
        }
      } else {
        // Add new album
        const newAlbum = {
          ...this.editingAlbum,
          photoCount: this.uploadedFiles.length,
          coverImage: this.uploadedFiles.length > 0 ? this.uploadedFiles[0].preview : 'https://source.unsplash.com/random/300x200/?wedding'
        };
        
        // In WeWeb, you would typically use a workflow to update the content
        console.log('New album added:', newAlbum);
      }
      
      this.closeAlbumModal();
      this.filterAlbums();
    }
  }
};
</script>

<style scoped>
/* Photo Gallery styles */
.lv-photo-gallery {
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

.lv-p-2 {
  padding: 0.5rem;
}

.lv-p-0 {
  padding: 0;
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

/* Card styles */
.lv-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.lv-card-body {
  padding: 1rem;
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

/* Action bar styles */
.lv-filter-group {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  flex-wrap: wrap;
}

.lv-filter-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.375rem 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
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

.lv-search-container {
  position: relative;
  max-width: 300px;
  margin-left: auto;
}

.lv-search-input {
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

.lv-search-input:focus {
  border-color: #f8c630;
  outline: 0;
}

/* Albums grid styles */
.lv-albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.lv-album-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.lv-album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.lv-album-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.lv-album-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.lv-album-card:hover .lv-album-img {
  transform: scale(1.05);
}

.lv-album-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.lv-album-card:hover .lv-album-overlay {
  opacity: 1;
}

.lv-album-actions {
  display: flex;
  gap: 10px;
}

.lv-album-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.lv-status-private {
  background-color: #e8eaf6;
  color: #3f51b5;
}

.lv-status-shared {
  background-color: #e8f5e9;
  color: #4caf50;
}

.lv-status-public {
  background-color: #fff8e1;
  color: #ffc107;
}

.lv-album-info {
  padding: 1rem;
}

.lv-album-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.lv-album-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
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
  color: #f8c630;
  background-color: transparent;
  border-color: #f8c630;
}

.lv-btn-outline:hover {
  color: #fff;
  background-color: #f8c630;
  border-color: #f8c630;
}

.lv-btn-light {
  color: #212529;
  background-color: #fff;
  border-color: #fff;
}

.lv-btn-light:hover {
  background-color: #f8f9fa;
  border-color: #f8f9fa;
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

.lv-modal-lg {
  max-width: 800px;
}

.lv-modal-xl {
  max-width: 1140px;
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
  max-height: 90vh;
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
  overflow-y: auto;
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

/* Photo viewer styles */
.lv-photo-viewer {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.lv-photo-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.lv-photo-container {
  flex: 1;
  position: relative;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lv-photo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lv-photo-nav {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.lv-photo-nav-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.lv-photo-nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.lv-photo-nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lv-photo-info {
  background-color: #f9f9f9;
  padding: 1rem;
}

.lv-photo-caption {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.lv-photo-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #777;
}

.lv-photo-thumbnails {
  height: 100px;
  overflow-x: auto;
  background-color: #f1f1f1;
}

.lv-thumbnails-container {
  display: flex;
  padding: 0.5rem;
  gap: 0.5rem;
}

.lv-thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.lv-thumbnail:hover {
  border-color: #f8c630;
}

.lv-thumbnail-active {
  border-color: #f8c630;
}

.lv-thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-photo-actions {
  display: flex;
  gap: 0.5rem;
}

/* Form styles */
.lv-form-group {
  margin-bottom: 1rem;
}

.lv-form-label {
  display: inline-block;
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

.lv-radio-group {
  margin-top: 0.5rem;
}

.lv-radio {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.lv-radio input {
  margin-right: 0.5rem;
}

/* Upload styles */
.lv-upload-container {
  margin-top: 0.5rem;
}

.lv-upload-dropzone {
  border: 2px dashed #ddd;
  border-radius: 4px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.lv-upload-dropzone:hover {
  border-color: #f8c630;
}

.lv-upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #999;
}

.lv-upload-text {
  color: #777;
}

.lv-upload-input {
  display: none;
}

.lv-upload-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.lv-upload-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}

.lv-upload-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-upload-preview-remove {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
}

@media (max-width: 768px) {
  .lv-text-right {
    text-align: left;
    margin-top: 1rem;
  }
  
  .lv-search-container {
    margin-left: 0;
    max-width: 100%;
  }
  
  .lv-photo-viewer {
    height: auto;
  }
  
  .lv-photo-main {
    height: 50vh;
  }
  
  .lv-photo-thumbnails {
    height: auto;
  }
  
  .lv-thumbnails-container {
    flex-wrap: wrap;
  }
  
  .lv-thumbnail {
    width: 60px;
    height: 60px;
  }
  
  .lv-photo-actions {
    flex-wrap: wrap;
  }
  
  .lv-photo-actions .lv-btn {
    flex: 1;
  }
}
</style>
