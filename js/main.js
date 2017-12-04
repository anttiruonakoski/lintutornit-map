// main.js
	
    var map;
	var L;
    
    var birdTowerFile = 'data/lintutornit_lly_kaikki_2017_wgs84.geojson';

    // var societySitesFile = 'data/7500.geojson';

  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");

    ortokuva.options.minZoom = 8;

    maastokartta.setOpacity(0.65);  
    // const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

    const birdTowerMarkerOptions = {
    	radius : 4,
    	fillOpacity : 1,
    	fillColor : '#4169E1',
    	color : 'dimgray',
        stroke: false
    };


    function onEachFeature(feature, layer) {

        if (feature.properties && feature.properties.name) {
            layer.bindPopup('<b>' + feature.properties.name +'</b><br/><b>' + feature.properties.kunta +'</b><br/><a href="https://www.lly.fi/lintutornit#torni-' + feature.properties.id + '">Tornin esittely</a>'
            + '<button type="button" class="btn-zoom-tower">Lähennä</button>', {
                maxWidth : 'auto'
                });
            }
    }                    
            // siteLayerGroups.societySitesGroup[org].addLayer(layer); 
            // hashMaps[org].set(feature.properties.id, layer._leaflet_id);


    // lintutornit_lly_kaikki_2017_wgs84.geojson
    var birdTowers = new L.GeoJSON.AJAX( birdTowerFile, { pointToLayer : function(geoJsonPoint, latlng) {
        return L.marker(latlng);

   
	   }     
        , onEachFeature: onEachFeature});
     // return L.circleMarker(latlng, birdTowerMarkerOptions);

    //

        birdTowers.on('data:loaded', function () {
            console.log('tasolla kohteita: ', counter);
            counter = 0;
            var sitesAsJSON = sites.toGeoJSON();
            assocSites[org] = sites; 
            siteLists[org] = tableFeatures(sitesAsJSON,"societySites"); 

        });  
    // 

    const EPSG3067 = L.TileLayer.MML.get3067Proj();

  	const initMap = {
        crs: L.TileLayer.MML.get3067Proj(),
        center: [67.55, 25.7],
        zoom: 4,
        minZoom: 3,
        maxZoom: 14,
        layers: [maastokartta, birdTowers],    
        maxBounds: [[65.33,19.86],
                    [70.16,30.87]],
        //test canvas renderer,
        renderer: L.canvas(),
        prefercanvas: true                   
		};

	// const obsIcon = L.AwesomeMarkers.icon({
	// 	icon: 'binoculars', prefix: 'fa', markerColor: 'cadetblue'
	// });

				
	function init() {

    	const baseMaps = { 
    		"Taustakartta" : taustakartta,
    		"Maastokartta" : maastokartta,
        	"Ilmakuva" : ortokuva
        	// "Uusi Taustakartta": taustakartta_uusi
    	};

    	const birdTowerLayer = {
    		"Lintutornit <span id='lintutornit'></span>" : birdTowers,
    	};


        map = new L.map('map_div', initMap);
        map.attributionControl.addAttribution('| Lintutornit © LLY');

        L.control.layers(baseMaps).addTo(map);

        birdTowers.addTo(map);

        //assign variable only after json request complete, otherwise empty result

        //for collapsing layer switcher

        // custom controls

        // helper functions


    };