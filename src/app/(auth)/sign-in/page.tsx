import Link from 'next/link'
import { Dancing_Script } from 'next/font/google'
import Image from 'next/image'
import SignInForm from './sign-in-form'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
})

export default function SignInPage() {
  return (
    <main className='min-h-screen flex'>
      {/* Left Section */}
      <div
        className='relative hidden lg:flex lg:w-1/2 bg-cover bg-center'
        style={{
          backgroundImage: `url('/assets/images/auth-bg.png')`,
        }}
      >
        {/* Decorative Line */}
        <div className='absolute left-0 top-0 bg-contain bg-no-repeat'>
          <Image
            src='/assets/images/sign-in-line.png'
            alt='Decorative line'
            width='450'
            height='450'
          />
        </div>
        <div className='relative mt-96 z-10 flex flex-col justify-between w-full p-12 text-white'>
          <div className='space-y-2'>
            <h1 className='text-5xl font-bold leading-tight'>
              Life is all about
              <br />
              Memorable
              <br />
              <span className='text-[#FDF0D5]'>Moments</span>
            </h1>
          </div>
          <p className='text-sm opacity-80'>
            ©2025{' '}
            <span className=''>
              <Link className={dancingScript.className} href='/'>
                MEMO
              </Link>
            </span>{' '}
            All Right Reserved
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex-1 flex flex-col items-center justify-center px-6 lg:px-16 bg-white my-10'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center space-y-6'>
            <div className='text-3xl'>
              <Link className={dancingScript.className} href='/'>
                MEMO
              </Link>
            </div>
            <div className='space-y-2'>
              <h3 className='text-primary text-2xl font-semibold'>
                Log in to your Account
              </h3>
              <p className='text-[#656565]'>
                Welcome back! select method to log in
              </p>
            </div>
          </div>

          <SignInForm />
        </div>
      </div>
    </main>
  )
}
