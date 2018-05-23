let show_nav = false;

$(document).ready(() => {
    $.getJSON('teams.json', (json_data) => {
        $.ajax({
            headers: { 'X-Auth-Token': '43e2645aff8f4f838d18ccfbb2c04610' },
            url: 'http://api.football-data.org/v1/soccerseasons/467/teams',
            dataType: 'json',
            type: 'GET'
        }).done(function(d) {
            getGoalsScored(json_data, d);
        });
    });
})

function handleNavBar() {
    show_nav = !show_nav;

    if (show_nav) {
        $('#nav').css('display', 'block');
    } else {
        $('#nav').css('display', 'none');
    }
}

function getGoalsScored(teams, data) {
    console.log(teams, data);
}