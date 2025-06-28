
import { TideStatus } from '@/types/tidal';

export const getTideStatus = (currentTide: any, nextTide: any): TideStatus => {
  if (!currentTide || !nextTide) return 'stable';
  
  if (currentTide.tide_type === 'low' && nextTide.tide_type === 'high') {
    return 'rising';
  } else if (currentTide.tide_type === 'high' && nextTide.tide_type === 'low') {
    return 'falling';
  }
  return 'stable';
};

export const locations = {
  Current: [
    { name: 'current', label: 'Lokasi Saat Ini' }
  ],
  Indonesia: [
    { name: 'Jakarta Bay', label: 'Jakarta Bay' },
    { name: 'Surabaya Port', label: 'Pelabuhan Surabaya' },
    { name: 'Medan Port', label: 'Pelabuhan Medan' },
    { name: 'Makassar Port', label: 'Pelabuhan Makassar' },
    { name: 'Batam Port', label: 'Pelabuhan Batam' }
  ],
  Malaysia: [
    { name: 'Port Klang', label: 'Port Klang' },
    { name: 'Penang Port', label: 'Pelabuhan Penang' },
    { name: 'Johor Port', label: 'Pelabuhan Johor' }
  ],
  Singapore: [
    { name: 'Singapore Port', label: 'Pelabuhan Singapore' }
  ],
  Thailand: [
    { name: 'Bangkok Port', label: 'Pelabuhan Bangkok' },
    { name: 'Phuket Port', label: 'Pelabuhan Phuket' }
  ]
};
