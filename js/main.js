// main.js
	
    var map;
	var L;
    
    var birdTowerFile = 'data/lintutornit_lly_kaikki_2017_wgs84.geojson';

    // var societySitesFile = 'data/7500.geojson';

  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");

    ortokuva.options.minZoom = 8;
    maastokartta.setOpacity(0.8);  
    // const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

    const birdTowerMarkerOptions = {
    	radius : 4,
    	fillOpacity : 1,
    	fillColor : '#4169E1',
    	color : 'dimgray',
        stroke: false
    };


    function onEachFeature(feature, layer) {
     // does this feature have a property named name?

        if (feature.properties && feature.properties.name) {
            counter++;
            layer.bindPopup('Siirry yhdistyspaikkaan: <button type="button" class="btn btn-sm btn-primary btn-select-site">' + feature.properties.name +'</button>', {
                maxWidth : 'auto'
                });
            }            
        
    }


    // lintutornit_lly_kaikki_2017_wgs84.geojson
    var birdTowers = new L.GeoJSON.AJAX( birdTowerFile, { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, birdTowerMarkerOptions);
	}, onEachFeature: onEachFeature});

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
        center: [66.5, 25.3],
        zoom: 6,
        minZoom: 3,
        maxZoom: 14,
        layers: [taustakartta, sites],    
        maxBounds: [[58.2133,16.16359],
                    [71.2133,36.16359]],
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

    	const siteLayers = {
    		"Yhdistyspaikat <span id='common-sites-control'></span>" : sites,
    	};

        map = new L.map('map_div', initMap);

 
        // sites.addTo(map);

        //assign variable only after json request complete, otherwise empty result

        //for collapsing layer switcher

        // custom controls

        // helper functions


    }