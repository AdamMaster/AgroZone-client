'use client'

import Link from 'next/link'

import { Button, Heading } from '@/components/ui'

import { AD_REPORT_REASON_LABELS } from '@/shared/constants/ad-report-reasons'

import { useAdminReports, useUpdateReportStatus } from '../hooks'
import { AdReportStatus } from '../types/admin.types'

const STATUS_LABELS: Record<AdReportStatus, string> = {
  [AdReportStatus.Pending]: 'Новая',
  [AdReportStatus.Reviewed]: 'Рассмотрена',
  [AdReportStatus.Dismissed]: 'Отклонена'
}

export const ReportsQueue = () => {
  const { reports, isLoading } = useAdminReports()
  const { updateReportStatus, isUpdating } = useUpdateReportStatus()

  return (
    <div>
      <Heading level={2} className='mb-6'>
        Жалобы на объявления
      </Heading>

      {isLoading && <p className='text-sm text-gray-400'>Загрузка...</p>}

      {!isLoading && reports.length === 0 && <p className='text-sm text-gray-500'>Жалоб пока нет.</p>}

      <div className='flex flex-col gap-3'>
        {reports.map(report => (
          <div key={report.id} className='flex items-start gap-4 rounded-xl border p-4'>
            <div className='min-w-0 flex-1'>
              <div className='mb-1 flex items-center gap-2'>
                <Link href={`/ads/${report.ad.id}`} target='_blank' className='hover:text-primary font-medium'>
                  {report.ad.title}
                </Link>
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600'>
                  {STATUS_LABELS[report.status]}
                </span>
              </div>
              <p className='text-sm text-gray-900'>{AD_REPORT_REASON_LABELS[report.reason]}</p>
              {report.comment && <p className='mt-1 text-sm text-gray-500'>{report.comment}</p>}
              <p className='mt-1 text-xs text-gray-400'>От: {report.user.displayName ?? 'Пользователь'}</p>
            </div>

            {report.status === AdReportStatus.Pending && (
              <div className='flex shrink-0 gap-2'>
                <Button
                  size='sm'
                  variant='outline'
                  disabled={isUpdating}
                  onClick={() => updateReportStatus({ id: report.id, status: AdReportStatus.Reviewed })}
                >
                  Рассмотрено
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  disabled={isUpdating}
                  onClick={() => updateReportStatus({ id: report.id, status: AdReportStatus.Dismissed })}
                >
                  Отклонить
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
