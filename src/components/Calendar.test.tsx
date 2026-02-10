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

  it('navigates to the next month', () => {
    render(<Calendar />)
    const currentDate = new Date()
    // Calculate expected next month
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const nextMonthYear = nextMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const nextButton = screen.getByLabelText('Next month')
    fireEvent.click(nextButton)

    expect(screen.getByText(nextMonthYear)).toBeInTheDocument()
  })

  it('navigates to the previous month', () => {
    render(<Calendar />)
    const currentDate = new Date()
    // Calculate expected previous month
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const prevMonthYear = prevMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const prevButton = screen.getByLabelText('Previous month')
    fireEvent.click(prevButton)

    expect(screen.getByText(prevMonthYear)).toBeInTheDocument()
  })

  it('opens modal on date click', () => {
    render(<Calendar />)
    // Click on the 15th day (should exist in any month)
    const dateCell = screen.getByText('15')
    fireEvent.click(dateCell)

    expect(screen.getByText(/Event for/)).toBeInTheDocument()
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
  })

  it('closes modal on close button click', async () => {
    render(<Calendar />)
    // Find a date cell. The cells contain numbers.
    // We need to be specific because '15' might appear in year or other places (unlikely but possible).
    // The grid cells are just divs with numbers.
    const dateCell = screen.getByText('15')
    fireEvent.click(dateCell)

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    // Use waitFor for async removal (framer-motion AnimatePresence)
    await waitFor(() => {
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
    })
  })
})
