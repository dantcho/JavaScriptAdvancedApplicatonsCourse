function attachEvents() {
    $('button.load').click(Load);
    $('button.add').click(Add);

    const appId = 'kid_Bkoy_ywMl';
    let connectionString = `https://baas.kinvey.com/appdata/${appId}/biggestCatches/`;
    const base64auth = btoa('dancho:pass123');
    const authHeaders = {Authorization: "Basic " + base64auth};

    function Load() {
        $.get({url: connectionString, headers: authHeaders}).then(render).catch(displayError)
    }

    function takeData(selector) {
        let angler = $(selector + ' input.angler').val();
        let weight = $(selector + ' input.weight').val();
        if (weight != '')weight = Number(weight);
        else return false;
        let species = $(selector + ' input.species').val();
        let location = $(selector + ' input.location').val();
        let bait = $(selector + ' input.bait').val();
        let captureTime = $(selector + ' input.captureTime').val();
        if (captureTime != '')captureTime = Number(captureTime);
        else return false;
        let dataRequestBody = {
            "angler": angler,
            "weight": weight,
            "species": species,
            "location": location,
            "bait": bait,
            "captureTime": captureTime
        };
        if (angler && (typeof weight == 'number') && (typeof captureTime == 'number') && species && location && bait)return JSON.stringify(dataRequestBody);
        else return false;
    }

    function Add() {
        let data = takeData('div#aside');
        if (data)
            $.post({
                url: connectionString,
                headers: authHeaders,
                contentType: 'application/json',
                data: data
            }).then(Load).catch(displayError);
    }

    function Update() {
        let key = $(this.parentElement).attr('data-id');
        let selector = 'div [data-id=' + key + ']';
        let data = takeData(selector);
        let request = {
            method: "PUT",
            headers: authHeaders,
            url: connectionString + key,
            data: data,
            contentType: 'application/json'
        };
        if (data)
            $.ajax(request).then(Load).catch(displayError);
    }

    function Delete() {
        let key = $(this.parentElement).attr('data-id');
        let request = {
            method: "DELETE",
            headers: authHeaders,
            url: connectionString + key,
            contentType: 'application/json',
        };
        $.ajax(request).then(Load).catch(displayError);
    }


    function displayError(error) {
        console.log(error.statusText);
    }

    function render(data) {
        $('#catches').empty();
        for (let i = 0; i < data.length; i++) {
            let someCatch = $('<div>').addClass('catch').attr('data-id', data[i]._id)
                .append($('<label>').text('Angler'))
                .append($('<input>').addClass("angler").val(data[i].angler).attr('type', 'text'))
                .append($('<label>').text('Weight'))
                .append($('<input>').addClass("weight").val(data[i].weight).attr('type', 'number'))
                .append($('<label>').text('Species'))
                .append($('<input>').addClass("species").val(data[i].species).attr('type', 'text'))
                .append($('<label>').text('Location'))
                .append($('<input>').addClass("location").val(data[i].location).attr('type', 'text'))
                .append($('<label>').text('Bait'))
                .append($('<input>').addClass("bait").val(data[i].bait).attr('type', 'text'))
                .append($('<label>').text('Capture Time'))
                .append($('<input>').addClass("captureTime").val(data[i].captureTime).attr('type', 'number'))
                .append($('<button>').addClass("Update").text('Update').click(Update))
                .append($('<button>').addClass("delete").text('Delete').click(Delete));
            $('#catches').append(someCatch);
        }
    }
}
