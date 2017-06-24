uniform sampler2D texture1;
varying vec2 vUv;

vec4 getColor(vec4 color){
	float colorRange = 0.1;

	float colorVal =  color.r + color.g + color.b;
	
	float rg = abs(color.r - color.g) > colorRange ? 1.0 : 0.0;
	float gb = abs(color.g - color.b) > colorRange ? 1.0 : 0.0;
	float br = abs(color.b - color.r) > colorRange ? 1.0 : 0.0;
	
	float s = (rg + gb + br);
	vec4 c = vec4(0.0);
	if(s == 0.0){		
		
		if(colorVal > 2.5){
			c = vec4(1.0,1.0,1.0 , 1.0); // Displays Nothing	
		}
		else if(colorVal > 1.0)
		{
			return vec4(0.5,0.5,0.5 , 1); // Displays Nothing	
		}
		else if(colorVal < 0.2)
		{
			c = vec4(0.0, 0.0, 0.0, 1.0); // Displays Nothing	
		}
		else
		{
			c = vec4(0.2,0.2,0.2 , 1.0); // Displays Nothing	
		}
	}			
	return c;
}


void main() {
	vec2 uv = vUv;

	vec3 color = texture2D(texture1, uv).rgb;
	gl_FragColor = getColor(vec4(color,0));			
	
		
	//}
	/*else if(s == 1.0){
		gl_FragColor = vec4(0.7,0.7,0.7 , 1); // Displays Nothing	
	}
	else if(s == 2.0){
		gl_FragColor = vec4(0.3,0.3,0.3 , 1); // Displays Nothing	
	}*/
	/*else{
		gl_FragColor = vec4(0, 0, 0.2, 1); // Displays Nothing	
	}*/

	//gl_FragColor = vec4(color, 1); // Displays Nothing	
}
