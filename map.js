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
if (config.locate) { mymap.locate({setView: true, maxZoom: 18}); }

var baseLayers = {
	"Яндекс карта": L.tileLayer.Mercator('https://vec01.maps.yandex.net/tiles?l=map&v=18.01.10-2&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', { maxZoom: 18, attribution: '&copy; <a href="https://n.maps.yandex.ru/?oid=1900133#!/?z=18&ll=36.860478%2C55.429679&l=nk%23map">Yandex</a> contributors' }).addTo(mymap),
	"Яндекс (спутник)": L.tileLayer.Mercator('https://sat04.maps.yandex.net/tiles?l=sat&v=3.462.0&x={x}&y={y}&z={z}&lang=ru_RU', { maxZoom: 18, attribution: 'Яндекс (спутник) &copy; <a href="https://maps.yandex.net/maps/">Яндекс (спутник)</a>' }),
	//"Карта": L.tileLayer('http://tilessputnik.ru/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'sputnik.ru &copy; <a href="http://tilessputnik.ru/">sputnik.ru</a>' }),
	"Google карта": L.tileLayer('https://mt1.google.com/vt/lyrs=m&z={z}&x={x}&y={y}', { maxZoom: 18, attribution: 'Google &copy; <a href="https://www.google.ru/maps/">Google Map</a>' }),
	"Google (спутник)": L.tileLayer('https://khms2.google.com/kh/v=862?z={z}&x={x}&y={y}', { maxZoom: 18, attribution: 'Google &copy; <a href="https://www.google.ru/maps/">Google Map</a>' })
};

var overlays = {
	"Зоны охраны природных объектов": L.tileLayer.wms("https://pkk5.rosreestr.ru/arcgis/rest/services/Cadastre/ZONES/MapServer/export", {
		layers: 'show:3',
		format: 'PNG32',
		transparent: true,
		f: 'image',
		dpi: 96,
		imageSR: 102100,
		size: '1024,1024',
		opacity: config.opacity,
		attribution: "© Зоны охраны природных объектов"
	}).addTo(mymap)
};
L.control.layers(baseLayers, overlays).addTo(mymap);

mymap.addControl(new L.Control.OSMGeocoder({placeholder: 'Поиск по населенному пункту', text: 'Искать', position: 'topleft'}));
