import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlantScan } from "@/entities/PlantScan";
import { InvokeLLM } from "@/integrations/Core";
import ScanResults from "../components/scan/ScanResults";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function ReportDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [report, setReport] = useState(null);
  const [originalReport, setOriginalReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const reportId = new URLSearchParams(location.search).get("id");

  useEffect(() => {
    if (reportId) {
      loadReport();
    } else {
      setError("Report ID not found.");
      setLoading(false);
    }
  }, [reportId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await PlantScan.get(reportId);
      setReport(data);
      setOriginalReport(data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading report:", err);
      setError("Failed to load report.");
      setLoading(false);
    }
  };

  const handleLanguageChange = async (targetLanguage) => {
    if (targetLanguage === report.language) {
      setReport(originalReport); // Revert to original if that language is selected
      return;
    }
    
    setIsTranslating(true);
    
    const textFieldsToTranslate = {
      plant_name: originalReport.plant_name,
      scientific_name: originalReport.scientific_name,
      health_status: originalReport.health_status,
      disease_name: originalReport.disease_name,
      symptoms: originalReport.symptoms,
      causes: originalReport.causes,
      treatments: originalReport.treatments,
      growth_tips: originalReport.growth_tips,
    };
    
    const translationPrompt = `Translate the string values in the following JSON object to ${targetLanguage}. Keep the original JSON structure and keys. Do not translate the keys themselves. Provide only the translated JSON object as the output.
    
    JSON to translate:
    ${JSON.stringify(textFieldsToTranslate, null, 2)}`;

    try {
      const translatedFields = await InvokeLLM({
        prompt: translationPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            plant_name: { type: "string" },
            scientific_name: { type: "string" },
            health_status: { type: "string" },
            disease_name: { type: "string" },
            symptoms: { type: "array", items: { type: "string" } },
            causes: { type: "array", items: { type: "string" } },
            treatments: {
              type: "object",
              properties: {
                organic: { type: "array", items: { type: "string" } },
                chemical: { type: "array", items: { type: "string" } },
                preventive: { type: "array", items: { type: "string" } }
              }
            },
            growth_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setReport({
        ...originalReport,
        ...translatedFields,
        language: targetLanguage,
      });

    } catch (err) {
      console.error("Translation error:", err);
      // Optionally show an error to the user
    } finally {
      setIsTranslating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-[calc(100vh-150px)]">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="p-6 text-center border-red-200">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="p-4 bg-white border-b border-green-100">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("MyReports"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reports
        </Button>
      </div>

      {isTranslating && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        </div>
      )}

      {report && (
        <ScanResults
          scanResult={report}
          language={report.language}
          onLanguageChange={handleLanguageChange}
          isTranslating={isTranslating}
          showSaveButton={false}
        />
      )}
    </div>
  );
}

