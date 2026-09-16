import type { LabelHTMLAttributes } from 'react'

export function Label({
  className = '',
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-sm font-medium text-[#1A1614] mb-2 ${className}`}
      {...props}
    />
  )
}