import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 50 },  // Ramp-up to 50 users
    { duration: "30s", target: 200 }, // Ramp-up to 200 users (CIBF flash sale peak)
    { duration: "20s", target: 200 }, // Hold peak
    { duration: "10s", target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    http_req_failed: ["rate<0.01"],   // Less than 1% errors
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

export default function () {
  // 1. Visit Storefront Homepage
  let res = http.get(`${BASE_URL}/si`);
  check(res, {
    "homepage status is 200": (r) => r.status === 200,
  });
  sleep(1);

  // 2. Singlish Live Search Autocomplete
  res = http.get(`${BASE_URL}/api/search/suggest?q=ganithaya`);
  check(res, {
    "search suggest status is 200": (r) => r.status === 200,
    "search returns suggestions": (r) => JSON.parse(r.body).suggestions !== undefined,
  });
  sleep(1);

  // 3. Reader Sample Preview Generation
  res = http.get(`${BASE_URL}/api/reader/scholarship-grade-5-model-papers/preview`);
  check(res, {
    "reader preview status is 200": (r) => r.status === 200,
  });
  sleep(1);

  // 4. Delivery Fee Calculation API
  const deliveryPayload = JSON.stringify({
    district: "kandy",
    weightGrams: 700,
    subtotalCents: 245000,
  });

  res = http.post(`${BASE_URL}/api/delivery/calculate`, deliveryPayload, {
    headers: { "Content-Type": "application/json" },
  });
  check(res, {
    "delivery calc status is 200": (r) => r.status === 200,
  });
  sleep(2);
}
