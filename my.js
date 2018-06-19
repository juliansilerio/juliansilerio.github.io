var badgeDict = {
    'proficient' : 'badge-warning',
    'personal' : 'badge-primary',
    'school' : 'badge-light',
    'work' : 'badge-dark',
}

function checkNavbar(location) {
    console.log($(window).scrollTop());
    if ($(window).scrollTop() > location) {
        //$('#nav_bar').show();
        $('#nav_bar').addClass('navbar-fixed');
    }
    if ($(window).scrollTop() < location) {
        //$('#nav_bar').hide();
        $('#nav_bar').removeClass('navbar-fixed');
    }
}

function makeCard(data) {
    console.log(data);
    var cardDiv = $('<div></div>').addClass('card bg-transparent text-white border-light');
    var cardBody = $('<div></div>').addClass('card-body');

    var title = $('<h5></h5>').addClass('card-title').text(data.title);
    var subtitle = $('<h6></h6>').addClass('card-subtitle mb-2 text-muted').text(data.subtitle);
    var text = $('<h6></h6>').addClass('card-text').text(data.text);

    cardBody.append(title);
    cardBody.append(subtitle);
    cardBody.append(text);

    //if (data.tags) {
    var cardTags = $('<div></div>');
    var x;
    for (x in data.tags) {
        var badge = $('<span></span>').addClass('badge').text(data.tags[x]);
        badge.addClass(badgeDict[data.tags[x]]);
        cardTags.append(badge);
        cardTags.append(' ');
    }
    cardBody.append(cardTags);

    //}

    cardDiv.append(cardBody);
    return cardDiv;
}

function loadSkills() {
    var i;
    for (i in skills) {
        var card = makeCard(skills[i]);
        $('#skill-cards').append(card);

    }
}

function loadWork() {
    var i;
    for (i in work) {
        var row = $('<tr></tr>');
        var company = $('<td></td>').html(work[i].company);
        var role = $('<td></td>').text(work[i].role);
        var duration = $('<td></td>').html(work[i].duration);
        var notes = $('<td></td>').addClass('text-justify').text(work[i].notes);

        row.append(company);
        row.append(role);
        row.append(duration);
        row.append(notes);

        $('#table-body').append(row);
    }
}

/**
function loadProjects {
    var i;
    for (i in projects) {
        var
    }
}
**/

$(document).ready(function() {
    var LOCATION = 970;
    loadSkills();
    loadWork();

    $(window).scroll(function () {
        checkNavbar(LOCATION);
    });
});
