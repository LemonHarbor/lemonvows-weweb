<template>
  <div class="lv-photo-gallery">
    <div class="lv-container">
      <!-- Header Section -->
      <div class="lv-photo-header lv-mb-3">
        <div class="lv-card">
          <div class="lv-card-body lv-p-3">
            <div class="lv-row">
              <div class="lv-col lv-col-md-6">
                <h2>{{ content.title || 'Fotogalerie' }}</h2>
                <p>{{ content.subtitle || 'Teilen und verwalten Sie Ihre Hochzeitsfotos' }}</p>
              </div>
              <div class="lv-col lv-col-md-6">
                <div class="lv-stats-container">
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ albums.length }}</div>
                    <div class="lv-stat-label">{{ content.albumsLabel || 'Alben' }}</div>
                  </div>
                  <div class="lv-stat-item">
                    <div class="lv-stat-value">{{ totalPhotos }}</div>
                    <div class="lv-stat-label">{{ content.photosLabel || 'Fotos' }}</div>
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
              <input type="text" class="lv-form-control lv-search-input" :placeholder="content.searchPlaceholder || 'Alben und Fotos suchen...'" v-model="searchQuery" @input="filterAlbums">
              <button class="lv-search-btn">🔍</button>
            </div>
          </div>
          <div class="lv-col lv-col-md-6 lv-text-right">
            <div class="lv-button-group">
              <button class="lv-btn lv-btn-primary" @click="openAlbumModal">{{ content.createAlbumBtn || 'Album erstellen' }}</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Albums Grid -->
      <div class="lv-albums-grid lv-mb-4">
        <div v-for="album in filteredAlbums" :key="album.id" class="lv-album-card" @click="openAlbum(album)">
          <div class="lv-album-cover">
            <img :src="album.cover_photo_url || content.defaultCoverUrl || 'https://via.placeholder.com/300x200'" alt="Album Cover">
            <div class="lv-album-photo-count">{{ getAlbumPhotoCount(album.id) }} {{ content.photosLabel || 'Fotos' }}</div>
          </div>
          <div class="lv-album-info">
            <h3 class="lv-album-title">{{ album.name }}</h3>
            <p class="lv-album-description">{{ album.description || '' }}</p>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredAlbums.length === 0" class="lv-empty-state">
          <div class="lv-card">
            <div class="lv-card-body lv-text-center lv-p-5">
              <div class="lv-empty-icon">📷</div>
              <h3>{{ content.emptyStateTitle || 'Keine Alben gefunden' }}</h3>
              <p>{{ content.emptyStateMessage || 'Erstellen Sie Ihr erstes Fotoalbum, um Ihre Hochzeitsfotos zu teilen.' }}</p>
              <button class="lv-btn lv-btn-primary lv-mt-3" @click="openAlbumModal">
                {{ content.createAlbumBtn || 'Album erstellen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Selected Album View (when an album is selected) -->
      <div v-if="selectedAlbum" class="lv-album-view">
        <div class="lv-album-header lv-mb-3">
          <div class="lv-row">
            <div class="lv-col lv-col-md-6">
              <button class="lv-btn lv-btn-sm lv-btn-outline lv-back-btn" @click="closeAlbum">
                &larr; {{ content.backToAlbumsBtn || 'Zurück zu Alben' }}
              </button>
              <h2 class="lv-mt-2">{{ selectedAlbum.name }}</h2>
              <p>{{ selectedAlbum.description || '' }}</p>
            </div>
            <div class="lv-col lv-col-md-6 lv-text-right">
              <div class="lv-button-group">
                <button class="lv-btn lv-btn-outline" @click="editAlbum(selectedAlbum)">
                  {{ content.editAlbumBtn || 'Album bearbeiten' }}
                </button>
                <button class="lv-btn lv-btn-primary" @click="openUploadModal">
                  {{ content.uploadPhotosBtn || 'Fotos hochladen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Photos Grid -->
        <div class="lv-photos-grid">
          <div v-for="photo in albumPhotos" :key="photo.id" class="lv-photo-card" @click="openPhotoModal(photo)">
            <img :src="photo.thumbnail_url || photo.url" :alt="photo.title || 'Photo'">
          </div>
          
          <!-- Empty Album State -->
          <div v-if="albumPhotos.length === 0" class="lv-empty-state">
            <div class="lv-card">
              <div class="lv-card-body lv-text-center lv-p-5">
                <div class="lv-empty-icon">🖼️</div>
                <h3>{{ content.emptyAlbumTitle || 'Keine Fotos in diesem Album' }}</h3>
                <p>{{ content.emptyAlbumMessage || 'Laden Sie Fotos hoch, um dieses Album zu füllen.' }}</p>
                <button class="lv-btn lv-btn-primary lv-mt-3" @click="openUploadModal">
                  {{ content.uploadPhotosBtn || 'Fotos hochladen' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Album Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isAlbumModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ isEditingAlbum ? content.editAlbumTitle || 'Album bearbeiten' : content.createAlbumTitle || 'Album erstellen' }}</h3>
            <button class="lv-modal-close" @click="closeAlbumModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="albumName">{{ content.albumNameLabel || 'Albumname' }}*</label>
              <input type="text" class="lv-form-control" id="albumName" v-model="currentAlbum.name" required>
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="albumDescription">{{ content.albumDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="albumDescription" v-model="currentAlbum.description" rows="3"></textarea>
            </div>
            <div class="lv-form-group">
              <div class="lv-checkbox-container">
                <input type="checkbox" id="albumPublic" class="lv-checkbox" v-model="currentAlbum.is_public">
                <label for="albumPublic">{{ content.publicAlbumLabel || 'Öffentliches Album (für Gäste sichtbar)' }}</label>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button v-if="isEditingAlbum" class="lv-btn lv-btn-danger lv-mr-auto" @click="openDeleteAlbumModal">
              {{ content.deleteAlbumBtn || 'Album löschen' }}
            </button>
            <button class="lv-btn lv-btn-outline" @click="closeAlbumModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="saveAlbum">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Upload Photos Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isUploadModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.uploadPhotosTitle || 'Fotos hochladen' }}</h3>
            <button class="lv-modal-close" @click="closeUploadModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-upload-area" @click="triggerFileInput" @dragover.prevent @drop="onFileDrop">
              <input type="file" ref="fileInput" style="display: none" multiple accept="image/*" @change="onFileSelect">
              <div class="lv-upload-icon">📤</div>
              <p>{{ content.dropFilesText || 'Dateien hier ablegen oder klicken, um auszuwählen' }}</p>
              <p class="lv-upload-hint">{{ content.uploadHint || 'JPG, PNG oder GIF, max. 10MB pro Datei' }}</p>
            </div>
            
            <div v-if="selectedFiles.length > 0" class="lv-selected-files lv-mt-3">
              <h4>{{ content.selectedFilesLabel || 'Ausgewählte Dateien' }} ({{ selectedFiles.length }})</h4>
              <div class="lv-file-list">
                <div v-for="(file, index) in selectedFiles" :key="index" class="lv-file-item">
                  <div class="lv-file-preview">
                    <img :src="getFilePreview(file)" alt="Preview">
                  </div>
                  <div class="lv-file-info">
                    <div class="lv-file-name">{{ file.name }}</div>
                    <div class="lv-file-size">{{ formatFileSize(file.size) }}</div>
                  </div>
                  <button class="lv-btn-icon lv-remove-file" @click="removeFile(index)">&times;</button>
                </div>
              </div>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeUploadModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="uploadFiles" :disabled="selectedFiles.length === 0 || isUploading">
              {{ isUploading ? content.uploadingText || 'Wird hochgeladen...' : content.uploadButtonText || 'Hochladen' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Photo Modal -->
    <div class="lv-modal lv-modal-fullscreen" :class="{ 'lv-modal-open': isPhotoModalOpen }">
      <div class="lv-modal-dialog lv-modal-lg">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ selectedPhoto ? selectedPhoto.title || 'Foto' : 'Foto' }}</h3>
            <button class="lv-modal-close" @click="closePhotoModal">&times;</button>
          </div>
          <div class="lv-modal-body lv-p-0">
            <div class="lv-photo-view">
              <button class="lv-photo-nav lv-photo-prev" @click="prevPhoto" v-if="hasPrevPhoto">&lsaquo;</button>
              <div class="lv-photo-container">
                <img v-if="selectedPhoto" :src="selectedPhoto.url" :alt="selectedPhoto.title || 'Photo'">
              </div>
              <button class="lv-photo-nav lv-photo-next" @click="nextPhoto" v-if="hasNextPhoto">&rsaquo;</button>
            </div>
          </div>
          <div class="lv-modal-footer">
            <div class="lv-photo-info">
              <div v-if="selectedPhoto && selectedPhoto.description" class="lv-photo-description">
                {{ selectedPhoto.description }}
              </div>
              <div class="lv-photo-meta">
                {{ selectedPhoto ? formatDate(selectedPhoto.created_at) : '' }}
              </div>
            </div>
            <div class="lv-photo-actions">
              <button class="lv-btn lv-btn-outline" @click="editPhoto" v-if="selectedPhoto">
                {{ content.editPhotoBtn || 'Bearbeiten' }}
              </button>
              <button class="lv-btn lv-btn-danger" @click="openDeletePhotoModal" v-if="selectedPhoto">
                {{ content.deletePhotoBtn || 'Löschen' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Photo Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isEditPhotoModalOpen }">
      <div class="lv-modal-dialog">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.editPhotoTitle || 'Foto bearbeiten' }}</h3>
            <button class="lv-modal-close" @click="closeEditPhotoModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <div class="lv-form-group">
              <label class="lv-form-label" for="photoTitle">{{ content.photoTitleLabel || 'Titel' }}</label>
              <input type="text" class="lv-form-control" id="photoTitle" v-model="currentPhoto.title">
            </div>
            <div class="lv-form-group">
              <label class="lv-form-label" for="photoDescription">{{ content.photoDescriptionLabel || 'Beschreibung' }}</label>
              <textarea class="lv-form-control" id="photoDescription" v-model="currentPhoto.description" rows="3"></textarea>
            </div>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeEditPhotoModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-primary" @click="savePhoto">{{ content.saveButtonText || 'Speichern' }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete Album Confirmation Modal -->
    <div class="lv-modal" :class="{ 'lv-modal-open': isDeleteAlbumModalOpen }">
      <div class="lv-modal-dialog lv-modal-sm">
        <div class="lv-modal-content">
          <div class="lv-modal-header">
            <h3>{{ content.deleteAlbumTitle || 'Album löschen' }}</h3>
            <button class="lv-modal-close" @click="closeDeleteAlbumModal">&times;</button>
          </div>
          <div class="lv-modal-body">
            <p>{{ content.deleteAlbumConfirmation || 'Sind Sie sicher, dass Sie dieses Album löschen möchten? Alle Fotos in diesem Album werden ebenfalls gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeleteAlbumModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deleteAlbum">{{ content.deleteButtonText || 'Löschen' }}</button>
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
            <p>{{ content.deletePhotoConfirmation || 'Sind Sie sicher, dass Sie dieses Foto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.' }}</p>
          </div>
          <div class="lv-modal-footer">
            <button class="lv-btn lv-btn-outline" @click="closeDeletePhotoModal">{{ content.cancelButtonText || 'Abbrechen' }}</button>
            <button class="lv-btn lv-btn-danger" @click="deletePhoto">{{ content.deleteButtonText || 'Löschen' }}</button>
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
      
      // Data
      albums: [],
      photos: [],
      filteredAlbums: [],
      albumPhotos: [],
      
      // UI state
      searchQuery: '',
      selectedAlbum: null,
      selectedPhoto: null,
      selectedPhotoIndex: -1,
      
      // Modals
      isAlbumModalOpen: false,
      isUploadModalOpen: false,
      isPhotoModalOpen: false,
      isEditPhotoModalOpen: false,
      isDeleteAlbumModalOpen: false,
      isDeletePhotoModalOpen: false,
      
      // Editing state
      isEditingAlbum: false,
      currentAlbum: this.getEmptyAlbum(),
      currentPhoto: this.getEmptyPhoto(),
      
      // Upload state
      selectedFiles: [],
      isUploading: false
    };
  },
  computed: {
    totalPhotos() {
      return this.photos.length;
    },
    hasPrevPhoto() {
      return this.selectedPhotoIndex > 0;
    },
    hasNextPhoto() {
      return this.selectedPhotoIndex < this.albumPhotos.length - 1;
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
        this.loadAlbums(),
        this.loadPhotos()
      ]);
      
      // Initialize filtered albums
      this.filterAlbums();
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
    
    async loadAlbums() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const { data, error } = await this.supabase
          .from('photo_albums')
          .select('*')
          .eq('wedding_id', this.weddingId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.albums = data || [];
      } catch (error) {
        console.error('Error loading albums:', error);
      }
    },
    
    async loadPhotos() {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        // Get all album IDs for this wedding
        const albumIds = this.albums.map(album => album.id);
        
        if (albumIds.length === 0) {
          this.photos = [];
          return;
        }
        
        const { data, error } = await this.supabase
          .from('photos')
          .select('*')
          .in('album_id', albumIds)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.photos = data || [];
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    },
    
    async loadAlbumPhotos(albumId) {
      try {
        if (!this.supabase) return;
        
        const { data, error } = await this.supabase
          .from('photos')
          .select('*')
          .eq('album_id', albumId)
          .eq('is_active', true);
        
        if (error) throw error;
        
        this.albumPhotos = data || [];
      } catch (error) {
        console.error('Error loading album photos:', error);
      }
    },
    
    async addAlbum(albumData) {
      try {
        if (!this.supabase || !this.weddingId) return;
        
        const newAlbum = {
          ...albumData,
          wedding_id: this.weddingId
        };
        
        const { data, error } = await this.supabase
          .from('photo_albums')
          .insert([newAlbum])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Add album to local state
          this.albums.push(data[0]);
          this.filterAlbums();
        }
        
        return data[0];
      } catch (error) {
        console.error('Error adding album:', error);
        return null;
      }
    },
    
    async updateAlbum(albumData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('photo_albums')
          .update(albumData)
          .eq('id', albumData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.albums.findIndex(a => a.id === albumData.id);
        if (index !== -1) {
          this.albums[index] = {
            ...this.albums[index],
            ...albumData
          };
        }
        
        // If this is the selected album, update it too
        if (this.selectedAlbum && this.selectedAlbum.id === albumData.id) {
          this.selectedAlbum = {
            ...this.selectedAlbum,
            ...albumData
          };
        }
        
        this.filterAlbums();
        
        return true;
      } catch (error) {
        console.error('Error updating album:', error);
        return false;
      }
    },
    
    async removeAlbum(albumId) {
      try {
        if (!this.supabase) return;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('photo_albums')
          .update({ is_active: false })
          .eq('id', albumId);
        
        if (error) throw error;
        
        // Also soft delete all photos in this album
        await this.supabase
          .from('photos')
          .update({ is_active: false })
          .eq('album_id', albumId);
        
        // Remove from local state
        this.albums = this.albums.filter(a => a.id !== albumId);
        this.photos = this.photos.filter(p => p.album_id !== albumId);
        
        // If this was the selected album, close it
        if (this.selectedAlbum && this.selectedAlbum.id === albumId) {
          this.selectedAlbum = null;
        }
        
        this.filterAlbums();
        
        return true;
      } catch (error) {
        console.error('Error removing album:', error);
        return false;
      }
    },
    
    async uploadPhoto(file, albumId) {
      try {
        if (!this.supabase) return null;
        
        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${this.weddingId}/${albumId}/${fileName}`;
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await this.supabase.storage
          .from('photos')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = this.supabase.storage
          .from('photos')
          .getPublicUrl(filePath);
        
        // Create thumbnail (in a real app, you might want to generate this server-side)
        // For now, we'll just use the same URL
        const thumbnailUrl = publicUrl;
        
        // Add record to photos table
        const { data: photoData, error: photoError } = await this.supabase
          .from('photos')
          .insert([{
            album_id: albumId,
            storage_path: filePath,
            url: publicUrl,
            thumbnail_url: thumbnailUrl,
            title: file.name.split('.')[0], // Use filename as initial title
            uploaded_by: (await this.supabase.auth.getUser()).data.user?.id
          }])
          .select();
        
        if (photoError) throw photoError;
        
        return photoData[0];
      } catch (error) {
        console.error('Error uploading photo:', error);
        return null;
      }
    },
    
    async updatePhoto(photoData) {
      try {
        if (!this.supabase) return;
        
        const { error } = await this.supabase
          .from('photos')
          .update(photoData)
          .eq('id', photoData.id);
        
        if (error) throw error;
        
        // Update local state
        const index = this.photos.findIndex(p => p.id === photoData.id);
        if (index !== -1) {
          this.photos[index] = {
            ...this.photos[index],
            ...photoData
          };
        }
        
        // Update in album photos if present
        const albumIndex = this.albumPhotos.findIndex(p => p.id === photoData.id);
        if (albumIndex !== -1) {
          this.albumPhotos[albumIndex] = {
            ...this.albumPhotos[albumIndex],
            ...photoData
          };
        }
        
        // If this is the selected photo, update it too
        if (this.selectedPhoto && this.selectedPhoto.id === photoData.id) {
          this.selectedPhoto = {
            ...this.selectedPhoto,
            ...photoData
          };
        }
        
        return true;
      } catch (error) {
        console.error('Error updating photo:', error);
        return false;
      }
    },
    
    async removePhoto(photoId) {
      try {
        if (!this.supabase) return;
        
        // Get the photo to find its storage path
        const { data: photoData, error: getError } = await this.supabase
          .from('photos')
          .select('storage_path')
          .eq('id', photoId)
          .single();
        
        if (getError) throw getError;
        
        // Soft delete by setting is_active to false
        const { error } = await this.supabase
          .from('photos')
          .update({ is_active: false })
          .eq('id', photoId);
        
        if (error) throw error;
        
        // Remove from local state
        this.photos = this.photos.filter(p => p.id !== photoId);
        this.albumPhotos = this.albumPhotos.filter(p => p.id !== photoId);
        
        // If this was the selected photo, close it
        if (this.selectedPhoto && this.selectedPhoto.id === photoId) {
          this.closePhotoModal();
        }
        
        // Check if this was the album cover and update if needed
        if (this.selectedAlbum && this.selectedAlbum.cover_photo_url) {
          const deletedPhoto = photoData;
          if (deletedPhoto && this.selectedAlbum.cover_photo_url.includes(deletedPhoto.storage_path)) {
            // Find a new cover photo
            const newCoverPhoto = this.albumPhotos[0];
            if (newCoverPhoto) {
              await this.updateAlbum({
                id: this.selectedAlbum.id,
                cover_photo_url: newCoverPhoto.url
              });
            } else {
              await this.updateAlbum({
                id: this.selectedAlbum.id,
                cover_photo_url: null
              });
            }
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error removing photo:', error);
        return false;
      }
    },
    
    // UI Interaction Methods
    getEmptyAlbum() {
      return {
        name: '',
        description: '',
        is_public: true,
        cover_photo_url: null
      };
    },
    
    getEmptyPhoto() {
      return {
        title: '',
        description: ''
      };
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    getFilePreview(file) {
      return URL.createObjectURL(file);
    },
    
    getAlbumPhotoCount(albumId) {
      return this.photos.filter(photo => photo.album_id === albumId).length;
    },
    
    filterAlbums() {
      if (!this.searchQuery) {
        this.filteredAlbums = [...this.albums];
        return;
      }
      
      const query = this.searchQuery.toLowerCase();
      this.filteredAlbums = this.albums.filter(album => 
        album.name.toLowerCase().includes(query) || 
        (album.description && album.description.toLowerCase().includes(query))
      );
    },
    
    // Album Operations
    openAlbum(album) {
      this.selectedAlbum = album;
      this.loadAlbumPhotos(album.id);
    },
    
    closeAlbum() {
      this.selectedAlbum = null;
      this.albumPhotos = [];
    },
    
    openAlbumModal() {
      this.isEditingAlbum = false;
      this.currentAlbum = this.getEmptyAlbum();
      this.isAlbumModalOpen = true;
    },
    
    editAlbum(album) {
      this.isEditingAlbum = true;
      this.currentAlbum = { ...album };
      this.isAlbumModalOpen = true;
    },
    
    closeAlbumModal() {
      this.isAlbumModalOpen = false;
    },
    
    async saveAlbum() {
      if (!this.currentAlbum.name) {
        alert('Bitte geben Sie einen Albumnamen ein.');
        return;
      }
      
      let success = false;
      
      if (this.isEditingAlbum) {
        // Update existing album
        success = await this.updateAlbum(this.currentAlbum);
      } else {
        // Add new album
        const newAlbum = await this.addAlbum(this.currentAlbum);
        success = !!newAlbum;
        
        // If successful and it's the first album, open it
        if (success && this.albums.length === 1) {
          this.openAlbum(newAlbum);
        }
      }
      
      if (success) {
        this.closeAlbumModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Albums. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeleteAlbumModal() {
      this.isDeleteAlbumModalOpen = true;
    },
    
    closeDeleteAlbumModal() {
      this.isDeleteAlbumModalOpen = false;
    },
    
    async deleteAlbum() {
      if (!this.currentAlbum.id) return;
      
      const success = await this.removeAlbum(this.currentAlbum.id);
      
      if (success) {
        this.closeDeleteAlbumModal();
        this.closeAlbumModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Albums. Bitte versuchen Sie es erneut.');
      }
    },
    
    // Photo Operations
    openPhotoModal(photo) {
      this.selectedPhoto = photo;
      this.selectedPhotoIndex = this.albumPhotos.findIndex(p => p.id === photo.id);
      this.isPhotoModalOpen = true;
    },
    
    closePhotoModal() {
      this.isPhotoModalOpen = false;
      this.selectedPhoto = null;
      this.selectedPhotoIndex = -1;
    },
    
    prevPhoto() {
      if (this.selectedPhotoIndex > 0) {
        this.selectedPhotoIndex--;
        this.selectedPhoto = this.albumPhotos[this.selectedPhotoIndex];
      }
    },
    
    nextPhoto() {
      if (this.selectedPhotoIndex < this.albumPhotos.length - 1) {
        this.selectedPhotoIndex++;
        this.selectedPhoto = this.albumPhotos[this.selectedPhotoIndex];
      }
    },
    
    editPhoto() {
      if (!this.selectedPhoto) return;
      
      this.currentPhoto = { ...this.selectedPhoto };
      this.isEditPhotoModalOpen = true;
    },
    
    closeEditPhotoModal() {
      this.isEditPhotoModalOpen = false;
    },
    
    async savePhoto() {
      if (!this.currentPhoto.id) return;
      
      const success = await this.updatePhoto(this.currentPhoto);
      
      if (success) {
        this.closeEditPhotoModal();
      } else {
        alert('Es gab ein Problem beim Speichern des Fotos. Bitte versuchen Sie es erneut.');
      }
    },
    
    openDeletePhotoModal() {
      this.isDeletePhotoModalOpen = true;
    },
    
    closeDeletePhotoModal() {
      this.isDeletePhotoModalOpen = false;
    },
    
    async deletePhoto() {
      if (!this.selectedPhoto) return;
      
      const success = await this.removePhoto(this.selectedPhoto.id);
      
      if (success) {
        this.closeDeletePhotoModal();
        this.closePhotoModal();
      } else {
        alert('Es gab ein Problem beim Löschen des Fotos. Bitte versuchen Sie es erneut.');
      }
    },
    
    // Upload Operations
    openUploadModal() {
      this.selectedFiles = [];
      this.isUploading = false;
      this.isUploadModalOpen = true;
    },
    
    closeUploadModal() {
      this.isUploadModalOpen = false;
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    onFileSelect(event) {
      const files = Array.from(event.target.files);
      this.addFiles(files);
    },
    
    onFileDrop(event) {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      this.addFiles(files);
    },
    
    addFiles(files) {
      // Filter for images and check size
      const validFiles = files.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isUnderSizeLimit = file.size <= 10 * 1024 * 1024; // 10MB
        return isImage && isUnderSizeLimit;
      });
      
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },
    
    async uploadFiles() {
      if (!this.selectedAlbum || this.selectedFiles.length === 0) return;
      
      this.isUploading = true;
      
      try {
        // Upload each file
        const uploadPromises = this.selectedFiles.map(file => 
          this.uploadPhoto(file, this.selectedAlbum.id)
        );
        
        const results = await Promise.all(uploadPromises);
        
        // Filter out failed uploads
        const successfulUploads = results.filter(result => result !== null);
        
        // Add to local state
        this.photos = [...this.photos, ...successfulUploads];
        this.albumPhotos = [...this.albumPhotos, ...successfulUploads];
        
        // If this is the first photo in the album, set it as cover
        if (this.albumPhotos.length === successfulUploads.length && successfulUploads.length > 0) {
          await this.updateAlbum({
            id: this.selectedAlbum.id,
            cover_photo_url: successfulUploads[0].url
          });
        }
        
        // Close modal and show success message
        this.closeUploadModal();
        alert(`${successfulUploads.length} von ${this.selectedFiles.length} Fotos erfolgreich hochgeladen.`);
      } catch (error) {
        console.error('Error uploading files:', error);
        alert('Es gab ein Problem beim Hochladen der Fotos. Bitte versuchen Sie es erneut.');
      } finally {
        this.isUploading = false;
      }
    }
  }
};
</script>

<style>
.lv-photo-gallery {
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

.lv-mb-4 {
  margin-bottom: 20px;
}

.lv-mt-2 {
  margin-top: 10px;
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

.lv-mr-auto {
  margin-right: auto;
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

.lv-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.lv-back-btn {
  margin-bottom: 10px;
}

.lv-albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.lv-album-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.lv-album-card:hover {
  transform: translateY(-5px);
}

.lv-album-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.lv-album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-album-photo-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.lv-album-info {
  padding: 15px;
}

.lv-album-title {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.lv-album-description {
  margin: 0;
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lv-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.lv-photo-card {
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.lv-photo-card:hover {
  transform: scale(1.03);
}

.lv-photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-empty-state {
  grid-column: 1 / -1;
  padding: 20px;
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

.lv-modal-lg {
  max-width: 800px;
}

.lv-modal-fullscreen .lv-modal-dialog {
  max-width: 90%;
  height: 90%;
}

.lv-modal-content {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
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
  flex: 1;
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

.lv-checkbox-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.lv-checkbox {
  margin-right: 5px;
}

.lv-upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lv-upload-area:hover {
  background-color: #f8f9fa;
}

.lv-upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.lv-upload-hint {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}

.lv-selected-files {
  margin-top: 20px;
}

.lv-file-list {
  max-height: 300px;
  overflow-y: auto;
}

.lv-file-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.lv-file-preview {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
}

.lv-file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lv-file-info {
  flex: 1;
}

.lv-file-name {
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.lv-file-size {
  font-size: 12px;
  color: #666;
}

.lv-remove-file {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #dc3545;
}

.lv-photo-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  background-color: #000;
}

.lv-photo-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lv-photo-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lv-photo-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.lv-photo-nav:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.lv-photo-prev {
  left: 20px;
}

.lv-photo-next {
  right: 20px;
}

.lv-photo-info {
  flex: 1;
}

.lv-photo-description {
  margin-bottom: 5px;
}

.lv-photo-meta {
  font-size: 12px;
  color: #666;
}

.lv-photo-actions {
  display: flex;
  gap: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .lv-col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  .lv-albums-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .lv-photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .lv-photo-card {
    height: 120px;
  }
  
  .lv-modal-dialog {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
  
  .lv-modal-fullscreen .lv-modal-dialog {
    height: calc(100% - 20px);
  }
}
</style>
