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

  it('navigates to previous and next month', async () => {
    render(<Calendar />)
    const prevButton = screen.getByLabelText('Previous Month')
    const nextButton = screen.getByLabelText('Next Month')

    // Test Previous Month
    fireEvent.click(prevButton)
    const now = new Date()
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonthYear = prevDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    await waitFor(() => {
        expect(screen.getByText(prevMonthYear)).toBeInTheDocument()
    })

    // Test Next Month (back to current)
    fireEvent.click(nextButton)
    const currentDate = new Date()
    const currentMonthYear = currentDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    await waitFor(() => {
        expect(screen.getByText(currentMonthYear)).toBeInTheDocument()
    })
  })

  it('opens and closes the event modal', async () => {
    render(<Calendar />)

    // Click on a date (we use the 15th as it exists in all months)
    const dayToClick = screen.getAllByText('15')[0]
    fireEvent.click(dayToClick)

    // Check if modal opens
    expect(await screen.findByText(/Event for/)).toBeInTheDocument()

    // Close the modal
    const closeButton = screen.getByLabelText('Close Modal')
    fireEvent.click(closeButton)

    // Check if modal closes
    await waitFor(() => {
        expect(screen.queryByText(/Event for/)).not.toBeInTheDocument()
    })
  })
})
