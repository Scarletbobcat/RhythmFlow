import http from "k6/http";
import { check, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// command to execute (replace 'your_token' with the actual token):
// 'k6 run -e ACCESS_TOKEN=your_token load_test.js'

// const baseUrl = "http://localhost:8080";
const baseUrl = "http://127.0.0.1/api";

export let options = {
  stages: [
    { duration: "1m", target: 100 }, // Ramp-up to 1000 VUs
    { duration: "20m", target: 100 }, // Stay at 1000 VUs for 20 minute
    { duration: "1m", target: 0 }, // Ramp-down to 0 VUs
  ],
};

export default function () {
  let res = http.get(`${baseUrl}/music/songs?title=guitarup_looped`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${__ENV.ACCESS_TOKEN}`,
    },
  });
  check(res, {
    "is status 200": (r) => r.status === 200,
    // "response time < 200ms": (r) => r.timings.duration < 200,
  });
}

export function handleSummary(data) {
  return {
    "auto-scaling-3.html": htmlReport(data),
  };
}
