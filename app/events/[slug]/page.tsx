import { Suspense } from 'react'
import EventDetailsPage from './wa'
 
export default async function Postsasync ({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <EventDetailsPage params={params}/>
      </Suspense>

    </section>
  )
}