import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const base = "bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-open:zoom-in-100 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-100 fixed top-1/2 left-1/2 z-100 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 text-sm duration-100 outline-none"
const override = "data-open:slide-in-from-bottom data-closed:slide-out-to-bottom top-12 right-0 bottom-0 left-0 flex max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-t-2xl rounded-b-none p-0 duration-200"

console.log(cn(base, override))
