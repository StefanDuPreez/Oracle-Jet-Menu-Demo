/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'menujs/menuhandler', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
    'ojs/ojoffcanvas'],
        function (oj, ko, menuH) {
            function ControllerViewModel() {
                var self = this;

                /*-----------------------------------------------*/
                //MENU DEMO
                //ajax call is asynchronous, so menu tries to  built before ajax call is completed
                //There are 2 solutions, using a call back function or making the ajax call synchronous
                //Making the call synchronous has been deprecrated in ajax 1.8
                //Chrome gives a warning regarding this in the log

                //To make app work without error, uncomment line 29 or line 38, not both at the same time

                self.menuCol = ko.observable(menuH.createModelCollection());
                self.menu = ko.observable({});

                self.menuCol().fetch({
                    //This is the suggested way of createing a synchronous ajax call
                    //It has been depricated in the next version of ajax
                    //async:false,

                    success: function (collection, response, options) {
                        var l = collection.size();
                        for (var i = 0; i < l; i++) {
                            var menuModel = collection.at(i);
                            self.menu()[menuModel.attributes.id] = {isDefault: menuModel.attributes.default, label: menuModel.attributes.label};
                        }
                        //If this line is uncommented without async:false, the app works fine, other wise a error is thrown in the log
                        //self.router.configure(self.menu());
                    }
                });

                //This is used by the menu
                //Navdata is removed so menu and router gets built from one source
                self.menuSelected = function (event, ui)
                {
                    // Only deals with 'checked' events and changes coming from the user
                    if (ui.option === 'checked' && event.originalEvent)
                    {
                        // Transition the router to the new state
                        self.router.go(ui.value).then(function (result)
                        {
                            // In case the transition was canceled, restore original selection
                            if (!result.hasChanged)
                            {
                                $('#menu-btnSet').ojButtonset('option', 'checked', ui.previousValue);
                            }
                        });
                    }
                };

                /*-----------------------------------------------*/

                // Media queries for repsonsive layouts
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
                self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

                // Router setup
                self.router = oj.Router.rootInstance;
                self.router.configure(self.menu());
                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                // Drawer
                // Close offcanvas on medium and larger screens
                self.mdScreen.subscribe(function () {
                    oj.OffcanvasUtils.close(self.drawerParams);
                });
                self.drawerParams = {
                    displayMode: 'push',
                    selector: '#navDrawer',
                    content: '#pageContent'
                };
                // Called by navigation drawer toggle button and after selection of nav drawer item
                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle(self.drawerParams);
                }
                // Add a close listener so we can move focus back to the toggle button when the drawer closes
                $("#navDrawer").on("ojclose", function () {
                    $('#drawerToggleButton').focus();
                });

                // Header
                // Application Name used in Branding Area
                self.appName = ko.observable("App Name");
                // User Info used in Global Navigation area
                self.userLogin = ko.observable("john.hancock@oracle.com");

                // Footer
                function footerLink(name, id, linkTarget) {
                    this.name = name;
                    this.linkId = id;
                    this.linkTarget = linkTarget;
                }
                self.footerLinks = ko.observableArray([
                    new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
                    new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
                    new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
                    new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
                    new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
                ]);
            }

            return new ControllerViewModel();
        }
);
