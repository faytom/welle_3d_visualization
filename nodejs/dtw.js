var gestureLib =[];
	gestureLib.push({
		gestureName : "dTaps_0",
		template : [
			0.49625,0.62553,0.82401,0.85495,0.96141,0.86793,0.75385,0.44084,-0.31875,-0.40728,-0.39804,-0.50418,-0.657,-0.55583,-0.55088,-0.56016,-0.55801,-0.49592,-0.35842,-0.18678,0.19459,0.20344,0.29665,0.39878,0.60785,0.82268,0.93891,0.86208,0.71058,0.45023,0.35852,-0.29941,-0.40805,-0.47014,-0.52924,-0.67682,-0.51147,-0.42011,-0.40892,-0.30687,-0.27984,-0.17459,-0.1004,-0.065606
		]
	});
	gestureLib.push({
		gestureName : "dTaps_1",
		template : [
			0.67728,0.79852,0.80717,0.91371,0.82221,0.69142,0.50027,0.36057,-0.4206,-0.48929,-0.4959,-0.64319,-0.64326,-0.89532,-0.76885,-0.60876,-0.59325,-0.41068,-0.37598,-0.3089,0.32622,0.44617,0.66577,0.84897,0.70511,0.5985,0.52291,0.52927,0.52691,0.42645,0.37348,0.24686,0.1667,0.047126
		]
	});
	gestureLib.push({
		gestureName : "dTaps_2",
		template : [
			0.44691,0.49122,0.63853,0.74557,0.81917,0.92788,0.85239,0.80236,0.64285,0.41211,-0.42882,-0.55043,-0.54176,-0.55288,-0.62306,-0.72295,-0.70596,-0.69529,-0.77455,-0.66421,-0.56011,-0.38766,-0.21059,0.25127,0.49337,0.68405,0.83402,0.95588,0.88792,0.89878,0.91162,0.82484,0.634,0.41237,-0.36953,-0.46179,-0.51463,-0.65501,-0.75799,-0.65514,-0.66059,-0.68985,-0.6187,-0.54967,-0.5032,-0.42138,-0.35618,-0.24364,-0.14302,-0.074685,-0.0043736
		]
	});
	gestureLib.push({
		gestureName : "Tap",
		template : [
			0.40213,0.41727,0.41727,0.44325,0.62932,0.87872,0.49933,0.27021,-0.26344,-0.39476,-0.52125,-0.51493,-0.62026,-0.62285,-0.62145,-0.75647,-0.59626,-0.49,-0.41754,-0.32985,-0.25705,-0.16851,-0.12081,-0.088906,-0.060136
		]
	});
	gestureLib.push({
		gestureName : "Push_0",
		template : [
			0.50778,0.65641,0.67532,0.88272,0.82345,0.84292,0.82562,0.97849,0.98791,0.90302,0.93035,0.76474,0.54695,0.34636,0.21919,0.14022,0.078706
		]
	});
	gestureLib.push({
		gestureName : "Push_1",
		template : [
			0.68879,0.79713,0.87913,0.98386,0.96379,0.88778,0.86052,0.76576,0.69726,0.67291,0.67666,0.60354,0.53748,0.4764,0.40184,0.29854,0.23706,0.18336
		]
	});
	gestureLib.push({
		gestureName : "Pull_0",
		template : [
			-0.49249,-0.65464,-0.78291,-0.89077,-0.84174,-0.98191,-0.99569,-0.96514,-0.83865,-0.76,-0.6305,-0.50306,-0.41284,-0.3031,-0.19367,-0.12263,-0.092536,-0.028136
		]
	});
	gestureLib.push({
		gestureName : "Pull_1",
		template : [
			-0.7361,-0.72738,-0.86241,-0.79497,-0.94887,-0.97403,-0.97688,-0.92205,-0.97032,-0.86513,-0.80406,-0.80359,-0.82047,-0.73731,-0.68315,-0.58505,-0.53367,-0.4343,-0.36985,-0.29152,-0.21716,-0.15056
		]
	});
	gestureLib.push({
		gestureName : "Wave",
		template : [
			0.4004,0.56725,0.7036,-0.80818,-0.91681,-0.88548,-0.903,-0.719,-0.40054,0.34669,0.40375,0.58343,0.82235,0.71408,0.62525,-0.61036,-0.39654,-0.2532,0.2655,0.41006,0.60131,0.70924,0.68256,-0.82893,-0.86566,-0.92256,-0.83269,-0.68744,-0.47357,-0.34265,0.33834,0.45129,0.59821,0.65709,0.79046,0.6699,0.53401,-0.54924,-0.37105,-0.24918,-0.15955,-0.10486,-0.083592,-0.073898,-0.051617,0.0029439
		]
	});
	gestureLib.push({
		gestureName : "Tap",
		template : [
			0.64858,0.93367,0.99725,0.98951,0.79196,0.52746,0.3492,-0.39104,-0.29452,-0.22387,-0.22939,-0.17868,-0.11453
		]
	});
	gestureLib.push({
		gestureName : "Wave2",
		template : [
			0.33831,0.32992,0.4374,0.54583,0.81582,0.61419,0.41079,-0.74349,-0.86444,-0.66773,-0.5079,-0.34795,-0.28291,0.38421,0.58306,0.83732,0.9609,0.85405,0.73531,0.69287,-0.48366,-0.43453,-0.26376,0.20148,0.27326,0.27078,0.37428,0.44222,-0.52409,-0.56803,-0.67259,-0.47704,-0.39245,-0.32625,-0.24706,-0.17576,-0.11668,-0.092432,-0.078186,-0.058431
		]
	});
