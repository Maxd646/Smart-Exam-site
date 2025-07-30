#!/usr/bin/env python3
"""
Test script for Fayda integration and anti-cheating system
"""

import requests
import json
import time

# Configuration
BACKEND_URL = "http://localhost:8000"
FAYDA_CALLBACK_URL = f"{BACKEND_URL}/authentication/fayda-callback/"

def test_fayda_callback():
    """Test the Fayda callback endpoint"""
    print("🧪 Testing Fayda Callback Integration...")
    
    # Simulate user data that would be passed from frontend
    user_data = {
        "username": "test_user",
        "biometric": "face",
        "verified": True
    }
    
    # Simulate Fayda callback parameters
    params = {
        "code": "FAYDA_AUTH_CODE_123",
        "state": json.dumps(user_data)
    }
    
    try:
        response = requests.get(FAYDA_CALLBACK_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Fayda callback successful!")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ Fayda callback failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server")
        print("   Make sure the Django server is running: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Error testing Fayda callback: {e}")
        return False

def test_backend_alerts():
    """Test the alerts endpoint"""
    print("\n🧪 Testing Alerts Endpoint...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/authentication/alerts/")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Alerts endpoint working!")
            print(f"   Found {len(data.get('alerts', []))} alerts")
            return True
        else:
            print(f"❌ Alerts endpoint failed with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend server")
        return False
    except Exception as e:
        print(f"❌ Error testing alerts: {e}")
        return False

def test_behavioral_monitor():
    """Test the behavioral monitoring script"""
    print("\n🧪 Testing Behavioral Monitor...")
    
    try:
        # Import and test the behavioral monitor
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
        
        from behavioral_monitor import send_alert
        
        # Test sending an alert
        test_alert = {
            "username": "test_user",
            "alert_type": "behavioral",
            "message": "Test behavioral alert",
            "timestamp": time.time()
        }
        
        result = send_alert(test_alert)
        print("✅ Behavioral monitor test successful!")
        return True
        
    except ImportError as e:
        print(f"❌ Could not import behavioral monitor: {e}")
        print("   Make sure all dependencies are installed")
        return False
    except Exception as e:
        print(f"❌ Error testing behavioral monitor: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Anti-Cheating System Integration Tests")
    print("=" * 50)
    
    tests = [
        ("Backend Alerts", test_backend_alerts),
        ("Fayda Callback", test_fayda_callback),
        ("Behavioral Monitor", test_behavioral_monitor),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! System is ready for use.")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
    
    print("\n📝 Next Steps:")
    print("   1. Start the Django backend: python manage.py runserver")
    print("   2. Start the React frontend: npm start")
    print("   3. Access the application at: http://localhost:3000")
    print("   4. Test the complete login flow with Fayda integration")

if __name__ == "__main__":
    main() 