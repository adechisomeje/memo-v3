'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, validateName } from '@/lib/utils'
import { ReviewButton } from '../../components/review-button'
import { ProductCard } from '../../components/product-card'
import { StarFill } from '../../../../../public/assets/icons/StarRating'
import { useMutation } from '@tanstack/react-query'
import { CreateOrderResponse, userCreateOrder } from '@/api/orders'
import { toast } from 'sonner'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Calendar } from '@/components/ui/calendar'
import { useCakeCustomization } from '@/store/cakeCustomization'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeData, getCakeProductsByVendor } from '@/api/public'
import { useVendorStore } from '@/store/vendorStore'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queries'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { locationData } from '@/data/countryData'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'

interface CartItem {
  id: string
  image: string
  title: string
  description: string
  price: number
  quantity: number
}

type City = string

interface StateData {
  capital: string
  cities: City[]
}

interface CountryData {
  states: {
    [stateName: string]: StateData
  }
}

interface StateData {
  capital: string
  cities: string[]
}

interface CountryData {
  states: {
    [key: string]: StateData
  }
}

interface CountryCode {
  code: string
  dial_code: string
  name: string
}

const countryCodes: CountryCode[] = [
  { code: 'NG', dial_code: '+234', name: 'Nigeria' },
  { code: 'GH', dial_code: '+233', name: 'Ghana' },
  { code: 'KE', dial_code: '+254', name: 'Kenya' },
]

const formSchema = z.object({
  date: z.date({
    required_error: 'Delivery date is required',
  }),
  note: z.string().optional(),
  recipientName: z
    .string()
    .min(2, {
      message: 'First Name must be at least 2 characters',
    })
    .refine(validateName, {
      message: 'First Name must contain only alphabets',
    }),
  address: z.string().min(2, {
    message: 'Address is required',
  }),
  state: z.string().min(2, {
    message: 'State is required',
  }),
  country: z.string().min(2, {
    message: 'Country is required',
  }),
  city: z.string().min(2, {
    message: 'City is required',
  }),
  countryCode: z.string().min(2, {
    message: 'Please select a country code',
  }),
  recipientPhone: z
    .string()
    .min(12, {
      message: 'Please enter a valid phone number',
    })
    .refine(
      (val) => {
        return countryCodes.some((code) => val.startsWith(code.dial_code))
      },
      {
        message: 'Invalid phone number format',
      }
    )
    .refine(
      (val) => {
        const number = val.replace(/^\+\d{2,3}/, '')
        return /^\d{9,10}$/.test(number)
      },
      {
        message: 'Phone number must be 9-10 digits after country code',
      }
    ),
})

