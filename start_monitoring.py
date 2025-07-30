#!/usr/bin/env python3
"""
Manual script to start behavioral monitoring for testing
Usage: python start_monitoring.py --username student_name
"""

import argparse
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def main():
    parser = argparse.ArgumentParser(description='Start behavioral monitoring for a user')
    parser.add_argument('--username', required=True, help='Username to monitor')
    parser.add_argument('--test', action='store_true', help='Run in test mode')
    
    args = parser.parse_args()
    
    try:
        from behavioral_monitor import start_monitoring
        
        print(f"🚀 Starting behavioral monitoring for user: {args.username}")
        print("📹 This will start AI-powered monitoring and send alerts to admin dashboard")
        print("⚠️  Make sure Django server is running: python manage.py runserver")
        print("🔴 Press 'q' to stop monitoring")
        print("-" * 50)
        
        success = start_monitoring(args.username)
        
        if success:
            print("✅ Monitoring completed successfully")
        else:
            print("❌ Monitoring failed to start")
            
    except ImportError as e:
        print(f"❌ Error importing behavioral monitor: {e}")
        print("💡 Make sure all dependencies are installed: pip install -r backend/requirements.txt")
    except Exception as e:
        print(f"❌ Error starting monitoring: {e}")

if __name__ == "__main__":
    main() 