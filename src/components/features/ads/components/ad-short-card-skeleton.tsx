import { Skeleton } from '@/components/ui'

export const AdShortCardSkeleton = () => {
  return (
    <div className='flex gap-4'>
      <Skeleton className='relative flex h-30 w-35 flex-shrink-0 rounded-lg' />

      <div className='flex flex-grow flex-col'>
        <Skeleton className='mb-2 h-5 w-35 rounded-lg' />
        <Skeleton className='mb-3 h-5 w-20 rounded-lg' />
        <Skeleton className='h-5 w-full rounded-lg' />
      </div>

      <div className='flex w-48 flex-col gap-2'>
        <Skeleton className='h-10 rounded-lg' />
        <Skeleton className='h-10 rounded-lg' />
      </div>
    </div>
  )
}
