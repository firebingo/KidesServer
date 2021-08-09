const counts = { messageList: 10, roleMesList: 10, emojiList: 10, wordList: 10 };
const sortOrders = { messageList: "messageCount", roleMesList: "messageCount", emojiList: "emojiCount", wordList: 'count', statUCnt: 1, statUnU: 1 };
const isDesc = { messageList: true, roleMesList: true, emojiList: true, wordList: true };
const filterInput = { messageList: '', roleMesList: '', emojiList: '', emojiListId: '', wordList: '', wordListId: '', wordListFloor: '', wordListEnglish: false };
const loadFuncs = {
	messageList: loadMessageList, userInfo: loadUserInfo,
	roleMesList: loadRoleMessageList, emojiList: loadEmojiList,
	emojiListId: loadEmojiList, wordList: loadWordList,
	wordListId: loadWordList, wordListFloor: loadWordList,
	wordListEnglish: loadWordList, stats: loadStats
};
const loaded = {
	messageList: false,
	roleMesList: false,
	emojiList: false,
	statsUserCount: false,
	statsUniqueUser: false
}
var serverId = '229596738615377920';
const placeholderAvatar = 'https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png';
var genericErrorArea = undefined;

async function getJSON(url) {
	const res = await fetch(url);
	return await res.json();
};

//#region Message List
var messageListArea = undefined;
var messageListTable = undefined;
var messageListAreaLoading = undefined;

async function loadMessageList() {
	messageListAreaLoading.innerHTML = "<span>Loading...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/message-count/list/?count=${counts['messageList']}&serverId=${serverId}\
		&start=0&sort=${sortOrders['messageList']}&isDesc=${isDesc['messageList']}&includeTotal=true\
		${(filterInput['messageList'] ? (`&userFilter=${encodeURIComponent(filterInput['messageList'])}`) : '')}`);
		if (res.success) {
			messageListSucccess(res);
		} else {
			messageListFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		messageListFailure({ success: false, message: ex.message });
	}
}

function messageListSucccess(res) {
	messageListAreaLoading.innerHTML = "";
	messageListTable.innerHTML = buildMessageList(res.results);
	loaded.messageList = true;
}

function messageListFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	messageListAreaLoading.innerHTML = "<span>" + message + "</span>";
	loaded.messageList = true;
}

function buildMessageList(data) {
	let html = '\
	<tr class="list-table-header-row">\
		<th class="list-table-header header-sortable" onclick="changeSort(\'messageList\', \'userName\')">User' + getSortArrow('messageList', 'userName') + '</th>\
		<th class="list-table-header">Rank</th>\
		<th class="list-table-header header-sortable" onclick="changeSort(\'messageList\', \'messageCount\')">Message Count' + getSortArrow('messageList', 'messageCount') + '</th>\
		<th class="list-table-header">Roles</th>\
	</tr>';
	for (const item of data) {
		html += '\
		<tr class="' + (item.isDeleted ? 'user-removed-row ' : '') + (item.isBanned ? 'user-banned-row' : '') + '">\
			<td class="list-table-cell cell-clickable"\
			onclick="loadUserInfo(\'' + item.userId + '\')">' + item.userName + '</td>\
			<td class="list-table-cell">' + item.rank + '</td>\
			<td class="list-table-cell">' + item.messageCount + '</td>\
			<td class="list-table-cell">' + item.role + '</td>\
		</tr>\
		';
	}
	html += '\
	<tr class="list-table-footer">\
		<td class="footer-left">\
			<span>Limit: </span>\
			<select id="message-list-limit-dd" onchange="changeLimit(\'messageList\', \'message-list-limit-dd\')">\
				<option value="10"' + (counts['messageList'] == 10 ? 'selected="selected"' : '') + '>10</option>\
				<option value="25"' + (counts['messageList'] == 25 ? 'selected="selected"' : '') + '>25</option>\
				<option value="50"' + (counts['messageList'] == 50 ? 'selected="selected"' : '') + '>50</option>\
			</select>\
		</td>\
		<td class="footer-mid"></td>\
		<td class="footer-mid"></td>\
		<td class="footer-right">\
			<input id="message-list-limit-filter" placeholder="Filter by name" value="' + filterInput['messageList'] + '"/>\
			<button onclick="changeFilter(\'messageList\', \'message-list-limit-filter\')">Filter</button>\
		</td>\
	</tr>';
	return html;
}

