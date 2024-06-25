# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import cv2
# import numpy as np
# import imutils
# import easyocr
# import base64
# import logging

# # Set logging level for easyocr
# logging.getLogger('easyocr').setLevel(logging.ERROR)

# app = Flask(__name__)
# CORS(app)  # Add this line to enable CORS

# # Initialize the easyocr Reader
# reader = easyocr.Reader(['en'])

# @app.route('/process_frame', methods=['POST'])
# def process_frame():
#     data = request.json
#     frame_data = data['frame']
#     frame = base64.b64decode(frame_data)
#     nparr = np.frombuffer(frame, np.uint8)
#     frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

#     # Convert the frame to grayscale
#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

#     # Apply bilateral filter and edge detection
#     filt = cv2.bilateralFilter(gray, 11, 17, 17)
#     edged = cv2.Canny(filt, 90, 200)

#     # Find contours
#     keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
#     contours = imutils.grab_contours(keypoints)
#     contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

#     location = None
#     for contour in contours:
#         approx = cv2.approxPolyDP(contour, 10, True)
#         if len(approx) == 4:
#             location = approx
#             break

#     detected_text = []
#     if location is not None:
#         # Create mask and extract the region of interest
#         mask = np.zeros(gray.shape, np.uint8)
#         new_image = cv2.drawContours(mask, [location], 0, 255, -1)
#         new_image = cv2.bitwise_and(frame, frame, mask=mask)

#         (x, y) = np.where(mask == 255)
#         (x1, y1) = (np.min(x), np.min(y))
#         (x2, y2) = (np.max(x), np.max(y))
#         cropped_image = gray[x1:x2+1, y1:y2+1]

#         # Use easyocr to read text from the cropped image
#         result = reader.readtext(cropped_image)
#         for detection in result:
#             text = detection[1]
#             cleaned_text = ''.join(e for e in text if e.isalnum())
#             detected_text.append(cleaned_text)

#     return jsonify({'text': detected_text})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import imutils
import easyocr
import base64
import logging
import mysql.connector
from mysql.connector import Error

# Set logging level for easyocr
logging.getLogger('easyocr').setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS

# Initialize the easyocr Reader
reader = easyocr.Reader(['en'])

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123456',  # Use your MySQL root password
            database='anpr'
        )
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

@app.route('/process_frame', methods=['POST'])
def process_frame():
    data = request.json
    frame_data = data['frame']
    frame = base64.b64decode(frame_data)
    nparr = np.frombuffer(frame, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Convert the frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Apply bilateral filter and edge detection
    filt = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(filt, 90, 200)

    # Find contours
    keypoints = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = imutils.grab_contours(keypoints)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    location = None
    for contour in contours:
        approx = cv2.approxPolyDP(contour, 10, True)
        if len(approx) == 4:
            location = approx
            break

    detected_text = []
    if location is not None:
        # Create mask and extract the region of interest
        mask = np.zeros(gray.shape, np.uint8)
        new_image = cv2.drawContours(mask, [location], 0, 255, -1)
        new_image = cv2.bitwise_and(frame, frame, mask=mask)

        (x, y) = np.where(mask == 255)
        (x1, y1) = (np.min(x), np.min(y))
        (x2, y2) = (np.max(x), np.max(y))
        cropped_image = gray[x1:x2+1, y1:y2+1]

        # # Use easyocr to read text from the cropped image
        # result = reader.readtext(cropped_image)
        # for detection in result:
        #     text = detection[1]
        #     cleaned_text = ''.join(e for e in text if e.isalnum())
        #     detected_text.append(cleaned_text)

        # # Save detected text to database
        # if detected_text:
        #     connection = create_connection()
        #     cursor = connection.cursor()
        #     query = 'INSERT INTO number_plates (plate_number) VALUES (%s)'
        #     for plate in detected_text:
        #         cursor.execute(query, (plate,))
        #     connection.commit()
        #     cursor.close()
        #     connection.close()

        # Use easyocr to read text from the cropped image
        result = reader.readtext(cropped_image)
        detected_text = []
        for detection in result:
            text = detection[1]
            cleaned_text = ''.join(e for e in text if e.isalnum())
            detected_text.append(cleaned_text)

        # Assume camera_id is given or detected from some source
        camera_id = 1  # Replace with actual camera ID

        # Join the detected text segments to form a complete plate number
        if detected_text:
            complete_plate_number = ''.join(detected_text)
            
            # Save detected text to database
            connection = create_connection()
            cursor = connection.cursor()
            query = 'INSERT INTO number_plates (plate_number, cameraID) VALUES (%s, %s)'
            cursor.execute(query, (complete_plate_number, camera_id))
            connection.commit()
            cursor.close()
            connection.close()


    return jsonify({'text': detected_text})

# @app.route('/search_plate', methods=['GET'])
# def search_plate():
#     search_query = request.args.get('q')
#     connection = create_connection()
#     cursor = connection.cursor()
#     query = 'SELECT plate_number FROM number_plates WHERE plate_number LIKE %s'
#     cursor.execute(query, (f'%{search_query}%',))
#     results = cursor.fetchall()
#     cursor.close()
#     connection.close()
#     return jsonify({'results': [result[0] for result in results]})

@app.route('/search_plate', methods=['GET'])
def search_plate():
    search_query = request.args.get('q')
    connection = create_connection()
    cursor = connection.cursor()
    query = 'SELECT cameraID, plate_number, detected_at FROM number_plates WHERE plate_number LIKE %s'
    cursor.execute(query, (f'%{search_query}%',))
    results = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify({'results': [{'cameraID': result[0], 'plate_number': result[1], 'detected_at': result[2]} for result in results]})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
