'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Info, Loader2, Star } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ProductLayout from '../components/defaultproductlayout'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  cakeCustomizationSchema,
  type CakeCustomizationSchema,
} from '../../../../schemas/cake-customization'

// Define interfaces for our data types
interface Product {
  id: string
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

type ProductType = 'cakes' | 'gifts' | 'flowers'

const ResultsPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedCake, setSelectedCake] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleProductSelect = (product: Product, type: ProductType) => {
    if (type === 'cakes') {
      setSelectedCake(product)
      setIsSheetOpen(true)
    } else {
      router.push(`/customers/checkout/${product.id}`)
    }
  }

  const handleCakeCustomization = async () => {
    if (!selectedCake) return
    setIsSheetOpen(false)
    router.push(`/customers/checkout/${selectedCake.id}`)
  }

  const form = useForm<CakeCustomizationSchema>({
    resolver: zodResolver(cakeCustomizationSchema),
    defaultValues: {
      flavour: '',
      size: '',
      layers: '',
      icing: 'Buttercream',
    },
  })

  async function onSubmit(data: CakeCustomizationSchema) {
    console.log(data)
    handleCakeCustomization()
    setIsModalOpen(true)

    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000))
    if (!selectedCake) return
    router.push(`/customers/checkout/${selectedCake.id}`)
  }

  return (
    <>
      <div className='px-14'>
        <main>
          <div className='flex justify-between'>
            <h1 className='text-[#640D0D] text-lg'>
              Choose Your Special <span className='font-semibold'>Treat</span>
            </h1>
            <svg
              className='md:hidden pb-3'
              width='40'
              height='40'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6 9.66669H26M9.84667 16H22.1533M13.6933 22.3334H18.3067'
                stroke='black'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center justify-between'>
              <div className='md:flex gap-4 mt-8 hidden'>
                <Select>
                  <SelectTrigger className='gap-3'>
                    <SelectValue placeholder='Prize' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='gap-3'>
                    <SelectValue placeholder='Size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='gap-3'>
                    <SelectValue placeholder='Distance' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='w-full mb-10'>
              <Tabs defaultValue='cakes' className=''>
                <div className='flex justify-end '>
                  <TabsList>
                    <TabsTrigger value='cakes'>Cakes</TabsTrigger>
                    <TabsTrigger value='gifts'>Gifts</TabsTrigger>
                    <TabsTrigger value='flowers'>Flowers</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='cakes' className='w-full mt-8'>
                  <ProductLayout
                    onProductSelect={(product: Product) =>
                      handleProductSelect(product, 'cakes')
                    }
                  />
                </TabsContent>
                <TabsContent value='gifts'>
                  <ProductLayout
                    onProductSelect={(product: Product) =>
                      handleProductSelect(product, 'gifts')
                    }
                  />
                </TabsContent>
                <TabsContent value='flowers'>
                  <ProductLayout
                    onProductSelect={(product: Product) =>
                      handleProductSelect(product, 'flowers')
                    }
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href='#' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href='#'>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className='overflow-y-auto sm:max-w-[640px] p-10'>
          <SheetHeader className='lg:flex flex-row space-y-0 gap-8 block'>
            <div className='relative w-full h-48 mb-4'>
              <Image
                src={selectedCake?.image || '/assets/images/cake-sample.svg'}
                alt='Selected cake'
                fill
                className='object-cover rounded-lg'
              />
            </div>

            <div className='space-y-2 mb-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>Price:</span>
                <span className='font-semibold'>$1200</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Delivery estimate:
                </span>
                <span className='font-semibold'>$400</span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t'>
                <span className='text-sm font-medium'>TOTAL:</span>
                <span className='font-bold'>$1600</span>
              </div>
              <div className='flex items-center gap-3 pb-4 border-b'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/placeholder.svg' />
                  <AvatarFallback>AC</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h3 className='text-sm font-medium'>Ajasco cakes</h3>
                  <div className='flex items-center gap-1'>
                    <div className='flex'>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className='text-sm font-medium'>4.9</span>
                    <span className='text-sm text-muted-foreground'>(1k+)</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 mt-8'
            >
              <FormField
                control={form.control}
                name='flavour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary font-medium text-lg'>
                      Flavour
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='p-6'>
                          <SelectValue placeholder='Select a flavour' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='chocolate'>Chocolate</SelectItem>
                        <SelectItem value='vanilla'>Vanilla</SelectItem>
                        <SelectItem value='velvet'>Red Velvet</SelectItem>
                        <SelectItem value='strawberry'>Strawberry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='size'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary font-medium text-lg'>
                      Size
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='p-6'>
                          <SelectValue placeholder='Select a size' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='6'>6 inch</SelectItem>
                        <SelectItem value='8'>8 inch</SelectItem>
                        <SelectItem value='10'>10 inch</SelectItem>
                        <SelectItem value='12'>12 inch</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='layers'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary font-medium text-lg'>
                      Layers
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='p-6'>
                          <SelectValue placeholder='Select number of layers' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='2'>2 Layers</SelectItem>
                        <SelectItem value='3'>3 Layers</SelectItem>
                        <SelectItem value='4'>4 Layers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='icing'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary font-medium text-lg'>
                      Icing
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter icing type'
                        {...field}
                        className='p-6 border-[#E3E3E3]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                I want this
              </Button>
              <small className='flex gap-2'>
                <Info color='red' size={16} />
                The total price may change a bit based on the delivery estimate
                after review by vendor
              </small>
            </form>
          </Form>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className='sm:max-w-md flex flex-col items-center justify-center py-12'>
              <div className='flex flex-col items-center gap-4'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <p className='text-center text-lg'>
                  The vendor is reviewing your request.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default ResultsPage
