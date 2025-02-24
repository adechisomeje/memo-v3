'use client'

import { format } from 'date-fns'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { cn } from '@/lib/utils'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Calender } from '../../../../public/assets/icons/Calender'
import { MapPin } from '../../../../public/assets/icons/MapPin'
import { useState, useEffect } from 'react' // Import useEffect
import { useQuery, useQueryClient } from '@tanstack/react-query' // Import useQueryClient
import {
  getCities,
  getCountry,
  getLocations,
  getStates,
  LocationResponse,
} from '@/api/public'
import { useDeliveryDetails } from '@/store/deliveryDetails'

const searchFormSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  date: z.date(),
})

type SearchFormValues = z.infer<typeof searchFormSchema>

interface SearchFormProps {
  onSubmit: (data: Omit<SearchFormValues, 'date'> & { date: string }) => void
  className?: string
  variant?: 'default' | 'sheet'
}

// Helper functions to extract location data
const extractCountries = (data: LocationResponse['data']) => {
  return Object.keys(data)
}

const extractStates = (data: LocationResponse['data'], country: string) => {
  return Object.keys(data[country]?.states || {})
}

const extractCities = (
  data: LocationResponse['data'],
  country: string,
  state: string
) => {
  return data[country]?.states[state]?.cities || []
}

const LoadingSelectItem = () => (
  <SelectItem value='loading' disabled>
    Loading...
  </SelectItem>
)

export function SearchForm({
  onSubmit,
  className,
  variant = 'default',
}: SearchFormProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const setDeliveryDetails = useDeliveryDetails(
    (state) => state.setDeliveryDetails
  )

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      address: '',
      country: '',
      state: '',
      city: '',
      date: undefined,
    },
  })

  // Single query for all location data
  const locationsQuery = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  })

  console.log(locationsQuery)

  const locationData = locationsQuery.data?.data || {}
  const countries = extractCountries(locationData)
  const states = selectedCountry
    ? extractStates(locationData, selectedCountry)
    : []
  const cities =
    selectedCountry && selectedState
      ? extractCities(locationData, selectedCountry, selectedState)
      : []

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value)
    form.setValue('country', value)
    form.setValue('state', '')
    form.setValue('city', '')
    setSelectedState('')
  }

  const handleStateChange = (value: string) => {
    setSelectedState(value)
    form.setValue('state', value)
    form.setValue('city', '')
  }

  function handleSubmit(values: SearchFormValues) {
    const formattedData = {
      ...values,
      date: values.date ? format(values.date, 'yyyy-MM-dd') : '',
    }
    setDeliveryDetails(formattedData)
    onSubmit(formattedData)
  }

  const renderLocationSelects = () => (
    <>
      {/* Country Select */}
      <FormField
        control={form.control}
        name='country'
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleCountryChange}
              value={field.value || 'default'}
            >
              <FormControl>
                <SelectTrigger className='h-10 text-black border-x-1 rounded-none border-y-0'>
                  <SelectValue placeholder='Country' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='default' disabled>
                  Select a country
                </SelectItem>
                {locationsQuery.isLoading ? (
                  <LoadingSelectItem />
                ) : (
                  countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State Select */}
      <FormField
        control={form.control}
        name='state'
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={handleStateChange}
              value={field.value || 'default'}
              disabled={!selectedCountry}
            >
              <FormControl>
                <SelectTrigger className='h-10 text-black border-x-1 rounded-none border-y-0'>
                  <SelectValue placeholder='State' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='default' disabled>
                  Select a state
                </SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City Select */}
      <FormField
        control={form.control}
        name='city'
        render={({ field }) => (
          <FormItem>
            <Select
              onValueChange={field.onChange}
              value={field.value || 'default'}
              disabled={!selectedState}
            >
              <FormControl>
                <SelectTrigger className='h-10 text-black border-x-1 rounded-none border-y-0'>
                  <SelectValue placeholder='City' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='default' disabled>
                  Select a city
                </SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )

  if (variant === 'sheet') {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn('flex flex-col h-full', className)}
        >
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Let&apos;s Find Vendors Near You
            </h2>
          </div>

          <div className='space-y-10 flex-1'>
            {/* Address Input */}
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center gap-3 px-4 py-3 border rounded-lg'>
                    <MapPin className='h-5 w-5 text-gray-400 flex-shrink-0' />
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Input delivery address'
                        {...field}
                        className='border-none shadow-none px-0 placeholder:text-gray-400'
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Selects */}
            <div className='mt-5 flex flex-col gap-10'>
              {renderLocationSelects()}
            </div>

            {/* Date Picker */}
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className='w-full h-14 justify-start border-gray-200 rounded-lg'
                        >
                          <div className='flex items-center gap-2'>
                            <Calender className='h-5 w-5 text-gray-400' />
                            <span className='text-gray-400'>
                              {field.value
                                ? format(field.value, 'PPP')
                                : 'Delivery date'}
                            </span>
                          </div>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type='submit'
            className='w-full mt-8 bg-red-600 hover:bg-red-700 text-white h-12'
          >
            Get Started
          </Button>
        </form>
      </Form>
    )
  }

  return (
    <div className='w-full px-5 md:px-7 lg:px-9'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={cn('max-w-6xl mx-auto relative', className)}
        >
          <div className='bg-white rounded-full shadow-lg p-2 md:p-3'>
            <div className='border-2 border-primary rounded-full grid md:grid-cols-12 gap-2 md:gap-4 items-center'>
              {/* Address Input */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='md:col-span-3'>
                    <div className='flex items-center gap-3 px-4 py-2 bg-white rounded-full'>
                      <MapPin className='h-5 w-5 text-[#1E1B16] flex-shrink-0' />
                      <FormControl>
                        <Input
                          type='text'
                          placeholder='Input delivery address'
                          {...field}
                          className='border-0 text-black px-0 placeholder:text-[#1E1B16]'
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Selects */}
              <div className='md:col-span-7 grid grid-cols-3 gap-2'>
                {renderLocationSelects()}
              </div>

              {/* Date Picker */}
              <FormField
                control={form.control}
                name='date'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button className='w-full h-10 border-none shadow-none bg-transparent'>
                            <div className='flex items-center gap-2'>
                              <Calender className='h-5 w-5 text-gray-400' />
                              <span className='text-gray-500'>
                                {field.value
                                  ? format(field.value, 'PPP')
                                  : 'Delivery date'}
                              </span>
                            </div>
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Get Started Button */}
          <div className='flex justify-center mt-8'>
            <Button size='lg' type='submit'>
              Get Started
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
