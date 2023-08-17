using API.Services;
using Microsoft.AspNetCore.Mvc;
using SendGrid;

namespace API.Controllers
{
    public class EmailController : BaseApiController
    {
        private readonly EmailService _emailService;
        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }
        [HttpPost("TestMail")]
        public async Task<ActionResult<Response>> SendTestMail()
        {
            var response =  await _emailService.SendEmailAsync("avramalexandru2030@gmail.com","Test", "Test");
            return response;
        }
        
    }
}