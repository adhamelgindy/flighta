<script setup>
import { ref, computed } from 'vue';
import { faker } from '@faker-js/faker';
import { useFlightStore } from '~/stores/flightStore';

const flightStore = useFlightStore();
// State variables
const flights = ref([]);
const searchFrom = ref('');
const searchTo = ref('');
const departureDate = ref('');
const returnDate = ref('');
const departureAirport = ref('');
const destinationAirport = ref('');
const passengers = ref(1);
const budget = ref(0); 
const showAllResults = ref(false);
const cities = ref([
  // 'Amsterdam',"Barcelona", 'Andorra la Vella', 'Athens', 'Belgrade', 'Berlin',
  // 'Bern', 'Bratislava','Hurghada', 'Brussels', 'Bucharest', 'Budapest',
  // 'Copenhagen', 'Cairo', 'Luxor', 'Dublin', 'Edinburgh', 'Florence', 'Frankfurt',
  // 'Genoa', 'Greece', 'Hamburg', 'Helsinki', 'Istanbul',
  // 'Kiev', 'Lisbon', 'Ljubljana', 'London', 'Luxembourg City',
  'Malta', 'Madrid', 'Marseille', 'Milan', 'Monaco',
  'Munich', 'Naples', 'Oslo', 'Paris', 'Prague',
  'Riga', 'Rome', 'Rotterdam', 'San Marino', 'Sarajevo',
  'Stockholm', 'Sofia', 'Stuttgart', 'Tallinn', 'Tbilisi',
  'Thessaloniki', 'Tirana', 'Toulouse', 'Vienna', 'Vilnius',
  'Warsaw', 'Zagreb', 'Zurich', 'Antwerp', 'Bergen',
  'Brno', 'Catania', 'Dortmund', 'Durres', 'Eindhoven',
  'Gdansk', 'Glasgow', 'Gothenburg', 'Hannover', 'Helsingborg',
  'Krakow', 'Lille', 'Lviv', 'Maribor', 'Montpellier',
  'Nantes', 'Nuremberg', 'Osijek', 'Ostrava', 'Pilsen',
  'Riga', 'Salzburg', 'Sofia', 'Stavanger', 'Stockholm',
  'Tampere', 'Thessaloniki', 'Turin', 'Utrecht', 'Valencia',
  'Vitoria-Gasteiz', 'Wroclaw', 'Zaragoza', 'Graz', 'Pécs',
  'La Rochelle', 'Antalya', 'Szeged', 'Dijon', 'Bordeaux','Tehran', 'Ahvaz'
]);
// const travelPurposes = ref([
//   'Meetings', 'Conference', 'Client Visit', 'Team Building', 'Training', // Business
//   'Vacation', 'Adventure', 'Relaxation', 'Cultural Exploration', 'Family Visit' // Leisure
// ]);
const Purpose = ref('');
// const Budget = ref(['Low', 'Medium', 'High']);


// Methods
const searchFlights = () => {
  const createFlight = () => ({
    departure: searchFrom.value,
    destination: searchTo.value,
    departureAirport: faker.airline.airport(),
    destinationAirport: faker.airline.airport(),
    flightNumber: faker.airline.flightNumber(),
    airline: faker.airline.airline(),
    departureDate: departureDate.value,
    returnDate: returnDate.value,
    price: faker.finance.amount(50, 400, 1),
    passengers: passengers.value,
    purpose: Purpose.value,
    status: ""
  });

  // Clear existing flights
  flightStore.flights = [];
  flights.value = [];

  // Generate and save mock flight data
  for (let i = 0; i < 10; i++) {
    const newFlight = createFlight();
    if (flightStore.saveFlight) {
      flights.value.push(newFlight);
      flightStore.saveFlight(newFlight);
    }
  }

  // Filter flights based on user input
  flights.value = flights.value.filter((flight) =>
    (!searchFrom.value || flight.departure.toLowerCase().includes(searchFrom.value.toLowerCase())) &&
    (!searchTo.value || flight.destination.toLowerCase().includes(searchTo.value.toLowerCase())) &&
    (!departureDate.value || flight.departureDate >= departureDate.value) &&
    (!returnDate.value || flight.returnDate <= returnDate.value) &&
    flight.passengers >= passengers.value
  );
};
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
const getRandomCity = () => {
      const randomIndex = Math.floor(Math.random() * cities.value.length);
      return cities.value[randomIndex];
    };
    // Function to determine if the connecting city should be shown
    const shouldShowConnectingCity = (index) => {
      return Math.random() < 0.3; // 50% chance
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
  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
</select>
</div>
<!-- To Dropdown -->
<select v-model="searchTo" class="search-input">
  <option disabled value="">Destination</option>
  <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
</select>
        <!-- Departure Date Input -->
        
        <input 
          type="date" 
          v-model="departureDate" 
          placeholder="Departure Date" 
          class="search-input"
        />
        <!-- Return Date Input -->
        <input 
          type="date" 
          v-model="returnDate" 
          placeholder="Return Date" 
          class="search-input"
        />
        <!-- Passengers Input -->
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
            <input 
              type="checkbox" 
              v-model="isOneWay" 
              class="checkbox-input"
            />
            One-Way Flight
          </label>
        </div>
        </div>   
        <!-- Search Button -->
        <button :disabled="!flights.length && !searchTo && !searchFrom && !departureDate && !returnDate" type="submit" class="search-btn">Search</button>
        <!-- <button :disabled="!flights.length && !searchTo && !searchFrom && !departureDate && !returnDate" type="submit" class="search-btn">Search</button> -->
      </form>
    </div>
    <div v-if="flights.length" class="results-section">
      <h2 class="section-title">Search Results</h2>
      <ul class="flight-list">
        <li v-for="(flight, index) in displayedFlights" :key="index" class="flight-item">
          <!-- <NuxtLink :to="{ path: '/flights/' + index, query: { flight: JSON.stringify(flight) } }" class="flight-link"> -->
          <NuxtLink :to="{ path: '/flights/' + index}" class="flight-link">
            <div class="flight-card">
              <div class="flight-header">
                <div class="airline">{{ flight.airline.name }}</div>
                <div class="flight-number">Flight Num: {{ flight.flightNumber }}</div>
              </div>
              <div class="flight-route">
                <div class="route">
                  <div class="city">{{ flight.departure }}</div>
                  <template v-if="shouldShowConnectingCity(index)">
                    <div class="separator"></div>
                    <div class="city">{{ getRandomCity() }}</div>
                  </template>
                  <div class="separator"></div>
                  <div class="city">{{ flight.destination }}</div>
                </div>
                <div class="flight-price">
                  <span class="price">{{ flight.price }} €</span>
                </div>
              </div>
              
              <div class="flight-schedule">
                <div class="departure">
                  <h4>Departure:</h4><span>{{ flight.departureAirport.name }}</span> 
                  <!-- ({{ departureDate }}) -->
                </div>
                <div class="return">
                  <h4>Return:</h4><span>{{ flight.destinationAirport.name }}</span> 
                  <!-- ({{ returnDate }}) -->
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
      <button v-if="showAllButton" @click="showAll" class="show-all-btn">
        Show All
      </button>
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
