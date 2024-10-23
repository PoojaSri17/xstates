import React, { useEffect, useState } from 'react';
import './CitySelector.css'; // Ensure you have the right CSS styles

const CitySelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        const data = await response.json();
        setCountries(data);
      } catch (err) {
        setError('Failed to load countries. Please try again.');
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = async (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setDisplayMessage('');

    if (country) {
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${country}/states`);
        const data = await response.json();
        setStates(data);
      } catch (err) {
        setError('Failed to load states. Please try again.');
      }
    } else {
      setStates([]);
    }
  };

  const handleStateChange = async (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setDisplayMessage('');

    if (state) {
      try {
        const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError('Failed to load cities. Please try again.');
      }
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    if (city) {
      setDisplayMessage(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
    } else {
      setDisplayMessage('');
    }
  };

  return (
    <div className="city-selector">
      <h1>Select Location</h1>
      {error && <p className="error">{error}</p>}
      <label>
        Select Country:
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="">--Select Country--</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </label>

      <label>
        Select State:
        <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">--Select State--</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </label>

      <label>
        Select City:
        <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">--Select City--</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </label>

      {displayMessage && <p className="message">{displayMessage}</p>}
    </div>
  );
};

export default CitySelector;
