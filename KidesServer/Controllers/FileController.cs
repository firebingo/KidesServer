using KidesServer.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using KidesServer.Models;
using KidesServer.Logic;
using ZNetCS.AspNetCore.Authentication.Basic;

namespace KidesServer.Controllers
{
	[Route("api/v1/files")]
	[ApiController]
	public class FileController : ControllerBase
	{
		private static readonly FormOptions _defaultFormOptions = new FormOptions();

		[HttpPost, Route("upload-file")]
		//[DisableFormValueModelBinding]
		[Authorize]
		public async Task<IActionResult> UploadFile()
		{
			var fileName = Request.Headers["Filename"].ToString();
			if (string.IsNullOrWhiteSpace(fileName))
				return BadRequest(new BaseResult() { message = "INVALID_PARAMS", success = false }); ;
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.Upload)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			if(!FileLogic.CheckFilePermission(fileUser, fileName))
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			if (!MultipartRequestHelper.IsMultipartContentType(Request.ContentType))
				return BadRequest(new BaseResult() { message = $"Expected a multipart request, but got {Request.ContentType}", success = false });

			var formAccumulator = new KeyValueAccumulator();
			string targetFilePath = null;

			var boundary = MultipartRequestHelper.GetBoundary(
				MediaTypeHeaderValue.Parse(Request.ContentType),
				_defaultFormOptions.MultipartBoundaryLengthLimit);
			var reader = new MultipartReader(boundary, HttpContext.Request.Body);

			var section = await reader.ReadNextSectionAsync();
			while (section != null)
			{
				var hasContentDispositionHeader = ContentDispositionHeaderValue.TryParse(section.ContentDisposition, out var contentDisposition);

				if (hasContentDispositionHeader)
				{
					if (MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
					{
						targetFilePath = $"{AppDomain.CurrentDomain.GetData("DataDirectory").ToString()}\\Temp\\{Guid.NewGuid().ToString("n")}";
						using (var targetStream = System.IO.File.Create(targetFilePath))
						{
							await section.Body.CopyToAsync(targetStream);
						}
					}
					else if (MultipartRequestHelper.HasFormDataContentDisposition(contentDisposition))
					{
						// Content-Disposition: form-data; name="key"
						//
						// value

						// Do not limit the key name length here because the 
						// multipart headers length limit is already in effect.
						var key = HeaderUtilities.RemoveQuotes(contentDisposition.Name).ToString();
						var encoding = GetEncoding(section);
						using (var streamReader = new StreamReader(
							section.Body,
							encoding,
							detectEncodingFromByteOrderMarks: true,
							bufferSize: 1024,
							leaveOpen: true))
						{
							// The value length limit is enforced by MultipartBodyLengthLimit
							var value = await streamReader.ReadToEndAsync();
							if (String.Equals(value, "undefined", StringComparison.OrdinalIgnoreCase))
							{
								value = String.Empty;
							}
							formAccumulator.Append(key, value);

							if (formAccumulator.ValueCount > _defaultFormOptions.ValueCountLimit)
							{
								throw new InvalidDataException($"Form key count limit {_defaultFormOptions.ValueCountLimit} exceeded.");
							}
						}
					}
				}

				// Drains any remaining section body that has not been consumed and
				// reads the headers for the next section.
				section = await reader.ReadNextSectionAsync();
			}

			var res = FileLogic.UploadFile(fileUser, targetFilePath, fileName, $"{Request.Scheme}://{Request.Host}{Request.PathBase}");
			if (res.success)
				return Ok(res);
			return BadRequest(res);
		}

		[HttpGet, Route("get-file/{fileName}")]
		[Authorize]
		[AllowAnonymous]
		public ActionResult GetFile(string fileName, [FromQuery]string directory)
		{
			try
			{
				var userName = User.Identity.Name ?? "anon";
				var fileUser = AppConfig.Config.FileAccess.People[userName];
				if (fileUser == null || !fileUser.Download)
					return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

				if (string.IsNullOrWhiteSpace(fileName))
					return BadRequest(new BaseResult() { success = false, message = "INVALID_PARAMS" });

				if (!string.IsNullOrWhiteSpace(directory))
					fileName = $"{directory}\\{fileName}";

				if (!FileLogic.CheckFilePermission(fileUser, fileName))
					return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

				var fullPath = $"{AppConfig.Config.FileAccess.RootDirectory}\\{fileName}";
				if (!System.IO.File.Exists(fullPath))
					return BadRequest(new BaseResult { success = false, message = "FILE_NOT_EXIST" });

				string contentType = string.Empty;
				string ext = Path.GetExtension(fullPath).TrimStart('.');
				if (AppConfig.Config.FileAccess.CustomMimeTypes.ContainsKey(ext))
					contentType = AppConfig.Config.FileAccess.CustomMimeTypes[ext];
				else
					new FileExtensionContentTypeProvider()?.TryGetContentType(fullPath, out contentType);
				if (string.IsNullOrWhiteSpace(contentType))
					contentType = "application/octet-stream";

				return PhysicalFile(fullPath, contentType);
			}
			catch(Exception ex)
			{
				Helpers.ErrorLog.WriteError(ex);
				return BadRequest("ERROR_GET_FILE");
			}
		}

		[HttpGet, Route("list-directory")]
		[Authorize]
		public ActionResult ListDirectory([FromQuery]string directory)
		{
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.List)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			var res = FileLogic.ListDirectory(fileUser, directory);

			if (res.success)
				return Ok(res);
			return BadRequest(res);
		}

		[HttpDelete, Route("delete-file")]
		[Authorize]
		public ActionResult DeleteFile([FromQuery]string fileName, [FromQuery]string directory)
		{
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.Delete)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			var res = FileLogic.DeleteFile(fileUser, $"{directory}\\{fileName}");

			if (res.success)
				return Ok(res);
			return BadRequest(res);
		}

		[HttpDelete, Route("delete-directory")]
		[Authorize]
		public ActionResult DeleteDirectory([FromQuery]string directory)
		{
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.DeleteDirectory)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			var res = FileLogic.DeleteDirectory(fileUser, directory);

			if (res.success)
				return Ok(res);
			return BadRequest(res);
		}

		[HttpGet, Route("get-directory-info")]
		[Authorize]
		public ActionResult GetDirectoryInfo([FromQuery]string directory)
		{
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.List)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			var res = FileLogic.GetDirectoryInfo(fileUser, directory);

			if (res.success)
				return Ok(res);

			return BadRequest(res);
		}

		[HttpGet, Route("get-file-info/{fileName}")]
		[Authorize]
		public ActionResult GetFileInfo(string fileName, [FromQuery]string directory)
		{
			var fileUser = AppConfig.Config.FileAccess.People[User.Identity.Name];
			if (fileUser == null || !fileUser.List)
				return BadRequest(new BaseResult() { message = "USER_NO_PERMISSIONS", success = false });

			var res = FileLogic.GetFileInfo(fileUser, fileName, directory);

			if (res.success)
				return Ok(res);

			return BadRequest(res);
		}

		private static Encoding GetEncoding(MultipartSection section)
		{
			var hasMediaTypeHeader = MediaTypeHeaderValue.TryParse(section.ContentType, out var mediaType);
			// UTF-7 is insecure and should not be honored. UTF-8 will succeed in 
			// most cases.
			if (!hasMediaTypeHeader || Encoding.UTF7.Equals(mediaType.Encoding))
				return Encoding.UTF8;

			return mediaType.Encoding;
		}
	}
}
