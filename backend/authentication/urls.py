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
    SubmitExamView,
    ExamQuestionView,
    RegistrationGuidanceView,
    ExamCreateAPIView,
    QuestionCreateAPIView,
    AutoSaveAnswer

    

)

path('start_exam_session/', StartExamSessionView.as_view(), name='start_exam_session'),


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
    path('submit_exam<str:username>/', SubmitExamView.as_view(), name='submit_exam'),
    path('start_exam_session/<str:username>/', StartExamSessionView.as_view(), name='start_exam_session'),
    path('exam/questions/<str:username>/', ExamQuestionView.as_view(), name='exam_questions'),
    path('AutoSaveAnswer/', AutoSaveAnswer.as_view()),
    path('RegistrationGuidance/', RegistrationGuidanceView.as_view(), name="RegistrationGuidance"),
    path('admin/create-exam/', ExamCreateAPIView.as_view()),
    path('admin/create-question/<str:username>/', QuestionCreateAPIView.as_view()),

    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),
    # path('verifayda_login/', Verifayda_loginView.as_view(), name='verifayda_login'),
    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),
    # path('fayda_callback/', FaydaCallbackView.as_view(), name='fayda_callback'),

]

