import { Skeleton } from '@/components/ui'

export const AdShortCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-4 md:flex-row'>
      <div className='flex gap-4'>
        <Skeleton className='relative flex h-24 w-32 flex-shrink-0 rounded-lg md:h-30 md:w-40' />

        <div className='flex flex-grow flex-col'>
          <Skeleton className='mb-2 h-5 w-35 rounded-lg' />
          <Skeleton className='mb-3 h-5 w-20 rounded-lg' />
          <Skeleton className='h-5 w-full rounded-lg' />
        </div>
      </div>

      <div className='flex w-full flex-col gap-2 md:w-48'>
        <Skeleton className='h-10 rounded-lg' />
        <Skeleton className='h-10 rounded-lg' />
      </div>
    </div>
  )
}
