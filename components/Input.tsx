import { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLImageElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, disabled, type, ...props }, ref) => {
    return (
      <input
        className={twMerge(
          ` flex rounded-md w-full border border-transparent px-3 py-3 text-sm file:border-0 file:bg-transparent file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed focus:outline-none `,
          className
        )}
        type={type}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
export default Input