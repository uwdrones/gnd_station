from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
import cv2
import numpy as np
from ultralytics import YOLO
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import cv2.aruco as aruco

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")  # Use 'yolov8s.pt', etc., for different sizes

# Function to detect ArUco markers
def detect_aruco_markers(frame):
    # Create ArUco dictionary and parameters
    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()
    
    # Create detector
    detector = cv2.aruco.ArucoDetector(aruco_dict, parameters)
    
    # Convert frame to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect markers
    corners, ids, rejected_img_points = detector.detectMarkers(gray)
    
    # If markers are detected, draw them
    if ids is not None and len(corners) > 0:
        # Draw detected markers
        frame = cv2.aruco.drawDetectedMarkers(frame, corners, ids)
        
        # Loop through the detected markers to display the IDs
        for i in range(len(ids)):
            # Get the coordinates of the marker's top-left corner
            x, y = int(corners[i][0][0][0]), int(corners[i][0][0][1])
            
            # Put the marker ID text near the marker's top-left corner
            cv2.putText(frame, str(ids[i][0]), (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    return frame

@app.post("/detect")
async def detect(frame: UploadFile = File(...)):
    contents = await frame.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Detect objects using YOLO
    results = model(image)[0]
    annotated = results.plot()  # Annotated image

    # Detect ArUco markers
    annotated_with_aruco = detect_aruco_markers(annotated)

    # Encode the image with ArUco markers and YOLO detections
    _, img_encoded = cv2.imencode('.jpg', annotated_with_aruco)
    return StreamingResponse(BytesIO(img_encoded.tobytes()), media_type="image/jpeg")
