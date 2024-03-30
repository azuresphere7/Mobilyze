import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Map from './components/Map';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: ''
  });

  const searchAddress = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];

        setCurrentLocation({
          latitude: lat,
          longitude: lon,
          address: display_name
        });
      }
    } catch (error) {
      window.alert('Error fetching location:', error);
    }
  };

  const selectLocationInfo = (location) => setCurrentLocation(location);

  const addLocationInfo = () => setLocationList([...locationList, { ...currentLocation, id: locationList.length + 1 }]);
  
  const removeLocationInfo = (id) => setLocationList(locationList.filter(list => list.id !== id));

  const importData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedList = JSON.parse(e.target.result);
        setLocationList(importedList);
      } catch (error) {
        window.alert('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  };

  const exportData = () => {
    const jsonData = JSON.stringify(locationList);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { coords: { latitude, longitude } } = position;

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const { display_name } = await response.json();

        setIsLoading(false);
        setCurrentLocation({
          latitude,
          longitude,
          address: display_name
        });
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    });
  }, []);

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div className='flex flex-col w-[1280px] h-[600px]'>
        <h1 className='font-bold text-2xl mb-4'>MAP LOCATION EXPLORER</h1>

        <div className='flex w-full h-full'>
          <Sidebar
            search={search}
            setSearch={setSearch}
            handleSearch={searchAddress}
            list={locationList}
            select={selectLocationInfo}
            add={addLocationInfo}
            remove={removeLocationInfo}
            importList={importData}
            exportList={exportData}
          />

          <Map
            isLoading={isLoading}
            location={currentLocation}
            locationSetter={setCurrentLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
