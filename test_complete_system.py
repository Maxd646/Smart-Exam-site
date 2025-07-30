#!/usr/bin/env python3
"""
Complete system test for anti-cheating system
Tests: Login, Monitoring, Alerts, Admin Dashboard
"""

import requests
import json
import time
import sys
import os

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_connection():
    """Test if backend is running"""
    print("🧪 Testing Backend Connection...")
    try:
        response = requests.get(f"{BACKEND_URL}/authentication/alerts/", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running and accessible")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running")
        print("💡 Start backend with: cd backend && python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ Backend connection error: {e}")
        return False

def test_login_endpoints():
    """Test login endpoints"""
    print("\n🧪 Testing Login Endpoints...")
    
    endpoints = [
        ("Face Login", "/authentication/login/"),
        ("Iris Login", "/authentication/login/iris/"),
        ("Fingerprint Login", "/authentication/login/fingerprint/"),
    ]
    
    for name, endpoint in endpoints:
        try:
            response = requests.post(f"{BACKEND_URL}{endpoint}", 
                                   json={"username": "test", "password": "test"},
                                   timeout=5)
            if response.status_code in [400, 401]:  # Expected for missing biometric data
                print(f"✅ {name} endpoint working (returned expected error)")
            else:
                print(f"⚠️ {name} endpoint returned unexpected status {response.status_code}")
        except Exception as e:
            print(f"❌ {name} endpoint error: {e}")

def test_monitoring_start():
    """Test starting behavioral monitoring"""
    print("\n🧪 Testing Monitoring Start...")
    try:
        response = requests.post(f"{BACKEND_URL}/authentication/start-monitoring/",
                               json={"username": "test_student"},
                               timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Monitoring start endpoint working")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ Monitoring start failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Monitoring start error: {e}")
        return False

def test_fayda_callback():
    """Test Fayda callback endpoint"""
    print("\n🧪 Testing Fayda Callback...")
    try:
        user_data = {"username": "test_user", "biometric": "face", "verified": True}
        params = {
            "code": "FAYDA_AUTH_CODE_123",
            "state": json.dumps(user_data)
        }
        
        response = requests.get(f"{BACKEND_URL}/authentication/fayda-callback/", 
                              params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Fayda callback working")
            print(f"   Response: {data}")
            return True
        else:
            print(f"❌ Fayda callback failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Fayda callback error: {e}")
        return False

def test_alert_creation():
    """Test creating an alert"""
    print("\n🧪 Testing Alert Creation...")
    try:
        alert_data = {
            "username": "test_student",
            "alert_type": "behavioral",
            "message": "Test alert from system test",
            "timestamp": time.time(),
            "biometric": "face",
            "device_mac": "AA:BB:CC:DD:EE:FF",
            "device_type": "webcam",
            "signal_strength": 100,
            "ip_address": "127.0.0.1",
            "wifi_ssid": "test_network",
            "latitude": 0.0,
            "longitude": 0.0
        }
        
        response = requests.post(f"{BACKEND_URL}/authentication/alerts/",
                               json=alert_data, timeout=5)
        if response.status_code == 200:
            print("✅ Alert creation working")
            return True
        else:
            print(f"❌ Alert creation failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Alert creation error: {e}")
        return False

def test_behavioral_monitor():
    """Test behavioral monitor import"""
    print("\n🧪 Testing Behavioral Monitor...")
    try:
        sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))
        from behavioral_monitor import start_monitoring
        print("✅ Behavioral monitor can be imported")
        print("💡 To test monitoring: python start_monitoring.py --username test_student")
        return True
    except ImportError as e:
        print(f"❌ Behavioral monitor import error: {e}")
        print("💡 Install dependencies: pip install -r backend/requirements.txt")
        return False
    except Exception as e:
        print(f"❌ Behavioral monitor error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting Complete Anti-Cheating System Test")
    print("=" * 60)
    
    tests = [
        ("Backend Connection", test_backend_connection),
        ("Login Endpoints", test_login_endpoints),
        ("Monitoring Start", test_monitoring_start),
        ("Fayda Callback", test_fayda_callback),
        ("Alert Creation", test_alert_creation),
        ("Behavioral Monitor", test_behavioral_monitor),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name}...")
        result = test_func()
        results.append((test_name, result))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print("=" * 60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\n🎯 Overall: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 All tests passed! System is ready for production!")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
    
    print("\n📝 Next Steps:")
    print("   1. Start Django backend: cd backend && python manage.py runserver")
    print("   2. Start React frontend: cd frontend && npm start")
    print("   3. Test login flow: http://localhost:3000")
    print("   4. Test monitoring: python start_monitoring.py --username test_student")
    print("   5. Check admin dashboard for alerts")

if __name__ == "__main__":
    main() 