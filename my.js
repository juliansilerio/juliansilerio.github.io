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

function loadSkills() {
    var i;
    for (i in skills) {
        var cardDiv = $('<div></div>').addClass('card bg-transparent text-white border-light');
        var cardBody = $('<div></div>').addClass('card-body');

        var title = $('<h5></h5>').addClass('card-title').text(skills[i].title);
        var subtitle = $('<h6></h6>').addClass('card-subtitle mb-2 text-muted').text(skills[i].subtitle);
        var text = $('<h6></h6>').addClass('card-text').text(skills[i].text);

        cardBody.append(title);
        cardBody.append(subtitle);
        cardBody.append(text);

        if (skills[i].proficient) {
            var badge = $('<span></span>').addClass('badge badge-primary').text('proficient');
            cardBody.append(badge);
        }

        cardDiv.append(cardBody);
        $('#skill-cards').append(cardDiv);

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

$(document).ready(function() {
    var LOCATION = 970;
    loadSkills();
    loadWork();

    $(window).scroll(function () {
        checkNavbar(LOCATION);
    });
});
