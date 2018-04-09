// main.js
	
    var map;
	var L;
    
    const birdTowerFile = 'data/lintutornit_lly_kaikki_2017_wgs84.geojson';

    let selectedTower = {};

    if (location.href.includes('?') && location.href.includes('=')) {
         selectedTower.id = Number(location.href.split('=')[1]);
    }

    // selectedTower.id = location.href.includes('?') ? Number(location.href.split('=')[1]) : null ;

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
            layer.bindPopup('<b>' + feature.properties.name +'</b><br/><b>' + feature.properties.kunta +'</b><br/><a href="https://www.lly.fi/lintutornit/#torni-' + 
                feature.properties.id + '" target="_top">Tornin esittely</a>'+ '<button type="button" id="searchsubmit" class="btn-zoom-tower">Lähennä</button>', {
                maxWidth : 'auto'
                });
        if (feature.properties.id === selectedTower.id) {  
            layer.bindTooltip ('lintutorni '+ feature.properties.name, {
                permanent: true,
                direction: 'auto',
                interactive: false
                });
        }   
    }
    }                   

    function zoomToTower(LatLng,zoomLvl) {
        map.flyTo(LatLng,zoomLvl);
    }

    function getBirdTowers (birdTowerFile) {
        return new Promise(function (resolve, reject) {

            var bd = new L.GeoJSON.AJAX(birdTowerFile, 

                {pointToLayer : function(geoJsonPoint, latlng) {
                return L.marker(latlng);
                },
                onEachFeature: onEachFeature}     
            );

            bd.on('data:loaded', function () {
                resolve(bd);
            });
    });
    }

    function onMapLoad(mapCenter, mapZoom, selectedTower, birdTowers) {  
        console.log('tornin id '+ selectedTower);

        if (typeof selectedTower !== 'undefined' && selectedTower != 0)  {
                birdTowersAsJSON = birdTowers.toGeoJSON();

                try {
                    mapCenter = (birdTowersAsJSON.features.find(item => item.properties.id == selectedTower).geometry.coordinates).reverse();
                }
                catch(e) {
                    console.log('tornin id '+ selectedTower +' linkissä mahdollisesti väärin');
                }
                
                mapZoom = 9;

                map.setView(mapCenter, mapZoom);
                
        }

        else {
           
            map.setView(mapCenter, mapZoom); 
         
        }

        map.attributionControl.addAttribution(' pohjakartat | © LLY, lintutornit');
        }    

    const EPSG3067 = L.TileLayer.MML.get3067Proj();
     
    let mapCenter = [67.55, 25.7];
    let mapZoom = 4;

    const defaultLayers = [maastokartta];

  	const initMap = {
        crs: L.TileLayer.MML.get3067Proj(),
        minZoom: 3,
        maxZoom: 14,
        layers: defaultLayers,    
        maxBounds: [[65.33,19.86],
                    [70.16,30.87]],
        //test canvas renderer,
        renderer: L.canvas(),
        prefercanvas: true                   
		};

	// const obsIcon = L.AwesomeMarkers.icon({
	// 	icon: 'binoculars', prefix: 'fa', markerColor: 'cadetblue'
	// });

    // function onMapLoad(mapCenter, mapZoom) {
    //     if (selectedTower.id)  {
    //         birdTowersAsJSON;
    //         mapCenter = (birdTowersAsJSON.features.find(item => item.properties.id == selectedTower.id).geometry.coordinates).reverse();
    //         mapZoom = 10;
    //     }
    //     map.setView(mapCenter, mapZoom);

    //     console.log('huu' ,mapCenter, mapZoom);    
    // }
				
	function init() {

        let birdTowers;

        const towerPromise = getBirdTowers(birdTowerFile);

    	const baseMaps = { 
    		"Taustakartta" : taustakartta,
    		"Maastokartta" : maastokartta,
        	"Ilmakuva" : ortokuva
    	};

    	const birdTowerLayer = {
    		"Lintutornit <span id='lintutornit'></span>" : birdTowers,
    	};

        map = new L.map('map_div', initMap);

        L.control.layers(baseMaps).addTo(map);

        // L.easyButton('fa-home', function(btn, map){
        //     map.setView(mapCenter, mapZoom);
        // }).addTo(map);

        const mapResetButton = L.easyButton({
            states: [{
                    stateName: 'static',        // name the state
                    icon:      'facustom-resize-full',              // and define its properties
                    title:     'Palauta kartta alkunäkymään',      // like its title
                    onClick: function(btn, map) {       // and its callback
                        map.setView(mapCenter, mapZoom);
                        map.eachLayer(function(layer){
                            map.removeLayer(layer);
                        });

                        defaultLayers.forEach(function(layer){
                            layer.addTo(map);
                        });  
                    }                         
                    }]
        });

        mapResetButton.addTo(map);

        towerPromise.

            then(function (birdTowers) {

                birdTowers.addTo(map);      
                map.on('load', onMapLoad(mapCenter, mapZoom, selectedTower.id, birdTowers));
                defaultLayers.push(birdTowers);

        });    


        map.on('popupopen', function(e) {
            document.querySelector(".btn-zoom-tower").addEventListener('click', function() {
                var zoomLatLng = e.popup.getLatLng();
                console.log(zoomLatLng);

                // var popupSourceFeature = e.popup._source;
                // var coords = getCoords(EPSG3067.project(popupSourceFeature._latlng).toString());
                        
                    zoomToTower(zoomLatLng, 13);

                map.closePopup();

            });
        });
    }