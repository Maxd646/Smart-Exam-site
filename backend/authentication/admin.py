from django.contrib import admin
from .models import (
    UserProfile, 
    Alert,
    RegistrationGuidance,
    Examorientetion,
    Exam,
    Question,
    ExamSession,
    ExamAnswer

    )

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

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('username', 'timestamp')
    list_filter = ('timestamp','username')
    

@admin.register(RegistrationGuidance)
class  RegistrationGuidanceAdmin(admin.ModelAdmin):
    list_display=('media', 'title')


@admin.register(Examorientetion)
class ExamorientetionAdmin(admin.ModelAdmin):
    list_display=("description", 'media')

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display=["title", "duration_minutes"]


@admin.register(ExamSession)
class ExamSessionAdmin(admin.ModelAdmin):
    list_display=("student", "exam")

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display=("exam", "text")