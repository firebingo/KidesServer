using KidesServer.Logic;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace KidesServer.Controllers
{
	[Route("api/v1")]
	[ApiController]
	public class MusicController : ControllerBase
	{
		[HttpGet, Route("song-url")]
		public async Task<IActionResult> GetSongUrl([FromQuery]string searchString)
		{
			try
			{
				var result = await MusicLogic.SearchForSong(searchString);

				if (result.success)
					return Ok(result);
				else
					return BadRequest(result.message);
			}
			catch(Exception ex)
			{
				return StatusCode(500, ex.Message);
			}
		}

		//[HttpGet, Route("song-stats")]
		//public async Task<IActionResult> getSongStats()
		//{
		//	var result = MusicLogic.getSongStats();
		//
		//	if (result.success)
		//		return Ok(result);
		//	else
		//		return BadRequest(result.message);
		//}
	}
}