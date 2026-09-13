export interface CityLocation {
  id: string;
  name: string;
  district: string;
  division?: string;
  province: 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan' | 'Islamabad' | 'Gilgit-Baltistan' | 'Azad Jammu & Kashmir';
  latitude: number;
  longitude: number;
  isActive: boolean;
}

// Curated list of 36 major, genuine Pakistani cities
export const MAJOR_PAKISTAN_CITIES_FULL: CityLocation[] = [
  { id: 'city-karachi', name: 'Karachi', district: 'Karachi', division: 'Karachi', province: 'Sindh', latitude: 24.8607, longitude: 67.0011, isActive: true },
  { id: 'city-lahore', name: 'Lahore', district: 'Lahore', division: 'Lahore', province: 'Punjab', latitude: 31.5204, longitude: 74.3587, isActive: true },
  { id: 'city-islamabad', name: 'Islamabad', district: 'Islamabad', division: 'Islamabad', province: 'Islamabad', latitude: 33.6844, longitude: 73.0479, isActive: true },
  { id: 'city-rawalpindi', name: 'Rawalpindi', district: 'Rawalpindi', division: 'Rawalpindi', province: 'Punjab', latitude: 33.5651, longitude: 73.0169, isActive: true },
  { id: 'city-faisalabad', name: 'Faisalabad', district: 'Faisalabad', division: 'Faisalabad', province: 'Punjab', latitude: 31.4504, longitude: 73.1350, isActive: true },
  { id: 'city-multan', name: 'Multan', district: 'Multan', division: 'Multan', province: 'Punjab', latitude: 30.1575, longitude: 71.5249, isActive: true },
  { id: 'city-peshawar', name: 'Peshawar', district: 'Peshawar', division: 'Peshawar', province: 'Khyber Pakhtunkhwa', latitude: 34.0151, longitude: 71.5249, isActive: true },
  { id: 'city-quetta', name: 'Quetta', district: 'Quetta', division: 'Quetta', province: 'Balochistan', latitude: 30.1798, longitude: 66.9750, isActive: true },
  { id: 'city-gujranwala', name: 'Gujranwala', district: 'Gujranwala', division: 'Gujranwala', province: 'Punjab', latitude: 32.1877, longitude: 74.1945, isActive: true },
  { id: 'city-sialkot', name: 'Sialkot', district: 'Sialkot', division: 'Gujranwala', province: 'Punjab', latitude: 32.4945, longitude: 74.5229, isActive: true },
  { id: 'city-hyderabad', name: 'Hyderabad', district: 'Hyderabad', division: 'Hyderabad', province: 'Sindh', latitude: 25.3960, longitude: 68.3578, isActive: true },
  { id: 'city-sukkur', name: 'Sukkur', district: 'Sukkur', division: 'Sukkur', province: 'Sindh', latitude: 27.7052, longitude: 68.8574, isActive: true },
  { id: 'city-bahawalpur', name: 'Bahawalpur', district: 'Bahawalpur', division: 'Bahawalpur', province: 'Punjab', latitude: 29.3544, longitude: 71.6911, isActive: true },
  { id: 'city-sargodha', name: 'Sargodha', district: 'Sargodha', division: 'Sargodha', province: 'Punjab', latitude: 32.0836, longitude: 72.6711, isActive: true },
  { id: 'city-abbottabad', name: 'Abbottabad', district: 'Abbottabad', division: 'Hazara', province: 'Khyber Pakhtunkhwa', latitude: 34.1688, longitude: 73.2215, isActive: true },
  { id: 'city-mardan', name: 'Mardan', district: 'Mardan', division: 'Mardan', province: 'Khyber Pakhtunkhwa', latitude: 34.1986, longitude: 72.0404, isActive: true },
  { id: 'city-mingora', name: 'Mingora', district: 'Swat', division: 'Malakand', province: 'Khyber Pakhtunkhwa', latitude: 34.7717, longitude: 72.3600, isActive: true },
  { id: 'city-rahim-yar-khan', name: 'Rahim Yar Khan', district: 'Rahim Yar Khan', division: 'Bahawalpur', province: 'Punjab', latitude: 28.4212, longitude: 70.2989, isActive: true },
  { id: 'city-larkana', name: 'Larkana', district: 'Larkana', division: 'Larkana', province: 'Sindh', latitude: 27.5580, longitude: 68.2120, isActive: true },
  { id: 'city-nawabshah', name: 'Nawabshah', district: 'Shaheed Benazirabad', division: 'Shaheed Benazirabad', province: 'Sindh', latitude: 26.2483, longitude: 68.4096, isActive: true },
  { id: 'city-mirpur-khas', name: 'Mirpur Khas', district: 'Mirpur Khas', division: 'Mirpur Khas', province: 'Sindh', latitude: 25.5269, longitude: 69.0111, isActive: true },
  { id: 'city-gujrat', name: 'Gujrat', district: 'Gujrat', division: 'Gujrat', province: 'Punjab', latitude: 32.5742, longitude: 74.0754, isActive: true },
  { id: 'city-jhelum', name: 'Jhelum', district: 'Jhelum', division: 'Rawalpindi', province: 'Punjab', latitude: 32.9405, longitude: 73.7276, isActive: true },
  { id: 'city-kasur', name: 'Kasur', district: 'Kasur', division: 'Lahore', province: 'Punjab', latitude: 31.1179, longitude: 74.4484, isActive: true },
  { id: 'city-sheikhupura', name: 'Sheikhupura', district: 'Sheikhupura', division: 'Lahore', province: 'Punjab', latitude: 31.7131, longitude: 73.9783, isActive: true },
  { id: 'city-okara', name: 'Okara', district: 'Okara', division: 'Sahiwal', province: 'Punjab', latitude: 30.8100, longitude: 73.4500, isActive: true },
  { id: 'city-sahiwal', name: 'Sahiwal', district: 'Sahiwal', division: 'Sahiwal', province: 'Punjab', latitude: 30.6682, longitude: 73.1114, isActive: true },
  { id: 'city-dera-ghazi-khan', name: 'Dera Ghazi Khan', district: 'Dera Ghazi Khan', division: 'Dera Ghazi Khan', province: 'Punjab', latitude: 30.0561, longitude: 70.6348, isActive: true },
  { id: 'city-wah-cantt', name: 'Wah Cantt', district: 'Rawalpindi', division: 'Rawalpindi', province: 'Punjab', latitude: 33.7715, longitude: 72.7511, isActive: true },
  { id: 'city-taxila', name: 'Taxila', district: 'Rawalpindi', division: 'Rawalpindi', province: 'Punjab', latitude: 33.7463, longitude: 72.8397, isActive: true },
  { id: 'city-attock', name: 'Attock', district: 'Attock', division: 'Rawalpindi', province: 'Punjab', latitude: 33.7667, longitude: 72.3583, isActive: true },
  { id: 'city-muzaffarabad', name: 'Muzaffarabad', district: 'Muzaffarabad', division: 'Muzaffarabad', province: 'Azad Jammu & Kashmir', latitude: 34.3700, longitude: 73.4700, isActive: true },
  { id: 'city-gilgit', name: 'Gilgit', district: 'Gilgit', division: 'Gilgit', province: 'Gilgit-Baltistan', latitude: 35.9208, longitude: 74.3089, isActive: true },
  { id: 'city-skardu', name: 'Skardu', district: 'Skardu', division: 'Baltistan', province: 'Gilgit-Baltistan', latitude: 35.2971, longitude: 75.6333, isActive: true },
  { id: 'city-gwadar', name: 'Gwadar', district: 'Gwadar', division: 'Makran', province: 'Balochistan', latitude: 25.1264, longitude: 62.3225, isActive: true },
  { id: 'city-turbat', name: 'Turbat', district: 'Kech', division: 'Makran', province: 'Balochistan', latitude: 26.0022, longitude: 63.0440, isActive: true },
];

// Deduplicated and sorted alphabetically for standard select views
export const PAKISTAN_CITIES_FULL: CityLocation[] = [...MAJOR_PAKISTAN_CITIES_FULL].sort((a, b) =>
  a.name.localeCompare(b.name),
);

// Backward compatibility alias for backend/internal consumers if needed
export const RAW_PAKISTAN_CITIES_FULL = PAKISTAN_CITIES_FULL;

// Flat list of all 36 major city names sorted alphabetically
export const PAKISTAN_CITIES: string[] = PAKISTAN_CITIES_FULL.map((c) => c.name);

// Top 8 popular cities for fast pick pills in search modal
export const POPULAR_CITIES: string[] = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sukkur',
  'Hyderabad',
];

// Total cities count
export const TOTAL_CITIES_COUNT = PAKISTAN_CITIES.length;
