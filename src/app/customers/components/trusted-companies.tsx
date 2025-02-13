import React from 'react'
import Image from 'next/image'

const TrustedCompanies = () => {
  const companies = [
    { name: 'Busha', src: '/assets/images/busha.svg' },
    { name: 'Business Day', src: '/assets/images/business-day.svg' },
    { name: 'Circa', src: '/assets/images/circa.svg' },
    { name: 'Branch', src: '/assets/images/branch.svg' },
    { name: 'Cravings', src: '/assets/images/cravings.svg' },
    { name: 'Eyowo', src: '/assets/images/eyowo.svg' },
  ]

  return (
    <section className='bg-[#FFEAE4] py-16 px-4'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-center text-primary text-xl md:text-3xl font-bold mb-12'>
          Companies trusted by MEMO
        </h2>

        <div className='relative overflow-hidden'>
          {/* First Slider */}
          <div className='flex space-x-16 animate-carousel'>
            {companies.map((company, index) => (
              <div key={`first-${index}`} className='flex-none w-32 h-20'>
                <div className='relative w-full h-full'>
                  <Image
                    src={company.src}
                    alt={`${company.name} logo`}
                    fill
                    className='object-contain'
                  />
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {companies.map((company, index) => (
              <div key={`second-${index}`} className='flex-none w-32 h-20'>
                <div className='relative w-full h-full'>
                  <Image
                    src={company.src}
                    alt={`${company.name} logo`}
                    fill
                    className='object-contain'
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className='absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#FFEAE4] to-transparent'></div>
          <div className='absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#FFEAE4] to-transparent'></div>
        </div>
      </div>
    </section>
  )
}

export default TrustedCompanies
