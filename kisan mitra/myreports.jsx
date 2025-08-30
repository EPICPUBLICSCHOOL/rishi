import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlantScan } from "@/entities/PlantScan";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import HealthStatusChart from "../components/reports/HealthStatusChart";
import { createPageUrl } from "@/utils";

export default function MyReports() {
  const [language] = useState(() => 
    localStorage.getItem('preferred_language') || 'english'
  );
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const text = {
    english: {
      title: "My Plant Reports",
      noReports: "No scan reports yet",
      scanFirst: "Scan your first plant to see reports here",
      healthy: "Healthy",
      diseased: "Diseased",
      pest_affected: "Pest Affected",
      nutrient_deficient: "Nutrient Deficient"
    },
    hindi: {
      title: "मेरी पौधे की रिपोर्ट",
      noReports: "अभी तक कोई स्कैन रिपोर्ट नहीं",
      scanFirst: "यहाँ रिपोर्ट देखने के लिए पहले अपने पौधे को स्कैन करें",
      healthy: "स्वस्थ",
      diseased: "रोगग्रस्त",
      pest_affected: "कीट प्रभावित",
      nutrient_deficient: "पोषक तत्व की कमी"
    },
    bengali: {
      title: "আমার উদ্ভিদ রিপোর্ট",
      noReports: "এখনো কোন স্ক্যান রিপোর্ট নেই",
      scanFirst: "রিপোর্ট দেখতে প্রথমে আপনার গাছ স্ক্যান করুন",
      healthy: "সুস্থ",
      diseased: "রোগাক্রান্ত",
      pest_affected: "পোকায় আক্রান্ত",
      nutrient_deficient: "পুষ্টির অভাব"
    }
  };

  const currentText = text[language];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await PlantScan.list('-created_date');
      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
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

  const getChartData = () => {
    const statusCounts = reports.reduce((acc, report) => {
      acc[report.health_status] = (acc[report.health_status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-4">
        <Card className="text-center p-8">
          <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentText.noReports}
          </h2>
          <p className="text-gray-600">
            {currentText.scanFirst}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {currentText.title}
      </h1>

      <HealthStatusChart data={getChartData()} language={language} />

      <div className="space-y-4">
        {reports.map((report) => (
          <Link 
            key={report.id} 
            to={createPageUrl(`ReportDetails?id=${report.id}`)}
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-md hover:border-green-300 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={report.image_url}
                    alt={report.plant_name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {report.plant_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs border ${getHealthColor(report.health_status)}`}>
                        {currentText[report.health_status]}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(report.created_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}


