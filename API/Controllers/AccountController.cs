using System.Security.Claims;
using API.DTOs;
using API.Services;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/account")]
    public class AccountController:ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenSerivce;
        private readonly ILogger<AccountController> _logger;
        
        public AccountController(UserManager<AppUser> userManager, TokenService tokenSerivce, ILogger<AccountController> logger)
        {
            _tokenSerivce = tokenSerivce;
            _userManager = userManager;
            _logger = logger;
        } 
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            try
            {
                var email = loginDto.Email.ToLowerInvariant();
                _logger.LogInformation("Login attempt for email: {Email}", email);
                
                var user = await _userManager.Users.Include(p=>p.Photos)
                .FirstOrDefaultAsync(x=>x.Email == email);
                
                if(user == null) 
                {
                    _logger.LogWarning("Login failed: User not found for email: {Email}", loginDto.Email);
                    return Unauthorized();
                }

                var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
                
                if(result)
                {
                    _logger.LogInformation("Login successful for user: {UserId}", user.Id);
                    return CreateUserObject(user);
                }
                else
                {
                    _logger.LogWarning("Login failed: Invalid password for email: {Email}", loginDto.Email);
                    return Unauthorized();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during login for email: {Email}", loginDto.Email);
                return StatusCode(500, "An error occurred during login");
            }
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
             var email = registerDto.Email.ToLowerInvariant();

             if (await _userManager.Users.AnyAsync(x => x.Email == email)){
                
                ModelState.AddModelError("email", "Email Already Taken");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username)){
                
                ModelState.AddModelError("username", "Username Already Taken");
                return ValidationProblem();
            }
           
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = email,
                UserName = registerDto.Username
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);

            }
            return BadRequest(result.Errors);
        }
 
        [AllowAnonymous]
        [HttpGet("test")]
        public ActionResult<string> Test()
        {
            _logger.LogInformation("Test endpoint called successfully");
            return Ok("API is working correctly");
        }

        [AllowAnonymous]
        [HttpGet("health")]
        public async Task<ActionResult<string>> HealthCheck()
        {
            try
            {
                var userCount = await _userManager.Users.CountAsync();
                _logger.LogInformation("Database connection successful. User count: {UserCount}", userCount);
                return Ok($"Database OK. Users: {userCount}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Database connection failed");
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>>GetCurrentUser(){
            var user = await _userManager.Users.Include(p=>p.Photos)
            .FirstOrDefaultAsync(x=>x.Email == User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {

            var photo = user.Photos!=null? user.Photos.FirstOrDefault(x=>x.IsMain)?.Url: "";
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = photo,
                Token = _tokenSerivce.CreateToken(user),
                Username = user.UserName

            };
        }

    }
}