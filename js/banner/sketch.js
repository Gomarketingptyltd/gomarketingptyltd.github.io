var diam = 60;
var diam_02 = 50;
var inOut = true;

function setup() {
  createCanvas(180, 160);
}

function draw() {
  clear();
	background(0, 0.1);
  //background(0);
  stroke(220);
  strokeWeight(1);
  noFill();
	ellipse(70, 90,diam)
	
	if(diam > 70){
	inOut = false;
	}
	
	if(diam < 40){
	inOut = true;
	}
	
	if(inOut){
	diam+=0.15
	}
	
	if(!inOut){
	diam-=0.15     
	}
  strokeWeight(3);
  ellipse(100,70,diam_02)
	
	if(diam_02 > 70){
	inOut = false;
	}
	
	if(diam_02 < 40){
	inOut = true;
	}
    	if(inOut){
	diam_02+=0.05
	}
	
	if(!inOut){
	diam_02-=0.05     
	}	
 
}