import { forwardRef, type InputHTMLAttributes } from 'react'

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3 text-sm text-[#1A1614] placeholder:text-[#A39B8F] transition-all focus:border-[#1A1614] focus:ring-4 focus:ring-[#1A1614]/5 ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'