import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { emailTemplate } from '../../../utils/EmailTemplate';

export const prerender = false;

// Lista de orígenes permitidos desde el .env
const allowedOrigins = [
  import.meta.env.ALLOWED_ORIGIN_1,
  import.meta.env.ALLOWED_ORIGIN_2,
  import.meta.env.ALLOWED_ORIGIN_3,
  import.meta.env.ALLOWED_ORIGIN_4
];

function getCorsHeaders(origin: string | null) {
  const isAllowed = origin && allowedOrigins.includes(origin);
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');

  try {
    const data = await request.json();

    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: 'portfolio@robertriera.com',
      to: import.meta.env.ADMIN_EMAIL,
      subject: 'Robert Riera - Portfolio form',
      html: emailTemplate(data)
    });

    return new Response(JSON.stringify({
      success: true,
      code: 200,
      res: response
    }), {
      status: 200,
      headers: getCorsHeaders(origin)
    });

  } catch (error: any) {
    console.error('Error enviando el correo:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: getCorsHeaders(origin)
    });
  }
};

export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin)
  });
};