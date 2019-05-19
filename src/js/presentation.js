let USER_ID = window.location.search.match(/\?id=(.*)/)[1];

$(document).ready(function () {
    $('#close-presentation').click(function() {
        window.location = `feed.html?id=${USER_ID}`;
    })
})