import { Heading } from '@/components/ui'

interface AuthMessageProps {
  heading: string
  text: string
}

export const AuthMessage = ({ heading, text }: AuthMessageProps) => {
  return (
    <div className='text-center'>
      <Heading level={2} className='my-2'>
        {heading}
      </Heading>
      <p className='text-gray-500'>{text}</p>
    </div>
  )
}
