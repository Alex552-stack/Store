using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        public EmailService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<Response> SendEmailAsync(string toEmail, string subject, string message)
        {
            var apiKey = _config["SENDGRID:SENDGRID_API_KEY"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Null SendGridKey");
            }
            return await Execute(apiKey, subject, message, toEmail);
        }

        private async Task<Response> Execute(string apiKey, string subject, string message, string toEmail)
        {
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress("avramalexandru2030@gmail.com", "Password Recovery"),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(toEmail));

            // Disable click tracking.
            // See https://sendgrid.com/docs/User_Guide/Settings/tracking.html
            msg.SetClickTracking(false, false);
            var response = await client.SendEmailAsync(msg);
            
            return response;
        }

    }
}