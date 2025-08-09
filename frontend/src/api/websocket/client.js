// Simple event emitter class for subscribing to WebSocket events

class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback); // Add the callback to the list of listeners for the event
    return () => this.off(event, callback); //this will return a function to unsubscribe from the event
  }

  off(event, callback) {
    if (!this.listeners[event]) return; // If no listeners for the event, do nothing
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    ); // Remove the callback from the list of listeners
  }
  emit(event, data) {
    if (!this.listeners[event]) return; // If no listeners for the event, do nothing
    this.listeners[event].forEach((listener) => listener(data)); // Call each listener with the event data
  }
}

class WebSocketClient extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this.url = url;
    this.ws = null;
    this.reconnecInterval = options.reconnectInterval || 3000; // Default to 5 seconds
    this.shouldReconnect = true;
    this.connect();
  }
  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log(`WebSocket connected to ${this.url}`);
      this.emit("open");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit("message", data); // Emit the message event with the parsed data
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.log("WebSocket error:", error);
      this.emit("error", error);
    };
    this.ws.onclose = (event) => {
      console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
      this.emit("close", event);

      if (this.shouldReconnect) {
        console.log(
          `Reconnecting in ${this.reconnecInterval / 1000} seconds...`
        );
        setTimeout(() => this.connect(), this.reconnecInterval);
      }
    };
  }
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn("websocket is not open. cannot send messag", data);
    }
  }
  close() {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
    }
  }
}

// singleton instance (adjust url or export factory if needed)
const wsClient = new WebSocketClient("ss://your-backend-server/ws");

export default wsClient;