//#endregion

//#region User Info
var userInfoArea = undefined;
var userTableArea = undefined;
var loadingUserInfo = false;

async function loadUserInfo(id) {
	if (!id || id == -1) { return; }
	if (loadingUserInfo) { return; }
	loadingUserInfo = true;
	messageListAreaLoading.innerHTML = "<span>Loading...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/user-info/?userId=${id}&serverId=${serverId}`);
		if (res.success) {
			userInfoSuccess(res);
		} else {
			userInfoFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		userInfoFailure({ success: false, message: ex.message });
	}
}

function userInfoSuccess(res) {
	userTableArea.innerHTML = buildUserInfo(res);
	buildUserDensityChart(res.messageDensity);
	messageListAreaLoading.innerHTML = "";
	userInfoArea.style.display = "flex";
	setTimeout(function () { userInfoArea.style.opacity = "1"; });
	loadingUserInfo = false;
}

function userInfoFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	genericErrorArea.innerHTML = "<span>" + message + "</span>";
	loadingUserInfo = false;
}

function buildUserInfo(data) {
	const jDate = moment(data.joinedDate);
	const html = '\
	<div class="info-table" style="width: ' + 900 + 'px;">\
		<div class="info-table-row">\
			<div class="avatar-cell"><img src="' + (data.avatarUrl ? data.avatarUrl : placeholderAvatar) + '"/></div>\
			<div class="info-cell">\
				<div class="info-cell-area">\
					<div><span class="bold-text">Username:</span><span class="' +
		(data.isDeleted ? 'user-removed' : '') + (data.isBanned ? 'user-banned' : '') + '">' + data.userName + '</span></div>\
					<div><span class="bold-text">Nickname:</span><span>' + (data.nickName ? data.nickName : 'None') + '</span></div>\
					<div><span class="bold-text">UserID:</span><span>' + (data.userId) + '</span></div>\
					<div><span class="bold-text">Joined At:</span><span>' + jDate.format('MMMM Do YYYY, h:mm a') + '</span></div>' +
		(data.isBot ? '<div><span class="bold-text">Bot</span></div>' : '') +
		'<div><span class="bold-text">Roles:</span><span>' + (data.role ? data.role : 'None') + '</span></div>\
				</div>\
			</div>\
		</div>\
		<div class="info-table-row" id="user-info-chart-area">\
		</div>\
	</div>';
	return html;
}

function buildUserDensityChart(data) {
	const chartData = new google.visualization.DataTable();
	chartData.addColumn('string', 'Date');
	chartData.addColumn('number', 'Message Count');
	let rowsToAdd = [];
	for (const item of data) {
		const date = moment.utc(item.date).format('MMMM, YYYY');
		rowsToAdd.push([date, item.messageCount]);
	}
	chartData.addRows(rowsToAdd);

	const options = {
		'title': 'Message Counts by Month',
		width: 880,
		vAxis: { format: 'decimal', gridlines: { color: '#818181' }, baselineColor: '#818181' },
		hAxis: { textPosition: 'none' },
		legend: 'none',
		backgroundColor: '#393939',
		colors: ['#738bd7']
	};
	const chart = new google.visualization.ColumnChart(document.getElementById('user-info-chart-area'));
	chart.draw(chartData, options);
	const textBlocks = document.getElementById('user-info-chart-area').querySelectorAll('text');
	for (const block of textBlocks) {
		block.setAttribute('fill', 'rgba(255,255,255,.7)');
	}
}

//#endregion

//#region Role Message List
var roleMessageListArea = undefined;
var roleMessageListTable = undefined;
var roleMessageListAreaLoading = undefined;
var roleList = undefined;
var seletedRoleId = '229598038438445056'; //Lydian Student role id

async function loadRoleList() {
	try {
		const res = await getJSON((`/api/v1/discord/roles/?serverId=${serverId}`));
		if (res.success) {
			roleListSuccess(res);
		} else {
			roleListFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		roleListFailure({ success: false, message: ex.message });
	}
}

function roleListSuccess(res) {
	roleList = res.results;
	loadFuncs['roleMesList']();
}

function roleListFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	genericErrorArea.innerHTML = "<span>" + message + "</span>";
	roleMessageListAreaLoading.innerHTML = "<span>Failed to load role list</span>";
}

