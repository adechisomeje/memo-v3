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

interface VendorFormProps {
  onSubmit: (data: FormData) => void
  className?: string
  variant?: 'default' | 'sheet'
}

export function SearchForm({
  onSubmit,
  className,
  variant = 'default',
}: VendorFormProps) {
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
    <form onSubmit={handleSubmit} className={className}>
      {variant === 'sheet' && (
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-bold'>
            Let&apos;s Find Vendors Near You
          </h2>
        </div>
      )}

      <div
        className={cn(
          'space-y-4  mt-10',
          variant === 'default' &&
            'bg-white rounded-full p-3 md:flex md:flex-row gap-3 max-w-4xl mx-auto'
        )}
      >
        <div
          className={cn(
            'flex-1 flex items-center gap-2 text-left px-4 text-[#1E1B16]',
            variant === 'sheet' && 'border rounded-md'
          )}
        >
          <MapPin className='h-4 w-4' />
          <input
            type='text'
            placeholder='Input delivery address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='py-2'
          />
        </div>

        <Select>
          <SelectTrigger
            className={cn(
              'md:w-40',
              variant === 'default'
                ? 'text-[#1E1B16] py-4 border-none'
                : 'w-full p-5'
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
              'md:w-40',
              variant === 'default'
                ? 'text-[#1E1B16] py-4 border-none'
                : 'w-full p-5'
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
              'md:w-40',
              variant === 'default'
                ? 'text-[#1E1B16] py-4 border-none'
                : 'w-full p-5'
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                'md:w-48 justify-between text-left font-normal',
                variant === 'default' ? 'hover:bg-gray-100' : 'w-full p-5',
                !date && 'text-muted-foreground'
              )}
            >
              <div className='flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4' />
                {date ? format(date, 'PPP') : <span>Delivery date</span>}
              </div>
              <ChevronDown className='h-4 w-4' />
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

      {variant === 'sheet' && (
        <Button className=' mt-16 bg-primary hover:bg-red-700 text-white'>
          Get Started
        </Button>
      )}
    </form>
  )
}
