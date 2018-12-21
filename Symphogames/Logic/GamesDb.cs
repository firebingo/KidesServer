﻿using Symphogames;
using Symphogames.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Symphogames.Logic
{
	public static class GamesDb
	{
		public static readonly ConcurrentDictionary<uint, SPlayer> Players;
		private static uint _nextGameId = 1;
		private static uint _nextPlayerId = 1;

		static GamesDb()
		{
			Players = new ConcurrentDictionary<uint, SPlayer>();
		}

		public static Task CreatePlayer(SPlayer p)
		{
			Players.TryAdd(p.Id, p);
			return Task.CompletedTask;
		}

		public static Task<uint> GetNextGameId()
		{
			return Task.FromResult(_nextGameId++);
		}

		public static Task<uint> GetNextPlayerId()
		{
			return Task.FromResult(_nextPlayerId++);
		}
	}
}
