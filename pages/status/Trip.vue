<template>
    <div class="trip-status" style="background-color: #510909; color: #ffffff; padding: 20px; border-radius: 16px;">
      <h1 class="title" style="color: #ffffff;">Trip Status</h1>
  
      <div v-if="flightData && flightData.status === 'accepted'" class="status accepted" style="margin-top: 20px;">
        <p><span style="font-size: 24px;">✔️</span> Your trip has been <strong>Accepted</strong>!</p>
        <p>All arrangements have been confirmed. You can proceed with the next steps!</p>
      </div>
  
      <div v-else-if="flightData && flightData.status === 'declined'" class="status declined" style="margin-top: 20px;">
        <p><span style="font-size: 24px;">❌</span> Your trip has been <strong>Declined</strong>.</p>
        <p>Please review the details and try again later.</p>
      </div>
  
      <div v-else class="status pending" style="margin-top: 20px;">
        <p><span style="font-size: 24px;">⏳</span> Your trip status is currently <strong>Pending</strong>.</p>
        <p>We are reviewing your request. Please wait for an update.</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        flightData: null // Will be populated from local storage
      };
    },
    mounted() {
      // Assuming 'flightData' is stored in localStorage
      this.flightData = JSON.parse(localStorage.getItem('flightData'));
  
      // Handle cases where localStorage doesn't contain flightData
      if (!this.flightData) {
        console.error('No flight data found in localStorage.');
      }
    }
  };
  </script>
  
  <style scoped>
  .trip-status {
    padding: 20px;
    background-color: #510909;
    color: #ffffff;
    border-radius: 16px;
    font-size: 16px;
    text-align: center;
  }
  
  .status p {
    margin: 10px 0;
  }
  
  .status.accepted p {
    color: #28a745;
  }
  
  .status.declined p {
    color: #dc3545;
  }
  
  .status.pending p {
    color: #ffc107;
  }
  </style>
  