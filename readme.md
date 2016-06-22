自动合并雪碧图

该中间件简化了雪碧图合并。使用图片时，按目录存放在 `root/img/sprite` 下，在CSS中正常引用单张图片，发布时，该中间件会自动按目录合并雪碧图，并替换CSS中的图片引用。

###开发中

图片路径
```
root/img/sprite/button/loading.png
root/img/sprite/button/cancel.png
```

CSS中引用

.btn-loading{
    background-image:url(~/img/sprite/button/loading.png);
}
.btn-cancel{
    background-image:url(~/img/sprite/button/calcel.png);
}

###发布后


图片路径
```
root/img/sprite_button.png
```

CSS中引用

```
.btn-loading{
    background:url(~/img/sprite_button.png) no-repeat 0 0;
    background-size: 100% 100%;
}

.btn-loading{
    background:url(~/img/sprite_button.png) no-repeat 100px 100px;
    background-size: 100% 100%;
}
```