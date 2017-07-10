"use strict";

var App = {
    renderer: null,
    passes: [],
    videoFrameCanvas: null,
    ctx: null,
    videoFrameTexture: null
};


var worker = new Worker('app/colorCorrection.js');
worker.onmessage = function (event) {
    console.log(event.data);
    //document.getElementById('result').textContent = event.data;
};



function init(width, height) {
    // renderer
    App.renderer = new THREE.WebGLRenderer();
    document.body.appendChild(App.renderer.domElement);
    App.renderer.setSize(width, height);

    // video capturing
    initCapturing();

    // add passes
    App.passes.push(new PreProcPass());
    App.passes.push(new OutputPass());

    for(var i = 0; i < App.passes.length; i++ ){
        App.passes[i].init(width, height, App);
    }

    // start
    setTimeout(function(){
		animate();	
	},10);	
}

function initCapturing(){
    App.videoFrameCanvas = document.getElementById('canvas');
    App.ctx = App.videoFrameCanvas.getContext('2d');
    App.videoFrameTexture = new THREE.Texture(App.videoFrameCanvas);
}

function animate() {
    requestAnimationFrame(animate);

    videoCapturing.captureVideoFrame(App.ctx);
    App.videoFrameTexture.needsUpdate = true;

    for(var i = 0; i < App.passes.length; i++ ){
        App.passes[i].render(App.renderer);
    }
}

loadShaders(function(){
    videoCapturing.startCapturing(function(w, h){
        var res = videoCapturing.getResolution();
        init(res.width, res.height);
	});
});