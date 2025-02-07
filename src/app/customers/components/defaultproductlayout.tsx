import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'

// Updated Product interface to match the parent component's requirements
interface Product {
  id: string // Changed from number to string to match parent
  image: string
  name: string
  price: number
  vendor: {
    name: string
    rating: number
    reviews: number
    avatar: string
  }
}

interface ProductLayoutProps {
  onProductSelect: (product: Product) => void
}

const ProductLayout = ({ onProductSelect }: ProductLayoutProps) => {
  const products: Product[] = [...Array(4)].map((_, index) => ({
    id: (index + 1).toString(), // Convert to string
    image: '/assets/images/cake-sample.svg',
    name: `Cake ${index + 1}`,
    price: 1200,
    vendor: {
      name: 'Ajasco cakes',
      rating: 4.9,
      reviews: 1000,
      avatar: '/placeholder.svg',
    },
  }))

  return (
    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductSelect(product)}
          className='cursor-pointer'
        >
          <Card className='overflow-hidden'>
            <div className='aspect-[4/3] relative overflow-hidden'>
              <Image
                src={product.image}
                alt={product.name}
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Price:
                    </span>
                    <span className='font-semibold'>${product.price}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-muted-foreground'>
                      Delivery estimate:
                    </span>
                    <span className='font-semibold'>$400</span>
                  </div>
                  <div className='flex justify-between items-center pt-2 border-t'>
                    <span className='text-sm font-medium'>TOTAL:</span>
                    <span className='font-bold'>${product.price + 400}</span>
                  </div>
                </div>
                <div className='flex items-center gap-3 pt-3 border-t'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage
                      src={product.vendor.avatar}
                      alt={product.vendor.name}
                    />
                    <AvatarFallback>
                      {product.vendor.name
                        .split(' ')
                        .map((word) => word[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h3 className='text-sm font-medium'>
                      {product.vendor.name}
                    </h3>
                    <div className='flex items-center gap-1'>
                      <div className='flex'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.vendor.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className='text-sm font-medium'>
                        {product.vendor.rating}
                      </span>
                      <span className='text-sm text-muted-foreground'>
                        (
                        {product.vendor.reviews > 999
                          ? '1k+'
                          : product.vendor.reviews}
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default ProductLayout
