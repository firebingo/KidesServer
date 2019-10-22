using KidesServer.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace KidesServer.Models
{
	public class ConfigModel
	{
		public string wotAppId;
		public string iisLogLocation;
		public string baseMusicUrl;
		public DBConfigModel DBConfig;
		public string botId;
		public FileControllerConfig FileAccess = new FileControllerConfig();
	}

	public class FileControllerConfig
	{
		public string RootDirectory;
		public List<FileControllerPerson> PeopleList = new List<FileControllerPerson>();
		private Dictionary<string, FileControllerPerson> _people;
		public Dictionary<string, string> CustomMimeTypes = new Dictionary<string, string>();

		[JsonIgnore]
		public Dictionary<string, FileControllerPerson> People
		{
			get
			{
				if (_people == null)
					_people = PeopleList.ToDictionary(k => k.Username.ToLowerInvariant(), v => v);
				return _people;
			}
		}

		public void CheckPasswordHashes()
		{
			foreach(var u in PeopleList)
			{
				u.CheckPasswordHash();
			}
		}
	}

	public class FileControllerPerson
	{
		public string Username = "";
		public string Password = "";
		public bool NeedsPasswordHashed = true;
		public string HashSalt = "";
		public bool Disabled = false;
		public bool Upload = false;
		public bool Download = true;
		public bool List = false;
		public bool Delete = false;
		public bool DeleteDirectory = false;
		public bool CreateDirectory = false;
		public List<string> Directories = new List<string>();

		public void CheckPasswordHash()
		{
			if (string.IsNullOrWhiteSpace(HashSalt))
				HashSalt = Guid.NewGuid().ToString("n");
			if (NeedsPasswordHashed)
			{
				NeedsPasswordHashed = false;
				StringBuilder builder = new StringBuilder();
				using (var hash = SHA256.Create())
				{
					var result = hash.ComputeHash(Encoding.UTF8.GetBytes($"{HashSalt}{Password}"));

					foreach (var b in result)
					{
						builder.Append(b.ToString("x2"));
					}
				}
				Password = builder.ToString();
			}
		}

		public bool CheckPassword(string password)
		{
			if (Username.ToLowerInvariant() == "anon" && string.IsNullOrWhiteSpace(password))
				return true;
			StringBuilder builder = new StringBuilder();
			using (var hash = SHA256.Create())
			{
				var result = hash.ComputeHash(Encoding.UTF8.GetBytes($"{HashSalt}{password}"));

				foreach (var b in result)
				{
					builder.Append(b.ToString("x2"));
				}
			}
			if (Password == builder.ToString())
				return true;
			return false;
		}
	}
}
