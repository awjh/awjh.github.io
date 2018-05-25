let person;

$(document).ready(() => {
    person = getUrlParameter('person');

    if (!person || person.trim() === '') {
        window.location.href = 'index.html';
    }

    getData(setupPage)
});

let setupPage = (teams, games) => {
    let users_teams = [];

    let found_counter = 0;

    Object.keys(teams).forEach((key) => {
        let team = teams[key];
        if (team.owner === person) {
            found_counter++;
            $(`#team-${found_counter} .title`).html(key);
            console.log($(`#team-${found_counter} .title`), key);
            // ADD TO THE REST OF THE DATA
        }
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};