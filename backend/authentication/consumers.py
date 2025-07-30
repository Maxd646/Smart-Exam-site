import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .rf_detector import check_for_unauthorized_devices
from .models import Alert, User
from asgiref.sync import sync_to_async

class MonitoringConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Accept all connections for alert reporting
        await self.accept()
        await self.send(text_data=json.dumps({
            "message": "WebSocket connected"
        }))

    async def disconnect(self, close_code):
        print(f"WebSocket disconnected")

    @sync_to_async
    def save_alert(self, username, alert_type, reason, timestamp):
        user = User.objects.filter(username=username).first()
        Alert.objects.create(user=user, username=username, alert_type=alert_type, reason=reason, timestamp=timestamp)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "alert":
            # Handle alert from frontend
            print(f"ALERT from {data.get('username')}: {data.get('reason')} at {data.get('timestamp')}")
            await self.save_alert(
                data.get('username'),
                data.get('type'),
                data.get('reason'),
                data.get('timestamp')
            )
            await self.send(text_data=json.dumps({
                "status": "alert_received"
            }))
        elif data.get("action") == "check_rf":
            devices = check_for_unauthorized_devices()
            if devices:
                await self.send(text_data=json.dumps({
                    "flagged": True,
                    "reason": f"Unauthorized devices: {', '.join(devices)}"
                }))
            else:
                await self.send(text_data=json.dumps({
                    "flagged": False,
                    "message": "No unauthorized devices detected"
                }))
        elif data.get("action") == "ping":
            await self.send(text_data=json.dumps({
                "status": "pong"
            }))
