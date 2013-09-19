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
//Set height for splash screen
function SetSplashScreenHeight() {
    var height = dojo.coords(dojo.byId('divSplashScreenContent')).h - 80;
    dojo.byId('divSplashContent').style.height = (height + 14) + "px";
    CreateScrollbar(dojo.byId("divSplashContainer"), dojo.byId("divSplashContent"));
}

//Hide splash screen container
function HideSplashScreenMessage() {
    if (dojo.isIE < 9) {
        dojo.byId("divSplashScreenContent").style.display = "none";
    }
    dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");
}

//Function for Clearing graphics on map
function ClearGraphics() {
    if (map.getLayer(tempGraphicLayer)) {
        map.getLayer(tempGraphicLayer).clear();
    }
    if (map.getLayer(tempAddressLayer)) {
        map.getLayer(tempAddressLayer).clear();
    }
}

//Function for refreshing address container div
function RemoveChildren(parentNode) {
    while (parentNode.hasChildNodes()) {
    parentNode.removeChild(parentNode.lastChild);
    }
}


function sortFields(a, b) {
    return ((a.index < b.index) ? -1 : ((a.index > b.index) ? 1 : 0))
}


//Set default value on blur
function ReplaceDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    ResetTargetValue(target, "defaultAddressTitle", "gray");
}

//Set changed value for address/casename
function ResetTargetValue(target, title, color) {
    if (target.value == '' && target.getAttribute(title)) {
        target.value = target.title;
        if (target.title == "") {
            target.value = target.getAttribute(title);
            target.style.color = color;
        }
    }
}

//Clear default value for text box controls
function ClearDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    target.style.color = "#FFF";
    target.value = '';
}

//Function to append ... for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//function for triming the string and removing spaces between them
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}

//Create infowindow container for address details
function ShowInfoWindowDetails(mapPoint, attributes) {

    HideAddressContainer();
    HideBaseMapLayerContainer();
    dojo.byId("divInfoDetails").style.position = "relative";
    map.infoWindow.hide();
    dojo.byId('divCreateRequest').style.display = "none";
    dojo.byId('divInfoContent').style.display = "none";
    dojo.byId('divInfoContent').style.width = infoPopupWidth + "px";
    dojo.byId('divInfoContent').style.height = infoPopupHeight + "px";
    for (var i in attributes) {
        if (!attributes[i]) {
            attributes[i] = "";
        }
    }
    //Set infowindow size based on devices or desktop browsers
    map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
    map.setExtent(GetBrowserMapExtent(mapPoint));
    setTimeout(function () {
        selectedMapPoint = mapPoint;
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);
        PopulateInfoDetails(mapPoint, attributes);
    }, 500);
}

//Get the extent based on the map point for browser
function GetBrowserMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 2.7);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

function ResetAddressData() {
    for (var i in addressFields) {
        if (addressFields[i].isDomain) {
            dijit.byId(addressFields[i].attributeName).setValue("");
        } else {
            dojo.byId(addressFields[i].attributeName).value = "";
        }
    }
}

function ResetValues() {
    dojo.byId("txtcontact").value = "";
    dojo.byId("txthomephone").value = "";
    dojo.byId("txtworkphone").value = "";
    dojo.byId("txtcellphone").value = "";
    dojo.byId("txtemail").value = "";
}

