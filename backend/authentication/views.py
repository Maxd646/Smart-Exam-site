from django.views import View
from django.contrib.auth import authenticate
from django.utils.decorators import method_decorator
import numpy as np
from django.conf import settings
import face_recognition
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile, ExamSession, Alert
from django.views.decorators.http import require_GET
import os, json, requests, base64, io
from django.shortcuts import redirect
from urllib.parse import urlencode
from django.core.files.storage import default_storage
from io import BytesIO
from PIL import Image


def compare_faces(known_image_path, unknown_base64_image):
    """
    Compare a stored image file (known_image_path) with a live captured base64 image
    Returns True if faces match, False otherwise.
    """
    try:
        # Load known image from file
        known_image = face_recognition.load_image_file(known_image_path)
        known_encodings = face_recognition.face_encodings(known_image)
        if not known_encodings:
            return False  
        known_encoding = known_encodings[0]

        # Decode unknown base64 image
        header, encoded = unknown_base64_image.split(",", 1)  
        decoded = base64.b64decode(encoded)
        unknown_image = np.array(Image.open(BytesIO(decoded)))

        # Get face encoding of unknown image
        unknown_encodings = face_recognition.face_encodings(unknown_image)
        if not unknown_encodings:
            return False  # No face detected in live image
        unknown_encoding = unknown_encodings[0]

        # Compare faces
        results = face_recognition.compare_faces([known_encoding], unknown_encoding)
        return results[0]
    except Exception as e:
        print("Face comparison error:", e)
        return False


# --- Registration ---
@method_decorator(csrf_exempt, name='dispatch')
class RegisterWithNationalIDView(View):
    def post(self, request, *args, **kwargs):
        username = request.POST.get("username")
        password = request.POST.get("password")
        full_name = request.POST.get("full_name")
        national_id = request.POST.get("national_id")
        photo = request.FILES.get("national_id_photo")
        address = request.POST.get("address")
        age = request.POST.get("age")
        education_level = request.POST.get("education_level")
        rf_identifier = request.POST.get("rf_identifier")


        if not all([username, password, full_name, national_id, photo,address, age, education_level, rf_identifier]):
            return JsonResponse({"error": "All fields are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists."}, status=400)

        user = User.objects.create_user(username=username, password=password)
        profile = UserProfile.objects.create(
            user=user,
            full_name=full_name,
            national_id=national_id,
            national_id_photo=photo
        )
        return JsonResponse({"success": True, "message": "Student registered successfully."})


# --- show the registered national id---
@method_decorator(csrf_exempt, name='dispatch')
class NationalIDPhotoView(View):
    def get(self, request, *args, **kwargs):
        username = kwargs.get('username')
        if not username:
            return JsonResponse({'error': 'Username required.'}, status=400)
        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)

            photo_url = None

            if profile.national_id_photo:
                photo_url = request.build_absolute_uri(profile.national_id_photo.url)
            # if profile.extracted_face_photo:
            #     face_url = request.build_absolute_uri(profile.extracted_face_photo.url)

            return JsonResponse({
                'photo_url': photo_url,
                'username': username,
                'message': 'National ID photo and extracted face photo retrieved successfully.'
            })
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return JsonResponse({'error': 'User not found.'}, status=404)
        

# --- Verify credentials with traditional (login with username and password)---
@method_decorator(csrf_exempt, name='dispatch')
class VerifyCredentialsView(View):
    """Step 1: Verify username and password are registered"""

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({
                'error': 'Username and password required.'}, status=400)

        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({
                'verified': False,
                'error': 'Invalid username or password.',
                'step': 'credentials_failed'
            }, status=401)

        try:
            profile = UserProfile.objects.get(user=user)
            if profile.blocked:
                return JsonResponse({
                    'verified': False,
                    'error': 'User is blocked by supervisor.',
                    'step': 'blocked'
                }, status=403)

            return JsonResponse({
                'verified': True,
                'username': username,
                'step': 'credentials_verified',
                'photo_url': request.build_absolute_uri(profile.national_id_photo.url),
                'message': 'Credentials verified. Please provide biometric data.',

            })
        except UserProfile.DoesNotExist:
            return JsonResponse({
                'verified': False,
                'error': 'User profile not found. Please register biometric data.',
                'step': 'no_profile'
            }, status=404)

    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
    

