<template>
  <v-main style="background: var(--navy); min-height: 100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
    <!-- Grid background -->
    <div class="login-grid"></div>
    <!-- Scanline -->
    <div class="scanline"></div>

    <v-card class="login-box" elevation="0">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="font-mono text-orange mb-2" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;">[ Secure Access ]</div>
        <div class="brand-text" style="font-size:38px;">PENTEST<span>PRO</span></div>
        <div class="font-mono text-dim mt-1" style="font-size:10px;letter-spacing:3px;animation:flicker 8s infinite;">
          Rapportage Platform v2.5.0 <span class="terminal-cursor"></span>
        </div>
      </div>

      <!-- Form -->
      <v-text-field
        v-model="username"
        label="Gebruikersnaam"
        prepend-inner-icon="mdi-account"
        class="mb-3"
        @keyup.enter="login"
      />
      <v-text-field
        v-model="password"
        label="Wachtwoord"
        type="password"
        prepend-inner-icon="mdi-lock"
        :error="loginError"
        :error-messages="loginError ? 'Ongeldige inloggegevens' : ''"
        class="mb-4"
        @keyup.enter="login"
      />
      <v-btn class="btn-orange" size="large" block @click="login">
        <v-icon class="mr-2">mdi-chevron-right</v-icon> Inloggen
      </v-btn>
      <div class="text-center mt-4 font-mono text-dim" style="font-size:10px;letter-spacing:1px;">
        Demo: admin / admin
      </div>
    </v-card>
  </v-main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const username = ref('admin')
const password = ref('admin')
const loginError = ref(false)
const router = useRouter()

function login() {
  if (username.value === 'admin' && password.value === 'admin') {
    loginError.value = false
    router.push('/dashboard')
  } else {
    loginError.value = true
    setTimeout(() => { loginError.value = false }, 2000)
  }
}
</script>

<style scoped>
.login-grid {
  position: absolute; inset: 0; pointer-events: none;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,107,26,0.02) 2px, rgba(255,107,26,0.02) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,107,26,0.02) 40px, rgba(255,107,26,0.02) 41px);
}
.scanline {
  position: absolute; width: 100%; height: 4px; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,107,26,0.4), transparent);
  animation: scanline 4s linear infinite;
}
.login-box {
  width: 420px; padding: 48px;
  border-top: 3px solid var(--orange) !important;
  animation: borderGlow 3s ease-in-out infinite;
  position: relative; z-index: 1;
}
</style>
