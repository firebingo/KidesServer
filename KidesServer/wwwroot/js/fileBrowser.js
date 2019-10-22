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

let currentDirectory = "/";
let currentDirectoryElement = undefined;
let currentDirectoryInputElement = undefined;
let browserListingHtml = "<div></div>";
let browserListingElement = undefined;
let browserListingDirectories = {
    "/": {
        children: [],
        directories: [],
        files: [],
        isOpen: true
    }
};

function onBrowserBodyLoaded() {
    getBodyElements();
    loadBrowser();
}

function getBodyElements() {
    currentDirectoryElement = document.getElementById("file-browser-current-directory");
    currentDirectoryInputElement = document.getElementById("file-browser-current-directory-input");
    browserListingElement = document.getElementById("file-browser-listing");
}

async function loadBrowser() {
    await loadDirectory("/");
    document.getElementById("loading-parent").style.cssText = "opacity: 0; pointer-events: none;";
    document.getElementById("fade-parent").style.cssText = "opacity: 1;";
}

async function loadDirectory(path) {
    const res = await fetch(`api/v1/files/list-directory?directory=${path.replace('/', '\\')}`, {
        method: 'GET',
        cache: 'no-cache'
    });
    if (res.ok) {
        const json = await res.json();
        parseDirectoryResponse(path, json);
        buildDirectoryListing();
        setPageInfo();
    }
}

function parseDirectoryResponse(path, json) {
    browserListingDirectories[path] = {
        children: [],
        directories: [],
        files: [],
        isOpen: true
    };
    for (const dir of json.directories) {
        const dirpath = `${path}${dir}`
        const dirInfo = {
            parent: path,
            path: dirpath,
            name: dir,
            isDirectory: true,
            fileType: ''
        };
        browserListingDirectories[path].children.push(dirpath);
        browserListingDirectories[path].directories.push(dirInfo);
        browserListingDirectories[dirpath] = {
            children: [],
            directories: [],
            files: [],
            isOpen: false
        };
    }

    for (const file of json.files) {
        const fileInfo = {
            parent: path,
            path: `${path}${file}`,
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
        <span class="file-browser-name">/</span>
    </div>`;
    const root = browserListingDirectories["/"];
    htmlContent += buildDirectoryListingChildren(root);

    htmlContent += "</li></ul>";
    browserListingHtml = htmlContent;
}

function buildDirectoryListingChildren(directory) {
    let htmlContent = "<ul>";

    for (const dir of directory.directories) {
        const image = dir.isOpen ? "images/folder_open.svg" : "images/folder.svg";
        htmlContent += `
<li>
    <div class="file-browser-item">
        <img class="file-browser-icon" src="${image}" onclick="onFolderIconClicked(event)"/>
        <span class="file-browser-name" value="${dir.path}">${dir.name}</span>
    </div>`;
    }

    for (const file of directory.files) {
        const image = "images/file.svg";
        htmlContent += `
<li>
    <div class="file-browser-item">
        <img class="file-browser-icon" src="${image}"/>
        <span class="file-browser-name">${file.name}</span>
    </div>`;
    }

    if (directory.isOpen) {
        for (const child of directory.children) {
            const childDir = browserListingDirectories[child];
            if (childDir && childDir.isOpen) {
                htmlContent += buildDirectoryListingChildren(childDir);
            }
        }
    }

    htmlContent += "</li></ul>"
    return htmlContent;
}

function setPageInfo() {
    currentDirectoryInputElement.value = `${currentDirectory}`;
    browserListingElement.innerHTML = browserListingHtml;
}

function onFolderIconClicked(ev) {
    ev.preventDefault();
    const nameChild = _.find(ev.target.parentNode.children, (child) => {
        return child.classList.contains("file-browser-name");
        debugger;
    });
    const path = nameChild.attributes["value"].value;
    loadDirectory(path);
}

//endregion Browser