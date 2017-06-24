"use strict";
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var videoStream = null;
var preLog = document.getElementById('preLog');


function log(text)
{
	if (preLog) preLog.textContent += ('\n' + text);
	//else alert(text);
}

function snapshot()
{
	ctx.drawImage(video, 0, 0);
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
	if (video)
	{
		video.onerror = null;
		video.pause();
		if (video.mozSrcObject)
			video.mozSrcObject = null;
		video.src = "";
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
	video.onerror = function ()
	{
		log('video.onerror');
		if (video) stop();
	};
	stream.onended = noStream;
	if (window.webkitURL) video.src = window.webkitURL.createObjectURL(stream);
	else if (video.mozSrcObject !== undefined)
	{//FF18a
		video.mozSrcObject = stream;
		video.play();
	}
	else if (navigator.mozGetUserMedia)
	{//FF16a, 17a
		video.src = stream;
		video.play();
	}
	else if (window.URL) video.src = window.URL.createObjectURL(stream);
	else video.src = stream;
	myButton = document.getElementById('buttonSnap');
	if (myButton) myButton.disabled = false;
	myButton = document.getElementById('buttonStop');
	if (myButton) myButton.disabled = false;

	video.onplay = function(){
		setTimeout(function(){
			init();		
		},300);		
	}
}

function start()
{
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
	else if (!(video && canvas)) log('HTML context error!');
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


// Three JS




var width = window.innerWidth, height = window.innerHeight;

var size = 1024;
var camera, scene, renderer, geometry, texture, mesh;

var uniforms = {};

function init() {
	width = video.videoWidth;
	height = video.videoHeight;
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    
  
    scene = new THREE.Scene();
  
  
  
    var w = width;
	var h = height;
	var viewSize = h;
	var aspectRatio = w / h;

	var _viewport = {
		viewSize: viewSize,
		aspectRatio: aspectRatio,
		left: (-aspectRatio * viewSize) / 2,
		right: (aspectRatio * viewSize) / 2,
		top: viewSize / 2,
		bottom: -viewSize / 2,
		near: -1000,
		far: 1000
	}
	  

	camera = new THREE.OrthographicCamera ( 
		_viewport.left, 
		_viewport.right, 
		_viewport.top, 
		_viewport.bottom, 
		_viewport.near, 
		_viewport.far 
	);
    
  /*  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
    camera.position.z = 500;*/
  
	ctx.drawImage(video, 0, 0);
  
    scene.add(camera);
    texture = new THREE.Texture(canvas);
    
			
	uniforms = {
        texture1: { type: 't', value: texture }
    };
		
	
	var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shadersHolder.preproc.vertex,
        fragmentShader: shadersHolder.preproc.fragment
    });
	
  
    geometry = new THREE.PlaneGeometry( width, height );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
	
	setTimeout(function(){
		animate();	
	},10);	
}

function animate() {
    requestAnimationFrame(animate);

    snapshot();
  
    texture.needsUpdate = true;
//    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
}

loadShaders(function(){
	start();
});