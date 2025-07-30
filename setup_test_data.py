#!/usr/bin/env python3
"""
Setup test data for the anti-cheating system
Creates a test user with biometric data for testing
"""
import os
import sys
import django
import base64
import numpy as np

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'anti_cheating.settings')
django.setup()

from django.contrib.auth.models import User
from authentication.models import UserProfile
from authentication.face_recognition import encode_face_from_base64

def create_test_user():
    """Create a test user with biometric data"""
    
    # Create test user
    username = 'student1'
    password = 'password123'
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        print(f"✅ User '{username}' already exists")
    else:
        user = User.objects.create_user(username=username, password=password)
        print(f"✅ Created user '{username}' with password '{password}'")
    
    # Create or update user profile
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Create a dummy face encoding for testing
    # In a real system, this would be the actual face encoding from registration
    dummy_face_encoding = np.random.rand(128).astype(np.float64)
    profile.face_encoding = dummy_face_encoding.tobytes()
    
    # Create dummy iris and fingerprint encodings
    dummy_iris_encoding = b'dummy_iris_encoding_for_testing'
    dummy_fingerprint_encoding = b'dummy_fingerprint_encoding_for_testing'
    
    profile.iris_encoding = dummy_iris_encoding
    profile.fingerprint_encoding = dummy_fingerprint_encoding
    profile.save()
    
    print(f"✅ User profile created with biometric data")
    print(f"   - Face encoding: ✅")
    print(f"   - Iris encoding: ✅")
    print(f"   - Fingerprint encoding: ✅")
    
    return user, profile

def main():
    print("🚀 Setting up test data for SentinelNet...")
    print("=" * 50)
    
    try:
        user, profile = create_test_user()
        print("\n✅ Test data setup complete!")
        print(f"📝 Test credentials:")
        print(f"   Username: {user.username}")
        print(f"   Password: password123")
        print(f"   Biometric: Face, Iris, Fingerprint")
        print("\n🎯 You can now test the two-step verification:")
        print("   1. Verify credentials (username/password)")
        print("   2. Verify biometric (face/iris/fingerprint)")
        
    except Exception as e:
        print(f"❌ Error setting up test data: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎉 Ready to test! Start the frontend and try logging in.")
    else:
        print("\n💥 Setup failed. Please check the error above.") 