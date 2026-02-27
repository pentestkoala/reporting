<template>
  <div>
    <PageHeader>
      <template #title>DASHBOARD <span class="accent">// </span>Rapporten</template>
      <template #subtitle>Klik op een rapport om het te openen</template>
      <template #actions>
        <v-btn class="btn-outline-orange" prepend-icon="mdi-plus" @click="dialog = true">
          Nieuw Rapport
        </v-btn>
      </template>
    </PageHeader>

    <v-card elevation="0">
      <v-table>
        <thead>
          <tr>
            <th style="width:80px;">ID</th>
            <th>Naam van het bedrijf</th>
            <th style="width:140px;">Status</th>
            <th style="width:130px;">Datum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reports" :key="r.id" @click="openReport(r.id)">
            <td class="font-mono text-dim">{{ String(r.id).padStart(3,'0') }}</td>
            <td class="text-bright font-weight-semibold">{{ r.bedrijf }}</td>
            <td><StatusChip :value="r.status" /></td>
            <td class="font-mono" style="font-size:12px;color:var(--text-dim);">{{ r.datum }}</td>
          </tr>
          <tr v-if="!reports.length">
            <td colspan="4" class="text-center pa-10 font-mono text-dim" style="letter-spacing:2px;">
              Geen rapporten — maak een nieuw rapport aan
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- New Report Dialog -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card class="pa-8" elevation="0">
        <div class="page-title mb-6">◈ Nieuw Rapport</div>

        <div class="field-label mb-2">Naam van het bedrijf</div>
        <v-text-field v-model="form.bedrijf" placeholder="Bijv. Acme B.V." class="mb-4" hide-details />

        <div class="field-label mb-2">Aanpak</div>
        <v-select v-model="form.aanpak" :items="['blackbox','graybox','whitebox']" class="mb-4" hide-details />

        <div class="field-label mb-2">Status</div>
        <v-select v-model="form.status" :items="['lopend','afgerond','concept']" class="mb-6" hide-details />

        <div class="d-flex justify-end gap-3">
          <v-btn class="btn-outline-orange" @click="dialog = false">Annuleren</v-btn>
          <v-btn class="btn-orange" @click="create">Aanmaken</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
const router = useRouter()
const { reports, setCurrentReport, addReport } = useReports()

const dialog = ref(false)
const form = reactive({ bedrijf: '', aanpak: 'blackbox', status: 'lopend' })

function openReport(id: number) {
  setCurrentReport(id)
  router.push('/statisch')
}

function create() {
  if (!form.bedrijf.trim()) return
  addReport(form.bedrijf.trim(), form.aanpak, form.status)
  dialog.value = false
  form.bedrijf = ''
  router.push('/statisch')
}
</script>
