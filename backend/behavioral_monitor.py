import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime
import os
import requests
import json
from ultralytics import YOLO

# --- Config ---
LOG_FILE = "suspicious_log.txt"
BACKEND_URL = "http://localhost:8000/authentication/alerts/"
DEVICE_CLASSES = ['cell phone', 'laptop', 'tablet', 'tv', 'remote']  # YOLOv8 class names for devices

# --- MediaPipe Setup ---
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh
pose = mp_pose.Pose()
hands = mp_hands.Hands()
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False)

# --- YOLOv8 Setup ---
yolo_model = YOLO('yolov8n.pt')  # Use nano model for speed; download if needed

# --- Video Capture ---
cap = cv2.VideoCapture(0)

# --- Helper: Log and Alert ---
def log_and_alert(event, frame=None, username="unknown_user"):
    """Send alert to admin/supervisor dashboard"""
    timestamp = datetime.now()
    
    # Log locally
    with open(LOG_FILE, "a") as log:
        log.write(f"Time: {timestamp}, User: {username}, Event: {event}\n")
    
    print(f"[ALERT] {event} - User: {username}")
    
    # Send alert to admin dashboard
    try:
        alert_data = {
            "username": username,
            "alert_type": "behavioral",
            "message": event,
            "timestamp": timestamp.isoformat(),
            "biometric": "face",  # Default biometric type
            "device_mac": "N/A",
            "device_type": "webcam",
            "signal_strength": 100,
            "ip_address": "127.0.0.1",
            "wifi_ssid": "exam_network",
            "latitude": 0.0,
            "longitude": 0.0
        }
        
        response = requests.post(BACKEND_URL, json=alert_data, timeout=5)
        if response.status_code == 200:
            print(f"✅ Alert sent to admin dashboard successfully")
        else:
            print(f"⚠️ Alert sent but server returned status {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to admin dashboard - make sure Django server is running")
    except Exception as e:
        print(f"❌ Failed to send alert: {e}")
    
    # Save screenshot as evidence
    if frame is not None:
        fname = f"screenshot_{event.replace(' ', '_')}_{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
        cv2.imwrite(fname, frame)
        print(f"📸 Evidence saved: {fname}")

def start_monitoring(username="student1"):
    """Start behavioral monitoring for a specific user after login"""
    print(f"🔍 Starting behavioral monitoring for user: {username}")
    print("📹 Initializing camera and AI models...")
    
    # Take initial reference frame
    print("[INFO] Taking initial reference frame. Please sit still...")
    ret, ref_frame = cap.read()
    if not ret:
        print("[ERROR] Could not capture initial frame.")
        return False
    
    ref_gray = cv2.cvtColor(ref_frame, cv2.COLOR_BGR2GRAY)
    ref_objects = set()
    
    # Detect initial objects
    try:
        results = yolo_model(ref_frame)
        for r in results:
            for c, name in zip(r.boxes.cls, r.names.values()):
                if name in DEVICE_CLASSES:
                    ref_objects.add(name)
        print(f"[INFO] Initial objects detected: {ref_objects}")
    except Exception as e:
        print(f"[WARNING] Could not detect initial objects: {e}")
    
    print("✅ Monitoring started! All suspicious activities will be reported to admin.")
    
    # Main monitoring loop
    hands_out_of_view = False
    chest_out_of_view = False
    face_direction = 'center'
    scene_change_count = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        h, w, _ = frame.shape
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        alerts = []

        # --- Pose Detection: Hands & Chest ---
        pose_results = pose.process(img_rgb)
        if pose_results.pose_landmarks:
            # Check if wrists and chest are in frame
            wrist_l = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
            wrist_r = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
            shoulder_l = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            shoulder_r = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            chest_x = int((shoulder_l.x + shoulder_r.x) / 2 * w)
            chest_y = int((shoulder_l.y + shoulder_r.y) / 2 * h)
            
            # Hands detection
            hands_visible = (0 <= wrist_l.x <= 1 and 0 <= wrist_l.y <= 1) or (0 <= wrist_r.x <= 1 and 0 <= wrist_r.y <= 1)
            if not hands_visible:
                cv2.putText(frame, "Hands Out of View!", (30, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                if not hands_out_of_view:
                    log_and_alert("Hands Out of View", frame, username)
                    hands_out_of_view = True
            else:
                hands_out_of_view = False
                
            # Chest detection
            if not (0 <= chest_x < w and 0 <= chest_y < h):
                cv2.putText(frame, "Chest Out of View!", (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                if not chest_out_of_view:
                    log_and_alert("Chest Out of View", frame, username)
                    chest_out_of_view = True
            else:
                chest_out_of_view = False

        # --- Face Direction Detection ---
        face_results = face_mesh.process(img_rgb)
        if face_results.multi_face_landmarks:
            for face_landmarks in face_landmarks in face_results.multi_face_landmarks:
                # Get nose and chin positions
                nose = face_landmarks.landmark[1]  # nose tip
                chin = face_landmarks.landmark[152]  # chin
                
                # Calculate head direction
                nose_y = int(nose.y * h)
                chin_y = int(chin.y * h)
                
                if (chin_y - nose_y) > 60:
                    cv2.putText(frame, "Looking Down!", (30, 90), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                    if face_direction != 'down':
                        log_and_alert("Looking Down (Possible Phone Use)", frame, username)
                        face_direction = 'down'
                else:
                    face_direction = 'center'

        # --- Scene Change Detection ---
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        diff = cv2.absdiff(ref_gray, gray)
        mean_diff = np.mean(diff)
        
        if mean_diff > 30:  # Threshold for significant scene change
            scene_change_count += 1
            if scene_change_count > 5:  # Multiple consecutive changes
                cv2.putText(frame, "Scene Changed!", (30, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                log_and_alert("Scene Changed Significantly", frame, username)
                scene_change_count = 0
        else:
            scene_change_count = 0

        # --- Object Detection (Devices) ---
        try:
            results = yolo_model(frame)
            current_objects = set()
            
            for r in results:
                for c, name in zip(r.boxes.cls, r.names.values()):
                    if name in DEVICE_CLASSES:
                        current_objects.add(name)
            
            # Check for new devices
            new_objects = current_objects - ref_objects
            if new_objects:
                cv2.putText(frame, f"New Device: {', '.join(new_objects)}!", (30, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                log_and_alert(f"New Device Detected: {', '.join(new_objects)}", frame, username)
                
        except Exception as e:
            # Skip object detection if there's an error
            pass

        # --- Brightness Detection (Phone Screen) ---
        roi = frame[int(h * 0.75):, :]  # Bottom 25% of screen
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray_roi)
        
        if mean_brightness > 90:  # Adjust based on room brightness
            cv2.putText(frame, "Bright Light Below!", (30, 180), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 0), 2)
            log_and_alert("Bright Light Detected Below (Possible Phone Screen)", frame, username)

        # --- Display monitoring status ---
        cv2.putText(frame, f"Monitoring: {username}", (10, h-20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        # Show the frame
        cv2.imshow("Behavioral Monitoring", frame)
        
        # Break on 'q' press
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    # Cleanup
    cap.release()
    cv2.destroyAllWindows()
    pose.close()
    hands.close()
    face_mesh.close()
    return True

if __name__ == "__main__":
    # For testing purposes
    username = os.environ.get("EXAM_USERNAME", "test_student")
    start_monitoring(username) 