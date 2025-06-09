import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type LocationData = Database['public']['Tables']['wqi_uploads']['Row'];

const calculateWQI = (ph: number, turbidity: number) => {
  let phScore = 0;
  let turbidityScore = 0;

  if (ph >= 6.5 && ph <= 8.5) phScore = 100;
  else if ((ph >= 6.0 && ph < 6.5) || (ph > 8.5 && ph <= 9.0)) phScore = 80;
  else if ((ph >= 5.5 && ph < 6.0) || (ph > 9.0 && ph <= 9.5)) phScore = 60;
  else phScore = 40;

  if (turbidity <= 1) turbidityScore = 100;
  else if (turbidity <= 5) turbidityScore = 80;
  else if (turbidity <= 10) turbidityScore = 60;
  else if (turbidity <= 25) turbidityScore = 40;
  else turbidityScore = 20;

  return Math.round((phScore + turbidityScore) / 2);
};

const getWQIColor = (wqi: number) => {
  if (wqi >= 90) return '#22c55e'; // green-500
  if (wqi >= 70) return '#3b82f6'; // blue-500
  if (wqi >= 50) return '#eab308'; // yellow-500
  if (wqi >= 25) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
};

const Map: React.FC = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('wqi_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch locations');
        return;
      }

      if (data) {
        setLocations(data);
      }
    } catch (err) {
      console.error('Error in fetchLocations:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchLocations();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container" style={{ width: '100vw', height: '100vh' }}>
      <MapContainer
        center={[27.7172, 85.324]} // Kathmandu coordinates
        zoom={8}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations
          .filter(
            (location) =>
              typeof location.latitute === 'number' &&
              typeof location.longitude === 'number' &&
              !isNaN(location.latitute) &&
              !isNaN(location.longitude) &&
              location.latitute !== undefined &&
              location.longitude !== undefined
          )
          .map((location) => {
            const lat = Number(location.latitute);
            const lng = Number(location.longitude);

            const wqi = calculateWQI(location.ph, location.turbidity);
            const color = getWQIColor(wqi);

            return (
              <CircleMarker
                key={location.id}
                center={[lat, lng]}
                pathOptions={{ color, fillColor: color, fillOpacity: 0.8 }}
                radius={10} // Bigger radius for visibility
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg mb-2">{location.location}</h3>
                    <p className="text-sm mb-1">pH: {location.ph}</p>
                    <p className="text-sm mb-1">Turbidity: {location.turbidity}</p>
                    <p className="text-sm mb-1">WQI: {wqi}</p>
                    <p className="text-sm text-gray-500">Uploaded by: {location.username}</p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export { Map };
