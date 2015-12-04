$(function () {

//variables globales-----
	var tamCTablero = 40;  // 26 tamaño en columnas para el tablero de juego
	var tamFTablero = 40;  // 15 tamaño en filas para el tablero de juego
	var comidaF;    //posicion en fila para situar la comida
	var comidaC;    //posicion en columna para situar la comida
	var colorComida = "#888800";
	var direccion = 2;  //direccion serpiente. 1=arriba,2=derecha,3=abajo,4=izquierda
	var posisACrecer = 0;   //variable que guarda cuantos cuadraditos ha de crecer la serp
	var puntos = 0; //puntuacion obtenida

	var serpF = [];    //posiciones en filas para las posis de la serpiente
	var serpC = [];    //posiciones en cols para las posis de la serpiente
//todas las posiciones del tablero que "son" serpiente se guarda en estos 2 arays. Se podria haber hecho en una matriz de 2 dimensiones

//inicializo la serpiente con 3 posiciones o cuadraditos de larga
	serpF[0] = 10;
	serpF[1] = 10;
	serpF[2] = 10;
	serpC[0] = 5;
	serpC[1] = 4;
	serpC[2] = 3;


	function aleatorio(inferior, superior) {//devuelve num aleatorio
		var numPosibilidades = superior - inferior;
		var aleat = Math.random() * numPosibilidades;
		aleat = Math.round(aleat);
		return parseInt(inferior) + aleat;
	}

//genera la comida mirando de no posicionarla en una pos ocupada x l serp
	function generaPapeo() {
		var generadoOK = false;
		var cont;
		var longSerp = serpF.length;

		while (generadoOK == false) {
			cont = 0;
			comidaF = aleatorio(0, tamFTablero);
			comidaC = aleatorio(0, tamCTablero);
			while ((comidaF != serpF[cont] || comidaC != serpC[cont]) && cont < longSerp) {
				cont++
			}
//si contador es menor q la longitud del array (serp), se ha de repetir la posicion xq le ha tocado una pos ocupada por la serp
			generadoOK = cont >= longSerp;
		}
		$('#' + comidaF + "-" + comidaC).addClass('comida');
	}

//captura tecla y asigana el valor a la variable direccion
	$(document.body).keydown(function (e) {
		var keyCode = e.keyCode || e.which,
			arrow = {left: 37, up: 38, right: 39, down: 40 };

		switch (keyCode) {
			case arrow.left:
				direccion = 4;
				break;
			case arrow.up:
				direccion = 1;
				break;
			case arrow.right:
				direccion = 2;
				break;
			case arrow.down:
				direccion = 3;
				break;
		}
	});


//dibuja el tablero. tanto la comida, como la serpiente son celdas
	function pintaTablero(filas, cols) {
		var $table = $('<table width="100%" border="0" cellspacing="0" cellpadding="0" id="tablero" />');
		for (var f = 0; f < filas; f++) {
			var $tr = $('<tr/>');
			$table.append( $tr );
			for (var c = 0; c < cols; c++) {
				$tr.append('<td id="' + f + '-' + c + '"></td>');
			}
		}
		$('section.content').empty().append($table);
	}

//recorre los arrays de la serp(sus posiciones en tablero) y las pinta
	function pintaSerp() {
		for (var i = 0; i < serpF.length; i++) {
			$('#' + serpF[i] + "-" + serpC[i]).removeClass().addClass('serpiente');
		}
		$('#' + serpF[0] + "-" + serpC[0]).addClass('cabeza d' + direccion);
	}

	function colisionSerp() {
		// miro si la cabeza de la serp choca con su cola
		var cont = 1; //empiezo a contar desde la pos 2 del array serp,porque logicamente la cabeza no puede chocar con su propia cabeza
		var longSerp = serpF.length - 1;

		while ((serpF[0] != serpF[cont] || serpC[0] != serpC[cont]) && cont <= longSerp) {
			cont++
		}
		return !(serpF[0] != serpF[cont] || serpC[0] != serpC[cont]);
	}

	function pisadoPosProhibida() {
//miro si la serp se come la comida o choca con fin tablero o ella misma
		if (serpF[0] == comidaF && serpC[0] == comidaC) {
			puntos = puntos + 20;
			$("#puntos").text( puntos );
			posisACrecer = 3;
			generaPapeo()
		} else if (colisionSerp() == true) {
			return true
		} else if (serpF[0] > tamFTablero || serpF[0] < 0 || serpC[0] > tamCTablero || serpF[0] < 0) {
			return true
		}
	}

//muevo la cabeza(posiciones 0 de los 2 arrays)de la serp pa arriba,abajo,izq o der
	function direccionaSerp() {
		if (direccion == 1) {
			serpF[0] = serpF[0] - 1;    //movimiento hacia arriba
		} else if (direccion == 2) {
			serpC[0] = serpC[0] + 1;    //movimiento hacia derecha
		} else if (direccion == 3) {
			serpF[0] = serpF[0] + 1;    //movimiento hacia abajo
		} else {
			serpC[0] = serpC[0] - 1;    //movimiento hacia izquierda
		}
	}

	function mueveSerp() {
		var numTemp;    //variable auxiliar
		if (posisACrecer > 0) {
			posisACrecer = posisACrecer - 1;
			numTemp = 0
		} else {
			$('#' + serpF[serpF.length - 1] + "-" + serpC[serpF.length - 1]).removeClass();
			numTemp = 1
		}
		var longSerp = serpF.length - numTemp;

//muevo hacia arriba los valores de los arrays (movimiento serp)
		for (var i = longSerp; i != 0; i--) {
			serpF[i] = serpF[i - 1];
			serpC[i] = serpC[i - 1]
		}

		direccionaSerp();

		if (pisadoPosProhibida() == true) {
//si esto ocurre mato temporizador
			window.clearInterval(init);
			alert("Game Over.");
			$('#pausarContinuar').hide();
		} else {
			pintaSerp()
		}
	}


//cada 130 mi1isegs se llama a mueveSerp, es como si fuera el programa principal
	var init = 0;
	function iniciar( ) {

		comidaF = 0;    //posicion en fila para situar la comida
		comidaC = 0;    //posicion en columna para situar la comida
		direccion = 2;  //direccion serpiente. 1=arriba,2=derecha,3=abajo,4=izquierda
		posisACrecer = 0;   //variable que guarda cuantos cuadraditos ha de crecer la serp
		puntos = 0; //puntuacion obtenida

		serpF = [];    //posiciones en filas para las posis de la serpiente
		serpC = [];    //posiciones en cols para las posis de la serpiente
//todas las posiciones del tablero que "son" serpiente se guarda en estos 2 arays. Se podria haber hecho en una matriz de 2 dimensiones

//inicializo la serpiente con 3 posiciones o cuadraditos de larga
		serpF[0] = 10;
		serpF[1] = 10;
		serpF[2] = 10;
		serpC[0] = 5;
		serpC[1] = 4;
		serpC[2] = 3;

//pinto el tablero de juego y pinto comida
		pintaTablero(tamFTablero + 1, tamCTablero + 1);
		generaPapeo();

		clearInterval( init );
		init = 0;

		$('#pausarContinuar').show().find('span').removeClass('glyphicon-pause').addClass('glyphicon-play');
		//pausarContinuar();
	}

	function pausarContinuar( ) {
		if( init != 0 ) {
			clearInterval( init );
			init = 0;
		}
		else {
			init = window.setInterval(mueveSerp, 130);
		}
	}
	iniciar();

	$('#pausarContinuar').click(function(){
		if( init == 0 )
			$(this).find('span').removeClass('glyphicon-play').addClass('glyphicon-pause');
		else
			$(this).find('span').removeClass('glyphicon-pause').addClass('glyphicon-play');

		pausarContinuar();
	});

	$('#reiniciar').click(function(){

		if( confirm('Reiniciar el juego?') )
			iniciar( );
	});
});