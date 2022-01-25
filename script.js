require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/AreaMeasurement3D",
    "esri/widgets/DirectLineMeasurement3D",
    "esri/core/promiseUtils",
    "esri/widgets/Search",
], (Map, SceneView, FeatureLayer, LayerList, BasemapGallery, Expand, 
    AreaMeasurement3D, DirectLineMeasurement3D, promiseUtils, Search) => {

        let activeWidget = null;

        const map1 = new Map({
            basemap: "topo-vector"
        });

        const view = new SceneView({
            map: map1,
            container: "mapDiv",
            center: [19.252482, 52.065221],
            zoom: 6.5
        });


        const template = {
            title: "{SITE_NAME} {ODESIGNATE}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        { 
                            fieldName: "POWIERZCHNIA",
                            label: "Powierzchnia w km2",
                        },
                        {
                            fieldName: "YEAR",
                            label: "Rok założenia",
                        },
                        {
                            fieldName: "WOJEWODZTW",
                            label: "Województwo",
                        }
                    ]
                },
                {
                    type: "media",
                    mediaInfos: [
                        {
                            title: "<b>Logo parku narodowego</b>",
                            type: "image",
                            value: {
                                sourceURL: "./parkiloga/" + "{SITE_NAME}" + ".png"
                            }
                        }
                    ]
                }
            ]
        };

        const feature = new FeatureLayer({
            url:"https://services.arcgis.com/G295WI0RtbsgPOE4/arcgis/rest/services/Parki_narodowe/FeatureServer",
            popupTemplate: template,
        });

        map1.add(feature);

        const layerList = new LayerList({
            view: view,
            listItemCreatedFunction: (event) => {
                const item = event.item;
                if (item.title === "Parki narodowe"){
                    if (item.layer.type != "group"){
                        item.panel = {
                        content: "legend",
                        open: true
                        };
                    }
                }    
            }
        });

        view.ui.add(layerList, "bottom-right");

        const base = new BasemapGallery({
            view: view
        });

        const exp = new Expand({
            view: view,
            content: base
        });

        view.ui.add(exp, {
            position: "top-right"
        });
        


        view.ui.add("topbar", "bottom-left");

        document
        .getElementById("distanceButton")
        .addEventListener("click", (event) => {
            setActiveWidget(null);
            if (!event.target.classList.contains("active")) {
                setActiveWidget("distance");
            } else {
                setActiveButton(null);
            }
        });

        document
          .getElementById("areaButton")
          .addEventListener("click", (event) => {
            setActiveWidget(null);
            if (!event.target.classList.contains("active")) {
              setActiveWidget("area");
            } else {
              setActiveButton(null);
            }
        });

        function setActiveWidget(type) {
            switch (type) {
              case "distance":
                activeWidget = new DirectLineMeasurement3D({
                  view: view
                });
  
                activeWidget.viewModel.start().catch((error) => {
                  if (promiseUtils.isAbortError(error)) {
                    return;
                  }
                  throw error;
                });
  
                view.ui.add(activeWidget, "top-right");
                setActiveButton(document.getElementById("distanceButton"));
                break;

              case "area":
                activeWidget = new AreaMeasurement3D({
                  view: view
                });
  
                activeWidget.viewModel.start().catch((error) => {
                  if (promiseUtils.isAbortError(error)) {
                    return;
                  }
                  throw error;
                });
  
                view.ui.add(activeWidget, "top-right");
                setActiveButton(document.getElementById("areaButton"));
                break;

              case null:
                if (activeWidget) {
                  view.ui.remove(activeWidget);
                  activeWidget.destroy();
                  activeWidget = null;
                }
                break;
            }
        }
  
        function setActiveButton(selectedButton) {
            view.focus();
            const elements = document.getElementsByClassName("active");
            for (let i = 0; i < elements.length; i++) {
              elements[i].classList.remove("active");
            }
            if (selectedButton) {
              selectedButton.classList.add("active");
            }
        }

        


        const searchWidget = new Search({
            view: view,
            allPlaceHolder: "Wprowadź nazwę parku",
            includeDefaultSources: false,
            sources: [
                {
                    layer: feature,
                    searchFields: ["SITE_NAME", "ODESIGNATE"],
                    suggestionTemplate: "{SITE_NAME} {ODESIGNATE}",
                    exactMatch: false,
                    outFields: ["*"],
                    placeholder: "np. Roztoczański",
                    name: "Nazwa parku",
                    zoomScale: 50,
                    resultSymbol: template
                }
            ]
        });

        view.ui.add(searchWidget, {
            position: "top-right"
        });

        let naj1 = document.getElementById("najwiekszy");

        naj1.addEventListener('click', function(){
            view.center = [22.66190841251882, 53.46854952584047];
            view.zoom = 10;

        });

        let naj2 = document.getElementById("najmniejszy");

        naj2.addEventListener('click', function(){
            view.center = [19.817337909263262, 50.20709281979445];
            view.zoom = 12.8;

        });

        let naj3 = document.getElementById("najnowszy");

        naj3.addEventListener('click', function(){
            view.center = [14.665443799192834, 52.57457004221014];
            view.zoom = 11;

        });

        let naj4 = document.getElementById("najstarszy");

        naj4.addEventListener('click', function(){
            view.center = [23.861196967262533, 52.77335894304783];
            view.zoom = 11;

        });

    });