async function loadRoleMessageList() {
	roleMessageListAreaLoading.innerHTML = "<span>Loading...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/message-count/list/?count=${counts['roleMesList']}&serverId=${serverId}&start=0&sort=${sortOrders['roleMesList']}\
		&isDesc=${isDesc['roleMesList']}${(filterInput['roleMesList'] ? (`&userFilter=${encodeURIComponent(filterInput['roleMesList'])}`) : '')}\
		&roleId=${seletedRoleId}&includeTotal=true`);
		if (res.success) {
			roleMesListSucccess(res);
		} else {
			roleMesListFailure(res);
		}
	}
	catch (ex) {
		console.log(ex);
		roleMesListFailure({ success: false, message: ex.message });
	}
}

function roleMesListSucccess(res) {
	roleMessageListAreaLoading.innerHTML = "";
	roleMessageListTable.innerHTML = buildMessageRoleList(res.results);
	loaded.roleMesList = true;
}

function roleMesListFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	roleMessageListAreaLoading.innerHTML = "<span>" + message + "</span>";
	loaded.roleMesList = true;
}

function buildMessageRoleList(data) {
	let html = '\
	<tr class="list-table-header-row">\
		<th class="list-table-header header-sortable" onclick="changeSort(\'roleMesList\', \'userName\')">User' + getSortArrow('roleMesList', 'userName') + '</th>\
		<th class="list-table-header">Rank</th>\
		<th class="list-table-header header-sortable" onclick="changeSort(\'roleMesList\', \'messageCount\')">Message Count' + getSortArrow('roleMesList', 'messageCount') + '</th>\
		<th class="list-table-header">Roles</th>\
	</tr>';
	for (const item of data) {
		html += '\
		<tr class="' + (item.isDeleted ? 'user-removed-row ' : '') + (item.isBanned ? 'user-banned-row' : '') + '">\
			<td class="list-table-cell cell-clickable"\
			onclick="loadUserInfo(\'' + item.userId + '\')">' + item.userName + '</td>\
			<td class="list-table-cell">' + item.rank + '</td>\
			<td class="list-table-cell">' + item.messageCount + '</td>\
			<td class="list-table-cell">' + item.role + '</td>\
		</tr>\
		';
	}
	html += '\
	<tr class="list-table-footer">\
		<td class="footer-left">\
			<span>Limit: </span>\
			<select id="role-message-list-limit-dd" onchange="changeLimit(\'roleMesList\', \'role-message-list-limit-dd\')">\
				<option value="10"' + (counts['roleMesList'] == 10 ? 'selected="selected"' : '') + '>10</option>\
				<option value="25"' + (counts['roleMesList'] == 25 ? 'selected="selected"' : '') + '>25</option>\
				<option value="50"' + (counts['roleMesList'] == 50 ? 'selected="selected"' : '') + '>50</option>\
			</select>\
			<select id="role-message-list-role-dd" onchange="changeSelectedRole()">';

	for (const item of roleList) {
		if (!item.isEveryone) {
			html += '<option style="color:' + item.roleColor + ' ;" value="' + item.roleId + '" ' + (seletedRoleId == item.roleId ? 'selected="selected"' : '') + '>' + item.roleName + '</option>';
		}
	}

	html += '</select>\
		</td>\
		<td class="footer-mid"></td>\
		<td class="footer-mid"></td>\
		<td class="footer-right">\
			<input id="role-message-list-limit-filter" placeholder="Filter by name" value="' + filterInput['roleMesList'] + '"/>\
			<button onclick="changeFilter(\'roleMesList\', \'role-message-list-limit-filter\')">Filter</button>\
		</td>\
	</tr>';
	return html;
}

function changeSelectedRole() {
	const dd = document.getElementById('role-message-list-role-dd');
	if (!dd) return;
	const id = dd.options[dd.selectedIndex].value;
	seletedRoleId = id;
	loadFuncs['roleMesList']();
}

//#endregion

//#region Emoji Count List
var emojiListArea = null;
var emojiListAreaLoading = null;
var emojiListTable = null;

