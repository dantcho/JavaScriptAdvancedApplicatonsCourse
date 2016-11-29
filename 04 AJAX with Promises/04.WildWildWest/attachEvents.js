let tBody = $('tbody');
const appId = 'kid_S1XZqkYfl';
let connectionString = `https://baas.kinvey.com/appdata/${appId}/players/`;
const base64auth = btoa('guest:guest');
const authHeaders = {Authorization: "Basic " + base64auth};
let playersData = [];
class Player {
    constructor(name, money, bulets, _id) {
        if (name != '' && bulets > 0 && money > 0) {
            this._id = _id;
            this.name = name;
            this.bullets = bulets;
            this.money = money;
        }
        else return new Error();
    }
}
function displayErrors(error) {
    console.log(error.statusText);
}
function playerBox(player) {
    let html =$('<div>').addClass('player').attr('data-id',player._id).append(
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
function play() {
    let key = $(this).parent().attr('data-id');
    let player = playersData.find(x=>x._id==key);
    loadCanvas(player);
}

function deletePlayer() {

}


function attachEvents() {
    let requestPlayers = $.get({url: connectionString, headers: authHeaders}).catch(displayErrors);
    Promise.all([requestPlayers]).then(renderPlayers)
}
function renderPlayers([players]) {
    playersData=[];
    let div = $('#players');
    div.empty();
    for (let player of players){
        playersData.push(new Player(player.Name, player.Money, player.Bullets, player._id))
    }
    for (let player of playersData) {
        div.append(playerBox(player))
    }
}