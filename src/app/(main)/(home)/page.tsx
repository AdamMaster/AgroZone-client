import { HomeAdsFeed, HomeLocationPicker } from '@/components/features/home/components'
import { Container } from '@/components/layout'

export default async function Home() {
  return (
    <div className='pt-0 sm:pt-4'>
      <Container>
        <HomeAdsFeed />
      </Container>
    </div>
  )
}
