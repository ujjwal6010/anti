import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Calendar from './Calendar'
import { describe, it, expect } from 'vitest'

describe('Calendar Component', () => {
  it('renders the current month and year', () => {
    render(<Calendar />)
    const currentDate = new Date()
    const monthYear = currentDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    expect(screen.getByText(monthYear)).toBeInTheDocument()
  })

  it('renders days of the week', () => {
    render(<Calendar />)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument()
    })
  })

  it('updates month when navigation buttons are clicked', () => {
    render(<Calendar />)
    const currentDate = new Date()
    const currentMonthYear = currentDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    // Verify initial state
    expect(screen.getByText(currentMonthYear)).toBeInTheDocument()

    // Click Previous Month
    const prevButton = screen.getByLabelText('Previous Month')
    fireEvent.click(prevButton)

    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const prevMonthYear = prevDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    expect(screen.getByText(prevMonthYear)).toBeInTheDocument()

    // Click Next Month (back to current)
    const nextButton = screen.getByLabelText('Next Month')
    fireEvent.click(nextButton)
    expect(screen.getByText(currentMonthYear)).toBeInTheDocument()
  })

  it('opens modal when a date is clicked', () => {
    render(<Calendar />)

    // Find day 15. There should be at least one.
    const day15s = screen.getAllByText('15')
    // Click the first found "15". It might be from previous month padding if visible, but let's try.
    // Usually the middle one is the current month.
    // If there is only one "15" visible, it's fine.
    fireEvent.click(day15s[0])

    expect(screen.getByText(/Event for/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Close Modal')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    render(<Calendar />)

    const day15s = screen.getAllByText('15')
    fireEvent.click(day15s[0])

    expect(screen.getByText(/Event for/i)).toBeInTheDocument()

    const closeButton = screen.getByLabelText('Close Modal')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText(/Event for/i)).not.toBeInTheDocument()
    })
  })
})
