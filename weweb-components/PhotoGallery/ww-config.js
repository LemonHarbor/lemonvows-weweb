export default {
  editor: {
    label: {
      de: "Fotogalerie",
      en: "Photo Gallery"
    },
    icon: "photo_library",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Fotogalerie",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Verwalten und teilen Sie Ihre Hochzeitsfotos",
      bindable: true,
    },
    galleryStats: {
      label: {
        de: "Galerie-Statistiken",
        en: "Gallery Statistics"
      },
      type: "Array",
      defaultValue: [
        { value: "5", label: "Alben" },
        { value: "128", label: "Fotos" },
        { value: "3", label: "Geteilt" }
      ],
      bindable: true,
      section: "Statistik",
    },
    albumFilters: {
      label: {
        de: "Album-Filter",
        en: "Album Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle Alben", value: "all" },
        { label: "Geteilte Alben", value: "shared" },
        { label: "Private Alben", value: "private" }
      ],
      bindable: true,
      section: "Filter",
    },
    searchPlaceholder: {
      label: {
        de: "Suchfeld-Platzhalter",
        en: "Search Placeholder"
      },
      type: "Text",
      defaultValue: "Alben durchsuchen...",
      bindable: true,
      section: "Suche",
    },
    createAlbumButtonText: {
      label: {
        de: "Album erstellen-Button Text",
        en: "Create Album Button Text"
      },
      type: "Text",
      defaultValue: "Album erstellen",
      bindable: true,
      section: "Buttons",
    },
    openButtonText: {
      label: {
        de: "Öffnen-Button Text",
        en: "Open Button Text"
      },
      type: "Text",
      defaultValue: "Öffnen",
      bindable: true,
      section: "Buttons",
    },
    editButtonText: {
      label: {
        de: "Bearbeiten-Button Text",
        en: "Edit Button Text"
      },
      type: "Text",
      defaultValue: "Bearbeiten",
      bindable: true,
      section: "Buttons",
    },
    photosText: {
      label: {
        de: "Fotos Text",
        en: "Photos Text"
      },
      type: "Text",
      defaultValue: "Fotos",
      bindable: true,
      section: "Labels",
    },
    privateLabel: {
      label: {
        de: "Privat Label",
        en: "Private Label"
      },
      type: "Text",
      defaultValue: "Privat",
      bindable: true,
      section: "Labels",
    },
    sharedLabel: {
      label: {
        de: "Geteilt Label",
        en: "Shared Label"
      },
      type: "Text",
      defaultValue: "Geteilt",
      bindable: true,
      section: "Labels",
    },
    publicLabel: {
      label: {
        de: "Öffentlich Label",
        en: "Public Label"
      },
      type: "Text",
      defaultValue: "Öffentlich",
      bindable: true,
      section: "Labels",
    },
    ofText: {
      label: {
        de: "Von Text",
        en: "Of Text"
      },
      type: "Text",
      defaultValue: "von",
      bindable: true,
      section: "Labels",
    },
    downloadButtonText: {
      label: {
        de: "Herunterladen-Button Text",
        en: "Download Button Text"
      },
      type: "Text",
      defaultValue: "Herunterladen",
      bindable: true,
      section: "Buttons",
    },
    shareButtonText: {
      label: {
        de: "Teilen-Button Text",
        en: "Share Button Text"
      },
      type: "Text",
      defaultValue: "Teilen",
      bindable: true,
      section: "Buttons",
    },
    deleteButtonText: {
      label: {
        de: "Löschen-Button Text",
        en: "Delete Button Text"
      },
      type: "Text",
      defaultValue: "Löschen",
      bindable: true,
      section: "Buttons",
    },
    createAlbumTitle: {
      label: {
        de: "Album erstellen Titel",
        en: "Create Album Title"
      },
      type: "Text",
      defaultValue: "Album erstellen",
      bindable: true,
      section: "Modal",
    },
    editAlbumTitle: {
      label: {
        de: "Album bearbeiten Titel",
        en: "Edit Album Title"
      },
      type: "Text",
      defaultValue: "Album bearbeiten",
      bindable: true,
      section: "Modal",
    },
    albumTitleLabel: {
      label: {
        de: "Albumtitel Label",
        en: "Album Title Label"
      },
      type: "Text",
      defaultValue: "Albumtitel",
      bindable: true,
      section: "Formular",
    },
    albumTitlePlaceholder: {
      label: {
        de: "Albumtitel Platzhalter",
        en: "Album Title Placeholder"
      },
      type: "Text",
      defaultValue: "Geben Sie einen Titel für das Album ein",
      bindable: true,
      section: "Formular",
    },
    albumDescriptionLabel: {
      label: {
        de: "Albumbeschreibung Label",
        en: "Album Description Label"
      },
      type: "Text",
      defaultValue: "Beschreibung",
      bindable: true,
      section: "Formular",
    },
    albumDescriptionPlaceholder: {
      label: {
        de: "Albumbeschreibung Platzhalter",
        en: "Album Description Placeholder"
      },
      type: "Text",
      defaultValue: "Beschreiben Sie das Album (optional)",
      bindable: true,
      section: "Formular",
    },
    albumDateLabel: {
      label: {
        de: "Albumdatum Label",
        en: "Album Date Label"
      },
      type: "Text",
      defaultValue: "Datum",
      bindable: true,
      section: "Formular",
    },
    privacyLabel: {
      label: {
        de: "Privatsphäre Label",
        en: "Privacy Label"
      },
      type: "Text",
      defaultValue: "Privatsphäre",
      bindable: true,
      section: "Formular",
    },
    privacyOptions: {
      label: {
        de: "Privatsphäre-Optionen",
        en: "Privacy Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Privat (nur für Sie sichtbar)", value: "private" },
        { label: "Geteilt (für Gäste mit Link sichtbar)", value: "shared" },
        { label: "Öffentlich (für alle Gäste sichtbar)", value: "public" }
      ],
      bindable: true,
      section: "Formular",
    },
    uploadPhotosLabel: {
      label: {
        de: "Fotos hochladen Label",
        en: "Upload Photos Label"
      },
      type: "Text",
      defaultValue: "Fotos hochladen",
      bindable: true,
      section: "Formular",
    },
    dropzoneText: {
      label: {
        de: "Dropzone Text",
        en: "Dropzone Text"
      },
      type: "Text",
      defaultValue: "Fotos hierher ziehen oder klicken zum Auswählen",
      bindable: true,
      section: "Formular",
    },
    saveButtonText: {
      label: {
        de: "Speichern-Button Text",
        en: "Save Button Text"
      },
      type: "Text",
      defaultValue: "Speichern",
      bindable: true,
      section: "Buttons",
    },
    cancelButtonText: {
      label: {
        de: "Abbrechen-Button Text",
        en: "Cancel Button Text"
      },
      type: "Text",
      defaultValue: "Abbrechen",
      bindable: true,
      section: "Buttons",
    },
    deletePhotoTitle: {
      label: {
        de: "Foto löschen Titel",
        en: "Delete Photo Title"
      },
      type: "Text",
      defaultValue: "Foto löschen",
      bindable: true,
      section: "Modal",
    },
    deletePhotoConfirmationText: {
      label: {
        de: "Foto löschen Bestätigungstext",
        en: "Delete Photo Confirmation Text"
      },
      type: "Text",
      defaultValue: "Sind Sie sicher, dass Sie dieses Foto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      bindable: true,
      section: "Modal",
    },
    albums: {
      label: {
        de: "Alben",
        en: "Albums"
      },
      type: "Array",
      defaultValue: [
        {
          id: "1",
          title: "Verlobungsfotos",
          description: "Unsere Verlobungsfotos im Park",
          date: "01.10.2024",
          status: "shared",
          photoCount: 24,
          coverImage: "https://source.unsplash.com/random/300x200/?engagement",
          photos: [
            {
              url: "https://source.unsplash.com/random/800x600/?engagement,1",
              thumbnail: "https://source.unsplash.com/random/100x100/?engagement,1",
              caption: "Verlobungsfotos im Park",
              date: "01.10.2024"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?engagement,2",
              thumbnail: "https://source.unsplash.com/random/100x100/?engagement,2",
              caption: "Verlobungsfotos am See",
              date: "01.10.2024"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?engagement,3",
              thumbnail: "https://source.unsplash.com/random/100x100/?engagement,3",
              caption: "Verlobungsfotos in der Stadt",
              date: "01.10.2024"
            }
          ]
        },
        {
          id: "2",
          title: "Pre-Wedding Shooting",
          description: "Unser Pre-Wedding Shooting am Strand",
          date: "15.03.2025",
          status: "shared",
          photoCount: 36,
          coverImage: "https://source.unsplash.com/random/300x200/?prewedding",
          photos: [
            {
              url: "https://source.unsplash.com/random/800x600/?prewedding,1",
              thumbnail: "https://source.unsplash.com/random/100x100/?prewedding,1",
              caption: "Pre-Wedding Shooting am Strand",
              date: "15.03.2025"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?prewedding,2",
              thumbnail: "https://source.unsplash.com/random/100x100/?prewedding,2",
              caption: "Pre-Wedding Shooting im Sonnenuntergang",
              date: "15.03.2025"
            }
          ]
        },
        {
          id: "3",
          title: "Location Besichtigung",
          description: "Besichtigung unserer Hochzeitslocation",
          date: "20.08.2024",
          status: "private",
          photoCount: 18,
          coverImage: "https://source.unsplash.com/random/300x200/?venue",
          photos: [
            {
              url: "https://source.unsplash.com/random/800x600/?venue,1",
              thumbnail: "https://source.unsplash.com/random/100x100/?venue,1",
              caption: "Außenansicht der Location",
              date: "20.08.2024"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?venue,2",
              thumbnail: "https://source.unsplash.com/random/100x100/?venue,2",
              caption: "Innenansicht der Location",
              date: "20.08.2024"
            }
          ]
        },
        {
          id: "4",
          title: "Hochzeitstag",
          description: "Fotos von unserem Hochzeitstag",
          date: "15.05.2025",
          status: "shared",
          photoCount: 42,
          coverImage: "https://source.unsplash.com/random/300x200/?wedding",
          photos: [
            {
              url: "https://source.unsplash.com/random/800x600/?wedding,1",
              thumbnail: "https://source.unsplash.com/random/100x100/?wedding,1",
              caption: "Zeremonie",
              date: "15.05.2025"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?wedding,2",
              thumbnail: "https://source.unsplash.com/random/100x100/?wedding,2",
              caption: "Erster Tanz",
              date: "15.05.2025"
            }
          ]
        },
        {
          id: "5",
          title: "Flitterwochen",
          description: "Fotos aus unseren Flitterwochen",
          date: "01.06.2025",
          status: "private",
          photoCount: 8,
          coverImage: "https://source.unsplash.com/random/300x200/?honeymoon",
          photos: [
            {
              url: "https://source.unsplash.com/random/800x600/?honeymoon,1",
              thumbnail: "https://source.unsplash.com/random/100x100/?honeymoon,1",
              caption: "Strand",
              date: "01.06.2025"
            },
            {
              url: "https://source.unsplash.com/random/800x600/?honeymoon,2",
              thumbnail: "https://source.unsplash.com/random/100x100/?honeymoon,2",
              caption: "Sonnenuntergang",
              date: "01.06.2025"
            }
          ]
        }
      ],
      bindable: true,
      section: "Daten",
    }
  }
};
