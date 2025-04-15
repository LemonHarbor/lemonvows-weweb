export default {
  editor: {
    label: {
      de: "Zeitplan & Checkliste",
      en: "Timeline & Checklist"
    },
    icon: "event",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Zeitplan & Checkliste",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Verfolgen Sie wichtige Meilensteine und Aufgaben für Ihre Hochzeit",
      bindable: true,
    },
    // Stats Section
    totalMilestones: {
      label: {
        de: "Gesamtzahl der Meilensteine",
        en: "Total Milestones"
      },
      type: "Text",
      defaultValue: "25",
      bindable: true,
      section: "Statistiken",
    },
    totalMilestonesLabel: {
      label: {
        de: "Gesamtzahl der Meilensteine Label",
        en: "Total Milestones Label"
      },
      type: "Text",
      defaultValue: "Meilensteine",
      bindable: true,
      section: "Statistiken",
    },
    completedMilestones: {
      label: {
        de: "Erledigte Meilensteine",
        en: "Completed Milestones"
      },
      type: "Text",
      defaultValue: "12",
      bindable: true,
      section: "Statistiken",
    },
    completedMilestonesLabel: {
      label: {
        de: "Erledigte Meilensteine Label",
        en: "Completed Milestones Label"
      },
      type: "Text",
      defaultValue: "Erledigt",
      bindable: true,
      section: "Statistiken",
    },
    inProgressMilestones: {
      label: {
        de: "Meilensteine in Bearbeitung",
        en: "In Progress Milestones"
      },
      type: "Text",
      defaultValue: "8",
      bindable: true,
      section: "Statistiken",
    },
    inProgressMilestonesLabel: {
      label: {
        de: "Meilensteine in Bearbeitung Label",
        en: "In Progress Milestones Label"
      },
      type: "Text",
      defaultValue: "In Bearbeitung",
      bindable: true,
      section: "Statistiken",
    },
    pendingMilestones: {
      label: {
        de: "Ausstehende Meilensteine",
        en: "Pending Milestones"
      },
      type: "Text",
      defaultValue: "5",
      bindable: true,
      section: "Statistiken",
    },
    pendingMilestonesLabel: {
      label: {
        de: "Ausstehende Meilensteine Label",
        en: "Pending Milestones Label"
      },
      type: "Text",
      defaultValue: "Ausstehend",
      bindable: true,
      section: "Statistiken",
    },
    // View Toggle
    timelineViewBtn: {
      label: {
        de: "Zeitplan Button",
        en: "Timeline Button"
      },
      type: "Text",
      defaultValue: "Zeitplan",
      bindable: true,
      section: "Ansicht",
    },
    checklistViewBtn: {
      label: {
        de: "Checkliste Button",
        en: "Checklist Button"
      },
      type: "Text",
      defaultValue: "Checkliste",
      bindable: true,
      section: "Ansicht",
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
    completedFilterBtn: {
      label: {
        de: "Erledigt Filter Button",
        en: "Completed Filter Button"
      },
      type: "Text",
      defaultValue: "Erledigt",
      bindable: true,
      section: "Filter",
    },
    inProgressFilterBtn: {
      label: {
        de: "In Bearbeitung Filter Button",
        en: "In Progress Filter Button"
      },
      type: "Text",
      defaultValue: "In Bearbeitung",
      bindable: true,
      section: "Filter",
    },
    pendingFilterBtn: {
      label: {
        de: "Ausstehend Filter Button",
        en: "Pending Filter Button"
      },
      type: "Text",
      defaultValue: "Ausstehend",
      bindable: true,
      section: "Filter",
    },
    // Action Buttons
    addMilestoneBtn: {
      label: {
        de: "Meilenstein hinzufügen Button",
        en: "Add Milestone Button"
      },
      type: "Text",
      defaultValue: "Meilenstein hinzufügen",
      bindable: true,
      section: "Aktionen",
    },
    addTaskBtn: {
      label: {
        de: "Aufgabe hinzufügen Button",
        en: "Add Task Button"
      },
      type: "Text",
      defaultValue: "Aufgabe hinzufügen",
      bindable: true,
      section: "Aktionen",
    },
    // Timeline Labels
    completedLabel: {
      label: {
        de: "Erledigt Label",
        en: "Completed Label"
      },
      type: "Text",
      defaultValue: "erledigt",
      bindable: true,
      section: "Labels",
    },
    // Modal Titles
    addMilestoneTitle: {
      label: {
        de: "Meilenstein hinzufügen Titel",
        en: "Add Milestone Title"
      },
      type: "Text",
      defaultValue: "Meilenstein hinzufügen",
      bindable: true,
      section: "Modals",
    },
    editMilestoneTitle: {
      label: {
        de: "Meilenstein bearbeiten Titel",
        en: "Edit Milestone Title"
      },
      type: "Text",
      defaultValue: "Meilenstein bearbeiten",
      bindable: true,
      section: "Modals",
    },
    // Form Labels
    milestoneTitleLabel: {
      label: {
        de: "Meilenstein Titel Label",
        en: "Milestone Title Label"
      },
      type: "Text",
      defaultValue: "Titel",
      bindable: true,
      section: "Formular",
    },
    milestoneDateLabel: {
      label: {
        de: "Meilenstein Datum Label",
        en: "Milestone Date Label"
      },
      type: "Text",
      defaultValue: "Datum",
      bindable: true,
      section: "Formular",
    },
    milestoneDescriptionLabel: {
      label: {
        de: "Meilenstein Beschreibung Label",
        en: "Milestone Description Label"
      },
      type: "Text",
      defaultValue: "Beschreibung",
      bindable: true,
      section: "Formular",
    },
    milestoneStatusLabel: {
      label: {
        de: "Meilenstein Status Label",
        en: "Milestone Status Label"
      },
      type: "Text",
      defaultValue: "Status",
      bindable: true,
      section: "Formular",
    },
    pendingStatusOption: {
      label: {
        de: "Ausstehend Status Option",
        en: "Pending Status Option"
      },
      type: "Text",
      defaultValue: "Ausstehend",
      bindable: true,
      section: "Formular",
    },
    inProgressStatusOption: {
      label: {
        de: "In Bearbeitung Status Option",
        en: "In Progress Status Option"
      },
      type: "Text",
      defaultValue: "In Bearbeitung",
      bindable: true,
      section: "Formular",
    },
    completedStatusOption: {
      label: {
        de: "Erledigt Status Option",
        en: "Completed Status Option"
      },
      type: "Text",
      defaultValue: "Erledigt",
      bindable: true,
      section: "Formular",
    },
    milestoneSectionLabel: {
      label: {
        de: "Meilenstein Zeitabschnitt Label",
        en: "Milestone Section Label"
      },
      type: "Text",
      defaultValue: "Zeitabschnitt",
      bindable: true,
      section: "Formular",
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
