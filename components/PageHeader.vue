<template>
  <div class="d-flex align-end justify-space-between mb-7 pb-4" style="border-bottom: 1px solid var(--navy-border);">
    <div>
      <div class="page-title">
        <slot name="title" />
      </div>
      <div v-if="$slots.subtitle" class="page-subtitle mt-1">
        <slot name="subtitle" />
      </div>
    </div>
    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
