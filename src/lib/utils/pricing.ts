export interface ServicePricing {
  baseFee: number;
  distanceRate: number;
  serviceFee: number;
}

// Constants for pricing calculations
export const BASE_FEE = 2000; // Base fee covers first 5km
export const DISTANCE_RATE = 500; // NGN per km beyond first 5km
export const SERVICE_FEES = {
  towing: 5000,
  battery: 3500,
  tire: 2000,
  fuel: 1500,
  lockout: 2500
};

export interface PricingBreakdown {
  baseFee: number;
  distanceFee: number;
  serviceFee: number;
  total: number;
}

export function getPricingBreakdown(
  serviceType: string,
  distance: number
): PricingBreakdown {
  // 1. Base fee (always NGN 5,000, covers first 5km)
  const baseFee = BASE_FEE;

  // 2. Calculate additional distance fee (NGN 500 per km beyond first 5km)
  const additionalDistance = Math.max(0, distance - 5);
  const distanceFee = Math.round(additionalDistance * DISTANCE_RATE);

  // 3. Get service type fee (added to base fee)
  const serviceTypeFee = SERVICE_FEES[serviceType as keyof typeof SERVICE_FEES] || 0;

  // 4. Calculate total
  const total = baseFee + serviceTypeFee + distanceFee;

  return {
    baseFee,
    serviceFee: serviceTypeFee,
    distanceFee,
    total
  };
} 