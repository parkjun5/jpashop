const getBBoxAndGenerateTileLayer = ( geoserverWorkspaceName, uuid ) => {
    $.ajax({
        beforeSend: function(xhr){
            xhr.setRequestHeader("ajax", "true");
            $(".mapSpinner").show();
        },
        url: '/getBBoxFromTileLayer',
        type: 'GET',
        data: {'uuid': uuid },
        success: function (data) {
            if (data === "no data error") {
                return;
            }

            const bboxList = bboxConvertToFloat(data);
            const subsidence_layer = tileLayerGenerator(geoserverWorkspaceName, uuid, bboxList);
            // setMapClickEvent(subsidence_layer);
            addLayerToMap(subsidence_layer, 'pointTileLayer');
            $(".mapSpinner").hide();
        },
        error: function () {
            $(".mapSpinner").hide();
            Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error");
        }
    });
}

const tileLayerGenerator = (geoWorkspaceId, geoLayerId, bboxList) => {
    const projection = view.getProjection();
    const extents = projection.getExtent();
    const size = ol.extent.getWidth(extents) / 256;
    const gridSetName = 'EPSG:900913';
    const maxZoomLevel = 17;

    const matrixIds = setMatrixIds(gridSetName, maxZoomLevel);
    const resolutions = calculateResolution(size, maxZoomLevel);

    const restApiUrl = geoserverUrl.concat('/gwc/service/wmts/');
    const layerId = geoWorkspaceId.concat(':', geoLayerId);
    const params = {
        'VERSION': '1.0.0',
        'STYLE': "stage_land_subsidence:subsidence",
        'TILEMATRIXSET': gridSetName,
        'SERVICE': 'WMTS',
        'FORMAT': 'image/png'
    };

    const wmtsTileGrid = new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(extents),
        resolutions: resolutions,
        matrixIds: matrixIds,
        extent:bboxList,
    });
    const wmtsSource = new ol.source.WMTS({
        url: restApiUrl,
        layer: layerId,
        matrixSet: params['TILEMATRIXSET'],
        format: params['FORMAT'],
        projection: projection,
        tileGrid: wmtsTileGrid,
        style: params['STYLE'],
        wrapX: true,
        VERSION: params['VERSION']
    });
    const land_subsidence_layer = new ol.layer.Tile({
        source: wmtsSource,
        layerId: 'pointTileLayer',
        title: layerId,
        visible: true,
        zIndex: 2
    });
    land_subsidence_layer.set('pointTileLayer', geoLayerId);
    return land_subsidence_layer;
};

const calculateResolution = (size, maxZoomLevel) => {
    let calResolutions = new Array(maxZoomLevel).fill(0);
    for (let zoomLevel = 0; zoomLevel < maxZoomLevel; zoomLevel++) {
        calResolutions[zoomLevel] = size / Math.pow(2, zoomLevel  );
    }
    return calResolutions;
}

const setMatrixIds= (gridSetName, maxZoomLevel) => {
    let generateMatrixIds = new Array(maxZoomLevel).fill(0);
    for (let zoomLevel = 0; zoomLevel < maxZoomLevel; zoomLevel++) {
        generateMatrixIds[zoomLevel] = gridSetName.concat(':', `${zoomLevel}`);
    }
    return generateMatrixIds;
}

const bboxConvertToFloat = (strBBbox) => {
    let minFloatList = [];
    let maxFloatList = [];
    let resultFloatList = [];
    const strList = strBBbox.split(',');
    for (let idx in strList) {
        if(idx < 2)
            minFloatList.push(parseFloat(strList[idx]));
        else
            maxFloatList.push(parseFloat(strList[idx]));
    }
    minFloatList = ol.proj.transform(minFloatList, 'EPSG:4326', 'EPSG:3857');
    maxFloatList = ol.proj.transform(maxFloatList, 'EPSG:4326', 'EPSG:3857');

    for (let idx in minFloatList) { resultFloatList.push(minFloatList[idx]) }
    for (let idx in maxFloatList) { resultFloatList.push(maxFloatList[idx]) }
    return resultFloatList;
}

const bboxConvertEPSG = (extent) => {
    let minFloatList = [];
    let maxFloatList = [];
    let resultFloatList = [];
    for (let idx in extent) {
        if(idx < 2)
            minFloatList.push(extent[idx]);
        else
            maxFloatList.push(extent[idx]);
    }
    minFloatList = ol.proj.transform(minFloatList,'EPSG:3857', 'EPSG:4326');
    maxFloatList = ol.proj.transform(maxFloatList, 'EPSG:3857', 'EPSG:4326');

    for (let idx in minFloatList) { resultFloatList.push(minFloatList[idx]) }
    for (let idx in maxFloatList) { resultFloatList.push(maxFloatList[idx]) }
    return resultFloatList;
}