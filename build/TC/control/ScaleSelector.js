﻿TC.control = TC.control || {};

if (!TC.control.Scale) {
    TC.syncLoadJS(TC.apiLocation + 'TC/control/Scale');
}

TC.control.ScaleSelector = function () {
    var self = this;

    TC.control.Scale.apply(self, arguments);

    self.scales = null;
};

TC.inherit(TC.control.ScaleSelector, TC.control.Scale);

(function () {
    var ctlProto = TC.control.ScaleSelector.prototype;

    ctlProto.CLASS = 'tc-ctl-ss';

    if (TC.isDebug) {
        ctlProto.template = TC.apiLocation + "TC/templates/ScaleSelector.html";
    }
    else {
        ctlProto.template = function () { dust.register(ctlProto.CLASS, body_0); function body_0(chk, ctx) { return chk.w("<div class=\"ol-scale-line ol-unselectable\"><nobr><select>").s(ctx.get(["scales"], false), ctx, { "block": body_1 }, {}).w("</select> <input type=\"button\" value=\"").f(ctx.get(["screenSize"], false), ctx, "h").w("''\" title=\"").h("i18n", ctx, {}, { "$key": "estimatedMapSize" }).w("\" /></nobr></div>"); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w("<option value=\"").f(ctx.getPath(true, []), ctx, "h").w("\"").h("eq", ctx, { "block": body_2 }, { "key": body_3, "value": body_4 }).w(">1:").h("math", ctx, {}, { "key": body_5, "method": "round" }).w("</option>\n"); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w(" selected=\"true\""); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.f(ctx.getPath(true, []), ctx, "h"); } body_3.__dustBody = !0; function body_4(chk, ctx) { return chk.f(ctx.get(["scale"], false), ctx, "h"); } body_4.__dustBody = !0; function body_5(chk, ctx) { return chk.f(ctx.getPath(true, []), ctx, "h"); } body_5.__dustBody = !0; return body_0 };
    }

    ctlProto.render = function (callback) {
        var self = this;
        return self._set1stRenderPromise(new Promise(function (resolve, reject) {
            if (self.map) {
                if (!self.scales && self.map.options.resolutions) {
                    self.scales = self.map.options.resolutions.map(self.getScale, self);
                }
                var render = function () {
                    self.scales = self.map.wrap.getResolutions().map(self.getScale, self);
                    self.renderData({ scale: self.getScale(), screenSize: TC.Cfg.screenSize, scales: self.scales }, function () {

                        self.div.querySelectorAll('option').forEach(function (option) {
                            option.textContent = '1:' + self.format(option.textContent.substr(2));
                        });

                        self.div.querySelector('input[type="button"]').addEventListener(TC.Consts.event.CLICK, function () { self.setScreenSize(); });

                        self.div.querySelector('select').addEventListener('change', function () {
                            self.setScale($(this).val());
                        });
                        if ($.isFunction(callback)) {
                            callback();
                        }
                        resolve();
                    }).catch(function (err) {
                        reject(err instanceof Error ? err : Error(err));
                    });
                };
                if (self.scales) {
                    render();
                }
                else {
                    self.map.wrap.getMap().then(render);
                }
            }
            else {
                reject(Error('ScaleSelector no registrado'));
            }
        }));
    };

    /*
    *  setScale: Sets the resolution of the map from a scale denominator and estimated screen DPI
    *  Parameters: number, the scale denominator
    *  Returns: number, the resolution
    */
    ctlProto.setScale = function (scale) {
        var self = this;
        var result = scale * .0254 / self.getDpi(TC.Cfg.screenSize);
        if (window.devicePixelRatio) {
            result = result / window.devicePixelRatio;
        }
        if (self.metersPerDegree) {
            result = result / self.metersPerDegree;
        }
        self.map.wrap.setResolution(result);
        return result;
    };

})();