//function to remove scroll bar
function RemoveScrollBar(container) {
    if (dojo.byId(container.id + 'scrollbar_track')) {
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
}

function NavigateNextTab() {
    if (dojo.byId('divNewAddress').style.display == "block") {
        ValidateSiteAddress();
    }
}

function ValidateSiteAddress() {
    for (var i in mandatoryAddressFields) {
        var counter = 0;
        var attributes = mandatoryAddressFields[i].Attributes.split(",");
        for (var attCount in attributes) {
            var fieldItem = dojo.byId(attributes[attCount]);
            if (!fieldItem.value || fieldItem.value.length == 0 || fieldItem.value.trim() == "") {
                counter++;
            }
        }
        if (0 < counter) {
            ShowErrorMessage('spanErrorMessage', mandatoryAddressFields[i].Message, 'yellow');
            return;
        }
    }

    isAddressDataValid = true;
    dojo.byId("imgContact").style.display = "none";
    dojo.byId("imagAddress").style.display = "block";
    dojo.byId("divNewAddress").style.display = "none";
    dojo.byId("divNewContacts").style.display = "block";
    dojo.byId("divAddressList").appendChild(dojo.byId("divNewContacts"));
    dojo.byId("divNext").style.display = "none";
    ShowErrorMessage('spanErrorMessage', "");
}

//function to set text to span control
function ShowErrorMessage(control, message, color) {
    var ctl = dojo.byId(control);
    ctl.style.display = 'block';
    ctl.innerHTML = message;
    ctl.style.color = color;
}


//Function for refreshing address container div
function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

//Show infowindow to add address and contact details for a new address point
function AddNewAddress() {
    map.infoWindow.hide();
    HideAddressContainer();
    HideBaseMapLayerContainer();
    dojo.byId("imgContact").style.display = "block";
    dojo.byId("imagAddress").style.display = "none";
    map.setMapCursor('crosshair');
    var handle = dojo.connect(map, "onClick", function (evt) {
        dojo.byId('spanContactErrorMessage').style.display = "none";
        dojo.byId("imgContacts").style.position = "relative";
        dojo.byId("imgContact").style.position = "relative";
        mapPoint = evt.mapPoint;
        map.infoWindow.hide();
        objectId = null;
        selectedMapPoint = null;
        ResetValues();
        ShowProgressIndicator();
        setTimeout(function () {
            dojo.byId("divInfoDetails").style.display = "none";
            dojo.byId("divNewContacts").style.display = "none";
            dojo.byId("divSuccessMessage").style.display = "none";
            AddServiceRequest(evt.mapPoint);
            map.setMapCursor('default');
            dojo.disconnect(handle);
            HideProgressIndicator();
        }, 500);

    });

}

//Validate fields before saving details for new address point
function SaveNewContact() {
    for (var i in mandatoryContactFields) {
        var counter = 0;
        var attributes = mandatoryContactFields[i].Attributes.toLowerCase().split(",");
        for (var attCount in attributes) {
            if (mandatoryContactFields[i].isComboBox) {
                if (dijit.byId('cmb' + attributes[attCount]).value.length == 0 || dijit.byId('cmb' + attributes[attCount]).value.trim() == "") {
                    counter++;
                }
            } else {
                if (dojo.byId('txt' + attributes[attCount]).value.length == 0 || dojo.byId('txt' + attributes[attCount]).value.trim() == "") {
                    counter++;
                }
            }
        }
        if (counter == attributes.length) {
            ShowErrorMessage('spanContactErrorMessage', mandatoryContactFields[i].Message, 'yellow');
            return;
        }
    }

    if (!objectId) {
        var feedAttributes = {};

        for (var i in addressFields) {
            if (addressFields[i].isDomain) {
                if (dijit.byId(addressFields[i].attributeName).item) {
                    feedAttributes[addressFields[i].attributeName] = dijit.byId(addressFields[i].attributeName).item.id[0];
                } else {
                    feedAttributes[addressFields[i].attributeName] = null;
                }
            } else {
                var newValue = dojo.byId(addressFields[i].attributeName).value.trim();
                if (0 < newValue.length) {
                    feedAttributes[addressFields[i].attributeName] = newValue;
                } else {
                    feedAttributes[addressFields[i].attributeName] = null;
                }
            }
        }

        for (var i in defaultAddressFields) {
            feedAttributes[i] = defaultAddressFields[i];
        }

        ShowProgressIndicator();
        var submitFeedGraphic = new esri.Graphic(mapPoint, null, feedAttributes, null);
        if (!map.getLayer(baseMapLayers[0].Key).fullExtent.contains(mapPoint)) {
            alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
            HideProgressIndicator();
            map.infoWindow.hide();
            return;
        } else {
            map.getLayer(addressLayerID).applyEdits([submitFeedGraphic], null, null, function (addResults) {
                var qTask = new esri.tasks.QueryTask(operationalLayers.Address.LayerURL);
                var query = new esri.tasks.Query();
                query.where = map.getLayer(addressLayerID).objectIdField + "=" + addResults[0].objectId;
                query.outFields = ["*"];
                query.returnGeometry = true;
                query.outSpatialReference = map.spatialReference;
                qTask.execute(query, function (featureset) {
                    var attr = {};
                    var siteAdrId = operationalLayers.Address.PrimaryKeyforFeature.split("{")[1];
                    siteAdrId = siteAdrId.split("}")[0];
                    try {
                        siteAddressId = String(operationalLayers.Address.PrimaryKeyPrefixValue + dojo.string.substitute(operationalLayers.Address.PrimaryKeySuffixValue, featureset.features[0].attributes));
                        attr[map.getLayer(addressLayerID).objectIdField] = dojo.string.substitute(operationalLayers.Address.ObjectId, featureset.features[0].attributes);
                    } catch (e) {
                        alert(messages.getElementsByTagName("falseConfigParams")[0].childNodes[0].nodeValue);
                    }
                    attr[siteAdrId] = siteAddressId;
                    var requestGraphic = new esri.Graphic(mapPoint, null, attr, null);
                    map.getLayer(addressLayerID).applyEdits(null, [requestGraphic], null, function (evt) {
                        if (addResults[0].objectId != -1) {
                            dojo.byId("imgDirections").style.display = "none";
                            dojo.byId("tdInfoHeader").innerHTML = "";
                            dojo.byId("divCreateRequest").style.display = "none";
                            dojo.byId("divInfoContent").style.display = "block";
                            dojo.byId("imgContacts").style.display = "none";
                            dojo.byId("imgDirections").style.display = "none";
                            SaveContact(siteAddressId);
                        } else {
                            alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
                        }
                        HideProgressIndicator();
                    }, function (err) {
                        alert(messages.getElementsByTagName("unableToUpdateContact")[0].childNodes[0].nodeValue);
                        HideProgressIndicator();
                    });
                });
            }, function (err) {
                map.infoWindow.hide();
                alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
                HideProgressIndicator();
                return;
            });
        }
    } else {
        SaveContact(siteAddressId);
    }
}
// Save details for new address point
function SaveContact(interestID) {
    ShowProgressIndicator();
    var newContactGraphic = new esri.Graphic();
    var attr = {};
    attr[databaseFields.ContactIdFieldName] = '';
    attr[databaseFields.ContactFieldName] = dojo.byId("txtcontact").value.trim();
    attr[databaseFields.HomePhoneFieldName] = dojo.byId("txthomephone").value.trim();
    attr[databaseFields.WorkPhoneFieldName] = dojo.byId("txtworkphone").value.trim();
    attr[databaseFields.CellPhoneFieldName] = dojo.byId("txtcellphone").value.trim();
    attr[databaseFields.EmailFieldName] = dojo.byId("txtemail").value.trim();
    attr[operationalLayers.Contacts.ForeignKeyforAddressLayer] = interestID;
    attr[databaseFields.SmsFieldName] = '';
    newContactGraphic.setAttributes(attr);
    map.getLayer(contactsLayerID).applyEdits([newContactGraphic], null, null, function (msg) {
        if (msg[0].error) {
            HideProgressIndicator();
            alert(messages.getElementsByTagName("contactError")[0].childNodes[0].nodeValue);
        } else {
            var qTask = new esri.tasks.QueryTask(operationalLayers.Contacts.LayerURL);
            var query = new esri.tasks.Query();
            query.where = map.getLayer(contactsLayerID).objectIdField + "=" + msg[0].objectId;
            query.outFields = ["*"];
            query.returnGeometry = true;
            query.outSpatialReference = map.spatialReference;
            qTask.execute(query, function (featureset) {

                var attr = {};
                try {
                    attr[operationalLayers.Contacts.UniqueID] = String(operationalLayers.Contacts.UniqueIDPrefixValue + dojo.string.substitute(operationalLayers.Contacts.UniqueIDSuffixValue, featureset.features[0].attributes));
                    attr[map.getLayer(contactsLayerID).objectIdField] = dojo.string.substitute(operationalLayers.Contacts.ObjectId, featureset.features[0].attributes);
                } catch (e) {
                    alert(messages.getElementsByTagName("falseConfigParams")[0].childNodes[0].nodeValue);
                }
                var requestGraphic = new esri.Graphic(null, null, attr, null);
                map.getLayer(contactsLayerID).applyEdits(null, [requestGraphic], null, function (evt) {
                    siteAddressId = null;
                    ResetValues();
                    dojo.empty(dojo.byId("divSuccessMessage"));
                    dojo.byId('divNewContacts').style.display = "none";
                    dojo.byId("divSuccessMessage").style.display = "block";
                    var table = document.createElement("table");
                    table.style.color = "white";
                    var tbody = document.createElement("tbody");
                    table.appendChild(tbody);
                    table.style.fontsize = "11px";
                    var tr = document.createElement("tr");
                    tbody.appendChild(tr);
                    tr.style.fontSize = "11px";
                    var td = document.createElement("td");
                    tr.appendChild(td);
                    td.innerHTML = successMessage;
                    td.style.fontSize = "11px";
                    dojo.byId("divSuccessMessage").appendChild(table);
                    dojo.byId('divContactContainer').appendChild(dojo.byId('divSuccessMessage'));
                    dojo.byId("divSuccessMessage").style.display = "block";
                    HideProgressIndicator();
                }, function (err) {
                    alert(messages.getElementsByTagName("unableToUpdateSiteAddressId")[0].childNodes[0].nodeValue);
                    HideProgressIndicator();
                });
            });
        }

    }, function (err) {
        alert(messages.getElementsByTagName("unableToAddContact")[0].childNodes[0].nodeValue);
        HideProgressIndicator();
    });
}

//Creating dynamic scrollbar within container for target content
function CreateScrollbar(container, content) {
    var yMax;
    var pxLeft, pxTop, xCoord, yCoord;
    var scrollbar_track;
    var isHandleClicked = false;
    this.container = container;
    this.content = content;
    content.scrollTop = "0px";

    if (dojo.byId(container.id + 'scrollbar_track')) {
        RemoveChildren(dojo.byId(container.id + 'scrollbar_track'));
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
    if (!dojo.byId(container.id + 'scrollbar_track')) {
        scrollbar_track = document.createElement('div');
        scrollbar_track.id = container.id + "scrollbar_track";
        scrollbar_track.className = "scrollbar_track";
    } else {
        scrollbar_track = dojo.byId(container.id + 'scrollbar_track');
    }

    var containerHeight = dojo.coords(container);
    if (container.id == 'address_container') {
        scrollbar_track.style.height = containerHeight.h + "px";
        scrollbar_track.style.top = containerHeight.t + 'px';
        scrollbar_track.style.right = 0 + 'px';
    } else {
        var h = containerHeight.h;
        if (h > 19) {
            scrollbar_track.style.height = (containerHeight.h - 20) + "px";
        }
        if (containerHeight.t >= 0) {
            scrollbar_track.style.top = containerHeight.t + 'px';
        }
        scrollbar_track.style.right = 0 + 'px';
    }

    var scrollbar_handle = document.createElement('div');
    scrollbar_handle.className = 'scrollbar_handle';
    scrollbar_handle.id = container.id + "scrollbar_handle";

    scrollbar_track.appendChild(scrollbar_handle);
    container.appendChild(scrollbar_track);

    if (content.scrollHeight <= content.offsetHeight) {
        scrollbar_handle.style.display = 'none';
        scrollbar_track.style.display = 'none';
        return;
    } else {
        if ((dojo.byId("divCreateRequest").style.display) == "block") {
            dojo.byId("divCreateRequestContentscrollbar_track").style.top = "35px";
        }
        scrollbar_handle.style.display = 'block';
        scrollbar_track.style.display = 'block';
        scrollbar_handle.style.height = Math.max(this.content.offsetHeight * (this.content.offsetHeight / this.content.scrollHeight), 25) + 'px';
        yMax = this.content.offsetHeight - scrollbar_handle.offsetHeight;

        if (window.addEventListener) {
            content.addEventListener('DOMMouseScroll', ScrollDiv, false);
        }

        content.onmousewheel = function (evt) {
            console.log(content.id);
            ScrollDiv(evt);
        }
    }

    function ScrollDiv(evt) {
        var evt = window.event || evt //equalize event object
        var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //delta returns +120 when wheel is scrolled up, -120 when scrolled down
        pxTop = scrollbar_handle.offsetTop;

        if (delta <= -120) {
            var y = pxTop + 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        } else {
            var y = pxTop - 10;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    }

    //Attaching events to scrollbar components
    scrollbar_track.onclick = function (evt) {
        if (!isHandleClicked) {
            evt = (evt) ? evt : event;
            pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
            var offsetY;
            if (!evt.offsetY) {
                var coords = dojo.coords(evt.target);
                offsetY = evt.layerY - coords.t;
            } else offsetY = evt.offsetY;
            if (offsetY < scrollbar_handle.offsetTop) {
                scrollbar_handle.style.top = offsetY + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            } else if (offsetY > (scrollbar_handle.offsetTop + scrollbar_handle.clientHeight)) {
                var y = offsetY - scrollbar_handle.clientHeight;
                if (y > yMax) y = yMax // Limit vertical movement
                if (y < 0) y = 0 // Limit vertical movement
                scrollbar_handle.style.top = y + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            } else {
                return;
            }
        }
        isHandleClicked = false;
    };

    //Attaching events to scrollbar components
    scrollbar_handle.onmousedown = function (evt) {
        isHandleClicked = true;
        evt = (evt) ? evt : event;
        evt.cancelBubble = true;
        if (evt.stopPropagation) evt.stopPropagation();
        pxTop = scrollbar_handle.offsetTop // Sliders vertical position at start of slide.
        yCoord = evt.screenY // Vertical mouse position at start of slide.
        document.body.style.MozUserSelect = 'none';
        document.body.style.userSelect = 'none';
        document.onselectstart = function () {
            return false;
        }
        document.onmousemove = function (evt) {
            console.log("inside mousemove");
            evt = (evt) ? evt : event;
            evt.cancelBubble = true;
            if (evt.stopPropagation) evt.stopPropagation();
            var y = pxTop + evt.screenY - yCoord;
            if (y > yMax) y = yMax // Limit vertical movement
            if (y < 0) y = 0 // Limit vertical movement
            scrollbar_handle.style.top = y + "px";
            content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
        }
    };

    document.onmouseup = function () {
        document.body.onselectstart = null;
        document.onmousemove = null;
    };

    scrollbar_handle.onmouseout = function (evt) {
        document.body.onselectstart = null;
    };
}

var customMouseHandler = {
    evtHash: [],

    ieGetUniqueID: function (_elem) {
        if (_elem === window) {
            return 'theWindow';
        } else if (_elem === document) {
            return 'theDocument';
        } else {
            return _elem.uniqueID;
        }
    },

    addEvent: function (_elem, _evtName, _fn, _useCapture) {
        if (typeof _elem.addEventListener != 'undefined') {
            if (_evtName == 'mouseenter') {
                _elem.addEventListener('mouseover', customMouseHandler.mouseEnter(_fn), _useCapture);
            } else if (_evtName == 'mouseleave') {
                _elem.addEventListener('mouseout', customMouseHandler.mouseEnter(_fn), _useCapture);
            } else {
                _elem.addEventListener(_evtName, _fn, _useCapture);
            }
        } else if (typeof _elem.attachEvent != 'undefined') {
            var key = '{FNKEY::obj_' + customMouseHandler.ieGetUniqueID(_elem) + '::evt_' + _evtName + '::fn_' + _fn + '}';
            var f = customMouseHandler.evtHash[key];
            if (typeof f != 'undefined') {
                return;
            }

            f = function () {
                _fn.call(_elem);
            };

            customMouseHandler.evtHash[key] = f;
            _elem.attachEvent('on' + _evtName, f);

            // attach unload event to the window to clean up possibly IE memory leaks
            window.attachEvent('onunload', function () {
                _elem.detachEvent('on' + _evtName, f);
            });

            key = null;
            //f = null;   /* DON'T null this out, or we won't be able to detach it */
        } else {
            _elem['on' + _evtName] = _fn;
        }
    },

    removeEvent: function (_elem, _evtName, _fn, _useCapture) {
        if (typeof _elem.removeEventListener != 'undefined') {
            _elem.removeEventListener(_evtName, _fn, _useCapture);
        } else if (typeof _elem.detachEvent != 'undefined') {
            var key = '{FNKEY::obj_' + customMouseHandler.ieGetUniqueID(_elem) + '::evt' + _evtName + '::fn_' + _fn + '}';
            var f = customMouseHandler.evtHash[key];
            if (typeof f != 'undefined') {
                _elem.detachEvent('on' + _evtName, f);
                delete customMouseHandler.evtHash[key];
            }

            key = null;
            //f = null;   /* DON'T null this out, or we won't be able to detach it */
        }
    },

    mouseEnter: function (_pFn) {
        return function (_evt) {
            var relTarget = _evt.relatedTarget;
            if (this == relTarget || customMouseHandler.isAChildOf(this, relTarget)) {
                return;
            }

            _pFn.call(this, _evt);
        }
    },

    isAChildOf: function (_parent, _child) {
        if (_parent == _child) {
            return false
        };

        while (_child && _child != _parent) {
            _child = _child.parentNode;
        }

        return _child == _parent;
    }
};

//Display the current location of the user
function ShowMyLocation() {
    HideBaseMapLayerContainer();
    HideAddressContainer();
    navigator.geolocation.getCurrentPosition(

    function (position) {
        ShowProgressIndicator();
        mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({
            wkid: 4326
        }));
        var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({
            wkid: 4326
        }));
        graphicCollection.addPoint(mapPoint);
        geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
            for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
                if (map.getLayer(baseMapLayers[bMap].Key).visible) {
                    var bmap = baseMapLayers[bMap].Key;
                }
            }
            if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {
                mapPoint = null;
                selectedMapPoint = null;
                map.infoWindow.hide();
                HideProgressIndicator();
                alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
                return;
            }
            mapPoint = newPointCollection[0].getPoint(0);
            map.centerAt(mapPoint);
            var graphic = new esri.Graphic(mapPoint, locatorMarkupSymbol, {
                "Locator": true
            }, null);
            map.getLayer(tempGraphicsLayer).add(graphic);
            HideProgressIndicator();
        });
    },

    function (error) {
        HideProgressIndicator();
        switch (error.code) {
            case error.TIMEOUT:
                alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
                break;
            case error.POSITION_UNAVAILABLE:
                alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
                break;
            case error.PERMISSION_DENIED:
                alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
                break;
            case error.UNKNOWN_ERROR:
                alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
                break;
        }
    }, {
        timeout: 10000
    });
}


