import axios from 'axios';

interface NominatimResult {
  lat: string;
  lon: string;
}

export const forwardGeocode = async (query: string) => {
  const { data } = await axios.get<NominatimResult[]>(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        format: 'json',
        q: query,
        countrycodes: 'ec',
        limit: 1,
      },
      headers: { 'Accept-Language': 'es' },
    },
  );

  const [first] = data;
  if (!first) return null;

  return { lat: Number(first.lat), lng: Number(first.lon) };
};
