/** @license
 | Version 10.1.1
 | Copyright 2012 Esri
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
//function for locating an address
function Locate() {
    if (dojo.byId('imgGPS').src == "images/BlueGPS.png") {
        dojo.byId('imgGPS').src = "images/gps.png";
        var gpsButton = dijit.byId('imgGPSButton');
        gpsButton.attr("checked", false);
    }
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }

    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/
        var ffversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        if (ffversion >= 5) {
            document.getElementById('divAddressContainer').style.right = "250px";
        }
    }
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
        if (dojo.isIE >= 9) {
            document.getElementById('divAddressContainer').style.right = "230px";
        }
        else if (dojo.isIE == 7) {
            document.getElementById('divAddressContainer').style.right = "175px";
        }
        else if (dojo.isIE == 8) {
            document.getElementById('divAddressContainer').style.right = "180px";
        }
    }
    if (dojo.trim(dojo.byId("txtAddress").value) == '') {
        // ShowDialog('Locator Error', "Please enter address to locate");
        alert(messages.getElementsByTagName("blankAddress")[0].childNodes[0].nodeValue);
        return;
    }
    var address = [];

    address[locatorFields] = dojo.byId('txtAddress').value;

    ShowLoadingMessage('Searching...');
    locator.outSpatialReference = map.spatialReference;
    locator.addressToLocations(address, ["Loc_name"], function (candidates) {
        ShowLocatedAddress(candidates);
    }, function (err) {
        HideLoadingMessage();
        // ShowDialog('Locator Error', "Unable to locate address");
        alert(messages.getElementsByTagName("unableToLocateAddress")[0].childNodes[0].nodeValue);
    });

}
//function to validate US ZIP code
function isValidZipCode(value) {
    var re = /^\d{5}([\-]\d{4})?$/;
    return re.test(value);
}

//function to populate address
function ShowLocatedAddress(candidates) {
    RemoveChildren(dojo.byId('divAddressContainer'));
    if (candidates.length > 0) {
        if (candidates[0].score == 100) {
            HideLoadingMessage();
            mapPoint = new esri.geometry.Point(candidates[0].location.x, candidates[0].location.y, map.spatialReference);
            LocateAddressOnMap(mapPoint);
        }
        else {
            var table = document.createElement("table");
            var tBody = document.createElement("tbody");
            table.appendChild(tBody);
            table.className = "tbl";
            table.cellSpacing = 0;
            table.cellPadding = 0;
            for (var i = 0; i < candidates.length; i++) {
                var candidate = candidates[i];
                var tr = document.createElement("tr");
                tBody.appendChild(tr);
                var td1 = document.createElement("td");
                td1.innerHTML = candidate.address;
                td1.className = 'tdAddress';
                td1.height = 20;
                td1.setAttribute("x", candidate.location.x);
                td1.setAttribute("y", candidate.location.y);
                td1.setAttribute("address", candidate.address);
                td1.onclick = function () {
                    dojo.byId('txtAddress').value = this.innerHTML;
                    mapPoint = new esri.geometry.Point(this.getAttribute("x"), this.getAttribute("y"), new esri.SpatialReference({ wkid: 4326 }));
                    LocateAddressOnMap(mapPoint);
                }
                tr.appendChild(td1);
            }
            dojo.byId('divAddressContainer').appendChild(table);
            AnimateAdvanceSearch();
            var node = dojo.byId('divBaseMapTitleContainer');
            if (dojo.coords(node).h > 0) {
                WipeOutControl(node, 500);
            }
        }
    }
    else {
        if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
            WipeOutControl(dojo.byId('divAddressContainer'), 500);
        }
        dojo.byId('txtAddress').value = '';
        dojo.byId('txtAddress').focus();
        alert(messages.getElementsByTagName("unableToLocateAddress")[0].childNodes[0].nodeValue);
    }
    HideLoadingMessage();
}

//function to locate address on map
function LocateAddressOnMap(imgLocate) {
    ShowLoadingMessage('Locating...');

    ClearGraphics();

    var graphicCollection = new esri.geometry.Multipoint(map.spatialReference);
    graphicCollection.addPoint(mapPoint);
    geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
        mapPoint = newPointCollection[0].getPoint(0);
        map.centerAndZoom(mapPoint, map._slider.maximum - 1);
        if (map.getLayer(tempGraphicLayer)) {
            map.getLayer(tempGraphicLayer).clear();
        }

        var symbol = new esri.symbol.PictureMarkerSymbol('images/pushpin.png', 25, 25);
        graphic = new esri.Graphic(mapPoint, symbol, null, null);
        var features = [];
        features.push(graphic);
        var featureSet = new esri.tasks.FeatureSet();
        featureSet.features = features;
        var layer = map.getLayer(tempGraphicLayer);
        layer.add(featureSet.features[0]);
        HideLoadingMessage();
    });
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }
    map.infoWindow.hide();
}

//function for locating current location
function ShowMyLocation() {
    if (dojo.coords(dojo.byId('divBaseMapTitleContainer')).h > 0) {
        WipeOutControl(dojo.byId('divBaseMapTitleContainer'), 400);
    }
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }
    dijit.byId('imgAddress').attr("checked", false);
    dijit.byId('imgBaseMap').attr("checked", false);
    dojo.byId('imgGPS').src = "images/BlueGPS.png";
    if (map.getLayer(tempGraphicLayer)) {
        map.getLayer(tempGraphicLayer).clear();
    }
    navigator.geolocation.getCurrentPosition(
		function (position) {
		    ShowLoadingMessage("Finding your current location...");
		    mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({ wkid: 4326 }));
		    var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({ wkid: 4326 }));
		    graphicCollection.addPoint(mapPoint);
		    geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
		        HideLoadingMessage();
		        mapPoint = newPointCollection[0].getPoint(0);
		        if (!map.getLayer(baseMapLayerCollection[0].Key).fullExtent.contains(mapPoint)) {
		            alert(messages.getElementsByTagName("dataNotAvailable")[0].childNodes[0].nodeValue);
		            return;
		        }
		        map.centerAndZoom(mapPoint, map._slider.maximum - 2);
		        var gpsSymbol = new esri.symbol.PictureMarkerSymbol(defaultImg, 25, 25);
		        var attr = {
		            lat: position.coords.longitude,
		            long: position.coords.latitude
		        };
		        var graphic = new esri.Graphic(mapPoint, gpsSymbol, attr, null);
		        map.getLayer(tempGraphicLayer).add(graphic);
		    });
		},
		function (error) {
		    HideLoadingMessage();
		    if (dojo.byId('imgGPS').src = "images/BlueGPS.png") {
		        dojo.byId('imgGPS').src = "images/gps.png";
		        var gpsButton = dijit.byId('imgGPSButton');
		        gpsButton.attr("checked", false);
		    }
		    switch (error.code) {
		        case error.TIMEOUT:
		            alert(messages.getElementsByTagName("timeOut")[0].childNodes[0].nodeValue);
		            break;
		        case error.POSITION_UNAVAILABLE:
		            alert(messages.getElementsByTagName("positionUnavailable")[0].childNodes[0].nodeValue);
		            break;
		        case error.PERMISSION_DENIED:
		            alert(messages.getElementsByTagName("permissionDenied")[0].childNodes[0].nodeValue);
		            break;
		        case error.UNKNOWN_ERROR:
		            alert(messages.getElementsByTagName("unknownError")[0].childNodes[0].nodeValue);
		            break;
		    }
		}, { timeout: 5000 });

}