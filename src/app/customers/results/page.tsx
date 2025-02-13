'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Card, CardContent } from '@/components/ui/card'
import * as z from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getCakeProducts } from '@/api/public'
import CakeCardSkeleton from '../components/cake-card-skeleton'
import { queryKeys } from '@/lib/queries'

const cakeCustomizationSchema = z.object({
  flavour: z.string({
    required_error: 'Please select a flavour',
  }),
  size: z.string({
    required_error: 'Please select a size',
  }),
  layers: z.string({
    required_error: 'Please select number of layers',
  }),
  icing: z.string({
    required_error: 'Please select an icing type',
  }),
})

export type CakeCustomizationSchema = z.infer<typeof cakeCustomizationSchema>

interface Cake {
  _id: string
  thumbnail: string
  price: number
  vendorName: string
  vendorPicture: string
  vendorCountry: string
  vendorState: string
  vendorCity: string
}

type ProductType = 'cakes' | 'gifts' | 'flowers'

const ResultsPage = () => {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedCake, setSelectedCake] = useState<Cake | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: cakeProducts, isLoading } = useQuery({
    queryKey: queryKeys.cakeProducts,
    queryFn: getCakeProducts,
    staleTime: 5 * 60 * 1000, // Match the staleTime from home page

    // If we can't find the data, redirect to home
    // onError: () => router.push('/'),
  })

  useEffect(() => {
    if (!isLoading && !cakeProducts) {
      router.push('/')
    }
  }, [isLoading, cakeProducts, router])

  const handleProductSelect = (product: Cake, type: ProductType) => {
    if (type === 'cakes') {
      setSelectedCake(product)
      setIsSheetOpen(true)
    } else {
      router.push(`/customers/checkout/${product._id}`)
    }
  }

  const handleCakeCustomization = async () => {
    if (!selectedCake) return
    setIsSheetOpen(false)
    router.push(`/customers/checkout/${selectedCake._id}`)
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

    // Wait for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000))
    if (!selectedCake) return
    router.push(`/customers/checkout/${selectedCake._id}`)
  }

  console.log(cakeProducts)

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-14'>
        <main>
          <div className='flex justify-between items-center mt-8'>
            <h1 className='text-[#640D0D] text-lg '>
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
          <div className='flex flex-col '>
            <div className='flex items-center justify-between'>
              <div className='md:flex gap-4 mt-8 hidden'>
                <Select>
                  <SelectTrigger className='gap-3 p-4 w-full'>
                    <SelectValue placeholder='Prize' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='gap-3 p-4 w-full'>
                    <SelectValue placeholder='Size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='system'>System</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className='gap-3 p-4 w-full'>
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
                <div className='flex justify-end'>
                  <TabsList>
                    <TabsTrigger value='cakes'>Cakes</TabsTrigger>
                    <TabsTrigger value='gifts'>Gifts</TabsTrigger>
                    <TabsTrigger value='flowers'>Flowers</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='cakes' className='w-full mt-8'>
                  <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <CakeCardSkeleton key={index} />
                      ))
                    ) : cakeProducts && cakeProducts.length > 0 ? (
                      cakeProducts.map((cake) => (
                        <div
                          key={cake._id}
                          onClick={() => handleProductSelect(cake, 'cakes')}
                          className='cursor-pointer'
                        >
                          <Card className='overflow-hidden'>
                            <div className='aspect-[4/3] relative overflow-hidden'>
                              <Image
                                src={cake.thumbnail || '/placeholder.svg'}
                                alt={cake.vendorName}
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
                                    <span className='font-semibold'>
                                      ${cake.price}
                                    </span>
                                  </div>
                                  <div className='flex justify-between items-center'>
                                    <span className='text-sm text-muted-foreground'>
                                      Delivery estimate:
                                    </span>
                                    <span className='font-semibold'>$400</span>
                                  </div>
                                  <div className='flex justify-between items-center pt-2 border-t'>
                                    <span className='text-sm font-medium'>
                                      TOTAL:
                                    </span>
                                    <span className='font-bold'>
                                      ${cake.price + 400}
                                    </span>
                                  </div>
                                </div>
                                <div className='flex items-center gap-3 pt-3 border-t'>
                                  <Avatar className='h-8 w-8'>
                                    <AvatarImage
                                      src={cake.vendorPicture}
                                      alt={cake.vendorName}
                                    />
                                    <AvatarFallback>
                                      {cake.vendorName
                                        .split(' ')
                                        .map((word) => word[0])
                                        .join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className='flex-1'>
                                    <h3 className='text-sm font-medium'>
                                      {cake.vendorName}
                                    </h3>
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
                                      <span className='text-sm font-medium'>
                                        4.9
                                      </span>
                                      <span className='text-sm text-muted-foreground'>
                                        (1k+)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    ) : (
                      <div className='col-span-full text-center py-10'>
                        <p>
                          No cake products available. Please try again later.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value='gifts'>
                  {/* Add gifts content here */}
                </TabsContent>
                <TabsContent value='flowers'>
                  {/* Add flowers content here */}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <Pagination className='my-10'>
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
        <SheetContent className='overflow-y-auto sm:max-w-[640px] p-6 sm:p-10'>
          <SheetHeader className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:gap-8'>
            <div className='relative w-full h-48 mb-4'>
              <Image
                src={
                  selectedCake?.thumbnail || '/assets/images/cake-sample.svg'
                }
                alt='Selected cake'
                fill
                className='object-cover rounded-lg'
              />
            </div>

            <div className='space-y-2 mb-4'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>Price:</span>
                <span className='font-semibold'>
                  ${/* {selectedCake?.price || 0} */}dummy
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Delivery estimate:
                </span>
                <span className='font-semibold'>$400</span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t'>
                <span className='text-sm font-medium'>TOTAL:</span>
                <span className='font-bold'>
                  ${(selectedCake?.price || 0) + 400}
                </span>
              </div>
              <div className='flex items-center gap-3 pb-4 border-b'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/assets/images/naomi.png' />
                  {selectedCake?.vendorPicture || '/assets/images/naomi.png'}
                  <AvatarFallback>
                    {selectedCake?.vendorName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h3 className='text-sm font-medium'>
                    {selectedCake?.vendorName}
                  </h3>
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
                        <SelectTrigger className='p-4 sm:p-6'>
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
                        <SelectTrigger className='p-4 sm:p-6'>
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
                        <SelectTrigger className='p-4 sm:p-6'>
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
                        className='p-4 sm:p-6 border-[#E3E3E3]'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full'>
                I want this
              </Button>
              <small className='flex gap-2 items-center'>
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
