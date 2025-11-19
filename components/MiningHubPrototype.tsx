'use client';

import { useState } from 'react';

export default function MiningHubPrototype() {
  const [activeSection, setActiveSection] = useState('Home');

  const sections = [
    { name: 'Home', active: true },
    { name: 'Projects', active: true },
    { name: 'Community', active: true },
    { name: 'Research', active: false },
    { name: 'Marketplace', active: false },
    { name: 'Jobs', active: false },
    { name: 'Forum', active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-emerald-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">MiningHub</h1>
          <nav className="space-x-6">
            {sections.map((s) => (
              <button
                key={s.name}
                onClick={() => s.active && setActiveSection(s.name)}
                className={`${
                  s.active
                    ? activeSection === s.name
                      ? 'font-semibold text-yellow-300'
                      : 'hover:text-yellow-200'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                {s.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto mt-10 p-6">
        {activeSection === 'Home' && (
          <section>
            <h2 className="text-3xl font-bold text-emerald-700 mb-3">Welcome to MiningHub</h2>
            <p className="text-gray-700 leading-relaxed">
              This platform connects mining and water engineers worldwide. Explore real-world projects, collaborate with peers, and share knowledge to make mining more sustainable.
            </p>
          </section>
        )}

        {activeSection === 'Projects' && (
          <section>
            <h2 className="text-3xl font-bold text-emerald-700 mb-3">Active Projects</h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Mine Water Reuse & Treatment Pilot – Germany</li>
              <li>AI-based Mineral Processing Optimization – Australia</li>
              <li>Groundwater Monitoring Network for Mining Areas – Chile</li>
            </ul>
          </section>
        )}

        {activeSection === 'Community' && (
          <section>
            <h2 className="text-3xl font-bold text-emerald-700 mb-3">Community Highlights</h2>
            <p className="text-gray-700 leading-relaxed">
              Join a global network of professionals, researchers, and companies working together to advance responsible mining practices.
            </p>
          </section>
        )}

        {!['Home', 'Projects', 'Community'].includes(activeSection) && (
          <section className="text-gray-500 italic text-center mt-20">
            {activeSection} section will be available soon...
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-6 bg-gray-800 text-gray-300 text-center">
        <p>© {new Date().getFullYear()} MiningHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
