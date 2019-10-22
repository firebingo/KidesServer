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

			return View("Login");
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
