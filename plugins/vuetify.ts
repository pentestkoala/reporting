// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          dark: true,
          colors: {
            background:          '#0a0e1a',
            surface:             '#0f1629',
            'surface-variant':   '#1a2340',
            primary:             '#ff6b1a',
            'primary-darken-1':  '#cc5514',
            secondary:           '#1e2d50',
            error:               '#ff3d57',
            info:                '#40c4ff',
            success:             '#00e676',
            warning:             '#ffd740',
          },
        },
      },
    },
    defaults: {
      VBtn:      { variant: 'flat',     rounded: 0 },
      VTextField:{ variant: 'outlined', rounded: 0, density: 'comfortable', color: 'primary', baseColor: 'secondary' },
      VTextarea: { variant: 'outlined', rounded: 0, density: 'comfortable', color: 'primary', baseColor: 'secondary' },
      VSelect:   { variant: 'outlined', rounded: 0, density: 'comfortable', color: 'primary', baseColor: 'secondary' },
      VCard:     { rounded: 0 },
      VDialog:   { rounded: 0 },
      VChip:     { rounded: 0 },
    },
  })

  app.vueApp.use(vuetify)
})
