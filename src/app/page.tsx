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
import { WhoCards } from '@/components/sections/WhoCards';
import { ProductSection } from '@/components/landing/ProductSection';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import { CreatorDashboard } from '@/components/sections/CreatorDashboard';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { FinalCta } from '@/components/sections/FinalCta';
import { LiveMarketProvider, useLiveMarket } from '@/hooks/useLiveMarket';

function LandingContent() {
  const { eggPrice, eggChg24 } = useLiveMarket();

  return (
    <>
      <Header currentPath="/" />
      
      {/* 1. Hero */}
      <Hero eggPrice={eggPrice} eggChg24={eggChg24} />

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

      {/* 9. Market Types */}
      <MarketTables />

      {/* 10. Who it's for */}
      <WhoCards />

      {/* 11. Product */}
      <ProductSection />

      {/* 12. Why Dexetera */}
      <ComparisonTable />

      {/* 13. Creators earn */}
      <CreatorDashboard />

      {/* 14. FAQ */}
      <FaqAccordion />

      {/* 15. Final CTA */}
      <FinalCta />

      {/* 16. Footer */}
      <Footer />
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
