using KidesServer.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.IO;
using System.IO.Compression;

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

			services.Configure<GzipCompressionProviderOptions>(options => options.Level = CompressionLevel.Optimal);
			services.AddResponseCompression(options =>
			{
				options.Providers.Add<GzipCompressionProvider>();
				options.EnableForHttps = true;
				options.MimeTypes = new string[]
				{
					"text/css",
					"text/html",
					"text/json",
					"text/plain",
					"text/xml",
					"application/javascript",
					"application/x-javascript",
					"application/json"
				};
			});

			AuthHelper.BuildAuthentication(services);

			services.AddMvc()
				.SetCompatibilityVersion(CompatibilityVersion.Version_3_0)
				.AddNewtonsoftJson(x =>
			{
				x.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
				x.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
				x.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
			});
			services.AddControllers();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime applicationLifetime)
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
			Directory.CreateDirectory($"{AppDomain.CurrentDomain.GetData("DataDirectory")}\\Temp");

			//app.UseHttpsRedirection();
			app.UseResponseCompression();
			app.UseStaticFiles();
			app.UseCookiePolicy(new CookiePolicyOptions()
			{
				MinimumSameSitePolicy = SameSiteMode.Strict
			});
			app.UseAuthentication();

			app.UseRouting();

			app.UseAuthorization();

			app.UseEndpoints(endpoints =>
			{
				endpoints.MapDefaultControllerRoute();
				endpoints.MapControllers();
			});

			//app.UseEndpoints(endpoints =>
			//{
			//	endpoints.MapControllerRoute(
			//	name: "FileBrowser",
			//	pattern: "",
			//	defaults: new { controller = "FileBrowser", action = "Login", });
			//});

			//app.UseMvc(routes =>
			//{
			//	routes.MapRoute(
			//		name: "default",
			//		template: "{controller=Home}/{action=Root}");
			//	routes.MapRoute(
			//		name: "FileBrowser",
			//		template: "{controller=FileBrowser}/{action=Login}");
			//	routes.MapRoute(
			//		name: "KidesApi",
			//		template: "api/{controller}/{id}");
			//});

			applicationLifetime.ApplicationStopping.Register(OnShutdown);
		}

		public void OnShutdown()
		{
			AppConfig.SaveConfig();
		}
	}
}
