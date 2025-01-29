<template>
  <div class="ticket-container" @mousemove="handleMouseMove">
    <div class="ticket" :style="ticketStyle">
      <div class="ticket-header">
        <h1 class="title">Trip Status</h1>
        <div class="airline-logo">
          <img src="/logo.png" alt="Airline Logo">
        </div>
      </div>

      <div class="status-message" :class="statusClass">
        <div v-if="flightData?.status === 'accepted'" class="status-icon">
          <span class="icon">✔</span>
          <div class="message">
            <h3>Trip Accepted!</h3>
            <p>All arrangements have been confirmed. You're ready for your journey!</p>
          </div>
        </div>

        <div v-else-if="flightData?.status === 'declined'" class="status-icon">
          <span class="icon">❌</span>
          <div class="message">
            <h3>Trip Declined</h3>
            <p>Unfortunately, your trip request was not approved. Please contact support for assistance.</p>
          </div>
        </div>

        <div v-else class="status-icon">
          <span class="icon pending-icon">⏳</span>
          <div class="message">
            <h3>Review in Progress</h3>
            <p>We're currently processing your request. We'll notify you once there's an update.</p>
          </div>
        </div>
      </div>

      <div class="flight-details">
        <h2>Flight Information</h2>
        <div class="details-grid">
          <div class="detail-item">
            <label>Flight Number</label>
            <p>{{ flightData?.flightNumber || 'N/A' }}</p>
          </div>
          <div class="detail-item">
            <label>Destination</label>
            <p>{{ flightData?.destination || 'N/A' }}</p>
          </div>
          <!-- <div class="detail-item">
            <label>Departure</label>
            <p>{{ formatDate(flightData?.departureDate) }}</p>
          </div> -->
          <div class="detail-item">
            <label>Time Until Departure</label>
            <p>{{ getTimeUntilDeparture() }}</p>
          </div>
        </div>
      </div>
      <div v-if="flightData?.status === 'accepted'" class="barcode">
        <img src="/Barcode.png" alt="Barcode">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      flightData: null,
      refreshing: false
    };
  },
  computed: {
    statusClass() {
      return this.flightData?.status || 'pending';
    },
    // ticketStyle() {
    //   const rotateX = (this.mouseY - 0.5) * 20;
    //   const rotateY = (this.mouseX - 0.5) * -20;
    //   return {
    //     transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    //   };
    // }
  },
  methods: {
    // handleMouseMove(event) {
    //   const rect = event.currentTarget.getBoundingClientRect();
    //   this.mouseX = (event.clientX - rect.left) / rect.width;
    //   this.mouseY = (event.clientY - rect.top) / rect.height;
    // },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getTimeUntilDeparture() {
      if (!this.flightData?.departureDate) return 'N/A';
      const now = new Date();
      const departure = new Date(this.flightData.departureDate);
      const diff = departure - now;

      if (diff < 0) return 'Departed';

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      return `${days} days, ${hours} hours`;
    },
    async refreshStatus() {
      this.refreshing = true;
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.refreshing = false;
    },
    contactSupport() {
      // Implement support contact logic
      alert('Support contact feature will be implemented here');
    }
  },
  mounted() {
    try {
      const storedData = localStorage.getItem('flightData');
      if (storedData) {
        this.flightData = JSON.parse(storedData);
      } else {
        this.flightData = {
          id: 'FL123',
          destination: 'Berlin',
          departureDate: '2025-01-25',
          status: 'pending'
        };
      }
    } catch (error) {
      console.error('Error retrieving flight data:', error);
      this.flightData = {
        id: 'FL123',
        destination: 'Berlin',
        departureDate: '2025-01-25',
        status: 'pending'
      };
    }
  }
};
</script>

<style scoped>
.ticket-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #510909, #3d0707);
  perspective: 1000px;
  padding: 20px;
}

.ticket {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(81, 9, 9, 0.3);
  padding: 32px;
  width: 100%;
  max-width: 800px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  position: relative;
}

.ticket::before, .ticket::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 100%;
  background: repeating-linear-gradient(transparent, transparent 10px, #510909 10px, #510909 20px);
  top: 0;
}

.ticket::before {
  left: -20px;
}

.ticket::after {
  right: -20px;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  color: #510909;
  font-size: 2.5rem;
  margin: 0;
}

.airline-logo img {
  max-width: 100px;
}

.status-message {
  margin: 32px 0;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.status-message.accepted {
  background-color: #510909;
}

.status-message.declined {
  background-color: #510909;
}

.status-message.pending {
  background-color: #510909;
}

.status-icon {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.icon {
  font-size: 32px;
}

.pending-icon {
  animation: spin 2s linear infinite;
}

.message h3 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
}

.message p {
  margin: 0;
  color: #666;
}

.flight-details {
  background-color: #fafafa;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
}

.flight-details h2 {
  color: #510909;
  margin: 0 0 24px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.detail-item label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 4px;
  display: block;
}

.detail-item p {
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.barcode img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .ticket-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .ticket {
    padding: 24px;
  }
}

.trip-status-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.trip-status-card {
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(81, 9, 9, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 800px;
  transition: all 0.3s ease;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.title {
  color: #510909;
  font-size: 2.5rem;
  margin: 0;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.status-badge.accepted {
  background-color: #e6f4ea;
  color: #1e7e34;
}

.status-badge.declined {
  background-color: #fde7e9;
  color: #dc3545;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-message {
  margin: 32px 0;
  padding: 24px;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.status-message.accepted {
  background-color: #e6f4ea;
}

.status-message.declined {
  background-color: #fde7e9;
}

.status-message.pending {
  background-color: #fff3cd;
}

.status-icon {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.icon {
  font-size: 32px;
}

.pending-icon {
  animation: spin 2s linear infinite;
}

.message h3 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
}

.message p {
  margin: 0;
  color: #666;
}

.flight-details-card {
  background-color: #fafafa;
  border-radius: 16px;
  padding: 24px;
  margin: 32px 0;
}

.flight-details-card h2 {
  color: #510909;
  margin: 0 0 24px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.detail-item label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 4px;
  display: block;
}

.detail-item p {
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 1rem;
}

.btn.primary {
  background-color: #510909;
  color: white;
}


.btn.secondary {
  background-color: #f8f9fa;
  color: #510909;
  border: 2px solid #510909;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .status-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .trip-status-card {
    padding: 24px;
  }
}
</style>