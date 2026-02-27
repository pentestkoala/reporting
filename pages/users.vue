<template>
  <div>
    <PageHeader>
      <template #title>USERS <span class="accent">// </span>Beheer</template>
      <template #subtitle>Gebruikers aanmaken, wijzigen en verwijderen</template>
      <template #actions>
        <v-btn class="btn-outline-orange" prepend-icon="mdi-account-plus" @click="openNew()">
          Gebruiker Toevoegen
        </v-btn>
      </template>
    </PageHeader>

    <v-card elevation="0">
      <v-table>
        <thead>
          <tr>
            <th style="width:50px;">#</th>
            <th>Naam</th>
            <th>E-mail</th>
            <th style="width:130px;">Rol</th>
            <th style="width:110px;text-align:center;">Status</th>
            <th style="width:120px;text-align:center;">Acties</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(u, i) in users" :key="u.id">
            <td class="font-mono text-dim">{{ String(i+1).padStart(2,'0') }}</td>
            <td class="text-bright font-weight-semibold">
              <div class="d-flex align-center gap-2">
                <v-avatar size="30" :color="avatarColor(u.rol)" rounded="0">
                  <span class="font-mono" style="font-size:11px;color:#fff;">{{ initials(u.naam) }}</span>
                </v-avatar>
                {{ u.naam }}
              </div>
            </td>
            <td class="font-mono" style="font-size:12px;">{{ u.email }}</td>
            <td><v-chip :class="rolClass(u.rol)" size="small" label>{{ u.rol }}</v-chip></td>
            <td style="text-align:center;">
              <v-chip :class="u.actief ? 'status-dicht' : 'status-concept'" size="small" label>
                {{ u.actief ? 'Actief' : 'Inactief' }}
              </v-chip>
            </td>
            <td style="text-align:center;">
              <div class="d-flex justify-center gap-1">
                <v-btn icon size="x-small" class="btn-outline-orange" @click="openEdit(u)">
                  <v-icon size="14">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon size="x-small" :class="u.actief ? 'btn-danger' : 'btn-activate'" @click="toggleActief(u)">
                  <v-icon size="14">{{ u.actief ? 'mdi-account-off' : 'mdi-account-check' }}</v-icon>
                </v-btn>
                <v-btn icon size="x-small" class="btn-danger" @click="confirmDelete(u)">
                  <v-icon size="14">mdi-delete</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="6" class="text-center pa-8 font-mono text-dim" style="letter-spacing:2px;">
              Geen gebruikers gevonden
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="520">
      <v-card class="pa-8" elevation="0">
        <div class="page-title mb-6">{{ editId ? '✎ Gebruiker Wijzigen' : '+ Gebruiker Toevoegen' }}</div>

        <div class="field-label mb-2">Naam</div>
        <v-text-field v-model="form.naam" placeholder="Jan de Vries" class="mb-4" hide-details />

        <div class="field-label mb-2">E-mailadres</div>
        <v-text-field v-model="form.email" placeholder="jan@pentestpro.nl" type="email" class="mb-4" hide-details />

        <div class="field-label mb-2">Rol</div>
        <v-select
          v-model="form.rol"
          :items="rolItems"
          item-title="title"
          item-value="value"
          class="mb-4"
          hide-details
        />

        <div class="field-label mb-2">Status</div>
        <v-select
          v-model="form.actief"
          :items="[{ title:'Actief', value: true }, { title:'Inactief', value: false }]"
          item-title="title"
          item-value="value"
          class="mb-6"
          hide-details
        />

        <div v-if="!editId" class="mb-4">
          <div class="field-label mb-2">Wachtwoord</div>
          <v-text-field v-model="form.wachtwoord" placeholder="Tijdelijk wachtwoord" type="password" hide-details />
          <p class="font-mono mt-2" style="font-size:10px;color:var(--text-dim);letter-spacing:1px;">
            De gebruiker ontvangt een e-mail om het wachtwoord in te stellen.
          </p>
        </div>

        <div class="d-flex justify-end gap-3">
          <v-btn class="btn-outline-orange" @click="dialog = false">Annuleren</v-btn>
          <v-btn class="btn-orange" @click="saveForm">
            {{ editId ? 'Opslaan' : 'Aanmaken' }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-8" elevation="0" style="border-top: 3px solid var(--red) !important;">
        <div class="page-title mb-4" style="color:var(--red);">⚠ Gebruiker Verwijderen</div>
        <p style="font-size:14px;color:var(--text);margin-bottom:24px;">
          Weet je zeker dat je <strong style="color:var(--text-bright);">{{ deleteTarget?.naam }}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
        </p>
        <div class="d-flex justify-end gap-3">
          <v-btn class="btn-outline-orange" @click="deleteDialog = false">Annuleren</v-btn>
          <v-btn class="btn-danger" style="letter-spacing:2px;font-family:var(--font-head);font-weight:700;" @click="doDelete">
            Verwijderen
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Toast -->
    <v-snackbar v-model="saved" :timeout="2500" location="bottom right" color="transparent" elevation="0">
      <div style="background:var(--navy-mid);border:1px solid var(--orange);color:var(--orange);font-family:var(--font-mono);font-size:11px;letter-spacing:2px;padding:12px 20px;">
        ✓ {{ savedMsg }}
      </div>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
import type { User } from '~/composables/useReports'

const { users, addUser, deleteUser } = useReports()

const dialog        = ref(false)
const deleteDialog  = ref(false)
const deleteTarget  = ref<User | null>(null)
const editId        = ref<number | null>(null)
const saved         = ref(false)
const savedMsg      = ref('')

const emptyForm = () => ({ naam:'', email:'', rol: 'pentester' as User['rol'], actief: true, wachtwoord:'' })
const form = reactive(emptyForm())

const rolItems = [
  { title:'Beheerder', value:'beheerder' },
  { title:'Pentester', value:'pentester' },
  { title:'Lezer',     value:'lezer'     },
]

function initials(naam: string) {
  return naam.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
function avatarColor(rol: string) {
  return rol === 'beheerder' ? '#ff6b1a' : rol === 'pentester' ? '#1e2d50' : '#0f1629'
}
function rolClass(rol: string) {
  return rol === 'beheerder' ? 'sev-kritiek' : rol === 'pentester' ? 'sev-laag' : 'sev-nvt'
}

function openNew() {
  Object.assign(form, emptyForm())
  editId.value = null
  dialog.value = true
}
function openEdit(u: User) {
  Object.assign(form, { naam: u.naam, email: u.email, rol: u.rol, actief: u.actief, wachtwoord: '' })
  editId.value = u.id
  dialog.value = true
}
function saveForm() {
  if (!form.naam.trim() || !form.email.trim()) return
  if (editId.value) {
    const u = users.value.find(x => x.id === editId.value)
    if (u) { u.naam = form.naam; u.email = form.email; u.rol = form.rol; u.actief = form.actief }
    savedMsg.value = 'Gebruiker bijgewerkt'
  } else {
    addUser({ naam: form.naam, email: form.email, rol: form.rol, actief: form.actief })
    savedMsg.value = 'Gebruiker aangemaakt'
  }
  dialog.value = false
  saved.value  = true
}
function toggleActief(u: User) {
  u.actief = !u.actief
  savedMsg.value = u.actief ? `${u.naam} geactiveerd` : `${u.naam} gedeactiveerd`
  saved.value = true
}
function confirmDelete(u: User) {
  deleteTarget.value = u
  deleteDialog.value = true
}
function doDelete() {
  if (deleteTarget.value) {
    deleteUser(deleteTarget.value.id)
    savedMsg.value = 'Gebruiker verwijderd'
    saved.value = true
  }
  deleteDialog.value = false
}
</script>

<style scoped>
.btn-activate {
  background: rgba(0,230,118,0.12) !important;
  color: #00e676 !important;
  border: 1px solid rgba(0,230,118,0.3) !important;
}
</style>
