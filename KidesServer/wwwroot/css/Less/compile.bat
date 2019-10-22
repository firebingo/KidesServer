@echo off
call lessc --clean-css generic.less generic.min.css
call lessc --clean-css music.less music.min.css
call lessc --clean-css wotMaps.less wotMaps.min.css
call lessc --clean-css sgDiscord.less sgDiscord.min.css
call lessc --clean-css fileBrowser.less fileBrowser.min.css