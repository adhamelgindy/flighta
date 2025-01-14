<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useFlightStore } from '~/stores/flightStore';
import draggable from 'vuedraggable';

const config = useRuntimeConfig()
const route = useRoute();
const flightStore = useFlightStore();
// Reactive variables
const flight = ref(null);
const itinerary = ref([]);
const loadingItinerary = ref(false);
const aiPurpose = ref('');
const aiBudget = ref('');
const cityImage1 = ref('');
const cityImage2 = ref('');
const cityImage3 = ref('');

const user = ref({
  name: '',
  myEmail: '',
  purpose: '',
  department: '',
  supervisorName: '',
  supervisorEmail: '',
});
// Fetch ChatGPT itinerary
const fetchItinerary = async (destination, numberOfDays, purpose, aiBudget, aiPurpose) => {
  console.log('purpose', aiBudget, aiPurpose);
  loadingItinerary.value = true;
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a travel planner specializing in creating professional, concise, and visually engaging trip itineraries. Each day should include a morning activity and an afternoon activity, with a short description of each. Use emojis at the start of each line for added visual appeal.`,
          },
          {
            role: 'user',
            content: `Create a ${numberOfDays}-day itinerary for a trip to ${destination}. The purpose of the trip is ${aiPurpose}, with a budget of ${aiBudget}. Each day should include two activities: one in the morning and one in the afternoon. Write the activities in this format: Morning: [Activity description]. Afternoon: [Activity description]. Use emojis at the beginning of each activity to represent the theme. Do not use day numbers as titles, and ensure the tone is fun and engaging.`,
          },
        ],
        max_tokens: 356,
      },
      {
        headers: {
          Authorization: config.public.GPT_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Split the itinerary into days
    const itineraryText = response.data.choices[0].message.content;
    const activities = itineraryText.split('\n').filter(item => item.trim());
    const days = Math.ceil(activities.length / numberOfDays);
    itinerary.value = Array.from({ length: numberOfDays }, (_, i) => {
      return activities.slice(i * days, (i + 1) * days);
    });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    itinerary.value = 'Failed to generate itinerary. Please try again later.';
  } finally {
    loadingItinerary.value = false;
  }
};

const handleTryAI = () => {
      console.log('Purpose:', aiPurpose.value);
      console.log('Budget:', aiBudget.value);

    const destination = flight.value.destination;
    const purpose = flight.value.purpose;
    const numberOfDays = 3; 
    fetchItinerary(destination, numberOfDays, purpose, aiBudget.value, aiPurpose.value);
    };
onMounted(() => {
  // flight.value = flightStore.currentState();
  const id = Number(route.params.id);
  console.log('flightStore.getFlightById(id)', flightStore.getFlightById(id));
  flight.value = flightStore.getFlightById(id);

//   for (let i = 0; i < 2; i++) {
//     fetchRandomCityImage(flight.value.destination).then((imageUrl) => {
//   cityImagei+1.value = imageUrl
// });sdaA
//   }

// fetchRandomCityImage(flight.value.destination).then((imageUrl) => {
//   cityImage1.value = imageUrl
// });

// fetchRandomCityImage(flight.value.destination).then((imageUrl) => {
//   cityImage2.value = imageUrl
// });

// fetchRandomCityImage(flight.value.destination).then((imageUrl) => {
//   cityImage3.value = imageUrl
// });

  emailjs.init({
    publicKey: config.public.EMAILJS_API_KEY,
  });  
});

const sendEmail = async (flight) => {
  const flightObj = flight.value;
  const templateParams = {
    name: user.value.name,
    myEmail: user.value.myEmail,
    purpose: user.value.purpose,
    department: user.value.department,
    supervisorName: user.value.supervisorName,
    supervisorEmail: user.value.supervisorEmail,
    to_email: 'adham.elgindy99@gmail.com',
    departure: flightObj.departure,
    destination: flightObj.destination,
    departureAirport: flightObj.departureAirport,
    destinationAirport: flightObj.destinationAirport,
    flightNumber: flightObj.flightNumber,
    departureDate: flightObj.departureDate,
    returnDate: flightObj.returnDate,
    price: flightObj.price,
    passengers: flightObj.passengers,
  };

  emailjs
    .send('service_pci6jqd', 'template_ybm0vsd', templateParams)
    .then(() => {
      alert('Email sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

const submitForApproval = () => {
  sendEmail(flight);
};

// const fetchRandomCityImage = async (cityName) => {
//   const accessKey = 'nMKBOkZSX9EQCHE4IsZkS7v2T_TZYjq8am_WPefRGZg'; 
//   const url = `https://api.unsplash.com/photos/random?query=${cityName}+landmarks&client_id=${accessKey}&count=1`;

//   const response = await fetch(url);
//   const data = await response.json();
  
//   return data[0]?.urls?.regular;
// };

</script>

<template>
  <div class="container" v-if="flight">
    <div class="card">
      <h1 class="title">Flight Details</h1>
      <div class="flight-details-card">
        <div class="flight-header">
          <div class="flight-route">
            <div class="departure-city">{{ flight.departure }}</div>
            <div class="flight-connector">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
            <div class="destination-city">{{ flight.destination }}</div>
          </div>
          <div class="airline-logo">
            {{ flight.airline.name }}
          </div>
        </div>
        
        <div class="flight-details-grid">
          <div class="detail-item">
            <div class="detail-icon">✈️</div>
            <div class="detail-content">
              <span class="detail-label">Flight Number</span>
              <span class="detail-value">{{ flight.flightNumber }}</span>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">📅</div>
            <div class="detail-content">
              <span class="detail-label">Departure Date</span>
              <span class="detail-value">{{ flight.departureDate }}</span>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">📅</div>
            <div class="detail-content">
              <span class="detail-label">Return Date</span>
              <span class="detail-value">{{ flight.returnDate }}</span>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">💶</div>
            <div class="detail-content">
              <span class="detail-label">Price</span>
              <span class="detail-value">{{ flight.price }} €</span>
            </div>
          </div>
          
          <div class="detail-item">
            <div class="detail-icon">👥</div>
            <div class="detail-content">
              <span class="detail-label">Passengers</span>
              <span class="detail-value">{{ flight.passengers }}</span>
            </div>
          </div>
        </div>
        
        <div class="flight-footer">
          <div class="airports">
            <span>From: {{ flight.departureAirport.name }}</span>
            <span>To: {{ flight.destinationAirport.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="tripHeader">
      <!-- <img :src="cityImage1" alt="Trip photo" class="tripImage" />
      <img :src="cityImage2" alt="Trip photo" class="tripImage" />
      <img :src="cityImage3" alt="Trip photo" class="tripImage" /> -->
      <img :src="`/trip${Math.floor(Math.random() * 6) + 7}.png`" alt="Trip photo" class="tripImage" />
      <img :src="`/trip${Math.floor(Math.random() * 6) + 13}.png`" alt="Trip photo" class="tripImage" />
      <img :src="`/trip${Math.floor(Math.random() * 6) + 1}.png`" alt="Trip photo" class="tripImage" />
      <img :src="`/trip${Math.floor(Math.random() * 6) + 7}.png`" alt="Trip photo" class="tripImage" />
      <img :src="`/trip${Math.floor(Math.random() * 6) + 13}.png`" alt="Trip photo" class="tripImage" />
      <img :src="`/trip${Math.floor(Math.random() * 6) + 13}.png`" alt="Trip photo" class="tripImage" />
    </div>    

    <div class="try-ai-card">
      <h2>Plan with AI</h2>
      <form @submit.prevent="handleTryAI">
        <div class="form-group">
          <label for="purpose">Purpose:</label>
          <input type="text" id="purpose" v-model="aiPurpose" placeholder="Enter purpose (e.g. Business confrence, Christmas party, IT convention)" />
        </div>
        <div class="form-group">
          <label for="budget">Budget (€):</label>
          <input type="number" id="budget" v-model="aiBudget" placeholder="Enter budget" />
        </div>
        <button type="submit" class="btn-primary">Generate
        </button>
      </form>
    </div>

    <div v-if="loadingItinerary" class="card">
      <h2 class="subtitle">Itinerary</h2>
      <p>Loading itinerary...</p>
    </div>  
    
    <!-- <div v-else>
      <draggable
        v-model="itinerary"
        class="list-group itinerary-draggable"
        ghost-class="ghost"
        :animation="200"
        @start="dragging = true"
        @end="dragging = false"
      >
        <template #item="{ element: day, index }">
          <div class="card">
            <div class="edit-icon-container">
              <img src="/editIcon.png" alt="Edit Icon" class="edit-icon" />
            </div>
            <h3>Day {{ index + 1 }}</h3>
            <ul>
              <li v-for="(activity, i) in day" :key="i">
                <p>{{ activity }}</p>
              </li>
            </ul>
          </div>
        </template>
      </draggable>
    </div> -->
    
    

    <div v-else class="itinerary-cards">
      <div v-for="(day, index) in itinerary" :key="index" class="card">
        <div class="edit-icon-container">
          <img src="/editIcon.png" alt="Edit Icon" class="edit-icon" />
        </div>
        <h3>Day {{ index + 1 }}</h3>
        <ul>
          <li v-for="(activity, i) in day" :key="i">{{ activity }}</li>
        </ul>
      </div>
    </div>

      <iframe 
    style="
        width: 100%; 
        height: 300px; 
        border: none; 
        border-radius: 16px; 
        box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        margin: 20px 0; 
        overflow: hidden; 
        transition: all 0.3s ease;
    "
    scrolling="no" 
    id="gmap_canvas" 
    :src="`https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=%20${flight.destination}+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`"
></iframe>

<div class="card"> 
  <div class="card" style="padding: 20px; background-color: #510909; border-radius: 8px; font-size: 16px; color: #ffffff; font-weight: bold; cursor: not-allowed;" title="Feature locked">
    🔒 Lodging style
  </div>   
  <div class="card" style="padding: 20px; background-color: #510909; border-radius: 8px; font-size: 16px; color: #ffffff; font-weight: bold; cursor: not-allowed;" title="Feature locked">
    🔒 One day trips 
  </div> 
  <div class="card" style="padding: 20px; background-color: #510909; border-radius: 8px; font-size: 16px; color: #ffffff; font-weight: bold; cursor: not-allowed;" title="Feature locked">
    🔒 Restaurants in the area 
  </div> 
</div>

    <div class="card">
      <h2 class="subtitle">Submit for Approval</h2>
      <form @submit.prevent="submitForApproval">
        <div class="card">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="user.name" placeholder="Enter your name" required />
        </div>
        <div class="form-group">
          <label>Email:</label>
          <input v-model="user.myEmail" placeholder="Enter your email" required />
        </div>
        <div class="form-group">
          <label>Purpose of Trip:</label>
          <input v-model="user.purpose" placeholder="Enter the purpose of your trip" required />
        </div>
        <div class="form-group">
          <label>Department:</label>
          <input v-model="user.department" placeholder="Enter your department" required />
        </div>
      </div>
      <div class="card">
        <div class="form-group">
          <label>Supervisor's Name:</label>
          <input
            v-model="user.supervisorName"
            placeholder="Enter your supervisor's name"
            required
          />
        </div>
        <div class="form-group">
          <label>Supervisor's Email:</label>
          <input
            v-model="user.supervisorEmail"
            type="email"
            placeholder="Enter your supervisor's email"
            required
          />
        </div>
      </div>
        <button type="submit" class="submit-btn">Submit for Approval</button>
      </form>
    </div>
  </div>
  <div v-else class="no-data">
    <p>No flight data available. Please go back to the search page.</p>
  </div>
</template>

<style scoped>
.tripHeader {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Space between images */
}

.tripImage {
  width: 100%;
  max-width: 250px; /* Adjust as per design preference */
  height: auto; /* Maintains aspect ratio */
  object-fit: cover; /* Ensures the image fills the area without distortion */
  border-radius: 8px; /* Optional: Rounds the corners */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Optional: Adds a shadow */
}
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: Arial, sans-serif;
  color: #333;
}

.card {
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.8rem;
  color: #510909;
  margin-bottom: 1rem;
}

.subtitle {
  color: #510909;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.details p {
  margin: 0.5rem 0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #510909;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #510909;
}

.itinerary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.itinerary-cards .card {
  padding: 1rem;
}

.itinerary-cards ul {
  list-style: none;
  padding-left: 0;
}

.itinerary-cards li {
  margin: 0.5rem 0;
}
.itinerary-cards li {
  font-size: smaller; 
}


.no-data {
  text-align: center;
  color: #999;
  margin-top: 2rem;
}

.itinerary-cards .card {
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
  margin: 10px;
  border-radius: 8px;
}

.edit-icon-container {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 50%;
}

.edit-icon {
  width: 24px;
  height: 24px;
  filter: invert(30%) sepia(80%) saturate(405%) hue-rotate(343deg) brightness(100%) contrast(100%); /* Approximate the color #510909 */
  cursor: pointer;
}

.edit-icon:hover {
  filter: invert(38%) sepia(60%) saturate(405%) hue-rotate(343deg) brightness(120%) contrast(98%);
}

.flight-details-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f4f4f8;
}

.flight-details-card {
  width: 100%;
  max-width: 800px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.flight-details-card:hover {
  transform: scale(1.02);
}

.flight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background-color: #510909;
  color: white;
}

.flight-route {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.departure-city, .destination-city {
  font-size: 1.5rem;
  font-weight: bold;
}

.flight-connector {
  color: rgba(255,255,255,0.7);
}

.flight-connector svg {
  width: 24px;
  height: 24px;
}

.airline-logo {
  font-weight: bold;
  opacity: 0.8;
}

.flight-details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f9f9fc;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.detail-icon {
  font-size: 1.5rem;
  opacity: 0.7;
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-weight: bold;
  color: #333;
}

.flight-footer {
  padding: 1rem;
  background-color: #510909;
  color: white;
  text-align: center;
  font-size: 0.875rem;
  opacity: 0.9;
}

.airports {
  display: flex;
  justify-content: space-between;
}

.no-data {
  text-align: center;
  color: #999;
  margin-top: 2rem;
}

.try-ai-card {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #510909;
  border-radius: 8px;
  background: #fff5f5;
}

.try-ai-card h2 {
  color: #510909;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #510909;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #510909;
  border-radius: 4px;
  background-color: #fff5f5;
  color: #510909;
}

.form-group input::placeholder {
  color: #a94c4c;
}

.btn-primary {
  padding: 10px 15px;
  color: #fff;
  background-color: #510909;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #a51212;
}

.itinerary-draggable {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0;
  list-style: none;
}

.itinerary-draggable .card {
  flex: 1 1 calc(33.33% - 16px); /* Adjusted width for a 3-column layout with gaps */
  max-width: calc(33.33% - 16px);
  border: 1px solid #510909;
  border-radius: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #fff, #fff);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #510909;
  text-align:start;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: grab;
}



.itinerary-draggable .card:hover {
  cursor: grabbing;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.itinerary-draggable .edit-icon-container img {
  width: 24px;
  height: 24px;
}


.itinerary-draggable ul {
  padding: 0;
  list-style: none;
}

.itinerary-draggable li {
  margin: 4px 0;
  font-size: 14px;
}

.itinerary-cards .card p {
  margin-bottom: 15px; /* Separate paragraphs with some space */
}
</style>
