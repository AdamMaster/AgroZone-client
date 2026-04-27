import { useMutation } from '@tanstack/react-query'

import { emailChangeService } from '../services/email-change.service'

export function useChangeEmailMutation() {
  const { mutate: changeEmail, isPending: isChangeEmailLoading } = useMutation({
    mutationKey: ['change email request'],

    mutationFn: (values: { newEmail: string; password?: string }) => emailChangeService.request(values)
  })

  return { changeEmail, isChangeEmailLoading }
}
