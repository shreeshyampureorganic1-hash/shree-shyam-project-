import React from 'react';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppGeneralContactUrl } from '../../utils/whatsapp';

export default function WhatsAppFloat() {
  return (
    <a
      href={generateWhatsAppGeneralContactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all duration-300 border-2 border-white/20 animate-bounce hover:animate-none"
      aria-label="Contact on WhatsApp"
      title="Direct WhatsApp Order & Support"
    >
      <MessageCircle className="w-7 h-7 fill-white" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-sm text-white px-0 group-hover:px-2">
        Chat with Us
      </span>
    </a>
  );
}
