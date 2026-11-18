import React from 'react';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Navbar } from '@/components/Navbar';
import SkillConnectLogo from '@/components/SkillConnectLogo';
import { ShieldCheck, PhoneCall, Heart, CheckCircle2, Sparkles, MapPin, Zap } from 'lucide-react';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#050814] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200 relative">
        {/* Subtle atmospheric ambient glow */}
        <div className="cyber-bg-atmosphere" />
        
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            {children}
          </main>
          
          {/* Futuristic Dark Footer */}
          <footer className="relative z-10 border-t border-cyan-500/15 bg-[#050814]/95 backdrop-blur-xl mt-16 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Col 1: Brand & Verification */}
                <div className="space-y-4">
                  <SkillConnectLogo variant="full" size="md" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Pakistan&apos;s premier digital platform empowering CNIC-verified skilled artisans, home service professionals, and technical specialists nationwide.
                  </p>
                  <div className="inline-flex items-center space-x-2 text-xs font-medium text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/30 shadow-[0_0_12px_rgba(0,242,254,0.15)]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>NADRA CNIC Verification Guaranteed</span>
                  </div>
                </div>

                {/* Col 2: Major Cities */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Active Hubs</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="hover:text-cyan-300 transition-colors">Electricians in Karachi (DHA, Clifton, Gulshan)</li>
                    <li className="hover:text-cyan-300 transition-colors">HVAC Technicians in Lahore (Gulberg, DHA, Cantt)</li>
                    <li className="hover:text-cyan-300 transition-colors">Plumbers in Islamabad & Rawalpindi</li>
                    <li className="hover:text-cyan-300 transition-colors">Carpenters in Faisalabad & Gujranwala</li>
                    <li className="hover:text-cyan-300 transition-colors">Solar Specialists in Multan & Peshawar</li>
                  </ul>
                </div>

                {/* Col 3: Payment & Trust */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center space-x-2">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    <span>Instant Payments</span>
                  </h4>
                  <div className="space-y-2.5 text-xs text-slate-400">
                    <p className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 font-bold">JazzCash</span>
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">EasyPaisa</span>
                    </p>
                    <p>Cash on Delivery (COD) Verified</p>
                    <p>Transparent 10% Platform Fee</p>
                    <p>Real-Time Direct Artisan Payouts</p>
                  </div>
                </div>

                {/* Col 4: Support Hotline */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4 flex items-center space-x-2">
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Support Desk</span>
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#0a1024] border border-cyan-500/20 space-y-1">
                    <p className="text-xs font-bold text-cyan-300 font-mono tracking-tight">+92 (021) 111-SKILL (75455)</p>
                    <p className="text-[10.5px] text-slate-400">Mon-Sat: 8:00 AM – 10:00 PM PST</p>
                    <p className="text-[10.5px] text-slate-400">Email: support@skillconnect.pk</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-cyan-500/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
                <p>© {new Date().getFullYear()} SkillConnect Pakistan. National Skills Platform.</p>
                <p className="flex items-center space-x-1 mt-2 sm:mt-0">
                  <span>Powering Pakistan&apos;s skilled future</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 ml-1" />
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
