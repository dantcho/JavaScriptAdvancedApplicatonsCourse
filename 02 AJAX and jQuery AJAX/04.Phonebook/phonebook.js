function attachEvents() {
    let btnLoad = $('#btnLoad').click(loadPhoneBook);
    let btnCreate = $('#btnCreate').click(createContact);
    let databaseString = 'https://phonebook-nakov.firebaseio.com/phonebook';
    //let databaseString = 'https://phonebook-c196d.firebaseio.com/';

    let unordList = $('#phonebook');

    function loadPhoneBook() {
        $.get(databaseString + '.json')
            .then(render)
            .catch(displayError);
    }

    function displayError(err) {
        $('#phonebook').text(err.statusText);
    }

    function render(data) {
        unordList.empty();
        for (let key in data) {
            let insertLi = $('<li>').text(`${data[key].person}: ${data[key].phone} `).append($('<button>').text('[Delete]').click(function () {
                deleteContact(key)
            }));
            unordList.append(insertLi);
        }
    }

    function deleteContact(key) {
        let request = {
            method: 'DELETE',
            url: databaseString + '/' + key + '.json'
        };
        $.ajax(request)
            .then(loadPhoneBook)
            .catch(displayError);
    }

    function createContact() {
        let newContactJSON = JSON.stringify({
            person: $('#person').val(),
            phone: $('#phone').val()
        });
        $.post(databaseString + '.json', newContactJSON)
            .then(loadPhoneBook)
            .catch(displayError);
        $('#person').val('');
        $('#phone').val('');
    }

}