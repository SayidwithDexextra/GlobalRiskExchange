'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/hero/Hero';
import { Ticker } from '@/components/sections/Ticker';
import { StatStrip } from '@/components/sections/StatStrip';
import { TrustRow } from '@/components/sections/TrustRow';
import { MarketWall } from '@/components/sections/MarketWall';
import { RiskNetwork } from '@/components/sections/RiskNetwork';
import { Stepper } from '@/components/sections/Stepper';
import { GpuExample } from '@/components/sections/GpuExample';
import { MarketTables } from '@/components/sections/MarketTables';
import WhoItsFor from '@/components/sections/WhoItsFor';
import { ProductSection } from '@/components/landing/ProductSection';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import CreatorsEarn from '@/components/sections/CreatorsEarn';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FinalCta } from '@/components/sections/FinalCta';
import { LiveMarketProvider, useLiveMarket } from '@/hooks/useLiveMarket';
import { FilmCard } from '@/components/film/FilmCard';

function LandingContent() {
  const { eggPrice } = useLiveMarket();

  return (
    <>
      <Header currentPath="/" />
      
      {/* Phones see the creator section earlier (right after the GPU example), since most
          phone visitors never scroll far enough to reach it. Desktop order is unchanged. */}
      <div className="flex flex-col">
        <div>
          {/* 1. Hero */}
          <Hero eggPrice={eggPrice} />

          {/* 2-4. Ticker / Stats / Trust */}
          <Ticker />
          <StatStrip />
          <TrustRow />

          {/* 5. Market wall */}
          <MarketWall />

          {/* 6. Problem / Network */}
          <RiskNetwork />

          {/* 7. How it works */}
          <Stepper />

          {/* 8. GPU Example */}
          <GpuExample />
        </div>

        {/* 13. Creators earn (moves up to here on phones) */}
        <div className="max-md:order-1 md:order-3">
          <CreatorsEarn />
        </div>

        <div className="order-2">
          {/* 9. Market Types */}
          <MarketTables />

          {/* 10. Who it's for */}
          <WhoItsFor />

          {/* 11. Product */}
          <ProductSection />

          {/* 12. Why Dexetera */}
          <ComparisonTable />
        </div>

        <div className="order-4">
          {/* 14. FAQ */}
          <FaqAccordion />

          {/* 15. Final CTA */}
          <FinalCta />

          {/* 16. Footer */}
          <Footer />
        </div>
      </div>

      {/* Floating film card (bottom right, after the hero) */}
      <FilmCard />
    </>
  );
}

export default function Home() {
  return (
    <LiveMarketProvider>
      <LandingContent />
    </LiveMarketProvider>
  );
}
