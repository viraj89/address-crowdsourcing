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
//Dojo function to animate(wipe in) address container
function WipeInControl(node, height, duration) {
    var animation = dojo.fx.wipeIn({
        node: node,
        height: height,
        duration: duration
    }).play();
}

//Dojo function to animate(wipe out) address container
function WipeOutControl(node, duration) {
    dojo.fx.wipeOut({
        node: node,
        duration: duration
    }).play();
}

//Function triggered for animating address container
function AnimateAdvanceSearch(rowCount) {
    var node = dojo.byId('divAddressContainer');
    if (node.style.display == "none") {
        WipeInControl(node, 0, 500);
    }
}

//Function for displaying Help window
function ShowHelp() {
    if (dojo.coords(dojo.byId('divBaseMapTitleContainer')).h > 0) {
        WipeOutControl(dojo.byId('divBaseMapTitleContainer'), 400);
    }
    dijit.byId('imgGPSButton').attr("checked", false);
    dojo.byId('imgGPS').src = "images/gps.png";
    dijit.byId('imgBaseMap').attr("checked", false);
    dijit.byId('imgAddress').attr("checked", false);
    window.open(helpURL, "helpwindow");
    dijit.byId('imgHelp').attr("checked", false);
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

//Function for displaying Standby text
function ShowLoadingMessage(loadingMessage) {
    dojo.byId('divLoadingIndicator').style.display = 'block';
    dojo.byId('loadingMessage').innerHTML = loadingMessage;
}

//Function for hiding Standby text
function HideLoadingMessage() {
    dojo.byId('divLoadingIndicator').style.display = 'none';
}

//Function for hiding Alert messages
function CloseDialog() {
    dijit.byId('dialogAlertMessage').hide();
}

//function to hide BaseMapWidget onmouseout
function HideBaseMapWidget() {
    dijit.byId('imgBaseMap').attr("checked", false);
    var node = dojo.byId('divBaseMapTitleContainer');
    if (dojo.coords(node).h > 0) {
        WipeOutControl(node, 500);
    }
}

//Function to append ... for a string
String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
}

//function for triming the string and removing spaces between them
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}

function ShowInfoWindow(evt) {
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }
    ResetAddressData();
    if (evt) {
        var windowPoint = map.toScreen(evt.mapPoint);
    }

    dijit.byId("divInfoPopup").selectChild(dijit.byId("divSiteAddress"));
    dojo.byId('divAddress').style.display = "none";
    dojo.byId('divNewAddress').style.display = "block";
    dojo.byId('divAddressList').className = "addressScrollbar_content";

    dojo.byId("divNext").style.display = "block";

    dojo.byId("spanErrorMessage").style.display = "none";


    if (evt) {
        mapPoint = evt.mapPoint;

        map.getLayer(tempAddressLayer).clear();
        var symbol = new esri.symbol.PictureMarkerSymbol(defaultAddressSymbol, 25, 25);
        var graphic = new esri.Graphic(mapPoint, symbol, null, null);
        map.getLayer(tempAddressLayer).add(graphic);

        map.infoWindow.resize(350, 298);
        map.infoWindow.setTitle("<span style='color:white; font-size:13px; font-family:Verdana;'> New Site Address Point</span>");
        map.infoWindow.show(windowPoint, map.getInfoWindowAnchor(windowPoint));
        dijit.byId("divInfoPopup").resize();
    }

    var container = dojo.byId('scrollbar_container');
    var content = dojo.byId('divAddressList');

    CreateScrollbar(container, content);
}

function ResetAddressData() {
    for (var i in addressFields) {
        if (addressFields[i].isDomain) {
            dijit.byId(addressFields[i].attributeName).setValue("");
        }
        else {
            dojo.byId(addressFields[i].attributeName).value = "";
        }
    }


}

function AddNewContact() {
    dojo.byId("spanErrMessage").style.display = "none";
    dojo.byId("divSuccessMessage").style.display = "none";
    dojo.byId("ContactsScrollbar_container").style.display = "none";

    dojo.byId("divNewContact").style.display = "block";

    ResetValues();
}

function ResetValues() {
    dojo.byId("txtcontact").value = "";
    dojo.byId("txthomephone").value = "";
    dojo.byId("txtworkphone").value = "";
    dojo.byId("txtcellphone").value = "";
    dojo.byId("txtemail").value = "";
}

function CreateTextBox(td, txtBoxId, txtValue) {
    var txtBox = document.createElement("input");
    txtBox.id = txtBoxId;
    txtBox.value = txtValue;
    txtBox.maxLength = "25";
    txtBox.className = "panelTxtBox";
    td.appendChild(txtBox);
}

