/** Money is always handled as integer cents. Convert only at the UI edge. */
export type Cents = number

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(cents: Cents): string {
  return brl.format(cents / 100)
}

/**
 * Parses a pt-BR money string typed by the user ("1.234,56", "R$ 10", "-5,5") into cents.
 * Returns null when the input is not a valid amount.
 */
export function parseBRL(input: string): Cents | null {
  const cleaned = input.replace(/R\$|\s| /g, '')
  if (!/^-?\d{1,3}(\.\d{3})*(,\d{1,2})?$|^-?\d+(,\d{1,2})?$/.test(cleaned)) return null

  const negative = cleaned.startsWith('-')
  const [intPart, decPart = ''] = cleaned.replace('-', '').replace(/\./g, '').split(',')
  const cents = Number(intPart) * 100 + Number(decPart.padEnd(2, '0'))
  return negative ? -cents : cents
}
