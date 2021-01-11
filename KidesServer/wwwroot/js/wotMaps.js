var mapList = [
{name: 'Paris',								index: 0,  fileName: '../WotMaps/02 - Paris.jpg',							  comFileName: '../WotMaps/comp/02 - Paris.jpg',							},
{name: 'Pilsen',							index: 1,  fileName: '../WotMaps/03 - Pilsen.jpg',							  comFileName: '../WotMaps/comp/03 - Pilsen.jpg',							},
{name: 'Redshire',							index: 2,  fileName: '../WotMaps/04 - Redshire.jpg',						  comFileName: '../WotMaps/comp/04 - Redshire.jpg',							},
{name: 'Airfield',							index: 3,  fileName: '../WotMaps/05 - Airfield.jpg',						  comFileName: '../WotMaps/comp/05 - Airfield.jpg',							},
{name: 'Himmelsdorf - Winter Himmelsdorf',	index: 4,  fileName: '../WotMaps/06 - Himmelsdorf.jpg',						  comFileName: '../WotMaps/comp/06 - Himmelsdorf.jpg',						},
{name: 'Mountain Pass',						index: 5,  fileName: '../WotMaps/07 - Mountain Pass.jpg',					  comFileName: '../WotMaps/comp/07 - Mountain Pass.jpg',					},
{name: 'Lakeville',							index: 6,  fileName: '../WotMaps/08 - Lakeville.jpg',						  comFileName: '../WotMaps/comp/08 - Lakeville.jpg',						},
{name: 'Sacred Valley',						index: 7,  fileName: '../WotMaps/09 - Sacred Valley.jpg',					  comFileName: '../WotMaps/comp/09 - Sacred Valley.jpg',					},
{name: 'Malinovka',							index: 8,  fileName: '../WotMaps/10 - Malinovka.jpg',						  comFileName: '../WotMaps/comp/10 - Malinovka.jpg',						},
{name: 'Mines',								index: 9,  fileName: '../WotMaps/11 - Mines.jpg',							  comFileName: '../WotMaps/comp/11 - Mines.jpg',							},
{name: 'Ruinberg - Winterberg',				index: 10, fileName: '../WotMaps/12 - Ruinberg.jpg',						  comFileName: '../WotMaps/comp/12 - Ruinberg.jpg',							},
{name: 'Abbey',								index: 11, fileName: '../WotMaps/13 - Abbey.jpg',							  comFileName: '../WotMaps/comp/13 - Abbey.jpg',							},
{name: 'Steppes',							index: 12, fileName: '../WotMaps/14 - Steppes.jpg',							  comFileName: '../WotMaps/comp/14 - Steppes.jpg',							},
{name: 'Karelia',							index: 13, fileName: '../WotMaps/15 - Karelia.jpg',							  comFileName: '../WotMaps/comp/15 - Karelia.jpg',							},
{name: 'Live oaks',							index: 14, fileName: '../WotMaps/16 - Live oaks.jpg',						  comFileName: '../WotMaps/comp/16 - Live oaks.jpg',						},
{name: 'Fjords',							index: 15, fileName: '../WotMaps/17 - Fjords.jpg',							  comFileName: '../WotMaps/comp/17 - Fjords.jpg',							},
{name: 'Highway',							index: 16, fileName: '../WotMaps/18 - Highway.jpg',							  comFileName: '../WotMaps/comp/18 - Highway.jpg',							},
{name: 'Overlord',							index: 17, fileName: '../WotMaps/19 - Overlord.jpg',						  comFileName: '../WotMaps/comp/19 - Overlord.jpg',							},
{name: 'Murovanka',							index: 18, fileName: '../WotMaps/20 - Murovanka.jpg',						  comFileName: '../WotMaps/comp/20 - Murovanka.jpg',						},
{name: 'Cliff',								index: 19, fileName: '../WotMaps/21 - Cliff.jpg',							  comFileName: '../WotMaps/comp/21 - Cliff.jpg',							},
{name: 'Ensk',								index: 20, fileName: '../WotMaps/22 - Ensk.jpg',							  comFileName: '../WotMaps/comp/22 - Ensk.jpg',								},
{name: 'Siegfried Line',					index: 21, fileName: '../WotMaps/23 - Siegfried Line.jpg',					  comFileName: '../WotMaps/comp/23 - Siegfried Line.jpg',					},
{name: 'Stalingrad',						index: 22, fileName: '../WotMaps/24 - Stalingrad.jpg',						  comFileName: '../WotMaps/comp/24 - Stalingrad.jpg',						},
{name: 'Serene Coast',						index: 23, fileName: '../WotMaps/25 - Serene Coast.jpg',					  comFileName: '../WotMaps/comp/25 - Serene Coast.jpg',						},
{name: 'Tundra',							index: 24, fileName: '../WotMaps/26 - Tundra.jpg',							  comFileName: '../WotMaps/comp/26 - Tundra.jpg',							},
{name: 'Sand River',						index: 25, fileName: '../WotMaps/27 - Sand River.jpg',						  comFileName: '../WotMaps/comp/27 - Sand River.jpg',						},
{name: 'Fisherman\'s Bay',					index: 26, fileName: '../WotMaps/28 - Fisherman\'s Bay.jpg',				  comFileName: '../WotMaps/comp/28 - Fisherman\'s Bay.jpg',					},
{name: 'Swamp',								index: 27, fileName: '../WotMaps/29 - Swamp.jpg',							  comFileName: '../WotMaps/comp/29 - Swamp.jpg',							},
{name: 'Erlenberg',							index: 28, fileName: '../WotMaps/30 - Erlenberg.jpg',						  comFileName: '../WotMaps/comp/30 - Erlenberg.jpg',						},
{name: 'Windstorm',							index: 29, fileName: '../WotMaps/31 - Windstorm.jpg',						  comFileName: '../WotMaps/comp/31 - Windstorm.jpg',						},
{name: 'Westfield',							index: 30, fileName: '../WotMaps/32 - Westfield.jpg',						  comFileName: '../WotMaps/comp/32 - Westfield.jpg',						},
{name: 'El Halluf',							index: 31, fileName: '../WotMaps/33 - El Halluf.jpg',						  comFileName: '../WotMaps/comp/33 - El Halluf.jpg',						},
{name: 'Prokhorovka - Fiery Salient',		index: 32, fileName: '../WotMaps/34 - Prokhorovka.jpg',						  comFileName: '../WotMaps/comp/34 - Prokhorovka.jpg',						},
{name: 'Arctic Region',						index: 33, fileName: '../WotMaps/35 - Arctic Region.jpg',					  comFileName: '../WotMaps/comp/35 - Arctic Region.jpg',					},
{name: 'Kharkov',							index: 34, fileName: '../WotMaps/Coldstream/32 - Kharkov.jpg',				  comFileName: '../WotMaps/Coldstream/comp/32 - Kharkov.jpg',				},
{name: 'Widepark',							index: 35, fileName: '../WotMaps/Coldstream/35 - Widepark.jpg',				  comFileName: '../WotMaps/Coldstream/comp/35 - Widepark.jpg',				}
];

