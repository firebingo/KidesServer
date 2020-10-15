using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using KidesServer.Models;
using Microsoft.AspNetCore.Authorization;

namespace KidesServer.Controllers
{
	[Route("FileBrowser")]
	public class FileBrowserController : Controller
	{
		[Authorize]
		[AllowAnonymous]
		public IActionResult Index()
		{
			if (!User.Identity.IsAuthenticated)
				return Login();

			return View();
		}

		[Authorize]
		[AllowAnonymous]
		[Route("Login")]
		public IActionResult Login()
		{
			if (User.Identity.IsAuthenticated)
				return Index();

			return View("Login");
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		[Route("Error")]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