function ShowContacts() {
    if (mapPoint) {
        isAddressDataValid = false;
        ShowInfoWindow(null);
        ResetValues();
    }
    else {
        dojo.byId("ContactsScrollbar_container").style.display = "block";
        dojo.byId("divContactDetails").style.display = "none";
        dojo.byId("divContactsData").style.display = "block";
        dojo.byId("divNewContact").style.display = "none";
        CreateScrollbar(dojo.byId("ContactsScrollbar_container"), dojo.byId("divContactsList"));
    }
}

function ShowSiteAddress() {
    isAddressDataValid = false;
    dijit.byId('divInfoPopup').selectChild(dijit.byId('divSiteAddress'));
    dojo.byId('divSiteAddress').focus();
}

//function to remove scroll bar
function RemoveScrollBar(container) {
    if (dojo.byId(container.id + 'scrollbar_track')) {
        container.removeChild(dojo.byId(container.id + 'scrollbar_track'));
    }
}
function ShowDetails(feature, mapPoint) {
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }
    RemoveScrollBar(dojo.byId('scrollbar_container'));
    RemoveScrollBar(dojo.byId('divNewAddress'));
    ClearGraphics();

    dojo.byId("divNext").style.display = "none";

    RemoveChildren(dojo.byId('divAddress'));
    dijit.byId("divSiteAddress").selected = "true";
    dojo.byId('divAddress').style.display = "block";
    dojo.byId('divNewAddress').style.display = "none";
    dojo.byId("spanErrorMessage").style.display = "none";
    dojo.byId("divNewContact").style.display = "none";

    var table = document.createElement("table");
    var tBody = document.createElement("tbody");
    table.appendChild(tBody);
    table.className = "tblTransparent";
    table.id = "tblAddress";
    table.cellSpacing = 0;
    table.cellPadding = 3;

    dojo.byId("divAddress").appendChild(table);

    for (var key = 0; key < infoPopupFieldsCollection.length; key++) {
        var tr = document.createElement("tr");
        tBody.appendChild(tr);

        var td1 = document.createElement("td");
        td1.innerHTML = infoPopupFieldsCollection[key].DisplayText;
        td1.className = 'tdDisplayField';
        var td2 = document.createElement("td");
        td2.className = 'tdValueField';

        if (feature.attributes[infoPopupFieldsCollection[key].FieldName] == null || feature.attributes[infoPopupFieldsCollection[key].FieldName] == "") {
            td2.innerHTML = showNullValueAs;
        }
        else {
            var p = dojo.create("div", { "class": "breakWord" }, td2);
            p.innerHTML = feature.attributes[infoPopupFieldsCollection[key].FieldName];
        }

        tr.appendChild(td1);
        tr.appendChild(td2);
    }

    objectId = feature.attributes[map.getLayer(addressLayerID).objectIdField];
    //  FetchContacts(objectId);

    dijit.byId("divInfoPopup").selectChild(dijit.byId("divSiteAddress"));

    map.infoWindow.resize(350, 298);

    var spanTitle = document.createElement("span");
    spanTitle.id = "spanInfoWindowTitle";
    var title = dojo.string.substitute(infoWindowHeader, feature.attributes);
    var tri = Math.round((350 * 10) / 100);
    if (title.length > tri) {
        spanTitle.innerHTML = title.trimString(tri);
        spanTitle.title = title;
    }
    else {
        spanTitle.innerHTML = title;
    }
    map.infoWindow.setTitle(spanTitle);

    var windowPoint = map.toScreen(feature.geometry);
    map.infoWindow.show(feature.geometry, windowPoint);
    dijit.byId("divInfoPopup").resize();

    var container = dojo.byId('scrollbar_container');
    var content = dojo.byId('divAddressList');
    if (dojo.coords(dojo.byId('scrollbar_container')).h < dojo.coords(dojo.byId('tblAddress')).h) {
        var container = dojo.byId('scrollbar_container');
        var content = dojo.byId('divAddressList');
        CreateScrollbar(container, content);
    }
    // CreateScrollbar(container, content);
}

