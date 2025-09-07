import { Resend } from 'resend';
import { prisma } from '@codex/database';

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Get settings from database
async function getEmailSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['notificationEmail', 'senderEmail', 'enableEmailNotifications', 'enableAutoReply', 'autoReplySubject', 'autoReplyMessage']
        }
      }
    });
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
    
    return {
      notificationEmail: settingsMap.notificationEmail?.value || 'info@codexterminal.com',
      senderEmail: settingsMap.senderEmail?.value || 'noreply@codexterminal.com',
      enableEmailNotifications: settingsMap.enableEmailNotifications?.value !== false,
      enableAutoReply: settingsMap.enableAutoReply?.value !== false,
      autoReplySubject: settingsMap.autoReplySubject?.value || 'Thank you for contacting CodeX Terminal',
      autoReplyMessage: settingsMap.autoReplyMessage?.value || 'We have received your message and will get back to you within 24 hours.'
    };
  } catch (error) {
    console.error('Failed to fetch email settings:', error);
    return {
      notificationEmail: 'info@codexterminal.com',
      senderEmail: 'noreply@codexterminal.com',
      enableEmailNotifications: true,
      enableAutoReply: true,
      autoReplySubject: 'Thank you for contacting CodeX Terminal',
      autoReplyMessage: 'We have received your message and will get back to you within 24 hours.'
    };
  }
}

interface FormSubmissionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  formType: string;
  attachments: Array<{
    originalName: string;
    size: number;
    mimeType: string;
  }>;
  // Additional metadata
  submittedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
  locale?: string;
}

export async function sendFormSubmissionNotification(data: FormSubmissionData): Promise<boolean> {
  if (!resend || !process.env.RESEND_API_KEY) {
    console.warn('Resend not configured - email notifications disabled');
    return false;
  }

  const settings = await getEmailSettings();
  
  // Check if email notifications are enabled
  if (!settings.enableEmailNotifications) {
    console.log('Email notifications are disabled in settings');
    return false;
  }

  try {
    // Generate admin notification email with all metadata
    const adminEmailHtml = generateAdminNotificationEmail(data);
    
    // Send notification to admin (info@codexterminal.com or configured email)
    const result = await resend.emails.send({
      from: settings.senderEmail,
      to: [settings.notificationEmail],
      subject: `New ${data.formType} form submission from ${data.name}`,
      html: adminEmailHtml,
      replyTo: data.email,
    });

    console.log(`Admin notification sent to ${settings.notificationEmail}:`, result);

    // Send confirmation email to customer if enabled
    if (settings.enableAutoReply) {
      await sendCustomerConfirmationEmail(data, settings);
    }

    return true;
  } catch (error) {
    console.error('Failed to send form submission notification:', error);
    return false;
  }
}

async function sendCustomerConfirmationEmail(data: FormSubmissionData, settings: any): Promise<void> {
  if (!resend) return;
  
  try {
    const confirmationHtml = generateCustomerConfirmationEmail(data);
    
    await resend.emails.send({
      from: settings.senderEmail,
      to: [data.email],
      subject: settings.autoReplySubject,
      html: confirmationHtml,
    });

    console.log('Customer confirmation sent to:', data.email);
  } catch (error) {
    console.error('Failed to send customer confirmation:', error);
  }
}

function generateAdminNotificationEmail(data: FormSubmissionData): string {
  const submissionUrl = `${process.env.APP_URL || 'http://localhost:3001'}/admin/forms/${data.id}`;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Form Submission</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .field { margin-bottom: 16px; }
        .label { font-weight: 600; color: #374151; margin-bottom: 4px; display: block; }
        .value { color: #6b7280; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .attachments { background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🚀 New Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">from ${data.name}</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${data.name}</span>
            </div>
            
            <div class="field">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></span>
            </div>
            
            ${data.phone ? `
            <div class="field">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${data.phone}" style="color: #667eea;">${data.phone}</a></span>
            </div>
            ` : ''}
            
            ${data.company ? `
            <div class="field">
                <span class="label">Company:</span>
                <span class="value">${data.company}</span>
            </div>
            ` : ''}
            
            ${data.service ? `
            <div class="field">
                <span class="label">Service Interest:</span>
                <span class="value">${data.service}</span>
            </div>
            ` : ''}
            
            ${data.budget ? `
            <div class="field">
                <span class="label">Budget:</span>
                <span class="value">${data.budget}</span>
            </div>
            ` : ''}
            
            ${data.timeline ? `
            <div class="field">
                <span class="label">Timeline:</span>
                <span class="value">${data.timeline}</span>
            </div>
            ` : ''}
            
            <div class="field">
                <span class="label">Message:</span>
                <div class="value" style="white-space: pre-wrap; margin-top: 8px; padding: 15px; background: #f9fafb; border-radius: 6px;">${data.message}</div>
            </div>
            
            ${data.attachments.length > 0 ? `
            <div class="attachments">
                <div class="label">Attachments (${data.attachments.length}):</div>
                <ul style="margin: 8px 0; padding-left: 20px;">
                    ${data.attachments.map(att => `
                    <li style="margin-bottom: 4px;">
                        <strong>${att.originalName}</strong> 
                        <span style="color: #6b7280; font-size: 0.9em;">(${formatFileSize(att.size)}, ${att.mimeType})</span>
                    </li>
                    `).join('')}
                </ul>
                <p style="font-size: 0.9em; color: #6b7280; margin: 10px 0 0 0;">
                    📎 View attachments in the admin panel
                </p>
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="${submissionUrl}" class="button">View in Admin Panel</a>
            </div>
        </div>
        
        <div class="footer">
            <p style="margin: 0; color: #6b7280; font-size: 0.9em;">
                CodeX Terminal - Form Submission System
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

function generateCustomerConfirmationEmail(data: FormSubmissionData): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting us</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 40px 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .highlight { background: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✨ Thank you, ${data.name}!</h1>
            <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">We've received your message</p>
        </div>
        
        <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">
                Hi ${data.name},
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                Thank you for reaching out to CodeX Terminal! We've successfully received your inquiry and are excited to learn more about your project.
            </p>
            
            <div class="highlight">
                <h3 style="margin: 0 0 10px 0; color: #1f2937;">What happens next?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Review:</strong> Our team will carefully review your requirements</li>
                    <li style="margin-bottom: 8px;"><strong>Response:</strong> We'll get back to you within 24 hours</li>
                    <li style="margin-bottom: 8px;"><strong>Discussion:</strong> We'll schedule a call to discuss your project in detail</li>
                </ul>
            </div>
            
            <p style="font-size: 16px; margin: 25px 0 20px 0;">
                In the meantime, feel free to explore our <a href="${process.env.APP_URL || 'https://codexterminal.com'}/services" style="color: #667eea;">services</a> or check out our latest <a href="${process.env.APP_URL || 'https://codexterminal.com'}/case-studies" style="color: #667eea;">case studies</a>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
                If you have any urgent questions, don't hesitate to reach out to us directly at <a href="mailto:hello@codexterminal.com" style="color: #667eea;">hello@codexterminal.com</a>.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 0;">
                Best regards,<br>
                <strong>The CodeX Terminal Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 0.9em;">
                <strong>CodeX Terminal</strong><br>
                Building exceptional digital experiences
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 0.8em;">
                This is an automated confirmation email. Please do not reply directly to this message.
            </p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}