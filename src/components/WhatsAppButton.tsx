import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  size?: 'sm' | 'lg' | 'default';
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  phoneNumber, 
  message = 'Halo!', 
  className = '',
  size = 'sm'
}) => {
  if (!phoneNumber) return null;

  // Format phone number: remove non-digits and ensure it starts with 62
  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
      return '62' + digits.substring(1);
    }
    if (digits.startsWith('62')) {
      return digits;
    }
    return '62' + digits;
  };

  const formattedNumber = formatPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;

  return (
    <Button
      size={size}
      variant="outline"
      className={`bg-green-50 text-green-700 hover:bg-green-100 border-green-200 ${className}`}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;