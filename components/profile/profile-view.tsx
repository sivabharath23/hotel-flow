"use client";

import { useState } from "react";
import { logoutHotel } from "@/actions/auth";
import { updateHotelLogo, updateHotelProfile } from "@/actions/hotel";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Building2, User, Phone, Mail, MapPin, FileText, LogOut, ShieldCheck, Camera, Edit3, X, Check, Globe } from "lucide-react";

interface ProfileViewProps {
  hotel: {
    name: string;
    owner: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    gst: string | null;
    hotelType: string;
    logoUrl: string | null;
    currency: string;
  } | null;
}

const HOTEL_TYPES = [
  "Hotel",
  "Restaurant",
  "Cafe",
  "Tea Shop",
  "Lodge",
  "Guest House",
  "Resort",
];

const CURRENCIES = [
  { code: "INR", symbol: "₹ (Indian Rupee)" },
  { code: "USD", symbol: "$ (US Dollar)" },
  { code: "EUR", symbol: "€ (Euro)" },
  { code: "GBP", symbol: "£ (British Pound)" },
  { code: "AED", symbol: "AED (UAE Dirham)" },
];

export function ProfileView({ hotel }: ProfileViewProps) {
  const [logo, setLogo] = useState<string | null>(hotel?.logoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!hotel) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Profile Details Not Found</h3>
        <p className="text-xs text-slate-500">Could not load hotel profile information. Please try logging in again.</p>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setLogo(base64String);
      setUploading(true);
      const res = await updateHotelLogo(base64String);
      setUploading(false);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Hotel photo updated successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutHotel();
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateHotelProfile(formData);
    setUpdating(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Hotel profile updated successfully!");
      setIsEditModalOpen(false);
    }
  };

  const hotelName = hotel?.name || "Hotel Profile";
  const initialChar = hotelName.charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Profile Card - Compact */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xs overflow-hidden border-2 border-white dark:border-slate-800">
              {logo ? (
                <img src={logo} alt={hotelName} className="w-full h-full object-cover" />
              ) : (
                initialChar
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 dark:bg-blue-600 text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xs" title="Upload photo">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {hotelName}
            </h2>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {hotel?.hotelType || "Hotel"} • Registered Property
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {[hotel?.city, hotel?.state].filter(Boolean).join(", ") || "Location not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="py-2 px-3.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="py-2 px-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Property & Owner Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Hotel Information & Credentials</h3>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <User className="w-3 h-3 text-blue-600" /> Owner Name
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel?.owner || "Not set"}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Phone className="w-3 h-3 text-blue-600" /> Contact Phone
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel?.phone || "Not set"}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Mail className="w-3 h-3 text-blue-600" /> Registered Email
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel?.email || "Not set"}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <FileText className="w-3 h-3 text-blue-600" /> GST Number
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel?.gst || "Not Provided"}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-600" /> Operating Currency
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel?.currency || "INR"}</p>
          </div>

          <div className="space-y-0.5 md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" /> Property Address
            </span>
            <p className="font-bold text-slate-900 dark:text-white">
              {[hotel?.address, hotel?.city, hotel?.state].filter(Boolean).join(", ") || "Address not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Drawer */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Hotel Profile</h3>
                  <p className="text-xs text-slate-400">Update your property credentials and contact details</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Hotel / Property Name *</label>
                  <input type="text" name="name" defaultValue={hotel?.name || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-600" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Owner Name *</label>
                  <input type="text" name="owner" defaultValue={hotel?.owner || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Phone *</label>
                  <input type="tel" name="phone" defaultValue={hotel?.phone || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-600" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Registered Email *</label>
                  <input type="email" name="email" defaultValue={hotel?.email || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Property Type *</label>
                  <select name="hotelType" defaultValue={hotel?.hotelType || "Hotel"} required className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none">
                    {HOTEL_TYPES.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Currency *</label>
                  <select name="currency" defaultValue={hotel?.currency || "INR"} required className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none">
                    {CURRENCIES.map((c) => (<option key={c.code} value={c.code}>{c.symbol}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">GST Number</label>
                  <input type="text" name="gst" defaultValue={hotel?.gst || ""} placeholder="Optional GSTIN" className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Street Address *</label>
                <input type="text" name="address" defaultValue={hotel?.address || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">City *</label>
                  <input type="text" name="city" defaultValue={hotel?.city || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">State / Province *</label>
                  <input type="text" name="state" defaultValue={hotel?.state || ""} required className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white font-semibold outline-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 px-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Cancel</button>
                <button type="submit" disabled={updating} className="flex-1 py-2.5 px-3 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sign Out Account"
        description="Are you sure you want to sign out of your HotelFlow register session?"
        confirmText="Yes, Sign Out"
        loading={loggingOut}
      />
    </div>
  );
}
