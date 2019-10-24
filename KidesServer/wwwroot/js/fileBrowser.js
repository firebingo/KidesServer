'use strict';

//region Login

function onLoginBodyLoaded() {
    document.getElementById("loading-parent").style.cssText = "opacity: 0; pointer-events: none;";
    document.getElementById("fade-parent").style.cssText = "opacity: 1;";
}

function onLoginFormSubmit(ev) {
    ev.preventDefault();
    const data = {
        username: '',
        password: '',
        rememberMe: false
    };
    data.username = document.getElementById("login-username").value;
    data.password = document.getElementById("login-password").value;
    data.rememberMe = document.getElementById("login-remember").checked;
    login(data);
}

async function login(loginInfo) {
    const res = await fetch("api/v1/account/login", {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
    });
    if (!res.ok) {
        document.getElementById("login-error").style.cssText = "display: block; margin-top: 5px;";
    } else {
        location.reload();
    }
}

//endregion Login

//region Browser

let currentDirectory = "\\";
let currentDirectoryElement = undefined;
let currentDirectoryInputElement = undefined;
let browserListingHtml = "<div></div>";
let browserListingElement = undefined;
let browserListingErrorElement = undefined;
let browserListingError = "";
let browserListingDirectories = {
    "\\": {
        children: [],
        directories: [],
        files: [],
        isOpen: true,
        path: "\\"
    }
};

let selectedFileInfoHtml = "<div></div>";
let selectedFileInfoElement = undefined;
let selectedFileInfo = {
    path: '',
    name: '',
    fileSizeBytes: 0,
    isDirectory: false,
    createdUtc: new Date(),
    lastModifiedUtc: new Date()
};

function onBrowserBodyLoaded() {
    getBodyElements();
    loadBrowser();
}

function getBodyElements() {
    currentDirectoryElement = document.getElementById("file-browser-current-directory");
    currentDirectoryInputElement = document.getElementById("file-browser-current-directory-input");
    browserListingElement = document.getElementById("file-browser-listing");
    browserListingErrorElement = document.getElementById("file-browser-error");
    selectedFileInfoElement = document.getElementById("file-browser-selected-file-info");
}

async function loadBrowser() {
    await loadDirectory("\\");
    document.getElementById("loading-parent").style.cssText = "opacity: 0; pointer-events: none;";
    document.getElementById("fade-parent").style.cssText = "opacity: 1;";
}

