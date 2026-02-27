# PentestPro — Nuxt 3 + Vuetify 3

Rapportage platform voor ethical hackers en penetration testers.

## Vereisten

- **Node.js** ≥ 18.x  
- **npm** ≥ 9.x  

Controleer op Ubuntu 24.04:
```bash
node --version
npm --version
```

Indien nodig installeren:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Installatie & starten

```bash
# 1. Ga naar de projectmap
cd pentestpro

# 2. Installeer dependencies
npm install

# 3. Start de ontwikkelserver
npm run dev
```

De applicatie is beschikbaar op: **http://localhost:3000**

Login: **admin / admin**

---

## Productie build

```bash
npm run build
npm run preview
```

---

## Projectstructuur

```
pentestpro/
├── assets/
│   └── main.css          # Globale stijlen (dark theme, Vuetify overrides)
├── composables/
│   └── useReports.ts     # Centrale state + dummy data
├── components/
│   ├── PageHeader.vue    # Herbruikbare paginakop
│   ├── StatCard.vue      # Statistiek kaartje
│   ├── SeverityChip.vue  # Gekleurde severiteit badge
│   └── StatusChip.vue    # Gekleurde status badge
├── layouts/
│   └── app.vue           # App shell: topbar + navigation drawer
├── pages/
│   ├── index.vue         # Login scherm
│   ├── dashboard.vue     # Rapportenoverzicht
│   ├── statisch.vue      # Statische data (klant, pentesters)
│   ├── samenvatting.vue  # Management samenvatting
│   ├── conclusie.vue     # Conclusie
│   └── bevindingen/
│       ├── index.vue     # Bevindingen tabel
│       └── [id].vue      # Bevinding detailpagina
├── nuxt.config.ts        # Nuxt + Vuetify configuratie
└── package.json
```

---

## Technologie

| Package | Versie |
|---------|--------|
| Nuxt    | ^3.11  |
| Vuetify | ^3.6   |
| Vue     | ^3.4   |
| @mdi/font | ^7.4 |
| @vuetify/nuxt-module | ^0.15 |

---

## Features

- 🔐 Login scherm (admin / admin)
- 📋 Dashboard met rapportenoverzicht en statistieken
- 📁 Statische data: klantgegevens, scope, aanpak, pentesters (dynamisch toevoegen/verwijderen)
- 📝 Management samenvatting (vrije tekst)
- 🛡️ Bevindingen tabel met severiteitsstatistieken (Kritiek / Hoog / Gemiddeld / Laag / Informatief)
- 🔍 Bevinding detailpagina met beschrijving, stappen, risico, aanbeveling
- 📸 Foto upload per bevinding (drag & drop + klikken)
- ➕ Custom bevindingen aanmaken
- 📊 Conclusie pagina
- 🎨 Dark theme: donkerblauw + oranje
