// Map.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import tileLayer from '../utils/tileLayer';
import Loader from './Loader';

const GetCoordinate = ({ location, setLocation }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([location.latitude, location.longitude]);
  }, [map, location]);

  useEffect(() => {
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const { display_name } = await response.json();

        map.flyTo([lat, lng]);
        setLocation({
          latitude: lat,
          longitude: lng,
          address: display_name
        });
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    })
  }, [map, setLocation]);
}

const Map = ({ isLoading, location, locationSetter }) => {
  return isLoading ? (
    <div className='flex justify-center items-center w-full border-[1px] border-gray-300'>
      <Loader />
    </div>
  ) : (
    <MapContainer center={[location.latitude, location.longitude]} zoom={8} className='relative w-full border-[1px] border-gray-300'>
      <TileLayer {...tileLayer} />

      {
        location && (
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>{location}</Popup>
          </Marker>
        )
      }

      <GetCoordinate location={location} setLocation={locationSetter} />
    </MapContainer>
  );
};

export default Map;
