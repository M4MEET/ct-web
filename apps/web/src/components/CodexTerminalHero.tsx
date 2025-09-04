'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const rotatingText = [
  'ecommerce platforms',
  'Shopware solutions',
  'marketing automation',
  'cloud infrastructure'
];

export function CodexTerminalHero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingText.length);
        setIsAnimating(false);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-codex-terminal-component pt-20 pb-16 min-h-[90vh]">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary-200/80 to-primary-300/60 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-primary-100/70 to-primary-200/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-200/40 to-primary-100/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Terminal window */}
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-400 font-mono">codex-terminal@localhost:~$</div>
            <div className="w-16"></div>
          </div>
          
          {/* Terminal content */}
          <div className="p-8 font-mono text-green-400">
            {/* Command prompt */}
            <div className="mb-6">
              <span className="text-blue-400">user@codex-terminal</span>
              <span className="text-white">:</span>
              <span className="text-cyan-400">~</span>
              <span className="text-white">$ ./startup.sh</span>
            </div>
            
            {/* Terminal output */}
            <div className="space-y-2 mb-8">
              <div className="text-green-400">✓ Initializing CodeX Terminal...</div>
              <div className="text-green-400">✓ Loading enterprise solutions...</div>
              <div className="text-green-400">✓ Shopware modules ready</div>
              <div className="text-green-400">✓ Cloud infrastructure online</div>
              <div className="text-yellow-400">→ System ready for deployment</div>
            </div>
            
            {/* Main content in terminal style */}
            <div className="text-center space-y-6">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                <span className="text-green-400">&gt;</span> We build{' '}
                <span className="relative inline-block">
                  <span
                    className={`inline-block transition-all duration-300 ${
                      isAnimating ? 'opacity-0 transform -translate-y-4' : 'opacity-100 transform translate-y-0'
                    }`}
                  >
                    <span className="text-primary-400">
                      {rotatingText[currentTextIndex]}
                    </span>
                  </span>
                </span>
                <br />
                <span className="text-green-400">&gt;</span> that scale
              </div>

              <div className="text-gray-300 mb-8 max-w-2xl mx-auto">
                <span className="text-blue-400"># </span>
                From custom Shopware development to comprehensive digital marketing and cloud infrastructure
              </div>

              {/* Terminal-style buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-6 py-3 text-black bg-green-400 hover:bg-green-300 font-mono font-semibold transition-all duration-200 border border-green-400"
                >
                  ./start-project.sh
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
                
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 text-green-400 bg-transparent border border-green-400 hover:bg-green-400 hover:text-black font-mono font-semibold transition-all duration-200"
                >
                  cat services.txt
                </Link>
              </div>

              {/* Terminal stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1 font-mono">50+</div>
                  <div className="text-xs text-gray-400 font-mono"># Projects deployed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1 font-mono">99.9%</div>
                  <div className="text-xs text-gray-400 font-mono"># Uptime achieved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1 font-mono">24/7</div>
                  <div className="text-xs text-gray-400 font-mono"># Support available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1 font-mono">5★</div>
                  <div className="text-xs text-gray-400 font-mono"># Client rating</div>
                </div>
              </div>
            </div>
            
            {/* Blinking cursor */}
            <div className="mt-6">
              <span className="text-blue-400">user@codex-terminal</span>
              <span className="text-white">:</span>
              <span className="text-cyan-400">~</span>
              <span className="text-white">$ </span>
              <span className="animate-pulse">█</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}