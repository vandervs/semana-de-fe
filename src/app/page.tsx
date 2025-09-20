import dynamic from 'next/dynamic';
import { mockInitiatives } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const MapDisplay = dynamic(() => import('@/components/map-display'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
  });

  const initiatives = mockInitiatives;

  return (
    <section className="container flex-1 py-6">
       <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block font-headline text-4xl font-bold tracking-tight lg:text-5xl">
              Initiatives Map
            </h1>
            <p className="text-xl text-muted-foreground">
              See the gospel spreading across Southeast Brazil.
            </p>
          </div>
        </div>
        <div className="mt-8 h-[60vh] w-full rounded-lg border bg-card shadow-lg overflow-hidden md:h-[70vh]">
            <MapDisplay initiatives={initiatives} />
        </div>
    </section>
  );
}
