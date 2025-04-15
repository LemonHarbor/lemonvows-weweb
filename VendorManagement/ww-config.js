export default {
  editor: {
    label: {
      de: "Dienstleister-Management",
      en: "Vendor Management"
    },
    icon: "business",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Dienstleister-Management",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Verwalten Sie alle Dienstleister für Ihre Hochzeit an einem Ort",
      bindable: true,
    },
    // Stats Section
    totalVendors: {
      label: {
        de: "Gesamtzahl der Dienstleister",
        en: "Total Vendors"
      },
      type: "Text",
      defaultValue: "15",
      bindable: true,
      section: "Statistiken",
    },
    totalVendorsLabel: {
      label: {
        de: "Gesamtzahl der Dienstleister Label",
        en: "Total Vendors Label"
      },
      type: "Text",
      defaultValue: "Dienstleister",
      bindable: true,
      section: "Statistiken",
    },
    bookedVendors: {
      label: {
        de: "Gebuchte Dienstleister",
        en: "Booked Vendors"
      },
      type: "Text",
      defaultValue: "8",
      bindable: true,
      section: "Statistiken",
    },
    bookedVendorsLabel: {
      label: {
        de: "Gebuchte Dienstleister Label",
        en: "Booked Vendors Label"
      },
      type: "Text",
      defaultValue: "Gebucht",
      bindable: true,
      section: "Statistiken",
    },
    contactedVendors: {
      label: {
        de: "Kontaktierte Dienstleister",
        en: "Contacted Vendors"
      },
      type: "Text",
      defaultValue: "4",
      bindable: true,
      section: "Statistiken",
    },
    contactedVendorsLabel: {
      label: {
        de: "Kontaktierte Dienstleister Label",
        en: "Contacted Vendors Label"
      },
      type: "Text",
      defaultValue: "In Kontakt",
      bindable: true,
      section: "Statistiken",
    },
    pendingVendors: {
      label: {
        de: "Ausstehende Dienstleister",
        en: "Pending Vendors"
      },
      type: "Text",
      defaultValue: "3",
      bindable: true,
      section: "Statistiken",
    },
    pendingVendorsLabel: {
      label: {
        de: "Ausstehende Dienstleister Label",
        en: "Pending Vendors Label"
      },
      type: "Text",
      defaultValue: "Offen",
      bindable: true,
      section: "Statistiken",
    },
    // Filter Buttons
    allFilterBtn: {
      label: {
        de: "Alle Filter Button",
        en: "All Filter Button"
      },
      type: "Text",
      defaultValue: "Alle",
      bindable: true,
      section: "Filter",
    },
    bookedFilterBtn: {
      label: {
        de: "Gebucht Filter Button",
        en: "Booked Filter Button"
      },
      type: "Text",
      defaultValue: "Gebucht",
      bindable: true,
      section: "Filter",
    },
    contactedFilterBtn: {
      label: {
        de: "In Kontakt Filter Button",
        en: "Contacted Filter Button"
      },
      type: "Text",
      defaultValue: "In Kontakt",
      bindable: true,
      section: "Filter",
    },
    pendingFilterBtn: {
      label: {
        de: "Offen Filter Button",
        en: "Pending Filter Button"
      },
      type: "Text",
      defaultValue: "Offen",
      bindable: true,
      section: "Filter",
    },
    // Search
    searchPlaceholder: {
      label: {
        de: "Suche Platzhalter",
        en: "Search Placeholder"
      },
      type: "Text",
      defaultValue: "Dienstleister suchen...",
      bindable: true,
      section: "Suche",
    },
    // Action Buttons
    addVendorBtn: {
      label: {
        de: "Dienstleister hinzufügen Button",
        en: "Add Vendor Button"
      },
      type: "Text",
      defaultValue: "Dienstleister hinzufügen",
      bindable: true,
      section: "Aktionen",
    },
    // Category Buttons
    allCategoriesBtn: {
      label: {
        de: "Alle Kategorien Button",
        en: "All Categories Button"
      },
      type: "Text",
      defaultValue: "Alle Kategorien",
      bindable: true,
      section: "Kategorien",
    },
    venueCategoryBtn: {
      label: {
        de: "Location Kategorie Button",
        en: "Venue Category Button"
      },
      type: "Text",
      defaultValue: "Location",
      bindable: true,
      section: "Kategorien",
    },
    cateringCategoryBtn: {
      label: {
        de: "Catering Kategorie Button",
        en: "Catering Category Button"
      },
      type: "Text",
      defaultValue: "Catering",
      bindable: true,
      section: "Kategorien",
    },
    photographyCategoryBtn: {
      label: {
        de: "Fotografie Kategorie Button",
        en: "Photography Category Button"
      },
      type: "Text",
      defaultValue: "Fotografie",
      bindable: true,
      section: "Kategorien",
    },
    musicCategoryBtn: {
      label: {
        de: "Musik Kategorie Button",
        en: "Music Category Button"
      },
      type: "Text",
      defaultValue: "Musik",
      bindable: true,
      section: "Kategorien",
    },
    decorationCategoryBtn: {
      label: {
        de: "Dekoration Kategorie Button",
        en: "Decoration Category Button"
      },
      type: "Text",
      defaultValue: "Dekoration",
      bindable: true,
      section: "Kategorien",
    },
    cakeCategoryBtn: {
      label: {
        de: "Hochzeitstorte Kategorie Button",
        en: "Cake Category Button"
      },
      type: "Text",
      defaultValue: "Hochzeitstorte",
      bindable: true,
      section: "Kategorien",
    },
    transportationCategoryBtn: {
      label: {
        de: "Transport Kategorie Button",
        en: "Transportation Category Button"
      },
      type: "Text",
      defaultValue: "Transport",
      bindable: true,
      section: "Kategorien",
    },
    attireCategoryBtn: {
      label: {
        de: "Kleidung Kategorie Button",
        en: "Attire Category Button"
      },
      type: "Text",
      defaultValue: "Kleidung",
      bindable: true,
      section: "Kategorien",
    },
    beautyCategoryBtn: {
      label: {
        de: "Friseur & Make-up Kategorie Button",
        en: "Beauty Category Button"
      },
      type: "Text",
      defaultValue: "Friseur & Make-up",
      bindable: true,
      section: "Kategorien",
    },
    otherCategoryBtn: {
      label: {
        de: "Sonstiges Kategorie Button",
        en: "Other Category Button"
      },
      type: "Text",
      defaultValue: "Sonstiges",
      bindable: true,
      section: "Kategorien",
    },
    // Vendor Card Labels
    contactLabel: {
      label: {
        de: "Kontakt Label",
        en: "Contact Label"
      },
      type: "Text",
      defaultValue: "Kontakt:",
      bindable: true,
      section: "Karten",
    },
    phoneLabel: {
      label: {
        de: "Telefon Label",
        en: "Phone Label"
      },
      type: "Text",
      defaultValue: "Telefon:",
      bindable: true,
      section: "Karten",
    },
    emailLabel: {
      label: {
        de: "E-Mail Label",
        en: "Email Label"
      },
      type: "Text",
      defaultValue: "E-Mail:",
      bindable: true,
      section: "Karten",
    },
    priceLabel: {
      label: {
        de: "Preis Label",
        en: "Price Label"
      },
      type: "Text",
      defaultValue: "Preis:",
      bindable: true,
      section: "Karten",
    },
    detailsBtn: {
      label: {
        de: "Details Button",
        en: "Details Button"
      },
      type: "Text",
      defaultValue: "Details",
      bindable: true,
      section: "Karten",
    },
    editBtn: {
      label: {
        de: "Bearbeiten Button",
        en: "Edit Button"
      },
      type: "Text",
      defaultValue: "Bearbeiten",
      bindable: true,
      section: "Karten",
    },
    // Modal Titles
    addVendorTitle: {
      label: {
        de: "Dienstleister hinzufügen Titel",
        en: "Add Vendor Title"
      },
      type: "Text",
      defaultValue: "Dienstleister hinzufügen",
      bindable: true,
      section: "Modals",
    },
    editVendorTitle: {
      label: {
        de: "Dienstleister bearbeiten Titel",
        en: "Edit Vendor Title"
      },
      type: "Text",
      defaultValue: "Dienstleister bearbeiten",
      bindable: true,
      section: "Modals",
    },
    vendorDetailsTitle: {
      label: {
        de: "Dienstleister Details Titel",
        en: "Vendor Details Title"
      },
      type: "Text",
      defaultValue: "Dienstleister Details",
      bindable: true,
      section: "Modals",
    },
    // Form Labels
    nameLabel: {
      label: {
        de: "Name Label",
        en: "Name Label"
      },
      type: "Text",
      defaultValue: "Name*",
      bindable: true,
      section: "Formular",
    },
    namePlaceholder: {
      label: {
        de: "Name Platzhalter",
        en: "Name Placeholder"
      },
      type: "Text",
      defaultValue: "Name des Dienstleisters",
      bindable: true,
      section: "Formular",
    },
    categoryLabel: {
      label: {
        de: "Kategorie Label",
        en: "Category Label"
      },
      type: "Text",
      defaultValue: "Kategorie*",
      bindable: true,
      section: "Formular",
    },
    categoryPlaceholder: {
      label: {
        de: "Kategorie Platzhalter",
        en: "Category Placeholder"
      },
      type: "Text",
      defaultValue: "Bitte wählen",
      bindable: true,
      section: "Formular",
    },
    contactPersonLabel: {
      label: {
        de: "Kontaktperson Label",
        en: "Contact Person Label"
      },
      type: "Text",
      defaultValue: "Kontaktperson",
      bindable: true,
      section: "Formular",
    },
    contactPersonPlaceholder: {
      label: {
        de: "Kontaktperson Platzhalter",
        en: "Contact Person Placeholder"
      },
      type: "Text",
      defaultValue: "Name der Kontaktperson",
      bindable: true,
      section: "Formular",
    },
    statusLabel: {
      label: {
        de: "Status Label",
        en: "Status Label"
      },
      type: "Text",
      defaultValue: "Status",
      bindable: true,
      section: "Formular",
    },
    pendingStatusOption: {
      label: {
        de: "Offen Status Option",
        en: "Pending Status Option"
      },
      type: "Text",
      defaultValue: "Offen",
      bindable: true,
      section: "Formular",
    },
    contactedStatusOption: {
      label: {
        de: "In Kontakt Status Option",
        en: "Contacted Status Option"
      },
      type: "Text",
      defaultValue: "In Kontakt",
      bindable: true,
      section: "Formular",
    },
    quoteStatusOption: {
      label: {
        de: "Angebot erhalten Status Option",
        en: "Quote Status Option"
      },
      type: "Text",
      defaultValue: "Angebot erhalten",
      bindable: true,
      section: "Formular",
    },
    bookedStatusOption: {
      label: {
        de: "Gebucht Status Option",
        en: "Booked Status Option"
      },
      type: "Text",
      defaultValue: "Gebucht",
      bindable: true,
      section: "Formular",
    },
    rejectedStatusOption: {
      label: {
        de: "Abgelehnt Status Option",
        en: "Rejected Status Option"
      },
      type: "Text",
      defaultValue: "Abgelehnt",
      bindable: true,
      section: "Formular",
    },
    phonePlaceholder: {
      label: {
        de: "Telefon Platzhalter",
        en: "Phone Placeholder"
      },
      type: "Text",
      defaultValue: "Telefonnummer",
      bindable: true,
      section: "Formular",
    },
    emailPlaceholder: {
      label: {
        de: "E-Mail Platzhalter",
        en: "Email Placeholder"
      },
      type: "Text",
      defaultValue: "E-Mail-Adresse",
      bindable: true,
      section: "Formular",
    },
    websiteLabel: {
      label: {
        de: "Website Label",
        en: "Website Label"
      },
      type: "Text",
      defaultValue: "Website",
      bindable: true,
      section: "Formular",
    },
    websitePlaceholder: {
      label: {
        de: "Website Platzhalter",
        en: "Website Placeholder"
      },
      type: "Text",
      defaultValue: "Website-URL",
      bindable: true,
      section: "Formular",
    },
    priceLowOption: {
      label: {
        de: "Preis günstig Option",
        en: "Price Low Option"
      },
      type: "Text",
      defaultValue: "€ (günstig)",
      bindable: true,
      section: "Formular",
    },
    priceMediumOption: {
      label: {
        de: "Preis mittel Option",
        en: "Price Medium Option"
      },
      type: "Text",
      defaultValue: "€€ (mittel)",
      bindable: true,
      section: "Formular",
    },
    priceHighOption: {
      label: {
        de: "Preis gehoben Option",
        en: "Price High Option"
      },
      type: "Text",
      defaultValue: "€€€ (gehoben)",
      bindable: true,
      section: "Formular",
    },
    priceLuxuryOption: {
      label: {
        de: "Preis luxus Option",
        en: "Price Luxury Option"
      },
      type: "Text",
      defaultValue: "€€€€ (luxus)",
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
    notesPlaceholder: {
      label: {
        de: "Notizen Platzhalter",
        en: "Notes Placeholder"
      },
      type: "Text",
      defaultValue: "Zusätzliche Informationen zum Dienstleister",
      bindable: true,
      section: "Formular",
    },
    // Details Modal
    contactInfoTitle: {
      label: {
        de: "Kontaktinformationen Titel",
        en: "Contact Information Title"
      },
      type: "Text",
      defaultValue: "Kontaktinformationen",
      bindable: true,
      section: "Details",
    },
    detailsTitle: {
      label: {
        de: "Details Titel",
        en: "Details Title"
      },
      type: "Text",
      defaultValue: "Details",
      bindable: true,
      section: "Details",
    },
    // Button Labels
    cancelBtn: {
      label: {
        de: "Abbrechen Button",
        en: "Cancel Button"
      },
      type: "Text",
      defaultValue: "Abbrechen",
      bindable: true,
      section: "Buttons",
    },
    saveBtn: {
      label: {
        de: "Speichern Button",
        en: "Save Button"
      },
      type: "Text",
      defaultValue: "Speichern",
      bindable: true,
      section: "Buttons",
    },
    closeBtn: {
      label: {
        de: "Schließen Button",
        en: "Close Button"
      },
      type: "Text",
      defaultValue: "Schließen",
      bindable: true,
      section: "Buttons",
    },
    // Messages
    requiredFieldsMessage: {
      label: {
        de: "Pflichtfelder Nachricht",
        en: "Required Fields Message"
      },
      type: "Text",
      defaultValue: "Bitte füllen Sie alle Pflichtfelder aus.",
      bindable: true,
      section: "Nachrichten",
    }
  }
};
