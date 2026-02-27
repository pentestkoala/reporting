// composables/useReports.ts

// ── TYPES ────────────────────────────────────────────────
export interface Foto { name: string; src: string }

export interface Bevinding {
  id: number
  titel: string
  severiteit: 'nvt' | 'kritiek' | 'hoog' | 'gemiddeld' | 'laag' | 'informatief'
  status: 'open' | 'dicht'
  checked: boolean
  referentie: string
  beschrijving: string
  stappen: string
  risico: string
  aanbeveling: string
  fotos: Foto[]
}

export interface Pentester {
  naam: string
  functie: string
  email: string
  tel: string
}

export type TestSoort = 'webapplicatie' | 'laptop' | 'interne-infrastructuur' | 'externe-infrastructuur' | 'red-teaming' | 'code-review' | 'cloud'

export interface Report {
  id: number
  bedrijf: string
  contactNaam: string
  contactEmail: string
  contactTel: string
  aanpak: 'blackbox' | 'graybox' | 'whitebox' | ''
  testSoorten: TestSoort[]
  risicoNiveau: 'kritiek' | 'hoog' | 'gemiddeld' | 'laag' | 'informatief' | ''
  status: 'lopend' | 'afgerond' | 'concept'
  datum: string
  samenvatting: string
  conclusie: string
  pentesters: Pentester[]
  bevindingen: Bevinding[]
}

export interface DbBevinding {
  id: number
  titel: string
  categorie: TestSoort
  beschrijving: string
  stappen: string
  risico: string
  aanbeveling: string
}

export interface User {
  id: number
  naam: string
  email: string
  rol: 'beheerder' | 'pentester' | 'lezer'
  actief: boolean
}

