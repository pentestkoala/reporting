<template>
  <div>
    <PageHeader>
      <template #title>BEVINDINGEN <span class="accent">// </span>Overzicht</template>
      <template #subtitle>Klik op een titel voor details · Severiteit per bevinding</template>
      <template #actions>
        <div class="d-flex gap-3">
          <v-btn class="btn-outline-orange" size="small" prepend-icon="mdi-database-import" @click="dbDialog = true">
            Importeer uit Database
          </v-btn>
          <v-btn class="btn-outline-orange" size="small" prepend-icon="mdi-plus" @click="newDialog = true">
            Nieuwe Bevinding
          </v-btn>
        </div>
      </template>
    </PageHeader>

    <!-- Severity stats -->
    <v-row class="mb-6" no-gutters>
      <v-col cols="12" sm class="pr-2"><StatCard label="Kritiek"     :value="sevCounts.kritiek"     color="#ff6b7a" /></v-col>
      <v-col cols="12" sm class="px-2"><StatCard label="Hoog"        :value="sevCounts.hoog"        color="#ff8c42" /></v-col>
      <v-col cols="12" sm class="px-2"><StatCard label="Gemiddeld"   :value="sevCounts.gemiddeld"   color="#ffd740" /></v-col>
      <v-col cols="12" sm class="px-2"><StatCard label="Laag"        :value="sevCounts.laag"        color="#40c4ff" /></v-col>
      <v-col cols="12" sm class="pl-2"><StatCard label="Informatief" :value="sevCounts.informatief" color="#b388ff" /></v-col>
    </v-row>

    <div v-if="!r" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      Geen rapport geselecteerd — ga naar Dashboard en klik op een rapport.
    </div>
    <v-card v-else elevation="0">
      <!-- Info banner when auto-populated -->
      <div
        v-if="r.testSoorten?.length && r.bevindingen.length"
        class="px-5 py-3 font-mono"
        style="font-size:10px;letter-spacing:1.5px;color:var(--text-dim);border-bottom:1px solid var(--navy-border);background:rgba(255,107,26,0.03);"
      >
        ▸ Bevindingen automatisch geladen op basis van:
        <span style="color:var(--orange);">{{ r.testSoorten.map(t => catLabel(t)).join(', ') }}</span>
        — verander de pentest soort in
        <span class="finding-link" style="font-size:10px;" @click="router.push('/statisch')">Statische Data</span>
        om de lijst bij te werken
      </div>

      <v-table>
        <thead>
          <tr>
            <th style="width:50px;">#</th>
            <th>Titel</th>
            <th style="width:170px;">Severiteit</th>
            <th style="width:130px;">Status</th>
            <th style="width:110px;text-align:center;">Gecontroleerd</th>
            <th style="width:100px;">Referentie</th>
            <th style="width:54px;text-align:center;">Del</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in r.bevindingen" :key="b.id">
            <td class="font-mono text-dim">{{ String(b.id).padStart(2,'0') }}</td>
            <td><span class="finding-link" @click="goDetail(b.id)">{{ b.titel }}</span></td>
            <td @click.stop>
              <v-select
                v-model="b.severiteit"
                :items="sevItems"
                density="compact"
                variant="plain"
                hide-details
                style="font-family:var(--font-mono);font-size:12px;min-width:130px;"
              />
            </td>
            <td @click.stop>
              <v-select
                v-model="b.status"
                :items="statusItems"
                density="compact"
                variant="plain"
                hide-details
                style="font-family:var(--font-mono);font-size:12px;min-width:90px;"
              />
            </td>
            <td style="text-align:center;" @click.stop>
              <v-checkbox v-model="b.checked" density="compact" hide-details color="primary" style="justify-content:center;" />
            </td>
            <td @click.stop>
              <v-text-field
                v-model="b.referentie"
                density="compact"
                variant="plain"
                placeholder="p. —"
                hide-details
                style="font-size:13px;max-width:85px;"
              />
            </td>
            <td style="text-align:center;" @click.stop>
              <v-btn
                icon
                size="x-small"
                class="btn-danger"
                title="Verwijder bevinding"
                @click="confirmDel(b)"
              >
                <v-icon size="14">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          <tr v-if="!r.bevindingen.length">
            <td colspan="7" class="text-center pa-10 font-mono text-dim" style="letter-spacing:2px;">
              Geen bevindingen — selecteer een pentest soort in Statische Data of voeg handmatig toe
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- ── NEW BEVINDING DIALOG ── -->
    <v-dialog v-model="newDialog" max-width="480">
      <v-card class="pa-8" elevation="0">
        <div class="page-title mb-6">&#9673; Nieuwe Bevinding</div>

        <div class="field-label mb-2">Titel</div>
        <v-text-field v-model="newForm.titel" placeholder="Bijv. XML External Entity (XXE)" class="mb-4" hide-details />

        <div class="field-label mb-2">Severiteit</div>
        <v-select v-model="newForm.severiteit" :items="sevItems" class="mb-4" hide-details />

        <div class="field-label mb-2">Status</div>
        <v-select v-model="newForm.status" :items="statusItems" class="mb-4" hide-details />

        <div class="d-flex justify-end gap-3 mt-4">
          <v-btn class="btn-outline-orange" @click="newDialog = false">Annuleren</v-btn>
          <v-btn class="btn-orange" @click="createBev">Toevoegen</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- ── IMPORT FROM DB DIALOG ── -->
    <v-dialog v-model="dbDialog" max-width="720">
      <v-card class="pa-8" elevation="0">
        <div class="page-title mb-2">&#9672; Importeer uit Finding Database</div>
        <p class="font-mono text-dim mb-5" style="font-size:11px;letter-spacing:1px;">
          Selecteer bevindingen om toe te voegen aan dit rapport
        </p>

        <div class="d-flex gap-3 mb-4" style="flex-wrap:wrap;">
          <v-text-field
            v-model="dbSearch"
            placeholder="Zoek op naam..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="compact"
            style="max-width:260px;"
          />
          <v-select
            v-model="dbCatFilter"
            :items="[{title:'Alle categorieën',value:'all'}, ...catItems]"
            item-title="title"
            item-value="value"
            density="compact"
            hide-details
            style="max-width:220px;"
          />
        </div>

        <div class="db-import-list">
          <div
            v-for="b in dbFiltered"
            :key="b.id"
            class="db-import-row"
            :class="{ 'db-import-row--selected': selectedIds.has(b.id) }"
            @click="toggleSelect(b.id)"
          >
            <v-checkbox
              :model-value="selectedIds.has(b.id)"
              density="compact"
              hide-details
              color="primary"
              style="flex-shrink:0;"
              @click.stop="toggleSelect(b.id)"
            />
            <div style="flex:1;min-width:0;">
              <div class="font-head" style="font-size:14px;font-weight:700;color:var(--text-bright);">{{ b.titel }}</div>
              <div class="font-mono text-dim" style="font-size:10px;letter-spacing:1px;margin-top:2px;">{{ catLabel(b.categorie) }}</div>
            </div>
            <v-chip v-if="selectedIds.has(b.id)" size="x-small" style="background:rgba(255,107,26,0.2);color:var(--orange);border:1px solid rgba(255,107,26,0.4);">
              geselecteerd
            </v-chip>
          </div>
          <div v-if="!dbFiltered.length" class="text-center pa-8 font-mono text-dim" style="letter-spacing:1px;">
            Geen bevindingen gevonden
          </div>
        </div>

        <div class="d-flex justify-space-between align-center mt-5">
          <span class="font-mono text-dim" style="font-size:11px;">{{ selectedIds.size }} geselecteerd</span>
          <div class="d-flex gap-3">
            <v-btn class="btn-outline-orange" @click="dbDialog = false; selectedIds.clear()">Annuleren</v-btn>
            <v-btn class="btn-orange" :disabled="!selectedIds.size" @click="importSelected">
              Importeren ({{ selectedIds.size }})
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- ── DELETE CONFIRM DIALOG ── -->
    <v-dialog v-model="delDialog" max-width="420">
      <v-card class="pa-8" elevation="0" style="border-top:3px solid #ff3d57 !important;">
        <div class="page-title mb-4" style="color:#ff3d57;">&#9888; Bevinding Verwijderen</div>
        <p style="font-size:14px;color:var(--text);margin-bottom:24px;">
          Weet je zeker dat je <strong style="color:var(--text-bright);">{{ delTarget?.titel }}</strong> wilt verwijderen?
          Dit kan niet ongedaan worden gemaakt.
        </p>
        <div class="d-flex justify-end gap-3">
          <v-btn class="btn-outline-orange" @click="delDialog = false">Annuleren</v-btn>
          <v-btn class="btn-danger" style="font-family:var(--font-head);font-weight:700;letter-spacing:2px;" @click="doDelete">
            Verwijderen
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Toasts -->
    <v-snackbar v-model="importedToast" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        &#10003; {{ importedCount }} bevinding{{ importedCount !== 1 ? 'en' : '' }} toegevoegd
      </div>
    </v-snackbar>
    <v-snackbar v-model="deletedToast" :timeout="2000" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid #ff3d57;color:#ff3d57;font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        &#10003; Bevinding verwijderd
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
import type { DbBevinding, Bevinding } from '~/composables/useReports'

