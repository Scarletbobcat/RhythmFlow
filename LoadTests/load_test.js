import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = "http://localhost:9090";

export let options = {
  stages: [
    { duration: "1m", target: 500 }, // Ramp-up to 20 VUs
    { duration: "20m", target: 500 }, // Stay at 20 VUs for 1 minute
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
    "docker-no-gateway.html": htmlReport(data),
  };
}
