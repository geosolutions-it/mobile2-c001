/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = require('react');
var ReactDOM = require('react-dom');

var {Provider} = require('react-redux');

var {loadMapConfig} = require('../../MapStore2/web/client/actions/config');
var {changeBrowserProperties} = require('../../MapStore2/web/client//actions/browser');
var {loadLocale} = require('../../MapStore2/web/client/actions/locale');

var ConfigUtils = require('../../MapStore2/web/client/utils/ConfigUtils');
var LocaleUtils = require('../../MapStore2/web/client/utils/LocaleUtils');

var Debug = require('../../MapStore2/web/client/components/development/Debug');
require('../../MapStore2/web/client/examples/viewer/css/mobile.css');
function startApp(plugins, localePath = "translations") {
    let store = require('../../MapStore2/web/client/examples/viewer/stores/viewerstore')(plugins.reducers, {mapInfo: {enabled: true, infoFormat: 'text/html' }, mousePosition: {enabled: true, crs: "EPSG:4326"}});
    let Viewer = require('./Viewer')(plugins.actions);

    /**
    * Detect Browser's properties and save in app state.
    **/
    store.dispatch(changeBrowserProperties(ConfigUtils.getBrowserProperties()));

    ConfigUtils.loadConfiguration().then(() => {
        const { configUrl, legacy } = ConfigUtils.getUserConfiguration('config', 'json');
        store.dispatch(loadMapConfig(configUrl, legacy));

        let locale = LocaleUtils.getUserLocale();
        store.dispatch(loadLocale(localePath, locale));
    });


    ReactDOM.render(
            <Provider store={store}>
                <div>
                    <Viewer plugins={plugins.components}
                        mapParams={{
                        overview: false,
                        scaleBar: false,
                        zoomControl: false
                    }}/>
                    <Debug/>
                </div>
            </Provider>,
        document.getElementById('container')
    );

}
if (!global.Intl ) {
    require.ensure(['intl', 'intl/locale-data/jsonp/en.js', 'intl/locale-data/jsonp/it.js', '../../MapStore2/web/client/examples/viewer/plugins'], (require) => {
        global.Intl = require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/it.js');
        let plugins = require('../../MapStore2/web/client/examples/viewer/plugins/mobile.jsx');
        startApp(plugins);
    });
}else {
    require.ensure(["../../MapStore2/web/client/examples/viewer/plugins"], (require) => {
        var plugins = require('../../MapStore2/web/client/examples/viewer/plugins/mobile.jsx');
        startApp(plugins, document.localePath);
    });
}
