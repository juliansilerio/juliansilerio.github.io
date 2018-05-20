/**
Julian Silerio
jjs2245
COMS 4170 UI Design
Prof. Chilton
**/

/*
Takes video from URL input bar at top of page and loads onto page
*/
function loadVideo() {
    var url = document.getElementById('url');
    var match = parseCode(url.value);

    if (match && match[2].length == 11) {
        document.getElementById('instructions').style.display='none';

        addVideo(match[2]);
        document.getElementById('controls').style.display='block';

    } else {
        document.getElementById('error').innerHTML = 'error, please check link format';
    }
}

/*
Remove all videos from page
*/
function reset() {
    while(videos.length > 0) {
        deleteVideo(videos[0]);
    }
    document.getElementById('instructions').style.display='block';

}

/*
Given a url, parses and returns the specific video code
with array of other url elements

PARAMETERS:
    url: String, can be either a youtube or youtube embed URL
*/
function parseCode(url) {
    // regExp matching, thanks stackOverflow
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return match;
}

/*
Appends a video element and relevant controls to page

PARAMETERS:
    videoCode: String, probably parsed from parseCode(url)
    start: int, initialized to 0
    after: loosely typed placeholder, initialized to 0 for function's sake
*/
function addVideo(videoCode, start=0, end=-1, after=false) {
    var newDiv = document.createElement('div');
    newDiv.class = 'video';

    var newVideo = document.createElement('div');
    var videoId =  'video'+parseInt(counter);
    newVideo.id = videoId;

    newDiv.append(newVideo);
    if(after) {
        // after is the node which this newDiv goes after
        after.after(newDiv);
        var i = videos.indexOf(after.firstChild.id);

        // videos array keeps track of video elements and their order
        videos.splice(i+1, 0, videoId);
    } else {
        $('#videos').append(newDiv);
        videos.push(videoId);
    }

    // creating the actual video player here
    var player = new YT.Player(videoId, {
        width: 480,
        height: 390,
        videoId: videoCode,
        playerVars: {
            enablejsapi: 1,
            fs: 0,
            start: start,
            end: end,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onStateChange,
        }
    });

    // also keeping track of timestamps
    timestamps[videoId] = [start, end];

    // the counter makes it easy to make unique video ids
    counter++;
}

/*
Plays the next video element

PARAMETERS:
    currentVideoId: String
*/
function nextVideo(currentVideoId) {
    var nextVideoIndex = videos.indexOf(currentVideoId) + 1;
    var nextPlayer = YT.get(videos[nextVideoIndex]);
    nextPlayer.playVideo();
}

