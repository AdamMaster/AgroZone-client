'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'

export function TanstackQueryProvider({ children }: PropsWithChildren<unknown>) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          // 1. Убираем фокус (у тебя уже есть)
          refetchOnWindowFocus: false,

          // 2. Ставим 0, чтобы данные всегда считались "протухшими"
          // и запрос улетал сразу при монтировании компонента
          staleTime: 0,

          // 3. Выключаем ретраи (повторные попытки) на время отладки.
          // Если есть ошибка (401 или CORS), ты увидишь её МГНОВЕННО,
          // а не через 30 секунд ожидания.
          retry: false,

          // 4. Если интернет подтупливает в докере, это не даст запросу "зависнуть"
          networkMode: 'always'
        },
        mutations: {
          retry: false
        }
      }
    })
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
