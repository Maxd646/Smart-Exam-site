from django.urls import path
from . views import (
    StartExamSessionView,
    UploadFaceImageView,
    RegisterWithNationalIDView,
    VerifyCredentialsView, 
    VerifyBiometricView,
    LoginWithFaceView,
    LoginWithIrisView,
    LoginWithFingerprintView,
    ListAlertsView,
    FaydaCallbackView,
    StartBehavioralMonitoringView,
    Verifayda_loginView,
    BlockUserView,
    UpdatePhotoView,
    NationalIDPhotoView,
)


urlpatterns = [
    path('start_exam_session/', StartExamSessionView.as_view(), name='start_exam_session'),
    path('upload_face_image/', UploadFaceImageView.as_view(), name='upload_face_image'),
    path('register_with_national_id/', RegisterWithNationalIDView.as_view(), name='register_with_national_id'),
    path('verify_credentials/', VerifyCredentialsView.as_view(), name='verify_credentials'),    
    path('verify_biometric/', VerifyBiometricView.as_view(), name='verify_biometric'),
    path('login_with_face/', LoginWithFaceView.as_view(), name='login_with_face'),
    path('login_with_iris/', LoginWithIrisView.as_view(), name='login_with_iris'),
    path('login_with_fingerprint/', LoginWithFingerprintView.as_view(), name='login_with_fingerprint'),
    path('list_alerts/', ListAlertsView.as_view(), name='list_alerts'), 
    path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),
    path('start_behavioral_monitoring/', StartBehavioralMonitoringView.as_view(), name='start_behavioral_monitoring'),
    path('verifayda_login/', Verifayda_loginView.as_view(), name='verifayda_login'),
    path('block_user/', BlockUserView.as_view(), name='block_user'),
    path('update_photo/', UpdatePhotoView.as_view(), name='update_photo'),
    path('national_id_photo/', NationalIDPhotoView.as_view(), name='national_id_photo'),
 
]

#API endpoints for starting the exam session, uploading face images, registering with national ID, verifying credentials, biometric verification, logging in with face, iris, or fingerprint, listing alerts, handling VeriFayda callbacks, starting behavioral monitoring, Verifayda login, blocking users, updating photos, and managing national ID photos.
# > "http://localhost:8000/authentication/start_exam_session/"

# API upload face image: "http://localhost:8000/authentication/upload_face_image/"

# API register with national ID: "http://localhost:8000/authentication/register_with_national_id/"

# API verify credentials: "http://localhost:8000/authentication/verify_credentials/"

# API verify biometric: "http://localhost:8000/authentication/verify_biometric/"

# API login with face: "http://localhost:8000/authentication/login_with_face/"

# API login with iris: "http://localhost:8000/authentication/login_with_iris/"

# API login with fingerprint: "http://localhost:8000/authentication/login_with_fingerprint

# API list alerts: "http://localhost:8000/authentication/list_alerts/"

# API fayda callback: "http://localhost:8000/authentication/fayda_callback

# API start behavioral monitoring: "http://localhost:8000/authentication/start_behavioral_monitoring/"

# API verifayda login: "http://localhost:8000/authentication/verifayda_login/

# API block user: "http://localhost:8000/authentication/block_user/"

# API update photo: "http://localhost:8000/authentication/update_photo/"

# API national ID photo: "http://localhost:8000/authentication/national_id_photo/

# "
