import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LoginPage from '@/pages/LoginPage'

function renderLogin() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('shows branding, the college photo and the create-account call to action', () => {
    renderLogin()
    expect(screen.getAllByText('Engineering Portfolio Studio').length).toBeGreaterThan(0)
    expect(screen.getByText('KLE Technological University')).toBeInTheDocument()
    expect(screen.getAllByText(/Design\. Analyse\. Build\. Test\. Improve\./i).length).toBeGreaterThan(0)
    expect(screen.getByRole('img', { name: /School of Mechanical Engineering/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create Student Account/i })).toHaveAttribute('href', '/register')
  })

  it('toggles password visibility', async () => {
    renderLogin()
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: /show password/i }))
    expect(input).toHaveAttribute('type', 'text')
  })

  it('tells the developer when Supabase is not configured', () => {
    renderLogin()
    expect(screen.getByText(/Supabase is not configured/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeDisabled()
  })
})
