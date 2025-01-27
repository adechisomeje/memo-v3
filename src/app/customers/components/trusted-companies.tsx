import Image from 'next/image'

export default function TrustedCompanies() {
  return (
    <section className='bg-[#FFEAE4] py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-center text-primary text-3xl md:text-4xl font-bold mb-12'>
          Companies trusted by MEMO
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center'>
          {/* Busha */}
          <div className='w-32 h-12 relative'>
            <Image
              src='/assets/images/busha.svg'
              alt='Busha logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>

          {/* Business Day */}
          <div className='w-48 h-20 relative'>
            <Image
              src='/assets/images/business-day.svg'
              alt='Business Day logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>

          {/* Circa */}
          <div className='w-32 h-12 relative'>
            <Image
              src='/assets/images/circa.svg'
              alt='Circa logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>

          {/* Branch */}
          <div className='w-32 h-12 relative'>
            <Image
              src='/assets/images/branch.svg'
              alt='Branch logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>

          {/* Cravings */}
          <div className='w-32 h-12 relative'>
            <Image
              src='/assets/images/cravings.svg'
              alt='Cravings logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>

          {/* Eyowo */}
          <div className='w-32 h-12 relative'>
            <Image
              src='/assets/images/eyowo.svg'
              alt='Eyowo logo'
              fill
              className='object-contain w-full h-full'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
