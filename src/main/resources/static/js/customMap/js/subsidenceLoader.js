const closeChart = () => {
    document.getElementById("chartStyleStorage").classList.remove("white-background");
    const chartTitle = document.getElementById('chartTitle');
    const closeButton = document.getElementById('closeChart');
    chartTitle.style.display = 'none';
    closeButton.style.display = 'none';
}

$(function() {

    // initProj();
    userLanguage = navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        :'vi';
    layers.push(generateOSMTileLayer());
    layers.push(getBaseGridMap());
    // layers.push(getBaseKorMap());
    layers.push(generateVectorLayer())

    map = generateMap(layers);
    moment.locale(userLanguage);
    $("#dateRange").daterangepicker();

    mappingFeatureToDB("dong");

    if (geoServerLayerUuid !== "null") {
        callGeoServerLayerByUuid(geoServerLayerUuid);
    }

    map.addInteraction(selectPointerMove);
    map.addInteraction(selectClick);

    map.on('singleclick', function (evt) {
        map.forEachLayerAtPixel(evt.pixel, function(layer) {
            const layerId = layer.get('layerId');
            if(layerId === 'pointVectorLayer') {
                const source = layer.getSource();
                const closestFeature = source.getClosestFeatureToCoordinate(evt.coordinate );
                fetch('/subsidence-data', {
                    method:'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        'uuid': closestFeature.get('id')
                    }),
                })
                .then(response => response.json())
                .then((data) => {
                    if (data === null) {
                        Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error");
                        return;
                    }

                    let chartTotalDate = [];
                    let chartTotalData =[];
                    for (const idx in data ) {
                        chartTotalDate.push(data[idx]['subsidenceDate'])
                        chartTotalData.push(data[idx]['value'])
                    }

                    removeData(chart);
                    addDataAndLabelsToChart(chart, chartTotalDate, chartTotalData);
                    document.getElementById("chartStyleStorage").classList.add("white-background");

                    const chartTitle = document.getElementById('chartTitle');
                    const closeButton = document.getElementById('closeChart');
                    const gradientBar = document.getElementById('color-gradient');

                    chartTitle.style.display = 'block';
                    closeButton.style.display = 'inline-block';
                    gradientBar.style.display = 'inline-block';
                })
                .catch(() => {
                Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error");
            })
            }
        });
    });

});
document.onreadystatechange=()=>{
    moment.locale(userLanguage);
}