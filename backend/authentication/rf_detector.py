def scan_rf_devices():
    detected = {
        ("UNAUTHORIZED123", "Game Controller"),
        ("RF123456", "Approved Device"),
        ("GAMING_DEVICE_XYZ", "Headset")
    }
    return detected

def check_for_unauthorized_devices():
    detected = scan_rf_devices()
    return [(id, name) for id, name in detected if id not in APPROVED_RF_IDS]