/*
To hide/show the URL bar
*/
function toggleForm() {
    var form = document.getElementById('input_bar');
    if(form.style.display === 'none'){
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

/*
To let the video you are on loop
*/
function toggleLoop() {
    var button = document.getElementById('toggle_loop');
    if(button.classList.contains('btn-success')) {
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        button.value = 'Looping OFF';
        isLooping = false;
    } else {
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        button.value = 'Looping ON';
        isLooping = true;
    }
}

/*
To let the videos continue playing one after another
*/
function toggleAutoplay() {
    var button = document.getElementById('toggle_autoplay');
    if(button.classList.contains('btn-success')) {
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        button.value = 'playNext OFF';
        isAutoplay = false;
    } else {
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        button.value = 'playNext ON';
        isAutoplay = true;
    }
}

/*
Remove an entire video element from the site

PARAMETERS:
    videoId: String
*/
function deleteVideo(videoId) {
    document.getElementById(videoId).parentNode.outerHTML = '';
    delete timestamps[videoId];
    var i = videos.indexOf(videoId);
    videos.splice(i, 1);
}

/*
Once the Youtube API has been loaded, then the page loads the URL input
*/
function onYouTubeIframeAPIReady() {
    var top_div = document.getElementById('top_div');
    top_div.style.display = 'block';
}

////////////////////////////
///  FUN FUNCTIONS BELOW ///
////////////////////////////

// may not actually be that fun, but the bulk of my proramming is below

/*
Merges the current video with the one to the left. Underlying code essentially
assigns the end time of this video to the left video

PARAMETERS:
    videoId: String, video that will be merged with the one left of it
*/
function mergeLeft(videoId) {
    // get relevant info about left video
    var leftVideoIndex = videos.indexOf(videoId) - 1;
    var leftId = videos[leftVideoIndex];
    var leftPlayer = YT.get(leftId);

    // determine start and end times
    var start = timestamps[leftId][0];
    var end = timestamps[videoId][1];

    // remove current video
    deleteVideo(videoId);

    // parse video code from video element
    // i wonder if there's a better way to do this...
    var videoUrl = leftPlayer.getVideoUrl();
    var videoCode = parseCode(videoUrl)[2];

    // load video with new timestamps to left player object
    leftPlayer.cueVideoById({
        videoId: videoCode,
        startSeconds: start,
        endSeconds: end
    });

    // update timestamps of left video
    timestamps[leftId] = [start, end]

    // check if the merged video is the last video in the row
    // if so, remove the merge right button that's there
    var lastIndex = videos.length - 1;
    if(videos.indexOf(leftId) == lastIndex) {
        var lastChild = document.getElementById(leftId).parentNode.lastChild;
        lastChild.outerHTML = '';
    }
}

/*
Merges the current video to the video right of it. Same concept with mergeLeft,
except it assigns this video's start time to the right video's start time.

PARAMETERS:
    videoId: String, current video
*/
function mergeRight(videoId) {
    // right video's information
    var rightVideoIndex = videos.indexOf(videoId) + 1;
    var rightId = videos[rightVideoIndex];
    var rightPlayer = YT.get(rightId);

    // determine start and end times
    var start = timestamps[videoId][0];
    var end = timestamps[rightId][1];

    // delete old video
    deleteVideo(videoId);

    // parse video code from right video
    var videoUrl = rightPlayer.getVideoUrl();
    var videoCode = parseCode(videoUrl)[2];

    // assign new start time to right video player
    rightPlayer.cueVideoById({
        videoId: videoCode,
        startSeconds: start,
        endSeconds: end
    });

    // update timestamps
    timestamps[rightId] = [start, end]

    // if this is the first element in the row, remove the merge left button
    if(videos.indexOf(rightId) == 0) {
        document.getElementById(rightId).parentNode.childNodes[2].outerHTML='';
    }
}

/*
When a video has been loaded on page, the code below creates the various controls
for pausing and playing, splitting, merging, and deleting the video from the queue
*/
function onPlayerReady(event) {
    // initial variable bookkeeping
    var parentDiv = event.target.getIframe().parentNode;
    var videoId = event.target.getIframe().id;
    var startOriginal = event.target.getCurrentTime();

    // pause play button
    var playPauseButton = document.createElement('button');
    playPauseButton.classList.add('btn', 'btn-success');
    playPauseButton.type = 'button';
    playPauseButton.innerText = 'Play/Pause';

    playPauseButton.addEventListener('click', function() {
        if(event.target.getPlayerState() != 1) {
            event.target.playVideo();
        } else {
            event.target.pauseVideo();
        }
    });

    // split video button
    var splitButton = document.createElement('button');
    splitButton.classList.add('btn', 'btn-warning');
    splitButton.type = 'button';
    splitButton.innerText = 'Split';

    splitButton.addEventListener('click', function() {
        // can only pass in integers for time
        var time = Math.trunc(event.target.getCurrentTime());
        var videoUrl = event.target.getVideoUrl();
        var videoCode = parseCode(videoUrl)[2];

        // load first part of video into old player
        event.target.cueVideoById({
            videoId: videoCode,
            startSeconds: startOriginal,
            endSeconds: time
        });

        // if a video is split but there's already another video after it, we
        // set the second video's end time to be the start time of the video
        // after
        var end = -1;
        var videoIndex = videos.indexOf(videoId);
        if( videoIndex != videos.length-1) {
            end = timestamps[videos[videoIndex+1]][0];
        }

        // now we add the video element to the page, and we pass in the current
        // video element so we can add the new one right after
        addVideo(videoCode,
            start=time,
            end=end,
            after=event.target.getIframe().parentNode
        );

        // if the current video element doesn't already have a merge right
        // button, we make one
        if(parentDiv.childNodes[parentDiv.childNodes.length - 1].innerText != 'Merge right') {
            var rightButton = document.createElement('button');
            rightButton.classList.add('btn', 'btn-dark');
            rightButton.type = 'button';
            rightButton.innerText = 'Merge right';
            rightButton.addEventListener('click', function() {
                mergeRight(videoId)
            });
            parentDiv.append(rightButton);
        }

        // update this video's timestamps
        timestamps[videoId] = [startOriginal, time]

    });

    // delete button
    // REMOVED, users don't need to delete videos like this
    /*
    var deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.type = 'button';
    deleteButton.innerText = 'Delete';

    deleteButton.addEventListener('click', function() {
        deleteVideo(videoId);
    });
    */

    // add buttons
    var br = document.createElement('br');
    var rightButton;
    var leftButton;

    // only gotta make the merge buttons if there's more than one video right?
    if(videos.length > 1){

        // create mergeLeft button if it's not the first element
        if(videos.indexOf(videoId) > 0) {
            var leftButton = document.createElement('button');
            leftButton.classList.add('btn', 'btn-dark');
            leftButton.type = 'button';
            leftButton.innerText = 'Merge left';
            leftButton.addEventListener('click', function() {
                mergeLeft(videoId);
            });
        };

        // create mergeRight button if it's not the last element
        if(videos.indexOf(videoId) < (videos.length - 1)) {
            var rightButton = document.createElement('button');
            rightButton.classList.add('btn', 'btn-dark');
            rightButton.type = 'button';
            rightButton.innerText = 'Merge right';
            rightButton.addEventListener('click', function() {
                 mergeRight(videoId)
            });
        };
    };

    // add a break to make it look a little pretty
    parentDiv.append(br);

    // if we made a left button, append it
    if(leftButton) {
        parentDiv.append(leftButton);
    }

    // then append the other buttons
    parentDiv.append(playPauseButton);
    parentDiv.append(splitButton);
    //parentDiv.append(deleteButton);

    // then append the right button
    if(rightButton) {
        parentDiv.append(rightButton);
    }

}

/*
Mostly used for the looping and autplay functionality
*/
function onStateChange(event) {
    // if the video ended
    if(event.data == YT.PlayerState.ENDED) {
        var videoId = event.target.getIframe().id;

        // if we should loop the video
        if(isLooping) {
            // basically reloads the video into the player
            var videoUrl = event.target.getVideoUrl();
            var videoCode = parseCode(videoUrl)[2];
            event.target.loadVideoById({
                videoId: videoCode,
                startSeconds: timestamps[videoId][0],
                endSeconds: timestamps[videoId][1]
            });
        } else if(isAutoplay && videos.indexOf(videoId) < (videos.length - 1)) {
            nextVideo(videoId);
        } // if it's not looping, check if the vids autoplay
    }
}

// global variables
var counter;
var isLooping;
var isAutoplay;
var timestamps;
var videos;

// when the page loads
$(document).ready(function() {
    counter = 0;
    isLooping = true;
    isAutoplay = false;
    timestamps = {};
    videos = [];

    // load youtube iframe api
    var tag = document.createElement('script');
    tag.id = 'iframe-api';
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});
