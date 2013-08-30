// JavaScript Document
    function StringBuilder(value){
		this.strings = new Array("");
		this.append(value);
	}
	// Appends the given value to the end of this instance.
	StringBuilder.prototype.append = function (value){
		if (value){
			this.strings.push(value);
		}
	}
	// Clears the string buffer
	StringBuilder.prototype.clear = function ()	{
		this.strings.length = 1;
	}	
	// Converts this instance to a String.
	StringBuilder.prototype.toString = function ()	{
		return this.strings.join("");
	}
	
    var canvas;
    var context;
    var heading, pensize, pencolor,penup, cx, cy;
    function init(){
        canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d'); 
	  	context.clearRect(0, 0, canvas.width, canvas.height);
	  	heading = 0; pensize = 1; penup = false; pencolor = 'black'; cx = 210; cy = 150;  
	}
	function myturn(deg){
		rad = deg * Math.PI / 180;
		heading += rad;	
	}
	function myline(length){
		context.beginPath();
		context.moveTo(cx, cy);
		cx = cx + length * Math.cos(heading)
		cy = cy + length * Math.sin(heading)
		if(!penup)
			context.lineTo(cx, cy);
		else
			context.moveTo(cx, cy);
		context.lineWidth = pensize;
		context.strokeStyle = pencolor.toString();
		context.stroke();
	}
	function processinstruction(code){
		if( code.indexOf("go") != -1){				
			start = code.indexOf(" ")+1
			length = parseInt(code.substring(start))
			myline(length)
		}
		else if( code.indexOf("rt") != -1){
			start = code.indexOf(" ")+1
			angle = parseInt(code.substring(start))
			myturn(angle)
		}
		else if( code.indexOf("lt") != -1){
			start = code.indexOf(" ")+1
			angle = parseInt(code.substring(start))
			myturn(-angle)
		}
		else if( code.indexOf("to") != -1){
			space1 = code.indexOf(" ")+1
			space2 = code.indexOf(" ",space1)+1
			angle = parseInt(code.substring(start))
			myturn(angle)
		}
		else if( code.indexOf("wd") != -1){
			start = code.indexOf(" ")+1
			pensize = parseInt(code.substring(start))
		}
		else if( code.indexOf("cr") != -1){
			start = code.indexOf(" ")+1
			pencolor = code.substring(start)
		}
		else if( code.indexOf("up") != -1){
			penup = true;
		}
		else if( code.indexOf("dn") != -1){
			penup = false;
		}
	}
	var	compiledbinary = "";
	function translatecode(binarycode){
		var build = new StringBuilder(),c;
		binarycode = binarycode.replace(/ /g,'');
		compiledbinary += binarycode + "<br/>";
		while (binarycode.length > 0){
			c = String.fromCharCode(parseInt(binarycode.substring(0,8).toString(),2))
			build.append(c);
			binarycode = binarycode.substring(8);	
		}
		compile(build.toString());
		document.getElementById("compiledprogram").innerHTML += build.toString() + "<br/>"; 
		
	}
	function compile(sequence){
		var repeatedinstructions = "", space1,space2,loops,iterations;
		var instructions = sequence.split('\n')
		
		for(pos = 0; pos < instructions.length; pos ++){
			code = instructions[pos];
			if( code.indexOf("repeat") != -1){
				space1 = code.indexOf(" ")+1
				space2 = code.indexOf(" ",space1)+1
				counter = code.substring(space1,space2-1)
				iterations = parseInt(code.substring(space2))
				loopinstruction = pos + 1
				while(instructions[loopinstruction].indexOf("next " + counter ) == -1){
					repeatedinstructions += instructions[loopinstruction] + "\n";
					loopinstruction++
				}
				loops = 1
				while(loops <= iterations){
					compile(repeatedinstructions);
					loops++;		
				}
				iterations = -1;
				repeatedinstructions = "" //Saw that I had to clear the repeated instruction.  Though it didn't crash the program I notice awkward results I couldn't explain
				pos = loopinstruction; //Had to advance position in the instruction array to the next instruction  after the loop
			}
			else{
				processinstruction(instructions[pos]);
			}			
		}				
	} 
	function loadwindow(msg, w, h, t) {
            $('#dialog').html(msg); $('#dialog').dialog("option", "width", w); $('#dialog').dialog("option", "height", h);
            $('#dialog').dialog('option', 'title', t); $('#dialog').dialog('open');
    }