function NavigateNextTab(tabContainerName) {
    if (tabContainerName == "divContacts") {
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
    dijit.byId("divInfoPopup").selectChild(dijit.byId("divContacts"));
    dijit.byId("divInfoPopup").resize();
    ShowErrorMessage('spanErrorMessage', "");
}

function ShowValidTab(tabId) {
    switch (tabId) {
        case dijit.byId('divContacts').controlButton.id:
            ValidateSiteAddress();
            if (isAddressDataValid) {
                dijit.byId('divInfoPopup').selectChild(dijit.byId('divContacts'));
            }
            break;
        case dijit.byId('divSiteAddress').controlButton.id:
            isAddressDataValid = false;
            dijit.byId('divInfoPopup').selectChild(dijit.byId('divSiteAddress'));
            dojo.byId('divSiteAddress').focus();
            break;
    }
}

//function to set text to span control
function ShowErrorMessage(control, message, color) {
    var ctl = dojo.byId(control);
    ctl.style.display = 'block';
    ctl.innerHTML = message;
    ctl.style.color = color;
}

//function to blink text
function BlinkNode(control) {
    var fadeout = dojo.fadeOut({ node: control, duration: 100 });
    var fadein = dojo.fadeIn({ node: control, duration: 250 });
    dojo.fx.chain([fadeout, fadein, fadeout, fadein]).play();
}

function ValidateContactType(value, cmbId) {
    if (!dijit.byId(cmbId).item) {
        dijit.byId(cmbId).setValue("");
        return;
    }
}

function IsNumber(input) {
    // return (input - 0) == input && input.length > 0;
    return (input - 0) == input;
}





//Function for refreshing address container div
function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

function AddNewAddress() {
    if (dojo.coords(dojo.byId('divBaseMapTitleContainer')).h > 0) {
        WipeOutControl(dojo.byId('divBaseMapTitleContainer'), 400);
    }
    if (dojo.coords(dojo.byId('divAddressContainer')).h > 0) {
        WipeOutControl(dojo.byId('divAddressContainer'), 500);
    }

    dijit.byId('imgGPSButton').attr("checked", false);
    dojo.byId('imgGPS').src = "images/gps.png";
    dijit.byId('imgBaseMap').attr("checked", false);
    var addAddress = dijit.byId('imgAddress');
    if (addAddress.attr("checked")) {
        map.setMapCursor('crosshair');
    }
    else {
        map.setMapCursor('default');
    }
    var handle = dojo.connect(map, "onClick", function (evt) {
        if (addAddress.attr("checked")) {
            addAddress.attr("checked", false);
            dojo.disconnect(handle);
            isAddressDataValid = false;
            objectId = null;
            ResetValues();
            ShowInfoWindow(evt);
            map.setMapCursor('default');
        }
    });
}

function SaveNewContact() {
    for (var i in mandatoryContactFields) {
        var counter = 0;
        var attributes = mandatoryContactFields[i].Attributes.toLowerCase().split(",");
        for (var attCount in attributes) {
            if (mandatoryContactFields[i].isComboBox) {
                if (dijit.byId('cmb' + attributes[attCount]).value.length == 0 || dijit.byId('cmb' + attributes[attCount]).value.trim() == "") {
                    counter++;
                }
            }
            else {
                if (dojo.byId('txt' + attributes[attCount]).value.length == 0 || dojo.byId('txt' + attributes[attCount]).value.trim() == "") {
                    counter++;
                }
            }
        }
        if (counter == attributes.length) {
            ShowErrorMessage('spanErrMessage', mandatoryContactFields[i].Message, 'yellow');
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
            }
            else {
                var newValue = dojo.byId(addressFields[i].attributeName).value.trim();
                if(0 < newValue.length) {
                    feedAttributes[addressFields[i].attributeName] = newValue;
                } else {
                    feedAttributes[addressFields[i].attributeName] = null;
                }
            }
        }

        for (var i in defaultAddressFields) {
            feedAttributes[i] = defaultAddressFields[i];
        }

        ShowLoadingMessage("Saving details...");
        var submitFeedGraphic = new esri.Graphic(mapPoint, null, feedAttributes, null);
        if (!map.getLayer(baseMapLayerCollection[0].Key).fullExtent.contains(mapPoint)) {
            alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
            HideLoadingMessage();
            map.infoWindow.hide();
            return;
        }
        else {
            map.getLayer(addressLayerID).applyEdits([submitFeedGraphic], null, null, function (addResults) {
                if (addResults[0].objectId != -1) {
                    objectId = addResults[0].objectId;
                    SaveContact(objectId);
                    dijit.byId("divInfoPopup").selectChild(dijit.byId("divSiteAddress"));
                }
                else {
                    alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
                }
                map.infoWindow.hide();
                HideLoadingMessage();
            },
        function (err) {
            map.infoWindow.hide();
            alert(messages.getElementsByTagName("unableToSaveData")[0].childNodes[0].nodeValue);
            HideLoadingMessage();
            return;
        });
        }
    }
    else {
        SaveContact(objectId);
    }
}