async function loadDirectory(path) {
    try {
        browserListingError = "";
        const res = await fetch(`api/v1/files/list-directory?directory=${path.replace('/', '\\')}`, {
            method: 'GET',
            cache: 'no-cache'
        });
        const json = await res.json();

        if (res.ok && json.success) {
            parseDirectoryResponse(path, json);
            buildDirectoryListing();
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }

    setPageInfo();
}

async function getDirectoryInfo(path) {
    try {
        browserListingError = "";
        const res = await fetch(`api/v1/files/get-directory-info?directory=${path.replace('/', '\\')}`, {
            method: 'GET',
            cache: 'no-cache'
        });
        const json = await res.json();

        if (res.ok && json.success) {
            parseDirectoryInfoResponse(path, json);
            buildSelectedFileInfo();
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }

    setPageInfo();
}

function parseDirectoryResponse(path, json) {
    browserListingDirectories[path] = {
        ...browserListingDirectories[path],
        children: [],
        directories: [],
        files: [],
    };
    for (const dir of json.directories) {
        const dirpath = `${dir}`
        const dirInfo = {
            parent: path,
            path: dirpath,
            name: dir.replace(`${path}\\`, ""),
            isDirectory: true,
            fileType: ''
        };
        browserListingDirectories[path].children.push(dirpath);
        browserListingDirectories[path].directories.push(dirInfo);
        if (!browserListingDirectories[dirpath]) {
            browserListingDirectories[dirpath] = {
                children: [],
                directories: [],
                files: [],
                isOpen: false,
                path: dirpath
            };
        }
    }

    for (const file of json.files) {
        const fileInfo = {
            parent: path,
            path: (`${path}\\${file}`),
            name: file,
            isDirectory: false,
            fileType: ''
        };
        browserListingDirectories[path].files.push(fileInfo);
    }
}

function buildDirectoryListing() {
    let htmlContent = '<ul class="file-browser-root">';
    htmlContent += `
<li>
    <div class="file-browser-item">
        <img class="file-browser-icon" src="images/folder_open.svg"/>
        <span class="file-browser-name">\\</span>
    </div>`;
    const root = browserListingDirectories["\\"];
    htmlContent += buildDirectoryListingChildren(root);

    htmlContent += "</li></ul>";
    browserListingHtml = htmlContent;
}

function buildDirectoryListingChildren(directory) {
    let htmlContent = "<ul>";

    for (const dir of directory.directories) {
        const image = browserListingDirectories[dir.path].isOpen ? "images/folder_open.svg" : "images/folder.svg";
        htmlContent += `
<li>
    <div class="file-browser-item${(selectedFileInfo.path == dir.path ? 'selected' : '')}">
        <img class="file-browser-icon file-browser-icon-folder" src="${image}" onclick="onFolderIconClicked(event)"/>
        <span class="file-browser-name" value="${dir.path}" onclick="onItemNameClicked(event)">${dir.name}</span>
    </div>
</li>`;
        if (browserListingDirectories[dir.path].isOpen) {
            const childDir = browserListingDirectories[dir.path];
            if (childDir && childDir.isOpen) {
                htmlContent += buildDirectoryListingChildren(childDir);
            }
        }
    }

    for (const file of directory.files) {
        const image = "images/file.svg";
        htmlContent += `
<li>
    <div class="file-browser-item">
        <img class="file-browser-icon file-browser-icon-file" src="${image}"/>
        <span class="file-browser-name" value="${directory.path}\\${file.name}" onclick="onItemNameClicked(event)">${file.name}</span>
    </div>
</li>`;
    }

    htmlContent += "</ul>"
    return htmlContent;
}

function parseDirectoryInfoResponse(path, json) {
    selectedFileInfo = {
        path: json.path,
        name: json.name,
        fileSizeBytes: json.sizeInBytes,
        isDirectory: true,
        createdUtc: moment(json.createdUtc),
        lastModifiedUtc: moment(json.lastModifiedUtc)
    };
}

function buildSelectedFileInfo() {
    if (!selectedFileInfo || !selectedFileInfo.name) {
        selectedFileInfoHtml = "<div></div>";
        return;
    }

    selectedFileInfoHtml = `<div class="file-browser-selected-file-info-info">`;

    selectedFileInfoHtml += buildSelectedFileInfoItem("path", selectedFileInfo.path);
    selectedFileInfoHtml += buildSelectedFileInfoItem("name", selectedFileInfo.name);
    selectedFileInfoHtml += buildSelectedFileInfoItem("file size (KiB)", selectedFileInfo.fileSizeBytes / 1024);

    selectedFileInfoHtml += '</div>';
}

function buildSelectedFileInfoItem(key, value) {
    return `
    <div class="selected-file-info-item">
        <div class="selected-file-info-item-title">
            ${key}:
        </div>
        <div class="selected-file-info-item-data" title="${value}">
            ${value}
        </div>
    </div>
`;
}

function setPageInfo() {
    currentDirectoryInputElement.value = `${currentDirectory}`;
    browserListingElement.innerHTML = browserListingHtml;
    browserListingErrorElement.innerHTML = `<div>${browserListingError}</div>`
    selectedFileInfoElement.innerHTML = selectedFileInfoHtml;
}

function onFolderIconClicked(ev) {
    ev.preventDefault();
    const nameChild = _.find(ev.target.parentNode.children, (child) => {
        return child.classList.contains("file-browser-name");
    });
    const path = nameChild.attributes["value"].value;
    browserListingDirectories[path].isOpen = !browserListingDirectories[path].isOpen;
    if (browserListingDirectories[path].isOpen) {
        loadDirectory(path);
    } else {
        buildDirectoryListing();
        setPageInfo();
    }
}

function onItemNameClicked(ev) {
    ev.preventDefault();
    const path = ev.target.attributes["value"].value;
    const directory = browserListingDirectories[path];
    if (directory) {
        getDirectoryInfo(path);
    } else {

    }
}

//endregion Browser