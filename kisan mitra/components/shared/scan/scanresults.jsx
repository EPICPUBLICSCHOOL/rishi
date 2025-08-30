
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Bug, 
  Droplets,
  Share,
  Download
} from "lucide-react";
import VoiceReader from "../shared/VoiceReader";
import ReportLanguageSwitcher from "../reports/ReportLanguageSwitcher";

export default function ScanResults({ 
  scanResult, 
  language, 
  onShare, 
  onSave, 
  onLanguageChange, 
  isTranslating,
  showSaveButton = true 
}) {
  const text = {
    english: {
      plantInfo: "Plant Information",
      healthStatus: "Health Status",
      disease: "Disease Detected",
      symptoms: "Symptoms",
      causes: "Possible Causes",
      treatments: "Treatments",
      organic: "Organic Solutions",
      chemical: "Chemical Solutions",
      preventive: "Preventive Measures",
      growthTips: "Growth Tips",
      confidence: "AI Confidence",
      share: "Share Report",
      save: "Save to Reports"
    },
    hindi: {
      plantInfo: "पौधे की जानकारी",
      healthStatus: "स्वास्थ्य स्थिति",
      disease: "रोग की पहचान",
      symptoms: "लक्षण",
      causes: "संभावित कारण",
      treatments: "उपचार",
      organic: "जैविक समाधान",
      chemical: "रासायनिक समाधान",
      preventive: "बचाव के उपाय",
      growthTips: "विकास के सुझाव",
      confidence: "AI विश्वसनीयता",
      share: "रिपोर्ट साझा करें",
      save: "रिपोर्ट में सहेजें"
    },
    bengali: {
      plantInfo: "উদ্ভিদের তথ্য",
      healthStatus: "স্বাস্থ্যের অবস্থা",
      disease: "রোগ সনাক্তকরণ",
      symptoms: "লক্ষণসমূহ",
      causes: "সম্ভাব্য কারণ",
      treatments: "চিকিৎসা",
      organic: "জৈবিক সমাধান",
      chemical: "রাসায়নিক সমাধান",
      preventive: "প্রতিরোধমূলক ব্যবস্থা",
      growthTips: "বৃদ্ধির পরামর্শ",
      confidence: "AI নির্ভরযোগ্যতা",
      share: "রিপোর্ট শেয়ার করুন",
      save: "রিপোর্টে সংরক্ষণ করুন"
    }
  };

  const currentText = text[language];

  const getHealthIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'diseased': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'pest_affected': return <Bug className="w-5 h-5 text-orange-600" />;
      case 'nutrient_deficient': return <Droplets className="w-5 h-5 text-yellow-600" />;
      default: return <Leaf className="w-5 h-5 text-gray-600" />;
    }
  };

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'diseased': return 'bg-red-100 text-red-800 border-red-200';
      case 'pest_affected': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'nutrient_deficient': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatResultsForVoice = () => {
    let voiceText = `${currentText.plantInfo}: ${scanResult.plant_name}. `;
    if (scanResult.scientific_name) {
      voiceText += `${scanResult.scientific_name}. `;
    }
    voiceText += `${currentText.healthStatus}: ${scanResult.health_status}. `;
    
    if (scanResult.disease_name) {
      voiceText += `${currentText.disease}: ${scanResult.disease_name}. `;
    }
    
    if (scanResult.symptoms?.length) {
      voiceText += `${currentText.symptoms}: ${scanResult.symptoms.join(', ')}. `;
    }
    
    return voiceText;
  };

  const handleShareClick = () => {
    if (onShare) onShare(scanResult);
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header with Voice Reader and Language Switcher */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">
          {language === 'hindi' ? 'स्कैन परिणाम' : 
           language === 'bengali' ? 'স্ক্যান ফলাফল' : 
           'Scan Results'}
        </h1>
        {onLanguageChange ? (
          <ReportLanguageSwitcher 
            currentLanguage={language} 
            onLanguageChange={onLanguageChange}
            disabled={isTranslating}
          />
        ) : (
          <VoiceReader text={formatResultsForVoice()} language={language} />
        )}
      </div>

      {/* Plant Image */}
      <Card>
        <CardContent className="p-4">
          <img 
            src={scanResult.image_url} 
            alt="Scanned plant"
            className="w-full h-48 object-cover rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Plant Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            {currentText.plantInfo}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{scanResult.plant_name}</h3>
            {scanResult.scientific_name && (
              <p className="text-gray-600 italic">{scanResult.scientific_name}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentText.healthStatus}:</span>
            <Badge className={`border ${getHealthColor(scanResult.health_status)}`}>
              {getHealthIcon(scanResult.health_status)}
              <span className="ml-2">{scanResult.health_status}</span>
            </Badge>
          </div>

          {scanResult.confidence_score && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{currentText.confidence}:</span>
              <span className="text-sm text-gray-600">{Math.round(scanResult.confidence_score * 100)}%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disease Information */}
      {scanResult.disease_name && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              {currentText.disease}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="font-semibold text-red-800">{scanResult.disease_name}</h3>
            
            {scanResult.symptoms?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{currentText.symptoms}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {scanResult.symptoms.map((symptom, index) => (
                    <li key={index} className="text-gray-700">{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.causes?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{currentText.causes}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {scanResult.causes.map((cause, index) => (
                    <li key={index} className="text-gray-700">{cause}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Treatments */}
      {scanResult.treatments && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Droplets className="w-5 h-5" />
              {currentText.treatments}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResult.treatments.organic?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-green-700">{currentText.organic}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {scanResult.treatments.organic.map((treatment, index) => (
                    <li key={index} className="text-gray-700">{treatment}</li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.treatments.chemical?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-blue-700">{currentText.chemical}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {scanResult.treatments.chemical.map((treatment, index) => (
                    <li key={index} className="text-gray-700">{treatment}</li>
                  ))}
                </ul>
              </div>
            )}

            {scanResult.treatments.preventive?.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-purple-700">{currentText.preventive}:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {scanResult.treatments.preventive.map((measure, index) => (
                    <li key={index} className="text-gray-700">{measure}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Growth Tips */}
      {scanResult.growth_tips?.length > 0 && (
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Leaf className="w-5 h-5" />
              {currentText.growthTips}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              {scanResult.growth_tips.map((tip, index) => (
                <li key={index} className="text-gray-700">{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleShareClick}
          variant="outline"
          className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
        >
          <Share className="w-4 h-4 mr-2" />
          {currentText.share}
        </Button>
        {showSaveButton && onSave && (
          <Button
            onClick={() => onSave(scanResult)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {currentText.save}
          </Button>
        )}
      </div>
    </div>
  );
}