# --- Biometric login with live face ---
@method_decorator(csrf_exempt, name='dispatch')
class VerifyBiometricView(View):
    def post(self, request):
        """
        Expects JSON:
        {
            "username": "...",
            "biometric_data": "data:image/jpeg;base64,...."
        }
        """
        try:
            data = json.loads(request.body)
            username = data.get("username")
            biometric_data = data.get("biometric_data")

            if not username or not biometric_data:
                return JsonResponse({"error": "Username and biometric data are required."}, status=400)

            try:
                profile = UserProfile.objects.get(user__username=username)
            except UserProfile.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
            
            image_path=profile.national_id_photo.path
            biometric_base64 =data.get("biometric_data")

            match=compare_faces(image_path, biometric_base64)
            if match:
                return JsonResponse({"success": True, "message": "Biometric verification passed"})
            else:
                return JsonResponse({"success": False, "message": "Biometric verification failed"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

@method_decorator(csrf_exempt, name='dispatch')    
class logoutView(View):
    """Logout the user"""

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated.'}, status=401)
        from django.contrib.auth import logout
        logout(request)
        return JsonResponse({'message': 'User logged out successfully.'})

    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
  

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class StartExamSessionView(View):
    """Start a new exam session for the user"""

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated.'}, status=401)
        ExamSession.objects.create(user=request.user)
        return JsonResponse({'message': 'Exam session started successfully.'})

    def get(self, request, *args, **kwargs):
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

@method_decorator(csrf_exempt, name='dispatch')
class ListAlertsView(View):
    """List the last 100 alerts"""

    def get(self, request, *args, **kwargs):
        alerts = Alert.objects.order_by('-timestamp')[:100]
        data = []
        for alert in alerts:
            data.append({
                'username': alert.username,
                'alert_type': alert.alert_type,
                'message': alert.message,
                'timestamp': alert.timestamp.isoformat(),
                'biometric': getattr(alert, 'biometric', 'N/A'),
                'device_mac': getattr(alert, 'device_mac', 'N/A'),
                'device_type': getattr(alert, 'device_type', 'N/A'),
                'signal_strength': getattr(alert, 'signal_strength', 'N/A'),
                'ip_address': getattr(alert, 'ip_address', 'N/A'),
                'wifi_ssid': getattr(alert, 'wifi_ssid', 'N/A'),
                'latitude': getattr(alert, 'latitude', 'N/A'),
                'longitude': getattr(alert, 'longitude', 'N/A'),
            })
        return JsonResponse({'alerts': data})


@method_decorator(csrf_exempt, name='dispatch')
class BlockUserView(View):
    """Block or unblock a user by supervisor"""

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return JsonResponse({'error': 'User not authenticated or not authorized.'}, status=403)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)

        username = data.get('username')
        block = data.get('block', True)
        if not username:
            return JsonResponse({'error': 'Username required.'}, status=400)
        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)
            profile.blocked = block
            profile.save()
            return JsonResponse({'success': True, 'blocked': profile.blocked})
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return JsonResponse({'error': 'User not found.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': f'Failed to block/unblock user: {str(e)}'}, status=500)
        return JsonResponse({'error': 'Invalid request method.'}, status=405)
    

