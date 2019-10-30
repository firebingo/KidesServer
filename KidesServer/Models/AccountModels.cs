using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KidesServer.Models
{
	public static class AuthInfo
	{
		public const string LoginAuthScheme = "Cookies";
		public static readonly string CookieName = "KidesAuthCookie";
	}

	public class LoginModel
	{
		public string Username { get; set; }
		public string Password { get; set; }
		public bool RememberMe { get; set; }
	}
}
