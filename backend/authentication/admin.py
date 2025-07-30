from django.contrib import admin
from .models import UserProfile, ExamSession, Alert

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'rf_identifier')
    search_fields = ('user__username', 'rf_identifier')

@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'start_time', 'end_time', 'is_flagged')
    search_fields = ('user__username',)
    list_filter = ('is_flagged',)

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('username', 'alert_type', 'timestamp', 'device_mac', 'ip_address')
    search_fields = ('username', 'alert_type', 'device_mac', 'ip_address')
    list_filter = ('alert_type', 'timestamp')