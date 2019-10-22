﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using KidesServer.Helpers;
using KidesServer.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using ZNetCS.AspNetCore.Authentication.Basic;
using ZNetCS.AspNetCore.Authentication.Basic.Events;

namespace KidesServer
{
	public class Startup
	{
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

			services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
			services.AddMvc().AddJsonOptions(opt =>
			{
				opt.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
				opt.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
			});

			try
			{
				services.AddAuthentication(AuthInfo.LoginAuthScheme)
					.AddCookie(options =>
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
					});
			}
			catch(Exception ex)
			{

			}

			//services
			//	.AddAuthentication(BasicAuthenticationDefaults.AuthenticationScheme)
			//	.AddBasicAuthentication(options =>
			//	{
			//		options.Realm = "KidesServer";
			//		options.Events = new BasicAuthenticationEvents
			//		{
			//			OnValidatePrincipal = context =>
			//			{
			//				try
			//				{
			//					FileControllerPerson user = null;
			//					if (!string.IsNullOrWhiteSpace(context.UserName) && AppConfig.Config.FileAccess.People.ContainsKey(context.UserName.ToLowerInvariant()))
			//						user = AppConfig.Config.FileAccess.People[context.UserName.ToLowerInvariant()];
			//					if (!AppConfig.Config.FileAccess.People.ContainsKey("anon"))
			//					{
			//						context.AuthenticationFailMessage = "Authentication failed.";
			//						return Task.CompletedTask;
			//					}
			//					if (user == null)
			//						user = AppConfig.Config.FileAccess.People["anon"];
			//
			//					if (user != null && user.CheckPassword(context.Password))
			//					{
			//						var claims = new List<Claim>
			//					{
			//						new Claim(ClaimTypes.Name,
			//								  string.IsNullOrWhiteSpace(context.UserName) ? "anon" : context.UserName,
			//								  context.Options.ClaimsIssuer)
			//					};
			//
			//						var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, BasicAuthenticationDefaults.AuthenticationScheme));
			//						context.Principal = principal;
			//
			//						return Task.CompletedTask;
			//					}
			//				}
			//				catch (Exception ex)
			//				{
			//					ErrorLog.WriteError(ex);
			//					context.AuthenticationFailMessage = "Authentication failed.";
			//					return Task.CompletedTask;
			//				}
			//
			//				context.AuthenticationFailMessage = "Authentication failed.";
			//				return Task.CompletedTask;
			//			}
			//		};
			//	});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");
				app.UseHsts();
			}

			AppDomain.CurrentDomain.SetData("DataDirectory", Path.Combine(env.ContentRootPath, "App_Data"));
			Directory.CreateDirectory($"{AppDomain.CurrentDomain.GetData("DataDirectory").ToString()}\\Temp");

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseCookiePolicy(new CookiePolicyOptions()
			{
				MinimumSameSitePolicy = SameSiteMode.Strict
			});
			app.UseAuthentication();

			app.UseMvc(routes =>
			{
				routes.MapRoute(
					name: "default",
					template: "{controller=Home}/{action=Root}");
				routes.MapRoute(
					name: "FileBrowser",
					template: "{controller=FileBrowser}/{action=Login}");
				routes.MapRoute(
					name: "KidesApi",
					template: "api/{controller}/{id}");
			});
		}
	}
}
