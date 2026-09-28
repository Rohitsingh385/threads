import http from "k6/http"

const BASE_URL = "http://localhost:5000/api/v1"
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMTE0OThkZi1hNmY1LTQ2NzgtODAwZS00ZDVkNjYxYWMxOTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MDI0ODA3NCwiZXhwIjoxNzkwMjY5Njc0fQ.2JxUpGDEQzvQ_Zh4CkjCgARWZ8n_8RJ9-4Gqs66jnt0"

export const options = {
    iterations: 100,
    vus: 1
}

export default function() {
    http.get(`${BASE_URL}/user/feed`, {
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        }
    })
    
}