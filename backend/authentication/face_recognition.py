import face_recognition
import numpy as np
from PIL import Image
from io import BytesIO
import base64

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
