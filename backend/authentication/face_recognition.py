import numpy as np
import face_recognition
import base64

def encode_face_from_base64(base64_str):
    """
    Takes a base64 string image and returns a face encoding (if any).
    """
    try:
        image_data = base64.b64decode(base64_str.split(',')[-1])
        np_array = np.frombuffer(image_data, dtype=np.uint8)
        image = face_recognition.load_image_file(np_array)

        encodings = face_recognition.face_encodings(image)
        if encodings:
            return encodings[0].tobytes()  # store as binary
        else:
            return None
    except Exception as e:
        print(f"Error in face encoding: {e}")
        return None

def compare_faces(known_encoding_bytes, unknown_base64_image):
    known_encoding = np.frombuffer(known_encoding_bytes, dtype=np.float64)
    unknown_encoding = encode_face_from_base64(unknown_base64_image)

    if unknown_encoding is None:
        return False

    return face_recognition.compare_faces([known_encoding], np.frombuffer(unknown_encoding, dtype=np.float64))[0]
