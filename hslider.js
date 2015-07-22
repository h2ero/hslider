//
// hslider
// h2ero <root@h2ero.cn> 
//
(function ($) {
    hslider = function(el, opt){
        var slider = {};

        slider.log = function(msg){
            if ( ! this.opt.debug) {
                return false;
            }
            if (typeof(msg) !== 'string') {
                console.dir(msg);
            } else {
                console.log(msg);
            }
        }

        slider.resize = function(){
            if (this.opt.w) {
                this.container.css({width:this.opt.w});
                this.itemEl.css({width:this.opt.w});
            }
            if (this.opt.h) {
                this.container.css({height:this.opt.h});
                this.itemEl.css({height:this.opt.h});
            }
            this.container.css('overflow','hidden');
            this.itemEl.css('overflow','hidden');
        }
        slider.initMode = function(){
            if (this.opt.mode == 'fade' || this.opt.mode == undefined) {
                this.itemEl.each(function(){
                    // $(this).attr('data-index', index++);
                    $(this).hide();
                });
                this.itemEl.eq(0).fadeIn();
            } else if(this.opt.mode == 'slider'){
                this.itemEl.each(function(index){
                    if (index != 0) {
                        $(this).css({'left':slider.opt.w});
                    }
                });
            }
        }
        slider.addContainer = function(){
            var id = this.getId();
            this.preEl.after('<div class="hslider-container hslider-container-'+id+'"><ul class="hslider"></ul></div>');
            this.container = $('.hslider-container-'+id);
        }
        slider.cloneEl = function(){
            this.addContainer();
            this.el = $('.hslider', this.container);
            this.el.html(this.preEl.html());
        }

        slider.getId = function(){
            return parseInt(Math.random()*100000);
        }

        slider.init = function(sl, opt){
            $(sl).hide();
            this.preEl = $(sl);
            this.cloneEl();
            var index = 0;
            this.itemEl = $('li', this.el);
            this.maxIndex = this.itemEl.length - 1;
            this.opt = opt;
            this.resize();
            this.initMode();
            this.nIndex = 0;
            slider.addNav();
            return this;
        }

        slider.next = function(){
            var pn = this.getPN();
            this.go(pn.n);
        }

        slider.go = function(index){
            if (index > this.maxIndex || index == this.nIndex) {
                this.log('skip go');
                return false;
            }
            if (this.opt.mode == 'fade' || this.opt.mode == undefined) {
                $(this.itemEl).eq(this.nIndex).fadeOut();
                $(this.itemEl).eq(index).fadeIn('slow');
            } else if(this.opt.mode == 'slider'){
                $(this.itemEl).eq(this.nIndex).show().animate({'left':-this.opt.w},'slow', function(){
                    $(this).css({'left':slider.opt.w});
                });
                $(this.itemEl).eq(index).show().animate({'left':0}, 'slow');
            }
            this.activeControl(index);
            this.nIndex = index;
        }

        // last one and first one
        slider.getPN = function(index){
            var pn = {}
                var index = this.nIndex;
            if (index == this.maxIndex) {
                pn.n = 0;
                pn.p = this.maxIndex;
            } else {
                pn.n = (index + 1);
                pn.p = index;
            }
            this.log({"getPN": pn});
            return pn;
        }

        // add nav
        slider.addNav = function(){
            this.navEl = $('.hslider-control-nav', this.container);
            if (this.navEl.length) {
                this.navEl.remove();
            }
            this.el.after('<ul class="hslider-control-nav"></div>');
            // reload el
            this.navEl = $('.hslider-control-nav', this.container);
            var control = '';
            for (var i = this.maxIndex; i >= 0; i--) {
                control += '<li></li>';
            };
            this.navEl.html(control);
            $('body').on('click', $('li', this.navEl).selector, function(){
                slider.go($(this).index());
            });
            this.activeControl(0);
        }

        // active nav
        slider.activeControl = function(index){
            $('li', this.navEl).removeClass('active');
            $('li', this.navEl).eq(index).addClass('active');
        }

        // add new slider item
        slider.addItem = function(index, Itemhtml){
            if (index == -1) {
                index = this.maxIndex;
            }
            if (this.itemEl.length) {
                this.itemEl.eq(this.nIndex).hide();
                this.itemEl.eq(index).after('<li>'+Itemhtml+'</li>');
                this.nIndex = index + 1;
            }else{
                this.el.html('<li>'+Itemhtml+'</li>');
                this.nIndex = index;
            }
            this.reInit();
            this.activeControl(this.nIndex);
        }

        slider.removeItem = function(index){
            if (index == this.nIndex) {
                this.go(index - 1);
            }
            this.itemEl.eq(index).remove();
            this.reInit();
        }

        slider.removeAll = function(index){
            this.itemEl.remove();
            this.reInit();
        }

        slider.reInit  = function(){
            this.itemEl = $('li', this.el);
            this.maxIndex = this.itemEl.length - 1;
            this.addNav();
            this.log('re inital');
        }

        slider.getElByIndex = function(index){
            if (index == undefined) {
                return this.itemEl.eq(this.nIndex);
            }
            return this.itemEl.eq(index);
        }

        slider.init(el, opt);
        return slider;
    }
    $.fn.hslider= function(opt) {
        return hslider(this.selector, opt);
    }
})(jQuery);

