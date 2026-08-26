import { describe, expect, it } from 'vitest'
import { parseEntries } from './parseEntries'

describe('parseEntries', () => {
  it('returns an empty array for an empty string', () => {
    expect(parseEntries('')).toEqual([])
  })

  it('splits entries separated by newlines', () => {
    expect(parseEntries('Alice\nBob\nCarol')).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('splits entries separated by commas', () => {
    expect(parseEntries('Alice,Bob,Carol')).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('splits entries separated by a mix of newlines and commas', () => {
    expect(parseEntries('Alice,Bob\nCarol')).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('trims whitespace around each entry', () => {
    expect(parseEntries('  Alice  ,  Bob  \n  Carol  ')).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('drops empty entries caused by consecutive separators', () => {
    expect(parseEntries('Alice,,Bob\n\nCarol')).toEqual(['Alice', 'Bob', 'Carol'])
  })

  it('drops entries that are only whitespace', () => {
    expect(parseEntries('Alice,   ,Bob')).toEqual(['Alice', 'Bob'])
  })

  it('returns an empty array when given only separators', () => {
    expect(parseEntries(',,,\n\n\n')).toEqual([])
  })

  it('returns an empty array when given only whitespace', () => {
    expect(parseEntries('   ')).toEqual([])
  })

  it('handles a single entry with no separators', () => {
    expect(parseEntries('Alice')).toEqual(['Alice'])
  })

  it('handles trailing separators', () => {
    expect(parseEntries('Alice,Bob,')).toEqual(['Alice', 'Bob'])
  })

  it('handles leading separators', () => {
    expect(parseEntries(',Alice,Bob')).toEqual(['Alice', 'Bob'])
  })

  it('preserves duplicate entries', () => {
    expect(parseEntries('Alice,Alice,Bob')).toEqual(['Alice', 'Alice', 'Bob'])
  })

  it('preserves internal whitespace within an entry', () => {
    expect(parseEntries('Alice Smith, Bob Jones')).toEqual(['Alice Smith', 'Bob Jones'])
  })

  it('handles a mix of tabs and spaces as part of trimming', () => {
    expect(parseEntries('\tAlice\t,\tBob\t')).toEqual(['Alice', 'Bob'])
  })

  it('handles windows-style line endings', () => {
    expect(parseEntries('Alice\r\nBob')).toEqual(['Alice', 'Bob'])
  })

  it('handles a large number of entries', () => {
    const names = Array.from({ length: 50 }, (_, i) => `Name${i}`)
    expect(parseEntries(names.join('\n'))).toEqual(names)
  })

  it('does not split on characters other than comma or newline', () => {
    expect(parseEntries('Alice; Bob; Carol')).toEqual(['Alice; Bob; Carol'])
  })

  it('handles emoji entries', () => {
    expect(parseEntries('🎉,🥁')).toEqual(['🎉', '🥁'])
  })

  it('handles a single trailing newline after one entry', () => {
    expect(parseEntries('Alice\n')).toEqual(['Alice'])
  })
})
