
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WhatsAppRequest {
  phone: string;
  message: string;
  type?: 'text' | 'image' | 'document';
  media_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("WhatsApp Gateway function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, message, type = 'text', media_url }: WhatsAppRequest = await req.json();
    console.log("Sending WhatsApp message to:", phone);

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: phone, message" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format phone number (remove non-digits and ensure it starts with country code)
    const formattedPhone = phone.replace(/\D/g, '');
    const finalPhone = formattedPhone.startsWith('62') ? formattedPhone : `62${formattedPhone.startsWith('0') ? formattedPhone.substring(1) : formattedPhone}`;

    // For now, we'll simulate sending via a WhatsApp gateway
    // In production, you would integrate with services like:
    // - Twilio WhatsApp API
    // - WhatsApp Business API
    // - Third-party WhatsApp gateways

    const whatsappResponse = {
      success: true,
      message_id: `wa_${Date.now()}`,
      phone: finalPhone,
      message: message,
      type: type,
      status: 'sent',
      sent_at: new Date().toISOString(),
      // Simulate WhatsApp Web URL for now
      whatsapp_url: `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`
    };

    console.log("WhatsApp message processed:", whatsappResponse);

    // In a real implementation, you would call the actual WhatsApp API here
    // For demonstration, we're returning a success response
    
    return new Response(JSON.stringify(whatsappResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in WhatsApp gateway function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send WhatsApp message"  
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
