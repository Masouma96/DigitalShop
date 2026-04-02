import * as React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Card,
  CardContent,
} from '@/components/ui';
import Image from 'next/image';

import IMG1 from './images/1.jpg';
import IMG2 from './images/2.jpg';
import IMG3 from './images/3.png';
import IMG4 from './images/4.jpg';
// import IMG5 from './images/5.webp';
export function Banner() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent className="w-full">
        {[IMG1, IMG2, IMG3, IMG4].map((image, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className=" p-0 ">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={image}
                      alt="banner"
                      fill
                      className="object-cover "
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
