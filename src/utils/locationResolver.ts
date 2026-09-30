// Location Name Resolver for GramSetu
// Replaces raw lat/lng coordinates across all maps, cards, and forms with human-friendly Location Names

export interface KnownLandmark {
  name: string;
  panchayat: string;
  lat: number;
  lng: number;
}

export const KNOWN_LANDMARKS: KnownLandmark[] = [
  { name: 'Ward 3 • Rampur Gram Panchayat', panchayat: 'Rampur Panchayat', lat: 23.2045, lng: 77.0812 },
  { name: 'Sector 15 Central Road • Sehore Town', panchayat: 'Rampur Panchayat', lat: 23.2018, lng: 77.0895 },
  { name: 'Shyampur Feeder • Pole #81', panchayat: 'Shyampur Panchayat', lat: 23.2125, lng: 77.0988 },
  { name: 'Gram Mandi Gate #2 • Rampur', panchayat: 'Rampur Panchayat', lat: 23.2080, lng: 77.0780 },
  { name: 'Mathura Road Market • Bilkisganj', panchayat: 'Bilkisganj Panchayat', lat: 23.1950, lng: 77.0650 },
  { name: 'Doraha Market Road • Sehore', panchayat: 'Doraha Panchayat', lat: 23.2200, lng: 77.1100 },
  { name: 'Panchayat Bhavan • Rampur Center', panchayat: 'Rampur Panchayat', lat: 23.2030, lng: 77.0840 },
  { name: 'Primary Health Centre (PHC) • Ward 2', panchayat: 'Rampur Panchayat', lat: 23.2060, lng: 77.0870 },
  { name: 'Government Higher Secondary School Ground', panchayat: 'Rampur Panchayat', lat: 23.2010, lng: 77.0790 },
];

/**
 * Returns a human-friendly location name for any coordinates
 */
export function getFriendlyLocationName(coords?: [number, number] | { lat: number; lng: number } | null): string {
  if (!coords) return 'Ward 3 • Rampur Gram Panchayat';
  
  const lat = Array.isArray(coords) ? coords[0] : coords.lat;
  const lng = Array.isArray(coords) ? coords[1] : coords.lng;

  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return 'Ward 3 • Rampur Gram Panchayat';
  }

  // Find closest known landmark within 1.5 km
  let closest: KnownLandmark | null = null;
  let minDistance = Infinity;

  for (const landmark of KNOWN_LANDMARKS) {
    const dLat = (lat - landmark.lat);
    const dLng = (lng - landmark.lng);
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = landmark;
    }
  }

  // If reasonably close to a known landmark (~0.02 deg ~ 2 km)
  if (closest && minDistance < 0.0004) {
    return closest.name;
  }

  // Otherwise, synthesize a meaningful ward location name based on orientation relative to Rampur center
  const centerLat = 23.2045;
  const centerLng = 77.0812;
  const deltaLat = lat - centerLat;
  const deltaLng = lng - centerLng;

  let sector = 'Ward 3';
  if (deltaLat > 0.005) {
    sector = deltaLng > 0 ? 'North-East Sector (Ward 5)' : 'North Sector (Ward 4)';
  } else if (deltaLat < -0.005) {
    sector = deltaLng > 0 ? 'South-East Sector (Ward 2)' : 'South Sector (Ward 1)';
  } else {
    sector = deltaLng > 0 ? 'East Central (Ward 6)' : 'West Sector (Ward 3)';
  }

  return `${sector} • Rampur Gram Panchayat`;
}

/**
 * Reverse geocode coordinates to an address asynchronously using OpenStreetMap Nominatim
 */
export async function reverseGeocodeAsync(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const main = addr.village || addr.suburb || addr.neighbourhood || addr.road || addr.town || addr.county || 'Ward Area';
        const district = addr.state_district || addr.state || 'Sehore';
        return `${main} • ${district}`;
      }
    }
  } catch (err) {
    // Ignore fetch failure and use fallback
  }
  return getFriendlyLocationName([lat, lng]);
}
