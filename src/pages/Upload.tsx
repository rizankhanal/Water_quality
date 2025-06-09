import React, { useState } from 'react'
import { MapPin, TestTube, Droplets, Upload as UploadIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.png'

export function Upload() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    location: '',
    ph: '',
    turbidity: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Geocode location name into lat/lng using OpenCage API
  const geocodeLocation = async (locationName: string) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY
    if (!apiKey) {
      throw new Error('OpenCage API key not configured')
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationName)}&key=${apiKey}&countrycode=np&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable')
    }

    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry
      return { latitude: lat, longitude: lng }
    } else {
      throw new Error('Location not found')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      const ph = parseFloat(formData.ph)
      const turbidity = parseFloat(formData.turbidity)

      if (isNaN(ph) || ph < 0 || ph > 14) {
        throw new Error('pH must be between 0 and 14')
      }

      if (isNaN(turbidity) || turbidity < 0) {
        throw new Error('Turbidity must be a positive number')
      }

      // Get coordinates from location name
      const { latitude, longitude } = await geocodeLocation(formData.location)

      const username = user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous'

      // Insert into Supabase (note the typo in column name: 'latitute')
      const { error } = await supabase
        .from('wqi_uploads')
        .insert({
          user_id: user.id,
          username,
          location: formData.location,
          ph,
          turbidity,
          latitute: latitude,  // typo fixed here (must match your DB schema exactly)
          longitude
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Water quality data uploaded successfully!' })
      setFormData({ location: '', ph: '', turbidity: '' })

    } catch (error) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to upload data' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to upload data</h2>
          <p className="text-slate-300">You need to be logged in to contribute water quality data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Nephranet Logo" className="h-20 w-20 object-contain" />
          </div>
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/20 rounded-full">
              <UploadIcon className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Upload Water Quality Data</h1>
          <p className="text-slate-300">
            Help build Nepal's water quality database by sharing your measurements
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                id="location"
                required
                className="block w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Kathmandu, Pokhara, Chitwan"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
              <p className="text-xs text-slate-400 mt-1">
                Enter a location name in Nepal (city, district, or landmark)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ph" className="block text-sm font-medium text-slate-300 mb-2">
                  <TestTube className="inline h-4 w-4 mr-1" />
                  pH Level
                </label>
                <input
                  type="number"
                  id="ph"
                  step="0.1"
                  min="0"
                  max="14"
                  required
                  className="block w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.0 - 14.0"
                  value={formData.ph}
                  onChange={(e) => setFormData(prev => ({ ...prev, ph: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1">
                  7.0 = neutral, &lt;7 = acidic, &gt;7 = basic
                </p>
              </div>

              <div>
                <label htmlFor="turbidity" className="block text-sm font-medium text-slate-300 mb-2">
                  <Droplets className="inline h-4 w-4 mr-1" />
                  Turbidity (NTU)
                </label>
                <input
                  type="number"
                  id="turbidity"
                  step="0.1"
                  min="0"
                  required
                  className="block w-full px-4 py-3 border border-slate-600 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.0+"
                  value={formData.turbidity}
                  onChange={(e) => setFormData(prev => ({ ...prev, turbidity: e.target.value }))}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Nephelometric Turbidity Units (0 = clear)
                </p>
              </div>
            </div>

            {message && (
              <div className={`flex items-center p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-900/50 border border-green-500 text-green-200' 
                  : 'bg-red-900/50 border border-red-500 text-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload Data
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Tips for accurate measurements:</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Use calibrated pH meters or test strips</li>
              <li>• Measure turbidity with proper equipment (turbidimeter)</li>
              <li>• Take measurements from clean, representative water samples</li>
              <li>• Record the exact location where samples were collected</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
