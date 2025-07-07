import type {
  BaseEntity,
  Coordinates,
  Address,
  Image,
  Money,
  CountryCode,
  URL,
  Timestamp
} from './common';
import type { PaymentMethod } from './payment';

export interface Location extends BaseEntity {
  name: string;
  type: LocationType;
  address: Address;
  coordinates: Coordinates;
  placeId?: string; // Google Places ID or similar
  description?: string;
  images: Image[];
  contactInfo?: ContactInfo;
  businessInfo?: BusinessInfo;
  amenities?: string[];
  tags: string[];
  rating?: Rating;
  popularTimes?: PopularTimes;
  nearbyPlaces?: NearbyPlace[];
  accessibility?: LocationAccessibility;
  safety?: SafetyInfo;
  timezone: string;
  locale: string;
  weatherInfo?: WeatherInfo;
}

export type LocationType =
  | 'restaurant'
  | 'hotel'
  | 'attraction'
  | 'museum'
  | 'park'
  | 'beach'
  | 'shopping'
  | 'entertainment'
  | 'transport'
  | 'airport'
  | 'train-station'
  | 'other';

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: URL;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface BusinessInfo {
  openingHours?: OpeningHours;
  priceLevel?: PriceLevel;
  reservationRequired?: boolean;
  reservationUrl?: URL;
  menu?: URL;
  cuisine?: string[]; // for restaurants
  features?: string[];
  paymentMethods?: PaymentMethod[];
  languages?: string[];
  dressCode?: DressCode;
  policies?: {
    cancellation?: string;
    children?: string;
    pets?: string;
    smoking?: string;
  };
}

export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';
export type DressCode = 'casual' | 'smart-casual' | 'business' | 'formal';


export interface OpeningHours {
  regular: DayHours[];
  exceptions?: ExceptionHours[];
  timezone: string;
  isOpen24Hours?: boolean;
  notes?: string;
}

export interface DayHours {
  dayOfWeek: number; // 0-6, Sunday-Saturday
  open: string; // "09:00"
  close: string; // "17:00"
  breaks?: Array<{
    start: string;
    end: string;
  }>;
}

export interface ExceptionHours {
  date: string; // YYYY-MM-DD
  open?: string;
  close?: string;
  isClosed: boolean;
  reason?: string;
}

export interface Rating {
  average: number; // e.g., 4.5
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  aspects?: {
    service?: number;
    quality?: number;
    value?: number;
    atmosphere?: number;
    cleanliness?: number;
    location?: number;
  };
}

export interface PopularTimes {
  monday: HourlyPopularity[];
  tuesday: HourlyPopularity[];
  wednesday: HourlyPopularity[];
  thursday: HourlyPopularity[];
  friday: HourlyPopularity[];
  saturday: HourlyPopularity[];
  sunday: HourlyPopularity[];
  timezone: string;
}

export interface HourlyPopularity {
  hour: number; // 0-23
  popularity: number; // 0-100
  waitTime?: number; // minutes
}

export interface NearbyPlace {
  place: Location;
  distance: number; // meters
  walkingTime?: number; // minutes
  drivingTime?: number; // minutes
  transitTime?: number; // minutes
  direction?: string; // "north", "south", etc.
}

export interface LocationAccessibility {
  wheelchairAccessible: AccessibilityLevel;
  entrance: AccessibilityLevel;
  parking: AccessibilityLevel;
  restroom: AccessibilityLevel;
  seating?: AccessibilityLevel;
  elevator?: boolean;
  braille?: boolean;
  audioGuide?: boolean;
  signLanguage?: boolean;
  notes?: string;
}

export type AccessibilityLevel = 'full' | 'partial' | 'none' | 'unknown';

export interface SafetyInfo {
  overallSafety: SafetyLevel;
  lightingAtNight: SafetyLevel;
  crowdedness: CrowdLevel;
  policePresence: boolean;
  commonScams?: string[];
  emergencyContacts?: EmergencyContact[];
  travelAdvisories?: string[];
  lastUpdated: Timestamp;
}

export type SafetyLevel = 'very-safe' | 'safe' | 'moderate' | 'use-caution' | 'avoid';
export type CrowdLevel = 'empty' | 'quiet' | 'moderate' | 'busy' | 'packed';

export interface EmergencyContact {
  service: string;
  number: string;
  available24Hours: boolean;
  languages?: string[];
}

export interface Destination extends BaseEntity {
  name: string;
  country: CountryCode;
  countryName: string;
  region?: string;
  city?: string;
  coordinates: Coordinates;
  timezone: string;
  description: string;
  images: Image[];
  highlights: string[];
  climate: Climate;
  bestTimeToVisit: SeasonalInfo[];
  languages: string[];
  currency: string;
  powerPlugType: string[];
  visaRequirements?: VisaRequirement[];
  vaccinations?: Vaccination[];
  attractions: Location[];
  statistics: DestinationStats;
  travelInfo: TravelInfo;
  culturalInfo: CulturalInfo;
  costOfLiving: CostOfLiving;
  connectivity: ConnectivityInfo;
  healthAndSafety: HealthAndSafety;
}

export interface Climate {
  type: ClimateType;
  seasons: Season[];
  averageTemperature: {
    summer: TemperatureRange;
    winter: TemperatureRange;
  };
  rainySeasonMonths?: number[];
  hurricaneSeasonMonths?: number[];
}

export type ClimateType =
  | 'tropical'
  | 'dry'
  | 'temperate'
  | 'continental'
  | 'polar'
  | 'mediterranean';

export interface Season {
  name: string;
  months: number[];
  temperature: TemperatureRange;
  rainfall: number; // mm
  humidity: number; // percentage
  description: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'celsius' | 'fahrenheit';
}

