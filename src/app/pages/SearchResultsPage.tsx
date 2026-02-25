// Search Results Page - Dedicated page for showing flight search results
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, ArrowLeft, Plane } from 'lucide-react';
import { FlightResults } from '../components/FlightResults';
import { searchFlights, FlightResult, FlightSearchParams } from '../services/travelportApi';
import logo from '../../assets/400acf417779742a37b81dd5b0157e41ef0c77b2.png';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Extract search parameters from URL
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const tripType = (searchParams.get('tripType') as 'roundtrip' | 'oneway') || 'roundtrip';
  const classType = searchParams.get('class') || 'economy';

  useEffect(() => {
    // Perform search when component mounts
    performSearch();
  }, []);

  const performSearch = async () => {
    if (!from || !to || !departDate) {
      setSearchError('Missing required search parameters');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const searchParams: FlightSearchParams = {
      from,
      to,
      departDate,
      returnDate,
      adults,
      children,
      infants,
      tripType,
      class: classType,
    };

    try {
      const response = await searchFlights(searchParams);
      
      if (response.success) {
        setSearchResults(response.flights);
        setSearchError(null);
        setIsMockData(response.isMockData || false);
      } else {
        setSearchError(response.error || 'Failed to search flights');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An unexpected error occurred. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCallNow = (flight: FlightResult) => {
    console.log('User wants to book flight:', flight);
    window.location.href = 'tel:+15551234567';
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src={logo} alt="Aviotixx" className="h-7" />
            </div>

            {/* Phone CTA */}
            <button
              onClick={() => window.location.href = 'tel:+15551234567'}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call:</span> (555) 123-4567
            </button>
          </div>
        </div>
      </header>

      {/* Search Summary Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Details */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleBackToSearch}
                className="text-[#1E3A8A] hover:text-[#0EA5E9] font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Modify Search
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-[#1E3A8A]" />
                <span className="font-bold text-gray-900">{from}</span>
                <span className="text-gray-400">→</span>
                <span className="font-bold text-gray-900">{to}</span>
              </div>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">{new Date(departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {tripType === 'roundtrip' && returnDate && (
                  <span> - {new Date(returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </div>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="text-sm text-gray-600">
                {parseInt(adults) + parseInt(children) + parseInt(infants)} {parseInt(adults) + parseInt(children) + parseInt(infants) === 1 ? 'Traveler' : 'Travelers'}
              </div>
            </div>

            {/* Trip Type Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-[#1E3A8A] text-xs font-semibold rounded-full">
                {tripType === 'roundtrip' ? 'Round Trip' : 'One Way'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FlightResults 
          flights={searchResults}
          loading={isSearching}
          error={searchError || undefined}
          onCallNow={handleCallNow}
          isMockData={isMockData}
        />
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Need help booking? Our agents are available 24/7
              </p>
            </div>
            <button
              onClick={() => window.location.href = 'tel:+15551234567'}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call (555) 123-4567 Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}