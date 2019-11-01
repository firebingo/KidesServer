using KidesServer.Common;
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

	public class ChangePasswordModel
	{
		public string CurrentPassword { get; set; }
		public string NewPassword { get; set; }
	}

	public class UserInfoResult : BaseResult
	{
		public string Username { get; set; }
		public DateTime LastLoginUtc { get; set; }
		public DateTime LastPasswordChangedUtc { get; set; }
	}
}
