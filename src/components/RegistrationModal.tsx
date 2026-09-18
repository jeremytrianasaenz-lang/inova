import React, { useState, useEffect, useId } from 'react';
import { X, UserCheck, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { CustomerUser, Gender } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onSaveUser: (user: CustomerUser) => void;
}

const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<Gender>('Prefer not to say');
  const [phone, setPhone] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const titleId = useId();

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setGender(currentUser.gender);
      setPhone(currentUser.phone);
      setAgreedToPolicy(currentUser.agreedToPolicy);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }
    if (!agreedToPolicy) {
      newErrors.agreed = 'You must agree to the privacy policy to register.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newUser: CustomerUser = {
      fullName: fullName.trim(),
      gender,
      phone: phone.trim(),
      agreedToPolicy,
      registeredAt: currentUser?.registeredAt || new Date().toISOString(),
    };

    onSaveUser(newUser);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#121215] border border-zinc-700/80 shadow-2xl p-6 sm:p-8 text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Subtitle */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INOVA MEMBERSHIP</span>
          </div>
          <h2 id={titleId} className="text-2xl font-bold text-white font-serif tracking-wide">
            JOIN INOVA
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            "Register to make future orders faster and receive a better personalized experience."
          </p>
        </div>

        {savedSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Welcome to INOVA</h3>
            <p className="text-xs text-zinc-400">Your profile has been securely saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                FULL NAME *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: '' });
                }}
                placeholder="e.g. Jeremy Triana"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </p>
              )}
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                GENDER *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                      gender === opt
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-white font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* PHONE NUMBER */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors({ ...errors, phone: '' });
                }}
                placeholder="e.g. 315 392 1762"
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            {/* PRIVACY POLICY CHECKBOX */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => {
                    setAgreedToPolicy(e.target.checked);
                    if (errors.agreed) setErrors({ ...errors, agreed: '' });
                  }}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-[#D4AF37] focus:ring-0 focus:outline-none h-4 w-4"
                />
                <span className="text-xs text-zinc-400 font-light leading-snug">
                  I agree to INOVA's privacy policy and the processing of my information.
                </span>
              </label>
              {errors.agreed && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.agreed}
                </p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-black font-extrabold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{currentUser ? 'UPDATE PROFILE' : 'COMPLETE REGISTRATION'}</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 pt-1">
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              <span>Encrypted local storage for immediate future order autofill</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
