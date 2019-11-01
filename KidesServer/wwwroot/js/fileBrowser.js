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

let userInfo = {
    username: '',
    lastLoginUtc: new Date(),
    lastPasswordChangedUtc: new Date()
};

let modalElement = undefined;
let clickCatchElement = undefined;
let modalCallback = undefined;
let modalCallbackData = undefined;

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
    modalElement = document.getElementById("modal-container");
    clickCatchElement = document.getElementById("click-catcher");
}

async function loadBrowser() {
    const load = [loadDirectory("\\"), loadUserInfo()];
    await Promise.all(load);
    setPageInfo();
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

async function loadUserInfo() {
    try {
        const res = await fetch(`api/v1/account/user-info`, {
            method: 'GET',
            cache: 'no-cache'
        });
        const json = await res.json();
        if (res.ok && json.success) {
            userInfo = {
                username: json.username,
                lastLoginUtc: moment(json.lastLoginUtc),
                lastPasswordChangedUtc: moment(json.lastPasswordChangedUtc)
            };
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }
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

async function getFileInfo(filename, path) {
    try {
        browserListingError = "";

        const res = await fetch(`api/v1/files/get-file-info/${filename}?directory=${path.replace('/', '\\')}`, {
            method: 'GET',
            cache: 'no-cache'
        });
        const json = await res.json();

        if (res.ok && json.success) {
            parseFileInfoResponse(filename, path, json);
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

function parseFileInfoResponse(filename, path, json) {
    selectedFileInfo = {
        path: json.path.replace(/^\\{0,}/, ""),
        name: json.name,
        fileSizeBytes: json.sizeInBytes,
        isDirectory: false,
        createdUtc: moment(json.createdUtc),
        lastModifiedUtc: moment(json.lastModifiedUtc)
    }
}

function buildSelectedFileInfo() {
    if (!selectedFileInfo || !selectedFileInfo.name) {
        selectedFileInfoHtml = "<div></div>";
        return;
    }

    selectedFileInfoHtml = `<div class="file-browser-selected-file-info-info">`;

    selectedFileInfoHtml += buildSelectedFileInfoItem("Path", selectedFileInfo.path);
    selectedFileInfoHtml += buildSelectedFileInfoItem("Name", selectedFileInfo.name);
    selectedFileInfoHtml += buildSelectedFileInfoItem("File Size", `${fileSizeBytesToFriendlyString(selectedFileInfo.fileSizeBytes)}`, `${selectedFileInfo.fileSizeBytes} (B)`);
    selectedFileInfoHtml += buildSelectedFileInfoItem("Created Time", selectedFileInfo.createdUtc.format('MMM Do YYYY, h:mm a'));
    selectedFileInfoHtml += buildSelectedFileInfoItem("Last Modified", selectedFileInfo.lastModifiedUtc.format('MMM Do YYYY, h:mm a'));

    //onclick="downloadFile(event, '${selectedFileInfo.name}', '${selectedFileInfo.path}')"

    if (!selectedFileInfo.isDirectory) {
        selectedFileInfoHtml += `
<div class="selected-file-info-item">
    <a class="selected-file-info-download selected-file-info-button" href="api/v1/files/get-file/${selectedFileInfo.name}?directory=${selectedFileInfo.path.replace(selectedFileInfo.name, "")}" download>
        <button>download</button>
    </a>
</div>`;
    }

    selectedFileInfoHtml += `
<div class="selected-file-info-item">
    <button class="selected-file-info-button" onClick=onDeleteFileClicked(event)>delete</button>
</div>
`;

    selectedFileInfoHtml += '</div>';
}

function buildSelectedFileInfoItem(key, value, title) {
    if (!title) {
        title = value;
    }
    return `
    <div class="selected-file-info-item">
        <div class="selected-file-info-item-title">
            ${key}:
        </div>
        <div class="selected-file-info-item-data" title="${title}">
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
        const split = path.split("\\");
        getFileInfo(_.last(split), _.initial(split).join("\\")); 
    }
}

function onDeleteFileClicked(ev) {
    if (!selectedFileInfo.path || selectedFileInfo.path == "\\")
        return;

    const html = `
<div class="modal confirm-modal">
    <div style="max-height: 500px;">Are you sure you want to delete the ${selectedFileInfo.isDirectory ? 'directory' : 'file'} "${selectedFileInfo.path}"?</div>
    <div id="modal-buttons">
		<button onclick="closeModal(event, false)">Cancel</button>
		<button onclick="closeModal(event, true)">Delete</button>
	</div>
</div>`;

    openModal(html, deleteFileConfirm);
}

function deleteFileConfirm(ev) {
    if (selectedFileInfo.isDirectory) {
        deleteFolder();
    } else {
        deleteFile();
    }
}

async function deleteFile() {
    try {
        const path = selectedFileInfo.path;
        const name = selectedFileInfo.name;
        let parent = _.initial(path.split("\\")).join("\\");
        if (parent === "") { parent = "\\" }

        const res = await fetch(`api/v1/files/delete-file/${name}?directory=${parent.replace('/', '\\')}`, {
            method: 'DELETE',
            cache: 'no-cache'
        });
        const json = await res.json();

        if (res.ok && json.success) {
            const index = _.findIndex(browserListingDirectories[parent].files, (x) => { return x.name === name });
            browserListingDirectories[parent].files.splice(index, 1);

            selectedFileInfo = {
                path: '',
                name: '',
                fileSizeBytes: 0,
                isDirectory: false,
                createdUtc: new Date(),
                lastModifiedUtc: new Date()
            };
            buildDirectoryListing();
            buildSelectedFileInfo();
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }

    setPageInfo();
}

async function deleteFolder() {
    try {
        const path = selectedFileInfo.path;
        const name = selectedFileInfo.name;
        let parent = _.initial(path.split("\\")).join("\\");
        if (parent === "") { parent = "\\" }

        const res = await fetch(`api/v1/files/delete-directory?directory=${path.replace('/', '\\')}`, {
            method: 'DELETE',
            cache: 'no-cache'
        });
        const json = await res.json();

        if (res.ok && json.success) {
            delete browserListingDirectories[path];
            browserListingDirectories[parent].children = _.without(browserListingDirectories[parent].children, name);
            const index = _.findIndex(browserListingDirectories[parent].directories, (x) => { return x.path === path });
            browserListingDirectories[parent].directories.splice(index, 1);

            selectedFileInfo = {
                path: '',
                name: '',
                fileSizeBytes: 0,
                isDirectory: false,
                createdUtc: new Date(),
                lastModifiedUtc: new Date()
            };
            buildDirectoryListing();
            buildSelectedFileInfo();
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }

    setPageInfo();
}

function userSettingClick(ev) {
    ev.preventDefault();
    let html = `
<div class="modal user-info-modal">
    <div>
        <div style="text-align: center;">User Info:</div>
        <div>Username: ${userInfo.username}</div>
        <div>Last login: ${userInfo.lastLoginUtc.format('MMM Do YYYY, h:mm a')}</div>
        <div>Last password change: ${userInfo.lastPasswordChangedUtc.format('MMM Do YYYY, h:mm a')}</div>
    </div>
    <div id="modal-buttons">
		<button onclick="closeModal(event, false)">Close</button>
        <div>
            <button onclick="closeModal(event, true, 'changepass')">Change Password</button>
            <button onclick="closeModal(event, true, 'signout')">Sign Out</button>
        </div>
	</div>
</div>`;
    openModal(html, userSettingOptionClick);
}

function userSettingOptionClick(ev, data) {
    switch (data) {
        case 'changepass':
            setTimeout(() => {
                openChangePasswordModal(ev);
            });
            break;
        case 'signout':
            signOut();
            break;
    }
}

function openChangePasswordModal(ev) {
    let html = `
<div class="modal change-password-modal">
    <div class="change-password-inputs">
        <input type="password" id="change-current-password" onblur="onChangePasswordFieldChange(event)" oninput="onChangePasswordFieldChange(event)" placeholder="Current Password"/>
        <input type="password" id="change-new-password" onblur="onChangePasswordFieldChange(event)" oninput="onChangePasswordFieldChange(event)" placeholder="New Password"/>
        <input type="password" id="change-confirm-password" onblur="onChangePasswordFieldChange(event)" oninput="onChangePasswordFieldChange(event)" placeholder="Confirm Password"/>
    </div>
    <div id="modal-buttons">
		<button onclick="closeModal(event, false)">Cancel</button>
        <button id="change-confirm-button" onclick="closeChangePasswordModal(event)" disabled>Confirm</button>
	</div>
</div>`;
    openModal(html);
}

function onChangePasswordFieldChange(ev) {
    const current = document.getElementById("change-current-password");
    const newp = document.getElementById("change-new-password");
    const confirm = document.getElementById("change-confirm-password");
    const button = document.getElementById("change-confirm-button");

    if (!current.value || !newp.value || !confirm.value) {
        button.setAttribute("disabled", "true");
        return;
    }

    if (newp.value !== confirm.value || current.value === newp.value) {
        button.setAttribute("disabled", "true");
        return;
    }

    button.removeAttribute("disabled");
}

function closeChangePasswordModal(ev) {
    let passwordData = {
        currentPassword: "",
        newPassword: ""
    };

    const current = document.getElementById("change-current-password");
    const newp = document.getElementById("change-new-password");
    const confirm = document.getElementById("change-confirm-password");
    if (!current.value || !newp.value || !confirm.value) {
        return;
    }

    if (newp.value !== confirm.value || current.value === newp.value) {
        return;
    }

    passwordData.currentPassword = current.value;
    passwordData.newPassword = newp.value;

    changePassword(ev, passwordData);
}

async function changePassword(ev, data) {
    browserListingError = "";
    try {
        const res = await fetch("api/v1/account/change-password", {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        if (res.ok && json.success) {
            closeModal(ev, false);
        } else {
            browserListingError = `An api error has occured: ${json.message}`;
        }
    } catch (ex) {
        browserListingError = `A exception has occured: ${ex.message}`;
    }

    setPageInfo();
}

async function signOut() {
    const res = await fetch("api/v1/account/logout", {
        method: 'POST',
        cache: 'no-cache'
    });

    location.reload();
}

function openModal(html, callback, data) {
    modalCallback = callback;
    modalCallbackData = data;
    modalElement.innerHTML = html;
    clickCatchElement.style.cssText = 'display: flex;';
    modalElement.style.cssText = 'display: flex;';
}

function closeModal(ev, result, data) {
    ev.preventDefault();
    if (result && modalCallback && typeof (modalCallback) === "function") {
        if (data) {
            modalCallbackData = data;
        }
        modalCallback(ev, modalCallbackData);
    }

    modalCallback = undefined;
    modalCallbackData = undefined;

    clickCatchElement.style.cssText = 'display: none;';
    modalElement.style.cssText = 'display: none;';
    modalElement.innerHTML = '';
}

//endregion Browser

function fileSizeBytesToFriendlyString(bytes) {
    if (bytes < 5120) {
        return `${bytes} (B)`;
    } else if (bytes < 5242880) {
        return `${(bytes / 1024).toFixed(2)} (KiB)`;
    } else if (bytes < 1073741824) {
        return `${(bytes / 1024 / 1024).toFixed(2)} (MiB)`;
    } else {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} (GiB)`;
    }
}
