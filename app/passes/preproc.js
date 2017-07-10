function PreProcPass(width, height){

    var scene = null;
    var camera = null;
    var target = null;
    var uniforms = {

    };

    return {
        name: "preproc",
        getTexture: function(){
            return target;
        },
        init: function(width, height, app){
            scene = new THREE.Scene();
            camera = initOrthographicCamera(width, height);
            scene.add(camera);
            target = new THREE.WebGLRenderTarget(width, height, {
                minFilter: THREE.LinearFilter,
                stencilBuffer: false,
                depthBuffer: false
            });

            app.videoFrameCanvas.width = width;
            app.videoFrameCanvas.height = height;

            uniforms.texture1 = {
                value: app.videoFrameTexture
            };
            uniforms.resolution = {
                value: new THREE.Vector2(height, width)
            };
            uniforms.colorWhite = {
                value: new THREE.Vector4(255,255,255,255)
            };
            uniforms.colorBlack = {
                value: new THREE.Vector4(0,0,0,255)
            };

            initPass(scene, width, height, "preproc", uniforms);
        },
        render: function(renderer) {
            renderer.render(scene, camera, target, true);
        }
    };
};
