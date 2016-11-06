// Het maken van het globale object objectPositie, dit dient voor het opslaan van de huidige locatie en die nadien in de databank te steken
var objectPositie = {};

//Object map aanmaken de .setView is noodzakelijk anders krijg je geen map tezien enkel een grijs vlak
var objectMap = L.map('divMap').setView([51.21581,4.41241], 15);


// De map initialiseren bij het laden van de pagina, dit gebeurt via de onload event listener in de doby van de index pagina
function mapInitialiseren(){

	


// De layer aanmaken waar de map in weergegeven wordt 
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw'
			, 	{maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
				id: 'mapbox.streets'
// de layer waar de map op gemaakt is toevoegen aan het object
				}).addTo(objectMap);
	
//	L.marker([51.5, -0.09]).addTo(mymap);

// 	Maken van een cirkel, de coordinaten zijn het middenpunt van de cirkel
	var mickyPlace = L.circle([51.20095,4.39086], {
		color: '#594080',
		fillColor: '#5C4383',
		fillOpacity: 0.5,

// De radius is in meters weergegeven en bepaald hoe groot de cirkel moet zijn		
		radius: 20
		
// De cirkel aan het het map object toevoegen		
	}).addTo(objectMap);

mickyPlace.bindPopup("Micky's crib");
	
// Maken van een vierkant op de map, je kan meerdere hoeken toevoegen door gewoon een extra coordinaat erbij toe te voegen	
// Je moet deze niet in een variabele steken, maar in dit geval doe ik het om een popup aan toe te voegen, je kan evengoed .bindpopup hierachter doen
// Maar om het overzicht een beetje te behouden steek ik het in een variabele 
	var  vormAp = L.polygon(
// De coordinaten van de hoeken zijn de eerste parameter van de vorm
	[
		// hoek: Links boven
		[51.21538,4.40925],
		
		// hoek: Rechts boven
		[51.21546,4.41054],
		
		// hoek: Rechts onder
		[51.21438,4.41075],
		
		// hoek: Links onder
		[51.21418,4.40919]
		
	],
	{
// De extra attributen worden met {} achter de coordinaten toegevoegd		
		
// De color zorgt voor de klein van de omlijning
		color: '#B2000D',

// De fillColor zorgt voor de kleur die in de vulling van de vorm gebruikt wordt		
		fillColor: '#E00005',
		
// De fillOpacity wijzigt der transparantie van de opvul kleur 0 = volledig transparant , 1 = Niet transparant		
		fillOpacity: 0.8
	}
	
// Toevoegen van de vorm aan de map 	
		).addTo(objectMap);

// Popup toevoegen aan de vierkant die over de AP komt	
	vormAp.bindPopup("Ap Hogeschool Meistraat");
}


// Functie om de huidige locatie te krijgen
function getlocation() {

	
// Navigator.geolocation.getcurrentposition is een functie die uw huidige locatie terug haalt 
// En je kan ermee de breedtegraad & lengtegraad terughalen  
	navigator.geolocation.getCurrentPosition(
			
// De functie positie is de functie wanneer de browser een succes melding terug krijgt met het terughalen van de huigige locatie
			function(positie)
				{
	
// Lengtegraad en breedtegraad worden in het globale object objectPositie gestoken. 
// Positie is de parameter die de succesfunctie meegeeft, .coords.longitude en .coords.latitude kan je aanspreken door geolocation
					objectPositie.lengtegraad = positie.coords.longitude;
					objectPositie.breedtegraad = positie.coords.latitude;

// Aan het object objectMap ga een layer toevoegen met uw pin van uw huidige locatie
// Deze locatie haalt hij terug via het globaal object objectPositie
					objectMap.addLayer(L.marker([objectPositie.breedtegraad, objectPositie.lengtegraad]).bindPopup('<b>Uw huidige positie</b>'));
					
// De setView zorgt ervoor dat de map op een bepaalde locatie gefocused is, deze locatie haalt hij van het globaal object objectPositie					
					objectMap.setView([objectPositie.breedtegraad, objectPositie.lengtegraad], 17);
				},
				
// Dit is de functie die aangeroepen wordt in het geval dat de geolocation geen locatie terug krijgt				
			function(fout)
				{
					
// De fout wordt op de console weergegeven, dit is enkel te zien voor de developers.					
					console.log(fout);
				}
											)										
					}		
// Functie voor het delen van de locatie ( locatie wordt op couchdb opgeslagen
function delen(){

// Een variabele naam, waar dat de naam word in opgeslagen die uit het input veld komt
	var naam = $("#naam").val();

// Controle of naam is ingevuld
	if(naam){

// Controle of de locatie is bepaald (kon evengoed objectPositie.breedtegraad gebruiken ) 
		if(objectPositie.lengtegraad)
				{

// Object voor de gebruiker waar dat alle data samenkomt creeeren, deze wordt nadien naar een JSON bestand over gezet. 
							var objectGebruiker = 	{
									
// De data moet op deze manier opgeslagen worden in het object, anders kan hij deze niet naar een JSON over zetten. 									
														"naam": naam,
														"locatie": [objectPositie.breedtegraad, objectPositie.lengtegraad]			
													};
							
// Ajax gebruiken om de data naar de databank te posten							
											$.ajax({
														type: "POST",
														
														// URL van couchdb, LET OP ! Deze url kan je niet overkopieren
														url: "http://127.0.0.1:5984/oefening_leaflet",
														
														// Data van het object objectGebruiker overzetten naar een JSON bestand
														data: JSON.stringify(objectGebruiker),
														contentType: "application/json",
														
														// Functie als het uploaden geslaagd is
														success: function(){console.log("Successvol geupload")},
														
														// Functie als het uploaden gefaald is
														error: function(){console.log("Gefaald in uploaden")}
													});
				}
// Als er geen locatie bepaald kan worden wordt er een boodschap in de console weer gegeven
		else
				{
							console.log("Gefaald in terug halen locatie");
				}
			}

// Als er geen naam is ingegeven wordt er een boodschap weergegeve in de console
	else
			{
				console.log("Geen naam ingegeven");
			}
				}

// Alle locaties in CouchDB laden en weergeven
function laatZien(){

// Connectie maken met CouchDB	
	$.ajax({
		type: "GET",
		
// URL Van de Databank LET OP ! "/_all_docs?include_docs=true" moet achteraan de URL van de databank		
		url: "http://127.0.0.1:5984/oefening_leaflet/_all_docs?include_docs=true",
		datatype: 'json',
		
// Als de connectie geslaagd is moet deze functie uitgevoerd worden		
		success: function(objectData) {
		
// Aanmaken van een javascript object & geladen JSON bestand Parse			
			var objectPersoon = JSON.parse(objectData);
			
			for (var teller = 1; teller < objectPersoon.rows.length  ; teller++) {
				
// Extra controle of naam bestaat				
				if (objectPersoon.rows[teller].doc.naam) {
					
// Voor elke opgeslagen locatie, layer aanmaken met een marker. Deze daarna toevoegen aan het object objectMap
// Alle data zit in de directory .rows[x].doc.variabele 					
					objectMap.addLayer(L.marker(objectPersoon.rows[teller].doc.locatie).bindPopup(objectPersoon.rows[teller].doc.naam));
				}
			}
			console.log("De data is succesvol geladen");
		},
		error: function(oError) {
			console.log("Het laden van de data geeft volgende foutmelding : " + oError);
		},
	});	
}
			
