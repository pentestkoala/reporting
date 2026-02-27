<template>
  <!-- Top App Bar -->
  <v-app-bar flat height="64" color="surface" style="border-bottom: 1px solid var(--navy-border) !important;">
    <v-app-bar-title>
      <span class="brand-text">PENTEST<span>PRO</span></span>
    </v-app-bar-title>
    <template #append>
      <span v-if="currentReport" class="font-mono mr-4" style="font-size:13px;color:var(--text-dim);letter-spacing:1px;">
        ▸ <span style="color:var(--orange);font-weight:600;">{{ currentReport.bedrijf }}</span>
      </span>
      <span v-else class="font-mono mr-4" style="font-size:12px;color:var(--text-dim);letter-spacing:1px;">
        Geen rapport geselecteerd
      </span>
      <span class="font-mono mr-5" style="font-size:12px;color:var(--text-dim);letter-spacing:1px;">
        Ingelogd als: <span style="color:var(--orange);">admin</span>
      </span>
      <v-btn
        class="btn-outline-orange mr-4"
        size="small"
        style="font-family:var(--font-mono);font-size:11px;letter-spacing:2px;"
        @click="logout"
      >
        Uitloggen
      </v-btn>
    </template>
  </v-app-bar>

  <!-- Navigation Drawer -->
  <v-navigation-drawer
    permanent
    :width="240"
    color="surface"
    style="border-right: 1px solid var(--navy-border) !important;"
  >
    <div class="pt-4">
      <!-- Navigatie -->
      <div class="nav-section-label px-5 pb-3">Navigatie</div>
      <v-divider style="border-color: var(--navy-border) !important;" />
      <v-list nav density="compact" class="pt-2 pb-0">
        <v-list-item
          prepend-icon="mdi-view-grid"
          value="dashboard"
          :active="route.path === '/dashboard'"
          active-color="primary"
          rounded="0"
          @click="nav('/dashboard')"
        >
          <v-list-item-title class="nav-item-title">Dashboard</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Rapport Secties -->
      <div class="nav-section-label px-5 pt-5 pb-3">Rapport Secties</div>
      <v-divider style="border-color: var(--navy-border) !important;" />
      <v-list nav density="compact" class="pt-2 pb-0">
        <v-list-item
          prepend-icon="mdi-database-edit"
          value="statisch"
          :active="route.path === '/statisch'"
          active-color="primary"
          rounded="0"
          @click="nav('/statisch')"
        >
          <v-list-item-title class="nav-item-title">Statische Data</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-text-box-outline"
          value="samenvatting"
          :active="route.path === '/samenvatting'"
          active-color="primary"
          rounded="0"
          @click="nav('/samenvatting')"
        >
          <v-list-item-title class="nav-item-title">Mgmt Samenvatting</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-shield-alert"
          value="bevindingen"
          :active="route.path === '/bevindingen' || route.path.startsWith('/bevindingen/')"
          active-color="primary"
          rounded="0"
          @click="nav('/bevindingen')"
        >
          <v-list-item-title class="nav-item-title">Bevindingen</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-check-decagram"
          value="conclusie"
          :active="route.path === '/conclusie'"
          active-color="primary"
          rounded="0"
          @click="nav('/conclusie')"
        >
          <v-list-item-title class="nav-item-title">Conclusie</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Overige -->
      <div class="nav-section-label px-5 pt-5 pb-3">Overige</div>
      <v-divider style="border-color: var(--navy-border) !important;" />
      <v-list nav density="compact" class="pt-2">
        <v-list-item
          prepend-icon="mdi-database-search"
          value="finding-database"
          :active="route.path === '/finding-database'"
          active-color="primary"
          rounded="0"
          @click="nav('/finding-database')"
        >
          <v-list-item-title class="nav-item-title">Finding Database</v-list-item-title>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group"
          value="users"
          :active="route.path === '/users'"
          active-color="primary"
          rounded="0"
          @click="nav('/users')"
        >
          <v-list-item-title class="nav-item-title">Users</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>

  <!-- Main Content -->
  <v-main style="background: var(--navy);">
    <div class="pa-8">
      <slot />
    </div>
  </v-main>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { currentReport } = useReports()

function nav(path: string) { router.push(path) }
function logout() { router.push('/') }
</script>

<style scoped>
.nav-section-label {
  font-family: var(--font-head);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-dim);
  text-transform: uppercase;
  display: block;
}
.nav-item-title {
  font-family: var(--font-head) !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}
:deep(.v-list-item--active) {
  border-left: 3px solid var(--orange) !important;
  background: var(--orange-dim) !important;
}
:deep(.v-list-item--active .v-list-item-title) {
  color: var(--orange) !important;
}
:deep(.v-list-item--active .v-icon) {
  color: var(--orange) !important;
}
:deep(.v-list-item) {
  border-left: 3px solid transparent;
  border-radius: 0 !important;
  transition: background 0.15s, border-color 0.15s;
}
:deep(.v-list-item:hover) {
  background: rgba(255,107,26,0.05) !important;
}
</style>
