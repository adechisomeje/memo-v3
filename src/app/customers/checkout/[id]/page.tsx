
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, validateName, validatePhone } from '@/lib/utils'
import { ReviewButton } from '../../components/review-button'
import { ProductCard } from '../../components/product-card'
import { StarFill } from '../../../../../public/assets/icons/StarRating'
import { useMutation } from '@tanstack/react-query'
import { userCreateOrder } from '@/api/orders'
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

const formSchema = z.object({
  cakeNote: z.string().optional(),

  flowerNote: z.string().optional(),

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
  image: string
  title: string
  description: string
  price: number
}

const products = Array(6).fill({
  image: '/assets/images/cake-sample.svg',
  title: 'Bouquet Flower',
  description: 'A fruity rich wine any day',
  price: 150,
})

const CheckOutPage = () => {
  const router = useRouter()
  const selectedCake = useCakeCustomization((state) => state.selectedCake)
  const deliveryDetails = useDeliveryDetails((state) => state.deliveryDetails)
  const cakeCustomization = useCakeCustomization((state) => state.customization)

  const [otherItems, setOtherItems] = useState<CartItem[]>([])

  const addToCart = (product: CartItem) => {
    setOtherItems((prevItems) => [...prevItems, product])
  }

  const removeFromCart = (index: number) => {
    setOtherItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }

  const totalPrice = selectedCake ? selectedCake.price : 0
  const totalWithOtherItems =
    totalPrice + otherItems.reduce((sum, item) => sum + item.price, 0)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cakeNote: '',
      flowerNote: '',
      recipientName: '',
      recipientPhone: '',
    },
  })

  const mutation = useMutation({
    mutationFn: userCreateOrder,
    onError: (error) => {
      toast.error(error.message ?? 'Something went wrong')
    },
    onSuccess: () => {
      router.push('/')
    },
  })

  // const onSubmit = () => {
  //   function handleSumbit(data: z.infer<typeof formSchema>) {
  //     mutation.mutate({
  //       cake: selectedCake,
  //       deliveryDetails: deliveryDetails,
  //       otherItems: otherItems,
  //   });
  // }
  // }

  if (!selectedCake || !deliveryDetails) {
    return null
  }

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-10'>
        <main className='max-w-7xl mx-auto py-8'>
          <div className='grid lg:grid-cols-2 gap-8 mb-12'>
            <div>
              {/* Main Cake Display - Now OUTSIDE the other items grid */}
              <div className='relative rounded-2xl overflow-hidden h-72 sm:h-96 max-w-lg mx-auto'>
                <Image
                  src={selectedCake.thumbnail}
                  alt={selectedCake.vendorName}
                  fill
                  className='object-cover'
                />
              </div>

              {/* Grid Container for ONLY Other Items */}
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
                  Classic vanilla cake with buttercream frosting
                </p>{' '}
                {/* Example description */}
                {cakeCustomization && (
                  <div className='mt-2 text-sm'>
                    <p className='font-semibold'>
                      {cakeCustomization.size} inch {cakeCustomization.flavour}{' '}
                    </p>
                    <p>
                      with {cakeCustomization.layers} <strong>Layers:</strong>
                    </p>
                    <p>
                      <strong>Size:</strong>
                    </p>

                    <p>
                      <strong>Icing:</strong> {cakeCustomization.icing}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-6'>
              {/* ... (rest of your checkout page content) ... */}
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
                    name='cakeNote'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Cake Note...'
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
                    name='flowerNote'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder='Flower Note...'
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
                    //  onClick={form.handleSubmit(handleSumbit)}
                    type='submit'
                    className='w-full mt-10'
                    size='lg'
                  >
                    PROCEED TO PAY ({formatPrice(totalWithOtherItems + 120)})
                  </Button>
                </Form>
              </div>
              <div className='space-y-4 bg-[#FFFBFA] p-5 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <div className='h-12 w-12 rounded-full bg-gray-200' />
                  <div>
                    <div className='font-medium'>Ajasco cakes</div>
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
                <Button variant='outline' className='w-full p-4 sm:p-6'>
                  Message Vendor
                </Button>
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Other Items from Vendor</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
              {products.map((product, index) => (
                <ProductCard key={index} {...product} onAdd={addToCart} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default CheckOutPage
