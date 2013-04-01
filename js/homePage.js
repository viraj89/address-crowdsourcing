/** @license
 | Version 10.2
 | Copyright 2013 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
dojo.require("esri.map");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.query");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ComboBox");
dojo.require("dojo.store.Memory");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("js.config");
dojo.require("dijit.form.FilteringSelect");
dojo.require("esri.tasks.geometry");
dojo.require("esri.tasks.locator");
dojo.require("js.InfoWindow");

var map; //ESRI map object
var baseMapLayers; //variable to store basemap collection
var tempGraphicLayer = 'tempGraphicLayer';
var tempAddressLayer = 'tempAddressLayer';
var geometryService;
var defaultImg;
var locator; //variable for storing locator URL
var locatorFields; //variable to store location params
var addressLayerURL;
var addressLayer;
var contactsLayer;
var contactsLayerURL;
var addressLayerID = "addressLayerID";
var contactsLayerID = "contactsLayerID";
var infoPopupFieldsCollection; //Variable for storing configurable Info Popup fields
var infoWindowHeader;
var objectId;
var arrayCollection = [];
var defaultAddressSymbol;
var mapPoint;
var isAddressDataValid = false;
var showNullValueAs;
var helpURL;
var mandatoryContactFields;
var mandatoryAddressFields;
var infoPopupFieldsCollection;
var successMessage;
var referenceOverlayLayer;
var addressFields = null;
var infoInputPopupFieldsCollection;
var defaultAddressFields;
var locatorSettings; //variable to store the locator settings
var status;
var selectedMapPoint;
var addressLayerFieldType;
var databaseFields;
var lastSearchString;

function init() {
   // ShowProgressIndicator();
    esri.config.defaults.io.proxyUrl = "proxy.ashx";
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000;

    // Identify the key presses while implementing auto-complete and assign appropriate actions
    dojo.connect(dojo.byId("txtAddress"), 'onkeyup', function (evt) {
        if (evt) {
            if (evt.keyCode == dojo.keys.ENTER) {
                if (dojo.byId("txtAddress").value != '') {
                    dojo.byId("imgSearchLoader").style.display = "block";
                    LocateAddress();
                    return;
                }
            }
            if (!((evt.keyCode > 46 && evt.keyCode < 58) || (evt.keyCode > 64 && evt.keyCode < 91) || (evt.keyCode > 95 && evt.keyCode < 106) || evt.keyCode == 8 || evt.keyCode == 110 || evt.keyCode == 188)) {
                evt = (evt) ? evt : event;
                evt.cancelBubble = true;
                if (evt.stopPropagation) evt.stopPropagation();
                return;
            }
            if (dojo.coords("divAddressHolder").h > 0) {
                if (dojo.byId("txtAddress").value.trim() != '') {
                    if (lastSearchString != dojo.byId("txtAddress").value.trim()) {
                        lastSearchString = dojo.byId("txtAddress").value.trim();
                        setTimeout(function () {
                            dojo.byId("imgSearchLoader").style.display = "block";
                            LocateAddress();
                        }, 500);
                    }
                } else {
                    dojo.byId("imgSearchLoader").style.display = "none";
                    RemoveChildren(dojo.byId('tblAddressResults'));
                    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
                }
            }
        }
    });

    dojo.connect(dojo.byId("txtAddress"), 'onpaste', function (evt) {
        setTimeout(function () {
            LocateAddress();
        }, 100);
    });

    dojo.connect(dojo.byId("txtAddress"), 'oncut', function (evt) {
        setTimeout(function () {
            LocateAddress();
        }, 100);
    });

    var responseObject = new js.config();
    baseMapLayers = responseObject.BaseMapLayers;

    // Set address search parameters
    dojo.byId("txtAddress").setAttribute("defaultAddress", responseObject.LocatorSettings.DefaultValue);
    dojo.byId('txtAddress').value = responseObject.LocatorSettings.DefaultValue;
    dojo.byId("txtAddress").setAttribute("defaultAddressTitle", responseObject.LocatorSettings.DefaultValue);
    dojo.byId("txtAddress").style.color = "gray";
    dojo.connect(dojo.byId('txtAddress'), "ondblclick", ClearDefaultText);
    dojo.connect(dojo.byId('txtAddress'), "onfocus", function (evt) {
        this.style.color = "#FFF";
    });
    lastSearchString = dojo.byId("txtAddress").value.trim();
    dojo.connect(dojo.byId('txtAddress'), "onblur", ReplaceDefaultText);

    //Check whether browser supports geolocation or not using modernizr
    if (!Modernizr.geolocation) {
        dojo.byId("tdGeolocation").style.display = "none";
    }

    var imgBasemap = document.createElement('img');
    imgBasemap.src = "images/imgbasemap.png";
    imgBasemap.className = "imgOptions";
    imgBasemap.title = "Switch Basemap";
    imgBasemap.id = "imgBaseMap";
    imgBasemap.style.cursor = "pointer";
    imgBasemap.onclick = function () {
        ShowBaseMaps();
    }
    dojo.byId("tdBaseMap").appendChild(imgBasemap);
    dojo.byId("tdBaseMap").className = "tdHeader";
    dojo.byId("divSplashScreenContent").style.width = "350px";
    dojo.byId("divSplashScreenContent").style.height = "290px";
    dojo.byId("divAddressContainer").style.display = "block";
    dojo.byId('imgDirections').src = "images/address-details.png";
    dojo.byId('imgDirections').title = "Address Details";
    dojo.byId('imgDirections').style.display = "none";
    dojo.byId('imagAddress').src = "images/address-details.png";
    dojo.byId('imagAddress').title = "address-details";
    dojo.byId('imagAddress').style.display = "none";
    dojo.byId("divLogo").style.display = "block";
    dojo.byId('divSplashContent').innerHTML = responseObject.SplashScreenMessage;
    dojo.byId('imgApp').src = responseObject.ApplicationIcon;
    dojo.byId('lblAppName').innerHTML = responseObject.ApplicationName;

    dojo.xhrGet({
        url: "ErrorMessages.xml",
        handleAs: "xml",
        preventCache: true,
        load: function (xmlResponse) {
            messages = xmlResponse;
        }
    });
    var infoWindow = new js.InfoWindow({
        domNode: dojo.create("div", null, dojo.byId("map"))
    });
    map = new esri.Map("map", {
        slider: true,
        infoWindow: infoWindow
    });
    CreateBaseMapComponent();
    dojo.connect(window, "onresize", function () {
        if (map) {
            map.resize();
            map.reposition();
        }
    });

    helpURL = responseObject.HelpURL;
    dojo.connect(map, "onLoad", function () {
        var zoomExtent;
        var extent = GetQuerystring('extent');
        if (extent != "") {
            zoomExtent = extent.split(',');
        } else {
            zoomExtent = responseObject.DefaultExtent.split(",");
        }
        var startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), new esri.SpatialReference({
            wkid: 102100
        }));
        map.setExtent(startExtent);
        MapInitFunction(map);

    });
    dojo.connect(dojo.byId('imgHelp'), "onclick", function () {
        window.open(responseObject.HelpURL);
    });
    infoPopupFieldsCollection = responseObject.InfoPopupFieldsCollection;
    showNullValueAs = responseObject.ShowNullValueAs;
    addressLayerURL = responseObject.AddressLayer;
    contactsLayerURL = responseObject.ContactsLayer;
    locatorSettings = responseObject.LocatorSettings;
    geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);
    defaultImg = responseObject.LocatorMarkupSymbolPath;
    mandatoryContactFields = responseObject.MandatoryContactFields;
    mandatoryAddressFields = responseObject.MandatoryAddressFields;
    successMessage = responseObject.SuccessMessage;
    referenceOverlayLayer = responseObject.ReferenceOverlayLayer;
    infoInputPopupFieldsCollection = responseObject.InfoInputPopupFieldsCollection;
    infoPopupHeight = responseObject.InfoPopupHeight;
    infoPopupWidth = responseObject.InfoPopupWidth;
    infoPopupFieldsCollection = responseObject.InfoPopupFieldsCollection;
    infoWindowHeader = responseObject.InfoWindowHeader;
    defaultAddressFields = responseObject.DefaultAddressValues;
    addressLayerFieldType = responseObject.AddressLayerFieldType;
    databaseFields = responseObject.DatabaseFields;
    addressObjectId = responseObject.AddressObjectId;
}

function MapInitFunction(map) {
    dojo.byId('divSplashScreenContainer').style.display = "block";
    dojo.addClass(dojo.byId('divSplashScreenContent'), "divSplashScreenDialogContent");
    SetSplashScreenHeight();

    var gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = tempGraphicLayer;
    map.addLayer(gLayer);

    gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = tempAddressLayer;
    map.addLayer(gLayer);

    // Add Address layer
    addressLayer = new esri.layers.FeatureLayer(addressLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
        outFields: ["*"],
        id: addressLayerID,
        displayOnPan: false
    });

    // Add Contacts layer
    contactsLayer = new esri.layers.FeatureLayer(contactsLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: ["*"],
        id: contactsLayerID,
        displayOnPan: false
    });
    map.addLayer(contactsLayer);
    map.addLayer(addressLayer);

    dojo.connect(addressLayer, "onClick", function (evt) {
        dojo.byId('spanContactErrorMessage').style.display = "none";
        selectedMapPoint = null;
        map.getLayer(tempAddressLayer).clear();
        map.getLayer(tempGraphicLayer).clear();
        map.infoWindow.hide();
        ResetValues();
        RemoveChildren(dojo.byId("divSuccessMessage"));
        //Cancelling event propagation
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
        setTimeout(function () {
            ShowInfoWindowDetails(evt.mapPoint, evt.graphic.attributes);
        }, 700);
    });

    dojo.connect(addressLayer, "onUpdateEnd", function (evt) {
        if (!addressFields) {
            addressFields = [];
            var divNewAddress = dojo.byId('divNewAddress');
            divNewAddress.style.display = "block";
            var tableContainer = dojo.create("table", {}, divNewAddress);
            tableContainer.style.width = "100%";
            tableContainer.style.height = "100%";
            tableContainer.cellSpacing = "0px";
            tableContainer.cellPadding = "0px";
            var tbodyContainer = dojo.create("tbody", {}, tableContainer);
            for (var i in addressLayer.fields) {
                if (!(addressLayer.fields[i].type == addressLayerFieldType)) {
                    var index = dojo.indexOf(infoInputPopupFieldsCollection, addressLayer.fields[i].name);
                    if (index == -1) {
                        continue;
                    }
                    addressFields.push({
                        "index": index,
                        "attributeName": addressLayer.fields[i].name,
                        "attributeAlias": addressLayer.fields[i].alias,
                        "length": addressLayer.fields[i].length,
                        "isDomain": (addressLayer.fields[i].domain) ? true : false,
                        "domainValues": (addressLayer.fields[i].domain) ? addressLayer.fields[i].domain.codedValues : null
                    });
                }
            }
            addressFields.sort(sortFields);

            for (var i in addressFields) {
                var trAddress = dojo.create("tr", {}, tbodyContainer);
                var tdDisplayName = dojo.create("td", {}, trAddress);
                tdDisplayName.style.width = "45%";
                tdDisplayName.style.color = "white";
                tdDisplayName.style.fontSize = "11px";
                tdDisplayName.innerHTML = addressFields[i].attributeAlias;

                var tdControl = dojo.create("td", {}, trAddress);
                if (addressFields[i].isDomain) {
                    var cmbBox = new dijit.form.ComboBox({
                        "searchAttr": "name",
                        "id": addressFields[i].attributeName,
                        autocomplete: true,
                        filteringselect: true,
                        "style": {
                            "color": "White",
                            "border-width": "1px",
                            "border-radius": "3px"
                        }
                    }, dojo.create("input"));
                    tdControl.appendChild(cmbBox.domNode);
                    dojo.byId(addressFields[i].attributeName).readOnly = "readonly";
                    var options = {
                        identifier: 'id',
                        items: []
                    };
                    for (var domain in addressFields[i].domainValues) {
                        options.items[domain] = {
                            id: addressFields[i].domainValues[domain].code,
                            name: addressFields[i].domainValues[domain].name
                        };
                    }
                    var store = new dojo.store.Memory({
                        data: options
                    });
                    cmbBox.store = store;

                } else {
                    var input = dojo.create("input", {
                        "type": "text",
                        "class": "addressTxtBox",
                        "id": addressFields[i].attributeName,
                        "length": addressFields[i].length
                    }, tdControl);
                    input.maxLength = addressFields[i].length;
                }
            }
            if (dojo.isIE) {
                dojo.query('.claro .dijitComboBox .dijitArrowButtonInner')[0].style.marginTop = "1px";
                dojo.query('.claro .dijitComboBox .dijitArrowButtonInner')[1].style.marginTop = "1px";
            }
        }
        HideProgressIndicator();
        defaultAddressSymbol = addressLayer.renderer.infos[1].symbol.url;
    });


    dojo.connect(map, "onExtentChange", function (evt) {
        map.infoWindow.hide();
        SetMapTipPosition();
    });

    if (referenceOverlayLayer.DisplayOnLoad) {
        var overlaymap;
        var layerType = referenceOverlayLayer.ServiceUrl.substring(((referenceOverlayLayer.ServiceUrl.lastIndexOf("/")) + 1), (referenceOverlayLayer.ServiceUrl.length));
        if (!isNaN(layerType)) {
            overlaymap = new esri.layers.FeatureLayer(referenceOverlayLayer.ServiceUrl, {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"]
            });
            map.addLayer(overlaymap);

        } else {
            var url1 = referenceOverlayLayer.ServiceUrl + "?f=json";
            esri.request({
                url: url1,
                handleAs: "json",
                load: function (data) {
                    if (!data.singleFusedMapCache) {
                        var imageParameters = new esri.layers.ImageParameters();
                        //Takes a URL to a non cached map service.
                        overlaymap = new esri.layers.ArcGISDynamicMapServiceLayer(referenceOverlayLayer.ServiceUrl, {
                            "imageParameters": imageParameters
                        });
                        map.addLayer(overlaymap);
                    } else {
                        overlaymap = new esri.layers.ArcGISTiledMapServiceLayer(referenceOverlayLayer.ServiceUrl);
                        map.addLayer(overlaymap);
                    }
                }
            });
        }
    }
}

dojo.addOnLoad(init);