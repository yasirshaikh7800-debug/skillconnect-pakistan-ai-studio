'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_BOOKINGS } from '@/lib/mockData';
import { ShieldCheck, CheckCircle2, Wallet, Plus, Star, MapPin, AlertCircle, X, ArrowUpRight, Bell, Settings, LogOut, Check } from 'lucide-react';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const [walletBalance, setWalletBalance] = useState(14500);
  const [isOnline, setIsOnline] = useState(true);
  const [completedJobIds, setCompletedJobIds] = useState<string[]>([]);
  const [jobsCount, setJobsCount] = useState(84);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'JAZZCASH' | 'EASYPAISA' | 'MEEZAN_BANK'>('JAZZCASH');
  const [payoutAccount, setPayoutAccount] = useState('0300-1234567');
  const [payoutNotice, setPayoutNotice] = useState<string | null>(null);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'pnotif-1', title: 'New AC repair order in Clifton, Karachi', time: '5m ago', read: false },
    { id: 'pnotif-2', title: 'Payout of PKR 12,000 processed to JazzCash', time: '1h ago', read: true },
    { id: 'pnotif-3', title: '5-Star rating received from customer Ali', time: '3h ago', read: true },
  ]);

  // Profile Settings State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [providerProfile, setProviderProfile] = useState({
    name: 'Muhammad Tariq',
    trade: 'Master Electrician & UPS Specialist',
    phone: '+92 300 1234567',
    city: 'Karachi (South & East)',
    cnic: '42101-1234567-1',
    hourlyRate: '1,200',
    serviceRadiusKm: '15',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('skillconnect_auth_token');
    localStorage.removeItem('skillconnect_user_session');
    router.push('/login');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
      setProfileModalOpen(false);
    }, 1200);
  };

  const handleMarkCompleted = (bookingId: string, bookingCode: string, earning: number) => {
    if (completedJobIds.includes(bookingId)) return;
    setCompletedJobIds((prev) => [...prev, bookingId]);
    setJobsCount((prev) => prev + 1);
    setWalletBalance((prev) => prev + earning);
    setPayoutNotice(`Order ${bookingCode} marked completed! PKR ${earning.toLocaleString()} added to your wallet.`);
    setTimeout(() => setPayoutNotice(null), 5000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = walletBalance;
    if (withdrawAmount <= 0) return;
    setWalletBalance(0);
    setWithdrawModalOpen(false);
    setPayoutNotice(`PKR ${withdrawAmount.toLocaleString()} transfer initiated to ${payoutMethod} (${payoutAccount}). Reference #JZ-${Math.floor(100000 + Math.random() * 900000)}.`);
    setTimeout(() => setPayoutNotice(null), 7000);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification Banner */}
      {payoutNotice && (
        <div className="p-4 rounded-2xl bg-blue-600/15 border border-blue-600/40 text-blue-600 dark:text-blue-600 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{payoutNotice}</span>
          </div>
          <button onClick={() => setPayoutNotice(null)} className="text-blue-600 dark:text-blue-600 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header with Status Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-900">
              Provider Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-50 text-blue-600 dark:text-blue-600 text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CNIC Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage incoming repair requests, wallet balance in PKR, and service areas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-3 bg-white dark:bg-white p-2.5 rounded-2xl border border-slate-200 dark:border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-700">
              Availability
            </span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                isOnline
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-50 text-slate-500'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-200 bg-white dark:bg-white text-slate-600 dark:text-slate-700 hover:text-blue-600 dark:hover:text-blue-600 transition-colors shadow-sm cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-900 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-white rounded-2xl border border-slate-200 dark:border-slate-200 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-900">Provider Alerts</span>
                  <button
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-600 hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                        notif.read ? 'bg-slate-50 dark:bg-slate-50/50' : 'bg-blue-50 dark:bg-blue-50 border border-blue-600/20'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-slate-900">{notif.title}</p>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Provider Profile & Trade Settings */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-200 bg-white dark:bg-white text-slate-700 dark:text-slate-800 font-bold text-xs flex items-center space-x-1.5 hover:border-blue-600 shadow-sm transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-600" />
            <span>Profile & Trade</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-50 hover:bg-red-500/10 text-slate-700 dark:text-slate-700 hover:text-red-500 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Wallet & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-600/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-600">Total Earnings Wallet</span>
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black">PKR {walletBalance.toLocaleString()}</p>
          <div className="pt-2 flex space-x-2">
            <button
              onClick={() => setWithdrawModalOpen(true)}
              disabled={walletBalance <= 0}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <span>Withdraw Payout</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Jobs Completed</span>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-900">{jobsCount}</p>
          <p className="text-[11px] text-blue-600 dark:text-blue-600 font-semibold">
            98% Positive Customer Feedback
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-500">Rating & CNIC</span>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-500 fill-current" />
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-900">4.9 / 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400">CNIC # 42101-1234567-1 Verified</p>
        </div>
      </div>

      {/* Incoming Service Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-900">
          Assigned Service Orders
        </h2>

        <div className="space-y-4">
          {SAMPLE_BOOKINGS.map((booking) => {
            const isCompleted = completedJobIds.includes(booking.id) || booking.status === 'COMPLETED';
            return (
              <div
                key={booking.id}
                className="p-6 rounded-2xl bg-white dark:bg-white border border-slate-200 dark:border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-200 pb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      ORDER: {booking.bookingCode}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-900">
                      {booking.service.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">Payout Amount</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-600">
                      PKR {booking.providerEarning.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-600">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Customer Name</span>
                    <span className="font-bold text-slate-900 dark:text-slate-800">
                      {booking.customer?.profile?.firstName} {booking.customer?.profile?.lastName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Job Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-800">
                      {booking.address}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Status</span>
                    <span className={`font-bold ${isCompleted ? 'text-blue-600 dark:text-blue-600' : 'text-amber-600 dark:text-amber-400'}`}>
                      {isCompleted ? 'COMPLETED' : booking.status}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-200 flex justify-end space-x-2">
                  <button
                    onClick={() => handleMarkCompleted(booking.id, booking.bookingCode, booking.providerEarning)}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                      isCompleted
                        ? 'bg-blue-100 dark:bg-blue-50 text-blue-600 dark:text-blue-600 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    {isCompleted ? '✓ Work Completed' : 'Mark Work Completed'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-white rounded-3xl border border-slate-200 dark:border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-900">
                  Withdraw Provider Payout
                </h3>
              </div>
              <button
                onClick={() => setWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  Available Wallet Balance
                </label>
                <p className="text-xl font-black text-blue-600 dark:text-blue-600">
                  PKR {walletBalance.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  Select Payout Gateway
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e: any) => setPayoutMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="JAZZCASH">JazzCash Mobile Account</option>
                  <option value="EASYPAISA">EasyPaisa Mobile Account</option>
                  <option value="MEEZAN_BANK">Meezan Bank IBAN Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  Registered Account / Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  placeholder="0300-1234567 or IBAN PK..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-50 border border-slate-200 dark:border-slate-300 text-[11px] text-slate-600 dark:text-slate-600">
                1-Hour Instant Payout guarantee for CNIC-verified verified providers. Zero platform deduction on JazzCash/EasyPaisa.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-50 text-slate-700 dark:text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider Profile & Trade Settings Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-white rounded-3xl border border-slate-200 dark:border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-900">
                  Provider Trade & Profile Settings
                </h3>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-50 border border-blue-600 dark:border-blue-600 text-blue-600 dark:text-blue-600 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span>Trade settings and hourly rate saved!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={providerProfile.name}
                  onChange={(e) => setProviderProfile({ ...providerProfile, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  Skilled Trade / Specialization
                </label>
                <input
                  type="text"
                  required
                  value={providerProfile.trade}
                  onChange={(e) => setProviderProfile({ ...providerProfile, trade: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                    Hourly Rate (PKR)
                  </label>
                  <input
                    type="text"
                    required
                    value={providerProfile.hourlyRate}
                    onChange={(e) => setProviderProfile({ ...providerProfile, hourlyRate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                    Radius Coverage (KM)
                  </label>
                  <input
                    type="text"
                    required
                    value={providerProfile.serviceRadiusKm}
                    onChange={(e) => setProviderProfile({ ...providerProfile, serviceRadiusKm: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-50 dark:bg-slate-50 text-xs text-slate-900 dark:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-700">
                  NADRA CNIC Number (Verified)
                </label>
                <input
                  type="text"
                  disabled
                  value={providerProfile.cnic}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-300 bg-slate-100 dark:bg-slate-50 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-50 text-slate-700 dark:text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
