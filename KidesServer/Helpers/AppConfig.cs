using KidesServer.Helpers;
using KidesServer.Models;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

namespace KidesServer
{
	public static class AppConfig
	{
		public static string folderLocation = string.Empty;
		private static readonly object cfgLock = new object();
		private static ConfigModel _config;

		static AppConfig()
		{
			try
			{
				folderLocation = AppDomain.CurrentDomain.GetData("DataDirectory").ToString();
			}
			catch (Exception e)
			{
				ErrorLog.WriteLog(e.Message);
			}
		}

		public static ConfigModel Config
		{
			get
			{
				try
				{
					bool saveConfig = false;
					lock (cfgLock)
					{
						if (_config == null)
						{
							_config = JsonConvert.DeserializeObject<ConfigModel>(File.ReadAllText($"{folderLocation}\\Config.json"));
							_config.FileAccess.CheckPasswordHashes();
							saveConfig = true;
						}
					}
					
					if(saveConfig)
						SaveConfig();

					return _config;
				}
				catch (Exception e)
				{
					ErrorLog.WriteError(e);
					return null;
				}
			}
		}

		public static void SaveConfig()
		{
			try
			{
				lock (cfgLock)
				{
					//Why would we need to load and resave the config if it wasnt loaded in the first place to have changes?
					if (_config == null)
						return;
					//if (_config == null)
					//	_config = JsonConvert.DeserializeObject<ConfigModel>(File.ReadAllText($"{folderLocation}\\Config.json"));
					var cfg = JsonConvert.SerializeObject(_config, Formatting.Indented);
					if (!string.IsNullOrWhiteSpace(cfg))
						File.WriteAllText($"{folderLocation}\\Config.json", cfg);
					else
						ErrorLog.WriteLog("Serialization of config is empty, not saving");
				}
			}
			catch (Exception e)
			{
				ErrorLog.WriteLog(e.Message);
			}
		}
	}
}