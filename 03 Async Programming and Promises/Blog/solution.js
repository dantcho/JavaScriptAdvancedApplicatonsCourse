function attachEvents() {
    let btnLoad = $('#btnLoadPosts').click(loadPosts);
    let btnView = $('#btnViewPost').click(viewPosts);
    let postsSelect = $('#posts');
    const appId = 'kid_Sy_hs7yMl';
    const connectUrl = `https://baas.kinvey.com/appdata/${appId}`;
    const base64auth = btoa('peter:p');
    const authHeaders = {Authorization: "Basic " + base64auth};
    let lastLoadData;

    function loadPosts() {
        $.ajax({url: connectUrl + '/posts', headers: authHeaders}).then(fillSelect).fail(displayError)
    }

    function fillSelect(data) {
        postsSelect.empty();
        for (let post of data)
            postsSelect.append($('<option>').text(post.title).val(post._id));
    }

    function displayError(error) {
        console.error(error.statusText);
    }

    function viewPosts() {
        let key = postsSelect.val();
        if (!key)return;
        let requestPost = $.ajax({url: connectUrl + '/posts/' + key, headers: authHeaders});
        let reqestComment = $.ajax({url: connectUrl + `/comments/?query={"post_id":"${key}"}`, headers: authHeaders});
        Promise.all([requestPost, reqestComment]).then(render).catch(displayError);
    }

    function render([post,comments]) {
        $("#post-title").text(post.title);
        $("#post-body").text(post.body);
        $("#post-comments").empty();
        for (let comment of comments) {
            let commentItem = $("<li>")
                .text(comment.text);
            $("#post-comments")
                .append(commentItem);
        }
    }
}