
# Krankmeldungs-App für Netlution

Eine moderne, serverless Web-Anwendung für die Verwaltung von Krankmeldungen, optimiert für Azure Hosting.

## 🎯 Funktionen

- **Deutsche Benutzeroberfläche** - Vollständig auf Deutsch
- **Krankmeldungsformular** - Basierend auf der spezifizierten E-Mail-Vorlage
- **E-Mail-Vorschau & Versand** - Mailto-Links mit vorgefüllten Daten
- **Übersichtsseite** - Alle Krankmeldungen des Jahres
- **Responsive Design** - Funktioniert auf allen Geräten
- **Serverless-optimiert** - Perfekt für Azure Static Web Apps

## 🏗️ Technologie-Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js (Password-based)
- **Datenbank**: PostgreSQL mit Prisma ORM
- **Deployment**: Azure Static Web Apps Ready

## 🚀 Lokale Entwicklung

### Voraussetzungen

```bash
# Node.js und Yarn sollten installiert sein
node --version  # >= 18
yarn --version
```

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd krankmeldung-app/app

# Dependencies installieren
yarn install

# Umgebungsvariablen konfigurieren
cp .env.example .env
# DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET setzen

# Datenbank migrieren
npx prisma db push
npx prisma db seed

# Development Server starten
yarn dev
```

### Test-Credentials

```
E-Mail: max.mustermann@netlution.de
Passwort: test123

E-Mail: anna.schmidt@netlution.de  
Passwort: test123
```

## 📋 Projektstruktur

```
krankmeldung-app/
├── app/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── login/             # Login-Seite
│   │   ├── register/          # Registrierungs-Seite
│   │   ├── neu/               # Krankmeldung erstellen
│   │   └── uebersicht/        # Krankmeldungen anzeigen
│   ├── components/            # React Komponenten
│   │   ├── ui/               # UI-Basis-Komponenten
│   │   ├── nav-bar.tsx       # Navigation
│   │   ├── sick-leave-form.tsx # Krankmeldungsformular
│   │   └── sick-leave-list.tsx # Krankmeldungsliste
│   ├── lib/                   # Utilities & Konfiguration
│   ├── hooks/                 # Custom React Hooks
│   ├── prisma/               # Datenbank-Schema
│   └── scripts/              # Seed-Scripts
├── AZURE_DEPLOYMENT_GUIDE.md  # Azure Deployment-Anleitung
└── README.md                  # Diese Datei
```

## 🎨 Features im Detail

### Krankmeldungsformular

- **Zeitraum**: Von/Bis Datum-Picker
- **Projekte**: Dynamische Liste mit Kunde/Projekt
- **Kundeninformation**: 
  - Option 1: Kunde informiert + Vertretung
  - Option 2: Kunde nicht informiert + Kontaktdaten
- **Aufgaben**: Zu übernehmende Aufgaben
- **CC-Empfänger**: Weitere E-Mail-Empfänger

### E-Mail-Integration

```
An: krankmeldung@netlution.de
CC: Manager + weitere Empfänger
Betreff: Krankmeldung [Name] - [Datum] bis [Datum]

Inhalt:
Liebe Kolleginnen und Kollegen,
Ich falle krankheitsbedingt von [Datum] bis voraussichtlich [Datum] aus.
[...weitere Details basierend auf Formular...]
```

### Übersichtsseite

- **Aktuelle Krankmeldungen** - Hervorgehoben
- **Vergangene Krankmeldungen** - Ausgegraut
- **Detailansicht** - Schreibgeschützte Anzeige
- **Filterung** - Nach Jahr

## 🔧 Konfiguration

### Umgebungsvariablen

```env
# Datenbank
DATABASE_URL="postgresql://user:password@localhost:5432/krankmeldung"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ihr-32-zeichen-geheimer-schluessel"
```

### Prisma Schema

```prisma
model User {
  id         String      @id @default(cuid())
  name       String?
  email      String      @unique
  password   String
  manager    String?
  sickLeaves SickLeave[]
}

model SickLeave {
  id               String    @id @default(cuid())
  userId           String
  startDate        DateTime
  endDate          DateTime
  status           String    @default("active")
  customerInfoType String
  substituteName   String?
  customerContact  String?
  tasks            String?
  ccRecipients     String[]
  projects         Project[]
  user             User      @relation(fields: [userId], references: [id])
}
```

## 🚀 Deployment

### Azure Static Web Apps (Empfohlen)

Siehe detaillierte Anleitung in [AZURE_DEPLOYMENT_GUIDE.md](./AZURE_DEPLOYMENT_GUIDE.md)

1. **GitHub Repository** erstellen
2. **Azure Static Web App** erstellen
3. **Datenbank** in Azure Database for PostgreSQL einrichten
4. **Umgebungsvariablen** konfigurieren
5. **Automatisches Deployment** via GitHub Actions

### Geschätzte Kosten

- **Azure Static Web Apps**: €0 (Free Tier)
- **PostgreSQL Database**: €8-15/Monat
- **Gesamt**: ~€8-20/Monat

## 🔒 Sicherheit

- **HTTPS** - SSL/TLS verschlüsselt
- **Password Hashing** - bcrypt mit 12 Runden
- **Session Management** - NextAuth.js JWT
- **SQL Injection Schutz** - Prisma ORM
- **CSRF Protection** - NextAuth.js integriert

## ⚙️ Technische Limitationen

### Microsoft 365 EntraID

- **Aktuell**: Password-based Authentication
- **Grund**: Technische Einschränkungen der verfügbaren Tools
- **Workaround**: Migration zu EntraID in der Azure Deployment-Anleitung beschrieben

### E-Mail-Versand

- **Aktuell**: Mailto-Links (öffnet E-Mail-Client)
- **Grund**: Server-side E-Mail-Versand nicht verfügbar
- **Vorteil**: Funktioniert in allen Umgebungen, keine zusätzlichen Services nötig

## 🧪 Tests

```bash
# TypeScript Compilation
npx tsc --noEmit

# Build Test
yarn build

# Development Server
yarn dev
```

## 📱 Browser-Unterstützung

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Features**: Responsive Design, Touch-optimiert

## 🤝 Beitragen

1. Fork des Repositories
2. Feature Branch erstellen
3. Änderungen commiten
4. Pull Request erstellen

## 📄 Lizenz

Interne Unternehmensanwendung für Netlution.

## 🆘 Support

Bei Fragen oder Problemen:

1. **Dokumentation** prüfen
2. **Issues** im Repository erstellen
3. **Azure-Dokumentation** konsultieren

---

**Entwickelt für Netlution** - Moderne, serverless Krankmeldungs-Verwaltung
