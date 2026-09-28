import http from "k6/http"

const BASE_URL = "http://localhost:5000/api/v1"
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMTE0OThkZi1hNmY1LTQ2NzgtODAwZS00ZDVkNjYxYWMxOTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MDQxNDk3NywiZXhwIjoxNzkwNDM2NTc3fQ.M-2sXuxpzgYZIM9tNeAsCpWHgVdw9ZbBIvtRxbK85jw"

export const options = {
    vus: 1,
    iterations: 20
}

export default function () {
    const response = http.get(
        `${BASE_URL}/user/feed?limit=10`,
        {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        }
    )

    console.log(
        `iteration=${__ITER + 1} status=${response.status}`
    )
}