import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

export default function VoiceReader({ text, language }) {
  const [isReading, setIsReading] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on selection
      const langCodes = {
        hindi: 'hi-IN',
        bengali: 'bn-IN', 
        english: 'en-US'
      };
      
      utterance.lang = langCodes[language] || 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isReading ? stopSpeech : speak}
      className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
    >
      {isReading ? (
        <>
          <VolumeX className="w-4 h-4" />
          {language === 'hindi' ? 'रोकें' : 
           language === 'bengali' ? 'থামুন' : 'Stop'}
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          {language === 'hindi' ? 'सुनें' : 
           language === 'bengali' ? 'শুনুন' : 'Listen'}
        </>
      )}
    </Button>
  );
}

