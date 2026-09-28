import http from "k6/http"

export const options = {
    scenarios: {
        stampede: {
            executor: "per-vu-iterations",
            vus: 20,
            iterations: 1,
            maxDuration: "30s"
        }
    }
}

export default function () {
    const res = http.get("http://localhost:5000/api/v1/user/feed", {
        headers:{
            Authorization: `Bearer ${__ENV.TOKEN}`,
        }
    })
    if(res.status !== 200){
        console.log(`status=${res.status}`)
    }
}

