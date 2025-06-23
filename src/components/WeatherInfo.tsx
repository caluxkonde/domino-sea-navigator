
import React from 'react';
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeatherData } from '@/hooks/useWeatherData';

const WeatherInfo = () => {
  const { latitude, longitude, error: locationError, loading: locationLoading } = useGeolocation();
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeatherData(latitude, longitude);

  if (locationLoading || weatherLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <CardTitle className="text-lg">Memuat data cuaca...</CardTitle>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (locationError || !weatherData) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Error</CardTitle>
          <CardDescription className="text-red-500">
            {locationError || 'Tidak dapat memuat data cuaca'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <CardTitle className="text-lg text-slate-800">Informasi Cuaca</CardTitle>
            <CardDescription className="text-slate-600">
              Data Real-time
            </CardDescription>
          </div>
        </div>
        
        {weatherError && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            {weatherError}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Weather Display */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800 text-lg">
                  {weatherData.temperature}°C
                </h3>
                <p className="text-sm text-blue-700 capitalize">
                  {weatherData.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Terasa seperti</p>
              <p className="font-semibold text-blue-800">{weatherData.feelsLike}°C</p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Humidity */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-700">Kelembaban</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{weatherData.humidity}%</p>
          </div>

          {/* Wind Speed */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Wind className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-slate-700">Angin</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{weatherData.windSpeed} m/s</p>
          </div>

          {/* Pressure */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Gauge className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-700">Tekanan</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{weatherData.pressure} hPa</p>
          </div>

          {/* Visibility */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              <Eye className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Jarak Pandang</span>
            </div>
            <p className="text-lg font-semibold text-slate-800">{weatherData.visibility} km</p>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-100 p-3 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Indeks UV</span>
            </div>
            <span className="text-lg font-bold text-orange-800">{weatherData.uvIndex}</span>
          </div>
          <p className="text-xs text-orange-700 mt-1">
            {weatherData.uvIndex <= 2 ? 'Rendah' : 
             weatherData.uvIndex <= 5 ? 'Sedang' : 
             weatherData.uvIndex <= 7 ? 'Tinggi' : 'Sangat Tinggi'}
          </p>
        </div>

        {/* Wind Direction Compass */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Arah Angin</span>
            <span className="text-sm font-semibold text-slate-800">{weatherData.windDirection}°</span>
          </div>
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-slate-300 rounded-full"></div>
            <div 
              className="absolute top-0 left-1/2 w-0.5 h-5 bg-blue-600 origin-bottom transform -translate-x-1/2"
              style={{ 
                transform: `translateX(-50%) rotate(${weatherData.windDirection}deg)`,
                transformOrigin: 'bottom center'
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