@method_decorator(csrf_exempt, name='dispatch')
class StartBehavioralMonitoringView(View):
    """Start behavioral monitoring for a user after successful login"""

    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            username = data.get('username')
            
            if not username:
                return JsonResponse({'error': 'Username required'}, status=400)
            
            # In a real implementation, you would start the monitoring process
            # For now, we'll return success and the monitoring can be started manually
            return JsonResponse({
                'success': True,
                'message': f'Behavioral monitoring started for {username}',
                'monitoring_command': f'python behavioral_monitor.py --username {username}'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Failed to start monitoring: {str(e)}'}, status=500)

    def get(self, request, *args, **kwargs):
        
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def get_env(key, default=None):
    return os.environ.get(key, getattr(settings, key, default))



@method_decorator(csrf_exempt, name='dispatch')
class UpdatePhotoView(View):
    """Update user's profile photo"""

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated.'}, status=401)

        data = json.loads(request.body)
        image_data = data.get('image')
        if not image_data:
            return JsonResponse({'error': 'Image data required.'}, status=400)

        try:
            user = request.user
            profile = UserProfile.objects.get(user=user)
            photo=user.username + '_profile_photo.jpg'
            return JsonResponse({'success': True, 'message': 'Photo updated successfully.'})
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'User profile not found.'}, status=404)
        
        except Exception as e:
            return JsonResponse({'error': f'Failed to update photo: {str(e)}'}, status=500)
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

        
        
# @method_decorator(csrf_exempt, name='dispatch')
# class UploadFaceImageView(View):
#     """Upload a face image for verification"""

#     def post(self, request, *args, **kwargs):
#         if not request.user.is_authenticated:
#             return JsonResponse({'error': 'User not authenticated.'}, status=401)

#         data = json.loads(request.body)
#         image_data = data.get('image')
#         if not image_data:
#             return JsonResponse({'error': 'Image data missing.'}, status=400)
#         image_bytes = base64.b64decode(image_data.split(',')[-1])
#         np_array = np.frombuffer(image_bytes, dtype=np.uint8)
#         image = face_recognition.load_image_file(np_array)
#         try:
#             user_profile = UserProfile.objects.get(user=request.user)
#             known_encoding = np.frombuffer(user_profile.face_encoding)

#             face_encodings = face_recognition.face_encodings(image)
#             if not face_encodings:
#                 return JsonResponse({'error': 'No face detected.'}, status=400)

#             result = face_recognition.compare_faces([known_encoding], face_encodings[0])
#             if result[0]:
#                 return JsonResponse({'verified': True})
#             else:
#                 return JsonResponse({'verified': False})
#         except UserProfile.DoesNotExist:
#             return JsonResponse({'error': 'User profile not found.'}, status=404)
#         return JsonResponse({'error': 'Invalid request method.'}, status=405)
    



# @method_decorator(csrf_exempt, name='dispatch')
# class FaydaCallbackView(View):
#     """Handle Fayda OIDC callback after successful authentication"""

#     def get(self, request, *args, **kwargs):
#         code = request.GET.get('code')
#         state = request.GET.get('state')
#         if not code or not state:
#             return JsonResponse({'error': 'Missing required parameters'}, status=400)

#         try:
#             # Parse the state parameter to get user data
#             import json
#             user_data = json.loads(state)

#             # In a real implementation, you would:
#             # 1. Exchange the authorization code for tokens with Fayda
#             # 2. Verify the tokens
#             # 3. Get user information from Fayda
#             # 4. Update the user's profile with Fayda data

#             # For now, we'll simulate successful verification
#             return JsonResponse({
#                 'verified': True,
#                 'username': user_data.get('username'),
#                 'fayda_verified': True,
#                 'message': 'Successfully verified with Fayda'
#             })

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid state parameter'}, status=400)
#         except Exception as e:
#             return JsonResponse({'error': f'Verification failed: {str(e)}'}, status=500)
        
# @method_decorator(csrf_exempt, name='dispatch')
# class FaydaOIDCLoginView(View):
#     """Redirect user to Fayda OIDC authorization endpoint"""

