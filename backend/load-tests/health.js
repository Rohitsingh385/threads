import http from "k6/http"

export const options = {
    scenarios: {
        constant_load: {
            executor: "constant-arrival-rate",
            rate: 100,
            timeUnit: "1s",
            duration: "30s",
            preAllocatedVUs: 20,
            maxVUs: 50
        }
    }
}
export default function(){
    http.get("http://localhost:5000/health")
}