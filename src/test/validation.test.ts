import { describe, expect, it } from 'vitest'
import { emailDomainAllowed, friendlyAuthError, makeRegisterSchema, passwordSchema, usernameSchema } from '@/lib/validation'
import { parseDomains } from '@/lib/env'
import { homePathForRole } from '@/lib/roles'

describe('email domain restriction', () => {
  it('allows any domain when none configured', () => {
    expect(emailDomainAllowed('a@gmail.com', [])).toBe(true)
  })
  it('enforces configured domains case-insensitively', () => {
    expect(emailDomainAllowed('A@KLETECH.AC.IN', ['kletech.ac.in'])).toBe(true)
    expect(emailDomainAllowed('a@gmail.com', ['kletech.ac.in'])).toBe(false)
    expect(emailDomainAllowed('nodomain', ['kletech.ac.in'])).toBe(false)
  })
  it('parses a comma separated list', () => {
    expect(parseDomains(' @KLETECH.ac.in , example.edu ,')).toEqual(['kletech.ac.in', 'example.edu'])
    expect(parseDomains(undefined)).toEqual([])
  })
})

describe('password and username rules', () => {
  it('rejects weak passwords', () => {
    expect(passwordSchema.safeParse('short1A').success).toBe(false)
    expect(passwordSchema.safeParse('alllowercase123').success).toBe(false)
    expect(passwordSchema.safeParse('NoDigitsHereAtAll').success).toBe(false)
  })
  it('accepts a strong password', () => {
    expect(passwordSchema.safeParse('Str0ngEnoughPass').success).toBe(true)
  })
  it('normalises and validates usernames', () => {
    expect(usernameSchema.parse(' Jane-Doe ')).toBe('jane-doe')
    expect(usernameSchema.safeParse('-bad').success).toBe(false)
    expect(usernameSchema.safeParse('has space').success).toBe(false)
    expect(usernameSchema.safeParse('ab').success).toBe(false)
  })
})

describe('register schema', () => {
  const base = { fullName: 'Jane Doe', username: 'jane', usn: '', academicYear: '', password: 'Str0ngEnoughPass', confirmPassword: 'Str0ngEnoughPass' }
  it('requires matching passwords', () => {
    const r = makeRegisterSchema([]).safeParse({ ...base, email: 'j@x.edu', confirmPassword: 'different' })
    expect(r.success).toBe(false)
  })
  it('applies the domain restriction', () => {
    expect(makeRegisterSchema(['kletech.ac.in']).safeParse({ ...base, email: 'j@gmail.com' }).success).toBe(false)
    expect(makeRegisterSchema(['kletech.ac.in']).safeParse({ ...base, email: 'j@kletech.ac.in' }).success).toBe(true)
  })
  it('has no role field a user could set', () => {
    const parsed = makeRegisterSchema([]).parse({ ...base, email: 'j@x.edu', role: 'admin' } as never)
    expect('role' in parsed).toBe(false)
  })
})

describe('error mapping and role routing', () => {
  it('does not leak raw errors', () => {
    expect(friendlyAuthError('Invalid login credentials')).toBe('Incorrect email or password.')
    expect(friendlyAuthError('some internal stack trace')).toBe('Something went wrong. Please try again.')
  })
  it('routes roles to their home', () => {
    expect(homePathForRole('student')).toBe('/dashboard')
    expect(homePathForRole('faculty')).toBe('/faculty')
    expect(homePathForRole('admin')).toBe('/admin')
    expect(homePathForRole(null)).toBe('/dashboard')
  })
})
