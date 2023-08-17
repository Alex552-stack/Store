using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using SendGrid;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _webHostEnvironment;

        private readonly UserManager<User> _userManager;
        public AccountController(IWebHostEnvironment webHostEnvironment, IConfiguration configuration, UserManager<User> userManager, TokenService tokenService, StoreContext context, EmailService emailService)
        {
            _webHostEnvironment = webHostEnvironment;
            _configuration = configuration;
            _emailService = emailService;
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonbasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if (anonbasket != null)
            {
                if (userBasket != null) _context.Baskets.Remove(userBasket);
                anonbasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }


            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonbasket != null ? anonbasket.MapBasketToDto() : userBasket?.MapBasketToDto(),
                EmailConfirmed = user.EmailConfirmed
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, token }, protocol: HttpContext.Request.Scheme);


            await _userManager.AddToRoleAsync(user, "Member");

            var message = $"Your verification link is {confirmationLink}";

            await _emailService.SendEmailAsync(user.Email, "Email confirmation", message);

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto(),
                EmailConfirmed = user.EmailConfirmed
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                        .Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null) 
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                user.EmailConfirmed = true;
                await _context.SaveChangesAsync();
                var request = HttpContext.Request;
                var redirectUrl = $"{request.Scheme}://{request.Host}/checkemail/1";
                return Redirect(redirectUrl);
            }
            else
            {
                return BadRequest("Email confirmation failed.");
            }
        }

    }
}