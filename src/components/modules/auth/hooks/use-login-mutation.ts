import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils'

import { TypeLoginSchema } from '../schemes'
import { authService } from '../services'

export function useLoginMutation() {
  const router = useRouter()

  const { mutate: login, isPending: isLoadingLogin } = useMutation({
    mutationKey: ['login user'],

    mutationFn: ({ values, recaptcha }: { values: TypeLoginSchema; recaptcha: string }) =>
      authService.login(values, recaptcha),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess(data: any) {
      if (data.message) {
        toastMessageHandler(data)
      } else {
        toast.success('Авторизация прошла усешно!')
        router.push('/profile/settings')
      }
    },

    onError(error) {
      toastMessageHandler(error)
    }
  })

  return { login, isLoadingLogin }
}