// ── DUMMY REPORTS ────────────────────────────────────────
const DUMMY_REPORTS: Report[] = [
  {
    id:1, bedrijf:'Acme B.V.', contactNaam:'Jan de Vries', contactEmail:'jan.devries@acme.nl',
    contactTel:'+31 6 12345678', aanpak:'graybox', testSoorten:['webapplicatie','cloud'], risicoNiveau:'hoog',
    status:'lopend', datum:'2025-02-10',
    samenvatting:'Tijdens de graybox pentest van Acme B.V. zijn in totaal 8 bevindingen geïdentificeerd, waarvan 2 kritiek en 3 hoog. De meest kritieke bevinding betreft een SQL Injection kwetsbaarheid in het inlogformulier waarmee een aanvaller volledige databasetoegang kan verkrijgen.',
    conclusie:'De algehele beveiligingsstatus van de Acme applicatie wordt beoordeeld als onvoldoende. De gevonden kritieke kwetsbaarheden dienen met hoge prioriteit te worden verholpen.',
    pentesters:[
      { naam:'Alice Smit',  functie:'Senior Pentester', email:'alice@redteam.nl', tel:'+31 6 11111111' },
      { naam:'Bob Jansen',  functie:'Pentester',        email:'bob@redteam.nl',   tel:'+31 6 22222222' },
    ],
    bevindingen:[
      { id:1,  titel:'SQL Injection',                    severiteit:'kritiek',    status:'open',  checked:false, referentie:'p. 8',  beschrijving:"Een SQL Injection kwetsbaarheid is aangetroffen in het inlogformulier op /login. Door het invoeren van een speciaal geconstrueerde payload is het mogelijk de authenticatie te omzeilen.", stappen:"Stap 1: Navigeer naar /login\nStap 2: Vul als gebruikersnaam 'admin' in\nStap 3: Vul als wachtwoord: ' OR '1'='1\nStap 4: Klik op Inloggen", risico:'Volledige databasetoegang. Alle gebruikersdata en wachtwoordhashes uitleesbaar.', aanbeveling:'Gebruik prepared statements. Implementeer input validatie. Overweeg een WAF.', fotos:[] },
      { id:2,  titel:'Cross-Site Scripting (XSS)',        severiteit:'hoog',       status:'open',  checked:true,  referentie:'p. 12', beschrijving:'Stored XSS in het berichtenmodule. Gebruikersinvoer wordt niet gesanitiseerd opgeslagen.', stappen:'Stap 1: Log in\nStap 2: Ga naar berichten\nStap 3: Voer in: <script>alert(document.cookie)<\/script>', risico:'Sessiecookies stelen, accountovername.', aanbeveling:'Output encoding. CSP header implementeren.', fotos:[] },
      { id:3,  titel:'Cross-Site Request Forgery (CSRF)', severiteit:'gemiddeld',  status:'open',  checked:false, referentie:'p. 16', beschrijving:'CSRF-tokens ontbreken op kritieke endpoints.', stappen:'Stap 1: Maak verborgen form met POST naar /api/change-password\nStap 2: Stuur link naar ingelogde gebruiker', risico:'Acties namens gebruikers zonder medeweten.', aanbeveling:'CSRF-tokens implementeren. SameSite cookie attribuut.', fotos:[] },
      { id:4,  titel:'Server-Side Template Injection',    severiteit:'kritiek',    status:'open',  checked:false, referentie:'p. 20', beschrijving:'SSTI in het rapportgeneratie-endpoint.', stappen:"Stap 1: /api/report?name={{7*7}}\nStap 2: Observeer output '49'", risico:'Remote Code Execution. Volledige servercompromis.', aanbeveling:'Nooit gebruikersinvoer in templates. Gebruik sandbox-modus.', fotos:[] },
      { id:5,  titel:'Path Traversal',                   severiteit:'hoog',       status:'dicht', checked:true,  referentie:'p. 24', beschrijving:'Path traversal in het download-endpoint.', stappen:'GET /download?file=../../../../etc/passwd', risico:'Systeembestanden uitlezen, private keys.', aanbeveling:'Whitelist van toegestane bestanden. Canonical path validatie.', fotos:[] },
      { id:6,  titel:'Local File Inclusion (LFI)',        severiteit:'gemiddeld',  status:'open',  checked:false, referentie:'p. 27', beschrijving:'LFI in de taalparameter.', stappen:'/?lang=../../../../etc/passwd%00', risico:'Lokale bestanden inzien. Escalatie naar RCE mogelijk.', aanbeveling:'Geen gebruikersinvoer voor bestandspaden. Whitelist.', fotos:[] },
      { id:7,  titel:'File Upload Vulnerability',         severiteit:'hoog',       status:'open',  checked:false, referentie:'p. 36', beschrijving:'Geen server-side bestandstype validatie.', stappen:'Upload shell.php.jpg → /uploads/shell.php.jpg?cmd=id', risico:'RCE via webshell.', aanbeveling:'MIME-type en magic bytes validatie. Opslaan buiten webroot.', fotos:[] },
      { id:8,  titel:'HTTP Request Smuggling',            severiteit:'gemiddeld',  status:'open',  checked:false, referentie:'p. 40', beschrijving:'TE.CL request smuggling in de proxy.', stappen:'Conflicterende Content-Length en Transfer-Encoding headers.', risico:'Requests kapen, beveiligingscontroles omzeilen.', aanbeveling:'Update software. HTTP/2 end-to-end.', fotos:[] },
      { id:9,  titel:'Outdated Software',                 severiteit:'informatief',status:'open',  checked:false, referentie:'p. 33', beschrijving:"Apache 2.4.49 en OpenSSL 1.0.2 — bekende CVE's.", stappen:'Server header: Apache/2.4.49 → CVE-2021-41773', risico:'CVSS 9.8. Kwetsbaarheden uitbuitbaar.', aanbeveling:'Update alle software. Patchmanagement implementeren.', fotos:[] },
      { id:10, titel:'HTTP Security Headers',             severiteit:'laag',       status:'open',  checked:true,  referentie:'p. 30', beschrijving:'CSP, X-Frame-Options en HSTS ontbreken.', stappen:'Inspecteer response headers.', risico:'Clickjacking, MIME-sniffing.', aanbeveling:'Alle security headers implementeren.', fotos:[] },
    ],
  },
  {
    id:2, bedrijf:'TechNova N.V.', contactNaam:'Petra Bakker', contactEmail:'petra.bakker@technova.nl',
    contactTel:'+31 20 1234567', aanpak:'blackbox', testSoorten:['interne-infrastructuur'], risicoNiveau:'kritiek',
    status:'afgerond', datum:'2025-01-15',
    samenvatting:'De blackbox pentest van TechNova N.V. resulteerde in 5 bevindingen. De Active Directory bevat misconfiguraties die privilege escalation mogelijk maken.',
    conclusie:'De netwerkinfrastructuur vertoont typische zwaktes. AD-configuratie verdient onmiddellijke aandacht.',
    pentesters:[{ naam:'Carol de Wit', functie:'Lead Pentester', email:'carol@redteam.nl', tel:'+31 6 33333333' }],
    bevindingen:[
      { id:1,  titel:'SQL Injection',                    severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',     beschrijving:'N.v.t.', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:2,  titel:'Cross-Site Scripting (XSS)',        severiteit:'laag',       status:'dicht', checked:true,  referentie:'p. 5', beschrijving:'Reflected XSS in zoekfunctie intern portaal.', stappen:'', risico:'', aanbeveling:'Output encoding.', fotos:[] },
      { id:3,  titel:'Cross-Site Request Forgery (CSRF)', severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',     beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:4,  titel:'Server-Side Template Injection',    severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',     beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:5,  titel:'Path Traversal',                   severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',     beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:6,  titel:'Local File Inclusion (LFI)',        severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',     beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:7,  titel:'File Upload Vulnerability',         severiteit:'hoog',       status:'open',  checked:false, referentie:'p. 9', beschrijving:'Unrestricted file upload op medewerkersportaal.', stappen:'', risico:'RCE.', aanbeveling:'Valideer bestandstypen.', fotos:[] },
      { id:8,  titel:'HTTP Request Smuggling',            severiteit:'gemiddeld',  status:'open',  checked:false, referentie:'p. 14',beschrijving:'CL.TE smuggling op Nginx.', stappen:'', risico:'Session hijacking.', aanbeveling:'Update Nginx.', fotos:[] },
      { id:9,  titel:'Outdated Software',                 severiteit:'kritiek',    status:'open',  checked:false, referentie:'p. 17',beschrijving:'Windows Server 2008 R2. CVE-2019-0708 (BlueKeep).', stappen:'', risico:'CVSS 9.8 — wormbare RCE via RDP.', aanbeveling:'Migreer naar Windows Server 2022.', fotos:[] },
      { id:10, titel:'HTTP Security Headers',             severiteit:'informatief',status:'dicht', checked:true,  referentie:'p. 19',beschrijving:'Hersteld na eerste rapportage.', stappen:'', risico:'', aanbeveling:'', fotos:[] },
    ],
  },
  {
    id:3, bedrijf:'SecureBank B.V.', contactNaam:'Dirk van Loon', contactEmail:'d.vanloon@securebank.nl',
    contactTel:'+31 10 9876543', aanpak:'whitebox', testSoorten:['webapplicatie','code-review'], risicoNiveau:'gemiddeld',
    status:'concept', datum:'2025-02-20',
    samenvatting:'Whitebox pentest van SecureBank B.V. Source code analyse gecombineerd met black-box testing. Rapport in conceptfase.',
    conclusie:'',
    pentesters:[
      { naam:'Alice Smit',  functie:'Senior Pentester', email:'alice@redteam.nl', tel:'+31 6 11111111' },
      { naam:'Erik Visser', functie:'Code Reviewer',    email:'erik@redteam.nl',  tel:'+31 6 44444444' },
    ],
    bevindingen:[
      { id:1,  titel:'SQL Injection',                    severiteit:'kritiek',    status:'open',  checked:false, referentie:'p. 6',  beschrijving:'Blind SQL injection via datum-parameter.', stappen:'', risico:'Alle transactiedata.', aanbeveling:'Prepared statements.', fotos:[] },
      { id:2,  titel:'Cross-Site Scripting (XSS)',        severiteit:'hoog',       status:'open',  checked:false, referentie:'p. 10', beschrijving:'DOM-based XSS via hash fragment.', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:3,  titel:'Cross-Site Request Forgery (CSRF)', severiteit:'hoog',       status:'open',  checked:false, referentie:'p. 13', beschrijving:'CSRF op overboeking endpoint.', stappen:'', risico:'Ongeautoriseerde geldtransfers.', aanbeveling:'CSRF tokens.', fotos:[] },
      { id:4,  titel:'Server-Side Template Injection',    severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',      beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:5,  titel:'Path Traversal',                   severiteit:'gemiddeld',  status:'open',  checked:false, referentie:'p. 16', beschrijving:'Config bestanden leesbaar.', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:6,  titel:'Local File Inclusion (LFI)',        severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',      beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:7,  titel:'File Upload Vulnerability',         severiteit:'laag',       status:'open',  checked:false, referentie:'p. 20', beschrijving:'Geen bestandsgrootte limiet.', stappen:'', risico:'DoS via grote uploads.', aanbeveling:'Max bestandsgrootte instellen.', fotos:[] },
      { id:8,  titel:'HTTP Request Smuggling',            severiteit:'nvt',        status:'dicht', checked:true,  referentie:'',      beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] },
      { id:9,  titel:'Outdated Software',                 severiteit:'informatief',status:'open',  checked:false, referentie:'p. 22', beschrijving:'jQuery 1.11.1.', stappen:'', risico:'', aanbeveling:'Upgrade jQuery 3.x+', fotos:[] },
      { id:10, titel:'HTTP Security Headers',             severiteit:'informatief',status:'open',  checked:false, referentie:'p. 24', beschrijving:'HSTS preload ontbreekt.', stappen:'', risico:'', aanbeveling:'HSTS preload toevoegen.', fotos:[] },
    ],
  },
]