#     def get(self, request, *args, **kwargs):
#         client_id = os.environ.get('FAYDA_CLIENT_ID', settings.FAYDA_CLIENT_ID)
#         redirect_uri = os.environ.get('FAYDA_REDIRECT_URI', settings.FAYDA_REDIRECT_URI)
#         authorization_endpoint = os.environ.get('FAYDA_AUTHORIZATION_ENDPOINT', settings.FAYDA_AUTHORIZATION_ENDPOINT)
#         state = 'fayda_' + os.urandom(8).hex()
#         params = {
#             'client_id': client_id,
#             'redirect_uri': redirect_uri,
#             'response_type': 'code',
#             'scope': 'openid profile',
#             'state': state,
#         }
#         url = f"{authorization_endpoint}?{urlencode(params)}"
#         return redirect(url)
    

# @method_decorator(csrf_exempt, name='dispatch')
# class FaydaOIDCCallbackView(View):
#     """Handle Fayda OIDC callback, exchange code for token, fetch user info"""

#     def get(self, request, *args, **kwargs):
#         code = request.GET.get('code')
#         state = request.GET.get('state')
#         if not code:
#             return JsonResponse({'error': 'Missing code from Fayda.'}, status=400)
#         # Exchange code for token
#         token_endpoint = os.environ.get('FAYDA_TOKEN_ENDPOINT', settings.FAYDA_TOKEN_ENDPOINT)
#         client_id = os.environ.get('FAYDA_CLIENT_ID', settings.FAYDA_CLIENT_ID)
#         redirect_uri = os.environ.get('FAYDA_REDIRECT_URI', settings.FAYDA_REDIRECT_URI)
#         data = {
#             'grant_type': 'authorization_code',
#             'code': code,
#             'redirect_uri': redirect_uri,
#             'client_id': client_id,
#         }
#         token_resp = requests.post(token_endpoint, data=data)
#         if token_resp.status_code != 200:
#             return JsonResponse({'error': 'Failed to get token from Fayda.'}, status=401)
#         tokens = token_resp.json()
#         access_token = tokens.get('access_token')
#         if not access_token:
#             return JsonResponse({'error': 'No access token from Fayda.'}, status=401)
#         # Fetch user info
#         userinfo_endpoint = os.environ.get('FAYDA_USERINFO_ENDPOINT', settings.FAYDA_USERINFO_ENDPOINT)
#         headers = {'Authorization': f'Bearer {access_token}'}
#         userinfo_resp = requests.get(userinfo_endpoint, headers=headers)
#         if userinfo_resp.status_code != 200:
#             return JsonResponse({'error': 'Failed to fetch user info from Fayda.'}, status=401)
#         userinfo = userinfo_resp.json()
#         # You can extract user info as needed, e.g. sub, name, etc.
#         # For demo, just return userinfo and require biometric next
#         return JsonResponse({
#             'step': 'fayda_authenticated',
#             'userinfo': userinfo,
#             'message': 'Fayda OIDC authentication successful. Please provide biometric data.'
#         })
    
# @method_decorator(csrf_exempt, name='dispatch')
# class Verifayda_loginView(View):
#     """Redirect user to VeriFayda OIDC authorization endpoint"""

#     def get(self, request, *args, **kwargs):
#         client_id = os.environ.get('VERIFAYDA_CLIENT_ID', settings.VERIFAYDA_CLIENT_ID)
#         redirect_uri = os.environ.get('VERIFAYDA_REDIRECT_URI', settings.VERIFAYDA_REDIRECT_URI)
#         authorization_endpoint = os.environ.get('VERIFAYDA_AUTHORIZATION_ENDPOINT', settings.VERIFAYDA_AUTHORIZATION_ENDPOINT)
#         state = 'verifayda_' + os.urandom(8).hex()
#         params = {
#             'client_id': client_id,
#             'redirect_uri': redirect_uri,
#             'response_type': 'code',
#             'scope': 'openid profile',
#             'state': state,
#         }
#         url = f"{authorization_endpoint}?{urlencode(params)}"
#         return redirect(url)
    

