<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFlightStore } from '~/stores/flightStore';

const flightStore = useFlightStore();
// State variables
const flights = ref([]);
const searchFrom = ref('');
const searchTo = ref('');
const departureDate = ref('');
const returnDate = ref('');
const passengers = ref(1);
const showAllResults = ref(false);
const loading = ref(false);
const error = ref(null);

// Cities array with IATA codes and city names
const cities = ref([
  { code: 'AMS', name: 'Amsterdam' },
  { code: 'ATH', name: 'Athens' },
  { code: 'BER', name: 'Berlin' },
  { code: 'BCN', name: 'Barcelona' },
  { code: 'CDG', name: 'Paris' },
  { code: 'FCO', name: 'Rome' },
  { code: 'LHR', name: 'London' },
  { code: 'MAD', name: 'Madrid' },
  { code: 'PRG', name: 'Prague' },
  { code: 'VIE', name: 'Vienna' }
]);

const API_CLIENT_ID = 'nLGHCnsv4oGGjkUTdshtnofWXrT0Ixmj'; // Replace with your Amadeus API Client ID
const API_CLIENT_SECRET = '4QXrkR3OinSliPmB'; // Replace with your Amadeus API Client Secret

// Function to get access token from Amadeus API
const getAccessToken = async () => {
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: API_CLIENT_ID,
        client_secret: API_CLIENT_SECRET
      })
    });

    if (!response.ok) throw new Error('Failed to get access token');
    const data = await response.json();
    return data.access_token;
  } catch (err) {
    error.value = 'Authentication failed: ' + err.message;
    return null;
  }
};

