import React from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Users,
  BarChart3,
  Droplets,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Home() {
  const { user } = useAuth()

  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-400" />,
      title: 'Interactive Maps',
      description: 'Visualize water quality data across Nepal with our interactive mapping system.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-400" />,
      title: 'Community Driven',
      description: 'Join thousands of contributors monitoring water quality in their communities.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-400" />,
      title: 'Real-time Analytics',
      description: 'Access comprehensive analytics and insights from collected water quality data.'
    }
  ]

  const wqiLevels = [
    { range: '0-25', label: 'Excellent', color: 'bg-green-500', description: 'Safe for all uses' },
    { range: '26-50', label: 'Good', color: 'bg-blue-500', description: 'Suitable for most uses' },
    { range: '51-75', label: 'Poor', color: 'bg-yellow-500', description: 'Treatment required' },
    { range: '76-100', label: 'Very Poor', color: 'bg-red-500', description: 'Unsafe for consumption' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600/20 rounded-full">
              <Droplets className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Monitor Water Quality
            <span className="text-blue-400 block">Across Nepal</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Join our community-driven platform to monitor, analyze, and improve water quality
            across Nepal. Together, we can ensure safe water for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/upload"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Contributing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/community"
                  className="inline-flex items-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Community Data
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* WQI Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Understanding Water Quality Index</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The Water Quality Index (WQI) is a standardized method to measure water quality
              based on pH, turbidity, and other parameters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wqiLevels.map((level, i) => (
              <div
                key={i}
                className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className={`w-full h-2 ${level.color} rounded-full mb-4`} />
                <div className="text-white font-semibold text-lg mb-2">WQI: {level.range}</div>
                <div className="text-lg font-medium text-slate-300 mb-2">{level.label}</div>
                <div className="text-sm text-slate-400">{level.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Key Features</h2>
            <p className="text-xl text-slate-300">
              Powerful tools to monitor and analyze water quality data
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-slate-800 rounded-xl p-8 border border-slate-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-300">
              Simple steps to contribute to Nepal's water quality monitoring
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                step: '1',
                title: 'Sign Up & Test Water',
                desc: 'Create your account and collect water samples from your area using basic testing kits.'
              },
              {
                step: '2',
                title: 'Upload Data',
                desc: 'Submit your measurements including pH, turbidity, and location information.'
              },
              {
                step: '3',
                title: 'View Insights',
                desc: 'Explore community data on interactive maps and help improve water quality.'
              }
            ].map((item, idx) => (
              <div key={idx}>
                <div className={`bg-${['blue', 'green', 'purple'][idx]}-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6 mx-auto`}>
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join the NephraNet community and help monitor water quality across Nepal
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Join NephraNet Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