var tankList = undefined;
var currentMapIndex = 0;
var currentMapUrl = mapList[currentMapIndex].fileName;
var imageArea = undefined;
var imageContainer = undefined;
var imagePreviews = undefined;
var searchSpan = undefined;
var searchInput = undefined;
var mapTitle = undefined;
var mapContainer = undefined;
var playerContainer = undefined;
var playerSearchInput = undefined;
var playerTokenInput = undefined;
var playerSearchError = undefined;
var playerRegionDropdown = undefined;

async function getJSON(url) {
	const res = await fetch(url);
	return await res.json();
};

function setTankList(res) {
	tankList = res;
};

function tankListFailure(res) {

};

async function startLoad() {
	try {
		const res = await getJSON(`/Js/wotTankList.min.json`);
		setTankList(res);
	}
	catch (ex) {
		console.log(ex);
		tankListFailure(ex);
	}
}

startLoad();


function hideSection(section) {
	switch (section) {
		case 'guide':
			if (mapContainer) {
				if (mapContainer.style.display === 'none') {
					mapContainer.style.display = 'flex';
				} else {
					mapContainer.style.display = 'none';
				}
			}
			break;
		case 'previews':
			if (imagePreviews) {
				if (imagePreviews.style.display === 'none') {
					imagePreviews.style.display = 'flex';
				} else {
					imagePreviews.style.display = 'none';
				}
			}
			break;
		case 'player':
			if (playerContainer) {
				if (playerContainer.style.display === 'none') {
					playerContainer.style.display = 'flex';
				} else {
					playerContainer.style.display = 'none';
				}
			}
			break;
	}
};

