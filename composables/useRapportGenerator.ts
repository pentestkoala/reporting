// composables/useRapportGenerator.ts
// All template literals avoided - Vue SFC compiler safe
import type { Report } from './useReports'

export function useRapportGenerator() {

  async function generateDocx(report: Report): Promise<void> {
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
      Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
      PageBreak, TableOfContents, PageNumber, Footer, ImageRun, convertInchesToTwip,
    } = await import('docx')

    // ── COLORS ────────────────────────────────────────────────
    const C_ORANGE  = 'FF6B1A'
    const C_NAVY    = '0F1629'
    const C_WHITE   = 'FFFFFF'
    const C_DARK    = '222222'
    const C_DIM     = '6B7FA3'
    const C_ROW_A   = 'F4F6FA'   // zebra even
    const C_ROW_B   = 'FFFFFF'   // zebra odd
    const C_BORDER  = 'D0D8E8'

    const SEV_ORDER = ['kritiek','hoog','gemiddeld','laag','informatief','nvt']
    const SEV_LABEL: Record<string,string> = {
      kritiek:'Kritiek', hoog:'Hoog', gemiddeld:'Gemiddeld',
      laag:'Laag', informatief:'Informatief', nvt:'N.V.T.',
    }
    const SEV_COLOR: Record<string,string> = {
      kritiek:'C0392B', hoog:'A04000', gemiddeld:'7D6608',
      laag:'1A5276', informatief:'6C3483', nvt:'888888',
    }

    const today = new Date().toLocaleDateString('nl-NL', {
      day: '2-digit', month: 'long', year: 'numeric',
    })

    // ── PAGE GEOMETRY ─────────────────────────────────────────
    // A4: 11906 twips wide. Margins: 1440 twips (1 inch) each side = 9026 usable.
    // Using convertInchesToTwip for clarity.
    const MARGIN   = convertInchesToTwip(1)       // 1440
    const PAGE_W   = convertInchesToTwip(8.27)    // A4 width
    const BODY_W   = PAGE_W - (MARGIN * 2)        // ~9026 twips

    // ── TEXT HELPERS ──────────────────────────────────────────
    const tx = (text: string, opts: any = {}) =>
      new TextRun({ text, font: 'Calibri', size: 22, color: C_DARK, ...opts })

    const h1 = (text: string) => new Paragraph({
      children:  [new TextRun({ text, font: 'Calibri', bold: true, size: 40, color: C_ORANGE })],
      heading:   HeadingLevel.HEADING_1,
      spacing:   { before: 400, after: 200 },
      border:    { bottom: { style: BorderStyle.SINGLE, size: 6, color: C_ORANGE } },
    })

    const h2 = (text: string) => new Paragraph({
      children:  [new TextRun({ text, font: 'Calibri', bold: true, size: 28, color: C_DARK })],
      heading:   HeadingLevel.HEADING_2,
      spacing:   { before: 300, after: 140 },
    })

    const h3 = (text: string) => new Paragraph({
      children:  [new TextRun({ text, font: 'Calibri', bold: true, size: 24, color: C_ORANGE })],
      heading:   HeadingLevel.HEADING_3,
      spacing:   { before: 240, after: 100 },
    })

    const body = (text: string) => new Paragraph({
      children:  [tx(text || '\u2014')],
      spacing:   { after: 100 },
    })

    const kv = (label: string, val: string) => new Paragraph({
      children:  [tx(label + ': ', { bold: true }), tx(val || '\u2014')],
      spacing:   { after: 80 },
    })

    const br = () => new Paragraph({ children: [new PageBreak()], spacing: { after: 0 } })
    const nl = () => new Paragraph({ children: [], spacing: { after: 120 } })

    const lines = (text: string) =>
      (text || '').split('\n').filter(Boolean).map(l =>
        new Paragraph({ children: [tx(l)], spacing: { after: 80 } })
      )

    const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

    // ── TABLE BUILDER ─────────────────────────────────────────
    // 'colWidths' is an array of twip widths that MUST sum to BODY_W.
    // We define them as fractions, then normalise so they sum exactly.
    const fractionWidths = (fracs: number[]): number[] => {
      const total = fracs.reduce((a, b) => a + b, 0)
      const widths = fracs.map(f => Math.round((f / total) * BODY_W))
      // fix rounding so sum == BODY_W
      const diff = BODY_W - widths.reduce((a, b) => a + b, 0)
      widths[widths.length - 1] += diff
      return widths
    }

    // One cell: background fill + text color + optional bold
    const cell = (
      text:     string,
      width:    number,
      bg:       string,
      fg:       string,
      bold    = false,
      size    = 20,
      align   = AlignmentType.LEFT,
    ) => new TableCell({
      children: [new Paragraph({
        children:  [new TextRun({ text, font: 'Calibri', size, bold, color: fg })],
        alignment: align,
        spacing:   { before: 60, after: 60 },
      })],
      shading:  { fill: bg, type: ShadingType.CLEAR, color: 'auto' },
      width:    { size: width, type: WidthType.DXA },
      margins:  { top: 80, bottom: 80, left: 120, right: 120 },
    })

    // Header cell (orange bg, white text)
    const hdr = (text: string, w: number) => cell(text, w, C_ORANGE, C_WHITE, true, 20)
    // Navy header cell
    const hdrN = (text: string, w: number) => cell(text, w, C_NAVY, C_WHITE, true, 20)
    // Body rows (zebra)
    const row = (even: boolean, text: string, w: number, fg = C_DARK, bold = false) =>
      cell(text, w, even ? C_ROW_A : C_ROW_B, fg, bold)

    // Standard table borders
    const borders = {
      top:     { style: BorderStyle.SINGLE, size: 4, color: C_ORANGE },
      bottom:  { style: BorderStyle.SINGLE, size: 4, color: C_ORANGE },
      left:    { style: BorderStyle.SINGLE, size: 4, color: C_ORANGE },
      right:   { style: BorderStyle.SINGLE, size: 4, color: C_ORANGE },
      insideH: { style: BorderStyle.SINGLE, size: 2, color: C_BORDER },
      insideV: { style: BorderStyle.SINGLE, size: 2, color: C_BORDER },
    }

    const bordersN = {
      top:     { style: BorderStyle.SINGLE, size: 4, color: C_NAVY },
      bottom:  { style: BorderStyle.SINGLE, size: 4, color: C_NAVY },
      left:    { style: BorderStyle.SINGLE, size: 4, color: C_NAVY },
      right:   { style: BorderStyle.SINGLE, size: 4, color: C_NAVY },
      insideH: { style: BorderStyle.SINGLE, size: 2, color: C_BORDER },
      insideV: { style: BorderStyle.SINGLE, size: 2, color: C_BORDER },
    }

    // Build a full table. colWidths must be twip values summing to BODY_W.
    const makeTable = (rows: TableRow[], colWidths: number[], bords = borders) =>
      new Table({
        width:        { size: BODY_W, type: WidthType.DXA },
        columnWidths: colWidths,
        rows,
        borders:      bords,
      })

    // ── 1. TITLE PAGE ─────────────────────────────────────────
    const aanpakStr = report.aanpak ? cap(report.aanpak) + ' Penetratietest' : 'Penetratietest'

    const titlePage: any[] = [
      new Paragraph({
        children:  [new TextRun({ text: 'PENTESTRAPPORT', font: 'Calibri', bold: true, size: 80, color: C_ORANGE })],
        alignment: AlignmentType.CENTER,
        spacing:   { before: 1440, after: 240 },
      }),
      new Paragraph({
        children:  [new TextRun({ text: report.bedrijf, font: 'Calibri', bold: true, size: 56, color: C_DARK })],
        alignment: AlignmentType.CENTER,
        spacing:   { after: 120 },
      }),
      new Paragraph({
        children:  [new TextRun({ text: aanpakStr, font: 'Calibri', size: 28, color: C_DIM })],
        alignment: AlignmentType.CENTER,
        spacing:   { after: 960 },
      }),
      nl(), nl(),
      new Paragraph({
        children:  [new TextRun({ text: 'Datum: ' + today, font: 'Calibri', size: 22, color: C_DARK })],
        spacing:   { after: 60 },
      }),
    ]
    if (report.pentesters.length) {
      titlePage.push(new Paragraph({
        children: [new TextRun({ text: 'Uitgevoerd door:', font: 'Calibri', bold: true, size: 22, color: C_DARK })],
        spacing:  { after: 40 },
      }))
      report.pentesters.forEach(p => {
        const lbl = p.naam + (p.functie ? ' \u2014 ' + p.functie : '')
        titlePage.push(new Paragraph({
          children: [new TextRun({ text: '  ' + lbl, font: 'Calibri', size: 22, color: C_DARK })],
          spacing:  { after: 40 },
        }))
      })
    }
    titlePage.push(br())

    // ── 2. TOC ────────────────────────────────────────────────
    const tocPage: any[] = [
      h1('Inhoudsopgave'),
      new TableOfContents('Inhoudsopgave', {
        hyperlink: true,
        headingStyleRange: '1-3',
        stylesWithLevels: [
          { styleName: 'Heading 1', level: 1 },
          { styleName: 'Heading 2', level: 2 },
          { styleName: 'Heading 3', level: 3 },
        ],
      }),
      br(),
    ]

    // ── 3. MANAGEMENT SAMENVATTING ────────────────────────────
    const samenvPage: any[] = [
      h1('1. Managementsamenvatting'),
      ...(report.samenvatting ? lines(report.samenvatting) : [body('\u2014')]),
      br(),
    ]

    // ── 4. TECHNISCHE SAMENVATTING ─────────────────────────────
    // Sort bevindingen by severity
    const sortedBev = [
      ...report.bevindingen.filter(b => b.severiteit !== 'nvt')
        .sort((a, b) => SEV_ORDER.indexOf(a.severiteit) - SEV_ORDER.indexOf(b.severiteit)),
      ...report.bevindingen.filter(b => b.severiteit === 'nvt'),
    ]

    // 5 columns: # | Bevinding | Severiteit | Status | Referentie
    // Fractions: 0.06 | 0.36 | 0.20 | 0.18 | 0.20
    const col5 = fractionWidths([0.06, 0.36, 0.20, 0.18, 0.20])

    const sevTableRows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: [
          hdr('#',          col5[0]),
          hdr('Bevinding',  col5[1]),
          hdr('Severiteit', col5[2]),
          hdr('Status',     col5[3]),
          hdr('Referentie', col5[4]),
        ],
      }),
      ...sortedBev.map((b, i) => {
        const ev = i % 2 === 0
        return new TableRow({ children: [
          row(ev, String(i + 1).padStart(2, '0'), col5[0]),
          row(ev, b.titel,                        col5[1]),
          row(ev, SEV_LABEL[b.severiteit] ?? '\u2014', col5[2], SEV_COLOR[b.severiteit] ?? C_DARK, true),
          row(ev, b.status === 'open' ? 'Open' : 'Dicht', col5[3], b.status === 'open' ? 'C0392B' : '1E8449'),
          row(ev, b.referentie || '\u2014', col5[4]),
        ]})
      }),
    ]

    const techPage: any[] = [
      h1('2. Technische Samenvatting'),
      body('Onderstaande tabel geeft een overzicht van alle bevindingen, gesorteerd op ernst.'),
      nl(),
      makeTable(sevTableRows, col5),
      br(),
    ]

    // ── 5. BESCHRIJVING ───────────────────────────────────────
    const TS_LABEL: Record<string,string> = {
      'webapplicatie': 'Webapplicatie',
      'laptop': 'Laptop',
      'interne-infrastructuur': 'Interne Infrastructuur',
      'externe-infrastructuur': 'Externe Infrastructuur',
      'red-teaming': 'Red Teaming',
      'code-review': 'Code Review',
      'cloud': 'Cloud',
    }
    const RISICO_LABEL: Record<string,string> = {
      kritiek: 'Kritiek', hoog: 'Hoog', gemiddeld: 'Gemiddeld', laag: 'Laag', informatief: 'Informatief',
    }

    const beschrPage: any[] = [
      h1('3. Beschrijving'),
      h2('3.1 Klantgegevens'),
      kv('Bedrijf',        report.bedrijf),
      kv('Contactpersoon', report.contactNaam),
      kv('E-mail',         report.contactEmail),
      kv('Telefoon',       report.contactTel),
      nl(),
      h2('3.2 Opdrachtgegevens'),
      kv('Aanpak',         report.aanpak ? cap(report.aanpak) : '\u2014'),
      kv('Risico niveau',  report.risicoNiveau ? (RISICO_LABEL[report.risicoNiveau] ?? report.risicoNiveau) : '\u2014'),
      kv('Soort pentest',  report.testSoorten?.length ? report.testSoorten.map(t => TS_LABEL[t] ?? t).join(', ') : '\u2014'),
      kv('Datum',          report.datum),
      nl(),
      h2('3.3 Pentesters'),
    ]
    if (report.pentesters.length) {
      report.pentesters.forEach((p, i) => {
        beschrPage.push(h3('Pentester ' + (i + 1) + ': ' + p.naam))
        beschrPage.push(kv('Naam',     p.naam))
        beschrPage.push(kv('Functie',  p.functie))
        beschrPage.push(kv('E-mail',   p.email))
        beschrPage.push(kv('Telefoon', p.tel))
        beschrPage.push(nl())
      })
    } else {
      beschrPage.push(body('Geen pentesters geregistreerd.'))
    }
    beschrPage.push(br())

    // ── 6. BEVINDINGEN ────────────────────────────────────────
    const bevPages: any[] = [h1('4. Bevindingen')]
    const withDetail = sortedBev.filter(b =>
      b.beschrijving || b.stappen || b.risico || b.aanbeveling || b.fotos?.length
    )

    // Per-finding meta: 4 equal columns (label | value | label | value)
    const col4 = fractionWidths([0.25, 0.25, 0.25, 0.25])
    // 2-col label/value
    const col2 = fractionWidths([0.25, 0.75])

    for (const bev of withDetail) {
      bevPages.push(br())

      // Bevinding heading
      bevPages.push(new Paragraph({
        children:  [new TextRun({ text: bev.titel, font: 'Calibri', bold: true, size: 36, color: C_ORANGE })],
        heading:   HeadingLevel.HEADING_2,
        spacing:   { before: 200, after: 200 },
      }))

      // Meta table: Severiteit | value | Status | value
      const metaRows: TableRow[] = [
        new TableRow({ children: [
          hdrN('Severiteit', col4[0]),
          cell(SEV_LABEL[bev.severiteit] ?? '\u2014', col4[1], C_ROW_A, SEV_COLOR[bev.severiteit] ?? C_DARK, true, 20),
          hdrN('Status', col4[2]),
          cell(bev.status === 'open' ? 'Open' : 'Dicht', col4[3], C_ROW_A, bev.status === 'open' ? 'C0392B' : '1E8449', true, 20),
        ]}),
      ]
      if (bev.referentie) {
        metaRows.push(new TableRow({ children: [
          hdrN('Referentie', col2[0]),
          cell(bev.referentie, col2[1], C_ROW_A, C_DARK, false, 20),
        ]}))
      }
      bevPages.push(makeTable(metaRows, bev.referentie ? col2 : col4, bordersN))
      bevPages.push(nl())

      if (bev.beschrijving) {
        bevPages.push(h3('Beschrijving'))
        bevPages.push(body(bev.beschrijving))
      }

      if (bev.stappen || bev.fotos?.length) {
        bevPages.push(h3('Reproduceerbare stappen voor de klant'))
        if (bev.stappen) bevPages.push(...lines(bev.stappen))

        if (bev.fotos?.length) {
          bevPages.push(nl())
          bevPages.push(new Paragraph({ children: [tx('Screenshots:', { bold: true })], spacing: { after: 100 } }))
          for (const foto of bev.fotos) {
            try {
              const b64   = foto.src.split(',')[1]
              const ext   = (foto.src.split(';')[0].split('/')[1] ?? 'png').toLowerCase()
              const bin   = atob(b64)
              const bytes = new Uint8Array(bin.length)
              for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
              const t: any = (ext === 'jpg' || ext === 'jpeg') ? 'jpg' : ext === 'gif' ? 'gif' : 'png'

              const dims = await new Promise<{w:number;h:number}>(res => {
                const img = new Image()
                img.onload  = () => res({ w: img.naturalWidth,  h: img.naturalHeight })
                img.onerror = () => res({ w: 400, h: 300 })
                img.src = foto.src
              })
              const sc = Math.min(1, 500 / dims.w)
              bevPages.push(new Paragraph({
                children:  [new ImageRun({ data: bytes.buffer, transformation: { width: Math.round(dims.w * sc), height: Math.round(dims.h * sc) }, type: t })],
                spacing:   { after: 80 },
              }))
              bevPages.push(new Paragraph({
                children:  [tx(foto.name, { italics: true, size: 18, color: C_DIM })],
                spacing:   { after: 120 },
              }))
            } catch {
              bevPages.push(body('[Afbeelding: ' + foto.name + ']'))
            }
          }
        }
      }

      if (bev.risico)      { bevPages.push(h3('Risico'));      bevPages.push(body(bev.risico))      }
      if (bev.aanbeveling) { bevPages.push(h3('Aanbeveling')); bevPages.push(body(bev.aanbeveling)) }
    }

    if (!withDetail.length) bevPages.push(body('Geen bevindingen met details geregistreerd.'))

    // ── 7. CONCLUSIE ──────────────────────────────────────────
    const conclusiePage: any[] = [
      br(),
      h1('5. Conclusie'),
      ...(report.conclusie ? lines(report.conclusie) : [body('\u2014')]),
    ]

    // ── ASSEMBLE ──────────────────────────────────────────────
    const footerStr = report.bedrijf + ' \u2014 Vertrouwelijk'

    const doc = new Document({
      title:       'Pentestrapport ' + report.bedrijf,
      description: 'Penetratietest rapport voor ' + report.bedrijf,
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 22, color: C_DARK } },
          heading1: { run: { font: 'Calibri', bold: true, size: 40, color: C_ORANGE } },
          heading2: { run: { font: 'Calibri', bold: true, size: 28, color: C_DARK   } },
          heading3: { run: { font: 'Calibri', bold: true, size: 24, color: C_ORANGE } },
        },
      },
      sections: [{
        properties: {
          page: {
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
            size:   { width: PAGE_W, height: convertInchesToTwip(11.69) },
          },
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              children:  [
                new TextRun({ text: footerStr, font: 'Calibri', size: 18, color: C_DIM }),
                new TextRun({ children: ['\t\t', PageNumber.CURRENT], font: 'Calibri', size: 18, color: C_DIM }),
              ],
              alignment: AlignmentType.CENTER,
              spacing:   { before: 200 },
            })],
          }),
        },
        children: [
          ...titlePage,
          ...tocPage,
          ...samenvPage,
          ...techPage,
          ...beschrPage,
          ...bevPages,
          ...conclusiePage,
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'Pentestrapport_' + report.bedrijf.replace(/[^a-zA-Z0-9]/g, '_') + '_' + report.datum + '.docx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { generateDocx }
}
