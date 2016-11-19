
function solve() {
    let btnDepart = $('#depart');
    let btnArrive = $('#arrive');
    let nextStop = 'depot';
    let currentStop;

    function getUrl(id) {
        return `https://judgetests.firebaseio.com/schedule/${id}.json`;
    }

    function depart() {
        buttonsToggle(btnArrive, btnDepart);
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
        buttonsToggle(btnDepart, btnArrive);
        $('span.info').text(`Arraving at ${currentStop}`)
    }

    function buttonsToggle(btnA, btnB) {
        btnA.prop('disabled', false);
        btnB.prop('disabled', true)
    }

    return {
        depart,
        arrive
    }
}
let result = solve();