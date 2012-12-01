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
    HelpURL: "help.html",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers
    // Please note: All basemaps need to use the same spatial reference. By default, on application start the first basemap will be loaded
    BaseMapLayers:
		       [
                   {
                       Key: "parcelMap",
                       ThumbnailSource: "images/PublicAccess.png",
                       Name: "Streets",
                       MapURL: "http://localgovtemplates.esri.com/ArcGIS/rest/services/ParcelPublicAccess/MapServer"
                   },
                   {
                       Key: "hybridMap",
                       ThumbnailSource: "images/ImageryHybrid.png",
                       Name: "Imagery",
                       MapURL: "http://localgovtemplates.esri.com/ArcGIS/rest/services/ImageryHybrid/MapServer"
                   }
		       ],


    // Initial map extent. Use comma (,) to separate values and dont delete the last comma
    DefaultExtent: "-9814744.66,5122754.53,-9814207.21,5123112.83",

    // ------------------------------------------------------------------------------------------------------------------------
    // OPERATIONAL DATA SETTINGS

    // Configure operational layers

    AddressLayer: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/Planning/CommunityAddressing/FeatureServer/0",

    ContactsLayer: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/Planning/CommunityAddressing/FeatureServer/1",

    // ServiceUrl is the REST end point for the reference overlay layer
    // DisplayOnLoad setting this will show the reference overlay layer on load
    ReferenceOverlayLayer:
          {
              ServiceUrl: "http://yourserver/ArcGIS/rest/services/ReferenceOverlay/MapServer",
              DisplayOnLoad: false
          },



    // ------------------------------------------------------------------------------------------------------------------------

    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",

    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set Locator service URL
    LocatorURL: "http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer",

    // Set Locator fields (fields to be used for searching)
    LocatorFields: "SingleLine",

    // Set default address to search
    LocatorDefaultAddress: "845 Cardiff Rd, Naperville, IL, 60563",

    // Set pushpin image path
    LocatorMarkupSymbolPath: "images/pushpin.png",

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL
    GeometryService: "http://localgovtemplates2.esri.com/ArcGIS/rest/services/Geometry/GeometryServer",

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
        FieldName: "FULLADDR"
    }, {
        DisplayText: "Bldg/Unit Type:",
        FieldName: "UNITTYPE"
    }, {
        DisplayText: "Bldg/Unit #:",
        FieldName: "UNITID"
    }, {
        DisplayText: "Alt. Bldg/Unit Type:",
        FieldName: "ALTUNITTYPE"
    }, {
        DisplayText: "Alt. Bldg/Unit #:",
        FieldName: "ALTUNITID"
    }, {
        DisplayText: "City:",
        FieldName: "MUNICIPALITY"
    }],

    InfoInputPopupFieldsCollection:
    [
        "FULLADDR",
        "UNITTYPE",
        "UNITID",
        "ALTUNITTYPE",
        "ALTUNITID",
        "MUNICIPALITY"
    ],

    // Set the default address values
    DefaultAddressValues: { "STATUS": "Pending" },

    // Set the mandatory fields for address info-popup
    MandatoryAddressFields: {
        textValidation: { "Attributes": "FULLADDR,MUNICIPALITY", "Message": "Enter Your Address and City", "isComboBox": false }
    },

    // Set the message after saving contacts successfully
    SuccessMessage: "Thank you for helping us improve the quality of address information in our community.",

    // Set the mandatory fields for contact info-popup
    MandatoryContactFields: {
        contactValidation: { "Attributes": "CONTACT", "Message": "Enter Your Name", "isComboBox": false },
        phoneValidation: { "Attributes": "HOMEPHONE,EMAIL", "Message": "Enter Your Home Phone and Email", "isComboBox": false }
    }


});
