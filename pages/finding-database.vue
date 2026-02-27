<template>
  <div>
    <PageHeader>
      <template #title>FINDING <span class="accent">DATABASE</span></template>
      <template #subtitle>Bibliotheek van herbruikbare bevindingen per categorie</template>
      <template #actions>
        <v-btn class="btn-outline-orange" prepend-icon="mdi-plus" @click="openNew()">
          Bevinding Toevoegen
        </v-btn>
      </template>
    </PageHeader>

    <!-- Search bar -->
    <div class="d-flex align-center gap-4 mb-5">
      <v-text-field
        v-model="search"
        placeholder="Zoek op naam..."
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        density="compact"
        style="max-width:320px;"
      />
      <span class="font-mono text-dim" style="font-size:11px;letter-spacing:1px;">
        {{ totalFiltered }} bevinding{{ totalFiltered !== 1 ? 'en' : '' }}
      </span>
    </div>

    <!-- One table per category -->
    <div v-for="cat in catItems" :key="cat.value" class="mb-8">
      <template v-if="byCat(cat.value).length">
        <div class="section-title mb-3">{{ cat.title }}</div>
        <v-card elevation="0">
          <v-table>
            <thead>
              <tr>
                <th style="width:50px;">#</th>
                <th>Titel</th>
                <th style="width:120px;text-align:center;">Acties</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(b, i) in byCat(cat.value)"
                :key="b.id"
                class="db-row"
                :class="{ 'db-row--open': expandedId === b.id }"
              >
                <td class="font-mono text-dim">{{ String(i + 1).padStart(2, '0') }}</td>
                <td>
                  <div
                    class="finding-link"
                    style="font-weight:600;"
                    @click="toggleExpand(b.id)"
                  >
                    {{ b.titel }}
                    <v-icon size="14" style="margin-left:6px;color:var(--text-dim);transition:transform 0.2s;" :style="expandedId === b.id ? 'transform:rotate(90deg)' : ''">
                      mdi-chevron-right
                    </v-icon>
                  </div>

                  <!-- Inline expand -->
                  <div v-if="expandedId === b.id" class="db-expand pa-3 mt-2 mb-1">
                    <div v-if="b.beschrijving" class="mb-3">
                      <div class="field-label mb-1">Beschrijving</div>
                      <p style="font-size:13px;color:var(--text);line-height:1.6;white-space:pre-line;">{{ b.beschrijving }}</p>
                    </div>
                    <div v-if="b.stappen" class="mb-3">
                      <div class="field-label mb-1">Reproduceerbare Stappen</div>
                      <p style="font-size:13px;color:var(--text);line-height:1.6;white-space:pre-line;">{{ b.stappen }}</p>
                    </div>
                    <div v-if="b.risico" class="mb-3">
                      <div class="field-label mb-1">Risico</div>
                      <p style="font-size:13px;color:var(--text);line-height:1.6;">{{ b.risico }}</p>
                    </div>
                    <div v-if="b.aanbeveling">
                      <div class="field-label mb-1">Aanbeveling</div>
                      <p style="font-size:13px;color:var(--text);line-height:1.6;">{{ b.aanbeveling }}</p>
                    </div>
                  </div>
                </td>
                <td style="text-align:center;" @click.stop>
                  <div class="d-flex justify-center gap-2">
                    <v-btn icon size="x-small" class="btn-outline-orange" title="Bewerken" @click="openEdit(b)">
                      <v-icon size="14">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon size="x-small" class="btn-danger" title="Verwijderen" @click="confirmDelete(b)">
                      <v-icon size="14">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>
    </div>

    <div v-if="totalFiltered === 0" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      {{ search ? 'Geen resultaten gevonden' : 'Database is leeg — voeg bevindingen toe' }}
    </div>

    <!-- Add / Edit dialog -->
    <v-dialog v-model="dialog" max-width="640">
      <v-card class="pa-8" elevation="0">
        <div class="page-title mb-6">{{ editId ? 'Bewerk Bevinding' : 'Nieuwe Bevinding' }}</div>

        <div class="field-label mb-2">Titel</div>
        <v-text-field v-model="form.titel" placeholder="Bijv. XML External Entity (XXE)" class="mb-4" hide-details />

        <div class="field-label mb-2">Categorie</div>
        <v-select v-model="form.categorie" :items="catItems" item-title="title" item-value="value" class="mb-4" hide-details />

        <div class="field-label mb-2">Beschrijving</div>
        <v-textarea v-model="form.beschrijving" rows="3" placeholder="Beschrijf de bevinding..." class="mb-4" hide-details />

        <div class="field-label mb-2">Reproduceerbare Stappen</div>
        <v-textarea v-model="form.stappen" rows="4" placeholder="Stap 1: ..." class="mb-4" hide-details />

        <div class="field-label mb-2">Risico</div>
        <v-textarea v-model="form.risico" rows="2" placeholder="Wat zijn de mogelijke gevolgen?" class="mb-4" hide-details />

        <div class="field-label mb-2">Aanbeveling</div>
        <v-textarea v-model="form.aanbeveling" rows="2" placeholder="Welke maatregelen worden aanbevolen?" class="mb-4" hide-details />

        <div class="d-flex justify-end gap-3 mt-2">
          <v-btn class="btn-outline-orange" @click="dialog = false">Annuleren</v-btn>
          <v-btn class="btn-orange" @click="saveForm">Opslaan</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete confirm dialog -->
    <v-dialog v-model="delDialog" max-width="420">
      <v-card class="pa-8" elevation="0" style="border-top:3px solid #ff3d57 !important;">
        <div class="page-title mb-4" style="color:#ff3d57;">Bevinding Verwijderen</div>
        <p style="font-size:14px;color:var(--text);margin-bottom:24px;">
          Weet je zeker dat je <strong style="color:var(--text-bright);">{{ delTarget?.titel }}</strong> wilt verwijderen?
        </p>
        <div class="d-flex justify-end gap-3">
          <v-btn class="btn-outline-orange" @click="delDialog = false">Annuleren</v-btn>
          <v-btn class="btn-danger" style="font-family:var(--font-head);font-weight:700;letter-spacing:2px;" @click="doDelete">Verwijderen</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