function SaveContact(objectId) {
    ShowLoadingMessage("Saving details...");

    var newContactGraphic = new esri.Graphic();

    var attr = {
        "CONTACTID": objectId,
        "CONTACT": dojo.byId("txtcontact").value.trim(),
        "HOMEPHONE": dojo.byId("txthomephone").value.trim(),
        "WORKPHONE": dojo.byId("txtworkphone").value.trim(),
        "CELLPHONE": dojo.byId("txtcellphone").value.trim(),
        "EMAIL": dojo.byId("txtemail").value.trim(),
        "INTERESTID": '',
        "SMS": ''
    };
    newContactGraphic.setAttributes(attr);

    map.getLayer(contactsLayerID).applyEdits([newContactGraphic], null, null, function (msg) {
        if (msg[0].error) {
            HideLoadingMessage();
            alert(messages.getElementsByTagName("contactError")[0].childNodes[0].nodeValue);
        }
        else {
            ResetValues();
            dojo.byId("divNewContact").style.display = "none";
            dojo.byId("ContactsScrollbar_container").style.display = "none";
            RemoveChildren(dojo.byId("divSuccessMessage"));
            dojo.byId("divSuccessMessage").style.display = "block";
            var table = document.createElement("table");
            table.style.color = "white";
            var tbody = document.createElement("tbody");
            table.appendChild(tbody);
            var tr = document.createElement("tr");
            tbody.appendChild(tr);
            var td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = successMessage;
            dojo.byId("divSuccessMessage").appendChild(table);

            HideLoadingMessage();
            objectId = null;
        }

    }, function (err) {
        alert(messages.getElementsByTagName("unableToAddContact")[0].childNodes[0].nodeValue);
        HideLoadingMessage();
    });
}

function IsName(name) {
    var namePattern = /^[A-Za-z\.\-\-', ]{3,100}$/;
    if (namePattern.test(name)) {
        return true;
    }
    else {
        return false;
    }
}

//Function for validating Email in comments tab
function CheckMailFormat(emailValue) {
    var pattern = /^([a-zA-Z][a-zA-Z0-9\_\-\.]*\@[a-zA-Z0-9\-]*\.[a-zA-Z]{2,4})?$/i
    if (pattern.test(emailValue)) {
        return true;
    } else {
        return false;
    }
}

function IsPhoneNumber(input) {
    var phonePattern = /[^0-9]/gi;
    return (phonePattern.test(input));
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
    }
    else {
        scrollbar_track = dojo.byId(container.id + 'scrollbar_track');
    }

    var containerHeight = dojo.coords(container);
    if (container.id == 'address_container') {
        scrollbar_track.style.height = containerHeight.h + "px";
        scrollbar_track.style.top = containerHeight.t + 'px';
        scrollbar_track.style.right = 0 + 'px';
    }
    else {
        scrollbar_track.style.height = (containerHeight.h - 20) + "px";
        scrollbar_track.style.top = containerHeight.t + 'px';
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
    }
    else {
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
        }
        else {
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
            }
            else
                offsetY = evt.offsetY;
            if (offsetY < scrollbar_handle.offsetTop) {
                scrollbar_handle.style.top = offsetY + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else if (offsetY > (scrollbar_handle.offsetTop + scrollbar_handle.clientHeight)) {
                var y = offsetY - scrollbar_handle.clientHeight;
                if (y > yMax) y = yMax // Limit vertical movement
                if (y < 0) y = 0 // Limit vertical movement
                scrollbar_handle.style.top = y + "px";
                content.scrollTop = Math.round(scrollbar_handle.offsetTop / yMax * (content.scrollHeight - content.offsetHeight));
            }
            else {
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

var customMouseHandler =
{
    evtHash: [],

    ieGetUniqueID: function (_elem) {
        if (_elem === window) { return 'theWindow'; }
        else if (_elem === document) { return 'theDocument'; }
        else { return _elem.uniqueID; }
    },

    addEvent: function (_elem, _evtName, _fn, _useCapture) {
        if (typeof _elem.addEventListener != 'undefined') {
            if (_evtName == 'mouseenter')
            { _elem.addEventListener('mouseover', customMouseHandler.mouseEnter(_fn), _useCapture); }
            else if (_evtName == 'mouseleave')
            { _elem.addEventListener('mouseout', customMouseHandler.mouseEnter(_fn), _useCapture); }
            else
            { _elem.addEventListener(_evtName, _fn, _useCapture); }
        }
        else if (typeof _elem.attachEvent != 'undefined') {
            var key = '{FNKEY::obj_' + customMouseHandler.ieGetUniqueID(_elem) + '::evt_' + _evtName + '::fn_' + _fn + '}';
            var f = customMouseHandler.evtHash[key];
            if (typeof f != 'undefined')
            { return; }

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
        }
        else
        { _elem['on' + _evtName] = _fn; }
    },

    removeEvent: function (_elem, _evtName, _fn, _useCapture) {
        if (typeof _elem.removeEventListener != 'undefined')
        { _elem.removeEventListener(_evtName, _fn, _useCapture); }
        else if (typeof _elem.detachEvent != 'undefined') {
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
            if (this == relTarget || customMouseHandler.isAChildOf(this, relTarget))
            { return; }

            _pFn.call(this, _evt);
        }
    },

    isAChildOf: function (_parent, _child) {
        if (_parent == _child) { return false };

        while (_child && _child != _parent)
        { _child = _child.parentNode; }

        return _child == _parent;
    }
};

