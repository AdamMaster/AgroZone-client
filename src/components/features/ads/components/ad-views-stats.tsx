'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Button,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Heading,
  Skeleton
} from '@/components/ui'

import { cn } from '@/lib/utils'

import { useAdViewStats } from '../hooks'

interface AdViewsStatsProps {
  adId: string
}

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const chartConfig = {
  views: {
    label: 'Просмотры',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

const formatShortDate = (isoDate: string) => {
  const [, month, day] = isoDate.split('-')
  return `${day}.${month}`
}

export const AdViewsStats = ({ adId }: AdViewsStatsProps) => {
  const [weekOffset, setWeekOffset] = useState(0)
  const { stats, isLoading, isFetching } = useAdViewStats(adId, weekOffset)

  const chartData = (stats?.days ?? []).map((day, index) => ({
    ...day,
    label: WEEKDAY_LABELS[index]
  }))

  const canGoBack = !stats || weekOffset < stats.maxWeekOffset
  const canGoForward = weekOffset > 0

  return (
    <div className='custom-shadow mb-8 rounded-3xl bg-white p-6'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <Heading level={4}>Статистика за неделю</Heading>

        <div className='flex items-center gap-1'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-8'
            disabled={!canGoBack || isLoading}
            onClick={() => setWeekOffset(prev => prev + 1)}
            aria-label='Предыдущая неделя'
          >
            <ChevronLeft className='size-4' />
          </Button>
          <span className='min-w-[100px] text-center text-sm text-gray-500'>
            {stats ? `${formatShortDate(stats.weekStart)} – ${formatShortDate(stats.weekEnd)}` : ' '}
          </span>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='size-8'
            disabled={!canGoForward || isLoading}
            onClick={() => setWeekOffset(prev => Math.max(prev - 1, 0))}
            aria-label='Следующая неделя'
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>

      <p className='mb-4 text-sm text-gray-500'>
        Просмотры за неделю: <span className='text-lg font-semibold text-gray-900'>{stats?.total ?? 0}</span>
      </p>

      {isLoading ? (
        <Skeleton className='h-[220px] w-full rounded-xl' />
      ) : (
        <ChartContainer
          config={chartConfig}
          className={cn('aspect-auto h-[280px] w-full transition-opacity', isFetching && 'opacity-50')}
        >
          <BarChart data={chartData} barCategoryGap={20}>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis dataKey='label' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} tickMargin={4} />
            <ChartTooltip
              cursor={false}
              isAnimationActive={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => formatShortDate(payload?.[0]?.payload?.date ?? '')}
                />
              }
            />
            {/* activeBar={false} — без этого recharts на клике/наведении
                подменяет столбец своей дефолтной Rectangle с чёрной заливкой
                поверх нашего цвета (родной "баг" recharts, не связан с
                cursor у Tooltip). Выключаем подмену совсем — цвет столбца
                не должен меняться при взаимодействии. */}
            <Bar maxBarSize={50} dataKey='views' fill='#bed9ff' radius={[6, 6, 0, 0]} activeBar={false} />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
