var cfenv = require('cfenv');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require("mysql");
var q = require('q');

var facebook = require("./modules/channel_facebook.js");
var html5 = require("./modules/channel_html5.js");

// create connection
var pool = mysql.createPool({
    connectionLimit : 5000,
    host     : '169.53.247.180',
    port     : Number(9123),
    user     : 'everis',
    password : 'everis123',
    database : 'sesionfacebot'
});

var app = express();
app.use(cors({origin: '*'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

app.get('/consultasado', function (req, res) {
    res.send('This is TestBot Server');
	
	
});



app.get('/consulta', function (req, res) {
	//req.query['numero'];
	var numero = req.query['numero'];
	
	  var data = {
		  rut: {},
		  numero: {},
		  nombre:{},
		  saldoMin: {},
		  saldoSms: {},
		  saldoDatos:{},
		  			  cliente: {},
			  mensaje: {}
	  };
	  
	  
	  if(numero == "98379234"){
			  var data = {
			  rut: "11.098.876-0",
			  numero: "98379234",
			  nombre: "Claudia Donoso",
			  saldoMin: "00",
			  saldoSms: "537",
			  saldoDatos: "89",
			  cliente: "1",
			  mensaje: "NA"
		  };
		  
	  }else if (numero == "98765432")	{
		  var data = {
		  rut: "17.098.876-0",
		  numero: "98765432",
		  nombre: "Camilo Perez",
		  saldoMin: "00",
		  saldoSms: "567",
		  saldoDatos: "89",
		  cliente: "1",
		  mensaje: "NA"
	  };
		  
		  
	  }else if (numero == "98765431"){
		  		  var data = {
				  rut: "18.098.876-0",
				  numero: "98765431",
				  nombre: "Carlos Lopez",
				  saldoMin: "678",
				  saldoSms: "587",
				  saldoDatos: "89",
				  cliente: "1",
				  mensaje: "NA"
			  };
		  
	  }else{
		  var data = {
				  rut: "NA",
				  numero: "NA",
				  nombre: "NA",
				  saldoMin: "NA",
				  saldoSms: "NA",
				  saldoDatos: "NA",
				  cliente: "0",
				  mensaje: "Lo lamento, sus datos no figuran en nuestros registros"
			  };
		  
	  }

	      res.send(data);

});

function updateMessage(input, response) {
  var deferred = q.defer();
  var responseText = null;
  var contenido = "";
  var contenido1 = "";
  var contenido2 = "";
  var rut = "";
  var numero = "";
  var nombre = "";
  var saldoMin = "";
  var saldoSms= "";
  var saldoDatos = "";
  var id = null;
  var codIntent = "";
  var dialogStack = "";
  
   console.log("UPDATE MENSAJE actualizado "+numero);
  if ( !numero ) {
    response.saldoMin = 'no exite req';
  } else {
			 console.log("paso por ak");
			 console.log("DATO DE ENTRADA "+numero);

			//ini
						obtenerContenido(codIntent).then(function(respMysql){
							console.log("depues de consultar a la bd:: ");
								  if(respMysql.length > 0){
										contenido = respMysql[0].saldoMin;
										
									     if(contenido.length > 0){
											    console.log("CONTENIDO OBTENIDO "+contenido);
													  response.saldoMin =  contenido;
													  response.rut = respMysql[0].rut;
													  response.nombre = respMysql[0].nombre;
													  response.saldoSms = respMysql[0].saldoSms;
													  response.saldoDatos = respMysql[0].saldoDatos;
													 // response.numero = respMysql[0].numero;
												      deferred.resolve(response);
									    }		
									}else{
										response.saldoMin =  '123';
										deferred.resolve(response);
									}
										
								}, function(error){
								throw err;
								deferred.reject(err);
								console.log('mysql error: '+error);
							 });
			//fin
  }
   return deferred.promise;
}

var obtenerContenido = function (codIntent){
    var defer = q.defer();
	var numero = '8379234';
    var query = 'SELECT * FROM saldo where numero='+numero;
    clienteMysql(query).then(function(response) {
        defer.resolve(response);
    }, function(error){
        defer.reject(error);
    });
    return defer.promise;
}

var clienteMysql = function(query){
    var deferred = q.defer();
    pool.getConnection(function(err, connection){
        if(!err){
            connection.query(query, function(error, rows) {
                if(!error){
                    deferred.resolve(rows);
                }else{
                    deferred.reject(error);
                }
            });
        }else{
            deferred.reject(err);
        }
        try {
            connection.release();
        }
        catch(err) {
            console.log('Error: '+err.message);
        }
    });
    return deferred.promise;
}

app.get('/', function (req, res) {
    res.send('This is TestBot Server prueba');
});

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    facebook.request(req,res);
});

app.post('/apichat', function (req, res) {
    html5.request(req,res);
});