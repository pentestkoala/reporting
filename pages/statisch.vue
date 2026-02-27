<template>
  <div>
    <PageHeader>
      <template #title>STATISCHE <span class="accent">DATA</span></template>
      <template #subtitle>Klant- en opdrachtgegevens voor het rapport</template>
    </PageHeader>

    <div v-if="!r" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      Geen rapport geselecteerd — ga naar Dashboard en klik op een rapport.
    </div>

    <template v-else>

      <!-- ── KLANTGEGEVENS ── -->
      <div class="section-title mb-5">Klantgegevens</div>
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <div class="field-label mb-2">Bedrijfsnaam</div>
          <v-text-field v-model="r.bedrijf" placeholder="Acme B.V." hide-details />
        </v-col>
        <v-col cols="12" md="6">
          <div class="field-label mb-2">Contactpersoon naam</div>
          <v-text-field v-model="r.contactNaam" placeholder="Jan de Vries" hide-details />
        </v-col>
        <v-col cols="12" md="6">
          <div class="field-label mb-2">Contactpersoon e-mail</div>
          <v-text-field v-model="r.contactEmail" placeholder="jan@acme.nl" hide-details />
        </v-col>
        <v-col cols="12" md="6">
          <div class="field-label mb-2">Contactpersoon telefoonnummer</div>
          <v-text-field v-model="r.contactTel" placeholder="+31 6 12345678" hide-details />
        </v-col>
      </v-row>

      <!-- ── OPDRACHTGEGEVENS ── -->
      <div class="section-title mb-5">Opdrachtgegevens</div>
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <div class="field-label mb-2">Aanpak</div>
          <v-select
            v-model="r.aanpak"
            :items="aanpakItems"
            item-title="title"
            item-value="value"
            placeholder="Selecteer aanpak"
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <div class="field-label mb-2">Risico niveau</div>
          <v-select
            v-model="r.risicoNiveau"
            :items="risicoItems"
            item-title="title"
            item-value="value"
            placeholder="Selecteer risico"
            hide-details
          >
            <template #selection="{ item }">
              <v-chip :class="`sev-${item.value}`" size="small" label>{{ item.title }}</v-chip>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12" md="4">
          <div class="field-label mb-2">Soort pentest (meerdere mogelijk)</div>
          <v-select
            v-model="r.testSoorten"
            :items="testSoortItems"
            item-title="title"
            item-value="value"
            placeholder="Selecteer soorten..."
            multiple
            chips
            closable-chips
            hide-details
          >
            <template #chip="{ props, item }">
              <v-chip v-bind="props" class="sev-nvt" size="small" closable>{{ item.title }}</v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>

      <!-- ── PENTESTERS ── -->
      <div class="section-title mb-5">Pentesters</div>
      <div v-for="(p, i) in r.pentesters" :key="i" class="pentester-row mb-3">
        <v-row no-gutters align="end">
          <v-col cols="12" md="3" class="pr-3">
            <div class="field-label mb-2">Naam</div>
            <v-text-field v-model="p.naam" placeholder="Alice Smit" density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="2" class="px-3">
            <div class="field-label mb-2">Functie</div>
            <v-text-field v-model="p.functie" placeholder="Senior Pentester" density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="3" class="px-3">
            <div class="field-label mb-2">E-mail</div>
            <v-text-field v-model="p.email" placeholder="alice@..." density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="3" class="px-3">
            <div class="field-label mb-2">Telefoon</div>
            <v-text-field v-model="p.tel" placeholder="+31 6..." density="compact" hide-details />
          </v-col>
          <v-col cols="12" md="1" class="d-flex align-center justify-center pt-5">
            <v-btn class="btn-danger" size="small" icon @click="r.pentesters.splice(i, 1)">
              <v-icon size="16">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <button class="add-row-btn mb-6" @click="r.pentesters.push({ naam:'', functie:'', email:'', tel:'' })">
        + Pentester toevoegen
      </button>

      <div class="d-flex justify-end mt-4">
        <v-btn class="btn-orange" @click="save">Opslaan</v-btn>
      </div>
    </template>

    <v-snackbar v-model="saved" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        ✓ Statische data opgeslagen
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { currentReport: r, syncBevindingen } = useReports()
const saved = ref(false)
function save() { saved.value = true }

// When testSoorten changes, auto-sync bevindingen from the Finding Database
watch(
  () => r.value?.testSoorten,
  (soorten) => {
    if (soorten) syncBevindingen(soorten)
  },
  { deep: true }
)

const aanpakItems = [
  { title: 'Blackbox', value: 'blackbox' },
  { title: 'Graybox',  value: 'graybox'  },
  { title: 'Whitebox', value: 'whitebox' },
]

const risicoItems = [
  { title: 'Kritiek',     value: 'kritiek'     },
  { title: 'Hoog',        value: 'hoog'        },
  { title: 'Gemiddeld',   value: 'gemiddeld'   },
  { title: 'Laag',        value: 'laag'        },
  { title: 'Informatief', value: 'informatief' },
]

const testSoortItems = [
  { title: 'Webapplicatie',          value: 'webapplicatie'           },
  { title: 'Laptop',                 value: 'laptop'                  },
  { title: 'Interne Infrastructuur', value: 'interne-infrastructuur'  },
  { title: 'Externe Infrastructuur', value: 'externe-infrastructuur'  },
  { title: 'Red Teaming',            value: 'red-teaming'             },
  { title: 'Code Review',            value: 'code-review'             },
  { title: 'Cloud',                  value: 'cloud'                   },
]
</script>
