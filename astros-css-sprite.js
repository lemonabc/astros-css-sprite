'use strict';

let path = require('path');
let images = require('image-magic');

let spriteJson;


module.exports = new astro.Middleware({
    fileType: 'css',
    modType: 'page',
    status: 'release'
}, function(asset, next) {
    if (!asset.data) {
        next(asset);
        return
    }

    let prjCfg = asset.prjCfg;
    if(!spriteJson){
        spriteJson = {};
        images.sprite.mergeImgSync(path.join(prjCfg.img, 'sprite'), path.join(prjCfg.release, 'img'), 
            path.join(prjCfg.imgCache, 'sprite.json'));

        let json = require(path.join(prjCfg.imgCache, 'sprite.json'));
        for(let p in json){
            json[p].path = json[p].path.replace(prjCfg.release,'');
            spriteJson[p.replace(prjCfg.assets, '')] = json[p];
        }
    }

    asset.data = processSprite(asset.data, spriteJson, prjCfg);

    next(asset);
});

let processSprite = (code, imgHash, prjCfg)=>{
    if(!code){
        console.error('astros-css-sprite', 'code is null');
        return '';
    }
    try {
        let imgPathPer  = prjCfg.imgPath || prjCfg.cdnPrefix || '',
            reg         = new RegExp('url\\([\"\']?(?!http)' + imgPathPer 
                            + '(?:\/*)(\/.*?)[\'\"]?\\)', 'g');

        return code.replace(reg, function(str, imgpath) {
            let v = imgpath.match(/([^?]+)(\?.*)/);
            if (v) {
                imgpath = v[1];
                v = v[2];
            } else {
                v = '';
            }
            let iInfo = imgHash[imgpath];

            if (iInfo) {
                return 'url(' + imgPathPer + iInfo.path + 
                       ') ' + iInfo.pos;
            }
            return 'url(' + imgPathPer + imgpath + ')';
        });
    } catch (error) {
        console.error('processSprite', error);
        return code;
    }
}