import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { emailTemplate } from '../../../utils/EmailTemplate';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const response = await resend.emails.send({
    from: 'portfolio@robertriera.com',
      to: `${import.meta.env.ADMIN_EMAIL}`, 
      subject: 'Robert Riera - Portfolio form', 
      html: emailTemplate(data)
    });

    return new Response(JSON.stringify({ 
        success: true, 
        code: 200, 
        res: response 
    }), { 
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": `${import.meta.env.ALLOWED_ORIGIN}`, 
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      } 
    });
    
  } catch (error: any) {
    console.error('Error enviando el correo:', error);
    return new Response(JSON.stringify({ success: false, 
        error: error.message 
    }), { status: 500 });
  }
};

// Manejar solicitudes preflight (OPTIONS)
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': `${import.meta.env.ALLOWED_ORIGIN}`,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};