//Show progress indicator
function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
}

//Hide progress indicator
function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";
}

//Get width of a control when text and font size are specified
String.prototype.getWidth = function (fontSize) {
    var test = document.createElement("span");
    document.body.appendChild(test);
    test.style.visibility = "hidden";
    test.style.fontSize = fontSize + "px";
    test.innerHTML = this;
    var w = test.offsetWidth;
    document.body.removeChild(test);
    return w;
}

//Trim the string
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}

//Append '...' for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}
//Convert String to Boolean
String.prototype.bool = function () {
    return (/^true$/i).test(this);
};

//Reset map position
function SetMapTipPosition() {
    if (selectedMapPoint) {
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.setLocation(screenPoint);
    }
}


//Get query string value of the provided key, if not found the function returns empty string
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null) return _default;
    else return qs[1];
}

//Show address container
function ShowLocateContainer() {
    HideInfoContainer();
    dojo.byId('txtAddress').blur();
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
    }

    if (dojo.coords("divAddressHolder").h > 0) {
        dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAddressHolder').style.height = '0px';
        dojo.byId('txtAddress').blur();
    } else {
        dojo.byId('divAddressHolder').style.height = "300px";
        dojo.replaceClass("divAddressHolder", "showContainerHeight", "hideContainerHeight");
        dojo.byId("txtAddress").value = dojo.byId("txtAddress").getAttribute("defaultAddress");
        lastSearchString = dojo.byId("txtAddress").value;
    }

    if (dojo.byId("txtAddress").getAttribute("defaultAddress") == dojo.byId("txtAddress").getAttribute("defaultAddressTitle")) {
        dojo.byId("txtAddress").style.color = "gray";
    } else {
        dojo.byId("txtAddress").style.color = "#000";
    }
    RemoveChildren(dojo.byId('tblAddressResults'));
    SetAddressResultsHeight();
}

