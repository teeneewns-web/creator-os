import type { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'subtle'
}

export function Card({
  variant = 'default',
  className = '',
  ...props
}: Props) {
  const base = 'rounded-2xl'
  const variants = {
    default:
      'bg-white border border-[#E8E1D6] shadow-[0_1px_3px_rgba(26,22,20,0.04)]',
    subtle: 'bg-[#FBF0E9]/60 border border-[#E8E1D6]',
  }

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  )
}