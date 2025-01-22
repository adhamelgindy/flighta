<script>
import { ref, onMounted } from "vue";
import emailjs from "emailjs-com";

export default {
  setup() {
    // Reactive state
    const totalPrice = ref(200.0);
    const paymentMethod = ref("bank-transfer");
    const email = ref("");
    const creditCardDetails = ref({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });

    const flightData = ref(null); // Reactive reference to store flight data

    const config = useRuntimeConfig();

    // Fetch flight data from localStorage
    const getFlightDataFromLocalStorage = () => {
      try {
        const flightDataJSON = localStorage.getItem("flightData");
        return flightDataJSON ? JSON.parse(flightDataJSON) : null;
      } catch (error) {
        console.error("Error retrieving flight data:", error);
        return null;
      }
    };

    const saveFlightDataToLocalStorage = (flightData) => {
  try {
    // Convert flight data to JSON string
    const flightDataJSON = JSON.stringify(flightData);
    // Save to localStorage
    localStorage.setItem('flightData', flightDataJSON);
  } catch (error) {
    console.error('Error saving flight data:', error);
  }
};

    // Initialize EmailJS and fetch flight data on mount
    onMounted(() => {
      flightData.value = getFlightDataFromLocalStorage(); // Assign flight data
      // emailjs.init({
      //   publicKey: config.public.EMAILJS_API_KEY,
      // });
    });

    // Method for processing payment
    const processPayment = async () => {
      const flight = getFlightDataFromLocalStorage();

      if (!flight) {
        console.error("No flight data available for processing payment.");
        alert("No flight data found.");
        return;
      }

      console.log("Original Flight Data:", flight);

      // Update the flight status to "accepted"
      flight.status = "accepted";

      // Save the updated flight data to localStorage
      saveFlightDataToLocalStorage(flight);

      window.location.href = "http://localhost:3000/status/trip";
    };

    // Return everything to make it available in the template
    return {
      totalPrice,
      paymentMethod,
      email,
      creditCardDetails,
      processPayment,
      flightData, // Expose flight data to the template
    };
  },
};
</script>

<template>
  <div class="payment-page">
    <h1>Payment</h1>
    <p class="payment-instructions">
      Please review the payment details and proceed to complete your booking.
    </p>

    <div class="payment-summary">
      <div v-if="flightData">
      <h2>Order Summary</h2>
      <p>Total Price: €<strong>{{ flightData.price }}</strong></p>
      <h3>Flight Details</h3>
      <!-- Display flight data -->
        <p style="font-size: 14px;">Destination: {{ flightData.destination }}</p>
        <p style="font-size: 14px;">From: {{ flightData.departureDate }}</p>
        <p style="font-size: 14px;">To:{{ flightData.returnDate }}</p>
      </div>
      <div class="loading-spinner" v-else>
        <div class="spinner"></div>
        <!-- <p>No flight data found.</p> -->
      </div>
    </div>

    <form @submit.prevent="processPayment">
      <div class="payment-method">
        <label for="payment-method">Select Payment Method:</label>
        <select id="payment-method" v-model="paymentMethod">
          <option value="bank-transfer">Bank Transfer</option>
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      <!-- Conditionally render credit card details if 'credit-card' is selected -->
      <div class="credit-card-details" v-if="paymentMethod === 'credit-card'">
        <h3>Credit Card Details</h3>
        <label for="card-number">Card Number:</label>
        <input
          type="text"
          id="card-number"
          v-model="creditCardDetails.cardNumber"
          placeholder="Enter card number"
          required
        />
        <label for="expiry-date">Expiry Date:</label>
        <input
          type="text"
          id="expiry-date"
          v-model="creditCardDetails.expiryDate"
          placeholder="MM/YY"
          required
        />
        <label for="cvv">CVV:</label>
        <input
          type="text"
          id="cvv"
          v-model="creditCardDetails.cvv"
          placeholder="123"
          required
        />
      </div>

      <button type="submit" class="pay-now-btn">Pay Now</button>
    </form>
  </div>
</template>
    
  
  <style scoped>
  .payment-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    color: #510909;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    text-align: center;
    color: #510909;
  }
  
  .payment-instructions {
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.1rem;
    color: #510909;
  }
  
  .payment-summary {
    background-color: #fbecec;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #a51212;
  }
  
  .payment-summary h2 {
    margin-bottom: 10px;
    color: #a51212;
  }
  
  .payment-summary p {
    font-size: 1.2rem;
    font-weight: bold;
    color: #510909;
  }
  
  .payment-method {
    margin-bottom: 20px;
  }
  
  .payment-method label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #510909;
  }

  .payment_label {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #510909;
    border-radius: 5px;
  }
  
  .payment-method select {
    width: 100%;
    padding: 8px;
    border: 1px solid #510909;
    border-radius: 5px;
  }
  
  .credit-card-details label {
    display: block;
    font-weight: bold;
    margin-top: 10px;
    color: #510909;
  }
  
  .credit-card-details input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #510909;
    border-radius: 5px;
  }
  
  .pay-now-btn {
    background-color: #510909;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
  }
  
  .pay-now-btn:hover {
    background-color: #a51212;
  }

  .loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  
  .spinner {
    border: 4px solid #f3f3f3; /* Light gray */
    border-top: 4px solid #510909; /* Purple */
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  