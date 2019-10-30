using KidesServer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ZNetCS.AspNetCore.Authentication.Basic;
using ZNetCS.AspNetCore.Authentication.Basic.Events;

namespace KidesServer.Helpers
{
	public static class AuthHelper
	{
		public static void BuildAuthentication(IServiceCollection services)
		{
			services.AddAuthentication()
				.AddCookie(AuthInfo.LoginAuthScheme, options =>
				{
					options.Events.OnRedirectToLogin = (context) =>
					{
						context.Response.StatusCode = 401;
						return Task.CompletedTask;
					};
					options.Events.OnValidatePrincipal = async (context) =>
					{
						var username = context.Principal?.Identity?.Name ?? string.Empty;
						FileControllerPerson user = null;
						if (!string.IsNullOrWhiteSpace(username) && AppConfig.Config.FileAccess.People.ContainsKey(username.ToLowerInvariant()))
							user = AppConfig.Config.FileAccess.People[username.ToLowerInvariant()];

						if (user == null && !AppConfig.Config.FileAccess.People.ContainsKey("anon"))
						{
							context.RejectPrincipal();
							await context.HttpContext.SignOutAsync(AuthInfo.LoginAuthScheme);
							return;
						}
						else if (user == null)
							user = AppConfig.Config.FileAccess.People["anon"];

						if (user.Disabled)
						{
							context.RejectPrincipal();
							await context.HttpContext.SignOutAsync(AuthInfo.LoginAuthScheme);
							return;
						}

						return;
					};
					options.SlidingExpiration = true;
					options.ExpireTimeSpan = TimeSpan.FromDays(5);
					options.Cookie.Name = AuthInfo.CookieName;
				})
				.AddBasicAuthentication(BasicAuthenticationDefaults.AuthenticationScheme, options =>
				{
					options.Realm = "KidesServer";
					options.Events = new BasicAuthenticationEvents
					{
						OnValidatePrincipal = context =>
						{
							try
							{
								FileControllerPerson user = null;
								if (!string.IsNullOrWhiteSpace(context.UserName) && AppConfig.Config.FileAccess.People.ContainsKey(context.UserName.ToLowerInvariant()))
									user = AppConfig.Config.FileAccess.People[context.UserName.ToLowerInvariant()];

								if (user == null && context.UserName != string.Empty && context.UserName != "anon")
								{
									context.AuthenticationFailMessage = "Authentication failed.";
									return Task.CompletedTask;
								}

								if (user == null && !AppConfig.Config.FileAccess.People.ContainsKey("anon"))
								{
									context.AuthenticationFailMessage = "Authentication failed.";
									return Task.CompletedTask;
								}
								else if (user == null)
									user = AppConfig.Config.FileAccess.People["anon"];

								if (user != null && !user.Disabled && user.CheckPassword(context.Password))
								{
									var claims = new List<Claim>
								{
									new Claim(ClaimTypes.Name,
											  string.IsNullOrWhiteSpace(context.UserName) ? "anon" : context.UserName,
											  context.Options.ClaimsIssuer)
								};

									var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, BasicAuthenticationDefaults.AuthenticationScheme));
									context.Principal = principal;

									return Task.CompletedTask;
								}
							}
							catch (Exception ex)
							{
								ErrorLog.WriteError(ex);
								context.AuthenticationFailMessage = "Authentication failed.";
								return Task.CompletedTask;
							}

							context.AuthenticationFailMessage = "Authentication failed.";
							return Task.CompletedTask;
						}
					};
				});

			services.AddAuthorization(options =>
			{
				options.DefaultPolicy = new AuthorizationPolicyBuilder()
				.RequireAuthenticatedUser()
				.AddAuthenticationSchemes(AuthInfo.LoginAuthScheme, BasicAuthenticationDefaults.AuthenticationScheme)
				.Build();
			});
		}
	}
}
