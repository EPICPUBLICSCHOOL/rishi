import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, FileText, Lightbulb, Settings, Leaf } from "lucide-react";
import LanguageSwitcher from ":/components/shared/LanguageSwitcher";
import FloatingChat from "./components/chat/FloatingChat";

const navigationItems = [
  {
    title: { english: "Home", hindi: "घर", bengali: "হোম" },
    url: createPageUrl("Home"),
    icon: Camera,
  },
  {
    title: { english: "My Reports", hindi: "मेरी रिपोर्ट", bengali: "আমার রিপোর্ট" },
    url: createPageUrl("MyReports"),
    icon: FileText,
  },
  {
    title: { english: "Daily Tips", hindi: "दैनिक सुझाव", bengali: "দৈনিক পরামর্শ" },
    url: createPageUrl("DailyTips"),
    icon: Lightbulb,
  },
  {
    title: { english: "Settings", hindi: "सेटिंग्स", bengali: "সেটিংস" },
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [language, setLanguage] = React.useState(() => 
    localStorage.getItem('preferred_language') || 'english'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  {language === 'hindi' ? 'पौधे स्वास्थ्य सहायक' : 
                   language === 'bengali' ? 'উদ্ভিদ স্বাস্থ্য সহায়ক' : 
                   'Plant Health Assistant'}
                </h1>
                <p className="text-xs text-green-600">
                  {language === 'hindi' ? 'किसानों के लिए AI सहायक' : 
                   language === 'bengali' ? 'কৃষকদের জন্য AI সহায়ক' : 
                   'AI Assistant for Farmers'}
                </p>
              </div>
            </div>
            <LanguageSwitcher language={language} setLanguage={setLanguage} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Floating Chat Assistant */}
      <FloatingChat language={language} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 shadow-lg">
        <div className="grid grid-cols-4 gap-1 py-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex flex-col items-center py-2 px-1 rounded-lg mx-1 transition-all duration-200 ${
                  isActive 
                    ? 'bg-green-50 text-green-700' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-green-700' : ''}`} />
                <span className="text-xs font-medium">
                  {item.title[language]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