// ── DUMMY FINDING DATABASE ───────────────────────────────
const DUMMY_DB_BEVINDINGEN: DbBevinding[] = [
  { id:1, titel:'SQL Injection', categorie:'webapplicatie', beschrijving:'SQL injection stelt een aanvaller in staat database-queries te manipuleren via ongesanitiseerde invoer in webformulieren of URL-parameters.', stappen:"Stap 1: Identificeer invoervelden die database-queries beïnvloeden\nStap 2: Test met payload: ' OR '1'='1\nStap 3: Gebruik sqlmap voor automatische detectie en exploitatie", risico:'Volledige databasecompromis, datalekken van gevoelige klantinformatie, authenticatie-bypass, in ernstige gevallen RCE via xp_cmdshell.', aanbeveling:'Gebruik prepared statements / parameterized queries. Implementeer input validatie en output encoding. Beperk databaserechten (least privilege). Overweeg een WAF.' },
  { id:2, titel:'Cross-Site Scripting (XSS)', categorie:'webapplicatie', beschrijving:'XSS maakt het mogelijk kwaadaardige JavaScript te injecteren die in de browser van slachtoffers wordt uitgevoerd.', stappen:"Stap 1: Zoek invoervelden die output reflecteren\nStap 2: Test: <script>alert(1)<\/script>\nStap 3: Probeer stored variant via persistent opslag", risico:'Sessiecookies stelen, keyloggers injecteren, phishing via DOM-manipulatie, accountovername.', aanbeveling:'Output encoding (HTML entities). Content Security Policy (CSP) header. HTTPOnly en Secure cookie flags. Input sanitisatie server-side.' },
  { id:3, titel:'Broken Authentication', categorie:'webapplicatie', beschrijving:'Zwakheden in het authenticatiemechanisme zoals zwakke wachtwoorden, ontbrekende rate limiting of onveilige sessie-tokens.', stappen:'Stap 1: Test brute force op login zonder lockout\nStap 2: Analyseer sessie-tokens op voorspelbaarheid\nStap 3: Test wachtwoord-reset flow', risico:'Accountovername, onbevoegde toegang, privilege escalation.', aanbeveling:'Multi-factor authenticatie. Account lockout na mislukte pogingen. Sterke sessie-tokens (128-bit random). HTTPS-only cookies.' },
  { id:4, titel:'Outdated OS / Kernel', categorie:'laptop', beschrijving:'Het besturingssysteem of de kernel bevat bekende kwetsbaarheden door verouderde versies zonder patches.', stappen:'Stap 1: Identificeer OS-versie: uname -a / winver\nStap 2: Zoek bekende CVEs op\nStap 3: Test exploiteerbare kwetsbaarheden', risico:'Local privilege escalation naar SYSTEM/root. Volledige machinecompromis.', aanbeveling:'Automatische updates inschakelen. Patch management proces implementeren. End-of-life systemen vervangen.' },
  { id:5, titel:'Onversleuteld Lokaal Opgeslagen Data', categorie:'laptop', beschrijving:'Gevoelige data zoals credentials, sleutels of PII wordt onversleuteld opgeslagen op het lokale bestandssysteem.', stappen:'Stap 1: Zoek naar credentials in clear text: grep -r "password" /home\nStap 2: Controleer configuratiebestanden\nStap 3: Analyseer browser-opgeslagen wachtwoorden', risico:'Bij fysieke toegang of malware: directe toegang tot credentials en gevoelige bedrijfsdata.', aanbeveling:'Full disk encryption (BitLocker/FileVault). Gebruik credential managers. Verwijder clear-text credentials uit bestanden.' },
  { id:6, titel:'SMB Relay Attack', categorie:'interne-infrastructuur', beschrijving:'NTLM-authenticatieverkeer kan worden onderschept en doorgestuurd naar andere systemen om authenticatie te omzeilen.', stappen:'Stap 1: Start Responder: responder -I eth0\nStap 2: Wacht op NTLM-authenticatiepogingen\nStap 3: Relay met ntlmrelayx naar doelsystemen', risico:'Authenticatie op andere systemen in het netwerk zonder wachtwoord. Potentieel domeincompromis.', aanbeveling:'SMB signing verplicht maken op alle systemen. NTLM uitschakelen waar mogelijk. NetBIOS en LLMNR uitschakelen.' },
  { id:7, titel:'Kerberoasting', categorie:'interne-infrastructuur', beschrijving:'Service accounts met SPNs kunnen worden aangevallen door Kerberos TGS-tickets offline te kraken.', stappen:'Stap 1: Identificeer service accounts met SPNs: GetUserSPNs.py\nStap 2: Request TGS tickets\nStap 3: Kraak offline met hashcat', risico:'Compromis van service account wachtwoorden, mogelijk met hoge privileges.', aanbeveling:'Gebruik gManaged Service Accounts (gMSA). Lange complexe wachtwoorden voor service accounts (>25 tekens). Privileged Access Workstations.' },
  { id:8, titel:'Exposed Management Interfaces', categorie:'externe-infrastructuur', beschrijving:'Beheerpanelen (SSH, RDP, admin panels) zijn direct benaderbaar vanaf het internet.', stappen:'Stap 1: Scan met nmap: nmap -p 22,3389,8080,8443 target\nStap 2: Identificeer versies en diensten\nStap 3: Test standaard credentials', risico:'Brute force aanvallen, exploitatie van bekende kwetsbaarheden, onbevoegde toegang.', aanbeveling:'VPN of jump server verplicht voor beheer. IP whitelisting. Geen RDP/SSH direct op internet.' },
  { id:9, titel:'Subdomain Takeover', categorie:'externe-infrastructuur', beschrijving:'DNS-records verwijzen naar niet-meer-bestaande cloud services, waardoor een aanvaller de subdomain kan claimen.', stappen:'Stap 1: Enumerate subdomains: subfinder, amass\nStap 2: Controleer CNAME records: dig CNAME sub.example.com\nStap 3: Verifieer of de cloud resource nog bestaat', risico:'Phishing via legitiem ogend domein, sessiecookie diefstal, reputatieschade.', aanbeveling:'Verwijder DNS records bij decommissioneren van services. Regelmatige audit van DNS-configuratie.' },
  { id:10, titel:'Phishing Simulatie Geslaagd', categorie:'red-teaming', beschrijving:'Medewerkers klikken op gesimuleerde phishing e-mails en voeren credentials in op nep-loginpaginas.', stappen:'Stap 1: Maak overtuigende phishing e-mail met GoPhish\nStap 2: Stuur naar doelgroep\nStap 3: Meet click-rate en credential submissions', risico:'Credential diefstal, malware installatie, initiële toegang tot netwerk.', aanbeveling:'Security awareness training. E-mail filtering (DMARC, SPF, DKIM). MFA op alle systemen. Phishing-resistente MFA (FIDO2).' },
  { id:11, titel:'Hardcoded Credentials in Broncode', categorie:'code-review', beschrijving:'API-sleutels, wachtwoorden of tokens zijn direct in de broncode opgenomen.', stappen:'Stap 1: Scan met git-secrets of truffleHog\nStap 2: Grep naar keywords: grep -r "password\\|secret\\|key" src/\nStap 3: Controleer git history', risico:'Onbevoegde toegang tot externe services, databases of cloud resources.', aanbeveling:'Gebruik environment variables of secret managers (HashiCorp Vault, AWS Secrets Manager). Pre-commit hooks voor secret detection. Git history schoonmaken.' },
  { id:12, titel:'Misconfigured S3 Bucket', categorie:'cloud', beschrijving:'AWS S3 buckets zijn publiek toegankelijk of hebben te ruime IAM-permissies.', stappen:'Stap 1: Enumerate buckets: aws s3 ls\nStap 2: Test publieke toegang: curl https://bucket.s3.amazonaws.com\nStap 3: Controleer bucket policies en ACLs', risico:'Datalekken van gevoelige bestanden, mogelijke write-access voor aanvallers.', aanbeveling:'Block Public Access inschakelen op account-niveau. Least privilege IAM policies. S3 bucket logging en monitoring inschakelen. Regelmatige audit met AWS Config.' },
]

