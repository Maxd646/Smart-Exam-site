from django.contrib import admin
from .models import UserProfile, ExamSession, Alert

admin.site.site_header = 'Anti-Cheating Admin management system'
admin.site.site_title = 'Anti-Cheating Admin Portal'
admin.site.index_title = 'Welcome to the Anti-Cheating Admin Portal'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'national_id', 'age', 'education_level', 'rf_identifier', 'blocked', 'national_id_photo','extracted_face_photo', 'face_encoding', 'iris_encoding', 'fingerprint_encoding')
    search_fields = ('user__username', 'full_name', 'national_id', 'rf_identifier')
    list_filter = ('education_level', 'blocked')
    readonly_fields = ()
    fieldsets = (
        (None, {
            'fields': ('user', 'full_name', 'national_id', 'age', 'education_level', 'national_id_photo', 'rf_identifier', 'blocked')
        }),
    )

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