function getArrayElement(array, x, y, xsize, ysize){
	return array[x * ysize + y];
};
function setArrayElement(array, x, y, xsize, ysize, value){
	array[x *ysize + y] = value;
};
function getDTW(data, template){
	/*Compute distance matrix*/
  var VERY_BIG = 1000000000;
  var xsize = data.length;
  var ysize = template.length;
  var x = data;
  var y = template;
  var Dist = [xsize * ysize];
  var globdist = [xsize * ysize];
  var move = [xsize * ysize];
  var temp = [xsize * 2 * 2];
  var warp = [xsize * 2 * 2];

  for(var i=0;i<xsize;i++) {
    for(var j=0;j<ysize;j++) {
      var total = 0;
      if(x[i].X){
      	total = ((x[i].X - y[j].X) * (x[i].X - y[j].X) + (x[i].Y - y[j].Y) * (x[i].Y - y[j].Y));
      	total = Math.sqrt(total);
      }
      else{
	  	total = ((x[i] - y[j]) * (x[i] - y[j]));
      }

      setArrayElement(Dist, i, j, xsize, ysize, total);
      //Dist[i][j] = total;

      // if (debug == 1){
      // 	//fprintf(debug_file,"Dist: %d %d %.0f %.0f\n",i,j,total,Dist[i][j]);
      // 	console.log("Dist: " + getArrayElement(Dist, i, j, xsize, ysize));
      // } 
    }
  }
  // fprintf(stdout,"Warping in progress ...\n");
  // console.log("Warping in progress....");

  /*% for first frame, only possible match is at (0,0)*/
  setArrayElement(globdist, 0, 0, xsize, ysize, getArrayElement(Dist, 0, 0, xsize, ysize));
  // globdist[0][0] = Dist[0][0];

  for(var j=1; j<xsize; j++){
  	//set globdist x compenent very big
  	setArrayElement(globdist, j, 0, xsize, ysize, VERY_BIG);
    // globdist[j][0] = VERY_BIG;
  }
  
  setArrayElement(globdist, 0, 1, xsize, ysize, VERY_BIG);	
  // globdist[0][1] = VERY_BIG;
  setArrayElement(globdist, 1, 1, xsize, ysize, (getArrayElement(globdist, 0, 0, xsize, ysize) + getArrayElement(Dist, 1, 1, xsize, ysize) ));	
  // globdist[1][1] = globdist[0][0] + Dist[1][1];
  setArrayElement(move, 1, 1, xsize, ysize, 2);
  //move[1][1] = 2;

  for(var j=2;j<xsize;j++){
  	setArrayElement(globdist, j, 1, xsize, ysize, VERY_BIG);
    // globdist[j][1] = VERY_BIG;
  }
  	
  for(var i=2;i<ysize;i++) {
  	setArrayElement(globdist, 0, i, xsize, ysize, VERY_BIG);
  	// globdist[0][i] = VERY_BIG;
  	setArrayElement(globdist, 1, i, xsize, ysize, (getArrayElement(globdist, 0, i - 1, xsize, ysize) + getArrayElement(Dist, 1, i, xsize, ysize)));
  	// globdist[1][i] = globdist[0][i-1] + Dist[1][i];

  	// if (debug == 1){
  	// 	fprintf(debug_file,"globdist[2][%d] = %.2e\n",i,globdist[2][i]);
  	// }
  	  

  	for(var j=2;j<xsize;j++) {
  		//allowance transition: horizontal Diagonal X 2, note that all transitions move one step to the right, ensuring that each input frame gets
  		//used exactly once along any path
  		var top = getArrayElement(globdist, j, i-1, xsize, ysize) + getArrayElement(Dist, j, i, xsize, ysize);
  		// var top = globdist[j-1][i-2] + Dist[j][i-1] + Dist[j][i];
  		var mid = getArrayElement(globdist, j-1, i-1, xsize, ysize) + getArrayElement(Dist, j, i, xsize, ysize);
  		// var mid = globdist[j-1][i-1] + Dist[j][i];
  		var bot = getArrayElement(globdist, j-1, i, xsize, ysize) + getArrayElement(Dist, j, i, xsize, ysize);
  		// var bot = globdist[j-2][i-1] + Dist[j-1][i] + Dist[j][i];
  		var cheapest;
  		var I = 0;
  		if( (top < mid) && (top < bot) ){
    		cheapest = top;
    		I = 1;
  		}
  	  	else if (mid < bot){
    		cheapest = mid;
    		I = 2;
  		}
  	 	else {
        	cheapest = bot;
  		    I = 3;
  		}

      /*if all costs are equal, pick middle path*/
      if( ( top == mid) && (mid == bot) ){
        I = 2;
      }
  	    setArrayElement(globdist, j, i, xsize, ysize, cheapest);
  	    setArrayElement(move, j, i, xsize, ysize, I);
    }
  }

	var X = ysize - 1, Y = xsize - 1, n = 0;
//   X = ysize-1; Y = xsize-1; n=0;
	setArrayElement(warp, n, 0, xsize * 2, 2, X);
	setArrayElement(warp, n, 1, xsize * 2, 2, Y);
// warp[n][0] = X; warp[n][1] = Y;
	
	while( X > 0 && Y > 0){
		n = n + 1;
		//while (X > 0 && Y > 0) {
		//n=n+1;

		if( getArrayElement(move, Y, X, xsize, ysize) == 1)
		//if (move[Y] [X] == 1 )
		{
			setArrayElement( warp, n, 0, xsize * 2, 2, X - 1);
			setArrayElement( warp, n, 1, xsize * 2, 2, Y);
			// warp[n][0] = X-1; warp[n][1] = Y;
			n = n + 1;
			// n=n+1;
			X = X - 1;
			Y = Y ;
			// X=X-2; Y = Y-1;
		}
		else if( getArrayElement(move, Y, X, xsize, ysize) == 2)
		//else if (move[Y] [X] == 2)
		{
			X = X - 1,
			Y = Y - 1;
			//X=X-1; Y = Y-1;
		}
		else if( getArrayElement(move, Y, X, xsize, ysize) == 3)
		//else if (move[Y] [X] == 3 )
		{
			setArrayElement( warp, n, 0, xsize * 2, 2, X);
			//warp[n] [0] = X;
			setArrayElement( warp, n, 1, xsize * 2, 2, Y - 1);
			//warp[n] [1] = Y-1; 
			n = n + 1;
			//n=n+1;
			X = X ;
			Y = Y - 1;
			//X=X-1; Y = Y-2;
	     }
		else {
			console.log("Error: move not defined " + X + " " + Y);
			break;
			//fprintf(stderr,"Error: move not defined for X = %d Y = %d\n",X,Y); 
		}
		setArrayElement(warp, n, 0, xsize * 2, 2, X);
		setArrayElement(warp, n, 1, xsize * 2, 2, Y);
		// warp[n] [0] =X;
		// warp[n] [1] =Y;
	}




	/*flip warp*/
	for (var i=0;i<=n;i++) {
		setArrayElement( temp, i, 0, xsize * 2, 2, getArrayElement(warp, n-i, 0, xsize * 2, 2));
		setArrayElement( temp, i, 1, xsize * 2, 2, getArrayElement(warp, n-i, 1, xsize * 2, 2));
	  // temp[i][0] = warp[n-i][0];
	  // temp[i][1] = warp[n-i][1];
	}

	for (var i=0;i<=n;i++) {
		setArrayElement( warp, i, 0, xsize * 2, 2, getArrayElement(warp, i, 0, xsize * 2, 2));
		setArrayElement( warp, i, 1, xsize * 2, 2, getArrayElement(warp, i, 1, xsize * 2, 2));
	  // warp[i][0] = temp[i][0];
	  // warp[i][1] = temp[i][1];
	}

	// for( var i = 0; i <= n; i++){
	// 	console.log("move: " + (Number(getArrayElement(warp, i, 0, xsize * 2, 2)) + 1) + " " + (Number(getArrayElement(warp, i, 1, xsize * 2, 2)) + 1));
	// }
  //console.log("global cost: " + getArrayElement(globdist, xsize - 1, ysize - 1, xsize, ysize));
  //return getArrayElement(globdist, xsize - 1, ysize - 1, xsize, ysize);
  return {
  	warp : warp,
  	length : n,
  	cost : (getArrayElement(globdist, xsize - 1, ysize - 1, xsize, ysize) / xsize)
  }
}

module.exports = getDTW;