async function loadEmojiList() {
	emojiListAreaLoading.innerHTML = "<span>Loading Emoji List...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/emoji-count/list/?count=${counts['emojiList']}&serverId=${serverId}&start=0&sort=${sortOrders['emojiList']}\
		&isDesc=${isDesc['emojiList']}${(filterInput['emojiList'] ? (`&nameFilter=${filterInput['emojiList']}`) : '')}\
		&includeTotal=true&userFilterId=${filterInput['emojiListId']}`);
		if (res.success) {
			emojiListSucccess(res);
		} else {
			emojiListFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		emojiListFailure({ success: false, message: ex.message });
	}
}

function emojiListSucccess(res) {
	emojiListAreaLoading.innerHTML = "";
	emojiListTable.innerHTML = buildEmojiList(res.results);
	loaded.emojiList = true;
}

function emojiListFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	emojiListAreaLoading.innerHTML = "<span>" + message + "</span>";
	loaded.emojiList = true;
}

function buildEmojiList(data) {
	let html = '\
	<tr class="list-table-header-row">\
		<th class="list-table-header"></th>\
		<th class="list-table-header header-sortable" onclick="changeSort(\'emojiList\', \'emojiName\')">Name' + getSortArrow('emojiList', 'emojiName') + '</th>\
		<th class="list-table-header">Rank</th>\
		<th class="list-table-header header-sortable" onclick="changeSort(\'emojiList\', \'emojiCount\')">Use Count' + getSortArrow('emojiList', 'emojiCount') + '</th>\
	</tr>';
	for (const item of data) {
		html += '\
		<tr>\
			<td class="list-table-cell"><img id="emoji-' + item.emojiId + '" onload="emojiOnLoad(\'' + item.emojiId + '\')" class="emoji-table-img '
			+ (item.emojiId == '' ? 'hide-if-total' : '') + '" src="' + item.emojiImg + '"/></td>\
			<td class="list-table-cell"\>' + item.emojiName + '</td>\
			<td class="list-table-cell">' + item.rank + '</td>\
			<td class="list-table-cell">' + item.useCount + '</td>\
		</tr>';
	}
	html += '\
	<tr class="list-table-footer">\
		<td class="footer-left">\
			<span>Limit: </span>\
			<select id="emoji-list-limit-dd" onchange="changeLimit(\'emojiList\', \'emoji-list-limit-dd\')">\
				<option value="10"' + (counts['emojiList'] == 10 ? 'selected="selected"' : '') + '>10</option>\
				<option value="25"' + (counts['emojiList'] == 25 ? 'selected="selected"' : '') + '>25</option>\
				<option value="50"' + (counts['emojiList'] == 50 ? 'selected="selected"' : '') + '>50</option>\
			</select>\
		</td>\
		<td class="footer-mid">\
			<div class="footer-container">\
				<input id="emoji-list-name-filter" placeholder="Filter by name" value="' + filterInput['emojiList'] + '"/>\
				<button onclick="changeFilter(\'emojiList\', \'emoji-list-name-filter\')">Filter</button>\
			</div>\
		</td>\
		<td class="footer-mid"></td>\
		<td class="footer-right">\
			<div class="footer-container">\
				<input id="emoji-list-id-filter" placeholder="Filter by UserID" value="' + filterInput['emojiListId'] + '"/>\
				<button onclick="changeFilter(\'emojiListId\', \'emoji-list-id-filter\')">Filter</button>\
			</div>\
		</td>\
	</tr>';
	return html;
}

async function emojiOnLoad(id) {
	const imageEl = document.getElementById('emoji-' + id);
	if (imageEl && imageEl.src && !imageEl.src.includes('.gif')) {
		try {
			const res = await fetch(imageEl.src.replace('.png', '.gif'), { method: 'HEAD' });
			if (res.ok) {
				imageEl.src = imageEl.src.replace('.png', '.gif');
			}
		} catch { }
	}
}
//#endregion

//#region Word Count List
var wordListArea = null;
var wordListAreaLoading = null;
var wordListTable = null;

async function loadWordList() {
	if (wordListLoad && wordListLoad.parentNode) {
		wordListLoad.parentNode.removeChild(wordListLoad);
	}
	wordListLoad = undefined;
	wordListAreaLoading.innerHTML = "<span>Loading...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/word-count/list/?count=${counts['wordList']}&serverId=${serverId}&start=0&sort=${sortOrders['wordList']}\
		&isDesc=${isDesc['wordList']}${(filterInput['wordList'] ? (`&wordFilter=${encodeURIComponent(filterInput['wordList'])}`) : '')}\
		${(filterInput['wordListFloor'] ? (`&lengthFloor=${filterInput['wordListFloor']}`) : '')}\
		&includeTotal=true&userFilterId=${filterInput['wordListId']}&englishOnly=${filterInput['wordListEnglish']}`);
		if (res.success) {
			wordListSucccess(res);
		} else {
			wordListFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		wordListFailure({ success: false, message: ex.message });
	}
}

