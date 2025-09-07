# Email Notification Setup Guide

This guide explains how to set up email notifications for form submissions using Resend API.

## 🚀 Quick Start

### 1. Get a Resend API Key

1. **Sign up for Resend**: Visit [resend.com](https://resend.com) and create an account
2. **Verify your domain**: Add and verify the domain you'll be sending emails from
3. **Generate API Key**: 
   - Go to API Keys section in your Resend dashboard
   - Click "Create API Key" 
   - Give it a name like "CodeX Terminal Production"
   - Copy the generated key (starts with `re_`)

### 2. Add Environment Variable

Add the Resend API key to your environment variables:

```bash
# .env.local (for local development)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# For production (Vercel, Railway, etc.)
# Add this environment variable in your deployment platform
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

### 3. Configure Email Settings in Admin Panel

1. **Access Admin Panel**: Go to `http://your-domain.com/admin`
2. **Navigate to Settings**: Click "Settings" in the admin sidebar
3. **Configure Email Settings**:
   - **Notification Email**: Where form submissions will be sent (e.g., `info@codexterminal.com`)
   - **Sender Email**: Email address that appears as "From" (must be from verified domain)
   - **Enable Email Notifications**: Toggle to enable/disable email notifications
   - **Auto-Reply Settings**: Configure automatic customer confirmation emails

## 📧 Email Features

### Admin Notifications
When a form is submitted, an email is automatically sent to the configured notification email containing:
- Complete form submission data
- User metadata (IP address, browser, referrer)
- File attachments information
- Direct link to view submission in admin panel

### Customer Confirmations
Optional auto-reply emails sent to customers containing:
- Professional thank you message
- Next steps information
- Company branding

## 🔧 Technical Details

### Email Service Location
- **File**: `apps/web/src/lib/email.ts`
- **Function**: `sendFormSubmissionNotification()`

### Settings Storage
- **Database Table**: `SiteSetting`
- **API Endpoint**: `/admin/api/settings`
- **Admin Page**: `/admin/settings`

### Template Customization
Email templates can be customized by modifying the following functions in `apps/web/src/lib/email.ts`:
- `generateAdminNotificationEmail()` - Admin notification template
- `generateCustomerConfirmationEmail()` - Customer confirmation template

## 🚨 Troubleshooting

### Email Not Sending
1. **Check API Key**: Ensure `RESEND_API_KEY` is correctly set
2. **Verify Domain**: Make sure sender email domain is verified in Resend
3. **Check Logs**: Look for error messages in application logs
4. **Settings**: Verify email notifications are enabled in admin panel

### Common Errors
- `Resend not configured`: API key is missing or invalid
- `Domain not verified`: Sender email domain needs verification in Resend
- `Rate limit exceeded`: Too many emails sent, check Resend limits

## 📋 Domain Verification Steps

### 1. Add Domain to Resend
1. Go to Resend dashboard → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `codexterminal.com`)

### 2. DNS Configuration
Add these DNS records to your domain:

```
Type: TXT
Name: @
Value: [provided by Resend]

Type: MX
Name: @
Value: [provided by Resend]
Priority: 10

Type: CNAME
Name: resend._domainkey
Value: [provided by Resend]
```

### 3. Verify Domain
After DNS propagation (can take up to 48 hours), click "Verify" in Resend dashboard.

## 🔐 Security Best Practices

1. **API Key Storage**: Never commit API keys to version control
2. **Environment Variables**: Use different keys for development/production
3. **Rate Limiting**: Monitor email sending to avoid abuse
4. **Domain Authentication**: Always verify domains before sending

## 🚀 Production Deployment

### Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add `RESEND_API_KEY` with your API key value
4. Redeploy your application

### Railway
1. Go to your Railway project
2. Navigate to Variables tab
3. Add `RESEND_API_KEY` environment variable
4. Deploy changes

### Other Platforms
Consult your platform's documentation for adding environment variables.

## 📊 Monitoring & Analytics

### Resend Dashboard
Monitor email delivery, opens, clicks, and bounces in your Resend dashboard.

### Application Logs
Email sending status is logged in your application:
- Success: "Admin notification sent to [email]"
- Failure: "Failed to send form submission notification"

## 💡 Tips

1. **Test First**: Always test with a development API key before production
2. **Monitor Limits**: Check your Resend plan limits to avoid service interruption
3. **Backup Configuration**: Document your email settings in case of admin panel issues
4. **Regular Testing**: Periodically test form submissions to ensure emails work

## 🆘 Support

If you encounter issues:
1. Check this documentation first
2. Review Resend documentation: [docs.resend.com](https://docs.resend.com)
3. Check application logs for error messages
4. Verify all environment variables are correctly set

---

**Last Updated**: December 2024
**Version**: 1.0