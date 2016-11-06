var oMap = {},
	oCenter = {},
	
	// LayerGroup is a Leaflet function which adds a additional layer to the map, this layer can hold: markers, image overlays, title layers & popups
	oCurrentLocation = L.layerGroup(),
	oLocations = L.layerGroup();

function initMap() {
	// Give the map the correct height
	// The "$('#example')" tag is the same as "document.getElementById('example')" but just simplified
	// Set the height of the div with ID map equal to the height of the browser window minus the height of the navigation bar below
	$('#map').height($( window ).height() - $('#userinfo').outerHeight());
	
	// The outerHeight function gives a number back which represents the PX from bottom to top ( including borders, padding & margins)
	$('#map').css( { "margin-top" : -$('#title').outerHeight() } );
	
	// Set up the map
	oCenter = {
		lat: 51.221311, 
		lng: 4.399160
	}
	
	// Linking the DIV In the index.html to the object OMap, Must use the id of the div in order to link
	oMap = new L.Map('map', {
		center: oCenter,
		zoom: 12,
		minZoom: 8,
		maxZoom: 16,
		// The layers in the object oMap are made of 2 layergroups ( oCurrentLocation & oLocations )  
		layers: [oCurrentLocation, oLocations]
	});
	
	 
	
	
	// Create the tile layer with correct attributes
	// Create the layer where the map is displayed
	var sUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var sCopyright = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
	var oTileLayer = new L.TileLayer(sUrl, {attribution: sCopyright});		

	// Start the map in Antwerp
	oMap.setView(new L.LatLng(51.221311, 4.399160),12);
	oMap.addLayer(oTileLayer);
	
	 oMap.clearLayers().addLayer(L.circle([51.21614, 4.41124], {
	    color: 'red',
	    fillColor: '#f03',
	    fillOpacity: 0.5,
	    radius: 500
	}));
	
	
};

function getLocation() {
	// pop up the user that fetching the location may take a while is in the form of a title, which later on will be set as an empty string
	// setTitle is a self made function located at the end of the document
	setTitle('Even geduld, positie wordt bepaald ...', 'info');
	navigator.geolocation.getCurrentPosition(
		function(oPosition) {
			oCenter.lat = oPosition.coords.latitude;
			oCenter.lng = oPosition.coords.longitude;
			oMap.setView([oCenter.lat, oCenter.lng], 14);
			
			// Make sure you have no layers yet and then add another layer. 
			// Add to this layer a marker with a pop up bind to it
			oCurrentLocation.clearLayers().addLayer(L.marker([oCenter.lat, oCenter.lng]).bindPopup('<b>U bent hier</b>'));
			setTitle('');
		},
		function(oError){ 
			console.log(oError);
		}
	);
};

function shareLocation() {
	if (oCurrentLocation.getLayers().length) {
		var vUsername = $("#username").val();
		if (vUsername) {
			setTitle('Uw gegevens worden doorgestuurd.', 'info');
			var oData = {
				"person": vUsername,
				"location": [oCenter.lat, oCenter.lng]
			};
			$.ajax({
				type: "POST",
				url: "https://nicolas.cloudant.com/sharealocation",
				data: JSON.stringify(oData),
				success: function() {
					setTitle('Uw gegevens zijn succesvol doorgestuurd.', 'success');
				},
				error: function(oError) {
					setTitle('Er ging iets mis, check de console.', 'danger');
					console.log(oError);
				},
				contentType: "application/json"
			});
		}
		else {
			setTitle('U hebt uw naam niet opgegeven.', 'warning');
		}
	}
	else {
		setTitle('Uw locatie is nog niet bepaald.', 'warning');
	}
};

function showLocations() {
	oLocations.clearLayers();
	setTitle('De gegevens worden opgehaald.', 'info');
	$.ajax({
		type: "GET",
		url: "https://nicolas.cloudant.com/sharealocation/_all_docs?include_docs=true",
		success: function(oData) {
			for (var vI = 0; vI < oData.rows.length; vI++) {
				var oDoc = oData.rows[vI].doc;
				if (oDoc.person) {
					oLocations.addLayer(L.marker(oDoc.location).bindPopup(oDoc.person));
				}
			}
			setTitle('De gegevens zijn succesvol opgehaald.', 'success');
		},
		error: function(oError) {
			setTitle('Er ging iets mis, check de console.', 'danger');
			console.log(oError);
		},
	});
};

function setTitle(sText, sType) {
	$('#title-text').removeClass().addClass('label label-' + sType).text(sText);
};

initMap();