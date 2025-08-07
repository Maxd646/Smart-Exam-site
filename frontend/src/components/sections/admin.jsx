import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  // Add block state for users
  const [blockedUsers, setBlockedUsers] = useState({});

  useEffect(() => {
    if (!loggedIn) return;
    const fetchAlerts = async () => {
      setLoading(true);
      const res = await fetch("http://localhost:8000/authentication/alerts/");
      const data = await res.json();
      setAlerts(data.alerts || []);
      setLoading(false);
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo: hardcoded credentials (replace with backend auth as needed)
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid supervisor credentials");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  const handleBlockUser = async (username) => {
    await fetch("http://localhost:8000/authentication/block-user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, block: true }),
    });
    setBlockedUsers((prev) => ({ ...prev, [username]: true }));
  };

  if (!loggedIn) {
    return (
      <div
        style={{
          maxWidth: 400,
          margin: "80px auto",
          padding: 32,
          background: "white",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <h2>Supervisor Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              marginBottom: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            required
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Login
          </button>
        </form>
        {loginError && (
          <div style={{ color: "#dc3545", marginTop: 12 }}>{loginError}</div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Supervisor/Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            background: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
      {loading ? <p>Loading alerts...</p> : null}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc" }}>Username</th>
            <th style={{ border: "1px solid #ccc" }}>Type</th>
            <th style={{ border: "1px solid #ccc" }}>Reason</th>
            <th style={{ border: "1px solid #ccc" }}>Biometric</th>
            <th style={{ border: "1px solid #ccc" }}>Device MAC</th>
            <th style={{ border: "1px solid #ccc" }}>Device Type</th>
            <th style={{ border: "1px solid #ccc" }}>Signal</th>
            <th style={{ border: "1px solid #ccc" }}>IP</th>
            <th style={{ border: "1px solid #ccc" }}>WiFi SSID</th>
            <th style={{ border: "1px solid #ccc" }}>Lat</th>
            <th style={{ border: "1px solid #ccc" }}>Long</th>
            <th style={{ border: "1px solid #ccc" }}>Timestamp</th>
            <th style={{ border: "1px solid #ccc" }}>Blocked</th>
            <th style={{ border: "1px solid #ccc" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc" }}>{alert.username}</td>
              <td style={{ border: "1px solid #ccc" }}>{alert.alert_type}</td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.message || alert.reason}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.biometric || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.device_mac || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.device_type || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.signal_strength || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.ip_address || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.wifi_ssid || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.latitude || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                {alert.longitude || ""}
              </td>
              <td style={{ border: "1px solid #ccc" }}>{alert.timestamp}</td>
              <td
                style={{
                  border: "1px solid #ccc",
                  color: blockedUsers[alert.username] ? "#dc3545" : "#28a745",
                  fontWeight: "bold",
                }}
              >
                {blockedUsers[alert.username] ? "Yes" : "No"}
              </td>
              <td style={{ border: "1px solid #ccc" }}>
                <button
                  onClick={() => handleBlockUser(alert.username)}
                  disabled={blockedUsers[alert.username]}
                  style={{
                    background: blockedUsers[alert.username]
                      ? "#ccc"
                      : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 12px",
                    fontWeight: "bold",
                    cursor: blockedUsers[alert.username]
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
