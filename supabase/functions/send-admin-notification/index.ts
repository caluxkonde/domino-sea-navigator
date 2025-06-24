
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailNotification {
  id: string;
  email_address: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get pending email notifications
    const { data: emailNotifications, error } = await supabaseClient
      .from('email_notifications')
      .select('*')
      .eq('status', 'pending')
      .limit(10);

    if (error) {
      console.error('Error fetching email notifications:', error);
      throw error;
    }

    const results = [];

    for (const notification of emailNotifications || []) {
      try {
        // Send email using Resend API
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Nahkodaku System <noreply@nahkodaku.com>',
            to: [notification.email_address],
            subject: notification.subject,
            html: notification.message.replace(/\n/g, '<br>'),
          }),
        });

        if (emailResponse.ok) {
          // Update notification status to sent
          await supabaseClient
            .from('email_notifications')
            .update({ 
              status: 'sent', 
              sent_at: new Date().toISOString() 
            })
            .eq('id', notification.id);

          results.push({ id: notification.id, status: 'sent' });
        } else {
          const errorText = await emailResponse.text();
          console.error('Email send failed:', errorText);
          
          // Update notification status to failed
          await supabaseClient
            .from('email_notifications')
            .update({ 
              status: 'failed', 
              error_message: errorText 
            })
            .eq('id', notification.id);

          results.push({ id: notification.id, status: 'failed', error: errorText });
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        
        // Update notification status to failed
        await supabaseClient
          .from('email_notifications')
          .update({ 
            status: 'failed', 
            error_message: emailError.message 
          })
          .eq('id', notification.id);

        results.push({ id: notification.id, status: 'failed', error: emailError.message });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      results 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
