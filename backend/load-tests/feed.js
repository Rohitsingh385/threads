import http from "k6/http"

const BASE_URL = "http://localhost:8081/api/v1"
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlMTE0OThkZi1hNmY1LTQ2NzgtODAwZS00ZDVkNjYxYWMxOTciLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc5MTAxMTczOSwiZXhwIjoxNzkxMDMzMzM5fQ.u_YNsp8WoWIMi1_5hfGhR4Kwzi5Rwnc1QvdRvCEb6-Y"

export const options = {
    vus: 10,
    duration: "30s"
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