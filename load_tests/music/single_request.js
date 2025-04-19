import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// 'k6 run -e ACCESS_TOKEN=your_token load_test.js'

const baseUrl = "http://localhost:8080";

export default function () {
  let res = http.get(`${baseUrl}/music/songs?title=guitarup_looped`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${__ENV.ACCESS_TOKEN}`,
    },
  });

  check(res, {
    "is status 200": (r) => r.status === 200,
    "response time < 2s": (r) => r.timings.duration < 2000,
  });
}

export function handleSummary(data) {
  return {
    "single-request.html": htmlReport(data),
  };
}
