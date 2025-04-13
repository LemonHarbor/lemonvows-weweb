export default {
  editor: {
    label: {
      de: "Umfragen & Ankündigungen",
      en: "Polls & Announcements"
    },
    icon: "poll",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "Umfragen & Ankündigungen",
      bindable: true,
    },
    subtitle: {
      label: {
        de: "Untertitel",
        en: "Subtitle"
      },
      type: "Text",
      defaultValue: "Kommunizieren Sie mit Ihren Gästen und sammeln Sie Feedback",
      bindable: true,
    },
    pollStats: {
      label: {
        de: "Umfrage-Statistiken",
        en: "Poll Statistics"
      },
      type: "Array",
      defaultValue: [
        { value: "3", label: "Umfragen" },
        { value: "5", label: "Ankündigungen" },
        { value: "42", label: "Antworten" }
      ],
      bindable: true,
      section: "Statistik",
    },
    tabs: {
      label: {
        de: "Tabs",
        en: "Tabs"
      },
      type: "Array",
      defaultValue: [
        { id: "announcements", label: "Ankündigungen" },
        { id: "polls", label: "Umfragen" }
      ],
      bindable: true,
      section: "Tabs",
    },
    announcementFilters: {
      label: {
        de: "Ankündigungs-Filter",
        en: "Announcement Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle", value: "all" },
        { label: "Öffentlich", value: "public" },
        { label: "Privat", value: "private" }
      ],
      bindable: true,
      section: "Filter",
    },
    pollFilters: {
      label: {
        de: "Umfrage-Filter",
        en: "Poll Filters"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle", value: "all" },
        { label: "Aktiv", value: "active" },
        { label: "Abgeschlossen", value: "closed" }
      ],
      bindable: true,
      section: "Filter",
    },
    createAnnouncementButtonText: {
      label: {
        de: "Ankündigung erstellen-Button Text",
        en: "Create Announcement Button Text"
      },
      type: "Text",
      defaultValue: "Ankündigung erstellen",
      bindable: true,
      section: "Buttons",
    },
    createPollButtonText: {
      label: {
        de: "Umfrage erstellen-Button Text",
        en: "Create Poll Button Text"
      },
      type: "Text",
      defaultValue: "Umfrage erstellen",
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
    privateLabel: {
      label: {
        de: "Privat Label",
        en: "Private Label"
      },
      type: "Text",
      defaultValue: "Privat (nur enge Freunde)",
      bindable: true,
      section: "Labels",
    },
    activePollStatusText: {
      label: {
        de: "Aktive Umfrage Status Text",
        en: "Active Poll Status Text"
      },
      type: "Text",
      defaultValue: "Aktiv bis",
      bindable: true,
      section: "Labels",
    },
    closedPollStatusText: {
      label: {
        de: "Abgeschlossene Umfrage Status Text",
        en: "Closed Poll Status Text"
      },
      type: "Text",
      defaultValue: "Abgeschlossen am",
      bindable: true,
      section: "Labels",
    },
    votesText: {
      label: {
        de: "Stimmen Text",
        en: "Votes Text"
      },
      type: "Text",
      defaultValue: "Stimmen",
      bindable: true,
      section: "Labels",
    },
    totalVotesText: {
      label: {
        de: "Stimmen insgesamt Text",
        en: "Total Votes Text"
      },
      type: "Text",
      defaultValue: "Stimmen insgesamt",
      bindable: true,
      section: "Labels",
    },
    participantsText: {
      label: {
        de: "Teilnehmer Text",
        en: "Participants Text"
      },
      type: "Text",
      defaultValue: "Teilnehmer",
      bindable: true,
      section: "Labels",
    },
    voteButtonText: {
      label: {
        de: "Abstimmen-Button Text",
        en: "Vote Button Text"
      },
      type: "Text",
      defaultValue: "Abstimmen",
      bindable: true,
      section: "Buttons",
    },
    createAnnouncementTitle: {
      label: {
        de: "Ankündigung erstellen Titel",
        en: "Create Announcement Title"
      },
      type: "Text",
      defaultValue: "Ankündigung erstellen",
      bindable: true,
      section: "Modal",
    },
    editAnnouncementTitle: {
      label: {
        de: "Ankündigung bearbeiten Titel",
        en: "Edit Announcement Title"
      },
      type: "Text",
      defaultValue: "Ankündigung bearbeiten",
      bindable: true,
      section: "Modal",
    },
    announcementTitleLabel: {
      label: {
        de: "Ankündigungstitel Label",
        en: "Announcement Title Label"
      },
      type: "Text",
      defaultValue: "Titel",
      bindable: true,
      section: "Formular",
    },
    announcementContentLabel: {
      label: {
        de: "Ankündigungsinhalt Label",
        en: "Announcement Content Label"
      },
      type: "Text",
      defaultValue: "Inhalt",
      bindable: true,
      section: "Formular",
    },
    announcementDateLabel: {
      label: {
        de: "Ankündigungsdatum Label",
        en: "Announcement Date Label"
      },
      type: "Text",
      defaultValue: "Datum",
      bindable: true,
      section: "Formular",
    },
    visibilityLabel: {
      label: {
        de: "Sichtbarkeit Label",
        en: "Visibility Label"
      },
      type: "Text",
      defaultValue: "Sichtbarkeit",
      bindable: true,
      section: "Formular",
    },
    visibilityOptions: {
      label: {
        de: "Sichtbarkeit-Optionen",
        en: "Visibility Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Öffentlich (für alle sichtbar)", value: "public" },
        { label: "Privat (nur für enge Freunde sichtbar)", value: "private" }
      ],
      bindable: true,
      section: "Formular",
    },
    createPollTitle: {
      label: {
        de: "Umfrage erstellen Titel",
        en: "Create Poll Title"
      },
      type: "Text",
      defaultValue: "Umfrage erstellen",
      bindable: true,
      section: "Modal",
    },
    editPollTitle: {
      label: {
        de: "Umfrage bearbeiten Titel",
        en: "Edit Poll Title"
      },
      type: "Text",
      defaultValue: "Umfrage bearbeiten",
      bindable: true,
      section: "Modal",
    },
    pollTitleLabel: {
      label: {
        de: "Umfragetitel Label",
        en: "Poll Title Label"
      },
      type: "Text",
      defaultValue: "Titel",
      bindable: true,
      section: "Formular",
    },
    pollDescriptionLabel: {
      label: {
        de: "Umfragebeschreibung Label",
        en: "Poll Description Label"
      },
      type: "Text",
      defaultValue: "Beschreibung",
      bindable: true,
      section: "Formular",
    },
    pollEndDateLabel: {
      label: {
        de: "Umfrage-Enddatum Label",
        en: "Poll End Date Label"
      },
      type: "Text",
      defaultValue: "Enddatum",
      bindable: true,
      section: "Formular",
    },
    multipleChoiceLabel: {
      label: {
        de: "Mehrfachauswahl Label",
        en: "Multiple Choice Label"
      },
      type: "Text",
      defaultValue: "Mehrfachauswahl erlauben",
      bindable: true,
      section: "Formular",
    },
    pollOptionsLabel: {
      label: {
        de: "Antwortmöglichkeiten Label",
        en: "Poll Options Label"
      },
      type: "Text",
      defaultValue: "Antwortmöglichkeiten",
      bindable: true,
      section: "Formular",
    },
    optionPlaceholder: {
      label: {
        de: "Option Platzhalter",
        en: "Option Placeholder"
      },
      type: "Text",
      defaultValue: "Antwortmöglichkeit",
      bindable: true,
      section: "Formular",
    },
    addOptionButtonText: {
      label: {
        de: "Option hinzufügen-Button Text",
        en: "Add Option Button Text"
      },
      type: "Text",
      defaultValue: "Antwortmöglichkeit hinzufügen",
      bindable: true,
      section: "Buttons",
    },
    pollVisibilityOptions: {
      label: {
        de: "Umfrage-Sichtbarkeit-Optionen",
        en: "Poll Visibility Options"
      },
      type: "Array",
      defaultValue: [
        { label: "Alle Gäste", value: "all" },
        { label: "Nur enge Freunde", value: "friends" },
        { label: "Nur Familie", value: "family" }
      ],
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
    deleteAnnouncementTitle: {
      label: {
        de: "Ankündigung löschen Titel",
        en: "Delete Announcement Title"
      },
      type: "Text",
      defaultValue: "Ankündigung löschen",
      bindable: true,
      section: "Modal",
    },
    deleteAnnouncementConfirmationText: {
      label: {
        de: "Ankündigung löschen Bestätigungstext",
        en: "Delete Announcement Confirmation Text"
      },
      type: "Text",
      defaultValue: "Sind Sie sicher, dass Sie diese Ankündigung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      bindable: true,
      section: "Modal",
    },
    deletePollTitle: {
      label: {
        de: "Umfrage löschen Titel",
        en: "Delete Poll Title"
      },
      type: "Text",
      defaultValue: "Umfrage löschen",
      bindable: true,
      section: "Modal",
    },
    deletePollConfirmationText: {
      label: {
        de: "Umfrage löschen Bestätigungstext",
        en: "Delete Poll Confirmation Text"
      },
      type: "Text",
      defaultValue: "Sind Sie sicher, dass Sie diese Umfrage löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
      bindable: true,
      section: "Modal",
    },
    announcements: {
      label: {
        de: "Ankündigungen",
        en: "Announcements"
      },
      type: "Array",
      defaultValue: [
        {
          id: "1",
          title: "Hochzeitstermin steht fest!",
          content: "<p>Liebe Freunde und Familie,</p><p>wir freuen uns, euch mitteilen zu können, dass wir den Termin für unsere Hochzeit festgelegt haben. Wir werden am 15.05.2025 im Schloss Elmau heiraten. Bitte haltet euch diesen Tag frei!</p><p>Weitere Informationen folgen in Kürze.</p><p>Liebe Grüße,<br>Anna & Thomas</p>",
          date: "15.03.2025",
          visibility: "public"
        },
        {
          id: "2",
          title: "Informationen zur Anreise",
          content: "<p>Liebe Gäste,</p><p>hier findet ihr wichtige Informationen zur Anreise zum Schloss Elmau:</p><ul><li>Adresse: Schloss Elmau, 82493 Krün</li><li>Anreise mit dem Auto: Parkplätze sind vorhanden</li><li>Anreise mit öffentlichen Verkehrsmitteln: Shuttle-Service vom Bahnhof Klais</li></ul><p>Für Übernachtungsmöglichkeiten haben wir ein Kontingent im Schloss und in umliegenden Hotels reserviert. Bitte gebt uns bis zum 01.04.2025 Bescheid, ob ihr eine Unterkunft benötigt.</p>",
          date: "20.03.2025",
          visibility: "public"
        },
        {
          id: "3",
          title: "Junggesellenabschied - Nur für enge Freunde",
          content: "<p>Hallo Freunde,</p><p>wir planen einen Junggesellenabschied für Thomas am 01.05.2025. Wir treffen uns um 19:00 Uhr im \"Brauhaus am Markt\". Bitte haltet euch den Termin frei und gebt mir bis zum 15.04.2025 Bescheid, ob ihr dabei sein könnt.</p><p>Bitte behandelt diese Information vertraulich, es soll eine Überraschung für Thomas sein!</p><p>Viele Grüße,<br>Max (Trauzeuge)</p>",
          date: "05.04.2025",
          visibility: "private"
        }
      ],
      bindable: true,
      section: "Daten",
    },
    polls: {
      label: {
        de: "Umfragen",
        en: "Polls"
      },
      type: "Array",
      defaultValue: [
        {
          id: "1",
          title: "Menüauswahl für das Hochzeitsessen",
          description: "Bitte wählt eure bevorzugte Hauptspeise für das Hochzeitsessen. Vegetarische und vegane Optionen sind verfügbar.",
          endDate: "01.05.2025",
          status: "active",
          multipleChoice: false,
          options: [
            { text: "Rinderfilet mit Rotweinsoße", votes: 18, percentage: 45 },
            { text: "Lachsfilet mit Zitronenbutter", votes: 12, percentage: 30 },
            { text: "Vegetarische Lasagne", votes: 6, percentage: 15 },
            { text: "Veganes Gemüsecurry", votes: 4, percentage: 10 }
          ],
          selectedOptions: [],
          totalVotes: 40,
          visibility: "Alle Gäste",
          userVoted: false
        },
        {
          id: "2",
          title: "Musikwünsche für die Party",
          description: "Welche Musik sollte auf unserer Hochzeitsfeier gespielt werden? Mehrfachauswahl möglich!",
          endDate: "01.05.2025",
          status: "active",
          multipleChoice: true,
          options: [
            { text: "Aktuelle Charts", votes: 30, percentage: 75 },
            { text: "Klassiker der 80er/90er", votes: 24, percentage: 60 },
            { text: "Rock/Metal", votes: 14, percentage: 35 },
            { text: "Elektronische Musik/Techno", votes: 18, percentage: 45 },
            { text: "Traditionelle Hochzeitsmusik", votes: 10, percentage: 25 }
          ],
          selectedOptions: [],
          totalVotes: 40,
          visibility: "Alle Gäste",
          userVoted: false
        },
        {
          id: "3",
          title: "Datum für den Polterabend",
          description: "Wann soll der Polterabend stattfinden? Bitte wählt das Datum, an dem ihr Zeit habt.",
          endDate: "01.03.2025",
          status: "closed",
          multipleChoice: false,
          options: [
            { text: "27.04.2025", votes: 15, percentage: 50 },
            { text: "04.05.2025", votes: 10, percentage: 33 },
            { text: "11.05.2025", votes: 5, percentage: 17 }
          ],
          selectedOptions: [],
          totalVotes: 30,
          visibility: "Alle Gäste",
          userVoted: true
        }
      ],
      bindable: true,
      section: "Daten",
    }
  }
};
