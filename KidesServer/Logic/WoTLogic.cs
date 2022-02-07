using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using KidesServer.Models;
using System.Net.Http.Headers;
using KidesServer.Helpers;
using Newtonsoft.Json;

namespace KidesServer.Logic
{
	public static class WoTLogic
	{
		private static readonly string appId = "";
		private static readonly Dictionary<string, string> regionBaseUrls = null;
		private static readonly HttpClient _client = null;

		static WoTLogic()
		{
			try
			{
				appId = AppConfig.Config.wotAppId;
				regionBaseUrls = new Dictionary<string, string>()
				{
					{ "na", "https://api.worldoftanks.com/" },
					{ "eu", "https://api.worldoftanks.eu/" },
					{ "ru", "https://api.worldoftanks.ru/" },
					{ "asia", "https://api.worldoftanks.asia/" },
				};

				_client = new HttpClient();
				_client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			}
			catch (Exception e)
			{
				ErrorLog.WriteLog(e.Message);
			}
		}

		public static async Task<string> GetTokenRedirect(string redirectUrl, string region)
		{
			using var response = await _client.GetAsync($"{regionBaseUrls[region]}/wot/auth/login/?application_id={appId}&nofollow=1&redirect_uri={redirectUrl}");
			if (response.IsSuccessStatusCode)
			{
				try
				{
					var content = await response.Content.ReadAsStringAsync();
					var dataObjects = JsonConvert.DeserializeObject<WotOpenidReturn>(content);
					if (dataObjects != null)
						return dataObjects.data.location;
					else
						return null;
				}
				catch (Exception e)
				{
					ErrorLog.WriteLog(e.Message);
					return null;
				}
			}
			else
			{
				return null;
			}
		}

		public static async Task LogoutUser(string accessToken, string region)
		{
			using var response = await _client.GetAsync($"{regionBaseUrls[region]}/wot/auth/login/?application_id={appId}&access_token={accessToken}");
		}

		public static async Task<WotBasicUser> CallInfoAPI(string searchString, string region)
		{
			using var response = await _client.GetAsync($"{regionBaseUrls[region]}wot/account/list/?application_id={appId}&search={searchString}");
			if (response.IsSuccessStatusCode)
			{
				try
				{
					var content = await response.Content.ReadAsStringAsync();
					var dataObjects = JsonConvert.DeserializeObject<WotBasicUser>(content);
					if (dataObjects != null)
						return dataObjects;
					else
						return null;
				}
				catch (Exception e)
				{
					ErrorLog.WriteLog(e.Message);
					return null;
				}
			}
			else
			{
				return null;
			}
		}

		public static async Task<WotUserInfoReturn> CallDataAPI(long accoundId, string accessToken, string region)
		{
			using var response = await _client.GetAsync($"{regionBaseUrls[region]}wot/account/info/?application_id={appId}&account_id={accoundId}{(accessToken != null ? $"&access_token={accessToken}" : "")}");
			if (response.IsSuccessStatusCode)
			{
				try
				{
					var content = await response.Content.ReadAsStringAsync();
					var dataObjects = JsonConvert.DeserializeObject<WotUserInfo>(content);
					if (dataObjects != null)
					{
						var ret = new WotUserInfoReturn()
						{
							error = dataObjects.error,
							status = dataObjects.status
						};
						if (dataObjects.data.ContainsKey(accoundId))
						{
							var tanksIds = new List<int>();
							var data = dataObjects.data[accoundId];
							ret.data = data;
							ret.max_damage = new WotVehicle { tank_id = data.statistics.all.max_damage_tank_id };
							ret.max_frags = new WotVehicle { tank_id = data.statistics.all.max_frags_tank_id };
							ret.max_xp = new WotVehicle { tank_id = data.statistics.all.max_xp_tank_id };
							ret.most_killed = new WotVehicle();
							if (data.statistics.frags != null)
							{
								foreach (var frag in data.statistics.frags)
								{
									if (frag.Key == ret.max_damage.tank_id)
										ret.max_damage.kills = frag.Value;
									else if (frag.Key == ret.max_frags.tank_id)
										ret.max_frags.kills = frag.Value;
									else if (frag.Key == ret.max_xp.tank_id)
										ret.max_xp.kills = frag.Value;

									if (frag.Value > ret.most_killed.kills)
										ret.most_killed = new WotVehicle() { tank_id = frag.Key, kills = frag.Value };
								}
								tanksIds.Add(ret.most_killed.tank_id);
							}
							else
								ret.most_killed = null;
							tanksIds.Add(ret.max_damage.tank_id);
							tanksIds.Add(ret.max_frags.tank_id);
							tanksIds.Add(ret.max_xp.tank_id);
							var tanksInfo = await GetTankInfo(tanksIds, region);
							if (tanksInfo != null)
							{
								tanksInfo.data[ret.max_damage.tank_id.ToString()].kills = ret.max_damage.kills;
								tanksInfo.data[ret.max_frags.tank_id.ToString()].kills = ret.max_frags.kills;
								tanksInfo.data[ret.max_xp.tank_id.ToString()].kills = ret.max_xp.kills;
								ret.max_damage = tanksInfo.data[ret.max_damage.tank_id.ToString()];
								ret.max_frags = tanksInfo.data[ret.max_frags.tank_id.ToString()];
								ret.max_xp = tanksInfo.data[ret.max_xp.tank_id.ToString()];
								if (ret.most_killed != null)
								{
									tanksInfo.data[ret.most_killed.tank_id.ToString()].kills = ret.most_killed.kills;
									ret.most_killed = tanksInfo.data[ret.most_killed.tank_id.ToString()];
								}
							}
						}
						return ret;
					}
					else
						return null;
				}
				catch (Exception e)
				{
					ErrorLog.WriteLog(e.Message);
					return null;
				}
			}
			else
			{
				return null;
			}
		}

		public static async Task<WotVehicles> GetTankInfo(List<int> tanksIds, string region)
		{
			using var response = await _client.GetAsync($"{regionBaseUrls[region]}wot/encyclopedia/vehicles/?application_id={appId}&tank_id={string.Join(',', tanksIds)}&fields=tank_id,name,short_name,images");
			if (response.IsSuccessStatusCode)
			{
				try
				{
					var content = await response.Content.ReadAsStringAsync();
					var dataObjects = JsonConvert.DeserializeObject<WotVehicles>(content);
					if (dataObjects != null)
						return dataObjects;
					else
						return null;
				}
				catch (Exception e)
				{
					ErrorLog.WriteLog(e.Message);
					return null;
				}
			}
			else
			{
				return null;
			}
		}
	}
}