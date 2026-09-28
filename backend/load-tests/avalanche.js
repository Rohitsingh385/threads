import http from "k6/http"

const BASE_URL = "http://localhost:5000/api/v1"

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMTE0OThkZi1hNmY1LTQ2NzgtODAwZS00ZDVkNjYxYWMxOTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MDMyMjA3MywiZXhwIjoxNzkwMzQzNjczfQ.U0ppQlvmWRKaFA24a4UkYJrxtK4D28jy8pq92IFATh0"
export const options = {
  vus: 10,
  iterations: 10,
};

export default function () {
  const limit = __VU;

  const res = http.get(`${BASE_URL}/user/feed?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    },
  });

  console.log(
    `VU=${__VU} LIMIT=${limit} STATUS=${res.status} BODY=${res.body}`
  );
}