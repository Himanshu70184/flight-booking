# Flight Search API Integration Guide

## Overview
This integration connects your B2B flight booking platform with the EaseMyTrip Flight API. The backend now provides endpoints for searching flights and managing related operations.

## Available Endpoints

### 1. Search Flights
**Endpoint:** `POST /api/flights/search`

**Description:** Search for available flights based on origin, destination, and travel dates.

**Request Body:**
```json
{
  "tripType": 0,
  "adults": 2,
  "children": 1,
  "infants": 0,
  "cabin": 0,
  "searchDetails": [
    {
      "origin": "DEL",
      "destination": "BOM",
      "departDate": "2024-03-15"
    },
    {
      "origin": "BOM",
      "destination": "DEL",
      "departDate": "2024-03-20"
    }
  ]
}
```

**Parameters:**
- `tripType` (required): 0 = OneWay, 1 = RoundTrip, 2 = MultiCity
- `adults` (required): Number of adults (1-9)
- `children` (optional): Number of children (0-9), default = 0
- `infants` (optional): Number of infants (0-2), default = 0
- `cabin` (optional): 0 = Economy, 1 = First, 2 = Business, 4 = PremiumEconomy, default = 0
- `searchDetails` (required): Array of search legs
  - `origin` (required): Airport code (e.g., "DEL")
  - `destination` (required): Airport code (e.g., "BOM")
  - `departDate` (required): Date in ISO format (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "Journeys": [...],
    "TraceId": "timestamp-based-id",
    "Errors": []
  },
  "traceId": "timestamp-based-id"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:4000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": 0,
    "adults": 1,
    "cabin": 0,
    "searchDetails": [
      {
        "origin": "DEL",
        "destination": "BOM",
        "departDate": "2024-03-15"
      }
    ]
  }'
```

---

### 2. Re-Price Flight
**Endpoint:** `POST /api/flights/re-price`

**Description:** Validate and check updated pricing for a selected flight before booking.

**Request Body:**
```json
{
  "journeyId": "xxxxx",
  "segmentId": "xxxxx"
}
```

**Parameters:**
- `journeyId` (required): Journey ID from search results
- `segmentId` (required): Segment ID from search results

**Response:**
```json
{
  "success": true,
  "data": {
    "PriceDetails": {...},
    "IsAvailable": true
  }
}
```

---

### 3. Get Seat Map
**Endpoint:** `POST /api/flights/seat-map`

**Description:** Get the seat map for a selected flight segment.

**Request Body:**
```json
{
  "journeyId": "xxxxx",
  "segmentId": "xxxxx"
}
```

**Parameters:**
- `journeyId` (required): Journey ID from search results
- `segmentId` (required): Segment ID from search results

**Response:**
```json
{
  "success": true,
  "data": {
    "SeatMap": [...],
    "Aircraft": "Boeing 737"
  }
}
```

---

### 4. Get SSR Availability
**Endpoint:** `POST /api/flights/ssr`

**Description:** Get Special Service Request (SSR) availability such as meals, baggage, etc.

**Request Body:**
```json
{
  "journeyId": "xxxxx",
  "segmentId": "xxxxx"
}
```

**Parameters:**
- `journeyId` (required): Journey ID from search results
- `segmentId` (required): Segment ID from search results

**Response:**
```json
{
  "success": true,
  "data": {
    "Services": [
      {
        "Name": "Extra Baggage",
        "Price": 500
      }
    ]
  }
}
```

---

## Environment Variables

The following environment variables are required in your `.env` file:

```
# EaseMyTrip API Credentials
EASEMYTRIP_USERNAME=EMTB2B
EASEMYTRIP_PASSWORD=EMT@uytrFYTREt
EASEMYTRIP_IP=127.0.0.1
```

These are already configured in your `.env` file.

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common error scenarios:
- Invalid request parameters
- Missing required fields
- API connectivity issues
- EaseMyTrip API errors

---

## Testing the Integration

### 1. Start your server:
```bash
npm install
npm run dev
```

### 2. Test flight search:
```bash
curl -X POST http://localhost:4000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "tripType": 0,
    "adults": 1,
    "cabin": 0,
    "searchDetails": [
      {
        "origin": "DEL",
        "destination": "BOM",
        "departDate": "2024-03-15"
      }
    ]
  }'
```

### 3. Check logs:
The server logs all API calls to help with debugging. Check the console output for request/response details.

---

## Next Steps

1. **Frontend Integration:** The design team can integrate these endpoints into the frontend forms
2. **Inquiry Management:** Store flight inquiries in your database
3. **Broker Dashboard:** Build a broker dashboard to manage and process inquiries
4. **Booking:** When inquiry is approved, integrate the booking flow (manual process as per your requirements)

---

## Support & Documentation

- Official Documentation: https://stagingapi.easemytrip.com/documentation/FlightAPI/Index.htm
- API Base URL: https://stagingapi.easemytrip.com/Flight.svc/json

For questions or issues, refer to the EaseMyTrip documentation or contact their support team.
