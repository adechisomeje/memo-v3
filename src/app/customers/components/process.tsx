import Image from 'next/image'

const steps = [
  {
    number: '01',
    title: 'Customize and Request',
    description: [
      'Buyers browse available cakes from a vendor and select customization options (size, flavor, etc.).',
      'The customization details are submitted as a request to the vendor for review',
    ],
    image: '/assets/images/process-1.svg',
    imageClassName: 'translate-y-12 md:translate-x-12',
  },
  {
    number: '02',
    title: 'Vendor Approval and Payment',
    description: [
      'The vendor reviews the request, confirms availability, and accepts the order, buyers are notified and proceed to make payment securely through the platform.',
    ],
    image: '/assets/images/process-2.svg',
    imageClassName: '-translate-y-24 md:translate-x-8',
  },
  {
    number: '03',
    title: 'Fulfillment and Delivery',
    description: [
      "The vendor prepares the cake and arranges delivery to the buyer's or recipient's address. Delivery status is updated, and buyers receive confirmation once the cake is delivered.",
    ],
    image: '/assets/images/process-3.svg',
    imageClassName: 'translate-y-0',
  },
]

const ProcessSimplified = () => {
  return (
    <section className='py-16 bg-white'>
      <div className='container mx-auto px-4'>
        <div className='mb-12'>
          <h2 className='text-4xl font-bold text-primary'>Memo process</h2>
          <p className='text-3xl text-[#4A2B29]'>Simplified</p>
        </div>

        <div className='relative'>
          {/* Timeline line */}
          <div className='absolute left-[2.75rem] top-0 bottom-0 w-[1px] bg-gray-200/50 md:left-[3.75rem]' />

          <div className='space-y-32'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='relative grid md:grid-cols-[45%_55%] items-start gap-8'
              >
                {/* Left content */}
                <div className='relative'>
                  <div className='flex gap-8 md:gap-14'>
                    <div className='relative'>
                      <div className='sticky top-0 flex h-12 w-12 items-center justify-center text-xl font-bold text-[#8B7355] md:h-16 md:w-16 md:text-2xl'>
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-[#4A2B29] mb-3 md:text-2xl'>
                        {step.title}
                      </h3>
                      <div className='space-y-2'>
                        {step.description.map((text, idx) => (
                          <p
                            key={idx}
                            className='text-gray-600 leading-relaxed'
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right image */}
                <div className={`relative ${step.imageClassName}`}>
                  <div className='relative aspect-[4/5] md:aspect-[5/4] overflow-hidden rounded-3xl'>
                    <Image
                      src={step.image || '/placeholder.svg'}
                      alt={step.title}
                      fill
                      className='object-cover'
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSimplified
