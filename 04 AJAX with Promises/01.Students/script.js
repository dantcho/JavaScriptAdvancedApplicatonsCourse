(function loadData() {
    let tBody = $('tbody');
    const appId = 'kid_BJXTsSi-e';
    let connectionString = `https://baas.kinvey.com/appdata/${appId}/students/`;
    const base64auth = btoa('guest:guest');
    const authHeaders = {Authorization: "Basic " + base64auth};
    $('#add').click(addStudentRow);
    load();

    function load() {
        $.get({url: connectionString, headers: authHeaders}).then(render).catch(displayError);
    }

    function addStudentRow() {
        let thed = $(tBody).children('tr:first');
        let row = $('<tr>').attr('_id','new')
            .append($('<td>').html(`<input type="number" id="id" >`))
            .append($('<td>').html(`<input type="text" id="first-name">`))
            .append($('<td>').html(`<input type="text" id="last-name" >`))
            .append($('<td>').html(`<input type="text" id="faculty-number" >`))
            .append($('<td>').html(`<input type="number" id="grade" >`))
            .append($('<td>')
                .append($('<button>').text('Add').click(addStudent))
            );
        row.insertAfter(thed);
    }

    function addStudent() {
        let selector = 'tr[_id="new"]';
        let data = $(selector).children();
        let id = Number(data.find('#id').val());
        let firstName = data.find('#first-name').val();
        let lastName = data.find('#last-name').val();
        let facultyNumber = data.find('#faculty-number').val();
        let grade = Number(data.find('#grade').val());
        let putData = {
            ID: id,
            FirstName: firstName,
            LastName: lastName,
            FacultyNumber: facultyNumber,
            Grade: grade
        };

        let request = {
            method: "POST",
            headers: authHeaders,
            url: connectionString,
            data: JSON.stringify(putData),
            contentType: 'application/json'
        };
        if (data)
            $.ajax(request).then(load).catch(displayError);
    }


    function editStudent() {

        let row = $(this).parent();
        let key = row.prop('_id');
        row.off('click');
        let data = row.children();
        let id = data[0].textContent;
        let firstName = data[1].textContent;
        let lastName = data[2].textContent;
        let facultyNumber = data[3].textContent;
        let grade = data[4].textContent;

        row.empty();
        row
            .append($('<td>').html(`<input type="number" id="id" value="${id}">`))
            .append($('<td>').html(`<input type="text" id="first-name" value="${firstName}">`))
            .append($('<td>').html(`<input type="text" id="last-name" value="${lastName}">`))
            .append($('<td>').html(`<input type="text" id="faculty-number" value="${facultyNumber}">`))
            .append($('<td>').html(`<input type="number" id="grade" value="${grade}">`))

            .append($('<td>')
                .append($('<button>').prop('_id', key).text('Update').click(updateStudent))
            );
    }

    function updateStudent() {
        let key = this._id;
        let selector = 'tr[_id="' + key + '"]';
        let data = $(selector).children();
        let id = Number(data.find('#id').val());
        let firstName = data.find('#first-name').val();
        let lastName = data.find('#last-name').val();
        let facultyNumber = data.find('#faculty-number').val();
        let grade = Number(data.find('#grade').val());
        let putData = {
            ID: id,
            FirstName: firstName,
            LastName: lastName,
            FacultyNumber: facultyNumber,
            Grade: grade
        };

        let request = {
            method: "PUT",
            headers: authHeaders,
            url: connectionString + key,
            data: JSON.stringify(putData),
            contentType: 'application/json'
        };
        if (data)
            $.ajax(request).then(load).catch(displayError);

    }

    function render(students) {
        // tBody.empty();
        $(tBody).children('tr:not(:first)').remove();
        students = students.sort((a, b)=>a.ID - b.ID);
        for (let student of students) {
            let row = $('<tr>').prop('_id', student._id).attr('_id', student._id)
                .append($('<td>').text(student.ID).click(editStudent))
                .append($('<td>').text(student.FirstName).click(editStudent))
                .append($('<td>').text(student.LastName).click(editStudent))
                .append($('<td>').text(student.FacultyNumber).click(editStudent))
                .append($('<td>').text(student.Grade).click(editStudent))
                .append($('<td>')
                    .append($('<button>').prop('_id', student._id).text('Delete').click(deleteStudent))
                );
            tBody.append(row);
        }
    }

    function deleteStudent() {
        key = this._id;
        let request = {
            method: "DELETE",
            headers: authHeaders,
            url: connectionString + key,
            contentType: 'application/json',
        };
        $.ajax(request).then(load).catch(displayError);
    }

    function displayError(error) {
        console.log(error.statusText);
    }

})();