//Hide address container
function HideAddressContainer() {
    dojo.replaceClass("divAddressHolder", "hideContainerHeight", "showContainerHeight");
    dojo.byId('divAddressHolder').style.height = '0px';
}

//Display address details in the infowindow
function ShowInfoAddressView() {
    if (dojo.byId('imgDirections').getAttribute("disp") == "Address Details") {
        dojo.byId('spanContactErrorMessage').style.display = "none";
        dojo.byId('imgContacts').src = "images/contact-details.png";
        dojo.byId('imgContacts').setAttribute("disp", "Comments");
        dojo.byId('divInfoDetails').style.display = "block";
        dojo.byId('divNewContacts').style.display = "none";
        dojo.byId('imgDirections').style.display = "none";
        dojo.byId('imgContacts').style.display = "block";
        SetViewDetailsHeight();
    }
}

//Set height and create scrollbar for address results
function SetAddressResultsHeight() {
    var height = dojo.coords(dojo.byId('divAddressHolder')).h;
    if (height > 0) {
        dojo.byId('divAddressScrollContent').style.height = (height - 120) + "px";
    }
    CreateScrollbar(dojo.byId("divAddressScrollContainer"), dojo.byId("divAddressScrollContent"));
}


//Hide Info request container
function HideInfoContainer() {
    map.getLayer(tempAddressLayer).clear();
    map.getLayer(tempGraphicLayer).clear();
    selectedMapPoint = null;
    map.infoWindow.hide();
    dojo.byId('divInfoContent').style.display = "none";
    dojo.byId("divInfoDetails").style.display = "none";
}

//Set height for view details in info window
function SetViewDetailsHeight() {
    var height = dojo.coords(dojo.byId('divInfoContent')).h;
    if (height > 0) {
        dojo.byId('divInfoDetailsScroll').style.height = (height - 55) + "px";
    }
    CreateScrollbar(dojo.byId("divInfoDetails"), dojo.byId("divInfoDetailsScroll"));
}

//Populate address details in infowindow container
function PopulateInfoDetails(mapPoint, attributes) {
    ShowInfoAddressView();
    dojo.byId("imgContacts").style.display = "block";
    dojo.byId('divInfoContent').style.display = "block";
    dojo.byId("divInfoDetails").style.display = "block";
    RemoveChildren(dojo.byId('tblInfoDetails'));
    value = dojo.string.substitute(infoWindowHeader, attributes).trim();
    value = value.trimString(Math.round(infoPopupWidth / 6));
    if (value.length > Math.round(infoPopupWidth / 6)) {
        dojo.byId('tdInfoHeader').title = dojo.string.substitute(infoWindowHeader, attributes);
    }
    dojo.byId('tdInfoHeader').innerHTML = value;
    var tblInfoDetails = dojo.byId('tblInfoDetails');
    var tbody = document.createElement("tbody");
    tblInfoDetails.appendChild(tbody);

    for (var i in map.getLayer(addressLayerID).fields) {
        if (!attributes[map.getLayer(addressLayerID).fields[i].name]) {
            attributes[map.getLayer(addressLayerID).fields[i].name] = "N/A";
            continue;
        }
    }

    for (var index in infoPopupFieldsCollection) {
        var tr = document.createElement("tr");
        tbody.appendChild(tr);
        CreateTableRow(tr, infoPopupFieldsCollection[index].DisplayText, dojo.string.substitute(infoPopupFieldsCollection[index].FieldName, attributes));
    }
    try {
        siteAddressId = dojo.string.substitute(operationalLayers.Address.PrimaryKeyforFeature, attributes);
        objectId = dojo.string.substitute(operationalLayers.Address.ObjectId, attributes);
    } catch (e) {
        alert(messages.getElementsByTagName("falseConfigParams")[0].childNodes[0].nodeValue);
    }
    SetViewDetailsHeight();
}

//Create row in a table
function CreateTableRow(tr, displayName, value) {
    var td = document.createElement("td");
    td.innerHTML = displayName;
    td.style.height = "18px";
    td.style.width = "120px";
    td.vAlign = "top";
    td.style.paddingTop = "5px";
    var td1 = document.createElement("td");
    td1.style.width = "180px";
    td1.style.paddingTop = "5px";
    td1.style.verticalAlign = "top";
    td1.innerHTML = value;
    tr.appendChild(td);
    tr.appendChild(td1);
}

//Display Contacts container in infowindow
function ShowContactstsView() {
    ResetValues();
    dojo.byId('divContactContainer').appendChild(dojo.byId('divNewContacts'));
    dojo.byId('divNewAddress').style.display = "block";
    dojo.byId('divNewContacts').style.display = "block";
    dojo.byId("imgContacts").style.display = "none";
    dojo.byId('imgDirections').src = "images/address-details.png";
    dojo.byId('imgDirections').title = "Address Details";
    dojo.byId('imgDirections').setAttribute("disp", "Address Details");
    dojo.byId("imgDirections").style.display = "block";
    dojo.byId('divInfoDetails').style.display = "none";
    dojo.byId('divSuccessMessage').style.display = "none";
}

//Display Address container in infowindow
function ShowInfoContactsView() {
    ResetValues();
    dojo.byId('spanContactErrorMessage').style.display = "none";
    dojo.byId('divNewAddress').style.display = "block";
    dojo.byId('imgContact').style.display = "block";
    dojo.byId('imagAddress').style.display = "none";
    dojo.byId("divAddressList").style.display = "block";
    dojo.byId("divAddress").style.display = "block";
    dojo.byId("divNext").style.display = "block";
    dojo.byId("divNewContacts").style.display = "none";
    dojo.byId('divInfoDetails').style.display = "block";
    dojo.byId('imgContacts').style.display = "block";
    dojo.byId('imgDirections').style.display = "none";
}

//save address details entered in the  info window
function AddServiceRequest(mapPoint) {
    dojo.byId("divSuccessMessage").style.display = "none";
    HideAddressContainer();
    HideBaseMapLayerContainer();
    ResetAddressData();
    RemoveChildren(dojo.byId("spanErrorMessage"));
    map.setMapCursor('default');
    map.infoWindow.hide();
    map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
    selectedMapPoint = mapPoint;
    map.getLayer(tempAddressLayer).clear();
    var symbol = new esri.symbol.PictureMarkerSymbol(defaultAddressSymbol, 25, 25);
    var graphic = new esri.Graphic(mapPoint, symbol, null, null);
    map.getLayer(tempAddressLayer).add(graphic);
    RemoveScrollBar(dojo.byId("divInfoDetails"));
    dojo.byId("divCreateRequest").style.display = "none";
    RemoveChildren(dojo.byId("divSuccessMessage"));
    dojo.byId("divInfoContent").style.display = "none";
    dojo.byId("divCreateRequest").style.width = infoPopupWidth + "px";
    dojo.byId("divCreateRequest").style.height = infoPopupHeight + "px";
    map.setExtent(GetBrowserMapExtent(selectedMapPoint));
    setTimeout(function () {
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);
        dojo.byId("divCreateRequest").style.display = "block";
        dojo.byId("divNewAddress").style.display = "block";
        dojo.byId("divNext").style.display = "block";
    }, 500);
}

//Hide create request container
function HideCreateRequestContainer() {
    selectedMapPoint = null;
    map.infoWindow.hide();
    dojo.byId('divCreateRequest').style.display = "none";
}