function wordListSucccess(res) {
	wordListAreaLoading.innerHTML = "";
	wordListTable.innerHTML = buildWordList(res.results);
}

function wordListFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	wordListAreaLoading.innerHTML = "<span>" + message + "</span>";
}

function buildWordList(data) {
	let html = '\
	<tr class="list-table-header-row">\
		<th class="list-table-header header-sortable" onclick="changeSort(\'wordList\', \'word\')">Name' + getSortArrow('wordList', 'word') + '</th>\
		<th class="list-table-header">Rank</th>\
		<th class="list-table-header header-sortable" onclick="changeSort(\'wordList\', \'count\')">Use Count' + getSortArrow('wordList', 'count') + '</th>\
	</tr>';
	for (const item of data) {
		html += '\
		<tr>\
			<td class="list-table-cell"\>' + item.word + '</td>\
			<td class="list-table-cell">' + item.rank + '</td>\
			<td class="list-table-cell">' + item.useCount + '</td>\
		</tr>\
		';
	}
	html += '\
	<tr class="list-table-footer first-row">\
		<td class="footer-left">\
			<span>Limit: </span>\
			<select id="word-list-limit-dd" onchange="changeLimit(\'wordList\', \'word-list-limit-dd\')">\
				<option value="10"' + (counts['wordList'] == 10 ? 'selected="selected"' : '') + '>10</option>\
				<option value="25"' + (counts['wordList'] == 25 ? 'selected="selected"' : '') + '>25</option>\
				<option value="50"' + (counts['wordList'] == 50 ? 'selected="selected"' : '') + '>50</option>\
			</select>\
			<input id="word-list-english-filter" type="checkbox" value="' +
		filterInput['wordList'] + '" onclick="changeFilterCheck(\'wordListEnglish\', \'word-list-english-filter\')" ' +
		(filterInput['wordListEnglish'] == true ? ' checked' : '') + '/>\
			<span>English Only</span>\
		</td>\
		<td class="footer-mid">\
		</td>\
		<td class="footer-right">\
			<div class="footer-container">\
				<input id="word-list-name-filter" placeholder="Filter by word" value="' + filterInput['wordList'] + '"/>\
				<button onclick="changeFilter(\'wordList\', \'word-list-name-filter\')">Filter</button>\
			</div>\
		</td>\
	</tr>\
	<tr class="list-table-footer second-row">\
		<td class="footer-left">\
			<div class="footer-container">\
				<input id="word-list-floor-filter" placeholder="Word Min Length" value="' + filterInput['wordListFloor'] + '"/>\
				<button onclick="changeFilter(\'wordListFloor\', \'word-list-floor-filter\')">Filter</button>\
			</div>\
		</td>\
		<td class="footer-mid">\
		</td>\
		<td class="footer-right">\
			<div class="footer-container">\
				<input id="word-list-id-filter" placeholder="Filter by UserID" value="' + filterInput['wordListId'] + '"/>\
				<button onclick="changeFilter(\'wordListId\', \'word-list-id-filter\')">Filter</button>\
			</div>\
		</td>\
	</tr>';
	return html;
}
//#endregion

//#region stats
var serverStats = undefined;
var statsUserCount = undefined;
var statsUniqueUserCount = undefined;

function loadStats() {
	loadUserCountStats();
	loadUniqueUserStats();
}

