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

// , {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IlZaMlNhV1ZrN0t6MkxoWksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2VtdnRucHZxc2psanNya3ptd3dwLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIxYjVhMmJiMy03ODYwLTQzMTgtYjM1Mi1lYzIyNDliYzRlM2MiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ0NzI3MTQ1LCJpYXQiOjE3NDQ3MjM1NDUsImVtYWlsIjoidHZ2aG9hbmcyMDAyQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZ29vZ2xlIiwicHJvdmlkZXJzIjpbImdvb2dsZSJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFVLc3NKQ2VLMXJYOVRySGNLT0s2SE9VZDU2TXMyYTZwODJycF9KRnBXWm5NZjBnPXM5Ni1jIiwiZW1haWwiOiJ0dnZob2FuZzIwMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IlRpZW4gSG9hbmciLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiVGllbiBIb2FuZyIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xVS3NzSkNlSzFyWDlUckhjS09LNkhPVWQ1Nk1zMmE2cDgycnBfSkZwV1puTWYwZz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTEzNDk1MDczMTkwODM5MjcwMzc1Iiwic3ViIjoiMTEzNDk1MDczMTkwODM5MjcwMzc1In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE3NDQzMTQ3NTN9XSwic2Vzc2lvbl9pZCI6IjZiM2Q1ZTgzLTU4OTctNGM1Yy1hMzBlLTA1ZTc0ODgxNjUxYSIsImlzX2Fub255bW91cyI6ZmFsc2V9.EClQ8g_ytx-XY9IRhcIpSnhmUBJ2fAGoUTu7SKrQCvg",
//   },
// }

export default function () {
  let res = http.get(`${baseUrl}/music/songs?title=guitarup_looped`);
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
