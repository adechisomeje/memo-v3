'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, validateName, validatePhone } from '@/lib/utils'
import { ReviewButton } from '../../components/review-button'
import { ProductCard } from '../../components/product-card'
import { StarFill } from '../../../../../public/assets/icons/StarRating'
import { useMutation } from '@tanstack/react-query'
import { CreateOrderResponse, userCreateOrder } from '@/api/orders'
import { toast } from 'sonner'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useDeliveryDetails } from '@/store/deliveryDetails'
import { useCakeCustomization } from '@/store/cakeCustomization'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
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

const formSchema = z.object({
  note: z.string().optional(),
  recipientName: z
    .string()
    .min(2, {
      message: 'First Name must be at least 2 characters',
    })
    .refine(validateName, {
      message: 'First Name must contain only alphabets',
    }),

  recipientPhone: z
    .string()
    .min(11, {
      message: 'Phone Number must be at least 11 characters',
    })
    .max(11, {
      message: 'Phone Number must be 11 characters',
    })
    .refine(validatePhone, {
      message: 'Enter a valid phone number (e.g. 08034567890)',
    }),
})

interface CartItem {
  id: string
  image: string
  title: string
  description: string
  price: number
  quantity: number
}

const CheckOutPage = () => {
  const [otherItems, setOtherItems] = useState<CartItem[]>([])
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const router = useRouter()
  const selectedCake = useCakeCustomization((state) => state.selectedCake)
  const deliveryDetails = useDeliveryDetails((state) => state.deliveryDetails)
  const cakeCustomization = useCakeCustomization((state) => state.customization)
  const vendorId = useVendorStore((state) => state.selectedVendorId)

  // Set up payment success listener using window events
  useEffect(() => {
    // Function to handle payment success message from the payment iframe
    const handlePaymentMessage = (event: MessageEvent) => {
      // Check if the message is from your payment provider
      // You might need to adjust this based on the payment provider's domain
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

    // Listen for messages from the iframe
    window.addEventListener('message', handlePaymentMessage)

    // Clean up the event listener
    return () => {
      window.removeEventListener('message', handlePaymentMessage)
    }
  }, [])

  // Function to handle successful payment
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

      // Add new item with quantity 1
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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: '',
      recipientName: '',
      recipientPhone: '',
    },
  })

  const handleClosePayment = () => {
    setPaymentUrl(null)
    setIsPaymentOpen(false)
  }

  // Check URL changes in the iframe
  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      // Try to get the current URL of the iframe
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
      toast.success(data.data.message)
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!selectedCake || !deliveryDetails || !cakeCustomization) {
      toast.error(
        'Missing required data. Please go back and select a cake and delivery details.'
      )
      return
    }

    const layersNumber = parseInt(cakeCustomization.layers.toString())

    // Transform otherItems into the required additionalProducts format
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
      deliveryDate: deliveryDetails.date,
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

  if (!selectedCake || !deliveryDetails) {
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
          {/* Content remains the same */}
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

            {/* Right column with checkout form */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-lg'>
                      Delivery Address:
                    </span>
                    <span className='text-sm'>
                      {deliveryDetails.address}, {deliveryDetails.city},{' '}
                      {deliveryDetails.state}, {deliveryDetails.country}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-lg'>
                      Delivery Date:
                    </span>
                    <span className='text-sm'>{deliveryDetails.date}</span>
                  </div>
                </div>
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

                    <FormField
                      control={form.control}
                      name='recipientPhone'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder='Recipient Phone No'
                              className='w-full'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    disabled={mutation.isPending}
                    onClick={form.handleSubmit(handleSubmit)}
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
                        PROCEED TO PAY ({formatPrice(totalWithOtherItems + 120)}
                        )
                      </>
                    )}
                  </Button>
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

                <ReviewButton vendorId='ajasco-cakes' reviewCount={5} />
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
