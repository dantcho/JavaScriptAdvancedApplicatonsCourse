function loadCommits() {
    function getUserRepoString(user, repo) {
        return `https://api.github.com/repos/${user}/${repo}/commits`
    }

    let placeToRender = $('#commits');
    let user = $('#username').val();
    let repo = $('#repo').val();
    $.get(getUserRepoString(user, repo)).then(render).catch(displayError);

    function render(commits) {
        for (let commit of commits) {
            let a = commit;

        }
    }

    function displayError(err) {
        $('#phonebook').text(err.statusText);
    }

}