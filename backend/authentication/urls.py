from django.urls import path
from . views import (
    StartExamSessionView,
    # UploadFaceImageView,
    RegisterWithNationalIDView,
    VerifyCredentialsView, 
    VerifyBiometricView,
    ListAlertsView,
    # FaydaCallbackView,
    StartBehavioralMonitoringView,
    # Verifayda_loginView,
    BlockUserView,
    UpdatePhotoView,
    NationalIDPhotoView,
    logoutView,
    ListExamorientetionView,
    AdminstatusView,
    AdminLoginView,
    AdminlogoutView,
    EndExamSessionView,
    SubmitExamView,
    ExamQuestionView

)


urlpatterns = [
    path('logout/', logoutView.as_view(), name='logout'),
    path('verify_credentials/', VerifyCredentialsView.as_view(), name='verify_credentials'),    
    path('verify_biometric/', VerifyBiometricView.as_view(), name='verify_biometric'),
    path('list_alerts/', ListAlertsView.as_view(), name='list_alerts'), 
    path('start_behavioral_monitoring/', StartBehavioralMonitoringView.as_view(), name='start_behavioral_monitoring'),
    path('block_user/', BlockUserView.as_view(), name='block_user'),
    path('update_photo/', UpdatePhotoView.as_view(), name='update_photo'),
    path('national_id_photo/<str:username>/', NationalIDPhotoView.as_view(), name='national_id_photo'),
    path('exam_orientetions/', ListExamorientetionView.as_view(), name='exam_orientetions'),
    path('register_with_national_id/', RegisterWithNationalIDView.as_view(), name='register_with_national_id'),
    path("Adminlogin/", AdminLoginView.as_view(), name="AdminLogin"),
    path("Adminlogout/", AdminlogoutView.as_view(), name="AdminLogout"),
    path("Adminstatus/", AdminstatusView.as_view(), name="AdminStatus"),
    path('end_exam_session/', EndExamSessionView.as_view(), name='end_exam_session'),
    path('submit_exam/', SubmitExamView.as_view(), name='submit_exam'),
    path('start_exam_session/', StartExamSessionView.as_view(), name='start_exam_session'),
    path('exam/questions/', ExamQuestionView.as_view(), name='exam_questions'),


    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),
    # path('verifayda_login/', Verifayda_loginView.as_view(), name='verifayda_login'),
    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),
    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),

]

