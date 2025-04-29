const ABUJA_COORDINATES = {
  lat: 9.0579,
  lng: 7.4951
};

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI/180);
}

export async function getDistanceFromAbuja(destination: Location): Promise<number> {
  return calculateDistance(
    ABUJA_COORDINATES.lat,
    ABUJA_COORDINATES.lng,
    destination.lat,
    destination.lng
  );
}

export async function geocodeAddress(address: string): Promise<Location> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('No results found for this address');
    }

    return {
      address: data[0].display_name,
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
} 