var songList = undefined;
var albumList = undefined;
var songStats = undefined;
var baseUrl = window.location.href.split('/');
baseUrl.length = 3;
baseUrl = baseUrl.join('/');
var baseSongUrl = "https://server.icebingo.io"
var songListArea = document.getElementById("song-list-area");
var songCountArea = document.getElementById("song-count-area");
var songStatArea = document.getElementById("song-stats-area");
var songStatPlaceholder = document.getElementById("song-stats-placeholder");
var songInfoArea = document.getElementById("song-info-area");

function getJSON(url, callback, errorCallback, data) {
	$.ajax({
		dataType : "json",
		url : url,
		data : data,
		success : callback,
		error : errorCallback
	});
};

function buildSongList() {
	songCountArea = songCountArea ? songCountArea : document.getElementById("song-count-area");
	songListArea = songListArea ? songListArea : document.getElementById("song-list-area");
	songInfoArea = songInfoArea ? songInfoArea : document.getElementById("song-info-area");
	if(songCountArea) {
		var element = document.createElement('div');
		element.id = 'song-counts';
		var songCountTemplate = '\
		<span>Album Count: ' + albumList.length + '</span>\
		<span>Song Count: ' + songList.length + '</span>';
		element.innerHTML = songCountTemplate;
		songCountArea.appendChild(element);
	}
	if(songListArea) {
		var element = document.createElement('div');
		element.id = 'song-list';
		var songListTemplate = '';
		for (var i = 0; i < albumList.length; ++i) {
			songListTemplate += '\
				<div class="list-entry">\
				<div class="album-entry">\
					<span class="song-album">' + albumList[i] + '</span>\
				</div>\
			';
			for (var j = 0; j < songList.length; ++j) {
				if (songList[j].Album === albumList[i]) {
					songListTemplate += '\
						<div class="song-entry">\
							<span>Roman: ' + songList[j].Roman + '</span>\
							<span>English: ' + songList[j].English + '</span>\
							<span>Japanese: ' + songList[j].Japanese + '</span>\
							<span>Artist: ' + songList[j].Artist + '</span>\
							<span>URL: ' + baseSongUrl + '/Music/' + songList[j].Directory + '/' + songList[j].Url + '</span>\
						</div>\
						';
				}
			}
			songListTemplate += '</div>'
		}
		element.innerHTML = songListTemplate;
		songListArea.appendChild(element);
		$(songInfoArea).css('opacity', 1);
	}
};
//<span>Kana: ' + songList[j].Hiragana + '</span>\

buildSongStats = function() {
	songStatArea = songStatArea ? songStatArea : document.getElementById("song-stats-area");
	songStatPlaceholder = songStatPlaceholder ? songStatPlaceholder : document.getElementById("song-stats-placeholder");
	if(songStatArea) {
		var element = document.createElement('div');
		element.id = 'song-stats';
		var songStatTemplate = 
		'<table class="song-stat-table">\
			<tbody>';
		for(var i = 0; i < songStats.length; ++i) {
			songStatTemplate += 
				'<tr>\
					<td class="stat-left-cell">' + songStats[i].title + '</td>\
					<td>' + songStats[i].value + '</td>\
				</tr>'
		}
		songStatTemplate +=
			'</tbody>\
		</table>'
		element.innerHTML = songStatTemplate;
		songStatPlaceholder.innerHTML = "";
		songStatArea.appendChild(element);
		$(songStatArea).css('opacity', 1);
	}
};

function setSongList(resp) {
	songList = resp.songList;
	albumList = resp.albumList;
	buildSongList();
};
function songListFailure(resp) {};

function setSongStats(resp) {
	tempSongStats = resp.songCounts;
	songStats = [];
	var keys = Object.keys(tempSongStats);
	for(var i = 0; i < keys.length; ++i) {
		songStats.push({title: keys[i], value: tempSongStats[keys[i]]});
	}
	songStats.sort(function(a, b) { 
		if(a.value < b.value)
			return 1;
		if(a.value > b.value)
			return -1;
		return 0;
	});
	buildSongStats();
};
function songStatsFailure(resp) {};

getJSON(baseUrl + "/Js/SongList.min.json", setSongList, songListFailure, '');
getJSON("https://server.icebingo.io:25563/api/v1/song-stats", setSongStats, songStatsFailure, '');