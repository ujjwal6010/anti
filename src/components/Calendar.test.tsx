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
    const currentDate = new Date()
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const prevMonthYear = prevMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const prevButton = screen.getByLabelText('Previous month')
    fireEvent.click(prevButton)

    expect(screen.getByText(prevMonthYear)).toBeInTheDocument()
  })

  it('navigates to the next month', () => {
    render(<Calendar />)
    const currentDate = new Date()
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const nextMonthYear = nextMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    const nextButton = screen.getByLabelText('Next month')
    fireEvent.click(nextButton)

    expect(screen.getByText(nextMonthYear)).toBeInTheDocument()
  })

  it('opens modal when a date is clicked', () => {
    render(<Calendar />)
    // Click on the 15th day. Assuming current month has a 15th (all months do).
    // Note: getByText('15') might return multiple elements if we navigated? No, fresh render.
    const dayElement = screen.getByText('15')
    fireEvent.click(dayElement)

    expect(screen.getByText(/Event for/i)).toBeInTheDocument()
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    render(<Calendar />)
    const dayElement = screen.getByText('15')
    fireEvent.click(dayElement)

    expect(screen.getByText('Team Meeting')).toBeInTheDocument()

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Team Meeting')).not.toBeInTheDocument()
    })
  })
})
