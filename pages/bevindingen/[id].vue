<template>
  <div>
    <div class="mb-5">
      <span class="back-btn" @click="router.push('/bevindingen')">
        <v-icon size="14" class="mr-1">mdi-arrow-left</v-icon>Terug naar bevindingen
      </span>
    </div>

    <div v-if="!b" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      Bevinding niet gevonden.
    </div>
    <template v-else>
      <div class="d-flex align-center mb-6 pb-4" style="border-bottom:1px solid var(--navy-border);">
        <v-icon color="primary" class="mr-3">mdi-shield-alert</v-icon>
        <span class="page-title">{{ b.titel }}</span>
      </div>

      <v-card elevation="0" style="border-top: 3px solid var(--orange) !important;" class="pa-7">
        <v-row>
          <v-col cols="12" md="6">
            <div class="field-label mb-2">Severiteit</div>
            <v-select v-model="b.severiteit" :items="sevItems" hide-details />
          </v-col>
          <v-col cols="12" md="6">
            <div class="field-label mb-2">Status</div>
            <v-select v-model="b.status" :items="['open','dicht']" hide-details />
          </v-col>
          <v-col cols="12" class="mt-4">
            <div class="field-label mb-2">Algemene Beschrijving</div>
            <v-textarea v-model="b.beschrijving" rows="5" placeholder="Beschrijf de bevinding: wat is het, hoe werkt het, hoe is het gevonden..." hide-details />
          </v-col>
          <v-col cols="12" class="mt-4">
            <div class="field-label mb-2">Reproduceerbare Stappen (voor de klant)</div>
            <v-textarea v-model="b.stappen" rows="6" placeholder="Stap 1: ...&#10;Stap 2: ...&#10;Stap 3: ..." hide-details />
          </v-col>
          <v-col cols="12" md="6" class="mt-4">
            <div class="field-label mb-2">Risico voor de klant</div>
            <v-textarea v-model="b.risico" rows="4" placeholder="Wat zijn de mogelijke gevolgen als dit niet wordt opgelost?" hide-details />
          </v-col>
          <v-col cols="12" md="6" class="mt-4">
            <div class="field-label mb-2">Aanbeveling</div>
            <v-textarea v-model="b.aanbeveling" rows="4" placeholder="Welke maatregelen worden aanbevolen?" hide-details />
          </v-col>

          <!-- Image upload -->
          <v-col cols="12" class="mt-4">
            <div class="section-title mb-4">Bewijs / Screenshots</div>
            <div
              class="upload-zone"
              @click="fileInput?.click()"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
              @drop.prevent="onDrop"
              :style="dragging ? 'border-color:var(--orange);background:var(--orange-dim)' : ''"
            >
              <v-icon color="primary" size="32">mdi-cloud-upload</v-icon>
              <p>Klik om afbeeldingen te uploaden of sleep ze hier naartoe</p>
              <p style="font-size:10px;">PNG, JPG, GIF — meerdere bestanden mogelijk</p>
            </div>
            <input ref="fileInput" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
            <v-row class="mt-3">
              <v-col v-for="(f, i) in b.fotos" :key="i" cols="6" sm="4" md="3" lg="2">
                <div class="image-thumb">
                  <v-btn class="remove-btn btn-danger" size="x-small" icon @click="b.fotos.splice(i,1)">
                    <v-icon size="12">mdi-close</v-icon>
                  </v-btn>
                  <img :src="f.src" :alt="f.name" />
                  <div class="img-caption">{{ f.name }}</div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <div class="d-flex justify-end gap-3 mt-6">
          <v-btn class="btn-outline-orange" @click="router.push('/bevindingen')">Annuleren</v-btn>
          <v-btn class="btn-orange" @click="save">Opslaan</v-btn>
        </div>
      </v-card>
    </template>

    <v-snackbar v-model="saved" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        ✓ Bevinding opgeslagen
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const route  = useRoute()
const router = useRouter()
const { currentReport } = useReports()
const id = computed(() => Number(route.params.id))
const b  = computed(() => currentReport.value?.bevindingen.find(x => x.id === id.value) ?? null)
const sevItems = ['nvt','kritiek','hoog','gemiddeld','laag','informatief']
const fileInput = ref<HTMLInputElement | null>(null)
const dragging  = ref(false)
const saved     = ref(false)
function save() { saved.value = true; router.push('/bevindingen') }
function handleFiles(files: FileList | null) {
  if (!files || !b.value) return
  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = e => b.value!.fotos.push({ name: file.name, src: e.target!.result as string })
    reader.readAsDataURL(file)
  })
}
function onFileChange(e: Event) { handleFiles((e.target as HTMLInputElement).files); (e.target as HTMLInputElement).value = '' }
function onDrop(e: DragEvent) { dragging.value = false; handleFiles(e.dataTransfer?.files ?? null) }
</script>
