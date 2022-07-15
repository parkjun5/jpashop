class CustomControl extends ol.control.Control {
    constructor(opt_options) {
        const options = opt_options || {};
        const changeMapButton = generateChangeMapBtn();
        const dateInput = generateDateInputBtn();
        const addCartButton = generateAddCartBtn();

        const element = document.createElement('div');
        element.className = 'custom-map-control ol-unselectable ol-control';
        element.id = 'customMapControl';

        const drawPolygonToggle = document.createElement('button');
        drawPolygonToggle.className = 'custom-map-button'
        drawPolygonToggle.id = 'drawPolygonToggle'

        const stopDrawing = document.createElement('button');
        stopDrawing.className = 'btn btn-white';
        stopDrawing.id = "stopDrawingButton";
        stopDrawing.textContent = localizationLanguages[userLanguage]['Remove.Selected'];

        const drawPolygonIcon = document.createElement('i');
        drawPolygonIcon.className = "fas fa-draw-polygon";
        drawPolygonIcon.id = "drawPolygonIcon";

        const polygonHandingTooltip = document.createElement('span');
        polygonHandingTooltip.id = "polygonHandingTooltip";
        polygonHandingTooltip.className = "polygonHandingTooltip";
        polygonHandingTooltip.textContent = localizationLanguages[userLanguage]['Draw.Polygon'];

        const shape = document.createElement('div');
        shape.id = 'shape';

        element.appendChild(dateInput);
        drawPolygonToggle.appendChild(shape);
        drawPolygonToggle.appendChild(polygonHandingTooltip);
        drawPolygonToggle.appendChild(drawPolygonIcon);
        element.appendChild(drawPolygonToggle);

        onclick=(e)=>{
            const generatedSearchModal = document.getElementById("searchModal");
            const lastFeature = getLastFeature(findOneLayerFromLayers('vectorLayer'));

            if(lastFeature !== undefined
                && document.getElementById("searchModal") === null){
                const searchModal = generateSearchModal(e, element);
                const modalTitle = document.createElement('h4')

                searchModal.style.display = "inline-block";
                modalTitle.textContent = localizationLanguages[userLanguage]['inquire.within.date'];
                dateInput.style.display = "inline-block";

                searchModal.appendChild(modalTitle);
                searchModal.appendChild(dateInput);
                searchModal.appendChild(addCartButton);
                searchModal.appendChild(stopDrawing);
                element.appendChild(searchModal);
            } else if(lastFeature === undefined && generatedSearchModal !== null) {
                element.removeChild(generatedSearchModal);
            }
        }

        super({
            element: element,
            target: options.target,
        });

        stopDrawing.addEventListener('click', this.handleDrawNew.bind(this), false);
        drawPolygonToggle.addEventListener('click', this.handleMapPolygon.bind(this), false);
        changeMapButton.addEventListener('click', this.handleChangeMapStyle.bind(this), false);
        addCartButton.addEventListener('click', this.handleCalculatePolygon.bind(this), false);

        let count = 0;
        drawPolygonToggle.onclick=()=>{
            count += 1;
            if(count % 2 === 0){
                this.changePolygonButtonToDark(drawPolygonToggle, drawPolygonIcon, polygonHandingTooltip);
                this.handleFinishDraw();
                drawPolygonToggle.removeEventListener('click', this.handleMapPolygon.bind(this), false);
            } else {
                this.changePolygonButtonToLight(drawPolygonToggle, drawPolygonIcon, polygonHandingTooltip);
            }
        }
    }

    changePolygonButtonToLight=(button, icon, tooltip)=>{
        button.style.backgroundColor = 'var(--light)';
        icon.style.color = 'var(--navy)';
        tooltip.textContent = localizationLanguages[userLanguage]['Stop.Draw.Polygon'];
    }

    changePolygonButtonToDark=(button, icon, tooltip)=>{
        button.style.backgroundColor = 'var(--deep-dark)';
        icon.style.color = 'var(--light)';
        tooltip.textContent = localizationLanguages[userLanguage]['Draw.Polygon'];
    }

    handleFinishDraw() {
        removeDuplicateInteractionById('drawPolygon');
    }

    handleDrawNew() {
        removePreviousDraw();
    }

    handleMapPolygon() {
        if(findOneLayerFromLayers('vectorLayer') !== undefined){
            const vectorLayer = findOneLayerFromLayers('vectorLayer');
            createInteraction(vectorLayer);
        }
    }

    handleChangeMapStyle() {
        try {
            refreshLayer();
        } catch (e) {
            Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error");
        }
        document.getElementById('changeMapButton').value = 'bing_map';
    }

    hideSearchModal() {
        const searchModal = document.getElementById("searchModal");
        searchModal.style.display = "none";
    }

    handleCalculatePolygon() {
        const isLogin = document.getElementById("isLogin").innerText;
        if (isLogin === 'false') {
            toLoginPage();
        }
        const vectorLayer = findOneLayerFromLayers('vectorLayer');
        const dates = $('#dateRange').data('daterangepicker');
        const isFalseValidate = calculatePolygonValidator(vectorLayer, dates);
        if ( isFalseValidate )  {
            return;
        }

        const lastFeature = getLastFeature(vectorLayer);
        const geometry =  lastFeature.getGeometry();
        const coordinates = geometry.getCoordinates()[0];
        const extents = geometry.getExtent();
        const center = changeCoordinatesByProjection([(extents[0] + extents[2])/2, (extents[1] + extents[3])/2 ]);
        const centerCoordinate = `${roundBingMapPoint(center[1])}comma${roundBingMapPoint(center[0])}`;
        let strCoordinates = ''

        for ( const index in coordinates ) {
            const transformedData =changeCoordinatesByProjection(coordinates[index]);
            strCoordinates = strCoordinates.concat(`${transformedData[0]}comma${transformedData[1]}and`)
        }

        const startDate = dates.startDate.format('YYYY-MM-DD');
        const endDate = dates.endDate.format('YYYY-MM-DD');

        this.hideSearchModal();
        $(".mapSpinner").show();

        fetch('/registerDataToCookie',{
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        'startDate': startDate,
                        'endDate': endDate,
                        'strCoordinates': strCoordinates,
                        'centerCoordinate' : centerCoordinate
                    }),
        })
        .then((response) => response.text().then((data) => {
            if (data === 'success') {
                Swal.fire({
                    title: localizationLanguages[userLanguage]['success.title'],
                    text: localizationLanguages[userLanguage][data],
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: `<i class="fa fas fa-shopping-cart"></i> ${localizationLanguages[userLanguage]['go.to.cart']}`,
                    cancelButtonText: localizationLanguages[userLanguage]['close.button.text'],
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        location.href = "/order/cart";
                    }
                })
            } else {
                Swal.fire(localizationLanguages[userLanguage]['Product.condition.error'], localizationLanguages[userLanguage][data], "error" )
            }
            $(".mapSpinner").hide();
        }))
        .catch(() => {
            $(".mapSpinner").hide();
            Swal.fire(localizationLanguages[userLanguage]['error.title'], localizationLanguages[userLanguage]['Retry.alert'], "error")
        })
    }
}

