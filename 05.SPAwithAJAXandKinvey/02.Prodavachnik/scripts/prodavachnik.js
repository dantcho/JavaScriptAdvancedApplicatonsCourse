const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_H1cMuD6Gg";
const kinveyAppSecret =
    "38b89d3b988b4b29b2487e8e38950bbc";
const kinveyAppAuthHeaders = {
    'Authorization': "Basic " +
    btoa(kinveyAppKey + ":" + kinveyAppSecret),
};

function startApp() {
    sessionStorage.clear(); // Clear user auth data
    $('#linkHome').click(function () {
        showView('viewHome')
    });
    $('#linkLogin').click(function () {
        showView('viewLogin')
    });
    $('#linkRegister').click(function () {
        showView('viewRegister')
    });
    $('#linkListAds').click(listAds);
    $('#linkCreateAd').click(function () {
        showView('viewCreateAd')
    });
    $('#linkLogout').click(logoutUser);
    $('#buttonLoginUser').click(loginUser);
    $('#buttonRegisterUser').click(registerUser);
    $('#buttonCreateAd').click(createAd);
    $('#buttonEditAd').click(editAd);

    $('#linkEditAd').click(function () {
        showView('viewEditAd')
    });

    $("#infoBox, #errorBox").click(function () {
        $(this).fadeOut();
    });
    $(document).on({
        ajaxStart: function () {
            $("#loadingBox").fadeIn()
        },
        ajaxStop: function () {
            $("#loadingBox").fadeOut()
        }
    });
    showHideMenuLinks();
    showView('viewLogin');
}

function showView(viewName) {
    // Hide all views and show the selected view only
    $('main > section').hide();
    $('#' + viewName).show();
}
function showHideMenuLinks() {
    $("#linkHome").show();
    if (sessionStorage.getItem('authToken')) {
        // We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListAds").show();
        $("#linkCreateAd").show();
        $("#linkLogout").show();
    } else {
        // No logged in user
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListAds").hide();
        $("#linkCreateAd").hide();
        $("#linkLogout").hide();
    }
}

function registerUser(ev) {
    let form = $('#formRegister');
    let user = form[0][0].value;
    let password = form[0][1].value;
    let userData = {
        username: user,
        password: password
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError
    });
    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showInfo('User registration successful.');
        showView('viewHome');
    }
}
function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
    sessionStorage.setItem('username', username);
    $('#loggedInUser').text(
        "Welcome, " + username + "!");
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON &&
        response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}

function showInfo(message) {
    $('#infoBox').text(message);
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000);
}

function showError(errorMsg) {
    $('#errorBox').text("Error: " + errorMsg);
    $('#errorBox').show();
}
function loginUser() {

    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=passwd]').val()
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: loginSuccess,
        error: handleAjaxError
    });
    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        showHideMenuLinks();
        showInfo('Login successful.');
        showView('viewHome');
    }

}

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');
}

function listAds() {
    $('#ads').empty();
    showView('viewAds');
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/ads",
        headers: getKinveyUserAuthHeaders(),
        success: loadAdSuccess,
        error: handleAjaxError
    });
    function loadAdSuccess(ads) {
        showInfo('Ads loaded.');
        if (ads.length == 0) {
            $('#ads').text('No add in.');
        } else {
            let adsTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th><th>Description</th>',
                    '<th>Publisher</th><th>Date of Publishing</th><th>Price</th><th>Action</th>'));
            for (let add of ads)
                appendAddRow(add, adsTable);
            $('#ads').append(adsTable);
        }
    }

    function appendAddRow(add, addTable) {
        let links = [];
        if (add._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">[Delete]</a>')
                .click(deleteAd.bind(this, add));
            let editLink = $('<a href="#">[Edit]</a>')
                .click(loadAdForEdit.bind(this, add));
            links = [deleteLink, ' ', editLink];
        }
        addTable.append($('<tr>').append(
            $('<td>').text(add.title),
            $('<td>').text(add.description),
            $('<td>').text(add.publisher),
            $('<td>').text(add.datePublished),
            $('<td>').text(add.price),
            $('<td>').append(links)
        ));
    }
}

function getKinveyUserAuthHeaders() {
    return {
        'Authorization': "Kinvey " +
        sessionStorage.getItem('authToken'),
    };
}

function createAd() {
    showView('viewCreateAd');
    let myDate = $('#formCreateAd input[name=datePublished]').val();
    myDate = myDate.split("-");
    let datePublished = myDate[1] + "/" + myDate[2] + "/" + myDate[0];
    let addData = {
        title: $('#formCreateAd input[name=title]').val(),
        price: $('#formCreateAd input[name=price]').val(),
        description: $('#formCreateAd textarea[name=description]').val(),
        datePublished:datePublished,
        publisher: sessionStorage['username']
    };
    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/ads",
        headers: getKinveyUserAuthHeaders(),
        data: addData,
        success: createAdSuccess,
        error: handleAjaxError
    });
    function createAdSuccess(response) {
        listAds();
        showInfo('Ad created.');
    }
}

function deleteAd(ad) {
    $.ajax({
        method: "DELETE",
        url: kinveyAdUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/ads/" + ad._id,
        headers: getKinveyUserAuthHeaders(),
        success: deleteAdSuccess,
        error: handleAjaxError
    });
    function deleteAdSuccess(response) {
        listAds();
        showInfo('Ad deleted.');
    }
}
function loadAdForEdit(ad) {
    $.ajax({
        method: "GET",
        url: kinveyAdUrl = kinveyBaseUrl + "appdata/" +
            kinveyAppKey + "/ads/" + ad._id,
        headers: getKinveyUserAuthHeaders(),
        success: loadAdForEditSuccess,
        error: handleAjaxError
    });
    function loadAdForEditSuccess(ad) {
        $('#formEditAd input[name=id]').val(ad._id);
        $('#formEditAd input[name=publisher]').val(ad.publisher);
        $('#formEditAd input[name=title]').val(ad.title);
        $('#formEditAd input[name=price]').val(ad.price);
        $('#formEditAd input[name=datePublished]').val(ad.datePublished);
        $('#formEditAd textarea[name=description]').val(ad.description);
        showView('viewEditAd');
    }
}
function editAd() {
    let adData = {
        title: $('#formEditAd input[name=title]').val(),
        price: $('#formEditAd input[name=price]').val(),
        publisher: $('#formEditAd input[name=publisher]').val(),
        datePublished: $('#formEditAd input[name=datePublished]').val(),
        description: $('#formEditAd textarea[name=description]').val()
    };
    $.ajax({
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey +
        "/ads/" + $('#formEditAd input[name=id]').val(),
        headers: getKinveyUserAuthHeaders(),
        data: adData,
        success: editAdSuccess,
        error: handleAjaxError
    });

    function editAdSuccess(response) {
        listAds();
        showInfo('Ad edited.');
    }
}
