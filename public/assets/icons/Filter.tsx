import React from 'react'

export const Filter = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      className='md:hidden pb-3'
      width='40'
      height='40'
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M6 9.66669H26M9.84667 16H22.1533M13.6933 22.3334H18.3067'
        stroke='black'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}
