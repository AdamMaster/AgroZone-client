import { AdsClient } from '@/components/features/ads/components'
import { Container } from '@/components/layout'

export default async function Home() {
  return (
    <div>
      <Container>
        <AdsClient />
      </Container>
    </div>
  )
}
