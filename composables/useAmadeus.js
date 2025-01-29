import axios from 'axios';

const API_BASE = 'https://test.api.amadeus.com/v1';
const API_KEY = 'nLGHCnsv4oGGjkUTdshtnofWXrT0Ixmj';
const API_SECRET = '4QXrkR3OinSliPmB';

export async function getAccessToken() {
    const response = await axios.post(`${API_BASE}/security/oauth2/token`, {
        grant_type: 'client_credentials',
        client_id: API_KEY,
        client_secret: API_SECRET
    }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data.access_token;
}

export async function searchFlights(from, to, departureDate, returnDate, passengers) {
    const token = await getAccessToken();
    const response = await axios.get(`${API_BASE}/shopping/flight-offers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            originLocationCode: from,
            destinationLocationCode: to,
            departureDate,
            ...(returnDate && { returnDate }),
            adults: passengers,
            currencyCode: 'EUR'
        }
    });
    return response.data.data;
}
