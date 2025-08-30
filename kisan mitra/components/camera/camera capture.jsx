import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Leaf } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function CameraCapture({ onImageCapture, language }) {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const text = {
    english: {
      title: "Identify Your Plant's Health",
      subtitle: "Get instant AI analysis and solutions for your crops.",
      scan: "Tap to Scan",
      gallery: "Or upload from gallery",
      cameraTitle: "Scan Your Plant",
      capture: "Capture Photo",
      cancel: "Cancel",
    },
    hindi: {
      title: "अपने पौधे का स्वास्थ्य पहचानें",
      subtitle: "अपनी फसलों के लिए तत्काल AI विश्लेषण और समाधान प्राप्त करें।",
      scan: "स्कैन करने के लिए टैप करें",
      gallery: "या गैलरी से अपलोड करें",
      cameraTitle: "अपने पौधे को स्कैन करें",
      capture: "फोटो खींचें",
      cancel: "रद्द करें",
    },
    bengali: {
      title: "আপনার উদ্ভিদের স্বাস্থ্য সনাক্ত করুন",
      subtitle: "আপনার ফসলের জন্য তাৎক্ষণিক AI বিশ্লেষণ এবং সমাধান পান।",
      scan: "স্ক্যান করতে আলতো চাপুন",
      gallery: "অথবা গ্যালারি থেকে আপলোড করুন",
      cameraTitle: "আপনার গাছ স্ক্যান করুন",
      capture: "ছবি তুলুন",
      cancel: "বাতিল",
    },
  };

  const currentText = text[language];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (error) {
      console.error("Camera access error:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !cameraReady) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `plant-scan-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      onImageCapture(file);
      setShowCamera(false);
    }, "image/jpeg", 0.9);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageCapture(file);
    }
  };

  React.useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <Leaf className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {currentText.title}
        </h1>
        <p className="text-gray-600 mb-10">{currentText.subtitle}</p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => setShowCamera(true)}
            className="w-48 h-48 bg-white rounded-full shadow-xl border-4 border-green-200 hover:border-green-400 transition-all duration-300 flex flex-col items-center justify-center text-green-700"
          >
            <Camera className="w-16 h-16 mb-2" />
            <span className="font-semibold">{currentText.scan}</span>
          </button>
        </motion.div>

        <div className="mt-8">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <Upload className="w-4 h-4" />
            {currentText.gallery}
          </button>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {currentText.cameraTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!cameraReady && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCamera(false)}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {currentText.cancel}
            </Button>
            <Button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              {currentText.capture}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

