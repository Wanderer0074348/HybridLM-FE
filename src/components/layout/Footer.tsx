'use client';

import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm mt-20 bg-gray-900/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">HybridLM</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Intelligent query routing between cloud LLMs and edge SLMs with semantic caching for optimal performance and cost.
            </p>
          </div>

          {/* Connect */}
          <div className="space-y-4 md:text-right">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4 md:justify-end">
              <a
                href="https://github.com/Wanderer0074348"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/tanaymatta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:tanaymatta27@gmail.com"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} HybridLM. Enjoy!.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Save the pennies!
          </p>
        </div>
      </div>
    </footer>
  );
}
