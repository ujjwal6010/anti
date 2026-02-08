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

  it('navigates to the previous month', () => {
    render(<Calendar />)
    const prevButton = screen.getByLabelText('Previous Month')
    fireEvent.click(prevButton)

    const currentDate = new Date()
    // Need to handle month wrap around if current month is January
    const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const prevMonthYear = prevDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    expect(screen.getByText(prevMonthYear)).toBeInTheDocument()
  })

  it('navigates to the next month', () => {
    render(<Calendar />)
    const nextButton = screen.getByLabelText('Next Month')
    fireEvent.click(nextButton)

    const currentDate = new Date()
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const nextMonthYear = nextDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    expect(screen.getByText(nextMonthYear)).toBeInTheDocument()
  })

  it('opens modal when a date is clicked', () => {
    render(<Calendar />)

    // Find a date cell. The 15th is likely present in any month.
    // If not, we can find any valid date.
    // However, 15 is safe for most months unless we are in a weird edge case (e.g. strict tests).
    // Let's use getByText('15').
    const dateButton = screen.getByText('15')
    fireEvent.click(dateButton)

    // The modal displays "Event for <date>"
    // Construct expected date string.
    const currentDate = new Date()
    const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 15)

    expect(screen.getByText(`Event for ${eventDate.toLocaleDateString()}`)).toBeInTheDocument()
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    render(<Calendar />)
    const dateButton = screen.getByText('15')
    fireEvent.click(dateButton)

    // Verify modal is open
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()

    // Click close button
    const closeButton = screen.getByLabelText('Close Modal')
    fireEvent.click(closeButton)

    // Verify modal is closed
    await waitFor(() => {
      expect(screen.queryByText('Team Meeting')).not.toBeInTheDocument()
    })
  })
})