const generateSearchModal=(e, parent)=>{
    const searchModal = document.createElement('div');
    let background = parent.parentElement;
    let backgroundWidth = background.getBoundingClientRect().width;
    let backgroundHeight = background.getBoundingClientRect().height;

    if(e !== undefined){
        searchModal.id = "searchModal";
        if(e.clientX < 300) { searchModal.style.left = 20 + "px"; }
        else if(e.clientX > (backgroundWidth - 300)) { searchModal.style.left = (backgroundWidth - 300) + "px"; }
        else { searchModal.style.left = (e.clientX - 300)+ "px"; }

        if(e.clientY < 240) { searchModal.style.top = 20 + "px"; }
        else if(e.clientY > (backgroundHeight - 240)) { searchModal.style.top = (backgroundHeight - 240) + "px"; }
        else { searchModal.style.top = (e.clientY) + "px"; }
    }
    return searchModal;
}

const generateChangeMapBtn = () => {
    const changeButton = document.createElement('button');
    changeButton.id = 'changeMapButton'
    changeButton.value = 'open_street'
    changeButton.className = 'custom-map-button'

    const changeMapITag = document.createElement('i');
    changeMapITag.className = 'fas fa-layer-group'

    const changeMapTooltip = document.createElement('span');
    changeMapTooltip.className = 'tool-tip-text';
    changeMapTooltip.textContent = localizationLanguages[userLanguage]['Change.Map.Style'];

    changeButton.appendChild(changeMapITag);
    changeButton.appendChild(changeMapTooltip);
    return changeButton;
}

