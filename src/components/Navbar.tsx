import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Droplets, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import logo from '../assets/logo.png'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMenuOpen(false)
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    ...(user ? [
      { to: '/upload', label: 'Upload' },
      { to: '/map', label: 'Map' },
      { to: '/community', label: 'Community' },
    ] : []),
  ]

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
              <img src={logo} alt="Nephranet Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold">NephraNet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-slate-300 hover:text-white transition-colors font-medium"
              >
                {label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-slate-300 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors mx-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}