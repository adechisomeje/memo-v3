'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { CartItem } from '../../components/cart-item'
import { formatPrice } from '@/lib/utils'
import { ReviewButton } from '../../components/review-button'
import { ProductCard } from '../../components/product-card'

interface CartItem {
  image: string
  title: string
  description: string
  price: number
}

const defaultCartItem = {
  image: '/assets/images/cake-sample.svg',
  title: 'Birthday Cake',
  description: 'A 2 layered, 12 inch buttercream chocolate cake',
  price: 120,
}

const products = Array(6).fill({
  image: '/assets/images/flower-sample.png',
  title: 'Bouquet Flower',
  description: 'A fruity rich wine any day',
  price: 150,
})

const CheckOutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([defaultCartItem])

  const addToCart = (product: CartItem) => {
    setCartItems([...cartItems, product])
  }

  const removeFromCart = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <>
      <div className='px-10'>
        <main className='max-w-7xl mx-auto px-4 py-8'>
          <div className='grid lg:grid-cols-2 gap-8 mb-12'>
            <div>
              {cartItems.length === 1 ? (
                // Single item view - larger but width-constrained image
                <div className='relative rounded-lg overflow-hidden h-96 max-w-lg mx-auto'>
                  <Image
                    src='/assets/images/cake-sample.svg'
                    alt='Birthday Cake'
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                // Multiple items view - grid layout
                <>
                  <div className='aspect-w-1 aspect-h-1 relative rounded-lg overflow-hidden'>
                    <Image
                      src='/assets/images/cake-sample.svg'
                      alt='Birthday Cake'
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div className='mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 overflow-x-auto'>
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
                        className='relative w-full aspect-square'
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className='object-cover rounded-lg'
                        />
                        {index !== 0 && (
                          <X
                            onClick={() => removeFromCart(index)}
                            className='absolute top-1 right-1 bg-primary text-white cursor-pointer rounded-full p-1 text-xs'
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className='mt-5'>
                <h2 className='font-bold'>Cake Specs:</h2>
                <p className='text-sm'>{defaultCartItem.description}</p>
              </div>
            </div>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <div className='flex flex-col '>
                    <span className='font-semibold text-lg'>
                      Delivery Address:
                    </span>
                    <span className='text-sm'>
                      Lekki-Epe Express, Km 15, Lagos, Nigeria
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <span className='font-semibold text-lg'>
                      Delivery Date:
                    </span>
                    <span className='text-sm'>23rd of July 2025</span>
                  </div>
                </div>
                <div className='border-t pt-4'>
                  <div className='flex justify-between mb-2'>
                    <span className='font-semibold'>Delivery fee:</span>
                    <span>{formatPrice(120)}</span>
                  </div>
                  <div className='flex justify-between font-semibold'>
                    <span>TOTAL:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
              {/* Rest of the component remains the same */}
              <div className='space-y-4'>
                <Textarea placeholder='Cake Note...' />
                <Textarea placeholder='Flower Note...' />
                <div className='grid grid-cols-2 gap-4'>
                  <Input placeholder='Recipient Name' />
                  <Input placeholder='Recipient Phone No' />
                </div>
                <Button className='w-full mt-10' size='lg'>
                  PROCEED TO PAY ({formatPrice(totalPrice)})
                </Button>
              </div>
              <div className='space-y-4 bg-[#FFFBFA] p-5'>
                <div className='flex items-center gap-2'>
                  <div className='h-12 w-12 rounded-full mt-10 ' />
                  <div>
                    <div className='font-medium'>Ajasco cakes</div>
                    <div className='flex items-center gap-1'>
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
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
                <Button variant='outline' className='w-full p-6 '>
                  Message Vendor
                </Button>
              </div>
            </div>
          </div>
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Other Items from Vendor</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
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