const AddressSelectFields = () => {
  const form = useFormContext()
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableStates, setAvailableStates] = useState<string[]>([])
  const [availableCities, setAvailableCities] = useState<string[]>([])

  const currentCountry: object | unknown = form.watch('country')
  const currentState = form.watch('state')
  const currentCity = form.watch('city')

  // Initialize available countries once on component mount
  useEffect(() => {
    const countries = Object.keys(locationData.countries)
    setAvailableCountries(countries)
  }, [])

  useEffect(() => {
    if (!currentCountry) return
    try {
      const countryData = locationData.countries[
        currentCountry as keyof typeof locationData.countries
      ] as CountryData
      const states = Object.keys(countryData.states)
      setAvailableStates(states)

      if (currentState && !states.includes(currentState)) {
        form.setValue('state', '', { shouldValidate: true })
        form.setValue('city', '', { shouldValidate: true })
      }
    } catch (error) {
      console.error('Error updating states:', error)
    }
  }, [currentCountry])

  useEffect(() => {
    if (!currentCountry || !currentState) return
    try {
      const countryData = locationData.countries[
        currentCountry as keyof typeof locationData.countries
      ] as CountryData
      const stateData = countryData.states[currentState] as StateData
      const cities = stateData.cities
      setAvailableCities(cities)

      // Only reset city if current city is not valid
      if (currentCity && !cities.includes(currentCity)) {
        form.setValue('city', '', { shouldValidate: true })
      }
    } catch (error) {
      console.error('Error updating cities:', error)
    }
  }, [currentCountry, currentState]) // Remove form and currentCity from dependencies

  const handleCountryChange = useCallback(
    (value: string) => {
      form.setValue('country', value, { shouldValidate: true })
    },
    [form]
  )

  const handleStateChange = useCallback(
    (value: string) => {
      form.setValue('state', value, { shouldValidate: true })
    },
    [form]
  )

  const handleCityChange = useCallback(
    (value: string) => {
      form.setValue('city', value, { shouldValidate: true })
    },
    [form]
  )

  return (
    <>
      <FormField
        control={form.control}
        name='country'
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select onValueChange={handleCountryChange} value={field.value}>
                <SelectTrigger className='w-full p-6'>
                  <SelectValue placeholder='Select Country' />
                </SelectTrigger>
                <SelectContent>
                  {availableCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
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
                onValueChange={handleStateChange}
                value={field.value}
                disabled={!currentCountry}
              >
                <SelectTrigger className='w-full p-6'>
                  <SelectValue placeholder='Select State' />
                </SelectTrigger>
                <SelectContent>
                  {availableStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
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
                onValueChange={handleCityChange}
                value={field.value}
                disabled={!currentState}
              >
                <SelectTrigger className='w-full p-6'>
                  <SelectValue placeholder='Select City' />
                </SelectTrigger>
                <SelectContent>
                  {availableCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}

const PhoneNumberInput = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+234')

  const formatPhoneNumber = (value: string, countryCode: string) => {
    let cleaned = value.replace(/[^\d]/g, '')

    if (countryCode === '+234' && cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1)
    }

    return cleaned
  }

  return (
    <div className='flex gap-2'>
      <FormField
        control={form.control}
        name='countryCode'
        render={({ field }) => (
          <FormItem className='w-[120px]'>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  setSelectedCountryCode(value)
                  field.onChange(value)

                  // Update the full phone number when country code changes
                  const currentPhone = form.getValues('recipientPhone')
                  const formattedPhone = formatPhoneNumber(currentPhone, value)
                  form.setValue('recipientPhone', `${value}${formattedPhone}`)
                }}
                defaultValue='+234'
              >
                <SelectTrigger className='w-full p-6'>
                  <SelectValue placeholder='Code' />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.dial_code}>
                      <span className='flex items-center gap-2'>
                        {country.dial_code}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name='recipientPhone'
        render={({ field }) => (
          <FormItem className='flex-1'>
            <FormControl>
              <div className='relative'>
                <Input
                  type='tel'
                  className={cn('w-full p-6', 'pl-4')}
                  placeholder='Phone Number'
                  value={field.value.replace(selectedCountryCode, '')} // Show only the number part
                  onChange={(e) => {
                    const rawValue = e.target.value
                    const formattedPhone = formatPhoneNumber(
                      rawValue,
                      selectedCountryCode
                    )
                    // Store the full number with country code
                    field.onChange(`${selectedCountryCode}${formattedPhone}`)
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

const CheckOutPage = () => {
  const [otherItems, setOtherItems] = useState<CartItem[]>([])
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const router = useRouter()
  const selectedCake = useCakeCustomization((state) => state.selectedCake)
  const cakeCustomization = useCakeCustomization((state) => state.customization)
  const vendorId = useVendorStore((state) => state.selectedVendorId)

  // Set up payment success listener using window events
  useEffect(() => {
    // Function to handle payment success message from the payment iframe
    const handlePaymentMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'string') {
        if (
          event.data.includes('success') ||
          event.data.includes('status=successful') ||
          event.data.includes('payment_successful')
        ) {
          handlePaymentSuccess()
        }
      }
    }

    window.addEventListener('message', handlePaymentMessage)

    return () => {
      window.removeEventListener('message', handlePaymentMessage)
    }
  }, [])

  const handlePaymentSuccess = () => {
    handleClosePayment()
    router.replace('/customers/success')
  }

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setOtherItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (index: number) => {
    setOtherItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  // Calculate total price based on selected layers
  const calculateTotalPrice = () => {
    if (!selectedCake || !cakeCustomization) return 0

    const layersNumber = parseInt(cakeCustomization.layers.toString())
    const layerPrice = selectedCake.layerPrices[layersNumber]

    return layerPrice || selectedCake.price
  }

  const totalPrice = calculateTotalPrice()
  const totalWithOtherItems =
    totalPrice + otherItems.reduce((sum, item) => sum + item.price, 0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: '',
      address: '',
      country: '',
      state: '',
      city: '',
      recipientName: '',
      countryCode: '+234',
      recipientPhone: '+234',
      date: undefined,
    },
  })

  const handleClosePayment = () => {
    setPaymentUrl(null)
    setIsPaymentOpen(false)
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.target as HTMLIFrameElement
      const iframeUrl = iframe.contentWindow?.location.href

      if (iframeUrl) {
        if (
          iframeUrl.includes('success') ||
          iframeUrl.includes('status=successful')
        ) {
          handlePaymentSuccess()
        }
      }
    } catch (error) {
      // Cross-origin error is expected for security reasons
      console.log('Cannot access iframe URL due to same-origin policy', error)
    }
  }

  const mutation = useMutation({
    mutationFn: userCreateOrder,
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.setItem('redirectAfterSignIn', window.location.pathname)
          toast.info('You have to be signed in first')
          router.push('/sign-in')
          return
        }
        toast.error(
          error.response?.data?.message ||
            'Something went wrong with the request.'
        )
      } else {
        toast.error(error.message ?? 'Something went wrong')
      }
    },
    onSuccess: (data: CreateOrderResponse) => {
      setPaymentUrl(data.data.authorization_url)
      setIsPaymentOpen(true)
      // toast.success(data.data.message)
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedCake || !cakeCustomization) {
      toast.error(
        'Missing required data. Please go back and select a cake and delivery details.'
      )
      return
    }

    const layersNumber = parseInt(cakeCustomization.layers.toString())

    const additionalProducts = otherItems.map((item) => ({
      productId: item.id,
      productCategory: 'cake',
      quantity: item.quantity,
    }))

    mutation.mutate({
      productId: selectedCake._id,
      productCategory: 'cake',
      note: data.note || '',
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      layers: layersNumber,
      size: selectedCake.size,
      topping: selectedCake.topping,
      flavours: cakeCustomization.flavour,
      deliveryAddress: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      deliveryDate: data.date.toISOString(),
      additionalProducts,
    })
  }

  const { data: vendorProducts } = useQuery({
    queryKey: [queryKeys.vendorProducts, vendorId],
    queryFn: () => {
      return vendorId ? getCakeProductsByVendor(vendorId) : null
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (!selectedCake) {
    router.push('/customers/results')
    return (
      <div className='p-8 text-center'>
        <h2 className='text-xl font-semibold mb-4'>Missing Information</h2>
        <p>
          Please select a cake and delivery details before proceeding to
          checkout.
        </p>
        <Button
          onClick={() => router.push('/customers/results')}
          className='mt-8'
        >
          Return to Cake Selection
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-10'>
        <main className='max-w-7xl mx-auto py-8'>
          <div className='grid lg:grid-cols-2 gap-8 mb-12'>
            {/* Left column with cake image */}
            <div>
              <div className='relative rounded-2xl overflow-hidden h-72 sm:h-96 max-w-lg mx-auto'>
                <Image
                  src={selectedCake.thumbnail}
                  alt={selectedCake.vendorName}
                  fill
                  className='object-cover'
                />
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4'>
                {otherItems.map((item, index) => (
                  <div
                    key={index}
                    className='relative rounded-lg overflow-hidden aspect-square'
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className='object-cover'
                    />
                    <X
                      onClick={() => removeFromCart(index)}
                      className='absolute top-1 right-1 bg-primary text-white cursor-pointer rounded-full p-1 text-xs'
                    />
                  </div>
                ))}
              </div>
              <div className='mt-5'>
                <h2 className='font-bold'>Cake Specs:</h2>
                <p className='text-sm'>
                  Classic cake with {selectedCake.topping} frosting
                </p>
                {cakeCustomization && (
                  <div className='mt-1 text-sm'>
                    <p className='font-semibold'>
                      {selectedCake.size} {cakeCustomization.flavour}
                    </p>
                    <p>
                      {parseInt(cakeCustomization.layers.toString())} layered
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='border-t pt-4'>
                  <div className='flex justify-between mb-2'>
                    <span className='font-semibold'>Delivery fee:</span>
                    <span>{formatPrice(120)}</span>
                  </div>
                  <div className='flex justify-between font-semibold'>
                    <span>TOTAL:</span>
                    <span>{formatPrice(totalWithOtherItems + 120)}</span>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-4'
                  >
                    <FormField
                      control={form.control}
                      name='date'
                      render={({ field }) => (
                        <FormItem className='md:col-span-2'>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a delivery date</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
                              <Calendar
                                mode='single'
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  return date < today
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='address'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Address'
                              className='w-full p-6'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className='grid grid-cols-3 gap-4'>
                      <AddressSelectFields />
                    </div>
                    <FormField
                      control={form.control}
                      name='note'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder='Note...'
                              className='w-full'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='recipientName'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder='Recipient Name'
                                className='w-full'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <PhoneNumberInput form={form} />
                    </div>

                    <Button
                      disabled={mutation.isPending}
                      type='submit'
                      className='w-full mt-10'
                      size='lg'
                    >
                      {mutation.isPending ? (
                        <div className='flex items-center justify-center'>
                          <span className='animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full'></span>
                        </div>
                      ) : (
                        <>
                          PROCEED TO PAY (
                          {formatPrice(totalWithOtherItems + 120)})
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
              <div className='space-y-4 bg-[#FFFBFA] p-5 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage className='p-4'>
                      {selectedCake?.vendorPicture ||
                        '/assets/images/naomi.png'}
                    </AvatarImage>
                    <AvatarFallback>
                      {selectedCake?.vendorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium'>{selectedCake.vendorName}</div>
                    <div className='flex items-center gap-1'>
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <StarFill
                            key={i}
                            className={` ${
                              i < 4
                                ? 'fill-primary'
                                : 'fill-muted stroke-muted-foreground'
                            }`}
                          />
                        ))}
                      <span className='text-sm text-gray-500'>(1k+)</span>
                    </div>
                  </div>
                </div>

                <ReviewButton
                  // use selected vendor id here
                  vendorId={vendorId}
                  reviewCount={5}
                />
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Other Items from Vendor</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
              {vendorProducts
                ?.filter((data: CakeData) => data._id !== selectedCake?._id)
                .map((data: CakeData) => (
                  <ProductCard
                    key={data._id}
                    id={data._id}
                    image={data.thumbnail}
                    title={data.vendorName}
                    description={`${data.size} - ${data.topping}`}
                    price={data.price}
                    onAdd={() =>
                      addToCart({
                        id: data._id,
                        image: data.thumbnail,
                        title: data.vendorName,
                        description: `${data.size} - ${data.topping}`,
                        price: data.price,
                      })
                    }
                  />
                ))}
            </div>
          </div>
        </main>
      </div>

      {paymentUrl && (
        <Dialog
          open={isPaymentOpen}
          onOpenChange={(open) =>
            open ? setIsPaymentOpen(true) : handleClosePayment()
          }
        >
          <DialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            className='max-w-3xl h-[80vh] p-0 flex flex-col'
          >
            <DialogHeader className='p-4 flex justify-between items-center border-b'>
              <DialogTitle className='font-semibold'>
                Complete Payment
              </DialogTitle>
            </DialogHeader>
            <div className='flex-1 relative'>
              <iframe
                src={paymentUrl}
                className='w-full h-full'
                frameBorder='0'
                allow='payment'
                onLoad={handleIframeLoad}
                // Add this script to attempt to communicate with parent window
                srcDoc={`
                  <html>
                    <head>
                      <script>
                        // Listen for URL changes
                        function checkForSuccessAndNotify() {
                          if (window.location.href.includes('success') || 
                              window.location.href.includes('status=successful')) {
                            // Send message to parent
                            window.parent.postMessage('payment_successful', '*');
                          }
                        }
                        
                        // Check on page load
                        window.addEventListener('load', checkForSuccessAndNotify);
                        
                        // Check on URL changes
                        const originalPushState = history.pushState;
                        history.pushState = function() {
                          originalPushState.apply(this, arguments);
                          checkForSuccessAndNotify();
                        };
                        
                        const originalReplaceState = history.replaceState;
                        history.replaceState = function() {
                          originalReplaceState.apply(this, arguments);
                          checkForSuccessAndNotify();
                        };
                      </script>
                    </head>
                    <body>
                      <script>
                        // Redirect to the payment URL
                        window.location.href = "${paymentUrl}";
                      </script>
                    </body>
                  </html>
                `}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default CheckOutPage