function buildMapPreivew(map) {
	var mapPreivewTemplate = ' \
			<div class="preview-container"> \
				<img src="' + map.comFileName + '"/> \
			</div> \
			';
	return mapPreivewTemplate;
};

function buildUserData(data) {
	var keys = Object.keys(data);
	var data = data[keys[0]];
	var tankKills = undefined;
	var mostKilled = undefined;
	if (data.statistics.frags) {
		tankKills = data.statistics.frags;
		var tankKeys = Object.keys(tankKills);
		mostKilled = { id: 0, value: 0 }
		tankKeys.forEach(function (value, index) {
			if (tankKills[value] > mostKilled.value) {
				mostKilled.id = value;
				mostKilled.value = tankKills[value];
			}
		});
	}
	var mostKilledTank = mostKilled ? tankList.data[mostKilled.id] : undefined;
	var maxXpTank = tankList.data[data.statistics.all.max_xp_tank_id];
	var maxFragsTank = tankList.data[data.statistics.all.max_frags_tank_id];
	var maxDamageTank = tankList.data[data.statistics.all.max_damage_tank_id];
	var userDataTemplate = '\
	<table id="player-table">\
		<tbody>\
			<tr><td class="ac-left-cell"><span>Nickname:  </span></td><td class="ac-right-cell"><span>' + data.nickname + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Account Id:	</span></td><td class="ac-right-cell"><span>' + data.account_id + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Created Date:  </span></td><td class="ac-right-cell"><span>' + new Date(data.created_at * 1000).toString() + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Personal Rating:	 </span></td><td class="ac-right-cell"><span>' + data.global_rating + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Last Battle:	 </span></td><td class="ac-right-cell"><span>' + new Date(data.last_battle_time * 1000).toString() + '</span></td></tr>' +
		(data.private ?
			'<tr><td colspan="2" class="ac-single-cell"><span>Private Data (Requires Access Token):</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Credits:	 </span></td><td class="ac-right-cell"><span>' + data.private.credits + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Gold:  </span></td><td class="ac-right-cell"><span>' + data.private.gold + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Free XP:	 </span></td><td class="ac-right-cell"><span>' + data.private.free_xp + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Premium:	 </span></td><td class="ac-right-cell"><span>' + data.private.is_premium.toString() + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Premium Expires At:	</span></td><td class="ac-right-cell"><span>' + new Date(data.private.premium_expires_at * 1000).toString() + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Battle Life Time:  </span></td><td class="ac-right-cell"><span>' + ((data.private.battle_life_time / 60) / 60).toFixed(1) + ' hours</span></td></tr>' +
			(tankKills ?
				'<tr><td colspan="2" class="ac-single-cell"><div><span>Most Killed Tank:  </span><span>' + mostKilled.value + ' kills - ' + ((mostKilled.value / data.statistics.all.frags) * 100).toFixed(3) + '%</span>\
			<span>' + (mostKilledTank ? mostKilledTank.name : "Unknown Tank") + '</span><img src="' + (mostKilledTank ? mostKilledTank.images.big_icon : "") + '"/></div></td></tr>\
			' : '') +
			'<tr><td colspan="2" class="ac-single-cell"><span>End Private Data</span></td></tr>' +
			'' : '') +
		'<tr><td class="ac-left-cell"><span>Trees Cut:	</span></td><td class="ac-right-cell"><span>' + data.statistics.trees_cut + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Battles:	 </span></td><td class="ac-right-cell"><span>' + data.statistics.all.battles + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Victories:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.wins + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Draws:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.draws + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Win Rate:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.wins / data.statistics.all.battles) * 100).toFixed(3) + '%</span></td></tr>\
			<tr><td class="ac-left-cell"><span>XP Earned:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.xp + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Average XP:	</span></td><td class="ac-right-cell"><span>' + data.statistics.all.battle_avg_xp + '</span></td></tr>\
			<tr><td colspan="2" class="ac-single-cell"><div><span>Max XP:  </span><span>' + data.statistics.all.max_xp + '</span>\
			<span>' + (maxXpTank ? maxXpTank.name : "Unknown Tank") + '</span><img src="' + (maxXpTank ? maxXpTank.images.big_icon : "") + '"/></div></td></tr>\
			<tr><td class="ac-left-cell"><span>Tanks Spotted:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.spotted + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Kills:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.frags + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Average Kills:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.frags / data.statistics.all.battles)).toFixed(3) + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Shots:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.shots + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Hits:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.hits + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Piercings:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.piercings + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>HE Splashes:	 </span></td><td class="ac-right-cell"><span>' + data.statistics.all.explosion_hits + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Accuracy:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.hits / data.statistics.all.shots) * 100).toFixed(3) + '%</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Piercings %:	 </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.piercings / data.statistics.all.hits) * 100).toFixed(3) + '%</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Damage Dealt:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.damage_dealt + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Average Damage Done:	 </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.damage_dealt / data.statistics.all.battles)).toFixed(1) + '</span></td></tr>\
			<tr><td colspan="2" class="ac-single-cell"><div><span>Max Kills:  </span><span>' + data.statistics.all.max_frags + '</span>\
			<span>' + (maxFragsTank ? maxFragsTank.name : "Unknown Tank") + '</span><img src="' + (maxFragsTank ? maxFragsTank.images.big_icon : "") + '"/></div></td></tr>\
			<tr><td colspan="2" class="ac-single-cell"><div><span>Max Damage:  </span><span>' + data.statistics.all.max_damage + '</span>\
			<span>' + (maxDamageTank ? maxDamageTank.name : "Unknown Tank") + '</span><img src="' + (maxDamageTank ? maxDamageTank.images.big_icon : "") + '"/></div></td></tr>\
			<tr><td class="ac-left-cell"><span>Deaths:	</span></td><td class="ac-right-cell"><span>' + (data.statistics.all.battles - data.statistics.all.survived_battles) + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>K/D:	 </span></td><td class="ac-right-cell"><span>' + (data.statistics.all.frags / (data.statistics.all.battles - data.statistics.all.survived_battles)).toFixed(3) + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Damage Received:	 </span></td><td class="ac-right-cell"><span>' + data.statistics.all.damage_received + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Hits Received:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.direct_hits_received + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Piercings Received:	</span></td><td class="ac-right-cell"><span>' + data.statistics.all.piercings_received + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Bounces:	 </span></td><td class="ac-right-cell"><span>' + data.statistics.all.no_damage_direct_hits_received + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Bounces %:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.no_damage_direct_hits_received / data.statistics.all.direct_hits_received) * 100).toFixed(3) + '%</span></td></tr>\
			<tr><td class="ac-left-cell"><span>HE Splashes Received:  </span></td><td class="ac-right-cell"><span>' + data.statistics.all.explosion_hits_received + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Average Damage Blocked:	</span></td><td class="ac-right-cell"><span>' + data.statistics.all.avg_damage_blocked + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Hit/Received:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.hits / data.statistics.all.direct_hits_received)).toFixed(3) + '</span></td></tr>\
			<tr><td class="ac-left-cell"><span>Pens/Received:  </span></td><td class="ac-right-cell"><span>' + ((data.statistics.all.piercings / data.statistics.all.piercings_received)).toFixed(3) + '</span></td></tr>\
		</tbody>\
	</table>\
	';
	return userDataTemplate;
};

