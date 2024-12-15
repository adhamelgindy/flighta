import { defineStore } from 'pinia';

export const useFlightStore = defineStore('flight', {
    state: () => ({
        flights: [] as any[], // Array to hold flight data
    }),
    actions: {
        saveFlight(flight: any) {
            this.flights.push(flight);
        },
        getFlightById(id: number) {
            return this.flights[id];
        },
    },
});
