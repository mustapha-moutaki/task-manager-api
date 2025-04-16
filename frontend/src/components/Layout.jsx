import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern Header with depth and navigation */}
      <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Logo/Brand */}
              <div className="flex-shrink-0">
                <svg className="h-10 w-10 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">TaskMaster</h1>
                <p className="text-xs text-indigo-200">Organize your work efficiently</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              <a href="#" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Projects</a>
              <a href="#" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Calendar</a>
              <a href="#" className="text-indigo-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Reports</a>
            </nav>
            
            {/* User menu (placeholder) */}
            <div className="flex items-center">
              <button className="flex items-center text-sm text-white focus:outline-none">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500">
                  <span className="text-sm font-medium leading-none text-white">U</span>
                </span>
                <span className="ml-2 hidden lg:block">User Name</span>
                <svg className="ml-1 h-5 w-5 text-indigo-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation bar */}
      <div className="md:hidden bg-indigo-800 text-white">
        <div className="flex justify-around py-2">
          <a href="#" className="text-indigo-100 hover:text-white flex flex-col items-center text-xs">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </a>
          <a href="#" className="text-indigo-100 hover:text-white flex flex-col items-center text-xs">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Tasks</span>
          </a>
          <a href="#" className="text-indigo-100 hover:text-white flex flex-col items-center text-xs">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Calendar</span>
          </a>
          <a href="#" className="text-indigo-100 hover:text-white flex flex-col items-center text-xs">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profile</span>
          </a>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">{children}</main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">TaskMaster</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Helping you organize tasks and boost productivity since 2025.
                </p>
                <div className="flex space-x-4">
                  {/* Social Icons */}
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Home</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">About Us</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Features</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Pricing</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a>
                  </li>
                </ul>
              </div>
              
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                <address className="not-italic text-sm text-gray-400">
                  <p className="mb-2">123 Task Street</p>
                  <p className="mb-2">Productivity City, PC 12345</p>
                  <p className="mb-2">United States</p>
                </address>
                <p className="text-sm text-gray-400 mb-2">
                  <a href="mailto:info@taskmaster.com" className="hover:text-white">info@taskmaster.com</a>
                </p>
                <p className="text-sm text-gray-400">
                  <a href="tel:+11234567890" className="hover:text-white">+1 (123) 456-7890</a>
                </p>
              </div>
            </div>
            
            {/* Copyright section */}
            <div className="pt-8 mt-8 border-t border-gray-800 text-sm text-center text-gray-400">
              <p>&copy; 2025 TaskMaster. All rights reserved.</p>
              <div className="mt-2 flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;