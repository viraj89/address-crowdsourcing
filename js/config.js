/*global dojo */
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
dojo.provide("js.config");
dojo.declare("js.config", null, {
    // This file contains various configuration settings for "Address Crowd Sourcing" template
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application title                  - [ Tag(s) to look for: ApplicationName ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    //
    // 5.  Specify URL(s) for basemaps                - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    // 7.  Specify URL(s) for operational layers      - [ Tag(s) to look for: AddressLayer,ContactsLayer]
    // 8.  Customize data formatting                  - [ Tag(s) to look for: ShowNullValueAs]
    //
    // 9.  Customize address search settings          - [ Tag(s) to look for: LocatorURL, LocatorFields, LocatorDefaultAddress, LocatorMarkupSymbolPath]
    //
    // Define the database field names                - [ Tag(s) to look for:  ContactIdFieldName,contactid,ContactFieldName,HomePhoneFieldName,WorkPhoneFieldName,CellPhoneFieldName
    //                                                                          EmailFieldName,  interestIdName,  SmsFieldName]
    // 10. Set URL for geometry service               - [ Tag(s) to look for: GeometryService ]
    //
    // 11. Customize info-Window settings             - [ Tag(s) to look for: InfoWindowHeader, InfoContactsDisplay ]
    // 11a.Customize info-Popup settings              - [ Tag(s) to look for: InfoPopupFieldsCollection]
    // 11b.Customize info-Popup input settings        - [ Tag(s) to look for: InfoInputPopupFieldsCollection]
    // 11c.Customize the default address values       - [ Tag(s) to look for: DefaultAddressValues]
    // 11d.Customize mandatory fields for address info-Popup
    //                                                - [ Tag(s) to look for: MandatoryAddressFields]
    // 11e.Customize mandatory fields for contact info-Popup
    //                                                - [ Tag(s) to look for: MandatoryContactFields]
    //
    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // -----------------------------------------------------------------------------------------------------------------------
    // Set application title
    ApplicationName: "Community Addressing",

    // Set application icon path
    ApplicationIcon: "images/applicationImg.png",

    // Set splash window content - Message that appears when the application starts
    SplashScreenMessage: "<b>Community Addressing</b> <br/> <hr/> <br/>The <b>Community Addressing</b> application allows the general public to contribute missing site address locations and provide contact information for current addresses. It is used to enlist citizens and members of the general public in the continuous improvement of address and contact information across our community.<br/><br/>",

    // Set URL of help page/portal
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All basemaps need to use the same spatial reference. By default, on application start the first basemap will be loaded
    BaseMapLayers: [{
        Key: "parcelMap",
        ThumbnailSource: "images/PublicAccess.png",
        Name: "Streets",
        MapURL: "http://tryitlive.arcgis.com/arcgis/rest/services/GeneralPurpose/MapServer"
    }, {
        Key: "hybridMap",
        ThumbnailSource: "images/ImageryHybrid.png",
        Name: "Imagery",
        MapURL: "http://tryitlive.arcgis.com/arcgis/rest/services/ImageryHybrid/MapServer"
    }],

    // Initial map extent. Use comma (,) to separate values and dont delete the last comma
    DefaultExtent: "-9814373,5126542,-9813500,5127198",

    // ------------------------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS

    // Configure operational layers

    AddressLayer: "http://services.arcgis.com/b6gLrKHqgkQb393u/ArcGIS/rest/services/CommunityAddressingTryItLive/FeatureServer/0",
    AddressObjectId: "${OBJECTID}",

    ContactsLayer: "http://services.arcgis.com/b6gLrKHqgkQb393u/ArcGIS/rest/services/CommunityAddressingTryItLive/FeatureServer/1",

    //We have added relation field for address layer. However we are not displaying/fetching the contact details for an address. So        //the relation field is not required for contacts layer.

    // ServiceUrl is the REST end point for the reference overlay layer
    // DisplayOnLoad setting this will show the reference overlay layer on load
    ReferenceOverlayLayer: {
        ServiceUrl: "http://tryitlive.arcgis.com/arcgis/rest/services/ImageryReferenceOverlay/MapServer",
        DisplayOnLoad: false
    },

    // ------------------------------------------------------------------------------------------------------------------------

    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",


    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------

    // Set locator settings such as locator symbol, size, zoom level, display fields, match score
    // Set Locator service settings
    LocatorSettings: {
        DefaultLocatorSymbol: "images/Pushpin.png",
        SymbolSize: {
            width: 25,
            height: 25
        },
        DefaultValue: "139 W Porter Ave Naperville IL 60540",
        LocatorParameters: ["SingleLine"],
        LocatorFields: ["Address", "City", "State", "Zip"],
        LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
        CandidateFields: "Loc_name, Score, Match_addr",
        FieldName: "${Match_addr}",
        LocatorFieldName: 'Loc_name',
        LocatorFieldValues: ["USA.StreetName", "USA.PointAddress", "USA.StreetAddress"],
        AddressMatchScore: 80,
        LocatorRippleSize: 40
    },

    //Define the database field names
    //Note: DateFieldName refers to a date database field.
    //All other attributes refer to text database fields.
    DatabaseFields: {
        ContactIdFieldName: "CONTACTID",
        ContactFieldName: "CONTACT",
        HomePhoneFieldName: "HOMEPHONE",
        WorkPhoneFieldName: "WORKPHONE",
        CellPhoneFieldName: "CELLPHONE",
        EmailFieldName: "EMAIL",
        interestIdName: "INTERESTID",
        SmsFieldName: "SMS"
    },
    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL
    GeometryService: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-WINDOW SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-window is a small, two line popup that gets displayed on selecting a feature
    // Set Info-window title. Configure this with text/fields
    InfoWindowHeader: "${FULLADDR}",

    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-popup is a popup dialog that gets displayed on selecting a feature
    // Set the content to be displayed on the info-Popup. Define labels, field values, field types and field formats
    InfoPopupFieldsCollection: [{
        DisplayText: "Address:",
        FieldName: "${FULLADDR}"
    }, {
        DisplayText: "Bldg/Unit Type:",
        FieldName: "${UNITTYPE}"
    }, {
        DisplayText: "Bldg/Unit #:",
        FieldName: "${UNITID}"
    }, {
        DisplayText: "Alt. Bldg/Unit Type:",
        FieldName: "${ALTUNITTYPE}"
    }, {
        DisplayText: "Alt. Bldg/Unit #:",
        FieldName: "${ALTUNITID}"
    }, {
        DisplayText: "City:",
        FieldName: "${MUNICIPALITY}"
    }],

    InfoInputPopupFieldsCollection: [
        "FULLADDR",
        "UNITTYPE",
        "UNITID",
        "ALTUNITTYPE",
        "ALTUNITID",
        "MUNICIPALITY"
    ],

    // Set size of the info-Popup - select maximum height and width in pixels (not applicable for tabbed info-Popup)
    //minimum height should be 310 for the info-popup in pixels
    InfoPopupHeight: 310,

    // Minimum width should be 330 for the info-popup in pixels
    InfoPopupWidth: 330,

    AddressLayerFieldType: "esriFieldTypeOID",

    // Set the default address values
    DefaultAddressValues: {
        "STATUS": "Pending"
    },

    // Set the mandatory fields for address info-popup
    MandatoryAddressFields: {
        textValidation: {
            "Attributes": "FULLADDR,MUNICIPALITY",
            "Message": "Enter Your Address and City",
            "isComboBox": false
        }
    },

    // Set the message after saving contacts successfully
    SuccessMessage: "Thank you for helping us improve the quality of address information in our community.",

    // Set the mandatory fields for contact info-popup
    MandatoryContactFields: {
        contactValidation: {
            "Attributes": "CONTACT",
            "Message": "Enter Your Name",
            "isComboBox": false
        },
        phoneValidation: {
            "Attributes": "HOMEPHONE,EMAIL",
            "Message": "Enter Your Home Phone or Email",
            "isComboBox": false
        }
    }
});
