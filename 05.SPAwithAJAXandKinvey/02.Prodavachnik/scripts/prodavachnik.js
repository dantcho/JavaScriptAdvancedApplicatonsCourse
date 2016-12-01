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
    $('#linkHome').click(goHome);
    $('#linkLogin').click(loginView);
    $('#linkRegister').click(registerView);
    $('#linkListAds').click(listAddView);
    $('#linkCreateAd').click(createAddView);
    $('#linkLogout').click(logoutUser);
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
    goHome();

}
function listAddView() {

}
function createAddView() {

}

function showHideMenuLinks() {
    $("#linkHome").show();
    if (sessionStorage.getItem('authToken')) {
        // We have logged in user
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListAds").show();
        $("#linkCreateAdk").show();
        $("#linkLogout").show();
    } else {
        // No logged in user
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListAds").hide();
        $("#linkCreateAdk").hide();
        $("#linkLogout").hide();
    }
}
function loginView() {
    $('main > section').fadeOut();
    $('#viewLogin').fadeIn();
    $('#buttonLoginUser').click(loginUser)
}

function registerView() {
    $('main > section').fadeOut();
    $('#viewRegister').fadeIn();
    $('#buttonRegisterUser').click(registerUser)
}

function goHome() {
    $('main > section').fadeOut();
    $('#viewHome').fadeIn();
}

function loginUser() {

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
    }
}
function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('userId', userId);
    let username = userInfo.username;
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
    }

}

function logoutUser() {
    sessionStorage.clear();
    $('#loggedInUser').text("");
    showHideMenuLinks();
    showView('viewHome');
    showInfo('Logout successful.');
}
