(function result() {
    $('#submit').click(send);
    $('#refresh').click(refresh);
    let databaseString = `https://dancho-softuni-base.firebaseio.com/messenger`;
    
    function send() {
        let author = $('#author').val();
        let message = $('#content').val();
        let timestamp = new Date().getTime();
        let newMessageJSON = JSON.stringify({
            author: author,
            content: message,
            timestamp: timestamp
        });

        $.post(databaseString + '.json', newMessageJSON)
            .then(refresh)
            .catch(displayError);

    }

    function refresh() {
        $.get(databaseString + '.json')
            .then(render)
            .catch(displayError)
    }

    function render(messages) {
        let txt = '';
        let keys = Object.keys(messages);
        keys.sort((a, b)=> {
            return messages[a].timestamp - messages[b].timestamp;
        });
        for (let key of keys) {
            let author = messages[key].author;
            let msg = messages[key].content;
            txt += author + ': ' + msg+'\n';
        }
        $("#messages").val(txt);

    }

    function displayError(err) {
        $("#messages").val(err.statusText);
    }
    refresh();
})();