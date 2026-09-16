import { forwardRef, type SelectHTMLAttributes } from 'react'

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className = '', children, ...props }, ref) => (
  <select
    ref={ref}
    className={`w-full bg-white border border-[#E8E1D6] rounded-xl px-4 py-3 text-sm text-[#1A1614] transition-all focus:border-[#1A1614] cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </select>
))
Select.displayName = 'Select'