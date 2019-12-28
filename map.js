	var config = {
		z: 13,
		x: 56.0,
		y: 37.0
	};

	var Mercator = L.TileLayer.extend({
		options: {
			tilesCRS: L.CRS.EPSG3395
		},
		_getTiledPixelBounds: function (center) {
			var pixelBounds = L.TileLayer.prototype._getTiledPixelBounds.call(this, center);
			this._shiftY = this._getShiftY(this._tileZoom);
			pixelBounds.min.y += this._shiftY;
			pixelBounds.max.y += this._shiftY;
			return pixelBounds;
		},
		_tileOnError: function (done, tile, e) {
			var file = tile.getAttribute('src'),
				pos = file.indexOf('/mapcache/');

			if (pos > -1) {
				var searchParams = new URL('http:' + file).searchParams,
					arr = file.substr(pos + 1).split('/'),
					pItem  = proxy[arr[1]];

				tile.src = L.Util.template(pItem.errorTileUrlPrefix + pItem.postfix, {
					z: searchParams.get('z'),
					x: searchParams.get('x'),
					y: searchParams.get('y')
				});
			}
			done(e, tile);
		},
		_getTilePos: function (coords) {
			var tilePos = L.TileLayer.prototype._getTilePos.call(this, coords);
			return tilePos.subtract([0, this._shiftY]);
		},

		_getShiftY: function(zoom) {
			var map = this._map,
				pos = map.getCenter(),
				shift = (map.options.crs.project(pos).y - this.options.tilesCRS.project(pos).y);

			return Math.floor(L.CRS.scale(zoom) * shift / 40075016.685578496);
		}
	});
	L.TileLayer.Mercator = Mercator;
	L.tileLayer.Mercator = function (url, options) {
		return new Mercator(url, options);
	};
	
	var mymap = L.map('mapid').setView([config.x, config.y], config.z);

	var baseLayers = {
		"Google (спутник)": L.tileLayer('https://khms2.google.com/kh/v=862?z={z}&x={x}&y={y}', {
					maxZoom: 18,
					attribution: 'Google &copy; <a href="https://www.google.ru/maps/">Google Map</a>'
			}),

		"Карта": L.tileLayer('http://tilessputnik.ru/{z}/{x}/{y}.png', {
					maxZoom: 18,
					attribution: 'sputnik.ru &copy; <a href="http://tilessputnik.ru/">sputnik.ru</a>'
			}),

		"Яндекс (спутник)": L.tileLayer.Mercator('https://khms2.google.com/kh/v=862?z={z}&x={x}&y={y}', {
					maxZoom: 18,
					attribution: 'Google &copy; <a href="https://www.google.ru/maps/">Google Map</a>'
			}),

		"Яндекс карта": L.tileLayer.Mercator('https://vec01.maps.yandex.net/tiles?l=map&v=18.01.10-2&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
					maxZoom: 18,
					attribution: '&copy; <a href="https://n.maps.yandex.ru/?oid=1900133#!/?z=18&ll=36.860478%2C55.429679&l=nk%23map">Yandex</a> contributors'
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
