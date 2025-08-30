import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart as PieChartIcon } from 'lucide-react';

const HealthStatusChart = ({ data, language }) => {
  const COLORS = {
    healthy: '#22c55e', // green-500
    diseased: '#ef4444', // red-500
    pest_affected: '#f97316', // orange-500
    nutrient_deficient: '#eab308', // yellow-500
  };

  const text = {
    english: {
      healthy: "Healthy",
      diseased: "Diseased",
      pest_affected: "Pest Affected",
      nutrient_deficient: "Nutrient Deficient",
      title: "Health Summary"
    },
    hindi: {
      healthy: "स्वस्थ",
      diseased: "रोगग्रस्त",
      pest_affected: "कीट प्रभावित",
      nutrient_deficient: "पोषक तत्व की कमी",
      title: "स्वास्थ्य सारांश"
    },
    bengali: {
      healthy: "সুস্থ",
      diseased: "রোগাক্রান্ত",
      pest_affected: "পোকায় আক্রান্ত",
      nutrient_deficient: "পুষ্টির অভাব",
      title: "স্বাস্থ্য সারসংক্ষেপ"
    }
  };
  
  const currentText = text[language];

  const chartData = data.map(item => ({
      ...item,
      name: currentText[item.name] || item.name
  }));

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-green-600" />
          {currentText.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} ${language === 'hindi' ? 'स्कैन' : language === 'bengali' ? 'স্ক্যান' : 'scans'}`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusChart;

