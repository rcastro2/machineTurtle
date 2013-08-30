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
	var demo = [
	["011001110110111100100000001100010011000000110000","011100100111010000100000001100010011001000110000","011001110110111100100000001100010011000000110000","011100100111010000100000001100010011001000110000","011001110110111100100000001100010011000000110000",""],
	["011001110110111100100000001100010011000000110000","0111010001101111001000000011010100110000001000000011010100110000","0111001001110100001000000011100100110000","011001110110111100100000001100010011000000110000",""],
	["0110011101101111001000000011010100110000","0111001001110100001000000011011100110010","01110111011001000010000000110010","0110011101101111001000000011010100110000","0111001001110100001000000011011100110010","01110111011001000010000000110011","0110011101101111001000000011010100110000","0111001001110100001000000011011100110010","01110111011001000010000000110100","0110011101101111001000000011010100110000","0111001001110100001000000011011100110010","01110111011001000010000000110101","0110011101101111001000000011010100110000","0111001001110100001000000011011100110010",""],
	["0111011101100100001000000011001100110101","011000110111001000100000011100100110010101100100","011001110110111100100000001100100011000000110000",
"01110100011011110010000000110000001000000011001100110101","01100011011100100010000001100010011011000111010101100101","011001110110111100100000001100100011000000110000","01110100011011110010000000110000001000000011100100110011","0111011101100100001000000011100000110000",
"011000110111001000100000011110010110010101101100011011000110111101110111","011001110110111100100000001100100011000000110000",""]
	]
	var viewDemo = true, stopDemo=false, posD, t, currentDemo;
	function resetDemo(){
		viewDemo = true; stopDemo=false;
		init();runDemo();
	}
	function runDemo(){
		if(viewDemo){
			context.fillText("Demo: " + (currentDemo+1), 10, 20);
			$("#program").val(demo[currentDemo][posD]);
			translatecode(demo[currentDemo][posD]);
			posD++;
			if(posD == demo[currentDemo].length){ 
				init();
			}
			t=setTimeout(function(){runDemo()},1000)	
		}
		
	}
	function checkDemo(){
		if(!stopDemo){
			stopDemo = true; viewDemo = false;clearTimeout(t);
			init();
		}
	}
    var canvas;
    var context;
    var heading, pensize, pencolor,penup, cx, cy;
    function init(){
		currentDemo = Math.floor((Math.random() * demo.length));
		compiledbinary = "";
		$("#compiledprogram").html(""); $("#program").val("");
	    posD = 0;
        canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d'); 
	  	context.clearRect(0, 0, canvas.width, canvas.height);
	  	heading = 0; pensize = 1; penup = false; pencolor = 'black'; cx = 210; cy = 150;  
		context.fillStyle = "blue";
  		context.font = "bold 16px Arial";
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
			cx = 210 + parseInt(code.substring(space1,space2))
			cy = 150 - parseInt(code.substring(space2))
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
		compiledbinary += binarycode + "\n";
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
	function viewBinary(){
		var build = "<br/>Binary instructions of programs may be copied from this area as well as pasted and ran.<br/><br/><textarea id='programlist'>" + compiledbinary + "</textarea><br/><input type='button' value='Run' onclick='runProgram()'>";
		loadwindow(build,650,370,'Binary')	
	}
	function runProgram(){
		var p = $("#programlist").val();
		var pl = p.split('\n');
		var n;
		init();
		$("#dialog").dialog("close");
		for(n = 0; n < pl.length; n++){
			translatecode(pl[n]);
		}
	}
	function loadwindow(msg, w, h, t) {
            $('#dialog').html(msg); $('#dialog').dialog("option", "width", w); $('#dialog').dialog("option", "height", h);
            $('#dialog').dialog('option', 'title', t); $('#dialog').dialog('open');
    }