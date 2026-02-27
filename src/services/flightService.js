/**
 * Flight Search Service for EaseMyTrip API
 * Handles all flight search related API calls
 */

const EASEMYTRIP_API_URL = process.env.EASEMYTRIP_API_URL || 'https://stagingapi.easemytrip.com/Flight.svc/json';

// Validate required environment variables
const validateEnvVariables = () => {
  const required = ['EASEMYTRIP_USERNAME', 'EASEMYTRIP_PASSWORD', 'EASEMYTRIP_IP'];
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Authentication object
const getAuthObject = () => {
  validateEnvVariables();
  
  return {
    UserName: process.env.EASEMYTRIP_USERNAME,
    Password: process.env.EASEMYTRIP_PASSWORD,
    IpAddress: process.env.EASEMYTRIP_IP,
  };
};

/**
 * Search flights
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} - Flight search results
 */
export const searchFlights = async (searchParams) => {
  try {
    const {
      tripType = 0, // 0: OneWay, 1: RoundTrip, 2: MultiCity
      adults = 1,
      children = 0,
      infants = 0,
      cabin = 0, // 0: Economy, 1: First, 2: Business, 4: PremiumEconomy
      searchDetails = [], // Array of search detail objects
      traceId = '', // Optional unique ID for tracking
    } = searchParams;

    const requestPayload = {
      Authentication: getAuthObject(),
      TripType: tripType,
      Adults: adults,
      Childs: children,
      Infants: infants,
      Cabin: cabin,
      SearchDetails: searchDetails,
      TraceId: traceId || `${Date.now()}`,
    };

    console.log('Sending Flight Search Request:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(`${EASEMYTRIP_API_URL}/FlightSearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('EaseMyTrip API Error:', data);
      throw new Error(`API Error: ${data?.Message || 'Unknown error occurred'}`);
    }

    return {
      success: true,
      data: data,
      traceId: requestPayload.TraceId,
    };
  } catch (error) {
    console.error('Flight Search Service Error:', error.message);
    return {
      success: false,
      error: error.message,
      errorDetails: error,
    };
  }
};

/**
 * Re-price flights (check pricing updates)
 * @param {Object} rePriceParams - Re-pricing parameters
 * @returns {Promise<Object>} - Re-priced flight details
 */
export const rePriceFlights = async (rePriceParams) => {
  try {
    const {
      journeyId,
      segmentId,
    } = rePriceParams;

    const requestPayload = {
      Authentication: getAuthObject(),
      JourneyId: journeyId,
      SegmentId: segmentId,
    };

    console.log('Sending Flight Re-Price Request:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(`${EASEMYTRIP_API_URL}/AirRePriceRQ`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('EaseMyTrip Re-Price API Error:', data);
      throw new Error(`Re-Price API Error: ${data?.Message || 'Unknown error occurred'}`);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Flight Re-Price Service Error:', error.message);
    return {
      success: false,
      error: error.message,
      errorDetails: error,
    };
  }
};

/**
 * Get seat map for a flight
 * @param {Object} seatMapParams - Seat map parameters
 * @returns {Promise<Object>} - Seat map details
 */
export const getSeatMap = async (seatMapParams) => {
  try {
    const {
      journeyId,
      segmentId,
    } = seatMapParams;

    const requestPayload = {
      Authentication: getAuthObject(),
      JourneyId: journeyId,
      SegmentId: segmentId,
    };

    console.log('Sending Get Seat Map Request:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(`${EASEMYTRIP_API_URL}/GetSeatMap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('EaseMyTrip Seat Map API Error:', data);
      throw new Error(`Seat Map API Error: ${data?.Message || 'Unknown error occurred'}`);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get Seat Map Service Error:', error.message);
    return {
      success: false,
      error: error.message,
      errorDetails: error,
    };
  }
};

/**
 * Get SSR (Special Service Request) availability
 * @param {Object} ssrParams - SSR parameters
 * @returns {Promise<Object>} - SSR availability details
 */
export const getSSRAvailability = async (ssrParams) => {
  try {
    const {
      journeyId,
      segmentId,
    } = ssrParams;

    const requestPayload = {
      Authentication: getAuthObject(),
      JourneyId: journeyId,
      SegmentId: segmentId,
    };

    console.log('Sending SSR Availability Request:', JSON.stringify(requestPayload, null, 2));

    const response = await fetch(`${EASEMYTRIP_API_URL}/SSRAvailabilityV2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('EaseMyTrip SSR API Error:', data);
      throw new Error(`SSR API Error: ${data?.Message || 'Unknown error occurred'}`);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('Get SSR Service Error:', error.message);
    return {
      success: false,
      error: error.message,
      errorDetails: error,
    };
  }
};

export default {
  searchFlights,
  rePriceFlights,
  getSeatMap,
  getSSRAvailability,
};
