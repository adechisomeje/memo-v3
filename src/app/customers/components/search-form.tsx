'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon, ChevronDown, MapPin } from 'lucide-react'
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
              ? 'md:grid-cols-12 border border-primary rounded-full p-2'
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
                variant === 'sheet' ? 'border' : 'bg-gray-50'
              )}
            >
              <MapPin className='h-5 w-5 text-gray-500' />
              <input
                type='text'
                placeholder='Input delivery address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='flex-1 bg-transparent outline-none placeholder:text-gray-500'
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
                  variant === 'default' ? 'text-black ' : 'w-full'
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
                  variant === 'default' ? 'text-black border' : 'w-full'
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
                  variant === 'default' ? 'text-black border' : 'w-full'
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
                    variant === 'default' ? 'bg-gray-50 border-0' : '',
                    !date && 'text-gray-500'
                  )}
                >
                  <div className='flex items-center gap-2'>
                    <CalendarIcon className='h-5 w-5' />
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
