import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Globe, Volume2, Bell, Info } from "lucide-react";

export default function Settings() {
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('preferred_language') || 'english'
  );
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('notifications_enabled') === 'true'
  );
  const [autoVoice, setAutoVoice] = useState(() => 
    localStorage.getItem('auto_voice') === 'true'
  );

  const text = {
    english: {
      title: "Settings",
      language: "Language",
      languageDesc: "Choose your preferred language",
      notifications: "Daily Tips Notifications",
      notificationsDesc: "Get daily farming tips and alerts",
      autoVoice: "Auto Voice Reading",
      autoVoiceDesc: "Automatically read scan results aloud",
      about: "About",
      aboutDesc: "Plant Health Assistant v1.0",
      aboutText: "AI-powered plant health diagnosis for farmers. Developed with advanced machine learning to help identify plant diseases and provide treatment recommendations.",
      save: "Save Settings",
      saved: "Settings saved successfully!"
    },
    hindi: {
      title: "सेटिंग्स",
      language: "भाषा",
      languageDesc: "अपनी पसंदीदा भाषा चुनें",
      notifications: "दैनिक सुझाव की सूचनाएं",
      notificationsDesc: "दैनिक कृषि सुझाव और अलर्ट प्राप्त करें",
      autoVoice: "स्वचालित आवाज़ पढ़ना",
      autoVoiceDesc: "स्कैन परिणाम स्वचालित रूप से सुनाएं",
      about: "के बारे में",
      aboutDesc: "प्लांट हेल्थ असिस्टेंट v1.0",
      aboutText: "किसानों के लिए AI-संचालित पौधे स्वास्थ्य निदान। पौधों की बीमारियों की पहचान और उपचार की सिफारिश में मदद के लिए उन्नत मशीन लर्निंग के साथ विकसित।",
      save: "सेटिंग्स सहेजें",
      saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!"
    },
    bengali: {
      title: "সেটিংস",
      language: "ভাষা",
      languageDesc: "আপনার পছন্দের ভাষা বেছে নিন",
      notifications: "দৈনিক পরামর্শের বিজ্ঞপ্তি",
      notificationsDesc: "দৈনিক কৃষি পরামর্শ এবং সতর্কতা পান",
      autoVoice: "স্বয়ংক্রিয় ভয়েস পড়া",
      autoVoiceDesc: "স্ক্যান ফলাফল স্বয়ংক্রিয়ভাবে উচ্চস্বরে পড়ুন",
      about: "সম্পর্কে",
      aboutDesc: "প্ল্যান্ট হেলথ অ্যাসিস্ট্যান্ট v1.0",
      aboutText: "কৃষকদের জন্য AI-চালিত উদ্ভিদ স্বাস্থ্য নির্ণয়। উদ্ভিদের রোগ চিহ্নিতকরণ এবং চিকিৎসার সুপারিশে সহায়তার জন্য উন্নত মেশিন লার্নিং দিয়ে তৈরি।",
      save: "সেটিংস সংরক্ষণ করুন",
      saved: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে!"
    }
  };

  const currentText = text[language];
  const [showSaved, setShowSaved] = useState(false);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred_language', newLanguage);
  };

  const handleNotificationsChange = (enabled) => {
    setNotifications(enabled);
    localStorage.setItem('notifications_enabled', enabled.toString());
  };

  const handleAutoVoiceChange = (enabled) => {
    setAutoVoice(enabled);
    localStorage.setItem('auto_voice', enabled.toString());
  };

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900">{currentText.title}</h1>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            {currentText.language}
          </CardTitle>
          <p className="text-sm text-gray-600">{currentText.languageDesc}</p>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
              <SelectItem value="bengali">বাংলা (Bengali)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-orange-600" />
            {currentText.notifications}
          </CardTitle>
          <p className="text-sm text-gray-600">{currentText.notificationsDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={handleNotificationsChange}
            />
            <Label htmlFor="notifications">
              {notifications ? 
                (language === 'hindi' ? 'चालू' : language === 'bengali' ? 'চালু' : 'Enabled') :
                (language === 'hindi' ? 'बंद' : language === 'bengali' ? 'বন্ধ' : 'Disabled')
              }
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Auto Voice */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-purple-600" />
            {currentText.autoVoice}
          </CardTitle>
          <p className="text-sm text-gray-600">{currentText.autoVoiceDesc}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-voice" 
              checked={autoVoice}
              onCheckedChange={handleAutoVoiceChange}
            />
            <Label htmlFor="auto-voice">
              {autoVoice ? 
                (language === 'hindi' ? 'चालू' : language === 'bengali' ? 'চালু' : 'Enabled') :
                (language === 'hindi' ? 'बंद' : language === 'bengali' ? 'বন্ধ' : 'Disabled')
              }
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Info className="w-5 h-5 text-green-600" />
            {currentText.about}
          </CardTitle>
          <p className="text-sm font-medium text-gray-700">{currentText.aboutDesc}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentText.aboutText}
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button 
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        {showSaved ? currentText.saved : currentText.save}
      </Button>
    </div>
  );
}

