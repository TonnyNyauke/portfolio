// lib/mail.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Contact form interface matching your contact page
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmailWithInterface(data: ContactFormData) {
  const { name, email, subject, message } = data;
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: 'Missing required fields'
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Invalid email address'
    };
  }

  // Map subject values to readable text
  const subjectMap: { [key: string]: string } = {
    'project': 'Project Inquiry',
    'collaboration': 'Collaboration',
    'job': 'Job Opportunity',
    'speaking': 'Speaking Engagement',
    'consulting': 'Consulting',
    'other': 'Just Saying Hi'
  };

  const readableSubject = subjectMap[subject] || subject;

  // Create HTML email template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="margin-bottom: 25px;">
          <h2 style="color: #1e40af; margin-bottom: 20px; font-size: 20px;">Contact Details</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2563eb;">Full Name:</strong>
            <span style="margin-left: 10px; color: #374151;">${name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2563eb;">Email:</strong>
            <a href="mailto:${email}" style="margin-left: 10px; color: #2563eb; text-decoration: underline;">${email}</a>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #2563eb;">Subject:</strong>
            <span style="margin-left: 10px; color: #374151;">${readableSubject}</span>
          </div>
        </div>
        
        <div>
          <h3 style="color: #1e40af; margin-bottom: 15px;">Message:</h3>
          <div style="background: #eff6ff; padding: 20px; border-left: 4px solid #2563eb; border-radius: 4px;">
            <p style="margin: 0; color: #374151; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #2563eb, #4f46e5); color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
            Reply to ${name}
          </a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This email was sent from your portfolio contact form on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    // Send email to yourself
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <noreply@tonnynyauke.com>',
      to: ['tonnynyauke@tonnynyauke.com'],
      subject: `Portfolio Contact: ${readableSubject} - ${name}`,
      html: htmlContent,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: 'Failed to send email. Please try again.'
      };
    }

    // Send confirmation email to the user
    try {
      await resend.emails.send({
        from: 'Tonny Nyauke <noreply@tonnynyauke.com>',
        to: [email],
        subject: `Thanks for reaching out, ${name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(to right, #2563eb, #4f46e5); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Thank you for contacting me regarding <strong>"${readableSubject}"</strong>. 
                I've received your message and I'll get back to you as soon as possible, usually within 24-48 hours.
              </p>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
                <h3 style="color: #1e40af; margin-top: 0; font-size: 16px;">Your Message:</h3>
                <p style="color: #374151; margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                In the meantime, feel free to check out my latest projects or connect with me on social media.
              </p>
              
              <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px; text-align: center;">
                <p style="color: #374151; margin: 0 0 15px 0; font-weight: 600;">Connect with me:</p>
                <div style="display: flex; justify-content: center; gap: 15px;">
                  <a href="https://x.com/TonnyNyauke" style="color: #2563eb; text-decoration: none;">Twitter</a>
                  <span style="color: #e5e7eb;">|</span>
                  <a href="https://www.linkedin.com/in/tonnynyauke" style="color: #2563eb; text-decoration: none;">LinkedIn</a>
                  <span style="color: #e5e7eb;">|</span>
                  <a href="https://github.com/TonnyNyauke" style="color: #2563eb; text-decoration: none;">GitHub</a>
                </div>
              </div>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #1e40af;">Tonny Nyauke</strong>
              </p>
            </div>
          </div>
        `,
      });
    } catch (confirmationError) {
      console.error('Failed to send confirmation email:', confirmationError);
      // Don't fail the whole operation if confirmation fails
    }

    return {
      success: true,
      message: 'Email sent successfully',
      data
    };

  } catch (error) {
    console.error('Server action error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again later.'
    };
  }
}