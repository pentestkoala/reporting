<template>
  <v-chip :class="chipClass" size="small" label>{{ label }}</v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{ value: string }>()

const MAP: Record<string, { cls: string; lbl: string }> = {
  open:     { cls: 'status-open',     lbl: 'Open' },
  dicht:    { cls: 'status-dicht',    lbl: 'Dicht' },
  lopend:   { cls: 'status-lopend',   lbl: 'Lopend' },
  afgerond: { cls: 'status-afgerond', lbl: 'Afgerond' },
  concept:  { cls: 'status-concept',  lbl: 'Concept' },
}

const chipClass = computed(() => MAP[props.value]?.cls ?? 'status-concept')
const label      = computed(() => MAP[props.value]?.lbl ?? props.value)
</script>
