using KidesServer.Helpers;
using KidesServer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

				if(user == null && loginInfo.Username != string.Empty && loginInfo.Username != "anon")
					return Unauthorized();

				if (user == null && !AppConfig.Config.FileAccess.People.ContainsKey("anon"))
					return Unauthorized();
				else if(user == null)
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
			await HttpContext.SignOutAsync();
			return Ok();
		}
	}
}
