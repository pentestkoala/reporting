<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value" :style="color ? `color:${color}` : ''">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: number | string; color?: string }>()
</script>
