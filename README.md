
##弹出层 bootstrap-mossage

---

##Basic 基本

依赖：bootstrap.modal, bootstrap.css

调用：
- `$.mossage(text)` 简单的显示文本。不会显示确定按钮。
- `$.mossage(options)` 完整的调用


##Options 参数

#####title
*string*('提示') 标题的文本

#####message
*string*('') 显示的信息文本

#####content
*$dom* / *string* 显示的内容，支持jquery实例对象

$dom时，显示的时候将节点移到modal层中，modal关闭时再恢复回来，所以只会存在一个$dom

#####iframe
*string* 显示iframe的地址

#####image
*image* 显示图片的地址

#####onClose
*function* 点击关闭按钮后的回调

```
function($modal){
	//$modal为显示的内容的jquery实例
}
```

#####onSure
*function* 点击确定时的回调

```
function($modal){
	// $modal为显示的内容的jquery实例

	// 返回false时，modal层不会移除
	return false
}
```

#####onShow
*function* modal层开始显示时调用

#####onShown
*function* modal层显示完后(css3的效果)调用

#####hasClose
*boolean*(true) 是否显示关闭按钮

#####hasSure
*boolean*(true) 是否显示确定按钮

#####text_close/text_sure
*string*(关闭/确定) 按钮的显示文本

#####width/height
*int*('suitable') modal层宽度/高度

#####modal_options
*object* boostrap.modal插件的参数

#####一些class的设置

	modal: '.mossage-modal',
	title_container: '.mossage-modal-title',
	content_container: '.mossage-modal-content',
	dialog_container: '.mossage-modal-dialog',
	btn_close: '.mossage-modal-close',
	btn_sure: '.mossage-modal-sure',


##method 方法

#####hide
```
var myMossage = $.mossage('text')
myMossage.hide()
// 调用hide后，将完全移除modal层
```

##data-api

**html直接调用**
```
// data-type could be 'image', 'content', 'iframe', 'message', 
// Mossage will show it as message while has no data-type
<a data-toggle="mossage" data-type="image" data-target="path/to/image">show image</a>
```