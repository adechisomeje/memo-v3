'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Navbar from './customers/components/navbar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import WhyAndWhatSection from './customers/components/why-and-what-section'
import ProcessSimplified from './customers/components/process'
import TrustedCompanies from './customers/components/trusted-companies'
import { SearchForm } from './customers/components/search-form'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About us',
    href: '/about',
    // subItems: [
    //   { label: 'Create Shipment', href: '/ship' },
    //   { label: 'Get a quote', href: '/get-a-quote' },
    //   { label: 'Track', href: '/track' },
    // ],
  },
  {
    label: 'Contact us',
    href: '/job-riders',
    // subItems: [
    //   { label: 'Riders', href: '/riders' },
    //   { label: 'Rider scout', href: '/job-riders' },
    // ],
  },
  {
    label: 'Blogs',
    href: '/sign-in',
  },
]

const mobileNavItems = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About us',
    href: '/resources',
    subItems: [
      { label: 'Create Shipment', href: '/ship' },
      { label: 'Get a quote', href: '/get-a-quote' },
      { label: 'Track', href: '/track' },
    ],
  },
  {
    label: 'Contact us',
    href: '/job-riders',
    subItems: [
      { label: 'Riders', href: '/riders' },
      { label: 'Rider scout', href: '/job-riders' },
    ],
  },
  {
    label: 'Blog',
    href: '/sign-in',
    subItems: [
      { label: 'Blog', href: '/blog' },
      { label: 'User Case', href: '/user-case' },
    ],
  },
]

export default function Home() {
  const router = useRouter()
  const handleSubmit = (formData: FormData) => {
    // Handle form submission
    console.log(Object.fromEntries(formData))
  }

  const handleClick = () => {
    router.push('/customers/results')
  }

  return (
    <div className=''>
      <Navbar
        navItems={navItems}
        mobileNavItems={mobileNavItems}
        ctaLink='/get-started'
      />
      <main>
        <div className='relative lg:min-h-[800px] min-h-[450px] flex items-center justify-center'>
          {/* Background Image */}
          <Image
            src='/assets/images/landing-bg.png'
            alt='Background celebration image'
            fill
            className='object-cover brightness-50'
            priority
          />

          <div className='relative z-10 container mx-auto px-4 text-center text-white'>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold max-w-[700px] mx-auto lg:leading-[68px]'>
              Celebrate <span className='text-[#f5e6d3]'>Moments</span> with
              Cakes, Flowers, & More.
            </h1>
            <p className='md:text-xl mt-2 max-w-2xl mx-auto'>
              We make every celebration, from birthdays to anniversaries, easy
              and memorable. Send joy to your loved ones, no matter where they
              are
            </p>

            {/* <div className='bg-white hidden rounded-full p-2 md:flex flex-col md:flex-row gap-2 max-w-4xl mx-auto mt-10'>
              <div className='flex-1 flex items-center gap-2 text-left px-4 text-[#1E1B16]'>
                <MapPin className='h-5 w-5' />
                <input
                  type='text'
                  placeholder='Input delivery address'
                  className='w-full bg-transparent focus:outline-none'
                />
              </div>

              <button className='md:w-40 px-4 py-2 text-[#1E1B16] flex items-center justify-between hover:bg-gray-100 rounded-full'>
                <span>Country</span>
                <ChevronDown className='h-4 w-4' />
              </button>

              <button className='md:w-40 px-4 py-2 text-[#1E1B16] flex items-center justify-between hover:bg-gray-100 rounded-full'>
                <span>State</span>
                <ChevronDown className='h-4 w-4' />
              </button>

              <button className='md:w-40 px-4 py-2 text-[#1E1B16] flex items-center justify-between hover:bg-gray-100 rounded-full'>
                <span>City</span>
                <ChevronDown className='h-4 w-4' />
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='ghost'
                    className={cn(
                      'md:w-48 justify-between text-left font-normal hover:bg-gray-100',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <div className='flex items-center gap-2'>
                      <CalendarIcon className='h-4 w-4' />
                      {date ? format(date, 'PPP') : <span>Delivery date</span>}
                    </div>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div> */}
            <SearchForm className='hidden md:block' onSubmit={handleSubmit} />
            <div className='text-center hidden md:block'>
              <Button onClick={handleClick} size='lg' className='mt-10'>
                Get Started
              </Button>
            </div>
            <div className='md:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button onClick={handleClick} size='lg' className='mt-10'>
                    Get Started
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className=' sm:max-w-md'>
                  <SearchForm
                    variant='sheet'
                    onSubmit={handleSubmit}
                    className='h-full flex flex-col'
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <WhyAndWhatSection />
        <ProcessSimplified />
        <TrustedCompanies />
      </main>
    </div>
  )
}
