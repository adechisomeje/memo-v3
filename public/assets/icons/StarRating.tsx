import React from 'react'

export const StarFill = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width='16'
      height='17'
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipPath='url(#clip0_2105_4698)'>
        <path
          d='M15.5 6.34688H9.775L8 0.796875L6.225 6.34688H0.5L5.125 9.77188L3.375 15.2969L8 11.8719L12.625 15.2969L10.85 9.74687L15.5 6.34688Z'
          fill='url(#paint0_linear_2105_4698)'
        />
      </g>
      <defs>
        <linearGradient
          id='paint0_linear_2105_4698'
          x1='7.5'
          y1='9.54688'
          x2='15.5'
          y2='9.54688'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#FFCE31' />
          <stop offset='1' stopColor='#997C1D' />
        </linearGradient>
        <clipPath id='clip0_2105_4698'>
          <rect
            width='16'
            height='16'
            fill='white'
            transform='translate(0 0.046875)'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export const StarEmpty = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      width='16'
      height='17'
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clipPath='url(#clip0_2547_870)'>
        <path
          d='M15.5 6.34688H9.775L8 0.796875L6.225 6.34688H0.5L5.125 9.77188L3.375 15.2969L8 11.8719L12.625 15.2969L10.85 9.74687L15.5 6.34688Z'
          fill='url(#paint0_linear_2547_870)'
        />
      </g>
      <defs>
        <linearGradient
          id='paint0_linear_2547_870'
          x1='7.5'
          y1='9.54688'
          x2='15.5'
          y2='9.54688'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#B99E48' stop-opacity='0.46' />
          <stop offset='1' stopColor='#352B0C' stop-opacity='0.37' />
        </linearGradient>
        <clipPath id='clip0_2547_870'>
          <rect
            width='16'
            height='16'
            fill='white'
            transform='translate(0 0.046875)'
          />
        </clipPath>
      </defs>
    </svg>
  )
}
