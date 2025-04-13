export default {
  editor: {
    label: {
      de: "Budgetplaner",
      en: "Budget Planner"
    },
    icon: "attach_money",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Budgetplaner",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Verwalten Sie Ihr Hochzeitsbudget und verfolgen Sie Ihre Ausgaben",
      bindable: true,
    },
    totalBudget: {
      label: {
        de: "Gesamtbudget",
        en: "Total Budget"
      },
      type: "Number",
      defaultValue: 25000,
      bindable: true,
    },
    budgetStats: {
      label: {
        de: "Budget-Statistiken",
        en: "Budget Statistics"
      },
      type: "Array",
      defaultValue: [
        { value: "25.000 €", label: "Gesamtbudget", textClass: "" },
        { value: "16.250 €", label: "Ausgegeben", textClass: "lv-text-info" },
        { value: "8.750 €", label: "Verbleibend", textClass: "lv-text-success" }
      ],
      bindable: true,
      section: "Statistik",
    },
    budgetPercentage: {
      label: {
        de: "Budget-Prozentsatz",
        en: "Budget Percentage"
      },
      type: "Number",
      defaultValue: 65,
      bindable: true,
      section: "Statistik",
    },
    totalBudgetLabel: {
      label: {
        de: "Gesamtbudget-Label",
        en: "Total Budget Label"
      },
      type: "Text",
      defaultValue: "Gesamtbudget:",
      bindable: true,
      section: "Labels",
    },
    updateButtonText: {
      label: {
        de: "Aktualisieren-Button Text",
        en: "Update Button Text"
      },
      type: "Text",
      defaultValue: "Aktualisieren",
      bindable: true,
      section: "Buttons",
    },
    addExpenseButtonText: {
      label: {
        de: "Neue Ausgabe-Button Text",
        en: "Add Expense Button Text"
      },
      type: "Text",
      defaultValue: "Neue Ausgabe",
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
        { label: "Bezahlt", value: "paid" },
        { label: "Ausstehend", value: "pending" },
        { label: "Überbudget", value: "over-budget", warning: true }
      ],
      bindable: true,
      section: "Filter",
    },
    categoryFilters: {
      label: {
        de: "Kategorie-Filter",
        en: "Category Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle Kategorien", value: "all" },
        { label: "Location", value: "venue" },
        { label: "Catering", value: "catering" },
        { label: "Dekoration", value: "decoration" },
        { label: "Kleidung", value: "attire" },
        { label: "Fotografie", value: "photography" },
        { label: "Musik", value: "music" },
        { label: "Transport", value: "transportation" },
        { label: "Sonstiges", value: "other" }
      ],
      bindable: true,
      section: "Filter",
    },
    categories: {
      label: {
        de: "Budget-Kategorien",
        en: "Budget Categories"
      },
      type: "Array",
      defaultValue: [
        { 
          id: "venue", 
          title: "Location", 
          icon: "🏰", 
          budget: "10.000 €", 
          spent: "8.000 €", 
          percentage: 80,
          expenses: [
            { name: "Schloss Elmau", amount: "8.000 €" }
          ]
        },
        { 
          id: "catering", 
          title: "Catering", 
          icon: "🍽️", 
          budget: "7.000 €", 
          spent: "5.000 €", 
          percentage: 71,
          expenses: [
            { name: "Gourmet Catering", amount: "4.500 €" },
            { name: "Getränke", amount: "500 €" }
          ]
        },
        { 
          id: "decoration", 
          title: "Dekoration", 
          icon: "💐", 
          budget: "3.000 €", 
          spent: "2.000 €", 
          percentage: 67,
          expenses: [
            { name: "Blumendekoration", amount: "1.500 €" },
            { name: "Tischdekoration", amount: "500 €" }
          ]
        },
        { 
          id: "attire", 
          title: "Kleidung", 
          icon: "👰", 
          budget: "2.000 €", 
          spent: "1.250 €", 
          percentage: 63,
          expenses: [
            { name: "Brautkleid", amount: "1.000 €" },
            { name: "Accessoires", amount: "250 €" }
          ]
        },
        { 
          id: "photography", 
          title: "Fotografie", 
          icon: "📸", 
          budget: "1.500 €", 
          spent: "0 €", 
          percentage: 0,
          expenses: []
        },
        { 
          id: "music", 
          title: "Musik", 
          icon: "🎵", 
          budget: "1.000 €", 
          spent: "0 €", 
          percentage: 0,
          expenses: []
        }
      ],
      bindable: true,
      section: "Daten",
    },
    noExpensesText: {
      label: {
        de: "Keine Ausgaben Text",
        en: "No Expenses Text"
      },
      type: "Text",
      defaultValue: "Keine Ausgaben",
      bindable: true,
      section: "Labels",
    },
    addExpenseToCategoryText: {
      label: {
        de: "Ausgabe hinzufügen Text",
        en: "Add Expense Text"
      },
      type: "Text",
      defaultValue: "Ausgabe hinzufügen",
      bindable: true,
      section: "Buttons",
    },
    addCategoryText: {
      label: {
        de: "Kategorie hinzufügen Text",
        en: "Add Category Text"
      },
      type: "Text",
      defaultValue: "Neue Kategorie hinzufügen",
      bindable: true,
      section: "Buttons",
    },
    expenseListTitle: {
      label: {
        de: "Ausgabenliste Titel",
        en: "Expense List Title"
      },
      type: "Text",
      defaultValue: "Alle Ausgaben",
      bindable: true,
      section: "Labels",
    },
    expenseTableColumns: {
      label: {
        de: "Ausgabentabelle Spalten",
        en: "Expense Table Columns"
      },
      type: "Array",
      defaultValue: ["Ausgabe", "Kategorie", "Betrag", "Status", "Fälligkeitsdatum", "Aktionen"],
      bindable: true,
      section: "Tabelle",
    },
    expenses: {
      label: {
        de: "Ausgaben",
        en: "Expenses"
      },
      type: "Array",
      defaultValue: [
        { 
          name: "Schloss Elmau", 
          categoryId: "venue", 
          amount: "8.000 €", 
          status: "paid", 
          dueDate: "15.03.2025",
          notes: ""
        },
        { 
          name: "Gourmet Catering", 
          categoryId: "catering", 
          amount: "4.500 €", 
          status: "paid", 
          dueDate: "01.04.2025",
          notes: ""
        },
        { 
          name: "Getränke", 
          categoryId: "catering", 
          amount: "500 €", 
          status: "paid", 
          dueDate: "01.04.2025",
          notes: ""
        },
        { 
          name: "Blumendekoration", 
          categoryId: "decoration", 
          amount: "1.500 €", 
          status: "paid", 
          dueDate: "15.05.2025",
          notes: ""
        },
        { 
          name: "Tischdekoration", 
          categoryId: "decoration", 
          amount: "500 €", 
          status: "pending", 
          dueDate: "01.06.2025",
          notes: ""
        },
        { 
          name: "Brautkleid", 
          categoryId: "attire", 
          amount: "1.000 €", 
          status: "paid", 
          dueDate: "15.04.2025",
          notes: ""
        },
        { 
          name: "Accessoires", 
          categoryId: "attire", 
          amount: "250 €", 
          status: "pending", 
          dueDate: "01.05.2025",
          notes: ""
        }
      ],
      bindable: true,
      section: "Daten",
    },
    addExpenseTitle: {
      label: {
        de: "Ausgabe hinzufügen Titel",
        en: "Add Expense Title"
      },
      type: "Text",
      defaultValue: "Neue Ausgabe hinzufügen",
      bindable: true,
      section: "Modal",
    },
    editExpenseTitle: {
      label: {
        de: "Ausgabe bearbeiten Titel",
        en: "Edit Expense Title"
      },
      type: "Text",
      defaultValue: "Ausgabe bearbeiten",
      bindable: true,
      section: "Modal",
    },
    expenseNameLabel: {
      label: {
        de: "Ausgabenname Label",
        en: "Expense Name Label"
      },
      type: "Text",
      defaultValue: "Bezeichnung",
      bindable: true,
      section: "Formular",
    },
    expenseCategoryLabel: {
      label: {
        de: "Ausgabenkategorie Label",
        en: "Expense Category Label"
      },
      type: "Text",
      defaultValue: "Kategorie",
      bindable: true,
      section: "Formular",
    },
    expenseAmountLabel: {
      label: {
        de: "Ausgabenbetrag Label",
        en: "Expense Amount Label"
      },
      type: "Text",
      defaultValue: "Betrag",
      bindable: true,
      section: "Formular",
    },
    expenseStatusLabel: {
      label: {
        de: "Ausgabenstatus Label",
        en: "Expense Status Label"
      },
      type: "Text",
      defaultValue: "Status",
      bindable: true,
      section: "Formular",
    },
    expenseStatusOptions: {
      label: {
        de: "Ausgabenstatus Optionen",
        en: "Expense Status Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Bezahlt", value: "paid" },
        { label: "Ausstehend", value: "pending" },
        { label: "Überbudget", value: "over-budget" }
      ],
      bindable: true,
      section: "Formular",
    },
    expenseDueDateLabel: {
      label: {
        de: "Fälligkeitsdatum Label",
        en: "Due Date Label"
      },
      type: "Text",
      defaultValue: "Fälligkeitsdatum",
      bindable: true,
      section: "Formular",
    },
    expenseNotesLabel: {
      label: {
        de: "Notizen Label",
        en: "Notes Label"
      },
      type: "Text",
      defaultValue: "Notizen",
      bindable: true,
      section: "Formular",
    },
    addCategoryTitle: {
      label: {
        de: "Kategorie hinzufügen Titel",
        en: "Add Category Title"
      },
      type: "Text",
      defaultValue: "Neue Kategorie hinzufügen",
      bindable: true,
      section: "Modal",
    },
    categoryTitleLabel: {
      label: {
        de: "Kategorietitel Label",
        en: "Category Title Label"
      },
      type: "Text",
      defaultValue: "Titel",
      bindable: true,
      section: "Formular",
    },
    categoryIconLabel: {
      label: {
        de: "Kategorieicon Label",
        en: "Category Icon Label"
      },
      type: "Text",
      defaultValue: "Icon",
      bindable: true,
      section: "Formular",
    },
    categoryBudgetLabel: {
      label: {
        de: "Kategoriebudget Label",
        en: "Category Budget Label"
      },
      type: "Text",
      defaultValue: "Budget",
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
    deleteExpenseTitle: {
      label: {
        de: "Ausgabe löschen Titel",
        en: "Delete Expense Title"
      },
      type: "Text",
      defaultValue: "Ausgabe löschen",
      bindable: true,
      section: "Modal",
    },
    deleteConfirmationText: {
      label: {
        de: "Löschbestätigung Text",
        en: "Delete Confirmation Text"
      },
      type: "Text",
      defaultValue: "Sind Sie sicher, dass Sie diese Ausgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
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
