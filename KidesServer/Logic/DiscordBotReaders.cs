using KidesServer.Common.DataBase;
using KidesServer.Helpers;
using KidesServer.Models;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace KidesServer.Logic
{
	public static class DiscordBotReaders
	{
		public static Task ReadMessageList(IDataReader reader, IDbConnection connection, List<MessageListReadModelRow> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 7)
			{
				var mesObject = new MessageListReadModelRow();
				ulong? temp = reader.GetValue(0) as ulong?;
				mesObject.userId = temp ?? 0;
				mesObject.nickName = reader.GetValue(1) as string;
				mesObject.userName = reader.GetValue(2) as string;
				if (reader.GetValue(3) is string tempString)
					mesObject.roleIds = JsonConvert.DeserializeObject<List<ulong>>(tempString);
				else
					mesObject.roleIds = new List<ulong>();
				mesObject.messageCount = reader.GetInt32(4);
				mesObject.isDeleted = reader.GetBoolean(5);
				mesObject.isBanned = reader.GetBoolean(6);
				data.Add(mesObject);
			}
			return Task.CompletedTask;
		}

		public static Task ReadUserInfo(IDataReader reader, IDbConnection connection, UserInfoReadModel data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 8)
			{
				ulong? temp = reader.GetValue(0) as ulong?;
				data.userId = temp ?? 0;
				data.isBot = reader.GetBoolean(1);
				data.userName = reader.GetValue(2) as string;
				data.nickName = reader.GetValue(3) as string;
				data.avatarUrl = reader.GetValue(4) as string;
				data.joinedDate = reader.GetValue(5) as DateTime?;
				if (reader.GetValue(6) is string tempString)
					data.roleIds = JsonConvert.DeserializeObject<List<ulong>>(tempString);
				else
					data.roleIds = new List<ulong>();
				data.isDeleted = reader.GetBoolean(7);
				data.isBanned = reader.GetBoolean(8);
			}
			return Task.CompletedTask;
		}

		public static Task ReadUserMessageDensity(IDataReader reader, IDbConnection connection, List<DiscordUserMessageDensity> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 3)
			{
				var dObject = new DiscordUserMessageDensity
				{
					messageCount = reader.GetInt32(0)
				};
				var month = reader.GetInt32(1);
				var year = reader.GetInt32(2);
				dObject.date = new DateTime(year, month, 1);
				dObject.date.ToUniversalTime();
				data.Add(dObject);
			}
			return Task.CompletedTask;
		}

		public static Task ReadRoleList(IDataReader reader, IDbConnection connection, List<DiscordRoleListRow> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 4)
			{
				var roleObject = new DiscordRoleListRow();
				ulong? temp = reader.GetValue(0) as ulong?;
				roleObject.roleId = temp.HasValue ? temp.Value.ToString() : "0";
				roleObject.roleName = reader.GetString(1);
				roleObject.roleColor = reader.GetString(2);
				roleObject.isEveryone = reader.GetBoolean(3);
				data.Add(roleObject);
			}
			return Task.CompletedTask;
		}

		public static Task ReadEmojiList(IDataReader reader, IDbConnection connection, List<DiscordEmojiListRow> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 4)
			{
				var emObject = new DiscordEmojiListRow();
				ulong? temp = reader.GetValue(0) as ulong?;
				emObject.emojiId = (temp ?? 0).ToString();
				emObject.emojiName = reader.GetValue(1) as string;
				emObject.useCount = reader.GetInt32(2);
				emObject.rank = reader.GetInt32(3);
				//For now im going to check these on the frontend because it takes a long time to try to request and check each image.
				//var imageGif = $"https://cdn.discordapp.com/emojis/{emObject.emojiId}.gif";
				emObject.emojiImg = $"https://cdn.discordapp.com/emojis/{emObject.emojiId}.png";
				data.Add(emObject);
			}
			return Task.CompletedTask;
		}

		public static Task ReadMessagesText(IDataReader reader, IDbConnection connection, List<MessageTextModel> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null)
			{
				var message = new MessageTextModel(reader.GetString(0), (reader.GetValue(1) as ulong?).Value);
				data.Add(message);
			}
			return Task.CompletedTask;
		}

		public static Task ReadServerStats(IDataReader reader, IDbConnection connection, List<DiscordStatRow> data)
		{
			reader = reader as MySqlDataReader;
			if (reader != null && reader.FieldCount >= 5)
			{
				var statObj = new DiscordStatRow();
				ulong? temp = reader.GetValue(0) as ulong?;
				statObj.serverId = (temp ?? 0).ToString();
				statObj.statType = (StatType)Enum.Parse(typeof(StatType), reader.GetInt32(1).ToString());
				statObj.date = reader.GetDateTime(2);
				statObj.statValue = reader.GetInt64(3);
				statObj.statText = reader.GetValue(4) as string;
				data.Add(statObj);
			}
			return Task.CompletedTask;
		}
	}
}
