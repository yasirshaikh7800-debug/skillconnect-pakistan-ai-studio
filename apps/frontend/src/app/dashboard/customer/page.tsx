'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SAMPLE_BOOKINGS } from '@/lib/mockData';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, MapPin, CreditCard, X, Phone, Download, FileText, HelpCircle, Bell, User, Settings, LogOut, Check } from 'lucide-react';
import AiCareerInsightsCard from '@/components/ai/AiCareerInsightsCard';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState(SAMPLE_BOOKINGS);
  const [supportBooking, setSupportBooking] = useState<any | null>(null);
  const [receiptBooking, setReceiptBooking] = useState<any | null>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSent, setDisputeSent] = useState(false);

  // Notifications State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Booking SCPK-10293 Confirmed', time: '10m ago', read: false, type: 'booking' },
    { id: 'notif-2', title: 'Electrician Muhammad Ali dispatched', time: '25m ago', read: false, type: 'dispatch' },
    { id: 'notif-3', title: '15% Off Summer AC Maintenance in Karachi', time: '2h ago', read: true, type: 'promo' },
  ]);

  // Profile Settings State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Yasir Shaikh',
    phone: '+92 300 1234567',
    city: 'Karachi',
    address: 'DHA Phase 6, Karachi',
    preferredLang: 'English & Urdu',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('skillconnect_auth_token');
    localStorage.removeItem('skillconnect_user_session');
    document.cookie = 'skillconnect_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => {
      setProfileSaved(false);
      setProfileModalOpen(false);
    }, 1200);
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillconnect_user_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge custom bookings with sample bookings, deduplicating by id or bookingCode
          const customCodes = new Set(parsed.map((b) => b.bookingCode));
          const filteredSample = SAMPLE_BOOKINGS.filter((b) => !customCodes.has(b.bookingCode));
          setBookings([...parsed, ...filteredSample]);
        }
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const activeBookingsCount = bookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED').length;
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'PAID' || b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Header with Profile, Notifications, and Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Customer & Career Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track active service bookings, AI career recommendations, payment receipts & completed work
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Platform Notifications</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Mark read
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 rounded-xl text-xs space-y-0.5 ${
                        notif.read ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-600/20'
                      }`}
                    >
                      <p className="font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Settings Button */}
          <button
            onClick={() => setProfileModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1.5 hover:border-blue-600 shadow-sm transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Profile & Settings</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500/10 text-slate-700 dark:text-slate-300 hover:text-red-500 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* AI Career Insights Section */}
      <AiCareerInsightsCard />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Active Bookings</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{activeBookingsCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Spent (PKR)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            PKR {totalSpent.toLocaleString()}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Primary Service City</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {bookings[0]?.address ? bookings[0].address.split(',').pop()?.trim() : 'Karachi, Pakistan'}
          </p>
        </div>
      </div>

      {/* Active & Past Bookings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            My Service Requests ({bookings.length})
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Auto-synced with instant booking</span>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => {
            const isCompleted = booking.status === 'COMPLETED';
            return (
              <div
                key={booking.id || booking.bookingCode}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      REF: {booking.bookingCode}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {booking.service?.title || 'Home Maintenance Service'}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${
                      isCompleted
                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Assigned Worker</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {booking.provider?.profile?.firstName || 'Assigned Worker'}{' '}
                      {booking.provider?.profile?.lastName || ''}
                    </span>
                    {booking.provider?.cnicNumber && (
                      <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                        CNIC Verified
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Location Address</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {booking.address}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Scheduled Time</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(booking.scheduledAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-400 text-[10px]">Total Fee (PKR)</span>
                    <span className="font-black text-blue-600 dark:text-blue-400 text-sm">
                      PKR {booking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSupportBooking(booking);
                      setDisputeSent(false);
                      setDisputeReason('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Support / Help
                  </button>
                  <button
                    onClick={() => setReceiptBooking(booking)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support / Dispute Modal */}
      {supportBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  SkillConnect Support Desk
                </h3>
              </div>
              <button
                onClick={() => setSupportBooking(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <p className="text-slate-600 dark:text-slate-300">
                Assistance for Booking Reference:{' '}
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  {supportBooking.bookingCode}
                </span>
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <p className="font-bold text-slate-800 dark:text-slate-200">24/7 Citizen Helpline</p>
                <p className="text-slate-600 dark:text-slate-400">📞 Phone: 021-111-SKILL (75455)</p>
                <p className="text-slate-600 dark:text-slate-400">💬 WhatsApp: +92 300 1234567</p>
                <p className="text-slate-600 dark:text-slate-400">✉️ Email: support@skillconnect.pk</p>
              </div>

              {disputeSent ? (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400">
                  <p className="font-bold">Ticket Submitted Successfully!</p>
                  <p className="text-[11px] mt-1">Ticket #TK-{Math.floor(1000 + Math.random() * 9000)} is logged. A support representative will call you within 15 minutes.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Report an Issue or Request Reschedule
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select reason...</option>
                    <option value="reschedule">Reschedule Visit Time</option>
                    <option value="late">Worker Late / Not Arrived</option>
                    <option value="price_dispute">Pricing Query / PKR Breakdown</option>
                    <option value="quality">Quality of Work Guarantee</option>
                  </select>
                  <button
                    onClick={() => setDisputeSent(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Submit Support Ticket
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setSupportBooking(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Invoice / Receipt Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Payment Receipt & Tax Invoice
                </h3>
              </div>
              <button
                onClick={() => setReceiptBooking(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  INV-{receiptBooking.bookingCode}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Date:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(receiptBooking.createdAt || receiptBooking.scheduledAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Service:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {receiptBooking.service?.title || 'Home Maintenance'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>Payment Mode:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {receiptBooking.paymentMethod || 'JazzCash / EasyPaisa'}
                </span>
              </div>

              <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Service Fee:</span>
                  <span>PKR {Math.round(receiptBooking.totalAmount * 0.95).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Sindh / Punjab Services Sales Tax (5%):</span>
                  <span>PKR {Math.round(receiptBooking.totalAmount * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount Paid:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    PKR {receiptBooking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-[11px] text-blue-600 dark:text-blue-400">
                ✓ NADRA CNIC-Verified Provider Guarantee Applied
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReceiptBooking(null)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Account Settings Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Customer Profile & Settings
                </h3>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSaved && (
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-600 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Mobile Number (SMS / OTP Verified)
                </label>
                <input
                  type="text"
                  required
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Default City
                </label>
                <input
                  type="text"
                  required
                  value={userProfile.city}
                  onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Primary Address for Repairs
                </label>
                <input
                  type="text"
                  required
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Interface Language
                </label>
                <select
                  value={userProfile.preferredLang}
                  onChange={(e) => setUserProfile({ ...userProfile, preferredLang: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="English & Urdu">English & Urdu (Bilingual)</option>
                  <option value="Urdu Only">اردو (Urdu)</option>
                  <option value="English Only">English Only</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
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
