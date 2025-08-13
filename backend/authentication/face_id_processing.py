import face_recognition
from PIL import Image
from django.core.files.base import ContentFile
import numpy as np
import io

def extract_face_encoding_from_id(image_field):
    try:
        image_bytes = image_field.read()
        image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        locations = face_recognition.face_locations(image)
        if not locations:
            return None

        encodings = face_recognition.face_encodings(image, locations)
        if not encodings:
            return None

        return encodings[0].tobytes()

    except Exception as e:
        print(f"Error extracting face encoding: {e}")
        return None

def extract_and_save_face_image(image_field, profile):
    try:
        image_bytes = image_field.read()
        image = face_recognition.load_image_file(io.BytesIO(image_bytes))
        locations = face_recognition.face_locations(image)

        if not locations:
            return False

        top, right, bottom, left = locations[0]
        face_np = image[top:bottom, left:right]

        pil_img = Image.fromarray(face_np)
        buffer = io.BytesIO()
        pil_img.save(buffer, format='JPEG')
        buffer.seek(0)

        profile.extracted_face_photo.save(
            f"{profile.user.username}_face.jpg",
            ContentFile(buffer.read()),
            save=True
        )
        return True
    except Exception as e:
        print(f"Error extracting/saving face image: {e}")
        return False