function onPreviewClicked(index) {
	currentMapIndex = index;
	var currentMapUrl = mapList[currentMapIndex].fileName;
	if (imageArea && mapTitle) {
		imageArea.style.height = '41.25rem';
		imageArea.src = currentMapUrl;
		searchSpan.innerHTML = '';
		mapTitle.style.display = 'block';
		mapTitle.innerHTML = mapList[currentMapIndex].index + " - " + mapList[currentMapIndex].name;
	}
};

function searchMap() {
	if (searchInput) {
		var inputText = searchInput.value.toLowerCase();
		for (var i = 0; i < mapList.length; ++i) {
			if (mapList[i].name.toLowerCase().includes(inputText) || mapList[i].index.toString().toLowerCase().includes(inputText)) {
				onPreviewClicked(mapList[i].index);
				break;
			}
		}
	}
};

function loadPlayerData(res) {
	document.getElementById('player-searching').innerText = '';
	if (playerContainer) {
		var element = document.createElement('div');
		element.id = 'player-data-container';
		var built = buildUserData(res.data);
		element.innerHTML = built;
		playerContainer.appendChild(element);
	}
};

function loadPlayerFailure(res) {
	document.getElementById('player-searching').innerText = '';
	var message = undefined;
	if (!res.error || !res.error.message) {
		message = "There was an error in handling an error."
	} else {
		message = res.error.message;
	}
	if (!message) {
		message = "There was an error in handling an error."
	}
	if (playerSearchError) {
		switch (message) {
			case ('NOT_ENOUGH_SEARCH_LENGTH'):
				message = 'Username is not long enough to search.';
				break;
			case ('SEARCH_NOT_SPECIFIED'):
				message = 'No username specified.';
				break;
			case ('ACCOUNT_ID_LIST_LIMIT_EXCEEDED'):
				message = 'Limit of account ids specified exceeded (how?).';
				break;
			case ('ACCOUNT_ID_LIST_LIMIT_EXCEEDED'):
				message = 'Limit of account ids specified exceeded (how?).';
				break;
			case ('METHOD_NOT_FOUND'):
				message = 'API Method not found (contact Matthew.t.kides@gmail.com).';
				break;
			case ('METHOD_DISABLED'):
				message = 'API Method disabled (contact Matthew.t.kides@gmail.com).';
				break;
			case ('APPLICATION_IS_BLOCKED'):
				message = 'Application is blocked from API access (contact Matthew.t.kides@gmail.com).';
				break;
			case ('INVALID_IP_ADDRESS'):
				message = 'Application IP is invalid (contact Matthew.t.kides@gmail.com).';
				break;
			case ('INVALID_APPLICATION_ID'):
				message = 'Application id is invalid (contact Matthew.t.kides@gmail.com).';
				break;
			case ('REQUEST_LIMIT_EXCEEDED'):
				message = 'Request limit exceeded, please wait and try again.';
				break;
			case ('SOURCE_NOT_AVAILABLE'):
				message = 'Data source is not available.';
				break;
			default:
				message = message;
				break;
		}
		playerSearchError.innerHTML = message;
	}
};