function changeStatDateGroup(type, increase) {
	if (increase) {
		if (sortOrders[type] < 4) {
			sortOrders[type]++;
		} else {
			return;
		}
	} else {
		if (sortOrders[type] > 0) {
			sortOrders[type]--;
		} else {
			return;
		}
	}

	if (type === 'statUCnt') {
		document.getElementById('stat-u-cnt-down').disabled = false;
		document.getElementById('stat-u-cnt-up').disabled = false;
		if (sortOrders[type] === 0) {
			document.getElementById('stat-u-cnt-down').disabled = true;
		} else if (sortOrders[type] === 4) {
			document.getElementById('stat-u-cnt-up').disabled = true;
		}
		loadUserCountStats();
	} else if (type === 'statUnU') {
		document.getElementById('stat-un-u-down').disabled = false;
		document.getElementById('stat-un-u-up').disabled = false;
		if (sortOrders[type] === 0) {
			document.getElementById('stat-un-u-down').disabled = true;
		} else if (sortOrders[type] === 4) {
			document.getElementById('stat-un-u-up').disabled = true;
		}
		loadUniqueUserStats();
	}
}

async function loadUserCountStats() {
	let stDate = new Date();
	stDate = setDateForStat(stDate, 'statUCnt');
	document.getElementById("user-count-stat-loading").innerHTML = "<span>Loading Stats...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/stats/?serverId=${serverId}&type=0&startDate=${stDate.toISOString()}&dateGroup=${sortOrders['statUCnt']}`);
		if (res.success) {
			statUserCountSuccess(res);
		} else {
			statUserCountFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		statUserCountFailure({ success: false, message: ex.message });
	}
}

function statUserCountSuccess(res) {
	document.getElementById('user-count-stat-chart').innerHTML = "";
	buildStatValueChart(res.results, 'user-count-stat-chart', 'User Count', 'statUCnt');
	document.getElementById("user-count-stat-loading").innerHTML = getStringForDateGroup(sortOrders['statUCnt']);;
	loaded.statsUserCount = true;
}

function statUserCountFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	document.getElementById("user-count-stat-loading").innerHTML = "<span>" + message + "</span>";
	loaded.statsUserCount = true;
}

async function loadUniqueUserStats() {
	let stDate = new Date();
	stDate = setDateForStat(stDate, 'statUnU');
	document.getElementById("unique-user-stat-loading").innerHTML = "<span>Loading Stats...</span>";
	try {
		const res = await getJSON(`/api/v1/discord/stats/?serverId=${serverId}&type=1&startDate=${stDate.toISOString()}&dateGroup=${sortOrders['statUnU']}`);
		if (res.success) {
			statUniqueUserSuccess(res);
		} else {
			statUniqueUserFailure(res);
		}
	} catch (ex) {
		console.log(ex);
		statUniqueUserFailure({ success: false, message: ex.message });
	}
}

function statUniqueUserSuccess(res) {
	document.getElementById('unique-user-stat-chart').innerHTML = "";
	buildStatValueChart(res.results, 'unique-user-stat-chart', 'Unique Users', 'statUnU');
	document.getElementById("unique-user-stat-loading").innerHTML = getStringForDateGroup(sortOrders['statUnU']);
	loaded.statsUniqueUser = true;
}

function statUniqueUserFailure(res) {
	let message = undefined;
	if (!res.message) {
		message = "There was an error in handling an error.";
	} else {
		message = res.message;
	}
	if (!message) {
		message = "There was an error in handling an error.";
	}
	document.getElementById("unique-user-stat-loading").innerHTML = "<span>" + message + "</span>";
	loaded.statsUniqueUser = true;
}

function setDateForStat(date, type) {
	switch (sortOrders[type]) {
		case 0:
			date.setHours(date.getHours() - 24);
			break;
		case 1:
			date.setDate(date.getDate() - 12);
			break;
		case 2:
			date.setDate(date.getDate() - 56);
			break;
		case 3:
			date.setMonth(date.getMonth() - 6)
			break;
		case 4:
			date.setYear(date.getYear() - 6)
			break;
	}

	return date;
}

function getStringForDateGroup(group) {
	switch (group) {
		case 0:
			return "Hour";
		case 1:
			return "Day";
		case 2:
			return "Week";
		case 3:
			return "Month";
		case 4:
			return "Year";
	}
}

