function OutputPass(){
    var scene = null;
    var camera = null;
    var uniforms = {
    };

    return {
        name: "output",
        init: function(width, height, app){
            scene = new THREE.Scene();
            camera = initOrthographicCamera(width, height);
            scene.add(camera);

            var texture = app.passes[0].getTexture();

            uniforms.texture1 = {
                value: texture //app.videoFrameTexture
            };
            uniforms.resolution = {
                value: new THREE.Vector2(height, width)
            };
            uniforms.colorWhite= {
                value: new THREE.Vector4(255,255,255,255)
            };
            uniforms.colorBlack= {
                value: new THREE.Vector4(0,0,0,255)
            };

            initPass(scene, width, height, "preproc", uniforms);
        },
        render: function(renderer) {
            renderer.render(scene, camera);
        }
    };
};
