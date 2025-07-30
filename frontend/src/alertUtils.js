let socket = null;

export function connectAlertSocket(username, onMessage) {
    if (socket) return socket;
    socket = new WebSocket('ws://localhost:8000/ws/alerts/');
    socket.onopen = () => {
        // Optionally authenticate or identify user
        socket.send(JSON.stringify({ type: 'init', username }));
    };
    if (onMessage) socket.onmessage = onMessage;
    return socket;
}

export function sendAlert(type, reason, username) {
    if (!socket || socket.readyState !== 1) return;
    socket.send(JSON.stringify({ type: 'alert', reason, username, timestamp: new Date().toISOString() }));
} 