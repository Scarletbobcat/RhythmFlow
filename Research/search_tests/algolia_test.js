import http from "k6/http";
import { check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = "http://localhost:7070";

export default function () {
  let res = http.get(`${baseUrl}/search/query?query=test`);
  check(res, {
    "is status 200": (r) => r.status === 200,
    // "response time < 200ms": (r) => r.timings.duration < 200,
  });
}

export function handleSummary(data) {
  return {
    "algolia.html": htmlReport(data),
  };
}
