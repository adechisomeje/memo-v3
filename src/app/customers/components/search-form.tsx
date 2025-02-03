'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SearchFormProps {
  onSubmit: (data: FormData) => void
  className?: string
  variant?: 'default' | 'sheet'
}

export function SearchForm({
  onSubmit,
  className,
  variant = 'default',
}: SearchFormProps) {
  const [date, setDate] = React.useState<Date>()
  const [address, setAddress] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('address', address)
    formData.append('date', date ? format(date, 'yyyy-MM-dd') : '')
    onSubmit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('w-full max-w-6xl mx-auto ', className)}
    >
      {variant === 'sheet' && (
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Let&apos;s Find Vendors Near You
          </h2>
        </div>
      )}

      <div
        className={cn(
          'relative',
          variant === 'default' ? 'bg-white rounded-full shadow-lg p-3' : ''
        )}
      >
        <div
          className={cn(
            'grid gap-6',
            variant === 'default'
              ? 'md:grid-cols-12 border-2 border-primary rounded-full p-2'
              : 'grid-cols-1'
          )}
        >
          {/* Address Input */}
          <div
            className={cn(
              'relative flex items-center',
              variant === 'default' ? 'md:col-span-3' : ''
            )}
          >
            <div
              className={cn(
                'flex-1 flex items-center gap-3 px-4 py-3 rounded-lg  ',
                variant === 'sheet' ? 'border' : 'bg-white'
              )}
            >
              {/* <MapPin className='h-4 w-4 text-gray-500' /> */}
              <svg
                width='25'
                height='24'
                viewBox='0 0 25 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  clip-rule='evenodd'
                  d='M12.747 20.969C13.8971 19.9254 14.9615 18.7911 15.93 17.577C17.97 15.014 19.211 12.487 19.295 10.24C19.3282 9.32679 19.1771 8.41626 18.8505 7.56278C18.524 6.7093 18.0288 5.9304 17.3945 5.27259C16.7602 4.61478 15.9998 4.09157 15.1588 3.7342C14.3177 3.37684 13.4133 3.19265 12.4995 3.19265C11.5857 3.19265 10.6813 3.37684 9.84022 3.7342C8.99918 4.09157 8.23881 4.61478 7.60451 5.27259C6.9702 5.9304 6.475 6.7093 6.14846 7.56278C5.82192 8.41626 5.67076 9.32679 5.704 10.24C5.789 12.487 7.031 15.014 9.07 17.577C10.0385 18.7911 11.1029 19.9254 12.253 20.969C12.3637 21.069 12.446 21.1417 12.5 21.187L12.747 20.969ZM11.762 22.134C11.762 22.134 4.5 16.018 4.5 10C4.5 7.87827 5.34285 5.84344 6.84315 4.34315C8.34344 2.84285 10.3783 2 12.5 2C14.6217 2 16.6566 2.84285 18.1569 4.34315C19.6571 5.84344 20.5 7.87827 20.5 10C20.5 16.018 13.238 22.134 13.238 22.134C12.834 22.506 12.169 22.502 11.762 22.134ZM12.5 12.8C13.2426 12.8 13.9548 12.505 14.4799 11.9799C15.005 11.4548 15.3 10.7426 15.3 10C15.3 9.25739 15.005 8.5452 14.4799 8.0201C13.9548 7.495 13.2426 7.2 12.5 7.2C11.7574 7.2 11.0452 7.495 10.5201 8.0201C9.995 8.5452 9.7 9.25739 9.7 10C9.7 10.7426 9.995 11.4548 10.5201 11.9799C11.0452 12.505 11.7574 12.8 12.5 12.8ZM12.5 14C11.4391 14 10.4217 13.5786 9.67157 12.8284C8.92143 12.0783 8.5 11.0609 8.5 10C8.5 8.93913 8.92143 7.92172 9.67157 7.17157C10.4217 6.42143 11.4391 6 12.5 6C13.5609 6 14.5783 6.42143 15.3284 7.17157C16.0786 7.92172 16.5 8.93913 16.5 10C16.5 11.0609 16.0786 12.0783 15.3284 12.8284C14.5783 13.5786 13.5609 14 12.5 14Z'
                  fill='#777777'
                />
              </svg>

              <input
                type='text'
                placeholder='Input delivery address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='flex-1  outline-none placeholder:text-black text-black'
              />
            </div>
          </div>

          {/* Location Selects */}
          <div
            className={cn(
              'grid gap-4',
              variant === 'default'
                ? 'md:col-span-6 grid-cols-3'
                : 'grid-cols-1'
            )}
          >
            <Select>
              <SelectTrigger
                className={cn(
                  'h-12',
                  variant === 'default'
                    ? 'text-black border-x-1 rounded-none border-y-0'
                    : 'w-full'
                )}
              >
                <SelectValue placeholder='Country' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='us'>United States</SelectItem>
                <SelectItem value='uk'>United Kingdom</SelectItem>
                <SelectItem value='ca'>Canada</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                className={cn(
                  'h-12',
                  variant === 'default'
                    ? 'text-black border-x-1 rounded-none border-y-0'
                    : 'w-full'
                )}
              >
                <SelectValue placeholder='State' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ny'>New York</SelectItem>
                <SelectItem value='ca'>California</SelectItem>
                <SelectItem value='tx'>Texas</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger
                className={cn(
                  'h-12',
                  variant === 'default'
                    ? 'text-black border-x-1 rounded-none border-y-0'
                    : 'w-full'
                )}
              >
                <SelectValue placeholder='City' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='nyc'>New York City</SelectItem>
                <SelectItem value='la'>Los Angeles</SelectItem>
                <SelectItem value='ch'>Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className={cn(variant === 'default' ? 'md:col-span-1' : '')}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'w-full h-12 justify-between text-left font-normal',
                    variant === 'default' ? ' border-0 ' : '',
                    !date && 'text-gray-500'
                  )}
                >
                  <div className='flex items-center gap-2'>
                    {/* <CalendarIcon className='h-5 w-5' /> */}
                    <svg
                      width='25'
                      height='24'
                      viewBox='0 0 25 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M20 4H17V2.5C17 2.36739 16.9473 2.24021 16.8536 2.14645C16.7598 2.05268 16.6326 2 16.5 2C16.3674 2 16.2402 2.05268 16.1464 2.14645C16.0527 2.24021 16 2.36739 16 2.5V4H9V2.5C9 2.36739 8.94732 2.24021 8.85355 2.14645C8.75979 2.05268 8.63261 2 8.5 2C8.36739 2 8.24021 2.05268 8.14645 2.14645C8.05268 2.24021 8 2.36739 8 2.5V4H5C4.3372 4.00079 3.70178 4.26444 3.23311 4.73311C2.76444 5.20178 2.50079 5.8372 2.5 6.5V19.5C2.50079 20.1628 2.76444 20.7982 3.23311 21.2669C3.70178 21.7356 4.3372 21.9992 5 22H20C20.663 22 21.2989 21.7366 21.7678 21.2678C22.2366 20.7989 22.5 20.163 22.5 19.5V6.5C22.5 5.83696 22.2366 5.20107 21.7678 4.73223C21.2989 4.26339 20.663 4 20 4ZM21.5 19.5C21.5 19.8978 21.342 20.2794 21.0607 20.5607C20.7794 20.842 20.3978 21 20 21H5C4.60218 21 4.22064 20.842 3.93934 20.5607C3.65804 20.2794 3.5 19.8978 3.5 19.5V11H21.5V19.5ZM21.5 10H3.5V6.5C3.5 5.672 4.17 5 5 5H8V6.5C8 6.63261 8.05268 6.75979 8.14645 6.85355C8.24021 6.94732 8.36739 7 8.5 7C8.63261 7 8.75979 6.94732 8.85355 6.85355C8.94732 6.75979 9 6.63261 9 6.5V5H16V6.5C16 6.63261 16.0527 6.75979 16.1464 6.85355C16.2402 6.94732 16.3674 7 16.5 7C16.6326 7 16.7598 6.94732 16.8536 6.85355C16.9473 6.75979 17 6.63261 17 6.5V5H20C20.3978 5 20.7794 5.15804 21.0607 5.43934C21.342 5.72064 21.5 6.10218 21.5 6.5V10Z'
                        fill='#777777'
                      />
                    </svg>

                    {date ? format(date, 'PPP') : <span>Delivery date</span>}
                  </div>
                  <ChevronDown className='h-4 w-4 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {variant === 'sheet' && (
          <Button className='w-full mt-8 bg-primary hover:bg-primary/90 text-white h-12'>
            Get Started
          </Button>
        )}
      </div>
    </form>
  )
}
