import cv2
import os
import uuid
import json
import base64
import requests
import geocoder
import numpy as np
from datetime import datetime
from ultralytics import YOLO
import mediapipe as mp

# --- CONFIG ---
LOG_FILE = "suspicious_log.txt"
BACKEND_URL = "http://localhost:8000/authentication/alerts/"
DEVICE_CLASSES = ['cell phone', 'laptop', 'tablet', 'tv', 'remote']

# --- Initialize MediaPipe ---
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands
mp_face_mesh = mp.solutions.face_mesh
pose = mp_pose.Pose()
hands = mp_hands.Hands()
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False)

# YOLO Model 
yolo_model = YOLO('yolov8n.pt')

# Webcam 
cap = cv2.VideoCapture(0)


#  Utility Functions 
def get_mac_address():
    """Return the MAC address of the device"""
    mac = ':'.join(['{:02x}'.format((uuid.getnode() >> ele) & 0xff)
                   for ele in range(0, 8 * 6, 8)][::-1])
    return mac

def get_location():
    """Get latitude and longitude from IP"""
    g = geocoder.ip('me')
    if g.ok:
        return g.latlng
    return (None, None)

def log_and_alert(event, frame=None, username="unknown_user"):
    """Send alert to admin/supervisor dashboard"""
    timestamp = datetime.now()
    device_mac = get_mac_address()
    latitude, longitude = get_location()

    # Log locally
    with open(LOG_FILE, "a") as log:
        log.write(f"Time: {timestamp}, User: {username}, Event: {event}\n")

    print(f"[ALERT] {event} - User: {username}")

    # Handle image
    photo_base64 = None
    if frame is not None:
        _, buffer = cv2.imencode('.jpg', frame)
        photo_base64 = base64.b64encode(buffer).decode('utf-8')

    # Prepare alert data
    alert_data = {
        "username": username,
        "reason": event,
        "timestamp": timestamp.isoformat(),
        "device_mac": device_mac,
        "latitude": latitude,
        "longitude": longitude,
        "photo": photo_base64
    }

    try:
        response = requests.post(BACKEND_URL, json=alert_data, timeout=5)
        if response.status_code == 200:
            print("✅ Alert sent successfully")
        else:
            print(f"⚠️ Alert failed with status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send alert: {e}")

# --- Monitoring Logic ---
def start_monitoring(username="student1"):
    print(f"🔍 Starting monitoring for: {username}")

    ret, ref_frame = cap.read()
    if not ret:
        print("[ERROR] Cannot capture frame.")
        return

    ref_gray = cv2.cvtColor(ref_frame, cv2.COLOR_BGR2GRAY)
    ref_objects = set()

    # Initial object detection
    try:
        results = yolo_model(ref_frame)
        for r in results:
            for c, name in zip(r.boxes.cls, r.names.values()):
                if name in DEVICE_CLASSES:
                    ref_objects.add(name)
    except Exception:
        pass

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

        # Pose Detection
        pose_results = pose.process(img_rgb)
        if pose_results.pose_landmarks:
            wrist_l = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
            wrist_r = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
            shoulder_l = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER]
            shoulder_r = pose_results.pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER]
            chest_x = int((shoulder_l.x + shoulder_r.x) / 2 * w)
            chest_y = int((shoulder_l.y + shoulder_r.y) / 2 * h)

            hands_visible = (0 <= wrist_l.x <= 1 and 0 <= wrist_l.y <= 1) or (0 <= wrist_r.x <= 1 and 0 <= wrist_r.y <= 1)
            if not hands_visible and not hands_out_of_view:
                log_and_alert("Hands Out of View", frame, username)
                hands_out_of_view = True
            elif hands_visible:
                hands_out_of_view = False

            if not (0 <= chest_x < w and 0 <= chest_y < h) and not chest_out_of_view:
                log_and_alert("Chest Out of View", frame, username)
                chest_out_of_view = True
            elif 0 <= chest_x < w and 0 <= chest_y < h:
                chest_out_of_view = False

        # Face Direction Detection
        face_results = face_mesh.process(img_rgb)
        if face_results.multi_face_landmarks:
            for face_landmarks in face_results.multi_face_landmarks:
                nose = face_landmarks.landmark[1]
                chin = face_landmarks.landmark[152]
                nose_y = int(nose.y * h)
                chin_y = int(chin.y * h)

                if (chin_y - nose_y) > 60 and face_direction != 'down':
                    log_and_alert("Looking Down (Phone Use)", frame, username)
                    face_direction = 'down'
                elif (chin_y - nose_y) <= 60:
                    face_direction = 'center'

        # Scene Change
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        diff = cv2.absdiff(ref_gray, gray)
        mean_diff = np.mean(diff)

        if mean_diff > 30:
            scene_change_count += 1
            if scene_change_count > 5:
                log_and_alert("Scene Changed", frame, username)
                scene_change_count = 0
        else:
            scene_change_count = 0

        # Object Detection
        try:
            results = yolo_model(frame)
            current_objects = set()
            for r in results:
                for c, name in zip(r.boxes.cls, r.names.values()):
                    if name in DEVICE_CLASSES:
                        current_objects.add(name)
            new_objects = current_objects - ref_objects
            if new_objects:
                log_and_alert(f"New Device Detected: {', '.join(new_objects)}", frame, username)
        except Exception:
            pass

        # Brightness Detection
        roi = frame[int(h * 0.75):, :]
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray_roi)

        if mean_brightness > 90:
            log_and_alert("Bright Light Detected (Phone Screen?)", frame, username)

        cv2.imshow("Behavioral Monitoring", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    pose.close()
    hands.close()
    face_mesh.close()

if __name__ == "__main__":
    username = os.environ.get("EXAM_USERNAME", "test_student")
    start_monitoring(username)
