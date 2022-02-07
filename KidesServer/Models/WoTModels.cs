using System;
using System.Collections.Generic;

#pragma warning disable IDE1006 // Naming Styles
namespace KidesServer.Models
{
	[Serializable]
	public class WotError
	{
		public string code;
		public string message;
		public string field;
		public string value;
	}

	//UserInfo Models
	[Serializable]
	public class WotBasicUser
	{
		public string status;
		public WotError error;
		public List<WotBasicUserInfo> data;
	}

	[Serializable]
	public class WotBasicUserInfo
	{
		public string nickname;
		public string account_id;
	}

	//UserData Models
	[Serializable]
	public class WotUserInfo
	{
		public string status;
		public WotError error;
		public Dictionary<long, WotUser> data;
	}

	[Serializable]
	public class WotUserData
	{
		public Dictionary<long, WotUser> user;
	}

	[Serializable]
	public class WotUser
	{
		public string nickname;
		public string client_language;
		public long last_battle_time;
		public int account_id;
		public long created_at;
		public long updated_at;
		public WotPrivate @private;
		public int global_rating;
		public WotUserStats statistics;
	}

	[Serializable]
	public class WotPrivate
	{
		public long gold;
		public long free_xp;
		public bool is_bound_to_phone;
		public bool is_premium;
		public long credits;
		public long premium_expires_at;
		public long battle_life_time;
	}

	[Serializable]
	public class WotUserStats
	{
		public WotUserStatsAll all;
		public Dictionary<int, int> frags;
		public int trees_cut;
	}

	[Serializable]
	public class WotUserStatsAll
	{
		public int spotted;
		public float avg_damage_assisted_track;
		public int max_xp;
		public float avg_damage_blocked;
		public int direct_hits_received;
		public int explosion_hits;
		public int piercings_received;
		public int piercings;
		public int max_damage_tank_id;
		public long xp;
		public int survived_battles;
		public int dropped_capture_points;
		public int hits_percents;
		public int draws;
		public int max_xp_tank_id;
		public int battles;
		public long damage_received;
		public float avg_damage_assisted;
		public int max_frags_tank_id;
		public int frags;
		public float avg_damage_assisted_radio;
		public int capture_points;
		public int max_damage;
		public int hits;
		public int battle_avg_xp;
		public int wins;
		public int losses;
		public long damage_dealt;
		public int no_damage_direct_hits_received;
		public int max_frags;
		public int shots;
		public int explosion_hits_received;
		public float tanking_factor;
	}

	public class WotVehicles
	{
		public string status { get; set; }
		public WotError error { get; set; }
		public Dictionary<string, WotVehicle> data { get; set; }
	}

	public class WotVehicle
	{
		public int tank_id { get; set; }
		public string name { get; set; }
		public string short_name { get; set; }
		public Dictionary<string, string> images { get; set; }
		public int kills { get; set; }
	}

	public class WotUserInfoReturn
	{
		public string status { get; set; }
		public WotError error { get; set; }
		public WotUser data { get; set; }
		public WotVehicle most_killed { get; set; }
		public WotVehicle max_xp { get; set; }
		public WotVehicle max_frags { get; set; }
		public WotVehicle max_damage { get; set; }
	}

	public class WotOpenidReturn
	{
		public string status { get; set; }
		public WotError error { get; set; }
		public WotOpenid data { get; set; }
	}
	public class WotOpenid
	{
		public string location { get; set; }
	}

}
#pragma warning restore IDE1006 // Naming Styles