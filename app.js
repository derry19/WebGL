var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'unifrom mat4 mWorld',
'unifrom mat4 mView',
'unifrom mat4 mProj',
'',
'void main()',
'{',
'	fragColor = vertColor;',
'	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');


var InitDemo = function() {
	console.log("This is a test");

	var canvas = document.getElementById("game-surface");

	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log("Webgl not supported, falling back on experimental-webgl");
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert("Your brower does not support WebGL");
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

    //compile shaders
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	//use together 
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program', gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR linking program', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var triangleVertices = 
	[ // X, Y          R, G, B
		0.0, 0.5,      1.0, 1.1, 0.0,
		-0.5, -0.5,    0.7, 0.0, 1.0,
		0.5, -0.5,     0.1, 1.0, 0.6      
	];

	var triangleVerticesBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVerticesBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation,  //Attribute location
		2, //Number of elements per attribute
		gl.FLOAT,	//Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,  //size of an individual vertex
		0	// Offset from the beginning of a single vertex to this attribute
		);
	gl.vertexAttribPointer(
		colorAttribLocation,  //Attribute location
		3, //Number of elements per attribute
		gl.FLOAT,	//Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT,  //size of an individual vertex
		2 *	Float32Array.BYTES_PER_ELEMENT// Offset from the beginning of a single vertex to this attribute
		);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
    
	//render loop
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);


	// canvas.width = window.innerWidth;
	// canvas.height= window.innerHeight;
	// gl.viewport(0,0,window.innerWidth, window.innerHeight);

};
