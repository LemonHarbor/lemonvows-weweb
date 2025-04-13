export default {
  editor: {
    label: {
      de: "Tischplaner",
      en: "Table Planner"
    },
    icon: "table_chart",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Tischplaner",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Erstellen Sie Ihre perfekte Sitzordnung für die Hochzeitsfeier",
      bindable: true,
    },
    // Stats Section
    totalGuests: {
      label: {
        de: "Gesamtzahl der Gäste",
        en: "Total Guests"
      },
      type: "Text",
      defaultValue: "120",
      bindable: true,
      section: "Statistiken",
    },
    totalGuestsLabel: {
      label: {
        de: "Gesamtzahl der Gäste Label",
        en: "Total Guests Label"
      },
      type: "Text",
      defaultValue: "Gäste gesamt",
      bindable: true,
      section: "Statistiken",
    },
    seatedGuests: {
      label: {
        de: "Platzierte Gäste",
        en: "Seated Guests"
      },
      type: "Text",
      defaultValue: "85",
      bindable: true,
      section: "Statistiken",
    },
    seatedGuestsLabel: {
      label: {
        de: "Platzierte Gäste Label",
        en: "Seated Guests Label"
      },
      type: "Text",
      defaultValue: "Platziert",
      bindable: true,
      section: "Statistiken",
    },
    unseatedGuests: {
      label: {
        de: "Nicht platzierte Gäste",
        en: "Unseated Guests"
      },
      type: "Text",
      defaultValue: "35",
      bindable: true,
      section: "Statistiken",
    },
    unseatedGuestsLabel: {
      label: {
        de: "Nicht platzierte Gäste Label",
        en: "Unseated Guests Label"
      },
      type: "Text",
      defaultValue: "Nicht platziert",
      bindable: true,
      section: "Statistiken",
    },
    totalTables: {
      label: {
        de: "Gesamtzahl der Tische",
        en: "Total Tables"
      },
      type: "Text",
      defaultValue: "12",
      bindable: true,
      section: "Statistiken",
    },
    totalTablesLabel: {
      label: {
        de: "Gesamtzahl der Tische Label",
        en: "Total Tables Label"
      },
      type: "Text",
      defaultValue: "Tische",
      bindable: true,
      section: "Statistiken",
    },
    // Control Panel
    controlPanelTitle: {
      label: {
        de: "Steuerung Titel",
        en: "Control Panel Title"
      },
      type: "Text",
      defaultValue: "Steuerung",
      bindable: true,
      section: "Steuerung",
    },
    tablesTitle: {
      label: {
        de: "Tische Titel",
        en: "Tables Title"
      },
      type: "Text",
      defaultValue: "Tische",
      bindable: true,
      section: "Steuerung",
    },
    roundTableBtn: {
      label: {
        de: "Runder Tisch Button",
        en: "Round Table Button"
      },
      type: "Text",
      defaultValue: "Rund",
      bindable: true,
      section: "Steuerung",
    },
    rectTableBtn: {
      label: {
        de: "Rechteckiger Tisch Button",
        en: "Rectangular Table Button"
      },
      type: "Text",
      defaultValue: "Rechteckig",
      bindable: true,
      section: "Steuerung",
    },
    ovalTableBtn: {
      label: {
        de: "Ovaler Tisch Button",
        en: "Oval Table Button"
      },
      type: "Text",
      defaultValue: "Oval",
      bindable: true,
      section: "Steuerung",
    },
    tableSizeLabel: {
      label: {
        de: "Tischgröße Label",
        en: "Table Size Label"
      },
      type: "Text",
      defaultValue: "Tischgröße",
      bindable: true,
      section: "Steuerung",
    },
    tableSizeOptions: {
      label: {
        de: "Tischgröße Optionen",
        en: "Table Size Options"
      },
      type: "Array",
      defaultValue: [
        { value: "small", label: "Klein (6 Personen)" },
        { value: "medium", label: "Mittel (8 Personen)" },
        { value: "large", label: "Groß (10 Personen)" },
        { value: "xl", label: "Sehr groß (12 Personen)" }
      ],
      bindable: true,
      section: "Steuerung",
    },
    tableColorLabel: {
      label: {
        de: "Tischfarbe Label",
        en: "Table Color Label"
      },
      type: "Text",
      defaultValue: "Tischfarbe",
      bindable: true,
      section: "Steuerung",
    },
    tableColors: {
      label: {
        de: "Tischfarben",
        en: "Table Colors"
      },
      type: "Array",
      defaultValue: [
        "#ffffff",
        "#f8e9e9",
        "#e9f8f2",
        "#e9eef8",
        "#f8f6e9"
      ],
      bindable: true,
      section: "Steuerung",
    },
    roomElementsTitle: {
      label: {
        de: "Raumelemente Titel",
        en: "Room Elements Title"
      },
      type: "Text",
      defaultValue: "Raumelemente",
      bindable: true,
      section: "Steuerung",
    },
    danceFloorBtn: {
      label: {
        de: "Tanzfläche Button",
        en: "Dance Floor Button"
      },
      type: "Text",
      defaultValue: "Tanzfläche",
      bindable: true,
      section: "Steuerung",
    },
    danceFloorLabel: {
      label: {
        de: "Tanzfläche Label",
        en: "Dance Floor Label"
      },
      type: "Text",
      defaultValue: "Tanzfläche",
      bindable: true,
      section: "Steuerung",
    },
    barBtn: {
      label: {
        de: "Bar Button",
        en: "Bar Button"
      },
      type: "Text",
      defaultValue: "Bar",
      bindable: true,
      section: "Steuerung",
    },
    barLabel: {
      label: {
        de: "Bar Label",
        en: "Bar Label"
      },
      type: "Text",
      defaultValue: "Bar",
      bindable: true,
      section: "Steuerung",
    },
    stageBtn: {
      label: {
        de: "Bühne Button",
        en: "Stage Button"
      },
      type: "Text",
      defaultValue: "Bühne",
      bindable: true,
      section: "Steuerung",
    },
    stageLabel: {
      label: {
        de: "Bühne Label",
        en: "Stage Label"
      },
      type: "Text",
      defaultValue: "Bühne",
      bindable: true,
      section: "Steuerung",
    },
    actionsTitle: {
      label: {
        de: "Aktionen Titel",
        en: "Actions Title"
      },
      type: "Text",
      defaultValue: "Aktionen",
      bindable: true,
      section: "Steuerung",
    },
    deleteSelectedBtn: {
      label: {
        de: "Löschen Button",
        en: "Delete Selected Button"
      },
      type: "Text",
      defaultValue: "Löschen",
      bindable: true,
      section: "Steuerung",
    },
    clearAllBtn: {
      label: {
        de: "Alles zurücksetzen Button",
        en: "Clear All Button"
      },
      type: "Text",
      defaultValue: "Alles zurücksetzen",
      bindable: true,
      section: "Steuerung",
    },
    saveLayoutBtn: {
      label: {
        de: "Layout speichern Button",
        en: "Save Layout Button"
      },
      type: "Text",
      defaultValue: "Layout speichern",
      bindable: true,
      section: "Steuerung",
    },
    printLayoutBtn: {
      label: {
        de: "Drucken Button",
        en: "Print Layout Button"
      },
      type: "Text",
      defaultValue: "Drucken",
      bindable: true,
      section: "Steuerung",
    },
    // Guest List
    guestListTitle: {
      label: {
        de: "Gästeliste Titel",
        en: "Guest List Title"
      },
      type: "Text",
      defaultValue: "Gästeliste",
      bindable: true,
      section: "Gästeliste",
    },
    guestSearchPlaceholder: {
      label: {
        de: "Gäste suchen Platzhalter",
        en: "Guest Search Placeholder"
      },
      type: "Text",
      defaultValue: "Gäste suchen...",
      bindable: true,
      section: "Gästeliste",
    },
    unassignedFilterBtn: {
      label: {
        de: "Nicht platziert Filter Button",
        en: "Unassigned Filter Button"
      },
      type: "Text",
      defaultValue: "Nicht platziert",
      bindable: true,
      section: "Gästeliste",
    },
    allGuestsFilterBtn: {
      label: {
        de: "Alle Gäste Filter Button",
        en: "All Guests Filter Button"
      },
      type: "Text",
      defaultValue: "Alle Gäste",
      bindable: true,
      section: "Gästeliste",
    },
    // Floor Plan
    floorPlanTitle: {
      label: {
        de: "Raumplan Titel",
        en: "Floor Plan Title"
      },
      type: "Text",
      defaultValue: "Raumplan",
      bindable: true,
      section: "Raumplan",
    },
    resetViewBtn: {
      label: {
        de: "Ansicht zurücksetzen Button",
        en: "Reset View Button"
      },
      type: "Text",
      defaultValue: "Reset",
      bindable: true,
      section: "Raumplan",
    },
    seatsLabel: {
      label: {
        de: "Plätze Label",
        en: "Seats Label"
      },
      type: "Text",
      defaultValue: "Plätze",
      bindable: true,
      section: "Raumplan",
    },
    // Table Properties Modal
    tablePropertiesTitle: {
      label: {
        de: "Tischeigenschaften Titel",
        en: "Table Properties Title"
      },
      type: "Text",
      defaultValue: "Tischeigenschaften",
      bindable: true,
      section: "Modals",
    },
    tableNameLabel: {
      label: {
        de: "Tischname Label",
        en: "Table Name Label"
      },
      type: "Text",
      defaultValue: "Tischname/Nummer",
      bindable: true,
      section: "Modals",
    },
    tableNamePlaceholder: {
      label: {
        de: "Tischname Platzhalter",
        en: "Table Name Placeholder"
      },
      type: "Text",
      defaultValue: "z.B. 1, 2, A, B oder 'Brautpaar'",
      bindable: true,
      section: "Modals",
    },
    tableCapacityLabel: {
      label: {
        de: "Tischkapazität Label",
        en: "Table Capacity Label"
      },
      type: "Text",
      defaultValue: "Kapazität",
      bindable: true,
      section: "Modals",
    },
    capacityOptions: {
      label: {
        de: "Kapazität Optionen",
        en: "Capacity Options"
      },
      type: "Array",
      defaultValue: [
        { value: 6, label: "6 Personen" },
        { value: 8, label: "8 Personen" },
        { value: 10, label: "10 Personen" },
        { value: 12, label: "12 Personen" }
      ],
      bindable: true,
      section: "Modals",
    },
    tableNotesLabel: {
      label: {
        de: "Tischnotizen Label",
        en: "Table Notes Label"
      },
      type: "Text",
      defaultValue: "Tischnotizen",
      bindable: true,
      section: "Modals",
    },
    tableNotesPlaceholder: {
      label: {
        de: "Tischnotizen Platzhalter",
        en: "Table Notes Placeholder"
      },
      type: "Text",
      defaultValue: "Zusätzliche Informationen zum Tisch",
      bindable: true,
      section: "Modals",
    },
    // Guest Assignment Modal
    guestAssignmentTitle: {
      label: {
        de: "Gast zuweisen Titel",
        en: "Guest Assignment Title"
      },
      type: "Text",
      defaultValue: "Gast zuweisen",
      bindable: true,
      section: "Modals",
    },
    selectGuestLabel: {
      label: {
        de: "Gast auswählen Label",
        en: "Select Guest Label"
      },
      type: "Text",
      defaultValue: "Gast auswählen",
      bindable: true,
      section: "Modals",
    },
    selectGuestPlaceholder: {
      label: {
        de: "Gast auswählen Platzhalter",
        en: "Select Guest Placeholder"
      },
      type: "Text",
      defaultValue: "-- Bitte wählen --",
      bindable: true,
      section: "Modals",
    },
    seatNotesLabel: {
      label: {
        de: "Sitzplatznotizen Label",
        en: "Seat Notes Label"
      },
      type: "Text",
      defaultValue: "Sitzplatznotizen",
      bindable: true,
      section: "Modals",
    },
    seatNotesPlaceholder: {
      label: {
        de: "Sitzplatznotizen Platzhalter",
        en: "Seat Notes Placeholder"
      },
      type: "Text",
      defaultValue: "Besondere Anforderungen oder Notizen",
      bindable: true,
      section: "Modals",
    },
    // Common Button Labels
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
    // Messages
    deleteSelectedMessage: {
      label: {
        de: "Löschen Nachricht",
        en: "Delete Selected Message"
      },
      type: "Text",
      defaultValue: "Ausgewähltes Element löschen",
      bindable: true,
      section: "Nachrichten",
    },
    clearAllConfirmMessage: {
      label: {
        de: "Alles zurücksetzen Bestätigungsnachricht",
        en: "Clear All Confirmation Message"
      },
      type: "Text",
      defaultValue: "Möchten Sie wirklich alle Elemente zurücksetzen?",
      bindable: true,
      section: "Nachrichten",
    },
    saveLayoutMessage: {
      label: {
        de: "Layout speichern Nachricht",
        en: "Save Layout Message"
      },
      type: "Text",
      defaultValue: "Layout gespeichert",
      bindable: true,
      section: "Nachrichten",
    },
    printLayoutMessage: {
      label: {
        de: "Drucken Nachricht",
        en: "Print Layout Message"
      },
      type: "Text",
      defaultValue: "Druckansicht wird geöffnet",
      bindable: true,
      section: "Nachrichten",
    }
  }
};
