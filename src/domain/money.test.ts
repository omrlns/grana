import { describe, expect, it } from 'vitest'
import { formatBRL, parseBRL } from './money'

const nbsp = ' '

describe('formatBRL', () => {
  it('formats cents as BRL', () => {
    expect(formatBRL(123456)).toBe(`R$${nbsp}1.234,56`)
    expect(formatBRL(1000)).toBe(`R$${nbsp}10,00`)
    expect(formatBRL(5)).toBe(`R$${nbsp}0,05`)
  })

  it('formats negative values', () => {
    expect(formatBRL(-9575)).toBe(`-R$${nbsp}95,75`)
  })
})

describe('parseBRL', () => {
  it.each([
    ['10', 1000],
    ['10,5', 1050],
    ['10,50', 1050],
    ['1.234,56', 123456],
    ['1234,56', 123456],
    ['R$ 1.234,56', 123456],
    [`R$${nbsp}0,05`, 5],
    ['-95,75', -9575],
    ['0', 0],
  ])('parses %s as %i cents', (input, expected) => {
    expect(parseBRL(input)).toBe(expected)
  })

  it.each(['', 'abc', '10,555', '1,234.56', '12.34', ',50', '10,'])('rejects %s', (input) => {
    expect(parseBRL(input)).toBeNull()
  })

  it('never produces fractional cents (no float drift)', () => {
    expect(parseBRL('0,29')).toBe(29)
    expect(parseBRL('1.000.000,07')).toBe(100000007)
  })
})
