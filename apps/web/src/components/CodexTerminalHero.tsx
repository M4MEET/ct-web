'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export function CodexTerminalHero() {
  const locale = useLocale();
  const t = useTranslations('hero.terminalCommands');

  const rotatingText = [
    t('ecommercePlatforms'),
    'Shopware solutions',
    'marketing automation',
    'cloud infrastructure'
  ];

  const terminalSequence = [
    { type: 'init', text: 'codex-terminal init', delay: 1000 },
    { type: 'command', text: './deploy-solutions.sh', delay: 1500 },
    { type: 'ascii', delay: 2000 },
    { type: 'step', text: 'Initializing CodeX Terminal Enterprise Suite...', delay: 2500 },
    { type: 'step', text: 'Loading software development modules', progress: true, delay: 3000 },
    { type: 'step', text: 'Spinning up cloud infrastructure', progress: true, delay: 3500 },
    { type: 'step', text: 'Optimizing marketing automation pipelines', progress: true, delay: 4000 },
    { type: 'step', text: 'System ready for enterprise deployment', final: true, delay: 4500 },
    { type: 'content', delay: 5000 }
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showCommand, setShowCommand] = useState(false);
  const [showAscii, setShowAscii] = useState(false);
  const [typedSteps, setTypedSteps] = useState<string[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInitCommand, setShowInitCommand] = useState(false);

  // Typing animation function
  const typeText = (text: string, callback: () => void) => {
    setIsTyping(true);
    setTypingText('');
    
    let currentText = '';
    let currentIndex = 0;
    
    const typing = setInterval(() => {
      if (currentIndex < text.length) {
        currentText = text.substring(0, currentIndex + 1);
        setTypingText(currentText);
        currentIndex++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
        setTimeout(callback, 300);
      }
    }, 50);
  };

  useEffect(() => {
    // Check if animation has already run
    if (typeof window !== 'undefined') {
      const animationFlag = sessionStorage.getItem('terminal-animated');
      if (animationFlag) {
        // Skip animation, show everything immediately
        setShowPrompt(true);
        setShowCommand(true);
        setShowAscii(true);
        setTypedSteps(['Initializing CodeX Terminal Enterprise Suite...', 'Loading software development modules', 'Spinning up cloud infrastructure', 'Optimizing marketing automation pipelines', 'System ready for enterprise deployment']);
        setShowFinal(true);
        setHasAnimated(true);
        return;
      }
    }

    // Run the sequential animation
    const runSequence = async () => {
      // Step 1: Show prompt
      setTimeout(() => setShowPrompt(true), 500);
      
      // Step 2: Type "codex-terminal init"
      setTimeout(() => {
        setShowInitCommand(true);
        typeText('codex-terminal init', () => {
          // Hide init command and show deploy command
          setTimeout(() => {
            setShowInitCommand(false);
            setTypingText('');
            
            // Step 3: Type "./deploy-solutions.sh"
            setTimeout(() => {
              typeText('./deploy-solutions.sh', () => {
                setShowCommand(true);
                setTypingText('');
                
                // Step 4: Show ASCII art
                setTimeout(() => {
                  setShowAscii(true);
                  
                  // Step 5: Add terminal steps one by one
                const addSteps = () => {
                  const steps = [
                    'Initializing CodeX Terminal Enterprise Suite...',
                    'Loading software development modules',
                    'Spinning up cloud infrastructure',
                    'Optimizing marketing automation pipelines',
                    'System ready for enterprise deployment'
                  ];
                  
                  steps.forEach((step, index) => {
                    setTimeout(() => {
                      setTypedSteps(prev => [...prev, step]);
                      if (index === steps.length - 1) {
                        setTimeout(() => {
                          setShowFinal(true);
                          setHasAnimated(true);
                          // Mark animation as completed
                          if (typeof window !== 'undefined') {
                            sessionStorage.setItem('terminal-animated', 'true');
                          }
                        }, 500);
                      }
                    }, index * 600);
                  });
                };
                
                addSteps();
              }, 800);
            });
          }, 400);
          }, 400);
        });
      }, 1000);
    };

    runSequence();

    // Rotating text animation (starts after main animation)
    const textInterval = setInterval(() => {
      if (hasAnimated) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % rotatingText.length);
          setIsAnimating(false);
        }, 150);
      }
    }, 3000);

    return () => clearInterval(textInterval);
  }, [hasAnimated]);

  return (
    <section className="relative overflow-hidden bg-codex-terminal-component pt-16 sm:pt-20 pb-6 sm:pb-8 min-h-[50vh] sm:min-h-[60vh]">
      {/* Background gradient orbs - optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-16 sm:-right-32 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-primary-200/80 to-primary-300/60 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-16 sm:-bottom-32 -left-16 sm:-left-32 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-tr from-primary-100/70 to-primary-200/50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-radial from-primary-200/40 to-primary-100/20 rounded-full blur-2xl"></div>
      </div>
      
      {/* Terminal window */}
      <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
        <div className="relative">
          {/* Terminal glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-cyan-400/20 to-blue-400/20 rounded-lg sm:rounded-2xl blur-xl"></div>
          
          {/* Main terminal */}
          <div className="relative bg-gray-900/98 backdrop-blur-xl rounded-lg sm:rounded-2xl border border-gray-700/30 shadow-2xl shadow-green-400/5 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-gray-800/95 border-b border-gray-700/40 backdrop-blur-sm">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-red-500 rounded-full shadow-sm hover:bg-red-400 cursor-pointer transition-colors"></div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-yellow-500 rounded-full shadow-sm hover:bg-yellow-400 cursor-pointer transition-colors"></div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full shadow-sm hover:bg-green-400 cursor-pointer transition-colors"></div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-400 font-mono">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">codex-terminal@production</span>
                <span className="sm:hidden">terminal</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-500">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border border-gray-600 rounded cursor-pointer hover:bg-gray-600 transition-colors"></div>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"></div>
              </div>
            </div>
            
            {/* Terminal content */}
            <div className="p-2 sm:p-4 font-mono bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90">
              {/* Animated Command prompt - moved above ASCII */}
              <div className="mb-3 sm:mb-4 space-y-1 sm:space-y-2">
                {/* Init command line (temporary) */}
                {showInitCommand && (
                  <div className="flex items-center text-xs sm:text-sm overflow-hidden">
                    <span className="text-blue-400 font-semibold hidden sm:inline">user@codex-terminal</span>
                    <span className="text-blue-400 font-semibold sm:hidden">user</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-cyan-400 font-semibold hidden sm:inline">~/enterprise</span>
                    <span className="text-cyan-400 font-semibold sm:hidden">~</span>
                    <span className="text-white ml-1">$</span>
                    <span className="text-white ml-2 break-all">{typingText}</span>
                    <span className={`animate-pulse ${isTyping ? 'opacity-100' : 'opacity-0'}`}>█</span>
                  </div>
                )}
                
                {/* Deploy command line (permanent) */}
                {(showPrompt && !showInitCommand) && (
                  <div className="flex items-center text-xs sm:text-sm overflow-hidden">
                    <span className="text-blue-400 font-semibold hidden sm:inline">user@codex-terminal</span>
                    <span className="text-blue-400 font-semibold sm:hidden">user</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-cyan-400 font-semibold hidden sm:inline">~/enterprise</span>
                    <span className="text-cyan-400 font-semibold sm:hidden">~</span>
                    <span className="text-white ml-1">$</span>
                    <span className="text-white ml-2 break-all">{!showCommand ? typingText : './deploy-solutions.sh'}</span>
                    {!showCommand && <span className={`animate-pulse ${isTyping ? 'opacity-100' : 'opacity-0'}`}>█</span>}
                  </div>
                )}
              </div>
              
{/* Responsive ASCII Art Logo */}
              {showAscii && (
                <div className="mb-2 sm:mb-3 text-center transition-all duration-500">
                  <pre className="text-primary-400 text-[8px] sm:text-xs leading-tight opacity-90 overflow-x-auto" style={{fontFamily: 'monospace', fontStyle: 'italic', transform: 'skew(-15deg)'}}>
{`  ██████╗  ██████╗ ██████╗ ███████╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
 ██╔════╝ ██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
 ██║      ██║   ██║██║  ██║█████╗   ╚███╔╝        ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
 ██║      ██║   ██║██║  ██║██╔══╝   ██╔██╗        ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
 ╚██████╗ ╚██████╔╝██████╔╝███████╗██╔╝ ██╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
  ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`}
                  </pre>
                </div>
              )}
              
              {/* Animated Terminal output */}
              <div className="space-y-1 mb-3 sm:mb-4 text-xs sm:text-sm min-h-[80px] sm:min-h-[120px]">
                {typedSteps.map((step, index) => {
                  const isFinal = step === 'System ready for enterprise deployment';
                  const hasProgress = ['Loading software development modules', 'Spinning up cloud infrastructure', 'Optimizing marketing automation pipelines'].includes(step);
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-center transition-all duration-500 opacity-100 translate-y-0 ${
                        isFinal ? 'text-yellow-400 font-semibold' : 'text-green-400'
                      } overflow-hidden`}
                    >
                      <span className={`mr-2 sm:mr-3 flex-shrink-0 ${isFinal ? 'text-yellow-500' : 'text-green-500'}`}>
                        {isFinal ? '▶' : '●'}
                      </span>
                      <span className="flex-1 truncate sm:whitespace-normal">{step}</span>
                      {hasProgress && (
                        <span className="text-gray-500 ml-1 sm:ml-2 animate-pulse hidden sm:inline">
                          [████████████] 100%
                        </span>
                      )}
                      {hasProgress && (
                        <span className="text-gray-500 ml-1 animate-pulse sm:hidden">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Main content in elegant terminal style */}
              <div className={`text-center space-y-3 sm:space-y-4 transition-all duration-1000 ${showFinal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                    <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                      <span className="text-green-400 mr-1 sm:mr-2 text-base sm:text-lg md:text-xl">❯</span>
                      <span className="text-white">{t('weCraft')}</span>
                    </div>
                    <div className="relative px-2">
                      <span
                        className={`inline-block transition-all duration-500 ${
                          isAnimating ? 'opacity-0 transform -translate-y-6 blur-sm' : 'opacity-100 transform translate-y-0'
                        }`}
                      >
                        <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600 bg-clip-text text-transparent font-black break-words">
                          {rotatingText[currentTextIndex]}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-center mt-0.5 sm:mt-1">
                      <span className="text-green-400 mr-1 sm:mr-2 text-base sm:text-lg md:text-xl">❯</span>
                      <span className="text-white">{t('thatDominate')}</span>
                    </div>
                  </div>

                  <div className="max-w-2xl mx-auto px-2">
                    <div className="flex items-start justify-center text-left">
                      <span className="text-blue-400 mr-2 font-bold flex-shrink-0">//</span>
                      <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                        {t('description')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Elegant terminal buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mb-4 sm:mb-6 px-2">
                  <Link
                    href={`/${locale}/contact`}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg font-mono font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-105 border border-primary-400/20 w-full sm:w-auto"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <span className="hidden sm:inline">{t('launchProject')}</span>
                      <span className="sm:hidden">{t('launchProjectMobile')}</span>
                      <span className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300">⚡</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  
                  <Link
                    href={`/${locale}/services`}
                    className="group relative px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm border-2 border-primary-400/50 bg-transparent text-primary-400 rounded-lg font-mono font-bold transition-all duration-300 hover:bg-primary-400/10 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-400/20 hover:scale-105 w-full sm:w-auto"
                  >
                    <span className="flex items-center justify-center">
                      <span className="hidden sm:inline">{t('viewServices')}</span>
                      <span className="sm:hidden">{t('viewServicesMobile')}</span>
                      <span className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400/5 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                  </Link>
                </div>

              </div>
              
              {/* Bottom terminal prompt with blinking cursor */}
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm overflow-hidden">
                <span className="text-blue-400 font-semibold hidden sm:inline">user@codex-terminal</span>
                <span className="text-blue-400 font-semibold sm:hidden">user</span>
                <span className="text-gray-500">:</span>
                <span className="text-cyan-400 font-semibold hidden sm:inline">~/enterprise</span>
                <span className="text-cyan-400 font-semibold sm:hidden">~</span>
                <span className="text-white ml-1">$</span>
                <span className="text-primary-500 ml-2 animate-pulse font-bold">█</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separate Stats Section */}
        <div className="mt-8 sm:mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { value: "150+", label: "projects.deployed", shortLabel: "projects", color: "text-primary-400" },
              { value: "99.9%", label: "uptime.guaranteed", shortLabel: "uptime", color: "text-primary-500" },
              { value: "24/7", label: "support.available", shortLabel: "support", color: "text-primary-600" },
              { value: "5.0★", label: "client.rating", shortLabel: "rating", color: "text-yellow-400" }
            ].map((stat, index) => (
              <div key={index} className="group text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all duration-300 hover:scale-105">
                <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium">
                  <span className="hidden sm:inline">{stat.label.replace('.', ' ')}</span>
                  <span className="sm:hidden">{stat.shortLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}