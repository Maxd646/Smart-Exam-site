import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            const res = await fetch('http://localhost:8000/authentication/alerts/');
            const data = await res.json();
            setAlerts(data.alerts || []);
            setLoading(false);
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000); // refresh every 5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
            <h2>Supervisor/Admin Dashboard</h2>
            {loading ? <p>Loading alerts...</p> : null}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc' }}>Username</th>
                        <th style={{ border: '1px solid #ccc' }}>Type</th>
                        <th style={{ border: '1px solid #ccc' }}>Reason</th>
                        <th style={{ border: '1px solid #ccc' }}>Biometric</th>
                        <th style={{ border: '1px solid #ccc' }}>Device MAC</th>
                        <th style={{ border: '1px solid #ccc' }}>Device Type</th>
                        <th style={{ border: '1px solid #ccc' }}>Signal</th>
                        <th style={{ border: '1px solid #ccc' }}>IP</th>
                        <th style={{ border: '1px solid #ccc' }}>WiFi SSID</th>
                        <th style={{ border: '1px solid #ccc' }}>Lat</th>
                        <th style={{ border: '1px solid #ccc' }}>Long</th>
                        <th style={{ border: '1px solid #ccc' }}>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {alerts.map((alert, idx) => (
                        <tr key={idx}>
                            <td style={{ border: '1px solid #ccc' }}>{alert.username}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.alert_type}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.message || alert.reason}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.biometric || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.device_mac || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.device_type || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.signal_strength || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.ip_address || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.wifi_ssid || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.latitude || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.longitude || ''}</td>
                            <td style={{ border: '1px solid #ccc' }}>{alert.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard; 