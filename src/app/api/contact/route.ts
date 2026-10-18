import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  metric?: string;
  topic: string;
  message: string;
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
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Integrate with your preferred email service
    // Options:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - AWS SES
    // - Postmark
    //
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@dexetera.xyz',
    //   to: 'admin@dexetera.xyz',
    //   subject: `Contact Form: ${data.topic}`,
    //   text: `
    //     Name: ${data.name}
    //     Email: ${data.email}
    //     Company: ${data.company || 'N/A'}
    //     Topic: ${data.topic}
    //     Message: ${data.message}
    //   `,
    // });

    // For now, log the submission (replace with actual email service)
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      company: data.company || 'N/A',
      metric: data.metric || 'N/A',
      topic: data.topic,
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: 'Message received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
