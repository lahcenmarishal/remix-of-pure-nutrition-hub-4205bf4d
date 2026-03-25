import { useSettings } from "@/hooks/useSettings";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const { data: settings } = useSettings();

  if (!settings?.whatsapp) return null;

  const number = settings.whatsapp.replace(/[^0-9]/g, "");
  const url = `https://wa.me/${number}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe57] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