# def get_env(key, default=None):
#     return os.environ.get(key, getattr(settings, key, default))

    





# --= all the below code is commented out because it is not used in the current implementation  and it will used for future when the software is updated =--



# from .face_id_processing import extract_face_encoding_from_id, extract_and_save_face_image


# # --- Face recognition helpers ---
# def encode_face_from_base64(base64_str):
#     try:
#         image_data = base64.b64decode(base64_str.split(',')[-1])
#         image = face_recognition.load_image_file(io.BytesIO(image_data))
#         encodings = face_recognition.face_encodings(image)
#         if encodings:
#             return encodings[0].tobytes()
#         else:
#             return None
#     except Exception as e:
#         print(f"Error encoding face from base64: {e}")
#         return None


# -- verify biometric  with extraxtig the national id --

# @method_decorator(csrf_exempt, name='dispatch')
# class VerifyBiometricView(View):
#     """Step 2: Verify biometric data matches the registered user"""

#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON.'}, status=400)

#         username = data.get('username')
#         biometric_type = data.get('biometric_type')
#         biometric_data = data.get('biometric_data')  # base64 string
#         if not username or not biometric_type or not biometric_data:
#             return JsonResponse({'error': 'Username, biometric type, and biometric data required.'}, status=400)
#         try:
#             user = User.objects.get(username=username)
#             profile = UserProfile.objects.get(user=user)
#         except (User.DoesNotExist, UserProfile.DoesNotExist):
#             return JsonResponse({'error': 'User not found.'}, status=404)   
#         if profile.blocked:
#             return JsonResponse({'verified': False, 'error': 'User is blocked by supervisor.', 'step': 'blocked'}, status=403)
#         if biometric_type == 'face':
#             match = compare_faces(profile.face_encoding, biometric_data)
#             if not match:
#                 return JsonResponse({
#                     'verified': False,
#                     'error': 'Face does not match registered user.',
#                     'step': 'biometric_failed'
#                 }, status=401)
#         elif biometric_type == 'iris':
#             # Placeholder for iris comparison
#             match = profile.iris_encoding is not None and biometric_data == 'SIMULATED_MATCH'
#             if not match:
#                 return JsonResponse({
#                     'verified': False,
#                     'error': 'Iris does not match registered user.',
#                     'step': 'biometric_failed'
#                 }, status=401)
#         elif biometric_type == 'fingerprint':
#             # Placeholder for fingerprint comparison
#             match = profile.fingerprint_encoding is not None and biometric_data == 'SIMULATED_MATCH'
#             if not match:
#                 return JsonResponse({
#                     'verified': False,
#                     'error': 'Fingerprint does not match registered user.',
#                     'step': 'biometric_failed'
#                 }, status=401)  
#         else:
#             return JsonResponse({'error': 'Invalid biometric type.'}, status=400)
#         # Biometric verification successful
#         return JsonResponse({
#             'verified': True,
#             'username': username,                                                                               

#             'biometric_type': biometric_type,
#             'step': 'biometric_verified',
#             'message': 'Biometric verification successful. Redirecting to exam...'
#         })
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({'error': 'Invalid request method.'}, status=405)
    
    

# @method_decorator(csrf_exempt, name='dispatch')
# class LoginWithFaceView(View):
#     """Legacy function - kept for backward compatibility"""

#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON.'}, status=400)

#         username = data.get('username')
#         password = data.get('password')
#         image_data = data.get('image')
#         if not username or not password or not image_data:
#             return JsonResponse({'error': 'Username, password, and image required.'}, status=400)   
#         user = authenticate(username=username, password=password)
#         if user is None:
#             return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
#         try:
#             profile = UserProfile.objects.get(user=user)
#         except UserProfile.DoesNotExist:
#             return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)    
#         from .face_recognition import compare_faces
#         match = compare_faces(profile.face_encoding, image_data)
#         if match:
#             return JsonResponse({'verified': True, 'username': username})
#         else:
#             return JsonResponse({'verified': False, 'error': 'Face does not match.'}, status=401)
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({'error': 'Invalid request method.'}, status=405)



