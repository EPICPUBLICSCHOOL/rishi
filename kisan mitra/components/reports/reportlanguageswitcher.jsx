import React from 'react';
import { Button } from "@/components/ui/button";

const ReportLanguageSwitcher = ({ currentLanguage, onLanguageChange, disabled }) => {
  const languages = [
    { code: 'english', name: 'EN' },
    { code: 'hindi', name: 'HI' },
    { code: 'bengali', name: 'BN' },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      {languages.map(lang => (
        <Button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          disabled={disabled}
          variant={currentLanguage === lang.code ? 'default' : 'ghost'}
          size="sm"
          className={`
            ${currentLanguage === lang.code 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'text-gray-600 hover:bg-gray-200'}
            transition-all duration-200
          `}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
};

export default ReportLanguageSwitcher;

