# LemonVows WeWeb Integration Guide

Diese Anleitung führt Sie durch den Prozess der Integration der LemonVows Hochzeitsplanungs-App in WeWeb.

## Inhaltsverzeichnis
1. [Voraussetzungen](#voraussetzungen)
2. [Komponenten importieren](#komponenten-importieren)
3. [Datenbank einrichten](#datenbank-einrichten)
4. [Seiten erstellen](#seiten-erstellen)
5. [Navigation einrichten](#navigation-einrichten)
6. [Benutzerauthentifizierung konfigurieren](#benutzerauthentifizierung-konfigurieren)
7. [Komponenten verbinden](#komponenten-verbinden)
8. [Testen und Veröffentlichen](#testen-und-veröffentlichen)

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie:
- Ein WeWeb-Konto haben
- Ein neues WeWeb-Projekt erstellt haben
- Die LemonVows-Komponenten heruntergeladen haben

## Komponenten importieren

1. **Öffnen Sie Ihr WeWeb-Projekt**
   - Melden Sie sich bei WeWeb an und öffnen Sie Ihr Projekt

2. **Importieren Sie die HTML-Komponenten**
   - Klicken Sie auf "Components" im linken Menü
   - Wählen Sie "Import Component"
   - Navigieren Sie zu den heruntergeladenen LemonVows-Komponenten
   - Importieren Sie jede HTML-Datei aus dem `components`-Ordner

3. **CSS-Stile importieren**
   - Gehen Sie zu "Styles" im linken Menü
   - Wählen Sie "Import Styles"
   - Importieren Sie die `main.css` Datei aus dem `styles`-Ordner

## Datenbank einrichten

1. **Datenmodelle erstellen**
   - Gehen Sie zu "Database" im linken Menü
   - Erstellen Sie folgende Sammlungen:
     - Users (Benutzer)
     - Guests (Gäste)
     - Budget (Budget)
     - Tasks (Aufgaben)
     - Vendors (Dienstleister)
     - Photos (Fotos)
     - Polls (Umfragen)

2. **Felder für jede Sammlung definieren**
   - **Users**: id, name, email, password, weddingDate, partner1Name, partner2Name
   - **Guests**: id, name, email, phone, address, rsvpStatus, mealChoice, group
   - **Budget**: id, category, item, amount, paid, dueDate, notes
   - **Tasks**: id, title, description, dueDate, completed, category, priority
   - **Vendors**: id, name, category, contactPerson, phone, email, status, notes
   - **Photos**: id, title, imageUrl, album, uploadDate
   - **Polls**: id, question, options, responses, endDate

## Seiten erstellen

1. **Hauptseiten erstellen**
   - Erstellen Sie folgende Seiten in WeWeb:
     - Home (Startseite)
     - Dashboard
     - Guests (Gäste)
     - Budget
     - Timeline (Zeitleiste)
     - TablePlanner (Tischplaner)
     - Vendors (Dienstleister)
     - Photos (Fotos)
     - Polls (Umfragen)
     - Settings (Einstellungen)

2. **Komponenten zu Seiten hinzufügen**
   - Ziehen Sie die Header-Komponente auf jede Seite
   - Fügen Sie die entsprechende Hauptkomponente zu jeder Seite hinzu
     - z.B. Dashboard.html auf die Dashboard-Seite

## Navigation einrichten

1. **Menü konfigurieren**
   - Bearbeiten Sie die Header-Komponente
   - Konfigurieren Sie die Navigationslinks zu den entsprechenden Seiten
   - Stellen Sie sicher, dass die aktive Seite hervorgehoben wird

2. **Routing einrichten**
   - Gehen Sie zu "Routing" im linken Menü
   - Definieren Sie Routen für jede Seite
   - Fügen Sie Authentifizierungsschutz für geschützte Seiten hinzu

## Benutzerauthentifizierung konfigurieren

1. **Authentifizierungsdienst einrichten**
   - Gehen Sie zu "Plugins" im linken Menü
   - Installieren Sie ein Authentifizierungs-Plugin (z.B. Auth0, Firebase)
   - Konfigurieren Sie die Authentifizierungseinstellungen

2. **Login- und Registrierungsseiten erstellen**
   - Erstellen Sie eine Login-Seite
   - Erstellen Sie eine Registrierungsseite
   - Verbinden Sie die Formulare mit dem Authentifizierungsdienst

## Komponenten verbinden

1. **Datenverbindungen herstellen**
   - Verbinden Sie jede Komponente mit den entsprechenden Datensammlungen
   - Konfigurieren Sie CRUD-Operationen (Create, Read, Update, Delete)
   - Stellen Sie sicher, dass Daten benutzerspezifisch gefiltert werden

2. **Workflows einrichten**
   - Erstellen Sie Workflows für komplexe Operationen
   - Beispiel: E-Mail-Benachrichtigungen bei RSVP-Änderungen
   - Beispiel: Automatische Berechnung des Budgets

## Testen und Veröffentlichen

1. **Testen Sie die Anwendung**
   - Überprüfen Sie alle Funktionen auf korrekte Funktionsweise
   - Testen Sie die Anwendung auf verschiedenen Geräten
   - Beheben Sie eventuelle Fehler

2. **Veröffentlichen Sie die Anwendung**
   - Gehen Sie zu "Publish" im linken Menü
   - Wählen Sie Ihre bevorzugte Hosting-Option
   - Klicken Sie auf "Publish"

## Datenmodell-Details

### Users (Benutzer)
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | ID | Eindeutige Benutzer-ID |
| name | Text | Name des Benutzers |
| email | Text | E-Mail-Adresse |
| password | Text | Passwort (verschlüsselt) |
| weddingDate | Datum | Hochzeitsdatum |
| partner1Name | Text | Name des ersten Partners |
| partner2Name | Text | Name des zweiten Partners |

### Guests (Gäste)
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | ID | Eindeutige Gast-ID |
| name | Text | Name des Gastes |
| email | Text | E-Mail-Adresse |
| phone | Text | Telefonnummer |
| address | Text | Adresse |
| rsvpStatus | Option | Zusage-Status (Zugesagt, Abgesagt, Ausstehend) |
| mealChoice | Option | Menüwahl |
| group | Text | Gruppenzugehörigkeit (z.B. Familie, Freunde) |

### Budget (Budget)
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | ID | Eindeutige Budget-ID |
| category | Text | Kategorie (z.B. Catering, Dekoration) |
| item | Text | Beschreibung des Postens |
| amount | Zahl | Betrag |
| paid | Boolean | Bezahlt (ja/nein) |
| dueDate | Datum | Fälligkeitsdatum |
| notes | Text | Notizen |

### Tasks (Aufgaben)
| Feld | Typ | Beschreibung |
|------|-----|-------------|
| id | ID | Eindeutige Aufgaben-ID |
| title | Text | Titel der Aufgabe |
| description | Text | Beschreibung |
| dueDate | Datum | Fälligkeitsdatum |
| completed | Boolean | Abgeschlossen (ja/nein) |
| category | Text | Kategorie |
| priority | Option | Priorität (Hoch, Mittel, Niedrig) |

## Tipps zur Fehlerbehebung

- **Komponenten werden nicht angezeigt**: Überprüfen Sie die CSS-Pfade und stellen Sie sicher, dass alle Abhängigkeiten importiert wurden.
- **Datenbank-Verbindungsfehler**: Überprüfen Sie die Berechtigungen und Feldnamen in Ihren Datenmodellen.
- **Authentifizierungsprobleme**: Stellen Sie sicher, dass Ihr Authentifizierungsdienst korrekt konfiguriert ist und die Weiterleitungs-URLs stimmen.
- **Responsive Design-Probleme**: Testen Sie die Anwendung auf verschiedenen Geräten und passen Sie die CSS-Stile entsprechend an.

## Nächste Schritte

Nach der erfolgreichen Integration können Sie:
- Benutzerdefinierte Designs erstellen
- Zusätzliche Funktionen hinzufügen
- Integrationen mit Drittanbietern einrichten (z.B. E-Mail-Marketing, Zahlungsabwicklung)
- Mehrsprachige Unterstützung hinzufügen
