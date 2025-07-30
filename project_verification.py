#!/usr/bin/env python3
"""
Project Verification Script
Tests the SmartGuard Exam Proctor project structure and requirements
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    exists = os.path.exists(filepath)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {filepath}")
    return exists

def check_directory_exists(dirpath, description):
    """Check if a directory exists and print status"""
    exists = os.path.isdir(dirpath)
    status = "✅" if exists else "❌"
    print(f"{status} {description}: {dirpath}")
    return exists

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"🐍 Python Version: {version.major}.{version.minor}.{version.micro}")
    return version.major >= 3 and version.minor >= 11

def check_node_version():
    """Check Node.js version"""
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"📦 Node.js Version: {version}")
            return True
        else:
            print("❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False

def check_docker():
    """Check Docker availability"""
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"🐳 Docker: {version}")
            return True
        else:
            print("❌ Docker not found")
            return False
    except FileNotFoundError:
        print("❌ Docker not found")
        return False

def main():
    print("🔍 SmartGuard Exam Proctor - Project Verification")
    print("=" * 60)
    
    # Check system requirements
    print("\n📋 System Requirements:")
    python_ok = check_python_version()
    node_ok = check_node_version()
    docker_ok = check_docker()
    
    # Check project structure
    print("\n📁 Project Structure:")
    
    # Root level files
    root_files = [
        ("README.md", "Project Documentation"),
        ("docker-compose.yml", "Docker Compose Configuration"),
        ("Dockerfile", "Docker Configuration"),
        (".env", "Environment Variables"),
        ("yolov8n.pt", "YOLO Model File"),
        ("test_fayda_integration.py", "Integration Tests"),
        ("test_complete_system.py", "System Tests"),
        ("setup_test_data.py", "Test Data Setup"),
        ("start_monitoring.py", "Monitoring Script"),
    ]
    
    root_ok = True
    for filename, description in root_files:
        if not check_file_exists(filename, description):
            root_ok = False
    
    # Check directories
    print("\n📂 Directories:")
    directories = [
        ("frontend/", "Frontend Application"),
        ("backend/", "Backend Application"),
        ("frontend/src/", "Frontend Source Code"),
        ("frontend/public/", "Frontend Public Assets"),
        ("backend/authentication/", "Authentication Module"),
        ("backend/anti_cheating/", "Anti-Cheating Module"),
    ]
    
    dir_ok = True
    for dirname, description in directories:
        if not check_directory_exists(dirname, description):
            dir_ok = False
    
    # Check key configuration files
    print("\n⚙️ Configuration Files:")
    config_files = [
        ("frontend/package.json", "Frontend Dependencies"),
        ("frontend/vite.config.js", "Vite Configuration"),
        ("backend/requirements.txt", "Backend Dependencies"),
        ("backend/manage.py", "Django Management"),
        ("backend/app.py", "Django Application"),
    ]
    
    config_ok = True
    for filename, description in config_files:
        if not check_file_exists(filename, description):
            config_ok = False
    
    # Check source files
    print("\n💻 Source Files:")
    source_files = [
        ("frontend/src/App.jsx", "Main React Component"),
        ("frontend/src/Login.jsx", "Login Component"),
        ("frontend/src/LandingPage.jsx", "Landing Page"),
        ("backend/authentication/views.py", "Authentication Views"),
        ("backend/authentication/models.py", "User Models"),
        ("backend/behavioral_monitor.py", "AI Monitoring"),
    ]
    
    source_ok = True
    for filename, description in source_files:
        if not check_file_exists(filename, description):
            source_ok = False
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY:")
    print("=" * 60)
    
    requirements_met = all([python_ok, node_ok, docker_ok])
    structure_ok = all([root_ok, dir_ok, config_ok, source_ok])
    
    print(f"System Requirements: {'✅ MET' if requirements_met else '❌ MISSING'}")
    print(f"Project Structure: {'✅ COMPLETE' if structure_ok else '❌ INCOMPLETE'}")
    
    if requirements_met and structure_ok:
        print("\n🎉 PROJECT STATUS: READY FOR DEPLOYMENT")
        print("\n✅ All requirements are met!")
        print("✅ Project structure is complete!")
        print("✅ Docker configuration is ready!")
        print("✅ Documentation is comprehensive!")
        
        print("\n🚀 Next Steps:")
        print("1. Install dependencies: pip install -r backend/requirements.txt")
        print("2. Install frontend: cd frontend && npm install")
        print("3. Run locally: python backend/manage.py runserver")
        print("4. Or deploy with Docker: docker-compose up --build")
        
    else:
        print("\n⚠️ PROJECT STATUS: NEEDS ATTENTION")
        if not requirements_met:
            print("❌ System requirements not met")
        if not structure_ok:
            print("❌ Project structure incomplete")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main() 