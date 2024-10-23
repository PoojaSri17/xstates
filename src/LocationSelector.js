// src/LocationSelector.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LocationSelector.css'; // Import the CSS file

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [message, setMessage] = useState('');

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://crio-location-selector.onrender.com/countries');
        console.log('Countries fetched:', response.data); // Debugging line
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        try {
          const response = await axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
          console.log(`States for ${selectedCountry}:`, response.data); // Debugging line
          setStates(response.data);
          setSelectedState(''); // Reset state selection
          setCities([]); // Reset cities when country changes
          setSelectedCity(''); // Reset city selection
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      }
    };

    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedState) {
        try {
          const response = await axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`);
          console.log(`Cities for ${selectedState}, ${selectedCountry}:`, response.data); // Debugging line
          setCities(response.data);
          setSelectedCity(''); // Reset city selection
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };

    fetchCities();
  }, [selectedState, selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setMessage(`You Selected ${city}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div className="container"> {/* Add container class */}
      <h1>Location Selector</h1>

      {/* Country Dropdown */}
      <div>
        <label htmlFor="country">Select Country:</label>
        <select id="country" value={selectedCountry} onChange={handleCountryChange}>
          <option value="">--Select Country--</option>
          {countries.length > 0 ? (
            countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))
          ) : (
            <option disabled>No countries available</option>
          )}
        </select>
      </div>

      {/* State Dropdown */}
      <div>
        <label htmlFor="state">Select State:</label>
        <select id="state" value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
          <option value="">--Select State--</option>
          {states.length > 0 ? (
            states.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))
          ) : (
            <option disabled>No states available</option>
          )}
        </select>
      </div>

      {/* City Dropdown */}
      <div>
        <label htmlFor="city">Select City:</label>
        <select id="city" value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
          <option value="">--Select City--</option>
          {cities.length > 0 ? (
            cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))
          ) : (
            <option disabled>No cities available</option>
          )}
        </select>
      </div>

      {/* Message Display */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default LocationSelector;
