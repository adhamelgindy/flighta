<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useFlightStore } from '~/stores/flightStore';

const route = useRoute();
const flightStore = useFlightStore();
const flight = ref(null);
const approving = ref(false);
const paymentSuccess = ref(false);

const approveTrip = () => {
  approving.value = true;
  setTimeout(() => {
    approving.value = false;
    alert('Trip approved successfully!');
  }, 2000);
};

const payForTrip = () => {
  approving.value = true;
  setTimeout(() => {
    approving.value = false;
    paymentSuccess.value = true;
    alert('Payment completed successfully!');
  }, 2000);
};

onMounted(() => {
  const id = Number(route.params.id);
  flight.value = flightStore.getFlightById(id);
});
</script>

<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Approve & Pay for Trip</h1>

      <div class="flight-details-card">
        <h2 class="subtitle">Flight Details</h2>
        <div class="flight-details">
          <p><strong>Departure:</strong> {{ flight.departure }}</p>
          <p><strong>Destination:</strong> {{ flight.destination }}</p>
          <p><strong>Flight Number:</strong> {{ flight.flightNumber }}</p>
          <p><strong>Departure Date:</strong> {{ flight.departureDate }}</p>
          <p><strong>Return Date:</strong> {{ flight.returnDate }}</p>
          <p><strong>Price:</strong> {{ flight.price }} €</p>
          <p><strong>Passengers:</strong> {{ flight.passengers }}</p>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="approveTrip" :disabled="approving">Approve</button>
        <button class="btn-secondary" @click="payForTrip" :disabled="approving || paymentSuccess">Pay Now</button>
      </div>

      <div v-if="approving" class="loading-indicator">
        <p>Processing...</p>
      </div>

      <div v-if="paymentSuccess" class="success-message">
        <p>Payment has been completed successfully!</p>
      </div>
    </div>
  </div>
  <div >
    <p>Loading flight details...</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}
.flight-details {
  line-height: 1.6;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}
.btn-primary {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:disabled {
  background-color: #cce5ff;
  cursor: not-allowed;
}
.btn-secondary {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:disabled {
  background-color: #c3e6cb;
  cursor: not-allowed;
}
.loading-indicator {
  margin-top: 1rem;
  color: #ff8800;
}
.success-message {
  margin-top: 1rem;
  color: #28a745;
}
</style>
