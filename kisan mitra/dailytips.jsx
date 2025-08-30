import React, { useState, useEffect } from "react";
import { DailyTip } from "@/entities/DailyTip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Leaf, Bug, Droplets, Sun } from "lucide-react";
import VoiceReader from "../components/shared/VoiceReader";

export default function DailyTips() {
  const [language] = useState(() => 
    localStorage.getItem('preferred_language') || 'english'
  );
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const text = {
    english: {
      title: "Daily Farming Tips",
      subtitle: "Expert advice for better crop management",
      all: "All Tips",
      disease_prevention: "Disease Prevention",
      fertilizer: "Fertilizer",
      watering: "Watering",
      pest_control: "Pest Control",
      seasonal: "Seasonal",
      noTips: "No tips available",
      loadMore: "Load More Tips"
    },
    hindi: {
      title: "दैनिक कृषि सुझाव",
      subtitle: "बेहतर फसल प्रबंधन के लिए विशेषज्ञ सलाह",
      all: "सभी सुझाव",
      disease_prevention: "रोग रोकथाम",
      fertilizer: "उर्वरक",
      watering: "पानी देना",
      pest_control: "कीट नियंत्रण",
      seasonal: "मौसमी",
      noTips: "कोई सुझाव उपलब्ध नहीं",
      loadMore: "अधिक सुझाव लोड करें"
    },
    bengali: {
      title: "দৈনিক কৃষি পরামর্শ",
      subtitle: "ভাল ফসল ব্যবস্থাপনার জন্য বিশেষজ্ঞ পরামর্শ",
      all: "সব পরামর্শ",
      disease_prevention: "রোগ প্রতিরোধ",
      fertilizer: "সার",
      watering: "পানি প্রয়োগ",
      pest_control: "পোকা নিয়ন্ত্রণ",
      seasonal: "মৌসুমি",
      noTips: "কোন পরামর্শ উপলব্ধ নেই",
      loadMore: "আরো পরামর্শ লোড করুন"
    }
  };

  const currentText = text[language];

  const categoryIcons = {
    disease_prevention: Leaf,
    fertilizer: Sun,
    watering: Droplets,
    pest_control: Bug,
    seasonal: Sun
  };

  useEffect(() => {
    loadTips();
  }, [language]);

  const loadTips = async () => {
    try {
      const data = await DailyTip.filter({ language }, '-created_date');
      setTips(data);
    } catch (error) {
      console.error("Error loading tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === activeCategory);

  const getCategoryColor = (category) => {
    const colors = {
      disease_prevention: 'bg-green-100 text-green-800 border-green-200',
      fertilizer: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      watering: 'bg-blue-100 text-blue-800 border-blue-200',
      pest_control: 'bg-red-100 text-red-800 border-red-200',
      seasonal: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{currentText.title}</h1>
        <p className="text-gray-600">{currentText.subtitle}</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">{currentText.all}</TabsTrigger>
          <TabsTrigger value="disease_prevention">
            {currentText.disease_prevention}
          </TabsTrigger>
          <TabsTrigger value="fertilizer">{currentText.fertilizer}</TabsTrigger>
          <TabsTrigger value="watering">{currentText.watering}</TabsTrigger>
          <TabsTrigger value="pest_control">{currentText.pest_control}</TabsTrigger>
          <TabsTrigger value="seasonal">{currentText.seasonal}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filteredTips.length === 0 ? (
          <Card className="text-center p-8">
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{currentText.noTips}</p>
          </Card>
        ) : (
          filteredTips.map((tip) => {
            const IconComponent = categoryIcons[tip.category] || Lightbulb;
            return (
              <Card key={tip.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="flex items-start gap-3">
                      <IconComponent className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="flex-1">{tip.title}</span>
                    </CardTitle>
                    <VoiceReader text={`${tip.title}. ${tip.content}`} language={language} />
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs border ${getCategoryColor(tip.category)}`}>
                      {currentText[tip.category]}
                    </Badge>
                    {tip.priority === 'high' && (
                      <Badge className="text-xs bg-orange-100 text-orange-800 border border-orange-200">
                        {language === 'hindi' ? 'उच्च' : 
                         language === 'bengali' ? 'উচ্চ' : 'High'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{tip.content}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

