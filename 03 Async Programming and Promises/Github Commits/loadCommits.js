function loadCommits() {
    function getUserRepoString(user, repo) {
        return `https://api.github.com/repos/${user}/${repo}/commits`
    }
    let user = $('#username').val();
    let repo = $('#repo').val();
    $.get(getUserRepoString(user, repo)).then(render).catch(displayError);

    function render(commits) {
        $('#commits').empty();
        for (let commitObj of commits) {
            let insertLi = $('<li>').text(`${commitObj.commit.author.name}: ${commitObj.commit.message}`);
            $('#commits').append(insertLi);

        }
    }

    function displayError(err) {
        $('#commits').empty();
        let insertLi = $('<li>').text(`Error: ${err.status} (${err.statusText})`);
        $('#commits').append(insertLi);
    }
}