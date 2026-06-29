"use client";

import { useState } from "react";
import { logoutHotel } from "@/actions/auth";
import { updateHotelLogo } from "@/actions/hotel";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Building2, User, Phone, Mail, MapPin, FileText, LogOut, ShieldCheck, Camera } from "lucide-react";

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

export function ProfileView({ hotel }: ProfileViewProps) {
  const [logo, setLogo] = useState<string | null>(hotel?.logoUrl || null);
  const [uploading, setUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!hotel) return null;

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

  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-in fade-in duration-200">
      {/* Top Profile Card - Compact */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-xs overflow-hidden border-2 border-white dark:border-slate-800">
              {logo ? (
                <img src={logo} alt={hotel.name} className="w-full h-full object-cover" />
              ) : (
                hotel.name.charAt(0)
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 dark:bg-blue-600 text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {hotel.name}
            </h2>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              {hotel.hotelType} • Registered Property
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{hotel.city}, {hotel.state}</p>
          </div>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Account</span>
        </button>
      </div>

      {/* Property & Owner Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Hotel Information & Credentials</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <User className="w-3 h-3 text-blue-600" /> Owner Name
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel.owner}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Phone className="w-3 h-3 text-blue-600" /> Contact Phone
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel.phone}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Mail className="w-3 h-3 text-blue-600" /> Registered Email
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel.email}</p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <FileText className="w-3 h-3 text-blue-600" /> GST Number
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel.gst || "Not Provided"}</p>
          </div>

          <div className="space-y-0.5 md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600" /> Property Address
            </span>
            <p className="font-bold text-slate-900 dark:text-white">{hotel.address}, {hotel.city}, {hotel.state}</p>
          </div>
        </div>
      </div>

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