// ── DUMMY USERS ──────────────────────────────────────────
const DUMMY_USERS: User[] = [
  { id:1, naam:'Admin Gebruiker', email:'admin@pentestpro.nl',  rol:'beheerder', actief:true  },
  { id:2, naam:'Alice Smit',      email:'alice@redteam.nl',     rol:'pentester', actief:true  },
  { id:3, naam:'Bob Jansen',      email:'bob@redteam.nl',       rol:'pentester', actief:true  },
  { id:4, naam:'Carol de Wit',    email:'carol@redteam.nl',     rol:'pentester', actief:true  },
  { id:5, naam:'Erik Visser',     email:'erik@redteam.nl',      rol:'pentester', actief:false },
  { id:6, naam:'Petra Bakker',    email:'petra@technova.nl',    rol:'lezer',     actief:true  },
]

// ── GLOBAL STATE ─────────────────────────────────────────
const reports          = ref<Report[]>([])
const currentReportId  = ref<number>(1)
const dbBevindingen    = ref<DbBevinding[]>([])
const users            = ref<User[]>([])
const initialized      = ref(false)

export function useReports() {
  if (!initialized.value) {
    reports.value       = JSON.parse(JSON.stringify(DUMMY_REPORTS))
    dbBevindingen.value = JSON.parse(JSON.stringify(DUMMY_DB_BEVINDINGEN))
    users.value         = JSON.parse(JSON.stringify(DUMMY_USERS))
    initialized.value   = true
  }

  const currentReport = computed(() =>
    reports.value.find(r => r.id === currentReportId.value) ?? null
  )

  function setCurrentReport(id: number) { currentReportId.value = id }

  function addReport(bedrijf: string, aanpak: string, status: string) {
    const maxId = reports.value.reduce((m, r) => Math.max(m, r.id), 0)
    reports.value.push({
      id: maxId + 1, bedrijf, contactNaam:'', contactEmail:'', contactTel:'',
      aanpak: aanpak as any, testSoorten: [], risicoNiveau: '' as any, status: status as any,
      datum: new Date().toISOString().slice(0, 10),
      samenvatting:'', conclusie:'', pentesters:[], bevindingen: [],
    })
    currentReportId.value = maxId + 1
  }

  function addBevinding(titel: string, severiteit: string, status: string) {
    const r = currentReport.value; if (!r) return
    const maxId = r.bevindingen.reduce((m, b) => Math.max(m, b.id), 0)
    r.bevindingen.push({ id: maxId + 1, titel, severiteit: severiteit as any, status: status as any, checked: false, referentie:'', beschrijving:'', stappen:'', risico:'', aanbeveling:'', fotos:[] })
  }

  function deleteBevinding(id: number) {
    const r = currentReport.value; if (!r) return
    r.bevindingen = r.bevindingen.filter(b => b.id !== id)
  }

  // Sync bevindingen from DB based on testSoorten.
  // Adds DB findings for newly selected soorten; removes DB-origin findings for deselected soorten.
  // Manually added findings (not in DB) are always kept.
  function syncBevindingen(soorten: string[]) {
    const r = currentReport.value; if (!r) return
    const db = dbBevindingen.value

    // Collect all DB titles per soort for quick lookup
    const dbTitelsBySoort: Record<string, Set<string>> = {}
    db.forEach(d => {
      if (!dbTitelsBySoort[d.categorie]) dbTitelsBySoort[d.categorie] = new Set()
      dbTitelsBySoort[d.categorie].add(d.titel.toLowerCase())
    })

    // The set of all DB titels across all selected soorten that should be present
    const wantedTitels = new Set<string>()
    soorten.forEach(soort => {
      db.filter(d => d.categorie === soort).forEach(d => wantedTitels.add(d.titel.toLowerCase()))
    })

    // The set of ALL db titels (across all categories) – used to detect DB-origin findings
    const allDbTitels = new Set(db.map(d => d.titel.toLowerCase()))

    // Keep findings that are either:
    //  a) not from the DB at all (manually added)
    //  b) from the DB AND their titel is in wantedTitels
    r.bevindingen = r.bevindingen.filter(b => {
      const t = b.titel.toLowerCase()
      if (!allDbTitels.has(t)) return true   // manually added – keep always
      return wantedTitels.has(t)              // DB finding – only keep if still wanted
    })

    // Now add DB findings that are wanted but not yet present
    const presentTitels = new Set(r.bevindingen.map(b => b.titel.toLowerCase()))
    soorten.forEach(soort => {
      db.filter(d => d.categorie === soort).forEach(d => {
        if (presentTitels.has(d.titel.toLowerCase())) return
        const maxId = r.bevindingen.reduce((m, b) => Math.max(m, b.id), 0)
        r.bevindingen.push({
          id: maxId + 1,
          titel: d.titel,
          severiteit: 'nvt',
          status: 'open',
          checked: false,
          referentie: '',
          beschrijving: d.beschrijving,
          stappen: d.stappen,
          risico: d.risico,
          aanbeveling: d.aanbeveling,
          fotos: [],
        })
        presentTitels.add(d.titel.toLowerCase())
      })
    })
  }

  const totalOpen = computed(() =>
    reports.value.reduce((acc, r) => acc + r.bevindingen.filter(b => b.status === 'open').length, 0)
  )

  const sevCounts = computed(() => {
    const r = currentReport.value
    if (!r) return { kritiek:0, hoog:0, gemiddeld:0, laag:0, informatief:0 }
    return ['kritiek','hoog','gemiddeld','laag','informatief'].reduce((acc, s) => {
      acc[s] = r.bevindingen.filter(b => b.severiteit === s).length; return acc
    }, {} as Record<string,number>)
  })

  // Finding database helpers
  function addDbBevinding(b: Omit<DbBevinding,'id'>) {
    const maxId = dbBevindingen.value.reduce((m, x) => Math.max(m, x.id), 0)
    dbBevindingen.value.push({ ...b, id: maxId + 1 })
  }
  function deleteDbBevinding(id: number) {
    dbBevindingen.value = dbBevindingen.value.filter(b => b.id !== id)
  }

  // User helpers
  function addUser(u: Omit<User,'id'>) {
    const maxId = users.value.reduce((m, x) => Math.max(m, x.id), 0)
    users.value.push({ ...u, id: maxId + 1 })
  }
  function deleteUser(id: number) { users.value = users.value.filter(u => u.id !== id) }

  return {
    reports, currentReport, currentReportId, setCurrentReport, addReport, addBevinding, deleteBevinding, syncBevindingen,
    totalOpen, sevCounts,
    dbBevindingen, addDbBevinding, deleteDbBevinding,
    users, addUser, deleteUser,
  }
}