# @method_decorator(csrf_exempt, name='dispatch')
# class LoginWithIrisView(View):
#     """Legacy function - kept for backward compatibility"""

#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON.'}, status=400)

#         username = data.get('username')
#         password = data.get('password')
#         iris_data = data.get('iris')  # base64 string
#         if not username or not password or not iris_data:
#             return JsonResponse({'error': 'Username, password, and iris image required.'}, status=400)
#         user = authenticate(username=username, password=password)
#         if user is None:
#             return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
#         try:
#             profile = UserProfile.objects.get(user=user)
#         except UserProfile.DoesNotExist:
#             return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)

#         # Placeholder for iris comparison logic
#         # Replace with actual iris recognition logic        
#         match = profile.iris_encoding is not None and iris_data == 'SIMULATED_MATCH'  # Simulate match
#         if match:
#             return JsonResponse({'verified': True, 'username': username, 'biometric': 'iris'})
#         else:
#             return JsonResponse({'verified': False, 'error': 'Iris does not match.'}, status=401)
#     def get(self, request, *args, **kwargs):
#         return JsonResponse({'error': 'Invalid request method.'}, status=405)
    


# @method_decorator(csrf_exempt, name='dispatch')
# class LoginWithFingerprintView(View):
#     """Legacy function - kept for backward compatibility"""

#     def post(self, request, *args, **kwargs):
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON.'}, status=400)

#         username = data.get('username')
#         password = data.get('password')
#         fingerprint_data = data.get('fingerprint')
#         if not username or not password or not fingerprint_data:
#             return JsonResponse({'error': 'Username, password, and fingerprint data required.'}, status=400)

#         user = authenticate(username=username, password=password)
#         if user is None:
#             return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
#         try:
#             profile = UserProfile.objects.get(user=user)
#         except UserProfile.DoesNotExist:
#             return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)    
#         # Placeholder for fingerprint comparison logic
#         # Replace with actual fingerprint recognition logic
#         match = profile.fingerprint_encoding is not None and fingerprint_data == 'SIMULATED_MATCH'  # Simulate match
#         if match:
#             return JsonResponse({'verified': True, 'username': username, 'biometric': 'fingerprint'})
#         else:
#             return JsonResponse({'verified': False, 'error': 'Fingerprint does not match.'}, status=401)
#     def get(self, request, *args, **kwargs):
#             return JsonResponse({'error': 'Invalid request method.'}, status=405) 
  




# @method_decorator(csrf_exempt, name='dispatch')
# class RegisterWithNationalIDView(View):
#     """Register a user with their national ID and face image"""

#     def post(self, request, *args, **kwargs):
#         if not request.user.is_authenticated:
#             return JsonResponse({'error': 'User not authenticated.'}, status=401)

#         data = json.loads(request.body)
#         national_id = data.get('national_id')
#         image_data = data.get('image')
#         if not national_id or not image_data:
#             return JsonResponse({'error': 'National ID and image required.'}, status=400)

#         # Simulate Fayda API integration
#         if User.objects.filter(username=national_id).exists():
#             user = User.objects.get(username=national_id)
#         else:
#             user = User.objects.create_user(username=national_id, password=User.objects.make_random_password())

#         face_encoding = encode_face_from_base64(image_data)
#         if face_encoding is None:
#             return JsonResponse({'error': 'No face detected.'}, status=400)

#         profile, created = UserProfile.objects.get_or_create(user=user)
#         profile.face_encoding = face_encoding
#         profile.save()

#         return JsonResponse({'success': True, 'national_id': national_id})
    
