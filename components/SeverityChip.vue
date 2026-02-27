<template>
  <v-chip :class="chipClass" size="small" label>{{ label }}</v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>()

const MAP: Record<string, { cls: string; lbl: string }> = {
  kritiek:    { cls: 'sev-kritiek',    lbl: 'Kritiek' },
  hoog:       { cls: 'sev-hoog',       lbl: 'Hoog' },
  gemiddeld:  { cls: 'sev-gemiddeld',  lbl: 'Gemiddeld' },
  laag:       { cls: 'sev-laag',       lbl: 'Laag' },
  informatief:{ cls: 'sev-informatief',lbl: 'Informatief' },
  nvt:        { cls: 'sev-nvt',        lbl: 'N.V.T.' },
}

const chipClass = computed(() => MAP[props.value]?.cls ?? 'sev-nvt')
const label      = computed(() => MAP[props.value]?.lbl ?? 'N.V.T.')
</script>
