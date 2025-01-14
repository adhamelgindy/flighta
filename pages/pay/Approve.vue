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

    const config = useRuntimeConfig()

    // Initialize EmailJS when the component is mounted
    onMounted(() => {
      emailjs.init({
        publicKey: config.public.EMAILJS_API_KEY,
      });
    });

    // Method for processing payment
    const processPayment = async () => {
      if (!email.value) {
        alert("Please enter your email address.");
        return;
      }

      console.log("email", email.value);

      const templateParams = {
        to_email: 'adham.elgindy99@gmail.com',
      };

      console.log("Sending email...");

      try {
       emailjs.send("service_pci6jqd", "template_4hfcz8a", templateParams);
       alert("Thank you! Your payment has been successfully completed💸.");
        // window.location.href = "http://localhost:3000";
      } catch (error) {
        alert("Error occurred!", error);
        console.error("Error sending email:", error);
      }
    };

    // Return everything to make it available in the template
    return {
      totalPrice,
      paymentMethod,
      email,
      creditCardDetails,
      processPayment,
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
        <h2>Order Summary</h2>
        <p>Total Price: €<strong>{{ totalPrice }}</strong></p>
      </div>
  
      <form @submit.prevent="processPayment">
        <div class="payment-method">
          <label for="email">Email Address:</label>
          <input
            class="payment_label"
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email address"
            required
          />
        </div>
  
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
  </style>
  