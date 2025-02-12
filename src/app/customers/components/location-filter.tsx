'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { CalendarIcon, ChevronDown, MapPinIcon } from 'lucide-react'
import * as z from 'zod'
import * as React from 'react'

import { getCities, getCountry, getStates } from '@/api/public'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Calender } from '@/components/icons/Calender' // Your custom icon
import { MapPin } from '@/components/icons/MapPin' // Your custom icon
import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/use-mobile'

// --- Zod Schema ---
const locationFilterSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  date: z.date().optional(),
})

type LocationFilterValues = z.infer<typeof locationFilterSchema>

export function LocationFilter() {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const form = useForm<LocationFilterValues>({
    resolver: zodResolver(locationFilterSchema),
    defaultValues: {
      address: '',
      country: '',
      state: '',
      city: '',
      date: undefined,
    },
  })

  // --- Data Fetching ---
  const countriesQuery = useQuery({
    queryKey: ['countries'],
    queryFn: getCountry,
  })

  console.log(countriesQuery.data)
  const selectedCountry = form.watch('country')
  const selectedState = form.watch('state')

  const statesQuery = useQuery({
    queryKey: ['states', selectedCountry],
    queryFn: () => getStates(selectedCountry),
    enabled: !!selectedCountry,
  })
  const citiesQuery = useQuery({
    queryKey: ['cities', selectedCountry, selectedState],
    queryFn: () => getCities(selectedCountry, selectedState),
    enabled: !!selectedCountry && !!selectedState,
  })

  // --- Loading and Error States ---
  const isLoading = countriesQuery.isPending
  const isError =
    countriesQuery.isError || statesQuery.isError || citiesQuery.isError

  // --- Submit Handler ---
  const handleFormSubmit = (values: LocationFilterValues) => {
    setOpen(false)
  }

  // --- Main Return (Fully Inlined) ---
  if (isMobile) {
    // Mobile View
    if (isLoading) {
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='outline'>Open Location Filter</Button>
          </SheetTrigger>
          <SheetContent>
            <div className='mb-8'>
              <Skeleton className='h-8 w-64' />
            </div>
            <div className='grid gap-6 grid-cols-1'>
              <div className='flex items-center gap-3 rounded-lg border px-4 py-3'>
                <Skeleton className='h-5 w-5' />
                <Skeleton className='h-8 flex-grow' />
              </div>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full mt-8' />
            </div>
          </SheetContent>
        </Sheet>
      )
    } else if (isError) {
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='outline'>Open Location Filter</Button>
          </SheetTrigger>
          <SheetContent>
            <div className='text-red-500 p-4 bg-red-100 border border-red-400 rounded-md'>
              An error occurred while fetching data. Please try again later.
              {countriesQuery.isError && <p>Error fetching countries.</p>}
              {statesQuery.isError && <p>Error fetching states.</p>}
              {citiesQuery.isError && <p>Error fetching cities.</p>}
            </div>
          </SheetContent>
        </Sheet>
      )
    } else {
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant='outline'>Open Location Filter</Button>
          </SheetTrigger>
          <SheetContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className='space-y-4'
              >
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Find Vendors Near You
                  </h2>
                </div>
                <div className='relative'>
                  <div className='grid gap-6 grid-cols-1'>
                    {/* Address Input */}
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='relative flex items-center'>
                              <div className='flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border'>
                                <MapPin />
                                <Input
                                  type='text'
                                  placeholder='Input delivery address'
                                  {...field}
                                  className='flex-1 outline-none placeholder:text-black text-black'
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location Selects */}
                    <div className='grid gap-4 grid-cols-1'>
                      <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={countriesQuery.isLoading}
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select Country' />
                                </SelectTrigger>
                                <SelectContent>
                                  {countriesQuery.data?.data.countries.map(
                                    (country: string) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='state'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={
                                  !selectedCountry ||
                                  statesQuery.isError ||
                                  statesQuery.isLoading
                                }
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select State' />
                                </SelectTrigger>
                                <SelectContent>
                                  {statesQuery.data?.data.states.map(
                                    (state: string) => (
                                      <SelectItem key={state} value={state}>
                                        {state}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={
                                  !selectedState ||
                                  citiesQuery.isError ||
                                  citiesQuery.isLoading
                                }
                              >
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder='Select City' />
                                </SelectTrigger>
                                <SelectContent>
                                  {citiesQuery.data?.data.cities.map(
                                    (city: string) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Date Picker */}
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant='outline'
                                  className={cn(
                                    'w-full h-12 justify-between text-left font-normal',
                                    !field.value && 'text-gray-500'
                                  )}
                                >
                                  <div className='flex items-center gap-2'>
                                    <Calender />
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Delivery date</span>
                                    )}
                                  </div>
                                  <ChevronDown className='h-4 w-4 opacity-50' />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className='w-auto p-0'
                                align='start'
                              >
                                <Calendar
                                  mode='single'
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date)
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type='submit'
                    className='w-full mt-8 bg-primary hover:bg-primary/90 text-white h-12'
                  >
                    Get Started
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      )
    }
  } else {
    // Desktop View
    if (isLoading) {
      return (
        <div className='w-full max-w-6xl mx-auto'>
          <div className='relative bg-white rounded-full shadow-lg p-3'>
            <div className='grid gap-6 md:grid-cols-12 border-2 border-primary rounded-full p-2'>
              <div className='md:col-span-3'>
                <div className='flex items-center gap-3 rounded-lg border px-4 py-3'>
                  <Skeleton className='h-5 w-5' />
                  <Skeleton className='h-8 flex-grow' />
                </div>
              </div>
              <div className='md:col-span-6 grid-cols-3 grid gap-4'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
              </div>
              <div className='md:col-span-1'>
                <Skeleton className='h-12 w-full' />
              </div>
            </div>
          </div>
        </div>
      )
    } else if (isError) {
      return (
        <div className='w-full max-w-6xl mx-auto'>
          <div className='text-red-500 p-4 bg-red-100 border border-red-400 rounded-md'>
            An error occurred while fetching data. Please try again later.
            {countriesQuery.isError && <p>Error fetching countries.</p>}
            {statesQuery.isError && <p>Error fetching states.</p>}
            {citiesQuery.isError && <p>Error fetching cities.</p>}
          </div>
        </div>
      )
    } else {
      return (
        <div className='w-full max-w-6xl mx-auto'>
          <div className='relative bg-white rounded-full shadow-lg p-3'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className='space-y-4'
              >
                <div className='grid gap-6 md:grid-cols-12 border-2 border-primary rounded-full p-2'>
                  {/* Address Input */}
                  <FormField
                    control={form.control}
                    name='address'
                    render={({ field }) => (
                      <FormItem className='md:col-span-3'>
                        <FormControl>
                          <div className='relative flex items-center'>
                            <div className='flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-white'>
                              <MapPin />
                              <Input
                                type='text'
                                placeholder='Input delivery address'
                                {...field}
                                className='flex-1 outline-none placeholder:text-black text-black'
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location Selects */}
                  <div className='md:col-span-6 grid-cols-3 grid gap-4'>
                    <FormField
                      control={form.control}
                      name='country'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={countriesQuery.isLoading}
                            >
                              <SelectTrigger className='h-12 text-black border-x-1 rounded-none border-y-0'>
                                <SelectValue placeholder='Select Country' />
                              </SelectTrigger>
                              <SelectContent>
                                {countriesQuery.data?.data.countries.map(
                                  (country: string) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='state'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={
                                !selectedCountry ||
                                statesQuery.isError ||
                                statesQuery.isLoading
                              }
                            >
                              <SelectTrigger className='h-12 text-black border-x-1 rounded-none border-y-0'>
                                <SelectValue placeholder='Select State' />
                              </SelectTrigger>
                              <SelectContent>
                                {statesQuery.data?.data.states.map(
                                  (state: string) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='city'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={
                                !selectedState ||
                                citiesQuery.isError ||
                                citiesQuery.isLoading
                              }
                            >
                              <SelectTrigger className='h-12 text-black border-x-1 rounded-none border-y-0'>
                                <SelectValue placeholder='Select City' />
                              </SelectTrigger>
                              <SelectContent>
                                {citiesQuery.data?.data.cities.map(
                                  (city: string) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date Picker */}
                  <FormField
                    control={form.control}
                    name='date'
                    render={({ field }) => (
                      <FormItem className='md:col-span-1'>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full h-12 justify-between text-left font-normal border-0',
                                  !field.value && 'text-gray-500'
                                )}
                              >
                                <div className='flex items-center gap-2'>
                                  <Calender />
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Delivery date</span>
                                  )}
                                </div>
                                <ChevronDown className='h-4 w-4 opacity-50' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={(date) => {
                                  field.onChange(date)
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type='submit' className='hidden md:inline-flex'>
                  Get Started
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )
    }
  }
}
