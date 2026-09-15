import React from 'react';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';
import SkillConnectLogo from '@/components/SkillConnectLogo';
import { ShieldCheck, PhoneCall, Heart, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'SkillConnect Pakistan | Trusted Skilled Service Providers',
  description: 'Book CNIC-verified electricians, plumbers, AC technicians, carpenters and artisans across Karachi, Lahore, Islamabad & Pakistan with AI-powered skill matching.',
  openGraph: {
    title: 'SkillConnect Pakistan | Trusted Skilled Service Providers',
    description: 'Book CNIC-verified electricians, plumbers, AC technicians, carpenters and artisans across Karachi, Lahore, Islamabad & Pakistan with AI-powered skill matching.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white dark:bg-white text-slate-900 dark:text-slate-900 transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="border-t border-slate-200 dark:border-slate-200 bg-slate-50/50 dark:bg-white mt-12 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Col 1 */}
                <div className="space-y-4">
                  <SkillConnectLogo variant="full" size="md" />
                  <p className="text-xs text-slate-500 dark:text-slate-600 leading-relaxed">
                    Pakistan&apos;s digital platform empowering CNIC-verified skilled workers and home service artisans across major cities.
                  </p>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-600 bg-blue-50 dark:bg-blue-50 px-3 py-1.5 rounded-md w-fit border border-blue-200 dark:border-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>NADRA CNIC Verification Guaranteed</span>
                  </div>
                </div>

                {/* Col 2 */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 uppercase tracking-wider mb-3">
                    Major Cities
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-600">
                    <li>Electricians in Karachi (DHA, Gulshan)</li>
                    <li>AC Technicians in Lahore (Gulberg, DHA)</li>
                    <li>Plumbers in Islamabad (F-Sector, G-Sector)</li>
                    <li>Carpenters in Rawalpindi & Faisalabad</li>
                    <li>Solar Technicians in Multan & Peshawar</li>
                  </ul>
                </div>

                {/* Col 3 */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 uppercase tracking-wider mb-3">
                    Payment & Trust
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-600">
                    <p className="flex items-center space-x-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-50 text-blue-600 dark:text-blue-600 font-bold">JazzCash</span>
                      <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold">EasyPaisa</span>
                    </p>
                    <p>Cash on Delivery (COD) supported</p>
                    <p>Flat 10% Platform Commission</p>
                    <p>Instant Provider Payouts</p>
                  </div>
                </div>

                {/* Col 4 */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 uppercase tracking-wider mb-3">
                    Support Hotline
                  </h4>
                  <div className="flex items-center space-x-3 text-slate-700 dark:text-slate-700 mb-2">
                    <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                    <div>
                      <p className="text-sm font-bold">+92 (021) 111-SKILL (75455)</p>
                      <p className="text-[11px] text-slate-400">Mon-Sat: 8:00 AM - 10:00 PM PST</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Email: support@skillconnect.pk</p>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
                <p>© {new Date().getFullYear()} SkillConnect Pakistan. All rights reserved.</p>
                <p className="flex items-center space-x-1 mt-2 sm:mt-0">
                  <span>Crafted with</span>
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                  <span>for Pakistan&apos;s skilled artisans</span>
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
