import { HomeAdsFeed, HomeLocationPicker } from '@/components/features/home/components'
import { Container } from '@/components/layout'

export default async function Home() {
  return (
    <div>
      <Container>
        <HomeAdsFeed />
      </Container>
    </div>
  )
}
