function attachEvents() {
    $('#submit').click(getWeather);
    let cityBase;
    let baseUrl = 'https://judgetests.firebaseio.com/';
    let weatherConditionIcon = {
        Sunny: '\u2600',
        "Partly sunny": '\u26C5',
        Overcast: '\u2601',
        Rain: '\u2614',
        Degrees: '\u00B0'
    };

    function displayErrors(error) {
        console.log(error.statusText)
    }

    function render([today, upcomming]) {
        $('#current')
            .append($('<span>')
                .addClass('condition symbol')
                .text(weatherConditionIcon[today.forecast.condition]))
            .append($('<span>')
                .addClass('condition')
                .append($('<span>')
                    .addClass('forecast-data')
                    .text(today.name))
                .append($('<span>')
                    .addClass('forecast-data')
                    .text('' + today.forecast.low + '\u00b0' + today.forecast.high + '\u00b0'))
                .append($('<span>')
                    .addClass('forecast-data')
                    .text(today.forecast.condition)));
        $('#forecast').fadeIn();



        console.log(today);
        console.log(upcomming);
    }

    function getWeather() {
        let city = $('#location').val();

        let getCityDB = $.get({url: baseUrl + 'locations.json'}).then(function (data) {
            cityBase = data;
        }).catch(displayErrors);
        Promise.all([getCityDB])
            .then(function () {
                let cityCode = cityBase.find(x=>x.name === city);
                let getForecastToday = $.get({url: baseUrl + 'forecast/today/' + cityCode.code + '.json'})
                    .catch(displayErrors);
                let getForecastUpcomming = $.get({url: baseUrl + 'forecast/upcoming/' + cityCode.code + '.json'})
                    .catch(displayErrors);
                Promise.all([getForecastToday, getForecastUpcomming]).then(function (todayForecastData, upCommingForecastData) {
                    render(todayForecastData, upCommingForecastData)

                })


            });

    }
}