function buildStatValueChart(data, elementId, valueTitle, type) {
	const chartData = new google.visualization.DataTable();
	chartData.addColumn('string', 'Date');
	chartData.addColumn('number', valueTitle);
	let rowsToAdd = [];
	for (const item of data) {
		const date = getStatDateFormat(item.date, type);
		rowsToAdd.push([date, item.statValue]);
	}
	chartData.addRows(rowsToAdd);

	const options = {
		title: '',
		width: statsUniqueUserCount.offsetWidth - 10,
		height: 300,
		vAxis: { format: 'decimal', gridlines: { color: '#818181' }, baselineColor: '#818181' },
		hAxis: {},
		legend: 'none',
		backgroundColor: '#393939',
		colors: ['#738bd7']
	};
	const chart = new google.visualization.LineChart(document.getElementById(elementId));
	chart.draw(chartData, options);

	const textBlocks = document.getElementById(`${elementId}`).querySelectorAll('text');
	for (const block of textBlocks) {
		block.setAttribute('fill', 'rgba(255,255,255,.7)');
	}
}

function getStatDateFormat(date, type) {
	let ret = "";
	switch (sortOrders[type]) {
		case 0:
			ret = moment(date).format('Do, hh A');
			break;
		case 1:
			ret = moment(date).format('MMM, Do');
			break;
		case 2:
			ret = "Week " + moment(date).format('ww');
			break;
		case 3:
			ret = moment(date).format('YYYY, MMM');
			break;
		case 4:
			ret = moment(date).format('YYYY');
			break;
	}

	return ret;
}
//#endregion

function changeLimit(tableType, id) {
	const dd = document.getElementById(id);
	if (!dd) return;
	const limit = parseInt(dd.options[dd.selectedIndex].value);
	if (limit > 100) { limit = 100; }
	if (limit < 0) { limit = 1; }
	counts[tableType] = limit;
	loadFuncs[tableType]();
}

function changeFilter(tableType, id) {
	const input = document.getElementById(id);
	if (!input) return;
	filterInput[tableType] = input.value;
	loadFuncs[tableType]();
}

function changeFilterCheck(tableType, id) {
	const input = document.getElementById(id);
	if (!input) return;
	filterInput[tableType] = input.checked;
	loadFuncs[tableType]();
}

function changeSort(tableType, field) {
	if (sortOrders[tableType] == field) {
		isDesc[tableType] = !isDesc[tableType];
	} else {
		sortOrders[tableType] = field;
	}
	loadFuncs[tableType]();
}

function getSortArrow(tableType, field) {
	if (sortOrders[tableType] == field) {
		if (isDesc[tableType]) {
			return ' ▼';
		} else {
			return ' ▲';
		}
	}
	return '';
}

window.onload = function () {
	const sidMeta = document.querySelector("meta[name='serverid']");
	if (sidMeta) {
		serverId = sidMeta.getAttribute("content");
	}
	const roleMeta = document.querySelector("meta[name='defaultroledid']");
	if (roleMeta) {
		seletedRoleId = roleMeta.getAttribute("content");
	}

	google.charts.load('current', { 'packages': ['corechart'] });
	google.charts.setOnLoadCallback(onGoogleLoaded);
	genericErrorArea = document.getElementById('generic-error');
	messageListArea = document.getElementById('message-table-area');
	messageListAreaLoading = document.getElementById('message-table-loading');
	messageListTable = document.getElementById('message-list-table');
	userInfoArea = document.getElementById('user-info');
	userTableArea = document.getElementById('user-info-table-area');
	roleMessageListArea = document.getElementById('role-message-table-area');
	roleMessageListTable = document.getElementById('role-message-list-table');
	roleMessageListAreaLoading = document.getElementById('role-message-table-loading');
	emojiListArea = document.getElementById('emoji-table-area');
	emojiListAreaLoading = document.getElementById('emoji-table-loading');
	emojiListTable = document.getElementById('emoji-list-table');
	wordListArea = document.getElementById('word-table-area');
	wordListAreaLoading = document.getElementById('word-table-loading');
	wordListTable = document.getElementById('word-list-table');
	wordListLoad = document.getElementById('word-counts-load');
	serverStats = document.getElementById('server-stats');
	statsUserCount = document.getElementById('user-count-stat');
	statsUniqueUserCount = document.getElementById('unique-user-stat');
	loadFuncs['messageList']();
	loadFuncs['emojiList']();
	loadRoleList();
	setTimeout(checkLoaded, 100);

	function onGoogleLoaded() {
		loadFuncs['stats']();
	}

	function checkLoaded() {
		if (loaded.messageList && loaded.roleMesList) {
			document.getElementById('fade-parent').style.opacity = "1";
			document.getElementById('loading-parent').style.display = "none";
		} else {
			setTimeout(checkLoaded, 100);
		}
	}
}