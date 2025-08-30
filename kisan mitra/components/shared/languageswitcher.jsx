import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ language, setLanguage }) {
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferred_language', newLanguage);
  };

  const languages = {
    english: "English",
    hindi: "हिंदी",
    bengali: "বাংলা"
  };

  return (
    <Select value={language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-24 h-8 border-green-200 focus:border-green-500">
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

