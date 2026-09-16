import { forwardRef, type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#1A1614]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]'

const variants: Record<Variant, string> = {
  primary:
    'bg-[#1A1614] text-white hover:bg-[#2A2521] active:scale-[0.99] shadow-[0_1px_2px_rgba(26,22,20,0.08)]',
  secondary:
    'bg-white text-[#1A1614] border border-[#E8E1D6] hover:border-[#D4CBB9] hover:bg-[#FFFDFA] active:scale-[0.99]',
  accent:
    'bg-[#D97757] text-white hover:bg-[#C66846] active:scale-[0.99] shadow-[0_1px_2px_rgba(217,119,87,0.25)]',
  ghost:
    'text-[#6B6259] hover:text-[#1A1614] hover:bg-[#F5EFE6]',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
)
Button.displayName = 'Button'