const router = useRouter()
const { currentReport: r, sevCounts, addBevinding, deleteBevinding, dbBevindingen } = useReports()

const sevItems    = ['nvt','kritiek','hoog','gemiddeld','laag','informatief']
const statusItems = ['open','dicht']

const catItems = [
  { title: 'Webapplicatie',          value: 'webapplicatie'          },
  { title: 'Laptop',                 value: 'laptop'                 },
  { title: 'Interne Infrastructuur', value: 'interne-infrastructuur' },
  { title: 'Externe Infrastructuur', value: 'externe-infrastructuur' },
  { title: 'Red Teaming',            value: 'red-teaming'            },
  { title: 'Code Review',            value: 'code-review'            },
  { title: 'Cloud',                  value: 'cloud'                  },
]
const catLabel = (v: string) => catItems.find(c => c.value === v)?.title ?? v

// ── New bevinding ─────────────────────────────────────────
const newDialog = ref(false)
const newForm   = reactive({ titel: '', severiteit: 'nvt', status: 'open' })

function goDetail(id: number) { router.push('/bevindingen/' + id) }

function createBev() {
  if (!newForm.titel.trim()) return
  addBevinding(newForm.titel.trim(), newForm.severiteit, newForm.status)
  newDialog.value = false
  newForm.titel = ''
}

