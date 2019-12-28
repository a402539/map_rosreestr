	var config = {
		z: 13,
		x: 56.0,
		y: 37.0
	};
	var mymap = L.map('mapid').setView([config.x, config.y], config.z);

	var baseLayers = {
		"Google (спутник)": L.tileLayer('https://khms2.google.com/kh/v=862?z={z}&x={x}&y={y}', {
					maxZoom: 18,
					attribution: 'Google &copy; <a href="https://www.google.ru/maps/">Google Map</a>'
			}),

		"sputnik.ru": L.tileLayer('http://tilessputnik.ru/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'sputnik.ru &copy; <a href="http://tilessputnik.ru/">sputnik.ru</a>'
			}).addTo(mymap)
	};
	var overlays = {
		// "Marker": marker,
		// "Roads": roadsLayer
	};
	L.control.layers(baseLayers, overlays).addTo(mymap);

/*
http://tilessputnik.ru/18/158454/81968.png
https://khms2.google.com/kh/v=862?x=153&y=81&z=8
	L.marker([51.5, -0.09]).addTo(mymap)
		.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	L.circle([51.508, -0.11], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a circle.");

	L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	]).addTo(mymap).bindPopup("I am a polygon.");


	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(mymap);
	}

	mymap.on('click', onMapClick);
*/
