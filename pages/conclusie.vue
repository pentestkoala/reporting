<template>
  <div>
    <PageHeader>
      <template #title>CONCLUSIE <span class="accent">// </span>Eindoordeel</template>
      <template #subtitle>Samenvatting en eindbeoordeling van de pentest</template>
    </PageHeader>

    <div v-if="!r" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      Geen rapport geselecteerd — ga naar Dashboard en klik op een rapport.
    </div>

    <template v-else>
      <div class="field-label mb-2">Conclusie</div>
      <v-textarea
        v-model="r.conclusie"
        rows="16"
        placeholder="Schrijf hier de conclusie van de pentest..."
        style="font-size:15px;line-height:1.8;"
        hide-details
        class="mb-6"
      />
      <div class="d-flex justify-end gap-3">
        <v-btn class="btn-orange" @click="save">
          <v-icon class="mr-2">mdi-content-save</v-icon>Opslaan
        </v-btn>
        <v-btn class="btn-generate" :loading="generating" @click="doGenerate">
          <v-icon class="mr-2">mdi-file-word-box</v-icon>Genereer Rapport
        </v-btn>
      </div>
    </template>

    <v-snackbar v-model="saved" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        Conclusie opgeslagen
      </div>
    </v-snackbar>
    <v-snackbar v-model="generated" :timeout="3000" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid #00e676;color:#00e676;font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        Rapport gedownload als .docx
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })

const { currentReport: r }    = useReports()
const { generateDocx }        = useRapportGenerator()

const saved      = ref(false)
const generated  = ref(false)
const generating = ref(false)

function save() { saved.value = true }

async function doGenerate() {
  if (!r.value) return
  generating.value = true
  try {
    await generateDocx(r.value)
    generated.value = true
  } catch (err) {
    console.error('Rapport genereren mislukt:', err)
    alert('Rapport genereren mislukt: ' + String(err))
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.btn-generate {
  background: linear-gradient(135deg, #0d2137, #1e3a5f) !important;
  color: #40c4ff !important;
  border: 1px solid rgba(64,196,255,0.4) !important;
  border-radius: 0 !important;
  font-family: var(--font-head) !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
  padding: 0 24px !important;
}
.btn-generate:hover {
  background: rgba(64,196,255,0.1) !important;
  box-shadow: 0 0 20px rgba(64,196,255,0.2) !important;
}
</style>
