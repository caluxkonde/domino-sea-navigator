
import React from 'react';
import { Cloud, Thermometer, Droplets, Wind, Eye, Gauge, Sun, CloudRain, Snowflake, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useWeatherData } from '@/hooks/useWeatherData';

const WeatherInfo = () => {
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const { weatherData, loading: weatherLoading, error: weatherError } = useWeatherData(
    location?.latitude || null, 
    location?.longitude || null
  );

  if (locationLoading || weatherLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit animate-pulse">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-slate-200 rounded"></div>
            <div className="w-32 h-5 bg-slate-200 rounded"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-slate-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-slate-200 rounded-lg"></div>
              <div className="h-16 bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (locationError || !weatherData) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle className="text-lg text-red-600 flex items-center space-x-2">
            <Cloud className="h-5 w-5" />
            <span>Cuaca Tidak Tersedia</span>
          </CardTitle>
          <CardDescription className="text-red-500">
            {locationError || 'Tidak dapat memuat data cuaca maritim'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CloudRain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Periksa koneksi internet dan lokasi Anda</p>
        </CardContent>
      </Card>
    );
  }

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('hujan')) return CloudRain;
    if (desc.includes('snow') || desc.includes('salju')) return Snowflake;
    if (desc.includes('thunder') || desc.includes('petir')) return Zap;
    if (desc.includes('cloud') || desc.includes('awan')) return Cloud;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon(weatherData.description);

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Rendah', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Sedang', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'Tinggi', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { level: 'Sangat Tinggi', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const uvLevel = getUVLevel(weatherData.uvIndex);

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-800">Kondisi Cuaca Maritim</CardTitle>
              <CardDescription className="text-slate-600">
                Update real-time untuk navigasi
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            Live
          </Badge>
        </div>
        
        {weatherError && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            ⚠️ {weatherError}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Weather Display */}
        <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/80 rounded-full">
                <WeatherIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-800 mb-1">
                  {weatherData.temperature}°C
                </h3>
                <p className="text-blue-700 font-medium capitalize mb-1">
                  {weatherData.description}
                </p>
                <p className="text-sm text-blue-600">
                  Terasa seperti {weatherData.feelsLike}°C
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Kondisi</p>
                <p className="text-sm font-semibold text-blue-800">
                  {weatherData.humidity > 80 ? 'Lembab' : 
                   weatherData.humidity > 60 ? 'Normal' : 'Kering'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Humidity */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-lg border border-cyan-200">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="h-4 w-4 text-cyan-600" />
              <span className="text-sm font-medium text-cyan-800">Kelembaban</span>
            </div>
            <p className="text-xl font-bold text-cyan-800">{weatherData.humidity}%</p>
            <Progress value={weatherData.humidity} className="mt-2 h-2" />
          </div>

          {/* Wind Speed */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Wind className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Kecepatan Angin</span>
            </div>
            <p className="text-xl font-bold text-green-800">{weatherData.windSpeed}</p>
            <p className="text-xs text-green-600">m/s</p>
          </div>

          {/* Pressure */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Tekanan</span>
            </div>
            <p className="text-lg font-bold text-purple-800">{weatherData.pressure}</p>
            <p className="text-xs text-purple-600">hPa</p>
          </div>

          {/* Visibility */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-100 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Jarak Pandang</span>
            </div>
            <p className="text-lg font-bold text-indigo-800">{weatherData.visibility}</p>
            <p className="text-xs text-indigo-600">km</p>
          </div>
        </div>

        {/* UV Index */}
        <div className={`p-4 rounded-lg border ${uvLevel.bgColor} border-opacity-50`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sun className={`h-5 w-5 ${uvLevel.color}`} />
              <span className={`text-sm font-medium ${uvLevel.color}`}>Indeks UV</span>
            </div>
            <Badge className={`${uvLevel.bgColor} ${uvLevel.color} border-0`}>
              {uvLevel.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-2xl font-bold ${uvLevel.color}`}>{weatherData.uvIndex}</span>
            <Progress value={(weatherData.uvIndex / 11) * 100} className="flex-1 h-2" />
          </div>
        </div>

        {/* Wind Direction Compass */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Arah Angin</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-800">{weatherData.windDirection}°</span>
              <Badge variant="outline" className="text-xs">
                {weatherData.windDirection >= 315 || weatherData.windDirection < 45 ? 'Utara' :
                 weatherData.windDirection >= 45 && weatherData.windDirection < 135 ? 'Timur' :
                 weatherData.windDirection >= 135 && weatherData.windDirection < 225 ? 'Selatan' : 'Barat'}
              </Badge>
            </div>
          </div>
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-slate-300 rounded-full bg-white shadow-inner"></div>
            <div className="absolute top-1 left-1/2 w-1 h-1 bg-slate-400 rounded-full transform -translate-x-1/2"></div>
            <div className="absolute bottom-1 left-1/2 w-1 h-1 bg-slate-400 rounded-full transform -translate-x-1/2"></div>
            <div className="absolute left-1 top-1/2 w-1 h-1 bg-slate-400 rounded-full transform -translate-y-1/2"></div>
            <div className="absolute right-1 top-1/2 w-1 h-1 bg-slate-400 rounded-full transform -translate-y-1/2"></div>
            <div 
              className="absolute top-0 left-1/2 w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 origin-bottom transform -translate-x-1/2 rounded-full shadow-sm"
              style={{ 
                transform: `translateX(-50%) rotate(${weatherData.windDirection}deg)`,
                transformOrigin: 'bottom center'
              }}
            ></div>
          </div>
        </div>

        {/* Maritime Safety Alert */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2 mb-2">
            <Cloud className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">Status Keselamatan Maritim</span>
          </div>
          <p className="text-sm text-orange-700">
            {weatherData.windSpeed > 15 ? '⚠️ Angin kencang - Waspada navigasi' :
             weatherData.visibility < 5 ? '⚠️ Jarak pandang terbatas' :
             '✅ Kondisi aman untuk pelayaran'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherInfo;
