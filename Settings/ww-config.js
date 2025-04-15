export default {
  editor: {
    label: {
      de: "Einstellungen",
      en: "Settings"
    },
    icon: "settings",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Einstellungen",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Passen Sie Ihre Hochzeitsplanungs-App an Ihre Bedürfnisse an",
      bindable: true,
    },
    navigationItems: {
      label: {
        de: "Navigationseinträge",
        en: "Navigation Items"
      },
      type: "Array",
      defaultValue: [
        { id: "design", icon: "🎨", label: "Design" },
        { id: "account", icon: "👤", label: "Konto" },
        { id: "notifications", icon: "🔔", label: "Benachrichtigungen" },
        { id: "privacy", icon: "🔒", label: "Datenschutz" },
        { id: "language", icon: "🌐", label: "Sprache" },
        { id: "export", icon: "📤", label: "Daten exportieren" }
      ],
      bindable: true,
      section: "Navigation",
    },
    // Design Tab
    colorSchemeTitle: {
      label: {
        de: "Farbschema Titel",
        en: "Color Scheme Title"
      },
      type: "Text",
      defaultValue: "Farbschema",
      bindable: true,
      section: "Design",
    },
    predefinedPalettesLabel: {
      label: {
        de: "Vordefinierte Paletten Label",
        en: "Predefined Palettes Label"
      },
      type: "Text",
      defaultValue: "Vordefinierte Farbpaletten",
      bindable: true,
      section: "Design",
    },
    colorPalettes: {
      label: {
        de: "Farbpaletten",
        en: "Color Palettes"
      },
      type: "Array",
      defaultValue: [
        {
          id: "default",
          name: "Zitrone & Minze",
          colors: ["#FFD166", "#06D6A0", "#118AB2", "#073B4C"]
        },
        {
          id: "romantic",
          name: "Romantisch",
          colors: ["#FFB6C1", "#FF69B4", "#FFC0CB", "#DB7093"]
        },
        {
          id: "elegant",
          name: "Elegant",
          colors: ["#2C3E50", "#34495E", "#7F8C8D", "#BDC3C7"]
        },
        {
          id: "rustic",
          name: "Rustikal",
          colors: ["#5D4037", "#795548", "#A1887F", "#D7CCC8"]
        },
        {
          id: "beach",
          name: "Strand",
          colors: ["#03A9F4", "#4FC3F7", "#B3E5FC", "#E1F5FE"]
        },
        {
          id: "garden",
          name: "Garten",
          colors: ["#8BC34A", "#AED581", "#DCEDC8", "#F1F8E9"]
        }
      ],
      bindable: true,
      section: "Design",
    },
    customColorsLabel: {
      label: {
        de: "Individuelle Farben Label",
        en: "Custom Colors Label"
      },
      type: "Text",
      defaultValue: "Individuelle Farben",
      bindable: true,
      section: "Design",
    },
    primaryColorLabel: {
      label: {
        de: "Primärfarbe Label",
        en: "Primary Color Label"
      },
      type: "Text",
      defaultValue: "Primärfarbe",
      bindable: true,
      section: "Design",
    },
    secondaryColorLabel: {
      label: {
        de: "Sekundärfarbe Label",
        en: "Secondary Color Label"
      },
      type: "Text",
      defaultValue: "Sekundärfarbe",
      bindable: true,
      section: "Design",
    },
    accentColorLabel: {
      label: {
        de: "Akzentfarbe Label",
        en: "Accent Color Label"
      },
      type: "Text",
      defaultValue: "Akzentfarbe",
      bindable: true,
      section: "Design",
    },
    textColorLabel: {
      label: {
        de: "Textfarbe Label",
        en: "Text Color Label"
      },
      type: "Text",
      defaultValue: "Textfarbe",
      bindable: true,
      section: "Design",
    },
    fontsTitle: {
      label: {
        de: "Schriftarten Titel",
        en: "Fonts Title"
      },
      type: "Text",
      defaultValue: "Schriftarten",
      bindable: true,
      section: "Design",
    },
    headingFontLabel: {
      label: {
        de: "Überschriften Label",
        en: "Heading Font Label"
      },
      type: "Text",
      defaultValue: "Überschriften",
      bindable: true,
      section: "Design",
    },
    headingFonts: {
      label: {
        de: "Überschriften Schriftarten",
        en: "Heading Fonts"
      },
      type: "Array",
      defaultValue: [
        "Playfair Display",
        "Montserrat",
        "Roboto",
        "Open Sans",
        "Lato",
        "Raleway",
        "Merriweather",
        "Poppins"
      ],
      bindable: true,
      section: "Design",
    },
    headingPreviewText: {
      label: {
        de: "Überschrift Vorschautext",
        en: "Heading Preview Text"
      },
      type: "Text",
      defaultValue: "Überschrift Vorschau",
      bindable: true,
      section: "Design",
    },
    subheadingPreviewText: {
      label: {
        de: "Unterüberschrift Vorschautext",
        en: "Subheading Preview Text"
      },
      type: "Text",
      defaultValue: "Unterüberschrift Vorschau",
      bindable: true,
      section: "Design",
    },
    bodyFontLabel: {
      label: {
        de: "Fließtext Label",
        en: "Body Font Label"
      },
      type: "Text",
      defaultValue: "Fließtext",
      bindable: true,
      section: "Design",
    },
    bodyFonts: {
      label: {
        de: "Fließtext Schriftarten",
        en: "Body Fonts"
      },
      type: "Array",
      defaultValue: [
        "Open Sans",
        "Roboto",
        "Lato",
        "Montserrat",
        "Raleway",
        "Source Sans Pro",
        "Nunito",
        "Work Sans"
      ],
      bindable: true,
      section: "Design",
    },
    bodyPreviewText1: {
      label: {
        de: "Fließtext Vorschautext 1",
        en: "Body Preview Text 1"
      },
      type: "Text",
      defaultValue: "Dies ist ein Beispieltext, um die ausgewählte Schriftart zu demonstrieren. Der Text sollte gut lesbar sein und angenehm wirken.",
      bindable: true,
      section: "Design",
    },
    bodyPreviewText2: {
      label: {
        de: "Fließtext Vorschautext 2",
        en: "Body Preview Text 2"
      },
      type: "Text",
      defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.",
      bindable: true,
      section: "Design",
    },
    appearanceTitle: {
      label: {
        de: "Erscheinungsbild Titel",
        en: "Appearance Title"
      },
      type: "Text",
      defaultValue: "Erscheinungsbild",
      bindable: true,
      section: "Design",
    },
    darkModeLabel: {
      label: {
        de: "Dunkelmodus Label",
        en: "Dark Mode Label"
      },
      type: "Text",
      defaultValue: "Dunkelmodus",
      bindable: true,
      section: "Design",
    },
    onText: {
      label: {
        de: "An Text",
        en: "On Text"
      },
      type: "Text",
      defaultValue: "An",
      bindable: true,
      section: "Design",
    },
    offText: {
      label: {
        de: "Aus Text",
        en: "Off Text"
      },
      type: "Text",
      defaultValue: "Aus",
      bindable: true,
      section: "Design",
    },
    darkModeDescription: {
      label: {
        de: "Dunkelmodus Beschreibung",
        en: "Dark Mode Description"
      },
      type: "Text",
      defaultValue: "Der Dunkelmodus reduziert die Helligkeit des Bildschirms und ist angenehmer für die Augen bei schlechten Lichtverhältnissen.",
      bindable: true,
      section: "Design",
    },
    cardCornersLabel: {
      label: {
        de: "Kartenecken Label",
        en: "Card Corners Label"
      },
      type: "Text",
      defaultValue: "Kartenecken",
      bindable: true,
      section: "Design",
    },
    cornerOptions: {
      label: {
        de: "Ecken Optionen",
        en: "Corner Options"
      },
      type: "Array",
      defaultValue: [
        { value: "rounded", label: "Abgerundet" },
        { value: "sharp", label: "Eckig" }
      ],
      bindable: true,
      section: "Design",
    },
    buttonStyleLabel: {
      label: {
        de: "Button-Stil Label",
        en: "Button Style Label"
      },
      type: "Text",
      defaultValue: "Button-Stil",
      bindable: true,
      section: "Design",
    },
    buttonStyleOptions: {
      label: {
        de: "Button-Stil Optionen",
        en: "Button Style Options"
      },
      type: "Array",
      defaultValue: [
        { value: "rounded", label: "Abgerundet" },
        { value: "pill", label: "Pill-Form" },
        { value: "sharp", label: "Eckig" }
      ],
      bindable: true,
      section: "Design",
    },
    primaryButtonText: {
      label: {
        de: "Primär-Button Text",
        en: "Primary Button Text"
      },
      type: "Text",
      defaultValue: "Primär-Button",
      bindable: true,
      section: "Design",
    },
    secondaryButtonText: {
      label: {
        de: "Sekundär-Button Text",
        en: "Secondary Button Text"
      },
      type: "Text",
      defaultValue: "Sekundär-Button",
      bindable: true,
      section: "Design",
    },
    previewTitle: {
      label: {
        de: "Vorschau Titel",
        en: "Preview Title"
      },
      type: "Text",
      defaultValue: "Vorschau",
      bindable: true,
      section: "Design",
    },
    previewOptions: {
      label: {
        de: "Vorschau Optionen",
        en: "Preview Options"
      },
      type: "Array",
      defaultValue: [
        { value: "desktop", icon: "💻", label: "Desktop" },
        { value: "mobile", icon: "📱", label: "Mobil" }
      ],
      bindable: true,
      section: "Design",
    },
    previewLogoText: {
      label: {
        de: "Vorschau Logo Text",
        en: "Preview Logo Text"
      },
      type: "Text",
      defaultValue: "LemonVows",
      bindable: true,
      section: "Design",
    },
    previewNavItem1: {
      label: {
        de: "Vorschau Nav-Eintrag 1",
        en: "Preview Nav Item 1"
      },
      type: "Text",
      defaultValue: "Dashboard",
      bindable: true,
      section: "Design",
    },
    previewNavItem2: {
      label: {
        de: "Vorschau Nav-Eintrag 2",
        en: "Preview Nav Item 2"
      },
      type: "Text",
      defaultValue: "Gäste",
      bindable: true,
      section: "Design",
    },
    previewNavItem3: {
      label: {
        de: "Vorschau Nav-Eintrag 3",
        en: "Preview Nav Item 3"
      },
      type: "Text",
      defaultValue: "Budget",
      bindable: true,
      section: "Design",
    },
    previewNavItem4: {
      label: {
        de: "Vorschau Nav-Eintrag 4",
        en: "Preview Nav Item 4"
      },
      type: "Text",
      defaultValue: "Zeitleiste",
      bindable: true,
      section: "Design",
    },
    previewCardTitle1: {
      label: {
        de: "Vorschau Karte Titel 1",
        en: "Preview Card Title 1"
      },
      type: "Text",
      defaultValue: "Willkommen zurück!",
      bindable: true,
      section: "Design",
    },
    previewCardTitle2: {
      label: {
        de: "Vorschau Karte Titel 2",
        en: "Preview Card Title 2"
      },
      type: "Text",
      defaultValue: "Nächste Aufgaben",
      bindable: true,
      section: "Design",
    },
    resetButtonText: {
      label: {
        de: "Zurücksetzen-Button Text",
        en: "Reset Button Text"
      },
      type: "Text",
      defaultValue: "Zurücksetzen",
      bindable: true,
      section: "Buttons",
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
    settingsSavedMessage: {
      label: {
        de: "Einstellungen gespeichert Nachricht",
        en: "Settings Saved Message"
      },
      type: "Text",
      defaultValue: "Einstellungen wurden erfolgreich gespeichert.",
      bindable: true,
      section: "Messages",
    },
    // Account Tab
    profileTitle: {
      label: {
        de: "Profil Titel",
        en: "Profile Title"
      },
      type: "Text",
      defaultValue: "Profil",
      bindable: true,
      section: "Account",
    },
    changePhotoText: {
      label: {
        de: "Foto ändern Text",
        en: "Change Photo Text"
      },
      type: "Text",
      defaultValue: "Ändern",
      bindable: true,
      section: "Account",
    },
    nameLabel: {
      label: {
        de: "Name Label",
        en: "Name Label"
      },
      type: "Text",
      defaultValue: "Name",
      bindable: true,
      section: "Account",
    },
    emailLabel: {
      label: {
        de: "E-Mail Label",
        en: "Email Label"
      },
      type: "Text",
      defaultValue: "E-Mail",
      bindable: true,
      section: "Account",
    },
    weddingDateLabel: {
      label: {
        de: "Hochzeitsdatum Label",
        en: "Wedding Date Label"
      },
      type: "Text",
      defaultValue: "Hochzeitsdatum",
      bindable: true,
      section: "Account",
    },
    partnerNameLabel: {
      label: {
        de: "Partner Name Label",
        en: "Partner Name Label"
      },
      type: "Text",
      defaultValue: "Name des Partners/der Partnerin",
      bindable: true,
      section: "Account",
    },
    passwordTitle: {
      label: {
        de: "Passwort Titel",
        en: "Password Title"
      },
      type: "Text",
      defaultValue: "Passwort ändern",
      bindable: true,
      section: "Account",
    },
    currentPasswordLabel: {
      label: {
        de: "Aktuelles Passwort Label",
        en: "Current Password Label"
      },
      type: "Text",
      defaultValue: "Aktuelles Passwort",
      bindable: true,
      section: "Account",
    },
    newPasswordLabel: {
      label: {
        de: "Neues Passwort Label",
        en: "New Password Label"
      },
      type: "Text",
      defaultValue: "Neues Passwort",
      bindable: true,
      section: "Account",
    },
    confirmPasswordLabel: {
      label: {
        de: "Passwort bestätigen Label",
        en: "Confirm Password Label"
      },
      type: "Text",
      defaultValue: "Passwort bestätigen",
      bindable: true,
      section: "Account",
    },
    accountSavedMessage: {
      label: {
        de: "Konto gespeichert Nachricht",
        en: "Account Saved Message"
      },
      type: "Text",
      defaultValue: "Kontoeinstellungen wurden erfolgreich gespeichert.",
      bindable: true,
      section: "Messages",
    },
    // Notifications Tab
    notificationsTitle: {
      label: {
        de: "Benachrichtigungen Titel",
        en: "Notifications Title"
      },
      type: "Text",
      defaultValue: "Benachrichtigungen",
      bindable: true,
      section: "Notifications",
    },
    emailNotificationsLabel: {
      label: {
        de: "E-Mail-Benachrichtigungen Label",
        en: "Email Notifications Label"
      },
      type: "Text",
      defaultValue: "E-Mail-Benachrichtigungen",
      bindable: true,
      section: "Notifications",
    },
    pushNotificationsLabel: {
      label: {
        de: "Push-Benachrichtigungen Label",
        en: "Push Notifications Label"
      },
      type: "Text",
      defaultValue: "Push-Benachrichtigungen",
      bindable: true,
      section: "Notifications",
    },
    reminderNotificationsLabel: {
      label: {
        de: "Erinnerungen Label",
        en: "Reminder Notifications Label"
      },
      type: "Text",
      defaultValue: "Erinnerungen",
      bindable: true,
      section: "Notifications",
    },
    guestResponsesLabel: {
      label: {
        de: "Gäste-Rückmeldungen Label",
        en: "Guest Responses Label"
      },
      type: "Text",
      defaultValue: "Gäste-Rückmeldungen",
      bindable: true,
      section: "Notifications",
    },
    marketingLabel: {
      label: {
        de: "Marketing Label",
        en: "Marketing Label"
      },
      type: "Text",
      defaultValue: "Marketing und Angebote",
      bindable: true,
      section: "Notifications",
    },
    notificationsSavedMessage: {
      label: {
        de: "Benachrichtigungen gespeichert Nachricht",
        en: "Notifications Saved Message"
      },
      type: "Text",
      defaultValue: "Benachrichtigungseinstellungen wurden erfolgreich gespeichert.",
      bindable: true,
      section: "Messages",
    },
    // Privacy Tab
    privacyTitle: {
      label: {
        de: "Datenschutz Titel",
        en: "Privacy Title"
      },
      type: "Text",
      defaultValue: "Datenschutz",
      bindable: true,
      section: "Privacy",
    },
    dataCollectionLabel: {
      label: {
        de: "Datenerfassung Label",
        en: "Data Collection Label"
      },
      type: "Text",
      defaultValue: "Datenerfassung",
      bindable: true,
      section: "Privacy",
    },
    dataCollectionDescription: {
      label: {
        de: "Datenerfassung Beschreibung",
        en: "Data Collection Description"
      },
      type: "Text",
      defaultValue: "Erlauben Sie uns, anonymisierte Nutzungsdaten zu sammeln, um unsere App zu verbessern.",
      bindable: true,
      section: "Privacy",
    },
    thirdPartyLabel: {
      label: {
        de: "Drittanbieter Label",
        en: "Third Party Label"
      },
      type: "Text",
      defaultValue: "Teilen mit Drittanbietern",
      bindable: true,
      section: "Privacy",
    },
    thirdPartyDescription: {
      label: {
        de: "Drittanbieter Beschreibung",
        en: "Third Party Description"
      },
      type: "Text",
      defaultValue: "Erlauben Sie uns, Ihre Daten mit vertrauenswürdigen Partnern zu teilen, um Ihnen relevante Angebote zu unterbreiten.",
      bindable: true,
      section: "Privacy",
    },
    cookiesLabel: {
      label: {
        de: "Cookies Label",
        en: "Cookies Label"
      },
      type: "Text",
      defaultValue: "Cookies",
      bindable: true,
      section: "Privacy",
    },
    cookiesDescription: {
      label: {
        de: "Cookies Beschreibung",
        en: "Cookies Description"
      },
      type: "Text",
      defaultValue: "Erlauben Sie die Verwendung von Cookies, um Ihre Nutzererfahrung zu verbessern.",
      bindable: true,
      section: "Privacy",
    },
    visibilityTitle: {
      label: {
        de: "Sichtbarkeit Titel",
        en: "Visibility Title"
      },
      type: "Text",
      defaultValue: "Sichtbarkeit",
      bindable: true,
      section: "Privacy",
    },
    profileVisibilityLabel: {
      label: {
        de: "Profil-Sichtbarkeit Label",
        en: "Profile Visibility Label"
      },
      type: "Text",
      defaultValue: "Profil-Sichtbarkeit",
      bindable: true,
      section: "Privacy",
    },
    guestListVisibilityLabel: {
      label: {
        de: "Gästeliste-Sichtbarkeit Label",
        en: "Guest List Visibility Label"
      },
      type: "Text",
      defaultValue: "Gästeliste-Sichtbarkeit",
      bindable: true,
      section: "Privacy",
    },
    visibilityOptions: {
      label: {
        de: "Sichtbarkeit Optionen",
        en: "Visibility Options"
      },
      type: "Array",
      defaultValue: [
        { value: "public", label: "Öffentlich" },
        { value: "friends", label: "Nur Freunde" },
        { value: "private", label: "Privat" }
      ],
      bindable: true,
      section: "Privacy",
    },
    privacySavedMessage: {
      label: {
        de: "Datenschutz gespeichert Nachricht",
        en: "Privacy Saved Message"
      },
      type: "Text",
      defaultValue: "Datenschutzeinstellungen wurden erfolgreich gespeichert.",
      bindable: true,
      section: "Messages",
    },
    // Language Tab
    languageTitle: {
      label: {
        de: "Sprache Titel",
        en: "Language Title"
      },
      type: "Text",
      defaultValue: "Sprache",
      bindable: true,
      section: "Language",
    },
    appLanguageLabel: {
      label: {
        de: "App-Sprache Label",
        en: "App Language Label"
      },
      type: "Text",
      defaultValue: "App-Sprache",
      bindable: true,
      section: "Language",
    },
    languageOptions: {
      label: {
        de: "Sprache Optionen",
        en: "Language Options"
      },
      type: "Array",
      defaultValue: [
        { value: "de", label: "Deutsch" },
        { value: "en", label: "English" },
        { value: "fr", label: "Français" },
        { value: "es", label: "Español" },
        { value: "it", label: "Italiano" }
      ],
      bindable: true,
      section: "Language",
    },
    dateFormatLabel: {
      label: {
        de: "Datumsformat Label",
        en: "Date Format Label"
      },
      type: "Text",
      defaultValue: "Datumsformat",
      bindable: true,
      section: "Language",
    },
    dateFormatOptions: {
      label: {
        de: "Datumsformat Optionen",
        en: "Date Format Options"
      },
      type: "Array",
      defaultValue: [
        { value: "dd.mm.yyyy", label: "DD.MM.YYYY (31.12.2025)" },
        { value: "mm/dd/yyyy", label: "MM/DD/YYYY (12/31/2025)" },
        { value: "yyyy-mm-dd", label: "YYYY-MM-DD (2025-12-31)" }
      ],
      bindable: true,
      section: "Language",
    },
    timeFormatLabel: {
      label: {
        de: "Zeitformat Label",
        en: "Time Format Label"
      },
      type: "Text",
      defaultValue: "Zeitformat",
      bindable: true,
      section: "Language",
    },
    timeFormatOptions: {
      label: {
        de: "Zeitformat Optionen",
        en: "Time Format Options"
      },
      type: "Array",
      defaultValue: [
        { value: "24h", label: "24-Stunden (14:30)" },
        { value: "12h", label: "12-Stunden (2:30 PM)" }
      ],
      bindable: true,
      section: "Language",
    },
    languageSavedMessage: {
      label: {
        de: "Sprache gespeichert Nachricht",
        en: "Language Saved Message"
      },
      type: "Text",
      defaultValue: "Spracheinstellungen wurden erfolgreich gespeichert.",
      bindable: true,
      section: "Messages",
    },
    // Export Tab
    exportTitle: {
      label: {
        de: "Daten exportieren Titel",
        en: "Export Data Title"
      },
      type: "Text",
      defaultValue: "Daten exportieren",
      bindable: true,
      section: "Export",
    },
    exportDescription: {
      label: {
        de: "Export Beschreibung",
        en: "Export Description"
      },
      type: "Text",
      defaultValue: "Exportieren Sie Ihre Hochzeitsplanungsdaten in verschiedenen Formaten.",
      bindable: true,
      section: "Export",
    },
    exportGuestListTitle: {
      label: {
        de: "Gästeliste exportieren Titel",
        en: "Export Guest List Title"
      },
      type: "Text",
      defaultValue: "Gästeliste",
      bindable: true,
      section: "Export",
    },
    exportGuestListDescription: {
      label: {
        de: "Gästeliste exportieren Beschreibung",
        en: "Export Guest List Description"
      },
      type: "Text",
      defaultValue: "Exportieren Sie Ihre Gästeliste mit allen Details.",
      bindable: true,
      section: "Export",
    },
    exportBudgetTitle: {
      label: {
        de: "Budget exportieren Titel",
        en: "Export Budget Title"
      },
      type: "Text",
      defaultValue: "Budget",
      bindable: true,
      section: "Export",
    },
    exportBudgetDescription: {
      label: {
        de: "Budget exportieren Beschreibung",
        en: "Export Budget Description"
      },
      type: "Text",
      defaultValue: "Exportieren Sie Ihre Budgetplanung und Ausgaben.",
      bindable: true,
      section: "Export",
    },
    exportTimelineTitle: {
      label: {
        de: "Zeitleiste exportieren Titel",
        en: "Export Timeline Title"
      },
      type: "Text",
      defaultValue: "Zeitleiste",
      bindable: true,
      section: "Export",
    },
    exportTimelineDescription: {
      label: {
        de: "Zeitleiste exportieren Beschreibung",
        en: "Export Timeline Description"
      },
      type: "Text",
      defaultValue: "Exportieren Sie Ihre Hochzeitszeitleiste und Aufgaben.",
      bindable: true,
      section: "Export",
    },
    exportAllDataTitle: {
      label: {
        de: "Alle Daten exportieren Titel",
        en: "Export All Data Title"
      },
      type: "Text",
      defaultValue: "Alle Daten",
      bindable: true,
      section: "Export",
    },
    exportAllDataDescription: {
      label: {
        de: "Alle Daten exportieren Beschreibung",
        en: "Export All Data Description"
      },
      type: "Text",
      defaultValue: "Exportieren Sie alle Ihre Hochzeitsplanungsdaten.",
      bindable: true,
      section: "Export",
    },
    exportSuccessMessage: {
      label: {
        de: "Export erfolgreich Nachricht",
        en: "Export Success Message"
      },
      type: "Text",
      defaultValue: "Die Daten wurden erfolgreich exportiert.",
      bindable: true,
      section: "Messages",
    }
  }
};
