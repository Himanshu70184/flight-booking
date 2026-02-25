// Premium Flight Search Form - Compact Creative Design

import { Search, MapPin, Calendar, Users, ArrowRight, Plane, ArrowLeftRight, Info } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AirportAutocomplete } from './AirportAutocomplete';

interface FlightSearchFormProps {
  onSearch?: (data: any) => void;
  compact?: boolean;
}

export function FlightSearchForm({ onSearch, compact = false }: FlightSearchFormProps) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway'>('roundtrip');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    class: 'economy'
  });

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate total passengers for display
  const totalPassengers = formData.adults + formData.children + formData.infants;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.from || !formData.to || !formData.departDate) {
      setValidationError('Please fill in all required fields');
      return;
    }

    if (tripType === 'roundtrip' && !formData.returnDate) {
      setValidationError('Please select a return date for round trip');
      return;
    }

    if (formData.adults === 0) {
      setValidationError('At least 1 adult is required');
      return;
    }

    if (formData.infants > formData.adults) {
      setValidationError('Number of infants cannot exceed number of adults');
      return;
    }

    setValidationError(null);

    // Build API payload in the exact format required
    const apiPayload = {
      Adults: formData.adults,
      Authentication: {
        UserName: "",
        Password: "",
        PortalID: 26
      },
      Cabin: formData.class === 'economy' ? 0 : formData.class === 'business' ? 1 : 2,
      Childs: formData.children,
      Infants: formData.infants,
      TripType: tripType === 'oneway' ? 0 : 1,
      FlightSearchDetails: tripType === 'oneway' 
        ? [
            {
              BeginDate: formData.departDate,
              CurrencyCode: "INR",
              Origin: formData.from,
              Destination: formData.to
            }
          ]
        : [
            {
              BeginDate: formData.departDate,
              CurrencyCode: "INR",
              Origin: formData.from,
              Destination: formData.to
            },
            {
              BeginDate: formData.returnDate,
              CurrencyCode: "INR",
              Origin: formData.to,
              Destination: formData.from
            }
          ]
    };

    // Navigate to search results page with parameters
    const searchParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      departDate: formData.departDate,
      returnDate: formData.returnDate || '',
      adults: formData.adults.toString(),
      children: formData.children.toString(),
      infants: formData.infants.toString(),
      tripType: tripType,
      class: formData.class,
    });

    navigate(`/search-results?${searchParams.toString()}`);

    // Call parent callback if provided with API payload
    if (onSearch) {
      onSearch(apiPayload);
    }

    // Log API payload for debugging
    console.log('Flight Search API Payload:', JSON.stringify(apiPayload, null, 2));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-white/40">
        {/* Compact Header with Trip Type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTripType('roundtrip')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                tripType === 'roundtrip'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              Round Trip
            </button>
            <button
              onClick={() => setTripType('oneway')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                tripType === 'oneway'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              One Way
            </button>
          </div>
          <div className="text-xs text-white/80 bg-[#1E3A8A]/30 px-3 py-1 rounded-full backdrop-blur-sm">
            ✈️ USA → India Specialist
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Creative Compact Layout - Single Row for All Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
            {/* From & To - Side by Side */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-2">
              {/* From - with Autocomplete */}
              <AirportAutocomplete
                value={formData.from}
                onChange={(value) => setFormData({ ...formData, from: value })}
                placeholder="JFK"
                icon="mappin"
                region="US"
                label="From"
              />

              {/* To - with Autocomplete */}
              <AirportAutocomplete
                value={formData.to}
                onChange={(value) => setFormData({ ...formData, to: value })}
                placeholder="DEL"
                icon="plane"
                region="INDIA"
                label="To"
              />
            </div>

            {/* Dates - Compact in Single Row */}
            <div className={`${tripType === 'roundtrip' ? 'lg:col-span-4' : 'lg:col-span-3'} grid ${tripType === 'roundtrip' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              {/* Depart Date */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Depart</label>
                <Calendar className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
                <input
                  type="date"
                  value={formData.departDate}
                  onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
                  className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all relative z-20 bg-white/80 backdrop-blur-sm cursor-pointer"
                  style={{
                    colorScheme: 'light'
                  }}
                />
              </div>

              {/* Return Date - Only for Round Trip */}
              {tripType === 'roundtrip' && (
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Return</label>
                  <Calendar className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all relative z-20 bg-white/80 backdrop-blur-sm cursor-pointer"
                    style={{
                      colorScheme: 'light'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Passengers - Compact with Dropdown */}
            <div className={`${tripType === 'roundtrip' ? 'lg:col-span-2' : 'lg:col-span-3'} relative`}>
              <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Travelers</label>
              <Users className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all bg-white/80 backdrop-blur-sm cursor-pointer text-left"
                >
                  {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
                </button>
                
                {/* Passenger Dropdown */}
                {showPassengerDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Adults</div>
                        <div className="text-xs text-gray-500">12+ years</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{formData.adults}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, adults: Math.min(9, formData.adults + 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Children</div>
                        <div className="text-xs text-gray-500">2-11 years</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{formData.children}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, children: Math.min(9, formData.children + 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Infants</div>
                        <div className="text-xs text-gray-500">Under 2 years</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold">{formData.infants}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, infants: Math.min(formData.adults, formData.infants + 1) })}
                          className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Info about infant limit */}
                    {formData.infants >= formData.adults && (
                      <div className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded">
                        Each infant must be accompanied by an adult
                      </div>
                    )}

                    {/* Done button */}
                    <button
                      type="button"
                      onClick={() => setShowPassengerDropdown(false)}
                      className="w-full mt-3 bg-[#1E3A8A] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#162e6b] transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Search Button - Inline */}
            <div className="lg:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white py-2.5 rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden xl:inline">Search</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform xl:hidden" />
              </button>
            </div>
          </div>

          {/* Helpful Hint */}
          <div className="bg-blue-50/80 border border-blue-200/50 rounded-lg px-3 py-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              <strong>Tip:</strong> Use airport codes like <span className="font-mono bg-white px-1 rounded">JFK</span> (New York), <span className="font-mono bg-white px-1 rounded">ORD</span> (Chicago), <span className="font-mono bg-white px-1 rounded">DEL</span> (Delhi), <span className="font-mono bg-white px-1 rounded">BOM</span> (Mumbai) for best results.
            </p>
          </div>
        </form>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="bg-red-50/80 border border-red-200/50 rounded-lg px-3 py-2 flex items-start gap-2">
          <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-900">
            {validationError}
          </p>
        </div>
      )}
    </div>
  );
}