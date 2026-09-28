import http from "k6/http"

const BASE_URL = "http://localhost:5000/api/v1"

export const options = {
    vus: 20,
    iterations: 20 
}

export default function () {
    const response = http.post(`${BASE_URL}/users/login`, JSON.stringify({email: "benchmark@threads.local", password: "BenchmarkPassword123!"})
    , {
        headers: {
                "Content-Type": "application/json"
            }
        }
    )
    console.log(`status=${response.status}`)
}

