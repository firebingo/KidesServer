using KidesServer.Common;
using KidesServer.Helpers;
using KidesServer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace KidesServer.Controllers
{
	[Route("api/v1/account")]
	[ApiController]
	public class AccountController : ControllerBase
	{
		[HttpPost, Route("login")]
		public async Task<IActionResult> Login([FromBody]LoginModel loginInfo)
		{
			try
			{
				FileControllerPerson user = null;
				if (!string.IsNullOrWhiteSpace(loginInfo.Username) && AppConfig.Config.FileAccess.People.ContainsKey(loginInfo.Username.ToLowerInvariant()))
					user = AppConfig.Config.FileAccess.People[loginInfo.Username.ToLowerInvariant()];

				if (user == null && loginInfo.Username != string.Empty && loginInfo.Username != "anon")
					return Unauthorized();

				if (user == null && !AppConfig.Config.FileAccess.People.ContainsKey("anon"))
					return Unauthorized();
				else if (user == null)
					user = AppConfig.Config.FileAccess.People["anon"];

				if (user != null && !user.Disabled && user.CheckPassword(loginInfo.Password))
				{
					var claims = new List<Claim>
					{
						new Claim(ClaimTypes.Name, string.IsNullOrWhiteSpace(loginInfo.Username) ? "anon" : loginInfo.Username)
					};

					var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, AuthInfo.LoginAuthScheme));
					var authProps = new AuthenticationProperties()
					{
						IsPersistent = loginInfo.RememberMe,
						AllowRefresh = loginInfo.RememberMe,
						IssuedUtc = DateTimeOffset.UtcNow
					};
					await HttpContext.SignInAsync(AuthInfo.LoginAuthScheme, principal, authProps);
					user.LastLoginUtc = DateTime.UtcNow;

					return Ok();
				}
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return Unauthorized();
			}

			return Unauthorized();
		}

		[HttpPost, Route("logout")]
		public async Task<IActionResult> Logout()
		{
			await HttpContext.SignOutAsync(AuthInfo.LoginAuthScheme);
			return Ok();
		}

		[HttpPost, Route("change-password")]
		[Authorize]
		public IActionResult ChangePassword([FromBody]ChangePasswordModel changePasswordInfo)
		{
			try
			{
				if (string.IsNullOrWhiteSpace(changePasswordInfo.CurrentPassword) || string.IsNullOrWhiteSpace(changePasswordInfo.NewPassword))
					return BadRequest(new BaseResult() { message = "INVALID_PARAMS", success = false });

				var user = AppConfig.Config.FileAccess.People[User.Identity.Name.ToLowerInvariant()];
				if (!user.CheckPassword(changePasswordInfo.CurrentPassword))
					return BadRequest(new BaseResult() { message = "INVALID_PARAMS", success = false });

				user.ChangePassword(changePasswordInfo.NewPassword);
				AppConfig.SaveConfig();

				return Ok(new BaseResult() { message = "", success = true });
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return StatusCode(500, new BaseResult() { message = "EXCEPTION", success = false });
			}
		}

		[HttpGet, Route("user-info")]
		[Authorize]
		public IActionResult GetUserInfo()
		{
			try
			{
				var user = AppConfig.Config.FileAccess.People[User.Identity.Name.ToLowerInvariant()];

				return Ok(new UserInfoResult
				{
					Username = user.Username,
					LastLoginUtc = user.LastLoginUtc,
					LastPasswordChangedUtc = user.PasswordChangedUtc,
					success = true,
					message = ""
				});
			}
			catch (Exception ex)
			{
				ErrorLog.WriteError(ex);
				return StatusCode(500, new BaseResult() { message = "EXCEPTION", success = false });
			}
		}
	}
}