const generateDateInputBtn = () => {
    const dateInputButton = document.createElement('input');
    dateInputButton.id = 'dateRange';
    dateInputButton.name = 'dateRange';
    dateInputButton.type = 'text';
    dateInputButton.className =  'dateRangeStyle';
    dateInputButton.style.display = "none";
    return dateInputButton;
}

const generateAddCartBtn = () => {
    const addButton = document.createElement('button');
    addButton.id = 'calculatePolygon'
    addButton.className = 'custom-map-button'
    addButton.textContent = localizationLanguages[userLanguage]['Add.To.Cart'];
    return addButton;
}

const refreshLayer = () => {
    if (!emptyCollectionCheck(layers)) {
        throw new Error('Empty collection Error');
    }

    for (const layerIndex in layers) {
        if (layers[layerIndex].A.type === 'base') {
            const flag = style === layers[layerIndex].A.title;
            map.removeLayer(layers[layerIndex]);
            layers[layerIndex].setVisible(flag);
            map.addLayer(layers[layerIndex]);
        }
    }
};

const emptyCollectionCheck = (obj) => {
    return Object.keys(obj).length;
}

const toLoginPage = () => {
    return window.location.replace('/login');
}

const calculatePolygonValidator = (vectorLayer, dates) => {
    const isPolygonResult = isPolygonAvailable(vectorLayer);

    if ( isPolygonResult !== 'available') {
        Swal.fire(localizationLanguages[userLanguage]['Retry.alert'],  localizationLanguages[userLanguage][isPolygonResult], "error");
        return true;
    }
    const dateRangesToTime = (dates.endDate - dates.startDate) / 24 / 60 / 60 / 1000;
    const isDateOverYear = roundPoint(dateRangesToTime) < 365;

    if ( isDateOverYear ) {
        Swal.fire( localizationLanguages[userLanguage]['Retry.alert'], localizationLanguages[userLanguage]['The.period.error'], "error");
        return true;
    }
    return false;
}

const removePreviousDraw =  ()  => {
    const vectorLayer = findOneLayerFromLayers('vectorLayer');
    const lastFeature = getLastFeature(vectorLayer);
    let vectorSource = vectorLayer.getSource();
    vectorSource.removeFeature(lastFeature);
}

const createInteraction = (vectorLayer) => {
    const value = 'Polygon';
    const draw = new ol.interaction.Draw({
        source: vectorLayer.getSource(),
        type: value
    });
    draw.on('drawstart', removePreviousDraw);
    draw.set('id', 'drawPolygon');

    removeDuplicateInteractionById('drawPolygon');
    map.addInteraction(draw);
}

const removeDuplicateInteractionById = (value) => {
    map.getInteractions().forEach(function (interaction) {
        if(interaction.get('id') === value) {
            removeInteraction(interaction);
        }
    });
}

const removeInteraction = (interaction) => {
    map.removeInteraction(interaction);
}

const isPolygonAvailable = (vectorLayer) => {
    const lastFeature = getLastFeature(vectorLayer);

    if (lastFeature === undefined) {
        return 'No.polygon';
    }

    const getAreaByMeter = lastFeature.getGeometry().getArea();
    const getAreaByKM = getAreaByMeter / 1000 / 1000;
    polygonArea = roundPoint(getAreaByKM);

    if ( getAreaByKM < 25 ) {
        const originAlert = localizationLanguages[userLanguage]['Polygon.too.small'].split(":")[0];
        localizationLanguages[userLanguage]['Polygon.too.small'] = originAlert.concat(`: ${polygonArea}km2`);
        return 'Polygon.too.small';
    }

    return 'available';
}

const getLastFeature = (vectorLayer) => {
    const vectorSource =  vectorLayer.getSource();
    const features = vectorSource.getFeatures();
    return features[features.length - 1];
}

const roundPoint = (area) => {
    const m = Number((Math.abs(area) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(area);
}

const roundBingMapPoint = (coordinate) => {
    return Math.ceil(coordinate * 100000) / 100000;
}
