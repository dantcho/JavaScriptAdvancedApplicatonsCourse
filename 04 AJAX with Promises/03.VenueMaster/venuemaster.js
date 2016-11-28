const appId = 'kid_BJ_Ke8hZg';
let getVenueIdURL = `https://baas.kinvey.com/rpc/${appId}/custom/calendar?query=`;
let getVenueURL = `https://baas.kinvey.com/appdata/${appId}/venues/`;
const base64auth = btoa('guest:pass');
const authHeaders = {Authorization: "Basic " + base64auth};

function attachEvents() {
    $('#getVenues').click(getVenues)
}

function getVenues(ev) {
    ev.preventDefault();
    let date = $('#venueDate').val();
    requestVenueID(date)
}

function requestVenueID(date) {
    let request = {
        method: "POST",
        headers: authHeaders,
        url: getVenueIdURL + date,
        contentType: 'application/json'
    };
    $.ajax(request).then(readVenues).catch(displayError);
}

let data = [];
function updateData(venue) {
    data.push({
        _id: venue._id,
        name: venue.name,
        description: venue.description,
        startingHour: venue.startingHour,
        price: venue.price
    })
}
function readVenues(venuesID) {
    data = [];
    let promises = [];
    for (let id of venuesID) {
        let request = {
            method: "GET",
            headers: authHeaders,
            url: getVenueURL + id,
            contentType: 'application/json'
        };
        promises.push($.ajax(request).then(updateData).catch(displayError));
    }
    Promise.all(promises).then(renderVenues)

}
function displayError(error) {
    console.log(error.statusText);
}
function renderVenues() {
    let div = $('#venue-info');
    div.empty();
    for (let venue of data) {
        div.append(`<div class="venue" id="${venue._id}">
  <span class="venue-name"><input class="info" type="button" value="More info">${venue.name}</span>
  <div class="venue-details" style="display: none;">
    <table>
      <tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>
      <tr>
        <td class="venue-price">${venue.price} lv</td>
        <td><select class="quantity">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select></td>
        <td><input class="purchase" type="button" value="Purchase"></td>
      </tr>
    </table>
    <span class="head">Venue description:</span>
    <p class="description">${venue.description}</p>
    <p class="description">Starting time: ${venue.startingHour}</p>
  </div>
</div>`);
    }
    $("input.info").click(moreInfo);
    $('input.purchase').click(purchase);
}
function purchase() {
    let key = $(this).parents('.venue');
    key = $(key).attr('id');
    let event = data.find(x=>x._id == key);
    let name = event.name;
    let price = event.price;
    let qty = $(this).parent().parent().children()[1];
    qty = $(qty).children().val();
    let div = $('#venue-info');
    div.empty();
    div.append(
        `<span class="head">Confirm purchase</span>
<div class="purchase-info">
  <span>${name}</span>
  <span>${qty} x ${price}</span>
  <span>Total: ${qty * price} lv</span>
  <input type="button" value="Confirm">
</div>`);
    $('input[value="Confirm"]').click(()=> {
        confirmPurchase(key, qty)
    })
}

function confirmPurchase(id, qty) {

    let request = {
        method: "POST",
        headers: authHeaders,
        url: `https://baas.kinvey.com/rpc/${appId}/custom/purchase?venue=${id}&qty=${qty}`,
        contentType: 'application/json'
    };
    $.ajax(request).then(printTicket).catch(displayError);
}

function printTicket(ticket) {
    let div = $('#venue-info');
    div.empty();
    div.text("You may print this page as your ticket");
    div.append(ticket.html);
}

function moreInfo() {
    $(this).parent().parent().children('div.venue-details').attr('style', 'display:block');
}
