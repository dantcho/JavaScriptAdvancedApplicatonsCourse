(function loadData() {
    let table = $('#results');
    const appId = 'kid_S1XZqkYfl';
    let connectionString = `https://baas.kinvey.com/appdata/${appId}/`;
    const base64auth = btoa('guest:guest');
    const authHeaders = {Authorization: "Basic " + base64auth};
    $('#add').click(addRow);
    $('#countries').click(loadCountries);
    $('#cities').click(loadTowns);
    let state = '';

    function load() {
        $.get({
            url: connectionString + state,
            headers: authHeaders
        }).then(render).catch(displayError);
    }

    function loadCountries() {
        state = 'countries/';
        load();
    }

    function loadTowns() {
        state = 'towns/';
        load();
    }

    function render(data) {
        // $(tBody).children('tr:not(:first)').remove();
        table.empty();
        table
            .append($('<tbody>')
                .append($('<tr>')
                    .append($('<th>').text('Name'))
                    .append($('<th>').text('Action')))
            );
        if (state == 'towns/') {
            let th = $('th').filter(function () {
                return this.textContent.trim() === "Name"
            });
            (($('<th>').text('CountryName'))).insertAfter(th);
        }

        data = data.sort((a, b)=> {
            if (b.Name < a.Name)return 1;
            else return -1;
        });

        for (let item of data) {
            let row = $('<tr>').prop('_id', item._id).attr('_id', item._id)
                .append($('<td>').text(item.Name))
                .append($('<td>')
                    .append($('<button>').prop('_id', item._id).text('Delete').click(deleteData))
                    .append($('<button>').prop('_id', item._id).text('Edit').click(editData))
                );

            if (state == 'countries/') {
                let td = row.children()[1];
                $(td).append($('<button>').prop('_id', item._id).text('Show Cities').click(queryTowns))
            }
            if (state == 'towns/') {
                let td = row.children()[0];
                (($('<th>').text(item.CountryName))).insertAfter(td);
            }
            table.children().append(row);
        }
    }

    function queryTowns() {
        state = 'towns/';
        let row = $(this).parent().parent();
        let aaa = $(row).children()[0];
        let country = $(aaa).text();
        $.get({
            url: connectionString + 'towns/?query={\"CountryName\":\"' + country + '\"}',
            headers: authHeaders
        }).then(render).catch(displayError);
    }


    function editData() {

        let row = $(this).parent().parent();
        let key = row.prop('_id');
        let data = row.children();
        let name = data[0].textContent;

        row.empty();
        row
            .append($('<td>').html(`<input type="text" id="name" value="${name}">`))
            .append($('<td>')
                .append($('<button>').prop('_id', key).text('Update').click(update))
            );
        if (state == 'towns/') {
            let countryName = data[1].textContent;
            let td = row.children()[0];
            ($('<td>').html(`<input type="text" id="country-name" value="${countryName}">`)).insertAfter(td);
        }
    }

    function update() {
        let key = this._id;
        let selector = 'tr[_id="' + key + '"]';
        let data = $(selector).children();
        let name = data.find('#name').val();
        let putData = {
            Name: name,
        };
        if (state == 'towns/') {
            putData.CountryName = data.find('#country-name').val()
        }

        let request = {
            method: "PUT",
            headers: authHeaders,
            url: connectionString + state + key,
            data: JSON.stringify(putData),
            contentType: 'application/json'
        };
        $.ajax(request).then(load).catch(displayError);
    }


    function addRow() {
        let thed = $(table).find('tr:first');
        let row = $('<tr>').attr('_id', 'new')
            .append($('<td>').html(`<input type="text" id="name">`))
            .append($('<td>')
                .append($('<button>').text('Add').click(addData))
            );
        if (state == 'towns/') {
            let td = row.children()[0];
            ($('<td>').html(`<input type="text" id="country-name">`)).insertAfter(td)
        }
        row.insertAfter(thed);
    }

    function addData() {
        let selector = 'tr[_id="new"]';
        let data = $(selector).children();
        let name = data.find('#name').val();
        let putData = {
            Name: name
        };
        if (state == 'towns/') {
            let countryName = data.find('#country-name').val();
            putData.CountryName = countryName;
        }
        let request = {
            method: "POST",
            headers: authHeaders,
            url: connectionString + state,
            data: JSON.stringify(putData),
            contentType: 'application/json'
        };
        if (data)
            $.ajax(request).then(load).catch(displayError);
    }

    function deleteData() {
        key = this._id;
        let request = {
            method: "DELETE",
            headers: authHeaders,
            url: connectionString + state + key,
            contentType: 'application/json',
        };
        $.ajax(request).then(load).catch(displayError);
    }

    function displayError(error) {
        console.log(error.statusText);
    }

})();