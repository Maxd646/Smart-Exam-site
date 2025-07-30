from django.urls import path
from . import views

urlpatterns = [
    path('start-session/', views.start_exam_session, name='start_exam_session'),
    path('verify-face/', views.upload_face_image, name='upload_face_image'),
    path('register/', views.register_with_national_id, name='register_with_national_id'),
    path('verify-credentials/', views.verify_credentials, name='verify_credentials'),
    path('verify-biometric/', views.verify_biometric, name='verify_biometric'),
    path('login/', views.login_with_face, name='login_with_face'),
    path('login/iris/', views.login_with_iris, name='login_with_iris'),
    path('login/fingerprint/', views.login_with_fingerprint, name='login_with_fingerprint'),
    path('alerts/', views.list_alerts, name='list_alerts'),
    path('fayda-callback/', views.fayda_callback, name='fayda_callback'),
    path('start-monitoring/', views.start_behavioral_monitoring, name='start_behavioral_monitoring'),
    path('verifayda-login/', views.verifayda_login, name='verifayda_login'),
    path('verifayda-callback/', views.verifayda_callback, name='verifayda_callback'),
    path('block-user/', views.block_user, name='block_user'),
]
