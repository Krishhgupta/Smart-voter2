import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Search, Loader2, Map as MapIcon, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import Skeleton from '../components/ui/Skeleton';

// Fix for default Leaflet marker icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom hook to fit map to bounds when booths change
const MapBoundsFitter = ({ booths, userLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (booths.length > 0) {
      const bounds = L.latLngBounds(booths.map(b => [b.lat, b.lng]));
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [booths, userLocation, map]);
  return null;
};

const FindBoothPage = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [booths, setBooths] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const fetchNearestBooths = async (lat, lng, loc = '') => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/find-booth?lat=${lat}&lng=${lng}&loc=${encodeURIComponent(loc)}`);
      if (!response.ok) throw new Error('Failed to fetch polling booths');
      const data = await response.json();
      setBooths(data);
      if (data.length === 0) {
        toast.error('No polling booths found near this location.');
      } else {
        toast.success(`Found ${data.length} booths nearby!`);
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while finding booths.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        try {
          const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const revData = await revRes.json();
          const city = revData.address?.city || revData.address?.town || revData.address?.state_district || 'Your Area';
          await fetchNearestBooths(latitude, longitude, city);
        } catch (e) {
          await fetchNearestBooths(latitude, longitude, 'Your Area');
        }
      },
      (err) => {
        setIsLoading(false);
        toast.error('Location access denied. Please enter your pincode or city manually.');
      }
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      
      // Step 5: Geocoding via Nominatim API
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        throw new Error('Location not found. Try a different city or pincode.');
      }

      const { lat, lon, display_name } = geoData[0];
      const cityOrDistrict = display_name.split(',')[0];
      setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      await fetchNearestBooths(lat, lon, cityOrDistrict);

    } catch (err) {
      toast.error(err.message || 'Error searching for location.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3 transition-colors duration-300">
          <MapIcon className="text-primary-600 dark:text-primary-400" size={36} />
          {t('findBooth')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto transition-colors duration-300">
          {t('findBoothSubtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Panel: Search & Results */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Search Box */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <button
              onClick={handleUseLocation}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors mb-4"
            >
              <Navigation size={18} />
              {t('useCurrentLocation')}
            </button>
            
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              <span className="text-sm font-medium text-slate-400">{t('or')}</span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 pl-11 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isLoading}
                className="mt-3 w-full bg-slate-900 dark:bg-slate-700 text-white rounded-xl py-3 font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : t('searchBtn')}
              </button>
            </form>
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/2 mb-4" />
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results List */}
          {!isLoading && booths.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">{t('nearestBooths')}</h3>
              {booths.map((booth, idx) => (
                <div 
                  key={booth.id} 
                  className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border transition-colors duration-300 ${idx === 0 ? 'border-primary-500 shadow-md ring-1 ring-primary-500' : 'border-slate-200 dark:border-slate-700 shadow-sm'}`}
                >
                  {idx === 0 && (
                    <span className="inline-block px-2.5 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-md mb-2">
                      {t('nearestOption')}
                    </span>
                  )}
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">{booth.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 flex items-start gap-1.5">
                    <MapPin className="shrink-0 mt-0.5" size={14} />
                    {booth.address}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {booth.distance.toFixed(2)} {t('kmAway')}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400 text-sm font-medium rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      {t('directionsBtn')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: Leaflet Map */}
        <div className="lg:col-span-2 h-[600px] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm z-10 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
          )}
          <MapContainer 
            center={userLocation ? [userLocation.lat, userLocation.lng] : [28.6139, 77.2090]} // Default to Delhi
            zoom={12} 
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User Location Marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <strong>{t('yourLocation')}</strong>
                </Popup>
              </Marker>
            )}

            {/* Booth Markers */}
            {booths.map((booth, idx) => (
              <Marker key={booth.id} position={[booth.lat, booth.lng]}>
                <Popup>
                  <div className="text-sm">
                    <strong className="block mb-1 text-base">{booth.name}</strong>
                    <span className="block text-slate-600 mb-2">{booth.address}</span>
                    <span className="block font-medium text-primary-600 mb-2">{booth.distance.toFixed(2)} {t('kmAway')}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded block text-center mt-2 no-underline"
                    >
                      {t('getDirections')}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

            <MapBoundsFitter booths={booths} userLocation={userLocation} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FindBoothPage;
