import { render, screen, fireEvent } from '@testing-library/react'
import Calendar from './Calendar'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, exit, variants, transition, custom, ...validProps } = props
      return <div {...validProps}>{children}</div>
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Calendar Component', () => {
  beforeEach(() => {
    // Set a fixed date: January 15, 2023 (Sunday)
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2023, 0, 15))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the current month and year', () => {
    render(<Calendar />)
    const monthYear = 'January 2023'
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
    const prevButton = screen.getByLabelText('Previous month')
    fireEvent.click(prevButton)
    expect(screen.getByText('December 2022')).toBeInTheDocument()
  })

  it('navigates to the next month', () => {
    render(<Calendar />)
    const nextButton = screen.getByLabelText('Next month')
    fireEvent.click(nextButton)
    expect(screen.getByText('February 2023')).toBeInTheDocument()
  })

  it('opens modal on date click', () => {
    render(<Calendar />)
    // Click on the 15th (current date)
    const dayElement = screen.getByText('15')
    fireEvent.click(dayElement)

    expect(screen.getByText('Event for 1/15/2023')).toBeInTheDocument()
    expect(screen.getByText('Team Meeting')).toBeInTheDocument()
  })

  it('closes modal on close button click', async () => {
    render(<Calendar />)
    // Open modal first
    const dayElement = screen.getByText('15')
    fireEvent.click(dayElement)
    expect(screen.getByText('Event for 1/15/2023')).toBeInTheDocument()

    // Close modal
    const closeButton = screen.getByLabelText('Close modal')
    fireEvent.click(closeButton)

    expect(screen.queryByText('Event for 1/15/2023')).not.toBeInTheDocument()
  })
})
