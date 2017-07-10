

function initOrthographicCamera(width, height){
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
    };

    return new THREE.OrthographicCamera (
        _viewport.left,
        _viewport.right,
        _viewport.top,
        _viewport.bottom,
        _viewport.near,
        _viewport.far
    );
}

function initPass(scene, width, height, shader, uniforms){

    var geometry = new THREE.PlaneGeometry( width, height);
    var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shadersHolder[shader].vertex,
        fragmentShader: shadersHolder[shader].fragment
    });

    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    return {
        geometry: geometry,
        material: material,
        mesh: mesh
    }
}



