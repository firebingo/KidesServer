﻿using Newtonsoft.Json;
using Symphogames.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Symphogames.Helpers
{
	public class SymphogamesConfig
	{
		public static string folderLocation = string.Empty;
		private static SymphogamesConfigModel _config;

		static SymphogamesConfig()
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

		public static SymphogamesConfigModel Config
		{
			get
			{
				try
				{
					if (_config == null)
						_config = JsonConvert.DeserializeObject<SymphogamesConfigModel>(File.ReadAllText($"{folderLocation}\\SGConfig.json"));
					return _config;
				}
				catch (Exception e)
				{
					ErrorLog.WriteLog(e.Message);
					return null;
				}
			}
		}
	}
}