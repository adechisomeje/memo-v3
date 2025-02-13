import Image from 'next/image'

const ProcessSimplified = () => {
  return (
    <section className='py-16 bg-[#FDFCFB]'>
      <div className='container mx-auto px-4 py-12 md:py-24'>
        <div className='grid md:grid-cols-2 gap-8 items-start'>
          {/* Left Column - Process Steps */}
          <div className='space-y-12'>
            <div>
              <h1 className='text-xl md:text-4xl font-bold text-primary mb-5'>
                Memo process Simplified
              </h1>
            </div>

            <div className='space-y-12'>
              {/* Step 1 */}
              <div className='relative pl-12'>
                <span className='absolute left-0 font-bold text-[#675E48] text-xl'>
                  01
                </span>
                <div className='space-y-4'>
                  <h3 className='text-xl lg:text-2xl font-bold text-[#675E48]'>
                    Customize and Request
                  </h3>
                  <p className='text-[#675E48]'>
                    Buyers browse available cakes from a vendor and select
                    customization options (size, flavor, etc.).
                  </p>
                  <p className='text-[#675E48]'>
                    The customization details are submitted as a request to the
                    vendor for review
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className='relative pl-12'>
                <span className='absolute left-0 font-bold text-[#675E48] text-xl'>
                  02
                </span>
                <div className='space-y-4'>
                  <h3 className='text-xl lg:text-2xl font-bold text-[#675E48]'>
                    Vendor Approval and Payment
                  </h3>
                  <p className='text-[#675E48]'>
                    The vendor reviews the request, confirms availability, and
                    accepts the order, buyers are notified and proceed to make
                    payment securely through the platform.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className='relative pl-12'>
                <span className='absolute left-0 font-bold text-[#675E48] text-xl'>
                  03
                </span>
                <div className='space-y-4'>
                  <h3 className='text-xl lg:text-2xl font-bold text-[#675E48]'>
                    Fulfillment and Delivery
                  </h3>
                  <p className='text-[#675E48]'>
                    The vendor prepares the cake and arranges delivery to the
                    buyer&apos;s or recipient&apos;s address. Delivery status is
                    updated, and buyers receive confirmation once the cake is
                    delivered.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Single Grouped Image */}
          <div className='relative'>
            <div className=' rounded-3xl overflow-hidden'>
              <Image
                width={500}
                height={500}
                src='/assets/images/simp-group.png'
                alt='Grouped images showing the memo process'
                className='object-cover w-full h-full'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProcessSimplified
