/** @license
 | Version 10.2
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

//Get candidate results for searched address
function LocateAddress() {
    dojo.byId("imgSearchLoader").style.display = "block";
    if (dojo.byId("txtAddress").value.trim() == '') {
        dojo.byId("imgSearchLoader").style.display = "none";
        RemoveChildren(dojo.byId('tblAddressResults'));
        CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
        if (dojo.byId("txtAddress").value != "") {
            alert(messages.getElementsByTagName("addressToLocate")[0].childNodes[0].nodeValue);
        }
        return;
    }
    var address = [];
    address[locatorSettings.LocatorParameters[0]] = dojo.byId('txtAddress').value;
    var locator1 = new esri.tasks.Locator(locatorSettings.LocatorURL);
    locator1.outSpatialReference = map.spatialReference;
    locator1.addressToLocations(address, ["Loc_name"], function (candidates) {
        ShowLocatedAddress(candidates);
    },
    function (err) {
        dojo.byId("imgSearchLoader").style.display = "none";
        LoctorErrBack("noSearchResults");
    });
}

//Function to populate candidate address list in address container

function ShowLocatedAddress(candidates) {
    RemoveChildren(dojo.byId('tblAddressResults'));
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
    if (candidates.length > 0) {
        var table = dojo.byId("tblAddressResults");
        var tBody = document.createElement("tbody");
        table.appendChild(tBody);
        table.cellSpacing = 0;
        table.cellPadding = 0;
        dojo.byId("imgSearchLoader").style.display = "none";
        //Filter and display valid address results according to locator settings in configuration file
        var counter = 0;
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i].score > locatorSettings.AddressMatchScore) {
                for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
                    if (map.getLayer(baseMapLayers[bMap].Key).visible) {
                        var bmap = baseMapLayers[bMap].Key;
                    }
                }
                if (map.getLayer(bmap).fullExtent.contains(candidates[i].location)) {
                    for (j in locatorSettings.LocatorFieldValues) {
                        if (candidates[i].attributes[locatorSettings.LocatorFieldName] == locatorSettings.LocatorFieldValues[j]) {
                            counter++;
                            var candidate = candidates[i];
                            var tr = document.createElement("tr");
                            tBody.appendChild(tr);
                            var td1 = document.createElement("td");
                            td1.innerHTML = candidate.address;
                            td1.align = "left";
                            td1.className = 'bottomborder';
                            td1.style.cursor = "pointer";
                            td1.height = 20;
                            td1.setAttribute("x", candidate.location.x);
                            td1.setAttribute("y", candidate.location.y);
                            td1.setAttribute("address", candidate.address);
                            td1.onclick = function () {
                                dojo.byId("txtAddress").value = this.innerHTML;
                                dojo.byId('txtAddress').setAttribute("defaultAddress", this.innerHTML);
                                dojo.byId("txtAddress").setAttribute("defaultAddressTitle", this.innerHTML);
                                mapPoint = new esri.geometry.Point(this.getAttribute("x"), this.getAttribute("y"), map.spatialReference);
                                LocateGraphicOnMap(mapPoint);
                            }
                            tr.appendChild(td1);
                        }
                    }
                }
            }
        }

        //Display error message if there are no valid candidate addresses
        if (counter == 0) {
            var tr = document.createElement("tr");
            tBody.appendChild(tr);
            var td1 = document.createElement("td");
            td1.innerHTML = messages.getElementsByTagName("noSearchResults")[0].childNodes[0].nodeValue;
            tr.appendChild(td1);
            dojo.byId("imgSearchLoader").style.display = "none";
            return;
        }
        dojo.byId("imgSearchLoader").style.display = "none";
        SetAddressResultsHeight();
    }
    else {
        dojo.byId("imgSearchLoader").style.display = "none";
        map.infoWindow.hide();
        mapPoint = null;
        ClearSelection();
        map.getLayer(tempGraphicsLayerId).clear();
        var imgToggle = dojo.byId('imgToggleResults');
        if (imgToggle.getAttribute("state") == "maximized") {
            imgToggle.setAttribute("state", "minimized");
            WipeOutResults();
            dojo.byId('imgToggleResults').src = "images/up.png";
            dojo.byId('imgToggleResults').title = "Show Panel";
        }

        LoctorErrBack("noSearchResults");
    }
}
//Locate searched address on map with pushpin graphic
function LocateGraphicOnMap(mapPoint) {
    selectedMapPoint = null;
    map.infoWindow.hide();
    ClearGraphics();
    if (mapPoint) {
        var ext = GetExtent(mapPoint);
        map.setExtent(ext.getExtent().expand(2));
        if (map.getLayer(tempGraphicLayer)) {
            map.getLayer(tempGraphicLayer).clear();
        }
        var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.DefaultLocatorSymbol, locatorSettings.SymbolSize.width, locatorSettings.SymbolSize.height);
        var graphic = new esri.Graphic(mapPoint, symbol, null, null);
        map.getLayer(tempGraphicLayer).add(graphic);

    }
    HideAddressContainer();
    map.infoWindow.hide();
}

//This function is called when locator service fails or does not return any data
function LoctorErrBack(val) {
    RemoveChildren(dojo.byId('tblAddressResults'));
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));

    var table = dojo.byId("tblAddressResults");
    var tBody = document.createElement("tbody");
    table.appendChild(tBody);
    table.cellSpacing = 0;
    table.cellPadding = 0;
    var tr = document.createElement("tr");
    tBody.appendChild(tr);
    var td1 = document.createElement("td");
    td1.innerHTML = messages.getElementsByTagName(val)[0].childNodes[0].nodeValue;
    tr.appendChild(td1);
}

//function to get the extent based on the mappoint
function GetExtent(point) {
    var xmin = point.x;
    var ymin = (point.y) - 30;
    var xmax = point.x;
    var ymax = point.y;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}