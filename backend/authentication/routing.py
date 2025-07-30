from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/monitor/$', consumers.MonitoringConsumer.as_asgi()),
    re_path(r'ws/alerts/$', consumers.MonitoringConsumer.as_asgi()),
]
