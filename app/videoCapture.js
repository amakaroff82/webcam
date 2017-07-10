"use strict";

var videoCapturing = ( function(){

    var videoElement = document.getElementById('videoElement');
    var videoStream = null;

    var initCallback = null;

    function log(text)
    {
        console.log(text);
    }

    function noStream()
    {
        log('Access to camera was denied!');
    }

    function stop()
    {
        var myButton = document.getElementById('buttonStop');
        if (myButton) myButton.disabled = true;
        myButton = document.getElementById('buttonSnap');
        if (myButton) myButton.disabled = true;
        if (videoStream)
        {
            if (videoStream.stop) videoStream.stop();
            else if (videoStream.msStop) videoStream.msStop();
            videoStream.onended = null;
            videoStream = null;
        }
        if (videoElement)
        {
            videoElement.onerror = null;
            videoElement.pause();
            if (videoElement.mozSrcObject)
                videoElement.mozSrcObject = null;
            videoElement.src = "";
        }
        myButton = document.getElementById('buttonStart');
        if (myButton) myButton.disabled = false;
    }

    function gotStream(stream, data)
    {
        //debugger
        var myButton = document.getElementById('buttonStart');
        if (myButton) myButton.disabled = true;
        videoStream = stream;
        log('Got stream.');
        videoElement.onerror = function ()
        {
            log('videoElement.onerror');
            if (videoElement) stop();
        };
        stream.onended = noStream;
        if (window.webkitURL) videoElement.src = window.webkitURL.createObjectURL(stream);
        else if (videoElement.mozSrcObject !== undefined)
        {//FF18a
            videoElement.mozSrcObject = stream;
            videoElement.play();
        }
        else if (navigator.mozGetUserMedia)
        {//FF16a, 17a
            videoElement.src = stream;
            videoElement.play();
        }
        else if (window.URL) videoElement.src = window.URL.createObjectURL(stream);
        else videoElement.src = stream;
        myButton = document.getElementById('buttonSnap');
        if (myButton) myButton.disabled = false;
        myButton = document.getElementById('buttonStop');
        if (myButton) myButton.disabled = false;

        videoElement.onplay = function(){

            if(initCallback) {
                setTimeout(function () {
                    initCallback(videoElement.videoWidth, videoElement.videoHeight);
                }, 300);
            }
        }
    }

    function startCapturing(callback)
    {
        initCallback = callback;
        var settings = {
            video:{
                width: {
                    exact: 800
                },
                height: {
                    exact: 600
                }
            }
        };

        if ((typeof window === 'undefined') || (typeof navigator === 'undefined')) log('This page needs a Web browser with the objects window.* and navigator.*!');
        else if (!(videoElement)) log('HTML context error!');
        else
        {
            log('Get user media…');

            if (navigator.getUserMedia) navigator.getUserMedia(settings, gotStream, noStream);
            else if (navigator.oGetUserMedia) navigator.oGetUserMedia(settings, gotStream, noStream);
            else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia(settings, gotStream, noStream);
            else if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia(settings, gotStream, noStream);
            else if (navigator.msGetUserMedia) navigator.msGetUserMedia(settings, gotStream, noStream);
            else log('getUserMedia() not available from your Web browser!');
        }
    }

    function captureVideoFrame(ctx)
    {
        ctx.drawImage(videoElement, 0, 0);
    }

    function getResolution(){
        return {
            height: videoElement.videoHeight,
            width: videoElement.videoWidth
        }
    }


    return {
        getResolution: getResolution,
        startCapturing: startCapturing,
        captureVideoFrame: captureVideoFrame
    }
})();
