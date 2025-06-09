import React, { useState, useEffect } from 'react'
import { Users, MapPin, TestTube, Droplets, Calendar, Filter, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Upload = Database['public']['Tables']['wqi_uploads']['Row']

export function Community() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'location' | 'ph' | 'turbidity'>('date')
  const [filterBy, setFilterBy] = useState<'all' | 'good' | 'poor'>('all')

  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      const { data, error } = await supabase
        .from('wqi_uploads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching uploads:', error)
      } else {
        setUploads(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateWQI = (ph: number, turbidity: number) => {
    // Simplified WQI calculation
    let phScore = 0
    let turbidityScore = 0

    // pH scoring (optimal range 6.5-8.5)
    if (ph >= 6.5 && ph <= 8.5) {
      phScore = 100
    } else if (ph >= 6.0 && ph < 6.5) {
      phScore = 80
    } else if (ph > 8.5 && ph <= 9.0) {
      phScore = 80
    } else if (ph >= 5.5 && ph < 6.0) {
      phScore = 60
    } else if (ph > 9.0 && ph <= 9.5) {
      phScore = 60
    } else {
      phScore = 40
    }

    // Turbidity scoring (lower is better)
    if (turbidity <= 1) {
      turbidityScore = 100
    } else if (turbidity <= 5) {
      turbidityScore = 80
    } else if (turbidity <= 10) {
      turbidityScore = 60
    } else if (turbidity <= 25) {
      turbidityScore = 40
    } else {
      turbidityScore = 20
    }

    return Math.round((phScore + turbidityScore) / 2)
  }

  const getWQIStatus = (wqi: number) => {
    if (wqi >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' }
    if (wqi >= 70) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    if (wqi >= 50) return { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    if (wqi >= 25) return { label: 'Poor', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    return { label: 'Very Poor', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const filteredAndSortedUploads = uploads
    .filter(upload => {
      const matchesSearch = upload.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           upload.username.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (!matchesSearch) return false

      if (filterBy === 'all') return true
      
      const wqi = calculateWQI(upload.ph, upload.turbidity)
      if (filterBy === 'good') return wqi >= 70
      if (filterBy === 'poor') return wqi < 70
      
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'location':
          return a.location.localeCompare(b.location)
        case 'ph':
          return b.ph - a.ph
        case 'turbidity':
          return a.turbidity - b.turbidity
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading community data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-600/20 rounded-full">
              <Users className="h-12 w-12 text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Community Data</h1>
          <p className="text-slate-300">
            Explore water quality measurements from across Nepal
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-600/20 rounded-lg mr-4">
                <Droplets className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{uploads.length}</p>
                <p className="text-slate-400">Total Measurements</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-600/20 rounded-lg mr-4">
                <MapPin className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(uploads.map(u => u.location)).size}
                </p>
                <p className="text-slate-400">Unique Locations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 bg-purple-600/20 rounded-lg mr-4">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(uploads.map(u => u.username)).size}
                </p>
                <p className="text-slate-400">Contributors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by location or username..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="date">Sort by Date</option>
              <option value="location">Sort by Location</option>
              <option value="ph">Sort by pH</option>
              <option value="turbidity">Sort by Turbidity</option>
            </select>
            
            <select
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
            >
              <option value="all">All Quality</option>
              <option value="good">Good Quality</option>
              <option value="poor">Poor Quality</option>
            </select>
          </div>
        </div>

        {/* Data Grid */}
        {filteredAndSortedUploads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No data found matching your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUploads.map((upload) => {
              const wqi = calculateWQI(upload.ph, upload.turbidity)
              const status = getWQIStatus(wqi)
              
              return (
                <div key={upload.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{upload.location}</h3>
                      <p className="text-slate-400 text-sm">by {upload.username}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      WQI: {wqi}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-300">
                        <TestTube className="h-4 w-4 mr-2" />
                        pH Level
                      </span>
                      <span className="text-white font-medium">{upload.ph}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-300">
                        <Droplets className="h-4 w-4 mr-2" />
                        Turbidity
                      </span>
                      <span className="text-white font-medium">{upload.turbidity} NTU</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date
                      </span>
                      <span className="text-white font-medium">
                        {new Date(upload.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className={`text-center py-2 rounded-lg ${status.bg}`}>
                      <span className={`font-medium ${status.color}`}>
                        Water Quality: {status.label}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}