async function searchPlayer() {
	if (playerSearchInput && playerTokenInput && playerSearchError && playerRegionDropdown) {
		document.getElementById('player-searching').innerText = 'Searching... Please do not press button again.';
		const dataCont = document.getElementById('player-data-container');
		if (dataCont) {
			dataCont.remove();
		}
		playerSearchError.innerHTML = '';
		var username = playerSearchInput.value;
		var accessToken = playerTokenInput.value;
		var region = playerRegionDropdown.value;
		if (username) {
			try {
				const res = await getJSON(`/api/v1/user-data/?username=${username}${(accessToken ? ('&accessToken=' + accessToken) : '')}${(region ? ('&region=' + region) : '')}`)
				if (res.status && res.status === 'ok') {
					loadPlayerData(res);
				} else {
					loadPlayerFailure(res);
				}
			} catch (ex) {
				console.log(ex);
				loadPlayerFailure({ success: false, message: ex.message })
			}
		}
	}
};

window.onload = function () {
	imageArea = document.getElementById("image-area");
	imagePreviews = document.getElementById("image-previews");
	imageContainer = document.getElementById("image-container");
	searchSpan = document.getElementById("search-span");
	searchInput = document.getElementById("map-search");
	mapTitle = document.getElementById("map-title");
	mapContainer = document.getElementById("map-container");
	playerContainer = document.getElementById("player-container");
	playerSearchInput = document.getElementById("player-search-input");
	playerTokenInput = document.getElementById("player-token-input");
	playerSearchError = document.getElementById("player-search-error");
	playerRegionDropdown = document.getElementById("player-region-dropdown");
	if (imageArea) {
		imageArea.style.height = '0';
	}
	if (mapTitle) {
		mapTitle.style.display = 'none';
	}
	if (searchInput) {
		searchInput.addEventListener("keyup", function (event) {
			event.preventDefault();
			if (event.key === "Enter") {
				searchMap();
			};
		});
	}

	if (playerSearchInput) {
		playerSearchInput.addEventListener("keyup", function (event) {
			event.preventDefault();
			if (event.key === "Enter") {
				searchPlayer();
			};
		});
	}

	if (imagePreviews) {
		mapList.forEach(function (currentValue, index) {
			var element = document.createElement('div');
			element.innerHTML = buildMapPreivew(currentValue);
			element.addEventListener("click", function () {
				onPreviewClicked(currentValue.index)
			});
			imagePreviews.appendChild(element);
		});
	}
}