export interface SeasonalInfo {
  season: string;
  months: number[];
  pros: string[];
  cons: string[];
  events?: string[];
  crowdLevel: CrowdLevel;
  priceLevel: PriceLevel;
}

export interface VisaRequirement {
  nationality: CountryCode;
  type: VisaType;
  duration: number; // days
  cost?: Money;
  processingTime?: number; // days
  requirements?: string[];
  onArrival: boolean;
  eVisa: boolean;
}

export type VisaType = 'not-required' | 'on-arrival' | 'e-visa' | 'embassy' | 'schengen';

export interface Vaccination {
  disease: string;
  required: boolean;
  recommended: boolean;
  notes?: string;
}

export interface DestinationStats {
  area: number; // sq km
  population: number;
  populationDensity: number;
  elevation?: number; // meters
  coastline?: number; // km
  unesco: number; // UNESCO sites
  airports: number;
  yearlyVisitors?: number;
}

export interface TravelInfo {
  gettingThere: TransportOption[];
  gettingAround: TransportOption[];
  airports: Airport[];
  publicTransport: PublicTransport;
  taxiInfo: TaxiInfo;
  drivingInfo: DrivingInfo;
}

export interface TransportOption {
  mode: string;
  description: string;
  cost?: Money;
  duration?: number; // minutes
  frequency?: string;
  bookingRequired?: boolean;
  tips?: string[];
}

export interface Airport {
  code: string;
  name: string;
  distanceFromCity: number; // km
  transportOptions: TransportOption[];
}

export interface PublicTransport {
  types: string[];
  dayPass?: Money;
  weekPass?: Money;
  monthPass?: Money;
  operatingHours?: string;
  coverage: 'excellent' | 'good' | 'limited' | 'poor';
  apps?: string[];
  paymentMethods: PaymentMethod[];
}

export interface TaxiInfo {
  flagRate: Money;
  perKm: Money;
  perMinute?: Money;
  nightSurcharge?: number; // percentage
  airportSurcharge?: Money;
  apps: string[];
  tips: string[];
}

export interface DrivingInfo {
  side: 'left' | 'right';
  licenseRequirements: string[];
  minimumAge: number;
  averageGasPrice?: Money;
  tolls: boolean;
  parkingAvailability: 'abundant' | 'moderate' | 'scarce';
  roadConditions: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface CulturalInfo {
  customs: string[];
  etiquette: string[];
  taboos: string[];
  greetings: string[];
  diningEtiquette?: string[];
  dressCode?: string[];
  tipping: TippingInfo;
  businessHours: BusinessHours;
  holidays: Holiday[];
  festivals: Festival[];
}

export interface TippingInfo {
  restaurants: string;
  hotels: string;
  taxis: string;
  guides: string;
  other?: string[];
}

export interface BusinessHours {
  general: string;
  banks: string;
  shops: string;
  restaurants: string;
  governmentOffices: string;
}

export interface Holiday {
  name: string;
  date: string; // MM-DD or specific date
  type: 'national' | 'religious' | 'cultural';
  closures: string[];
}

export interface Festival {
  name: string;
  dates: string;
  description: string;
  location?: string;
  highlights: string[];
  tips?: string[];
}

export interface CostOfLiving {
  meal: {
    budget: Money;
    midRange: Money;
    fine: Money;
  };
  accommodation: {
    hostel: Money;
    budget: Money;
    midRange: Money;
    luxury: Money;
  };
  transport: {
    localTicket: Money;
    monthlyPass?: Money;
    taxiStart: Money;
    taxiPerKm: Money;
  };
  other: {
    coffee?: Money;
    beer?: Money;
    water?: Money;
    groceries?: string;
  };
}

export interface ConnectivityInfo {
  internet: {
    availability: 'excellent' | 'good' | 'moderate' | 'poor';
    averageSpeed: number; // Mbps
    cafesWithWifi: boolean;
    freeWifiSpots: string[];
  };
  mobile: {
    coverage: 'excellent' | 'good' | 'moderate' | 'poor';
    providers: string[];
    simCardCost?: Money;
    dataPackages?: DataPackage[];
    compatibility: string[];
  };
}

export interface DataPackage {
  provider: string;
  data: string; // "10GB"
  validity: string; // "30 days"
  cost: Money;
}

export interface HealthAndSafety {
  emergencyNumber: string;
  hospitals: Hospital[];
  pharmacies: string;
  drinkingWater: 'safe' | 'bottled-only' | 'boil-first';
  medicalStandards: 'excellent' | 'good' | 'adequate' | 'poor';
  commonHealthRisks?: string[];
  requiredInsurance?: boolean;
  naturalDisasterRisks?: string[];
  crimeLevel: SafetyLevel;
  scams?: string[];
  safetyTips: string[];
}

export interface Hospital {
  name: string;
  type: 'public' | 'private' | 'international';
  address: string;
  phone: string;
  emergencyAvailable: boolean;
  englishSpeaking: boolean;
}

export interface WeatherInfo {
  current?: CurrentWeather;
  forecast?: WeatherForecast[];
  historical?: HistoricalWeather;
  alerts?: WeatherAlert[];
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  precipitation: number;
  updatedAt: Timestamp;
}

export interface WeatherForecast {
  date: string;
  temperature: TemperatureRange;
  condition: string;
  precipitationChance: number;
  humidity: number;
  windSpeed: number;
}

export interface HistoricalWeather {
  month: number;
  averageHigh: number;
  averageLow: number;
  rainyDays: number;
  sunnyDays: number;
}

export interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  event: string;
  description: string;
  startTime: Timestamp;
  endTime: Timestamp;
  areas: string[];
}
