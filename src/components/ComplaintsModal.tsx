import React, { useState, useId } from 'react';
import { X, CheckCircle2, Upload, MessageSquareWarning, ShieldCheck, AlertCircle } from 'lucide-react';
import { ComplaintType, ComplaintRequest } from '../types';

interface ComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  defaultName?: string;
}

const REQUEST_TYPES: ComplaintType[] = [
  'Complaint',
  'Claim',
  'Suggestion',
  'Product issue',
  'Delivery issue',
  'Other',
];

export const ComplaintsModal: React.FC<ComplaintsModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '',
  defaultName = '',
}) => {
  const [fullName, setFullName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [orderNumber, setOrderNumber] = useState('');
  const [requestType, setRequestType] = useState<ComplaintType>('Complaint');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const titleId = useId();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!description.trim()) newErrors.description = 'Please describe your request in detail.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const complaint: ComplaintRequest = {
      id: `PQRS-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      orderNumber: orderNumber.trim() || 'N/A',
      requestType,
      description: description.trim(),
      fileName: selectedFile?.name,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('inova_complaints') || '[]');
      existing.push(complaint);
      localStorage.setItem('inova_complaints', JSON.stringify(existing));
    } catch {
      // ignore
    }

    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setDescription('');
    setSelectedFile(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121215] border border-zinc-700/80 shadow-2xl p-6 sm:p-8 text-left max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-serif">
                Thank you. Your request has been received by INOVA.
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Our hospitality and customer care management team will review your ticket and contact you at {phone} within 24 hours.
              </p>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-1 mb-6">
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                <MessageSquareWarning className="w-3.5 h-3.5" />
                <span>CUSTOMER SERVICE</span>
              </div>
              <h2 id={titleId} className="text-2xl font-bold text-white font-serif tracking-wide">
                COMPLAINTS & CLAIMS
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                At INOVA, we hold our culinary standards and service to the highest international excellence. Please share any concerns, claims, or suggestions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="Jeremy Triana"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="315 392 1762"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Number & Type of Request */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. INOVA-8492"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                    Type of Request *
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as ComplaintType)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    {REQUEST_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-zinc-900 text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Please provide details about the dish, order, or service experience..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none resize-none"
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Optional photo/file upload */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-1 font-semibold">
                  Attach Photo / Receipt (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#D4AF37] text-zinc-300 text-xs cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedFile ? 'Change File' : 'Choose Photo or Document'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-xs text-zinc-300 truncate max-w-xs">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-black font-extrabold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SUBMIT REQUEST</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
