using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using KidesServer.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using KidesServer.Helpers;
using Microsoft.AspNetCore.Authentication;

namespace KidesServer.Controllers
{
	public class FileBrowserController : Controller
	{
		public IActionResult Root()
		{
			if (!User.Identity.IsAuthenticated)
				return Login();

			return View();
		}

		public IActionResult Login()
		{
			if (User.Identity.IsAuthenticated)
				return Root();

			return View();
		}

		[HttpPost]
		public async Task<IActionResult> Login([FromBody]LoginModel loginInfo)
		{
			try
			{
				FileControllerPerson user = null;
				if (!string.IsNullOrWhiteSpace(loginInfo.Username) && AppConfig.Config.FileAccess.People.ContainsKey(loginInfo.Username.ToLowerInvariant()))
					user = AppConfig.Config.FileAccess.People[loginInfo.Username.ToLowerInvariant()];

				if (!AppConfig.Config.FileAccess.People.ContainsKey("anon"))
					return Unauthorized();

				if (user == null)
					user = AppConfig.Config.FileAccess.People["anon"];

				if (user != null && user.CheckPassword(loginInfo.Password))
				{
					var claims = new List<Claim>
					{
						new Claim(ClaimTypes.Name, string.IsNullOrWhiteSpace(loginInfo.Username) ? "anon" : loginInfo.Username)
					};

					var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));
					await HttpContext.SignInAsync(principal);

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

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
