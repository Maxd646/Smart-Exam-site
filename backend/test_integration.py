import requests
from datetime import datetime

BACKEND_URL = "http://localhost:8000/authentication/alerts/"

# 1. Send a test alert
alert = {
    "username": "integration_test_user",
    "alert_type": "behavioral",
    "reason": "Integration Test Alert",
    "timestamp": str(datetime.now())
}
res = requests.post(BACKEND_URL, json=alert)
print(f"POST /alerts/ status: {res.status_code}")
print(f"Response: {res.text}")

# 2. Fetch alerts
res = requests.get(BACKEND_URL)
print(f"GET /alerts/ status: {res.status_code}")
if res.ok:
    alerts = res.json().get('alerts', [])
    found = any(a.get('reason') == 'Integration Test Alert' for a in alerts)
    print(f"Test alert found in backend: {found}")
    if found:
        print("✅ Backend integration test PASSED.")
    else:
        print("❌ Test alert not found in backend.")
else:
    print("❌ Could not fetch alerts from backend.")

print("Now, please check your React admin dashboard to confirm the test alert appears in the table.") 