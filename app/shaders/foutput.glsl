uniform sampler2D texture1;
uniform vec4 colorWhite;
uniform vec4 colorBlack;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
	vec2 uv = vUv;
    vec4 color = texture2D(texture1, uv);
	gl_FragColor = color;
}
