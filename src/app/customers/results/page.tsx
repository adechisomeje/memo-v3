'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import Image from 'next/image'
import { Info, Star } from 'lucide-react'
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
import { Cake, getCakeProducts } from '@/api/public'
import CakeCardSkeleton from '../components/cake-card-skeleton'
import { queryKeys } from '@/lib/queries'
import { Filter } from '../../../../public/assets/icons/Filter'
import { StarFill } from '../../../../public/assets/icons/StarRating'
import { useCakeCustomization } from '@/store/cakeCustomization'
import { useVendorStore } from '@/store/vendorStore'

const cakeCustomizationSchema = z.object({
  flavour: z.array(z.string()),
  layers: z.string().min(1, { message: 'Please select number of layers' }),
})

export type CakeCustomizationSchema = z.infer<typeof cakeCustomizationSchema>

type ProductType = 'cakes' | 'gifts' | 'flowers'

const ResultsPage = () => {
  const router = useRouter()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedLayerPrice, setSelectedLayerPrice] = useState<number>(0)
  const setCustomization = useCakeCustomization(
    (state) => state.setCustomization
  )
  const setSelectedCake = useCakeCustomization((state) => state.setSelectedCake)
  const setSelectedCakeId = useCakeCustomization(
    (state) => state.setSelectedCakeId
  )
  const selectedCake = useCakeCustomization((state) => state.selectedCake)
  const setVendorInfo = useVendorStore((state) => state.setVendorInfo)

  const { data: cakeProductsResponse, isLoading } = useQuery({
    queryKey: queryKeys.cakeProducts,
    queryFn: getCakeProducts,
    staleTime: 5 * 60 * 1000,
  })

  // Access the cakes data through the response structure
  const cakeProducts = cakeProductsResponse?.data

  const handleProductSelect = (product: Cake, type: ProductType) => {
    console.log('Selecting product:', product)
    setSelectedCake(product)
    setSelectedCakeId(product._id)

    setVendorInfo({
      vendorId: product.vendorId,
      name: product.vendorName,
      picture: product.vendorPicture,
      country: product.vendorCountry,
      state: product.vendorState,
      city: product.vendorCity,
    })

    // Set initial layer price based on the base price, or the first layer price if available.
    setSelectedLayerPrice(
      product.layerPrices
        ? product.layerPrices['1'] ?? product.price
        : product.price
    )

    if (type === 'cakes') {
      setIsSheetOpen(true)
    } else {
      router.push(`/customers/checkout/${product._id}`)
    }
  }

  const form = useForm<CakeCustomizationSchema>({
    resolver: zodResolver(cakeCustomizationSchema),
    defaultValues: {
      flavour: [],
      layers: '',
      // icing: 'Buttercream',
    },
  })

  useEffect(() => {
    if (selectedCake) {
      const firstLayer = selectedCake.layerPrices
        ? Object.keys(selectedCake.layerPrices)[0]
        : String(selectedCake.layers)

      // Set default values for the form
      form.reset({
        flavour: selectedCake.flavours,
        layers: firstLayer,
      })

      // Convert string to number for layerPrices access
      const layerNumber = parseInt(firstLayer)
      setSelectedLayerPrice(
        selectedCake.layerPrices
          ? selectedCake.layerPrices[layerNumber] ?? selectedCake.price
          : selectedCake.price
      )
    }
  }, [selectedCake, form])

  const handleCakeCustomization = async (data: CakeCustomizationSchema) => {
    const dataWithPrice: CakeCustomizationSchema & { price?: number } = {
      ...data,
      price: selectedLayerPrice,
    }

    setCustomization(dataWithPrice) // Now it matches the store's type

    setIsSheetOpen(false)
    router.push(`/customers/checkout/${selectedCake?._id}`)
  }

  // Function to handle layer changes and update the price.
  const handleLayerChange = (layer: string) => {
    if (selectedCake && selectedCake.layerPrices) {
      const layerNumber = parseInt(layer)
      const priceForLayer = selectedCake.layerPrices[layerNumber]
      setSelectedLayerPrice(priceForLayer ?? selectedCake.price)
    }
    form.setValue('layers', layer)
  }

  async function onSubmit(data: CakeCustomizationSchema) {
    handleCakeCustomization(data)
  }

  return (
    <>
      <div className='px-4 sm:px-6 lg:px-14'>
        <main>
          <div className='flex justify-between items-center mt-8'>
            <h1 className='text-[#640D0D] text-lg '>
              Choose Your Special <span className='font-semibold'>Treat</span>
            </h1>
            <Filter />
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
                <div className='lg:flex lg:justify-end justify-around'>
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
                    ) : cakeProducts?.cakes && cakeProducts.cakes.length > 0 ? (
                      cakeProducts.cakes.map((cake) => (
                        <div
                          key={cake._id}
                          onClick={() => handleProductSelect(cake, 'cakes')}
                          className='cursor-pointer'
                        >
                          <Card className='overflow-hidden'>
                            <div className='aspect-[4/3] relative overflow-hidden'>
                              <Image
                                src={
                                  cake.thumbnail ||
                                  '/assets/images/cake-sample.svg'
                                }
                                alt={cake.vendorName}
                                fill
                                className='object-cover'
                              />
                            </div>
                            <CardContent className='p-4'>
                              <div className='space-y-3'>
                                <div className='space-y-1'>
                                  <div className='flex justify-between items-center'>
                                    <span>Size:</span>
                                    <span className='font-semibold'>
                                      {cake.size}
                                    </span>
                                  </div>
                                  <div className='flex justify-between items-center'>
                                    <span>Layers:</span>
                                    <span className='font-semibold'>
                                      {Object.keys(cake.layerPrices)[0]} Layers
                                    </span>
                                  </div>
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
                                    <span className='font-semibold'>$120</span>
                                  </div>
                                  <div className='flex justify-between items-center pt-2 border-t'>
                                    <span className='text-sm font-medium'>
                                      TOTAL:
                                    </span>
                                    <span className='font-bold'>
                                      ${cake.price + 120}
                                    </span>
                                  </div>
                                </div>
                                <div className='flex items-center gap-3 pt-3 border-t'>
                                  <Avatar className='h-10 w-10'>
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
                                          <StarFill
                                            key={i}
                                            className={` ${
                                              i < 5
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
                      <div className='flex flex-col justify-center items-center  py-10 gap-3'>
                        <Image
                          src='/assets/icons/no-data.svg'
                          alt='No results'
                          width={500}
                          height={500}
                        />
                        <p className='mt-8'>
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
            {/* ... (your Image and initial price display) ... */}
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
                  {/* Display selectedLayerPrice, not the base price */}$
                  {selectedLayerPrice}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Delivery estimate:
                </span>
                <span className='font-semibold'>$120</span>
              </div>
              <div className='flex justify-between items-center pt-2 border-t'>
                <span className='text-sm font-medium'>TOTAL:</span>
                <span className='font-bold'>
                  {/* Calculate based on selectedLayerPrice */}$
                  {selectedLayerPrice + 120}
                </span>
              </div>

              <div className='flex items-center gap-3 pb-4 border-b'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='/assets/images/naomi.png' />
                  {/* {selectedCake?.vendorPicture || '/assets/images/naomi.png'} */}
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
                    <FormControl>
                      <div className='flex flex-wrap gap-2'>
                        {selectedCake?.flavours.map((flavour: string) => (
                          <Button
                            key={flavour}
                            type='button'
                            variant={
                              field.value.includes(flavour)
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() => {
                              const newValue = field.value.includes(flavour)
                                ? field.value.filter((f) => f !== flavour)
                                : [...field.value, flavour]
                              field.onChange(newValue)
                              console.log(flavour)
                            }}
                          >
                            {flavour}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
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
                      onValueChange={handleLayerChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='p-4 sm:p-6'>
                          <SelectValue placeholder='Select number of layers' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCake &&
                          selectedCake.layerPrices &&
                          Object.entries(selectedCake.layerPrices).map(
                            ([layer, price]) => (
                              <SelectItem key={layer} value={layer}>
                                {layer} Layers (${price})
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
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
        </SheetContent>
      </Sheet>
    </>
  )
}

export default ResultsPage
