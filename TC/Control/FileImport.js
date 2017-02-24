﻿if (!TC.Control) {
    TC.syncLoadJS(TC.apiLocation + 'TC/Control.js');
}

TC.control.FileImport = function () {
    var self = this;

    TC.Control.apply(self, arguments);

    if ($.isArray(self.options.formats)) {
        self.formats = self.options.formats;
    }
    else {
        self.formats = [
            TC.Consts.format.KML,
            TC.Consts.format.GML,
            TC.Consts.format.GML2,
            TC.Consts.format.GEOJSON,
            TC.Consts.format.WKT,
            TC.Consts.format.GPX
        ];
    }

    self.apiAttribution = '';
    self.mainDataAttribution = '';
    self.dataAttributions = [];
};

TC.inherit(TC.control.FileImport, TC.Control);

(function () {
    var ctlProto = TC.control.FileImport.prototype;

    ctlProto.CLASS = 'tc-ctl-file';

    if (TC.isDebug) {
        ctlProto.template = TC.apiLocation + "TC/templates/FileImport.html";
    }
    else {
        ctlProto.template = function () { dust.register(ctlProto.CLASS, body_0); function body_0(chk, ctx) { return chk.w("<h2>").h("i18n", ctx, {}, { "$key": "openFile" }).w("</h2><div><p>").h("i18n", ctx, {}, { "$key": "fileImport.instructions" }).w("</p><div class=\"tc-ctl-file-open\"><label class=\"tc-button tc-ctl-file-open-label tc-icon-button\"><input type=\"file\" class=\"tc-ctl-file-open-ipt tc-button\" accept=\"").s(ctx.get(["formats"], false), ctx, { "block": body_1 }, {}).w("\" />").h("i18n", ctx, {}, { "$key": "openFile" }).w("</label></div></div>"); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w(".").f(ctx.getPath(true, []), ctx, "h").h("sep", ctx, { "block": body_2 }, {}); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w(","); } body_2.__dustBody = !0; return body_0 };
    }

    ctlProto.register = function (map) {
        var self = this;
        TC.Control.prototype.register.call(self, map);

        if (self.options.enableDragAndDrop) {
            map.wrap.enableDragAndDrop(self.options);
        }

        map.on(TC.Consts.event.FEATURESIMPORT, function (e) {
            // Ignoramos los GPX (se supone que los gestionará Geolocation)
            var pattern = '.' + TC.Consts.format.GPX.toLowerCase();
            if (e.fileName.toLowerCase().indexOf(pattern) === e.fileName.length - pattern.length) {
                return;
            }
            map.addLayer({
                id: TC.getUID(),
                title: e.fileName,
                type: TC.Consts.layerType.VECTOR
            }).then(function (layer) {
                for (var i = 0, len = e.features.length; i < len; i++) {
                    layer.addFeature(e.features[i]);
                }
                setTimeout(function () {
                    map.zoomToFeatures(layer.features);
                }, 100);
            });
        });
    };

    ctlProto.render = function () {
        var self = this;
        self.renderData({ formats: self.formats }, function() {
            self._$div.find('input[type=file]').on('change', function (e) {
                if (self.map) {
                    self.map.wrap.loadFiles(e.target.files);
                }
            });
        });
    };

})();