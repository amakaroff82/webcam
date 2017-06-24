var vertexShaders       = $('script[type="x-shader/x-vertex"]');
var fragmentShaders     = $('script[type="x-shader/x-fragment"]');
var shadersLoaderCount  = vertexShaders.length + fragmentShaders.length;

var loaderColback = null;

window.shadersHolder = { 
	preproc:{
		vertex: '', 
		fragment: '' 
	}
};

function loadShader(shader, type) {
    var $shader = $(shader);

    $.ajax({
        url: $shader.data('src'),
        dataType: 'text',
        context: {
            name: $shader.data('name'),
            type: type
        },
        complete: processShader
    });
}

function processShader( jqXHR, textStatus, context ) {

    shadersLoaderCount--;
    shadersHolder[this.name][this.type] = jqXHR.responseText;

    if ( !shadersLoaderCount ) {
        shadersLoadComplete();
    }
}

function shadersLoadComplete() {
	if(loaderColback){
		loaderColback();
	}
}

function loadShaders(callback){

	loaderColback = callback;

	// Use a for loop if there is more than one
	for(var i = 0; i < vertexShaders.length; i++){
		loadShader( vertexShaders[i], 'vertex' );
	}

	for(var i = 0; i < vertexShaders.length; i++){
		loadShader( fragmentShaders[i], 'fragment' );
	}

}


