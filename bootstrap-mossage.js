/**
 * modal消息提示封装
 * @author: dengwenfeng@4399.com
 * @date: 2014-04-08
 */

+ function ($, window) {
    'use strict';
    
    // MOSSAGE PUBLIC CLASS DEFINITION
    // ===============================
    
    var Mossage = function (options) {

        this.options = options
        this.init()
        
        return this
    }

    Mossage.defaults = {

        title: '提示',
        message: '',
        content: null,
        iframe: null,
        image: null,

        onClose: null,
        onSure: null,
        onShow: null,

        modal: '.mossage-modal',
        title_container: '.mossage-modal-title',
        content_container: '.mossage-modal-content',
        dialog_container: '.mossage-modal-dialog',
        btn_close: '.mossage-modal-close',
        btn_sure: '.mossage-modal-sure',
        
        hasClose: true,
        hasSure: true,
        text_close: '关闭',
        text_sure: '确定',

        width: 'suitable',
        height: 'suitable',

        modal_options: {
            backdrop: false
        }
    }

    Mossage.prototype.init = function () {
        
        this.createModal()

        this.render()
        this.show()
    }

    Mossage.prototype.createModal = function () {

        var $modal = $('.modal.mossage-modal'),
            html = '',
            self = this;

        $modal = $('<div tabindex="-1" role="dialog" aria-labelledby="MossageModalLabel" aria-hidden="true">')
                                .addClass('modal fade').addClass(this.options.modal.replace(/./, ''))
        
        $modal.off('.mossage').on('close.mossage', function(){
            self.close()
        }).on('hide.mossage', function(){
            self.hide()
        }).on('show.mossage', function(){
            self.show()
        }).on('sure.mossage', function(){
            self.sure()
        })
        
        html = '<div class="modal-dialog mossage-modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close mossage-close" aria-hidden="true">&times;</button><h4 class="modal-title mossage-modal-title">标题</h4></div><div class="modal-body mossage-modal-content clearfix"><h5 class="mossage-modal-message">信息</h5></div><div class="modal-footer"><a href="javascript:void(0);" class="btn btn-primary btn-sm mossage-modal-sure">确定</a><a href="javascript:void(0);" class="btn btn-default btn-sm mossage-modal-close">关闭</a></div></div></div>';

        $modal.html(html).appendTo($('body').last());
        this.$modal = $modal
    }

    Mossage.prototype.render = function () {
        var self = this,
            options = this.options,
            
            $modal = this.$modal,
            $dialog = $modal.find(options.dialog_container).width(600),
            $title = $modal.find(options.title_container),
            $content = $modal.find(options.content_container).width('auto').height('auto');
        
        // 更改显示
        $title.html(options.title)

        if (options.iframe) {
            this.showIframe(options.iframe, $content)
        } else if (options.image) {

            this.showImage(options.image, $content)

        }  else if (options.content) {

            this.showContent(options.content, $content)

        } else {

            this.showMessage(options.message, $content)

        }

        $modal.trigger('show.mossage')
        
        // 宽度
        if (options.width == 'suitable') {

            // iframe
            if (options.iframe || options.image) {
                $content.one('width.mossage', function () {
                    var width = $(this).outerWidth(),
                        maxWidth = parseInt($dialog.css('maxWidth')),
                        diaWidth = $dialog.width();

                    width = width > maxWidth ? maxWidth : width;
                    
                    if(width > diaWidth){
                        $dialog.width(width)
                    }
                })
            }

        } else if (options.width) {
            $dialog.width(parseInt(options.width))
        }
        
        options.height != 'suitable' && $content.height(options.height)

        // 绑定按钮
        // 关闭按钮
        var $btn_close = $modal.find(options.btn_close),
            $btn_close_default = $dialog.find('.mossage-close');
        if (options.hasClose) {
            $btn_close.one('click.mossage.close', function (event) {
                event.stopPropagation()
                self.close()
            }).html(options.text_close)
            
            $btn_close_default.one('click.mossage.close', function (event) {
                event.stopPropagation()
                self.close()
            })
            
        } else {
            $btn_close.hide()
            $btn_close_default.hide()
        }

        // 确定按钮
        var $btn_sure = $modal.find(options.btn_sure);
        if (options.hasSure) {
            $btn_sure.off('click.mossage.sure').on('click.mossage.sure', function (event) {
                event.stopPropagation()
                self.sure()
            }).html(options.text_sure)
        } else {
            $btn_sure.hide()
        }
    }

    // message
    Mossage.prototype.showMessage = function (msg, $content) {
        $content.html('<h5 class="mossage-modal-message">' + msg + '</h5>')
        
        this.type = 'message'
        this.target = msg
    }

    // image
    Mossage.prototype.showImage = function (src, $content) {
        var $img = $('<img>').attr('src', src);
        
        $content.width(0).height(0)
        
        $img.load(function () {
            var width = $img.width(),
                height = $img.height();

            var w_width = $(window).width() - 120;
            
            width = width > w_width ? w_width : width
            
            $img.width(width).height(height)

            $content.width(width).height(height)
            $content.trigger('width.mossage')
        })
        
        $content.html('').append($img)
        
        this.type = 'image'
        this.target = src
    }
    
    // content
    Mossage.prototype.showContent = function (con, $content) {
        // 分字符串和dom
        if ((typeof con).toLowerCase() === 'string') {
            $content.html(con)
        } else {

            // 保存现场
            var $con = $(con),
                $relate, re_type;
            
            $relate = $con.prev()
            if($relate.length){
                re_type = 'prev'
            } else {
                $relate = $con.next()
                if($relate.length){
                    re_type = 'next'
                }else{
                    $relate = $con.parent()
                    re_type = 'parent'
                }
            }
            
            this.relate = {
                node: $relate,
                type: re_type
            }
            
            $content.html('').append($con)
        }
        
        this.type = 'content'
        this.target = con
    }
    
    // iframe
    Mossage.prototype.showIframe = function (src, $content) {
        var $iframe = $('<iframe>').attr('src', src);

        $iframe.load(function () {
            var width = $iframe.contents().find('body')[0].scrollWidth,
                height = $iframe.contents().find('body')[0].scrollHeight;

            $iframe.width(width).height(height)

            $content.width(width).height(height)
            $content.trigger('width.mossage')
        })

        $content.html('').append($iframe)
        
        this.type = 'iframe'
        this.target = src
    }

    Mossage.prototype.restore = function () {
        
        // 恢复现场
        var self = this;
        if(self.type && self.type == 'content' && (typeof self.target).toLowerCase() !== 'string'){
            
            var old_node = self.relate.node,
                old_type = self.relate.type,
                old_target = self.target;
            
            switch (old_type) {
                case 'prev':
                    $(old_target).insertAfter(old_node)
                    break;
                case 'next':
                    $(old_target).insertBefore(old_node)
                    break;
                case 'parent':
                    $(old_target).appendTo(old_node)
                    break;
            }
        }
    }
    
    Mossage.prototype.sure = function () {
        if (this.options.onSure !== null) {
            this.options.onSure.call(this, this.$modal) !== false && this.hide()
        } else {
            this.hide()
        }
    }

    Mossage.prototype.close = function () {
        if (this.options.onClose !== null) {
            this.options.onClose.call(this, this.$modal)
        }
        this.hide()
    }

    Mossage.prototype.show = function () {
        
        var self = this
        this.$modal.modal(this.options.modal_options).off('shown.bs.modal').on('shown.bs.modal', function (e) {
            self.options.onShow && self.options.onShow.call(self, self.$modal)
        })
        
        this.visible = true;
    }

    Mossage.prototype.hide = function () {
        this.visible = false;
        var self = this;
        this.$modal.modal('hide').off('hidden.bs.modal').on('hidden.bs.modal', function(){
            self.restore()
            self.$modal.remove()
            
            $.isArray(window.mossage) && window.mossage.pop()
        })
    }

    Mossage.prototype.toggle = function () {
        this.visible ? this.hide() : this.show()
    }

    // MOSSAGE PLUGIN DEFINITION
    // =========================

    var old = $.mossage

    $.mossage = function (option) {
        
        if(typeof option == 'string'){
            option = {
                message: option,
                hasSure: false
            }
        }
        
        var options = $.extend({}, Mossage.defaults, $.mossage.defaults, option)
        
        var mossage = new Mossage(options)
        
        if (!$.isArray(window.mossage)) window.mossage = [];
        window.mossage.push(mossage)
        
        return mossage
    }

    $.mossage.defaults = Mossage.defaults
    $.mossage.Constructor = Mossage


    // MOSSAGE NO CONFLICT
    // ===================

    $.mossage.noConflict = function () {
        $.mossage = old
    }

    // MOSSAGE DATA-API
    // ================

    $(document).off('click.mossage').on('click.mossage', '[data-toggle="mossage"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var target = $this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))

        if ($this.is('a')) e.preventDefault()
        
        var type = $this.attr('data-type');
        
        // 调用mossage
        if(type == 'image'){
            $.mossage({
                image: target,
                hasSure: false
            })
        }else if(type == 'content'){
            $.mossage({
                content: $(target),
                hasSure: false
            })
        }else if(type == 'iframe'){
            $.mossage({
                iframe: target,
                hasSure: false
            })
        }else{
            // 默认message模式
            $.mossage(target)
        }
        
    })

}(jQuery, window)