import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
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

  it('navigates to next month', () => {
    render(<Calendar />)
    const nextButton = screen.getByLabelText('Next month')
    fireEvent.click(nextButton)

    const currentDate = new Date()
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    const nextMonthYear = nextMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    expect(screen.getByText(nextMonthYear)).toBeInTheDocument()
  })

  it('navigates to previous month', () => {
    render(<Calendar />)
    const prevButton = screen.getByLabelText('Previous month')
    fireEvent.click(prevButton)

    const currentDate = new Date()
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const prevMonthYear = prevMonthDate.toLocaleString('en-US', {
      month: 'long',
      year: 'numeric',
    })

    expect(screen.getByText(prevMonthYear)).toBeInTheDocument()
  })

  it('opens modal when clicking a date', () => {
    render(<Calendar />)
    const currentDate = new Date()
    // Find today's date element using aria-label
    const dateElement = screen.getByLabelText(currentDate.toDateString())

    fireEvent.click(dateElement)

    expect(screen.getByText(`Event for ${currentDate.toLocaleDateString()}`)).toBeInTheDocument()
  })

  it('closes modal when clicking close button', async () => {
    render(<Calendar />)
    const currentDate = new Date()
    const dateElement = screen.getByLabelText(currentDate.toDateString())
    fireEvent.click(dateElement)

    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    await waitForElementToBeRemoved(() => screen.queryByText(`Event for ${currentDate.toLocaleDateString()}`))
  })
})
