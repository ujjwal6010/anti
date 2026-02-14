import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  X,
  Plus,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>(
    'forward',
  )
  const [isModalOpen, setIsModalOpen] = useState(false)

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const handlePrevMonth = () => {
    setAnimationDirection('backward')
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    )
  }

  const handleNextMonth = () => {
    setAnimationDirection('forward')
    setCurrentDate(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    )
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  const daysInMonth = useMemo(() => {
    const days = []
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day))
    }

    return days
  }, [currentMonth, currentYear])

  const variants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-sm font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={animationDirection}>
          <motion.div
            key={currentMonth}
            custom={animationDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-7 gap-2"
          >
            {daysInMonth.map((day, index) => (
              <div
                key={index}
                className={`relative w-10 h-10 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all duration-300
                  ${
                    day
                      ? ''
                      : 'invisible'
                  }
                  ${
                    selectedDate && day && selectedDate.toDateString() === day.toDateString()
                      ? 'bg-blue-500 text-white shadow-lg scale-110'
                      : day && day.getMonth() === currentMonth
                        ? 'hover:bg-blue-100'
                        : 'text-gray-400'
                  }
                  ${day && day.toDateString() === new Date().toDateString() ? 'border-2 border-blue-500' : ''}
                `}
                onClick={() => day && handleDateClick(day)}
              >
                {day ? day.getDate() : ''}
                {day && day.toDateString() === new Date().toDateString() && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal for selected date */}
      <AnimatePresence>
        {isModalOpen && selectedDate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Event for {selectedDate.toLocaleDateString()}
              </h3>
              <div className="space-y-4">
                {/* Placeholder for events */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-700">Team Meeting</p>
                    <p className="text-sm text-gray-500">10:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <CalendarDays className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-700">Project Deadline</p>
                    <p className="text-sm text-gray-500">All Day</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => alert('Add new event functionality not implemented yet!')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Calendar
