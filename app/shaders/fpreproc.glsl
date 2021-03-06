uniform sampler2D texture1;
uniform vec4 colorWhite;
uniform vec4 colorBlack;
uniform vec2 resolution;

varying vec2 vUv;


void main() {
	vec2 uv = vUv;
    vec4 color = texture2D(texture1, uv);
	vec4 resColor = vec4(1.0,1.0,1.0,1.0);

    resColor *= texture2D(texture1, uv);

	color =  vec4(gl_FragCoord.x / 100.0, gl_FragCoord.y / 100.0, 1.0, 1.0);

	gl_FragColor = normalize(color);
}
