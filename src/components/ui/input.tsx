import * as React from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const isPassword = type === 'password'

    const togglePassword = () => {
      setShowPassword((prev) => !prev)
    }

    return (
      <div className='relative w-full'>
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-[#919191]',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm',
            isPassword && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type='button'
            onClick={togglePassword}
            className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-black hover:text-gray-600 focus:outline-none'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4 text-gray-400' />
            ) : (
              <Eye className='h-4 w-4 text-gray-400' />
            )}
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
