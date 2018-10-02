﻿using System.Linq;
using System.Net;
using System.Net.Http;
using KidesServer.Models;
using KidesServer.Logic;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;

namespace KidesServer.Controllers
{
	[Route("api/v1")]
	[ApiController]
	public class WoTController : ControllerBase
	{
		[HttpGet, Route("user-data")]
		public async Task<IActionResult> GetUserData([FromQuery]string username, [FromQuery]string region = "na", [FromQuery]string accessToken = null)
		{
			var success = true;
			var message = "";
			WotUserInfo data = null;
			WotBasicUser userInfo = null;
			try
			{
				userInfo = await WoTLogic.CallInfoAPI(username, region);
				if (userInfo.status == "error")
				{
					var code = Int32.Parse(userInfo.error.code);
					return BadRequest(userInfo.error.message);
				}
			}
			catch (Exception e)
			{
				ErrorLog.writeLog(e.Message);
				return StatusCode(500, e.Message);
			}
			if (userInfo != null && userInfo.data != null)
			{
				var accountId = "";
				//try to search for the exact username.
				accountId = userInfo.data.FirstOrDefault(acc => acc.nickname == username)?.account_id ?? "";
				//if the exact name isint found go for a simple contains and case removal.
				if(accountId == "")
					accountId = userInfo.data.FirstOrDefault(acc => acc.nickname.ToLower().Contains(username.ToLower()))?.account_id ?? "";
				if (accountId == "")
				{
					success = false;
					message = $"No user with name {username} found on {region} server.";
				}
				else
				{
					data = await WoTLogic.CallDataAPI(accountId, accessToken, region);
					if(data?.data == null)
					{
						success = false;
						message = $"User {username} found, but data could not be found.";
					}
				}
			}
			else
			{
				success = false;
				message = $"No user with name {username} found on {region} server.";
			}
			if (success)
				return Ok(data);
			else
				return BadRequest(message);
		}
	}
}