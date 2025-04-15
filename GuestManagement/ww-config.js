export default {
  editor: {
    label: {
      de: "Gästemanagement",
      en: "Guest Management"
    },
    icon: "people",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Gästemanagement",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Verwalten Sie Ihre Gästeliste und verfolgen Sie RSVP-Status",
      bindable: true,
    },
    guestStats: {
      label: {
        de: "Gästestatistik",
        en: "Guest Statistics"
      },
      type: "Array",
      defaultValue: [
        { value: "120", label: "Eingeladen", textClass: "" },
        { value: "78", label: "Zugesagt", textClass: "lv-text-success" },
        { value: "12", label: "Abgesagt", textClass: "lv-text-danger" },
        { value: "30", label: "Ausstehend", textClass: "lv-text-warning" }
      ],
      bindable: true,
      section: "Statistik",
    },
    searchPlaceholder: {
      label: {
        de: "Suchfeld-Platzhalter",
        en: "Search Placeholder"
      },
      type: "Text",
      defaultValue: "Gäste suchen...",
      bindable: true,
      section: "Suche und Filter",
    },
    importButtonText: {
      label: {
        de: "Importieren-Button Text",
        en: "Import Button Text"
      },
      type: "Text",
      defaultValue: "Importieren",
      bindable: true,
      section: "Buttons",
    },
    addGuestButtonText: {
      label: {
        de: "Gast hinzufügen-Button Text",
        en: "Add Guest Button Text"
      },
      type: "Text",
      defaultValue: "Gast hinzufügen",
      bindable: true,
      section: "Buttons",
    },
    statusFilters: {
      label: {
        de: "Status-Filter",
        en: "Status Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle", value: "all" },
        { label: "Zugesagt", value: "confirmed" },
        { label: "Abgesagt", value: "declined" },
        { label: "Ausstehend", value: "pending" }
      ],
      bindable: true,
      section: "Suche und Filter",
    },
    groupFilters: {
      label: {
        de: "Gruppen-Filter",
        en: "Group Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle Gruppen", value: "all" },
        { label: "Familie", value: "family" },
        { label: "Freunde", value: "friends" },
        { label: "Kollegen", value: "colleagues" },
        { label: "Familie Partner", value: "family-partner" }
      ],
      bindable: true,
      section: "Suche und Filter",
    },
    tableColumns: {
      label: {
        de: "Tabellenspalten",
        en: "Table Columns"
      },
      type: "Array",
      defaultValue: ["Name", "Kontakt", "Gruppe", "RSVP", "Menüwahl", "+1", "Aktionen"],
      bindable: true,
      section: "Tabelle",
    },
    guests: {
      label: {
        de: "Gästeliste",
        en: "Guest List"
      },
      type: "Array",
      defaultValue: [
        { 
          name: "Maria Schmidt", 
          email: "maria.schmidt@example.com", 
          phone: "+49 123 4567890", 
          group: "family", 
          groupLabel: "Familie", 
          status: "confirmed", 
          meal: "Vegetarisch", 
          plusOne: false, 
          plusOneName: "", 
          notes: "Tante der Braut" 
        },
        { 
          name: "Peter Klein", 
          email: "peter.klein@example.com", 
          phone: "+49 123 4567891", 
          group: "family", 
          groupLabel: "Familie", 
          status: "confirmed", 
          meal: "Fleisch", 
          plusOne: true, 
          plusOneName: "Anna Klein", 
          notes: "Onkel des Bräutigams" 
        },
        { 
          name: "Lisa Müller", 
          email: "lisa.mueller@example.com", 
          phone: "+49 123 4567892", 
          group: "friends", 
          groupLabel: "Freunde", 
          status: "declined", 
          meal: "", 
          plusOne: false, 
          plusOneName: "", 
          notes: "Freundin aus der Uni" 
        },
        { 
          name: "Thomas Wagner", 
          email: "thomas.wagner@example.com", 
          phone: "+49 123 4567893", 
          group: "colleagues", 
          groupLabel: "Kollegen", 
          status: "pending", 
          meal: "", 
          plusOne: false, 
          plusOneName: "", 
          notes: "Arbeitskollege" 
        },
        { 
          name: "Sarah Becker", 
          email: "sarah.becker@example.com", 
          phone: "+49 123 4567894", 
          group: "friends", 
          groupLabel: "Freunde", 
          status: "confirmed", 
          meal: "Vegetarisch", 
          plusOne: true, 
          plusOneName: "Max Becker", 
          notes: "Freundin aus der Schule" 
        }
      ],
      bindable: true,
      section: "Daten",
    },
    prevPageText: {
      label: {
        de: "Vorherige Seite Text",
        en: "Previous Page Text"
      },
      type: "Text",
      defaultValue: "Zurück",
      bindable: true,
      section: "Paginierung",
    },
    nextPageText: {
      label: {
        de: "Nächste Seite Text",
        en: "Next Page Text"
      },
      type: "Text",
      defaultValue: "Weiter",
      bindable: true,
      section: "Paginierung",
    },
    addGuestTitle: {
      label: {
        de: "Gast hinzufügen Titel",
        en: "Add Guest Title"
      },
      type: "Text",
      defaultValue: "Gast hinzufügen",
      bindable: true,
      section: "Modal",
    },
    editGuestTitle: {
      label: {
        de: "Gast bearbeiten Titel",
        en: "Edit Guest Title"
      },
      type: "Text",
      defaultValue: "Gast bearbeiten",
      bindable: true,
      section: "Modal",
    },
    nameLabel: {
      label: {
        de: "Name Label",
        en: "Name Label"
      },
      type: "Text",
      defaultValue: "Name",
      bindable: true,
      section: "Formular",
    },
    emailLabel: {
      label: {
        de: "E-Mail Label",
        en: "Email Label"
      },
      type: "Text",
      defaultValue: "E-Mail",
      bindable: true,
      section: "Formular",
    },
    phoneLabel: {
      label: {
        de: "Telefon Label",
        en: "Phone Label"
      },
      type: "Text",
      defaultValue: "Telefon",
      bindable: true,
      section: "Formular",
    },
    groupLabel: {
      label: {
        de: "Gruppe Label",
        en: "Group Label"
      },
      type: "Text",
      defaultValue: "Gruppe",
      bindable: true,
      section: "Formular",
    },
    groupOptions: {
      label: {
        de: "Gruppen-Optionen",
        en: "Group Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Familie", value: "family" },
        { label: "Freunde", value: "friends" },
        { label: "Kollegen", value: "colleagues" },
        { label: "Familie Partner", value: "family-partner" }
      ],
      bindable: true,
      section: "Formular",
    },
    rsvpLabel: {
      label: {
        de: "RSVP-Status Label",
        en: "RSVP Status Label"
      },
      type: "Text",
      defaultValue: "RSVP-Status",
      bindable: true,
      section: "Formular",
    },
    rsvpOptions: {
      label: {
        de: "RSVP-Optionen",
        en: "RSVP Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Ausstehend", value: "pending" },
        { label: "Zugesagt", value: "confirmed" },
        { label: "Abgesagt", value: "declined" }
      ],
      bindable: true,
      section: "Formular",
    },
    mealLabel: {
      label: {
        de: "Menüwahl Label",
        en: "Meal Choice Label"
      },
      type: "Text",
      defaultValue: "Menüwahl",
      bindable: true,
      section: "Formular",
    },
    mealOptions: {
      label: {
        de: "Menü-Optionen",
        en: "Meal Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Fleisch", value: "meat" },
        { label: "Fisch", value: "fish" },
        { label: "Vegetarisch", value: "vegetarian" },
        { label: "Vegan", value: "vegan" }
      ],
      bindable: true,
      section: "Formular",
    },
    plusOneLabel: {
      label: {
        de: "Plus-Eins Label",
        en: "Plus One Label"
      },
      type: "Text",
      defaultValue: "Plus-Eins erlaubt",
      bindable: true,
      section: "Formular",
    },
    plusOneNameLabel: {
      label: {
        de: "Name der Begleitperson Label",
        en: "Plus One Name Label"
      },
      type: "Text",
      defaultValue: "Name der Begleitperson",
      bindable: true,
      section: "Formular",
    },
    notesLabel: {
      label: {
        de: "Notizen Label",
        en: "Notes Label"
      },
      type: "Text",
      defaultValue: "Notizen",
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
    deleteGuestTitle: {
      label: {
        de: "Gast löschen Titel",
        en: "Delete Guest Title"
      },
      type: "Text",
      defaultValue: "Gast löschen",
      bindable: true,
      section: "Modal",
    },
    deleteConfirmationText: {
      label: {
        de: "Löschbestätigung Text",
        en: "Delete Confirmation Text"
      },
      type: "Text",
      defaultValue: "Sind Sie sicher, dass Sie diesen Gast löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      bindable: true,
      section: "Modal",
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
    }
  }
};
