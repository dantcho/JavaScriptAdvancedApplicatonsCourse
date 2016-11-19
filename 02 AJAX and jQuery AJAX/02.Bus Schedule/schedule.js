function solveWorkInJudge() {
    let nextStop = 'depot';
    let currentStop;

    function getUrl(id) {
        return `https://judgetests.firebaseio.com/schedule/${id}.json`;
    }

    function depart() {
        $('#depart').prop('disabled', true);
        $('#arrive').prop('disabled', false);
        let ajaxObject = {
            method: 'GET',
            url: getUrl(nextStop),
            success: departing,
            error: displayError
        };
        $.ajax(ajaxObject);
    }

    function departing(info) {
        currentStop = info.name;
        nextStop = info.next;
        $('span.info').text(`Next stop ${currentStop}`)
    }

    function displayError(err) {
        $('span.info').text(err.statusText);
    }

    function arrive() {
        $('#depart').prop('disabled', false);
        $('#arrive').prop('disabled', true);
        $('span.info').text(`Arraving at ${currentStop}`)
    }

    return {
        depart,
        arrive
    }
}

function solveDontWorkInJudge() {
    let btnDepart = $('#depart');
    let btnArrive = $('#arrive');
    let nextStop = 'depot';
    let currentStop;

    function getUrl(id) {
        return `https://judgetests.firebaseio.com/schedule/${id}.json`;
    }

    function depart() {
        btnDepart.prop('disabled', true);
        btnArrive.prop('disabled', false);
        $.get(getUrl(nextStop))
            .then(departing)
            .catch(displayError);
    }

    function departing(info) {
        currentStop = info.name;
        nextStop = info.next;
        $('span.info').text(`Next stop ${currentStop}`)
    }

    function displayError(err) {
        $('span.info').text(err.statusText);
    }

    function arrive() {
        btnDepart.prop('disabled', false);
        btnArrive.prop('disabled', true);
        $('span.info').text(`Arraving at ${currentStop}`)
    }

    return {
        depart,
        arrive
    }
}

let result = solveDontWorkInJudge();