import type { DbBevinding, TestSoort } from '~/composables/useReports'

const { dbBevindingen, addDbBevinding, deleteDbBevinding } = useReports()

const search     = ref('')
const expandedId = ref<number | null>(null)
const dialog     = ref(false)
const editId     = ref<number | null>(null)
const delDialog  = ref(false)
const delTarget  = ref<DbBevinding | null>(null)

const catItems = [
  { title: 'Webapplicatie',          value: 'webapplicatie'          },
  { title: 'Laptop',                 value: 'laptop'                 },
  { title: 'Interne Infrastructuur', value: 'interne-infrastructuur' },
  { title: 'Externe Infrastructuur', value: 'externe-infrastructuur' },
  { title: 'Red Teaming',            value: 'red-teaming'            },
  { title: 'Code Review',            value: 'code-review'            },
  { title: 'Cloud',                  value: 'cloud'                  },
]

const byCat = (cat: string) => {
  let list = dbBevindingen.value.filter(b => b.categorie === cat)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(b => b.titel.toLowerCase().includes(q))
  }
  return list
}

const totalFiltered = computed(() => catItems.reduce((acc, c) => acc + byCat(c.value).length, 0))

function toggleExpand(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

const emptyForm = () => ({ titel: '', categorie: 'webapplicatie' as TestSoort, beschrijving: '', stappen: '', risico: '', aanbeveling: '' })
const form = reactive(emptyForm())

function openNew() { Object.assign(form, emptyForm()); editId.value = null; dialog.value = true }
function openEdit(b: DbBevinding) {
  Object.assign(form, { titel: b.titel, categorie: b.categorie, beschrijving: b.beschrijving, stappen: b.stappen, risico: b.risico, aanbeveling: b.aanbeveling })
  editId.value = b.id; dialog.value = true
}
function saveForm() {
  if (!form.titel.trim()) return
  if (editId.value) {
    const b = dbBevindingen.value.find(x => x.id === editId.value)
    if (b) Object.assign(b, form)
  } else {
    addDbBevinding({ ...form })
  }
  dialog.value = false
}

function confirmDelete(b: DbBevinding) { delTarget.value = b; delDialog.value = true }
function doDelete() {
  if (delTarget.value) deleteDbBevinding(delTarget.value.id)
  delDialog.value = false
}
</script>

<style scoped>
.db-row td { vertical-align: top; padding-top: 12px !important; padding-bottom: 12px !important; }
.db-expand {
  background: var(--navy);
  border-left: 3px solid var(--orange);
  border-radius: 0;
}
</style>
