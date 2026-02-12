
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, Scan, AlertCircle, Loader2 } from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDetected: (barcode: string) => void;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const detectorRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      // Check for BarcodeDetector API support
      if (!('BarcodeDetector' in window)) {
        throw new Error('Barcode detection is not supported in this browser. Please use Chrome or Edge.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsInitializing(false);
          startDetection();
        };
      }
    } catch (err: any) {
      setError(err.message || 'Failed to access camera');
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    setIsScanning(false);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startDetection = async () => {
    // @ts-ignore
    detectorRef.current = new window.BarcodeDetector({
      formats: ['qr_code', 'ean_13', 'code_128', 'code_39', 'upc_a']
    });

    setIsScanning(true);
    
    const detect = async () => {
      if (!isScanning || !videoRef.current || !detectorRef.current) return;

      try {
        const barcodes = await detectorRef.current.detect(videoRef.current);
        if (barcodes.length > 0) {
          const code = barcodes[0].rawValue;
          onDetected(code);
          stopCamera();
          return;
        }
      } catch (e) {
        console.error('Detection error:', e);
      }

      if (isScanning) {
        requestAnimationFrame(detect);
      }
    };

    requestAnimationFrame(detect);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Scan size={20} className="text-blue-600" />
            <h2 className="font-bold text-gray-900">Scan Barcode</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative aspect-square bg-black overflow-hidden">
          {isInitializing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
              <Loader2 size={40} className="animate-spin text-blue-500" />
              <p className="text-sm font-medium">Initializing camera...</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h3 className="text-white font-bold mb-2">Camera Error</h3>
              <p className="text-gray-400 text-sm">{error}</p>
              <button 
                onClick={startCamera}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                playsInline
              />
              
              {/* Scanning UI Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-[40px] border-black/40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-blue-500/50 rounded-2xl">
                  {/* Corners */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  
                  {/* Laser Line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite_ease-in-out]"></div>
                </div>
                <div className="absolute bottom-10 left-0 w-full text-center">
                  <p className="text-white text-xs font-bold uppercase tracking-widest bg-black/40 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                    Align code within frame
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-white flex flex-col gap-4 text-center">
          <p className="text-sm text-gray-500">
            Scanning for standard barcodes (UPC, EAN, QR) to automatically identify items in your inventory.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-3 px-6 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default BarcodeScannerModal;
