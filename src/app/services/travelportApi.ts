// Travelport Flight Search API Integration Service
import { TRAVELPORT_CONFIG } from '../config/api';

export interface FlightSearchParams {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  adults: string;
  children: string;
  infants: string;
  tripType: 'roundtrip' | 'oneway';
  class: string;
}

export interface FlightSegment {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
}

export interface FlightResult {
  id: string;
  airline: string;
  price: number;
  currency: string;
  outbound: FlightSegment[];
  inbound?: FlightSegment[];
  totalDuration: string;
  stops: number;
  cabinClass: string;
}

export interface FlightSearchResponse {
  success: boolean;
  flights: FlightResult[];
  totalResults: number;
  searchId?: string;
  error?: string;
  isMockData?: boolean; // Flag to indicate if using mock data
}

/**
 * Search for flights using the Travelport API
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  // Note: Direct API calls from browser will fail due to CORS restrictions.
  // In production, this should be called through your backend server.
  // Using mock data for development.
  
  console.log('🔍 Flight Search Request:');
  console.log({
    from: params.from,
    to: params.to,
    departDate: params.departDate,
    returnDate: params.returnDate,
    adults: params.adults,
    children: params.children,
    infants: params.infants,
    tripType: params.tripType,
    class: params.class
  });
  
  // Return mock data directly (backend integration ready)
  const mockResult = getMockFlights(params);
  mockResult.isMockData = true;
  
  console.log(`✅ Found ${mockResult.flights.length} flights (mock data)`);
  
  return mockResult;
}

/**
 * Format date to the required format (YYYY-MM-DD or DD-MM-YYYY based on API requirement)
 */
function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  // Return in DD-MM-YYYY format (adjust if API requires different format)
  return `${day}-${month}-${year}`;
}

/**
 * Get cabin class code for API
 */
function getCabinClassCode(classType: string): number {
  const classMap: Record<string, number> = {
    'economy': 1,
    'premium_economy': 2,
    'business': 3,
    'first': 4,
  };
  
  return classMap[classType.toLowerCase()] || 1;
}

/**
 * Parse the Travelport API response and transform it into our format
 * Note: You'll need to adjust this based on the actual API response structure
 */
function parseFlightResponse(apiResponse: any): FlightSearchResponse {
  try {
    // Check if the response indicates success
    if (!apiResponse || apiResponse.Status === false) {
      return {
        success: false,
        flights: [],
        totalResults: 0,
        error: apiResponse?.Message || 'No flights found',
      };
    }

    // Extract flight results from the response
    // NOTE: The exact structure depends on the Travelport API response format
    // You may need to adjust these field names based on actual API response
    const flightResults = apiResponse.FlightResults || apiResponse.Results || [];
    
    const flights: FlightResult[] = flightResults.map((flight: any, index: number) => ({
      id: flight.ResultId || `flight-${index}`,
      airline: flight.AirlineName || flight.Airline || 'Unknown Airline',
      price: parseFloat(flight.TotalFare || flight.Price || 0),
      currency: flight.Currency || 'USD',
      outbound: parseSegments(flight.OutBound || flight.Segments || []),
      inbound: flight.InBound ? parseSegments(flight.InBound) : undefined,
      totalDuration: flight.Duration || calculateDuration(flight),
      stops: flight.Stops || 0,
      cabinClass: flight.CabinClass || 'Economy',
    }));

    return {
      success: true,
      flights,
      totalResults: flights.length,
      searchId: apiResponse.SearchId || apiResponse.TraceId,
    };
    
  } catch (error) {
    console.error('Error parsing flight response:', error);
    return {
      success: false,
      flights: [],
      totalResults: 0,
      error: 'Failed to parse flight results',
    };
  }
}

/**
 * Parse flight segments from API response
 */
function parseSegments(segments: any[]): FlightSegment[] {
  if (!Array.isArray(segments)) return [];
  
  return segments.map((segment: any) => ({
    airline: segment.Airline || segment.AirlineName || '',
    flightNumber: segment.FlightNumber || '',
    departure: {
      airport: segment.Origin || segment.DepartureAirport || '',
      time: segment.DepartureTime || '',
      date: segment.DepartureDate || '',
    },
    arrival: {
      airport: segment.Destination || segment.ArrivalAirport || '',
      time: segment.ArrivalTime || '',
      date: segment.ArrivalDate || '',
    },
    duration: segment.Duration || '',
    stops: segment.Stops || 0,
  }));
}

/**
 * Calculate total duration from segments
 */
function calculateDuration(flight: any): string {
  // Implement duration calculation logic based on flight data
  return flight.TotalDuration || '0h 0m';
}

/**
 * Get mock/demo flights for testing (when API is not available)
 */
export function getMockFlights(params: FlightSearchParams): FlightSearchResponse {
  // Generate more realistic prices based on route
  const basePrice = 850;
  const priceVariation = Math.floor(Math.random() * 300);
  
  const airlines = [
    { name: 'Air India', code: 'AI', priceMultiplier: 1.0 },
    { name: 'United Airlines', code: 'UA', priceMultiplier: 1.15 },
    { name: 'Emirates', code: 'EK', priceMultiplier: 1.25 },
    { name: 'Qatar Airways', code: 'QR', priceMultiplier: 1.20 },
    { name: 'Lufthansa', code: 'LH', priceMultiplier: 1.18 },
    { name: 'British Airways', code: 'BA', priceMultiplier: 1.22 },
  ];

  const mockFlights: FlightResult[] = airlines.slice(0, 6).map((airline, index) => {
    const price = Math.round((basePrice + priceVariation + index * 50) * airline.priceMultiplier);
    const departTime = ['10:30', '14:20', '22:00', '08:15', '16:45', '19:30'][index];
    const arrivalTime = ['14:45', '20:35', '05:15', '13:20', '23:10', '02:45'][index];
    const returnDepartTime = ['02:20', '12:00', '08:45', '15:30', '10:15', '20:00'][index];
    const returnArrivalTime = ['08:50', '16:30', '13:20', '21:45', '14:30', '03:15'][index];
    const stops = index < 2 ? 0 : index < 4 ? 1 : 2;
    const duration = stops === 0 ? '14h 15m' : stops === 1 ? '16h 30m' : '19h 45m';

    return {
      id: `mock-${index + 1}`,
      airline: airline.name,
      price: price,
      currency: 'USD',
      outbound: [{
        airline: airline.name,
        flightNumber: `${airline.code} ${100 + index * 10}`,
        departure: { airport: params.from, time: departTime, date: params.departDate },
        arrival: { airport: params.to, time: arrivalTime, date: params.departDate },
        duration: duration,
        stops: stops,
      }],
      inbound: params.tripType === 'roundtrip' ? [{
        airline: airline.name,
        flightNumber: `${airline.code} ${200 + index * 10}`,
        departure: { airport: params.to, time: returnDepartTime, date: params.returnDate || '' },
        arrival: { airport: params.from, time: returnArrivalTime, date: params.returnDate || '' },
        duration: duration,
        stops: stops === 2 ? 1 : stops,
      }] : undefined,
      totalDuration: duration,
      stops: stops,
      cabinClass: params.class === 'business' ? 'Business' : params.class === 'first' ? 'First' : 'Economy',
    };
  });

  // Sort by price by default
  mockFlights.sort((a, b) => a.price - b.price);

  return {
    success: true,
    flights: mockFlights,
    totalResults: mockFlights.length,
    searchId: 'mock-search-' + Date.now(),
  };
}