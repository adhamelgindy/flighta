import { defineStore } from 'pinia';

export const useFlightStore = defineStore('flight', {
    state: () => ({
        flights: [] as any[], // Array to hold flight data
    }),
    getters: {
        currentState: (state) => state.flights,
    },
    actions: {
        saveFlight(flight: any) {
            this.flights.push(flight);
            this.persistFlights();
        },
        getFlightById(id: number) {
            return this.flights[id];
        },
        persistFlights() {
            localStorage.setItem('flights', JSON.stringify(this.flights));
        },
        loadFlights() {
            const storedFlights = localStorage.getItem('flights');
            if (storedFlights) {
                this.flights = JSON.parse(storedFlights);
            }
        },

    },
});
