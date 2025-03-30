import React, { createContext, useContext, useState } from 'react';

interface SensorData {
  soilMoisture: string;
  co2Level: string;
  lightIntensity: string;
  airFlow: string;
}

interface Activity {
  date: string;
  action: string;
  status: string;
}

interface Greenhouse {
  id: string;
  name: string;
  crop: string;
  health: string;
  temperature: string;
  humidity: string;
  nextHarvest: string;
  plantedDate: string;
  expectedYield: string;
  currentStage: string;
  automationStatus: string;
  sensors: SensorData;
  recentActivity: Activity[];
}

interface GreenhouseContextType {
  greenhouses: Greenhouse[];
  addGreenhouse: (greenhouse: Greenhouse) => void;
}

const initialGreenhouses: Greenhouse[] = [
  {
    id: '1',
    name: 'Greenhouse 1',
    crop: 'Tomatoes',
    health: 'Good',
    temperature: '23°C',
    humidity: '60%',
    nextHarvest: '3 days',
    plantedDate: '2024-01-15',
    expectedYield: '3,500 kg',
    currentStage: 'Flowering',
    automationStatus: 'Active',
    sensors: {
      soilMoisture: '75%',
      co2Level: '405 ppm',
      lightIntensity: '850 lux',
      airFlow: '3.5 m/s'
    },
    recentActivity: [
      { date: '2024-02-22', action: 'Irrigation Cycle', status: 'Completed' },
      { date: '2024-02-21', action: 'Fertilizer Application', status: 'Completed' },
      { date: '2024-02-20', action: 'Temperature Adjustment', status: 'Completed' }
    ]
  },
  {
    id: '2',
    name: 'Greenhouse 2',
    crop: 'Lettuce',
    health: 'Fair',
    temperature: '21°C',
    humidity: '55%',
    nextHarvest: '5 days',
    plantedDate: '2024-01-20',
    expectedYield: '2,800 kg',
    currentStage: 'Growing',
    automationStatus: 'Active',
    sensors: {
      soilMoisture: '68%',
      co2Level: '398 ppm',
      lightIntensity: '780 lux',
      airFlow: '3.2 m/s'
    },
    recentActivity: [
      { date: '2024-02-22', action: 'Watering', status: 'Completed' },
      { date: '2024-02-21', action: 'Pest Control', status: 'Completed' },
      { date: '2024-02-20', action: 'Ventilation Check', status: 'Completed' }
    ]
  }
];

const GreenhouseContext = createContext<GreenhouseContextType>({
  greenhouses: initialGreenhouses,
  addGreenhouse: () => {}
});

export function GreenhouseProvider({ children }: { children: React.ReactNode }) {
  const [greenhouses, setGreenhouses] = useState<Greenhouse[]>(initialGreenhouses);

  const addGreenhouse = (greenhouse: Greenhouse) => {
    setGreenhouses(prev => [...prev, greenhouse]);
  };

  return (
    <GreenhouseContext.Provider value={{ greenhouses, addGreenhouse }}>
      {children}
    </GreenhouseContext.Provider>
  );
}

export function useGreenhouse() {
  const context = useContext(GreenhouseContext);
  if (!context) {
    throw new Error('useGreenhouse must be used within a GreenhouseProvider');
  }
  return context;
} 