// Function to search flights using Amadeus API
const searchFlights = async () => {
  loading.value = true;
  error.value = null;

  flightStore.flights = [];

  const token = await getAccessToken();
  if (!token) return;

  try {
    const response = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${searchFrom.value}&destinationLocationCode=${searchTo.value}&departureDate=${departureDate.value}&adults=${passengers.value}&nonStop=false&max=10`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) throw new Error('Failed to fetch flights');
    const data = await response.json();
    flights.value = data.data;
    // const newFlight = flights.value;

    // for (let i = 0; i < 10; i++) {
    // if (flightStore.saveFlight) {
    //   flights.value.push(newFlight);
    //   flightStore.saveFlight(newFlight);
    // }
//   }
    console.log('flights', flights.value[0]);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Function to show all results
const showAll = () => {
  showAllResults.value = true;
};

// Computed properties
const displayedFlights = computed(() => {
  return showAllResults.value ? flights.value : flights.value.slice(0, 3);
});

const showAllButton = computed(() => {
  return !showAllResults.value && flights.value.length > 3;
});

// Function to get city name from IATA code
const getCityName = (code) => {
  const city = cities.value.find((city) => city.code === code);
  return city ? city.name : code; // Fallback to the code if the city is not found
};

// Function to get a random city
// const getRandomCity = () => {
//   const randomIndex = Math.floor(Math.random() * cities.value.length);
//   return cities.value[randomIndex];
// };

// Function to determine if the connecting city should be shown
const shouldShowConnectingCity = (index) => {
  return Math.random() < 0.3; // 30% chance
};
</script>

<template>
  <div class="landing-page">
    <header>
      <img src="/logo.png" alt="TravelHub Logo" class="logo" />
      <h3 class="slogan">Business travel made easy✈️</h3>
    </header>
    <div class="search-container">
      <form @submit.prevent="searchFlights" class="search-form">
        <div style="padding-left: 10px;">
          <select v-model="searchFrom" class="search-input">
            <option disabled value="">Departure</option>
            <option v-for="city in cities" :key="city.code" :value="city.code">
              {{ city.name }}
            </option>
          </select>
        </div>
        <select v-model="searchTo" class="search-input">
          <option disabled value="">Destination</option>
          <option v-for="city in cities" :key="city.code" :value="city.code">
            {{ city.name }}
          </option>
        </select>
        <input
          type="date"
          v-model="departureDate"
          placeholder="Departure Date"
          class="search-input"
        />
        <input
          type="date"
          v-model="returnDate"
          placeholder="Return Date"
          class="search-input"
        />
        <input
          type="number"
          v-model="passengers"
          min="1"
          tooltip="Passengers"
          class="search-input-Passengers"
        />
        <div style="padding-left: 10px;">
          <div class="flight-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="isOneWay" class="checkbox-input" />
              One-Way Flight
            </label>
          </div>
        </div>
        <button
          :disabled="!searchTo || !searchFrom || !departureDate"
          type="submit"
          class="search-btn"
        >
          Search
        </button>
      </form>
    </div>
    <div v-if="loading" class="results-section">
      <h2 class="section-title">Loading flights...</h2>
    </div>
    <div v-else-if="error" class="results-section">
      <h2 class="section-title text-red-500">{{ error }}</h2>
    </div>
    <div v-else-if="flights.length" class="results-section">
      <h2 class="section-title">Search Results</h2>
      <ul class="flight-list">
        <li v-for="(flight, index) in displayedFlights" :key="index" class="flight-item">
          <NuxtLink :to="{ path: '/flights/' + index }" class="flight-link">
            <div class="flight-card">
              <div class="flight-header">
                <div class="airline">Airline: {{ flight.itineraries[0].segments[0].carrierCode }}</div>
                <div class="flight-number">Flight Num: {{ flight.itineraries[0].segments[0].number }}</div>
              </div>
              <div class="flight-route">
                <div class="route">
                  <div class="city">{{ getCityName(flight.itineraries[0].segments[0].departure.iataCode) }}</div>
                  <!-- <template v-if="shouldShowConnectingCity(index)">
                    <div class="separator"></div>
                    <div class="city">{{ getRandomCity().name }}</div>
                  </template> -->
                  <div class="separator"></div>
                  <div class="city">{{ getCityName(flight.itineraries[0].segments[0].arrival.iataCode) }}</div>
                </div>
                <div class="flight-price">
                  <span class="price">{{ flight.price.total }} {{ flight.price.currency }}</span>
                </div>
              </div>
              <div class="flight-schedule">
                <div class="departure">
                  <h4>Departure:</h4>
                  <span>{{ flight.itineraries[0].segments[0].departure.at }}</span>
                </div>
                <div class="return">
                  <h4>Return:</h4>
                  <span>{{ flight.itineraries[0].segments.slice(-1)[0].arrival.at }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <button v-if="showAllButton" @click="showAll" class="show-all-btn">Show All</button>
    </div>
  </div>
</template>

<style scoped>
.flight-options {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #555;
  cursor: pointer;
}
.checkbox-input {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.checkbox-input:checked {
  accent-color: #8d1a1a; /* Customize the checkbox color */
}
.slogan {
  color: #8d1a1a; /* Customize the checkbox color */
}
.flight-number {
  font-size: 0.8rem;
  font-weight: bold;
  color: #8d1a1a;
}
.logo {
  max-width: 250px; /* Adjust the width as needed */
  height: auto;
}
.budget-container {
  padding: 20px;
}
.scrollable-area {
  max-height: 300px; /* Set the max height of the scrollable area */
  overflow-y: auto; /* Enable vertical scrolling */
  padding: 10px;
  border: 1px solid #ccc;
  margin-top: 10px;
}
.budget-container {
  padding: 20px;
}
.slider-container {
  margin-top: 10px;
}
.budget-slider {
  width: 100%; /* Make the slider take up the full width */
  margin: 10px 0;
}
/* Global landing page styles */
.landing-page {
  font-family: Arial, sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f7f9fb;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
/* Header section */
header {
  text-align: center;
  margin-bottom: 30px;
}
h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}
/* Search form */
.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.search-input {
  padding: 10px 15px;
  width: 150px;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 5px;
}
.search-input-Passengers {
  width: 180px; /* Set a small width suitable for a single digit */
 
  font-size: 1rem; /* Ensure the digit is clearly visible */
  padding: 5px; /* Add some padding for comfort */
  border: 2px solid #ccc; /* Match the styling of other input fields */
  border-radius: 5px; /* Add rounded corners for consistency */
  box-sizing: border-box; /* Ensure padding doesn't affect total width */
}
.search-input-Passengers:focus {
  outline: none; /* Remove default focus outline */
  border-color: #8d1a1a; /* Add a focus color for better UX */
  box-shadow: 0 0 5px rgba(141, 26, 26, 0.5); /* Subtle shadow for focus */
}
.search-input[type="text"] {
  width: 200px;
}
.search-btn {
  background-color: #8d1a1a;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  width: 100%;
}
.search-btn:hover {
  background-color: #450707;
}
/* Results section */
.results-section {
  margin-top: 20px;
  padding: 20px;
}
.section-title {
  font-size: 1.8rem;
  color: #555;
  text-align: center;
  margin-bottom: 20px;
}
.flight-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.flight-item {
  flex: 1 1 calc(33.333% - 20px);
  display: flex;
  justify-content: center;
}
.flight-link {
  text-decoration: none;
  color: inherit;
  display: block;
  width: 100%;
}
.flight-card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}
.flight-card:hover {
  transform: translateY(-5px);
}
.flight-header {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
/* Updated Flight Route Section */
.flight-route {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.route {
  display: flex;
  align-items: center;
  gap: 10px;
}
.city {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.separator {
  width: 20px;
  height: 2px;
  background-color: #8d1a1a;
  border-radius: 1px;
  align-self: center;
}
/* Flight Price Section */
.flight-price .price {
  font-size: 14px;
  font-weight: bold;
  color: #8d1a1a;
}
.flight-schedule {
  font-size: 14px;
  color: #555;
}
.departure, .return {
  margin-bottom: 4px;
  color: #000000;
}
.show-all-btn {
  display: block;
  margin: 0 auto;
  background-color: #510909;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}
.show-all-btn:hover {
  background-color: #450707;
}
/* Flight Details Section */
.flight-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
}
.flight-price {
  font-weight: bold;
  margin-left: 10px; /* Optional: add spacing between details and price */
}
</style>