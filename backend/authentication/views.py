import base64
import numpy as np
import face_recognition
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile, ExamSession, Alert
from .face_recognition import encode_face_from_base64
import json
from django.contrib.auth import authenticate
from django.views.decorators.http import require_GET
import os
import requests
from django.shortcuts import redirect
from django.conf import settings
from urllib.parse import urlencode

@csrf_exempt
@login_required
def start_exam_session(request):
    if request.method == 'POST':
        ExamSession.objects.create(user=request.user)
        return JsonResponse({'message': 'Exam session started successfully.'})
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
@login_required
def upload_face_image(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        image_data = data.get('image')  # base64 string
        if not image_data:
            return JsonResponse({'error': 'Image data missing.'}, status=400)

        image_bytes = base64.b64decode(image_data.split(',')[-1])
        np_array = np.frombuffer(image_bytes, dtype=np.uint8)
        image = face_recognition.load_image_file(np_array)

        try:
            user_profile = UserProfile.objects.get(user=request.user)
            known_encoding = np.frombuffer(user_profile.face_encoding)

            face_encodings = face_recognition.face_encodings(image)
            if not face_encodings:
                return JsonResponse({'error': 'No face detected.'}, status=400)

            result = face_recognition.compare_faces([known_encoding], face_encodings[0])
            if result[0]:
                return JsonResponse({'verified': True})
            else:
                return JsonResponse({'verified': False})
        except UserProfile.DoesNotExist:
            return JsonResponse({'error': 'User profile not found.'}, status=404)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def register_with_national_id(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        national_id = data.get('national_id')
        image_data = data.get('image')
        if not national_id or not image_data:
            return JsonResponse({'error': 'National ID and image required.'}, status=400)
        # Fayda API integration would go here (simulate for now)
        # For now, just use national_id as username
        if User.objects.filter(username=national_id).exists():
            user = User.objects.get(username=national_id)
        else:
            user = User.objects.create_user(username=national_id, password=User.objects.make_random_password())
        face_encoding = encode_face_from_base64(image_data)
        if face_encoding is None:
            return JsonResponse({'error': 'No face detected.'}, status=400)
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.face_encoding = face_encoding
        profile.save()
        return JsonResponse({'success': True, 'national_id': national_id})
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def verify_credentials(request):
    """Step 1: Verify username and password are registered"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return JsonResponse({'error': 'Username and password required.'}, status=400)
        
        # Check if user exists and credentials are correct
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({
                'verified': False, 
                'error': 'Invalid username or password.',
                'step': 'credentials_failed'
            }, status=401)
        # Check if user is blocked
        try:
            profile = UserProfile.objects.get(user=user)
            if profile.blocked:
                return JsonResponse({'verified': False, 'error': 'User is blocked by supervisor.', 'step': 'blocked'}, status=403)
            
            has_face = profile.face_encoding is not None
            has_iris = profile.iris_encoding is not None
            has_fingerprint = profile.fingerprint_encoding is not None
            
            return JsonResponse({
                'verified': True,
                'username': username,
                'step': 'credentials_verified',
                'message': 'Credentials verified. Please provide biometric data.',
                'available_biometrics': {
                    'face': has_face,
                    'iris': has_iris,
                    'fingerprint': has_fingerprint
                }
            })
        except UserProfile.DoesNotExist:
            return JsonResponse({
                'verified': False,
                'error': 'User profile not found. Please register biometric data.',
                'step': 'no_profile'
            }, status=404)
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def verify_biometric(request):
    """Step 2: Verify biometric data matches the registered user"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        biometric_type = data.get('biometric_type')  # 'face', 'iris', 'fingerprint'
        biometric_data = data.get('biometric_data')  # base64 string
        
        if not username or not biometric_type or not biometric_data:
            return JsonResponse({'error': 'Username, biometric type, and biometric data required.'}, status=400)
        
        try:
            user = User.objects.get(username=username)
            profile = UserProfile.objects.get(user=user)
        except (User.DoesNotExist, UserProfile.DoesNotExist):
            return JsonResponse({'error': 'User not found.'}, status=404)
        
        # Verify biometric based on type
        if profile.blocked:
            return JsonResponse({'verified': False, 'error': 'User is blocked by supervisor.', 'step': 'blocked'}, status=403)
        if biometric_type == 'face':
            from .face_recognition import compare_faces
            match = compare_faces(profile.face_encoding, biometric_data)
            if not match:
                return JsonResponse({
                    'verified': False,
                    'error': 'Face does not match registered user.',
                    'step': 'biometric_failed'
                }, status=401)
        elif biometric_type == 'iris':
            # Placeholder for iris comparison
            match = profile.iris_encoding is not None and biometric_data == 'SIMULATED_MATCH'
            if not match:
                return JsonResponse({
                    'verified': False,
                    'error': 'Iris does not match registered user.',
                    'step': 'biometric_failed'
                }, status=401)
        elif biometric_type == 'fingerprint':
            # Placeholder for fingerprint comparison
            match = profile.fingerprint_encoding is not None and biometric_data == 'SIMULATED_MATCH'
            if not match:
                return JsonResponse({
                    'verified': False,
                    'error': 'Fingerprint does not match registered user.',
                    'step': 'biometric_failed'
                }, status=401)
        else:
            return JsonResponse({'error': 'Invalid biometric type.'}, status=400)
        
        # Biometric verification successful
        return JsonResponse({
            'verified': True,
            'username': username,
            'biometric_type': biometric_type,
            'step': 'biometric_verified',
            'message': 'Biometric verification successful. Redirecting to exam...'
        })
    
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def login_with_face(request):
    """Legacy function - kept for backward compatibility"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        image_data = data.get('image')
        if not username or not password or not image_data:
            return JsonResponse({'error': 'Username, password, and image required.'}, status=400)
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)
        from .face_recognition import compare_faces
        match = compare_faces(profile.face_encoding, image_data)
        if match:
            return JsonResponse({'verified': True, 'username': username})
        else:
            return JsonResponse({'verified': False, 'error': 'Face does not match.'}, status=401)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def login_with_iris(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        iris_data = data.get('iris')  # base64 string
        if not username or not password or not iris_data:
            return JsonResponse({'error': 'Username, password, and iris image required.'}, status=400)
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)
        # Placeholder for iris comparison logic
        # Replace with actual iris recognition logic
        match = profile.iris_encoding is not None and iris_data == 'SIMULATED_MATCH'  # Simulate match
        if match:
            return JsonResponse({'verified': True, 'username': username, 'biometric': 'iris'})
        else:
            return JsonResponse({'verified': False, 'error': 'Iris does not match.'}, status=401)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def login_with_fingerprint(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        fingerprint_data = data.get('fingerprint')  # base64 string
        if not username or not password or not fingerprint_data:
            return JsonResponse({'error': 'Username, password, and fingerprint data required.'}, status=400)
        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({'verified': False, 'error': 'Invalid username or password.'}, status=401)
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return JsonResponse({'verified': False, 'error': 'User profile not found.'}, status=404)
        # Placeholder for fingerprint comparison logic
        # Replace with actual fingerprint recognition logic
        match = profile.fingerprint_encoding is not None and fingerprint_data == 'SIMULATED_MATCH'  # Simulate match
        if match:
            return JsonResponse({'verified': True, 'username': username, 'biometric': 'fingerprint'})
        else:
            return JsonResponse({'verified': False, 'error': 'Fingerprint does not match.'}, status=401)
    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@require_GET
def list_alerts(request):
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

@csrf_exempt
def start_behavioral_monitoring(request):
    """Start behavioral monitoring for a user after successful login"""
    if request.method == 'POST':
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
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def fayda_callback(request):
    """Handle Fayda OIDC callback after successful authentication"""
    if request.method == 'GET':
        # Extract parameters from Fayda callback
        code = request.GET.get('code')
        state = request.GET.get('state')
        
        if not code or not state:
            return JsonResponse({'error': 'Missing required parameters'}, status=400)
        
        try:
            # Parse the state parameter to get user data
            import json
            user_data = json.loads(state)
            
            # In a real implementation, you would:
            # 1. Exchange the authorization code for tokens with Fayda
            # 2. Verify the tokens
            # 3. Get user information from Fayda
            # 4. Update the user's profile with Fayda data
            
            # For now, we'll simulate successful verification
            return JsonResponse({
                'verified': True,
                'username': user_data.get('username'),
                'fayda_verified': True,
                'message': 'Successfully verified with Fayda'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid state parameter'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'Verification failed: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_env(key, default=None):
    return os.environ.get(key, getattr(settings, key, default))

@csrf_exempt
def verifayda_login(request):
    """Redirect user to VeriFayda OIDC authorization endpoint"""
    client_id = get_env('VERIFAYDA_CLIENT_ID')
    redirect_uri = get_env('VERIFAYDA_REDIRECT_URI')
    authorization_endpoint = get_env('VERIFAYDA_AUTHORIZATION_ENDPOINT')
    state = 'verifayda_' + os.urandom(8).hex()
    params = {
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'response_type': 'code',
        'scope': 'openid profile',
        'state': state,
    }
    url = f"{authorization_endpoint}?{urlencode(params)}"
    return redirect(url)

@csrf_exempt
def verifayda_callback(request):
    """Handle VeriFayda OIDC callback, exchange code for token, fetch user info"""
    code = request.GET.get('code')
    state = request.GET.get('state')
    if not code:
        return JsonResponse({'error': 'Missing code from VeriFayda.'}, status=400)
    # Exchange code for token
    token_endpoint = get_env('VERIFAYDA_TOKEN_ENDPOINT')
    client_id = get_env('VERIFAYDA_CLIENT_ID')
    redirect_uri = get_env('VERIFAYDA_REDIRECT_URI')
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
    }
    token_resp = requests.post(token_endpoint, data=data)
    if token_resp.status_code != 200:
        return JsonResponse({'error': 'Failed to get token from VeriFayda.'}, status=401)
    tokens = token_resp.json()
    access_token = tokens.get('access_token')
    if not access_token:
        return JsonResponse({'error': 'No access token from VeriFayda.'}, status=401)
    # Fetch user info
    userinfo_endpoint = get_env('VERIFAYDA_USERINFO_ENDPOINT')
    headers = {'Authorization': f'Bearer {access_token}'}
    userinfo_resp = requests.get(userinfo_endpoint, headers=headers)
    if userinfo_resp.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user info from VeriFayda.'}, status=401)
    userinfo = userinfo_resp.json()
    # You can extract user info as needed, e.g. sub, name, etc.
    # For demo, just return userinfo and require biometric next
    return JsonResponse({
        'step': 'verifayda_authenticated',
        'userinfo': userinfo,
        'message': 'VeriFayda OIDC authentication successful. Please provide biometric data.'
    })

@csrf_exempt
def block_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
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
    return JsonResponse({'error': 'Invalid request method.'}, status=405)
