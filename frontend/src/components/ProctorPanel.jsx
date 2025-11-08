import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const ProctorPanel = ({ onStartTest, onEndTest, onViolation,onReadyToStartFullscreen, testStarted = false }) => {
  const videoRef = useRef(null);
  const monitorIntervalRef = useRef(null);
  const smileIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const monitoringStartedRef = useRef(false);
  const referenceDescriptorRef = useRef(null);
  const testStartedRef = useRef(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(true);

  // Cooldown to prevent multiple violations at once
  const violationCooldownRef = useRef(false);

  // Capture snapshot utility
  const captureSnapshot = (video, label) => {
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      console.log(`Captured snapshot for: ${label}`, blob);
    }, "image/png");
  };

  // Load face-api models
  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68_model"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models/face_expression_model"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition_model"),
        ]);
        if (!mounted) return;
        setModelsLoaded(true);
        await startVideo();
      } catch (err) {
        console.error("Error loading models:", err);
        alert("Failed to load face detection models.");
      }
    };

    loadModels();

    return () => {
      mounted = false;
      stopAll();
    };
  }, []);

  // Hide initial smile popup when test starts or reference face is set
  useEffect(() => {
  if (!referenceDescriptorRef.current) {
    startSmileDetection();
    setShowInitialPopup(true); // show smile popup until reference is stored
  } else {
    setShowInitialPopup(false);
  }
}, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = async () => {
        await videoRef.current.play();

        // Capture reference face immediately if test already started
        if (testStarted && !referenceDescriptorRef.current) {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            referenceDescriptorRef.current = detection.descriptor; // STORE IT
            console.log("Reference face captured at start!");
            setShowInitialPopup(false);
            onStartTest?.();
          }
        }

        setShowInitialPopup(false);
        startSmileDetection();
        startMonitoringWhenReady(); // ✅ Wait for reference before monitoring
      };
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera access is required.");
    }
  };


const startSmileDetection = () => {
  if (smileIntervalRef.current) clearInterval(smileIntervalRef.current);

  smileIntervalRef.current = setInterval(async () => {
    if (!videoRef.current) return;
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptor();

      if (!detection) return;

      const { expressions, descriptor } = detection;

      // Set reference face when smile detected
      if (expressions.happy > 0.6 && !referenceDescriptorRef.current) {
        referenceDescriptorRef.current = descriptor;
        console.log("Reference face stored via smile!");
        captureSnapshot(videoRef.current, "reference");
      
        clearInterval(smileIntervalRef.current);
        setShowInitialPopup(false);
      
        // Tell parent: show "start fullscreen" modal
        onReadyToStartFullscreen?.();
      
        onStartTest?.();
      }
    } catch (err) {
      console.error("Smile detection error:", err);
    }
  }, 1000);
};


  // Wait until reference is ready before starting monitoring
  const startMonitoringWhenReady = () => {
    if (!referenceDescriptorRef.current) {
      console.log("Waiting for reference face...");
      setTimeout(startMonitoringWhenReady, 500);
      return;
    }
    startMonitoring();
  };

  const startMonitoring = () => {
    if (monitoringStartedRef.current) return;
    monitoringStartedRef.current = true;
  
    monitorIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || violationCooldownRef.current) return;
  
      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptors();
  
        let violationMessage = null;
  
        if (!detections || detections.length === 0) {
          violationMessage = "No face detected!";
          captureSnapshot(videoRef.current, "no-face");
        } else if (detections.length > 1) {
          violationMessage = "Multiple faces detected!";
          captureSnapshot(videoRef.current, "multiple-faces");
        } else if (detections[0].descriptor && referenceDescriptorRef.current) {
          const distance = faceapi.euclideanDistance(referenceDescriptorRef.current, detections[0].descriptor);
          console.log("Face distance:", distance);
          if (distance > 0.6) {
            violationMessage = "Face mismatch detected!";
            captureSnapshot(videoRef.current, "face-mismatch");
          }
        }
  
        if (violationMessage) {
          violationCooldownRef.current = true;
          console.log("Violation:", violationMessage);
          onViolation?.(violationMessage);
  
          setTimeout(() => {
            violationCooldownRef.current = false;
          }, 3000); // 3s cooldown
        }
      } catch (err) {
        console.error("Monitoring error:", err);
      }
    }, 1000);
  };
  

  const stopAll = () => {
    if (smileIntervalRef.current) clearInterval(smileIntervalRef.current);
    if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      monitoringStartedRef.current = false;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[420px]">
        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-[#2c3c55]">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>

        {!testStarted && showInitialPopup && (
          <p className="mt-3 text-sm text-gray-300 text-center">😊 Please smile to start the test</p>
        )}
      </div>
    </div>
  );
};

export default ProctorPanel;
