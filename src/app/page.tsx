'use client';

import { useState } from 'react';
import Header from '@/src/components/Header';
import HeroSection from '@/src/components/HeroSection';
import Simulator from '@/src/components/Simulator';
import Footer from '@/src/components/Footer';
import { SimulationData } from '@/src/lib/types';


export default function HomePage() {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    price: 250000,
    surface: 50,
    rooms: 't2',
    exploitationType: 'long',
    city: 'paris'
  });

  return (
    <>
      <Header />
      <HeroSection />
      <Simulator 
        simulationData={simulationData}
        setSimulationData={setSimulationData}
      />
      <Footer />
    </>
  );
}