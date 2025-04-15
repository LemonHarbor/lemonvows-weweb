export default {
  editor: {
    label: {
      de: "Dashboard",
      en: "Dashboard"
    },
    icon: "dashboard",
  },
  properties: {
    coupleNames: {
      label: {
        de: "Namen des Paares",
        en: "Couple Names"
      },
      type: "Text",
      defaultValue: "Anna & Thomas",
      bindable: true,
    },
    weddingDate: {
      label: {
        de: "Hochzeitsdatum",
        en: "Wedding Date"
      },
      type: "Text",
      defaultValue: "15. August 2025",
      bindable: true,
    },
    weddingLocation: {
      label: {
        de: "Hochzeitslocation",
        en: "Wedding Location"
      },
      type: "Text",
      defaultValue: "Schloss Elmau",
      bindable: true,
    },
    daysUntilWedding: {
      label: {
        de: "Tage bis zur Hochzeit",
        en: "Days Until Wedding"
      },
      type: "Number",
      defaultValue: 127,
      bindable: true,
    },
    quickAccessTiles: {
      label: {
        de: "Schnellzugriff-Kacheln",
        en: "Quick Access Tiles"
      },
      type: "Array",
      defaultValue: [
        { icon: "👥", title: "Gäste", description: "120 Einladungen", link: "#guests" },
        { icon: "💰", title: "Budget", description: "25.000 € Budget", link: "#budget" },
        { icon: "📅", title: "Zeitplan", description: "15 offene Aufgaben", link: "#timeline" },
        { icon: "🪑", title: "Tischplan", description: "12 Tische geplant", link: "#tables" },
        { icon: "🤝", title: "Dienstleister", description: "8 Dienstleister", link: "#vendors" },
        { icon: "📸", title: "Galerie", description: "3 Alben", link: "#gallery" },
        { icon: "📊", title: "Umfragen", description: "2 aktive Umfragen", link: "#polls" },
        { icon: "⚙️", title: "Einstellungen", description: "Anpassen", link: "#settings" }
      ],
      bindable: true,
      section: "Schnellzugriff",
    },
    tasksTitle: {
      label: {
        de: "Aufgaben-Titel",
        en: "Tasks Title"
      },
      type: "Text",
      defaultValue: "Anstehende Aufgaben",
      bindable: true,
      section: "Aufgaben",
    },
    tasks: {
      label: {
        de: "Aufgaben",
        en: "Tasks"
      },
      type: "Array",
      defaultValue: [
        { title: "Menü mit Caterer besprechen", dueDate: "20.04.2025", priority: "high", completed: false },
        { title: "Einladungen versenden", dueDate: "30.04.2025", priority: "medium", completed: false },
        { title: "Blumendekoration auswählen", dueDate: "15.05.2025", priority: "medium", completed: false },
        { title: "Hochzeitstorte bestellen", dueDate: "01.06.2025", priority: "low", completed: false },
        { title: "Musikauswahl für DJ zusammenstellen", dueDate: "15.06.2025", priority: "medium", completed: false }
      ],
      bindable: true,
      section: "Aufgaben",
    },
    allTasksLink: {
      label: {
        de: "Link zu allen Aufgaben",
        en: "All Tasks Link"
      },
      type: "Text",
      defaultValue: "#timeline",
      bindable: true,
      section: "Aufgaben",
    },
    guestStatsTitle: {
      label: {
        de: "Gästeübersicht-Titel",
        en: "Guest Stats Title"
      },
      type: "Text",
      defaultValue: "Gästeübersicht",
      bindable: true,
      section: "Gästestatistik",
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
      section: "Gästestatistik",
    },
    guestStatsProgress: {
      label: {
        de: "Gästestatistik-Fortschritt",
        en: "Guest Stats Progress"
      },
      type: "Array",
      defaultValue: [
        { type: "success", percentage: 65 },
        { type: "danger", percentage: 10 },
        { type: "warning", percentage: 25 }
      ],
      bindable: true,
      section: "Gästestatistik",
    },
    budgetStatsTitle: {
      label: {
        de: "Budgetübersicht-Titel",
        en: "Budget Stats Title"
      },
      type: "Text",
      defaultValue: "Budgetübersicht",
      bindable: true,
      section: "Budgetstatistik",
    },
    budgetStats: {
      label: {
        de: "Budgetstatistik",
        en: "Budget Statistics"
      },
      type: "Array",
      defaultValue: [
        { value: "25.000 €", label: "Gesamtbudget", textClass: "" },
        { value: "16.250 €", label: "Ausgegeben", textClass: "lv-text-info" },
        { value: "8.750 €", label: "Verbleibend", textClass: "lv-text-success" }
      ],
      bindable: true,
      section: "Budgetstatistik",
    },
    budgetPercentage: {
      label: {
        de: "Budget-Prozentsatz",
        en: "Budget Percentage"
      },
      type: "Number",
      defaultValue: 65,
      bindable: true,
      section: "Budgetstatistik",
    },
    budgetCategories: {
      label: {
        de: "Budget-Kategorien",
        en: "Budget Categories"
      },
      type: "Array",
      defaultValue: [
        { name: "Location", spent: "8.000 €", total: "10.000 €", percentage: 80 },
        { name: "Catering", spent: "5.000 €", total: "7.000 €", percentage: 71 },
        { name: "Dekoration", spent: "2.000 €", total: "3.000 €", percentage: 67 }
      ],
      bindable: true,
      section: "Budgetstatistik",
    }
  }
};