// ── Delete bevinding ──────────────────────────────────────
const delDialog   = ref(false)
const delTarget   = ref<Bevinding | null>(null)
const deletedToast = ref(false)

function confirmDel(b: Bevinding) { delTarget.value = b; delDialog.value = true }
function doDelete() {
  if (delTarget.value) deleteBevinding(delTarget.value.id)
  delDialog.value = false
  deletedToast.value = true
}

// ── Import from DB ────────────────────────────────────────
const dbDialog      = ref(false)
const dbSearch      = ref('')
const dbCatFilter   = ref('all')
const selectedIds   = reactive(new Set<number>())
const importedToast = ref(false)
const importedCount = ref(0)

const dbFiltered = computed(() => {
  let list = dbCatFilter.value === 'all'
    ? dbBevindingen.value
    : dbBevindingen.value.filter(b => b.categorie === dbCatFilter.value)
  if (dbSearch.value.trim()) {
    const q = dbSearch.value.trim().toLowerCase()
    list = list.filter(b => b.titel.toLowerCase().includes(q))
  }
  return list
})

function toggleSelect(id: number) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function importSelected() {
  if (!r.value) return
  let count = 0
  selectedIds.forEach(id => {
    const db = dbBevindingen.value.find(b => b.id === id)
    if (!db) return
    const maxId = r.value!.bevindingen.reduce((m, b) => Math.max(m, b.id), 0)
    r.value!.bevindingen.push({
      id: maxId + 1,
      titel: db.titel,
      severiteit: 'nvt',
      status: 'open',
      checked: false,
      referentie: '',
      beschrijving: db.beschrijving,
      stappen: db.stappen,
      risico: db.risico,
      aanbeveling: db.aanbeveling,
      fotos: [],
    })
    count++
  })
  importedCount.value = count
  selectedIds.clear()
  dbDialog.value = false
  importedToast.value = true
}
</script>

<style scoped>
.db-import-list {
  max-height: 360px;
  overflow-y: auto;
  border: 1px solid var(--navy-border);
}
.db-import-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--navy-border);
  cursor: pointer;
  transition: background 0.12s;
}
.db-import-row:last-child { border-bottom: none; }
.db-import-row:hover { background: rgba(255,107,26,0.05); }
.db-import-row--selected { background: rgba(255,107,26,0.08) !important; }
</style>
