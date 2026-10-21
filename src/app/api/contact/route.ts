import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  metric?: string;
  topic: string;
  message: string;
}

const TOPICS: Record<string, string> = {
  hedge: 'Hedging a risk',
  create: 'Creating a market',
  liquidity: 'Providing liquidity',
  partner: 'Partnerships',
  press: 'Press',
  other: 'Other',
};

const TO = 'admin@dexetera.xyz';
const FROM = 'Dexetera Website <contact@dexetera.xyz>';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function clip(s: string, n: number) {
  return s.trim().slice(0, n);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let data: ContactFormData;
    if (contentType.includes('application/json')) {
      data = await request.json();
    } else {
      const fd = await request.formData();
      data = {
        name: String(fd.get('name') || ''),
        email: String(fd.get('email') || ''),
        company: String(fd.get('company') || ''),
        metric: String(fd.get('metric') || ''),
        topic: String(fd.get('topic') || ''),
        message: String(fd.get('message') || ''),
      };
    }

    // Validate required fields
    if (!data.name?.trim() || data.name.trim().length <= 1 || !data.email || !data.message?.trim() || data.message.trim().length <= 3) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const name = clip(data.name, 120);
    const email = clip(data.email, 200);
    const company = clip(data.company || '', 200);
    const metric = clip(data.metric || '', 200);
    const topic = TOPICS[data.topic] || clip(data.topic || 'Other', 60) || 'Other';
    const message = clip(data.message, 5000);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('Contact form: RESEND_API_KEY is not set', { name, email, topic, message });
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const rows: [string, string][] = [
      ['Name', name],
      ['Email', email],
      ['Company', company || 'N/A'],
      ['Metric or exposure', metric || 'N/A'],
      ['Interested in', topic],
    ];

    const text =
      rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
      `\n\nMessage:\n${message}\n\nSent from the contact form on dexetera.org. Reply to this email to answer ${name} directly.`;

    const html =
      `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#111;line-height:1.5">` +
      `<p style="margin:0 0 12px"><b>New message from the dexetera.org contact form</b></p>` +
      `<table cellpadding="4" cellspacing="0" style="border-collapse:collapse">` +
      rows.map(([k, v]) => `<tr><td style="color:#666;padding-right:16px;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('') +
      `</table>` +
      `<p style="margin:16px 0 4px;color:#666">Message</p>` +
      `<div style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px">${esc(message)}</div>` +
      `<p style="margin:16px 0 0;color:#888;font-size:12px">Reply to this email to answer ${esc(name)} directly.</p>` +
      `</div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Contact form: ${topic} from ${name}${company ? ` (${company})` : ''}`,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Contact form: Resend error', res.status, detail, { name, email, topic, message });
      return NextResponse.json({ error: 'Could not send message' }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: 'Message received' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
