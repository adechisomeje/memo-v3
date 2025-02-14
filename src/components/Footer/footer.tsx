import Link from 'next/link'
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react'
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})
export function Footer() {
  return (
    <footer className='bg-[#370e06]  py-12 px-4'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='text-3xl text-[#FDF0D5]'>
            <Link className={dancingScript.className} href='/'>
              MEMO
            </Link>
          </div>
          <p className='text-[#FDF0D5] lg:hidden text-sm'>
            Memo: Your trusted platform for seamless gifting and local
            connections. Discover, customize, and send cakes, flowers, and gifts
            with ease.
          </p>

          <div className='text-[#FDF0D5]'>
            <h3 className='font-medium mb-4 '>Information</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about'>About Us</Link>
              </li>
              <li>
                <Link href='/blogs'>Blogs</Link>
              </li>
              <li>
                <Link href='/testimonials'>Testimonials</Link>
              </li>
            </ul>
          </div>

          <div className='text-[#FDF0D5]'>
            <h3 className='font-medium mb-4'>Helpful Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link href='/about'>About Us</Link>
              </li>
              <li>
                <Link href='/blogs'>Blogs</Link>
              </li>
              <li>
                <Link href='/testimonials'>Testimonials</Link>
              </li>
            </ul>
          </div>

          <div className='text-[#FDF0D5]'>
            <h3 className='font-medium mb-4'>Contact Us</h3>
            <p className='mb-2'>+23456789000</p>
            <p className='mb-4'>memo@gmail.com</p>
            <div className='flex space-x-4'>
              <Link href='#' className='hover:text-[#c1121f]'>
                <Twitter className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-[#c1121f]'>
                <Globe className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-[#c1121f]'>
                <Instagram className='h-5 w-5' />
              </Link>
              <Link href='#' className='hover:text-[#c1121f]'>
                <Facebook className='h-5 w-5' />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='border-t border-white/10 m-1'>
        <div className='container mx-auto py-4 lg:flex hidden justify-between items-center text-sm '>
          <p className='text-[#FDF0D5]'>2024 cc.Ltd | All Rights Reserved</p>
          <div className='flex space-x-4 text-[#FDF0D5]'>
            <Link href='/faq'>FAQ</Link>
            <Link href='/privacy'>Privacy</Link>
            <Link href='/terms'>Terms & Conditions</Link>
          </div>
        </div>
        <div className='flex justify-center items-center my-5 lg:hidden'>
          <p className='text-[#FDF0D5]'>2024 cc.Ltd | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
