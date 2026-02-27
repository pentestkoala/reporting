<template>
  <div>
    <PageHeader>
      <template #title>MANAGEMENT <span class="accent">SAMENVATTING</span></template>
      <template #subtitle>Vrije tekst voor het management rapport</template>
    </PageHeader>

    <div v-if="!r" class="text-center py-16 font-mono text-dim" style="letter-spacing:2px;">
      Geen rapport geselecteerd — ga naar Dashboard en klik op een rapport.
    </div>
    <template v-else>
      <div class="field-label mb-2">Samenvatting</div>
      <v-textarea
        v-model="r.samenvatting"
        rows="18"
        placeholder="Schrijf hier de managementsamenvatting. Beschrijf de bevindingen op hoog niveau, het risicoprofiel en de aanbevelingen..."
        style="font-size:15px;line-height:1.8;"
        hide-details
      />
      <div class="d-flex justify-end mt-4">
        <v-btn class="btn-orange" @click="save">Opslaan</v-btn>
      </div>
    </template>

    <v-snackbar v-model="saved" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        ✓ Samenvatting opgeslagen
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const { currentReport: r } = useReports()
const saved = ref(false)
function save() { saved.value = true }
</script>
