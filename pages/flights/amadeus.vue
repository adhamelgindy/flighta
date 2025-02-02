<template>
    <div class='p-4'>
        <h1 class='text-xl font-bold mb-4'>Flights from Berlin to Cairo</h1>
        <div v-if='loading'>Loading flights...</div>
        <div v-else-if='error' class='text-red-500'>{{ error }}</div>
        <div v-else>
          <div v-for='(flight, index) in flights' :key='index' class='p-4 border rounded-lg shadow-md mb-4'>
            <!-- <p><strong>Price:</strong> {{ flight.price.total }} {{ flight.price.currency }}</p>
            <p><strong>Departure:</strong> {{ flight.itineraries[0].segments[0].departure.at }}</p>
            <p><strong>Arrival:</strong> {{ flight.itineraries[0].segments.slice(-1)[0].arrival.at }}</p>
            <p><strong>Airline:</strong> {{ flight.itineraries[0].segments[0].carrierCode }}</p> -->
            <!-- <p>{{flight}}</p> -->
            <p><strong>Departure Airport:</strong> {{ flight.itineraries[0].segments[0].departure.iataCode }} - {{ flight.itineraries[0].segments[0].departure.airport }}</p>
            <p><strong>Arrival Airport:</strong> {{ flight.itineraries[0].segments[0].arrival.iataCode }} - {{ flight.itineraries[0].segments[0].arrival.airport }}</p>
            <p><strong>++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++</strong></p>
          </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const flights = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const API_CLIENT_ID = 'nLGHCnsv4oGGjkUTdshtnofWXrT0Ixmj'; // Replace with your Amadeus API Client ID
    const API_CLIENT_SECRET = '4QXrkR3OinSliPmB'; // Replace with your Amadeus API Client Secret

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

    const fetchFlights = async () => {
      const token = await getAccessToken();
      if (!token) return;

      try {
        const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=BER&destinationLocationCode=CAI&departureDate=2025-02-10&adults=1&nonStop=false&max=5`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch flights');
        const data = await response.json();
        flights.value = data.data;
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchFlights);

    return { flights, loading, error };
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
