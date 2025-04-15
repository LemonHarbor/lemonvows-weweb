export default {
  editor: {
    label: {
      de: "Header",
      en: "Header"
    },
    icon: "menu",
  },
  properties: {
    title: {
      label: {
        de: "Titel",
        en: "Title"
      },
      type: "Text",
      defaultValue: "LemonVows",
      bindable: true,
    },
    logoSrc: {
      label: {
        de: "Logo URL",
        en: "Logo URL"
      },
      type: "Text",
      defaultValue: "../assets/logo.svg",
      bindable: true,
    },
    logoAlt: {
      label: {
        de: "Logo Alt-Text",
        en: "Logo Alt Text"
      },
      type: "Text",
      defaultValue: "LemonVows Logo",
      bindable: true,
    },
    navItems: {
      label: {
        de: "Navigationseinträge",
        en: "Navigation Items"
      },
      type: "Array",
      defaultValue: [
        { text: "Dashboard", link: "#dashboard" },
        { text: "Gäste", link: "#guests" },
        { text: "Budget", link: "#budget" },
        { text: "Zeitplan", link: "#timeline" },
        { text: "Tischplan", link: "#tables" },
        { text: "Dienstleister", link: "#vendors" },
        { text: "Galerie", link: "#gallery" },
        { text: "Umfragen", link: "#polls" }
      ],
      bindable: true,
      section: "Navigation",
    },
    userMenuItems: {
      label: {
        de: "Benutzermenü-Einträge",
        en: "User Menu Items"
      },
      type: "Array",
      defaultValue: [
        { text: "Einstellungen", link: "#settings" },
        { text: "Abmelden", link: "#logout" }
      ],
      bindable: true,
      section: "Benutzermenü",
    },
    avatarSrc: {
      label: {
        de: "Avatar URL",
        en: "Avatar URL"
      },
      type: "Text",
      defaultValue: "../assets/avatar-placeholder.svg",
      bindable: true,
      section: "Benutzermenü",
    }
  }
};
