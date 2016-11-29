class Player {
    constructor(name, money, bulets, _id) {
        if (name != '' && bulets >= 0 && money >= 0) {
            this._id = _id;
            this.name = name;
            this.bullets = bulets;
            this.money = money;
        }
        else throw new Error();
    }

    set money(money) {
        if (money >= 0) {
            this._money = money
        } else throw new Error();
    }

    get money() {
        return this._money;
    }
}
const appId = 'kid_S1XZqkYfl';
let connectionString = `https://baas.kinvey.com/appdata/${appId}/players/`;
const base64auth = btoa('guest:guest');
const authHeaders = {Authorization: "Basic " + base64auth};
let playersData = [];

function attachEvents() {
    $('#addPlayer').click(addPlayer);
    loadPlayers();
}

function addPlayer() {
    let playerName = $('input#addName').val();
    let putData = {
        Name: playerName,
        Money: 500,
        Bullets: 6
    };
    let request = {
        method: "POST",
        headers: authHeaders,
        url: connectionString,
        data: JSON.stringify(putData),
        contentType: 'application/json'
    };
    $.ajax(request).then(loadPlayers).catch(displayError);
}

function loadPlayers() {
    $.get({url: connectionString, headers: authHeaders}).then(renderPlayers).catch(displayError);
}

function renderPlayers(players) {
    playersData = [];
    let div = $('#players');
    div.empty();
    for (let player of players) {
        playersData.push(new Player(player.Name, player.Money, player.Bullets, player._id))
    }
    for (let player of playersData) {
        div.append(playerBox(player))
    }
}
function playerBox(player) {
    let html = $('<div>').addClass('player').attr('data-id', player._id).append(
        `   <div class="row">
                <label>Name:</label>
                <label class="name">${player.name}</label>
            </div>
            <div class="row">
                <label>Money:</label>
                <label class="money">${player.money}</label>
            </div>
            <div class="row">
                <label>Bullets:</label>
                <label class="bullets">${player.bullets}</label>
            </div>
            <button class="play">Play</button>
            <button class="delete">Delete</button>`);
    let btnPlay = $(html).children()[3];
    let btnDelete = $(html).children()[4];
    $(btnPlay).click(play);
    $(btnDelete).click(deletePlayer);
    return html
}

function displayError(error) {
    console.log(error.statusText);
}

function play() {
    let canvas = $('#canvas');
    let key = $(this).parent().attr('data-id');
    let player = playersData.find(x=>x._id == key);
    loadCanvas(player);
    let btnReload = $('#reload');
    let btnSave = $('#save');
    canvas.fadeIn();
    $(btnReload).fadeIn();
    $(btnSave).fadeIn();
    btnReload.click(reloadAmmo);
    btnSave.click(savePlayerData);
    function savePlayerData() {
        clearInterval(canvas.prop('intervalId'));
        let putData = {
            Name: player.name,
            Money: player.money,
            Bullets: player.bullets
        };
        let request = {
            method: "PUT",
            headers: authHeaders,
            url: connectionString + key,
            data: JSON.stringify(putData),
            contentType: 'application/json'
        };
        $.ajax(request).then(loadPlayers).catch(displayError);

    }

    function reloadAmmo() {
        if (player.money -= 60)
            player.bullets = 6;
    }
}

function deletePlayer() {
    let key = $(this).parent().attr('data-id');
    deletePlayerFromBase(key);
}
function deletePlayerFromBase(id) {
    let request = {
        method: "DELETE",
        headers: authHeaders,
        url: connectionString + id,
        contentType: 'application/json',
    };
    $.ajax(request).then(loadPlayers).catch(displayError);
}


