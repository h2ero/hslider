//
// hslider
// h2ero <root@h2ero.cn> 
//
(function ($) {
    hslider = function(el, opt){
        var slider = {};
        slider.log = function(msg){
            if (this.DEBUG && typeof(msg) !== 'string') {
                console.dir(msg);
            }
            console.log(msg);
        }
        slider.resize = function(){
            if (this.opt.w) {
                this.container.css({width:this.opt.w});
            }
            if (this.opt.h) {
                this.container.css({height:this.opt.h});
            }
            this.container.css('overflow','hidden');
        }
        slider.init = function(sl, opt){
            this.El = $(sl);
            var index = 0;
            slitem = sl+' li';
            this.itemEl = $(slitem);
            this.maxIndex = $(slitem).length - 1;
            this.container = $('.hslider-container');
            this.opt = opt;
            this.resize();
            $(slitem).each(function(){
                // $(this).attr('data-index', index++);
                $(this).hide();
            });
            $(slitem).eq(0).fadeIn();
            this.nIndex = 0;
            slider.addNav();
            return this;
        }
        slider.next = function(){
            var pn = this.getPN();
            $(this.itemEl).eq(pn.p).fadeOut();
            $(this.itemEl).eq(pn.n).fadeIn('slow');
            this.nIndex = pn.n;
            this.log("next");
        }
        slider.go = function(index){
            if (index > this.maxIndex || index == this.nIndex) {
                this.log('skip go');
                return false;
            }
            $(this.itemEl).eq(this.nIndex).fadeOut();
            $(this.itemEl).eq(index).fadeIn('slow');
            this.activeControl(index);
            this.nIndex = index;
        }
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
        slider.addNav = function(){
            this.navEl = $('.hslider-control-nav');
            if (this.navEl.length) {
                $('.hslider-control-nav').remove();
            }
            this.El.after('<ul class="hslider-control-nav"></div>');
            // reload el
            this.navEl = $('.hslider-control-nav');
            var control = '';
            for (var i = this.maxIndex; i >= 0; i--) {
                control += '<li></li>';
            };
            this.navEl.html(control);
            $('body').on('click', '.hslider-control-nav li', function(){
                slider.go($(this).index());
            });
            this.activeControl(0);
        }
        slider.activeControl = function(index){
            $('li', this.navEl).removeClass('active');
            console.log($('li', this.navEl));
            console.log($('li', this.navEl.eq(index)));
            $('li', this.navEl).eq(index).addClass('active');
        }
        slider.addItem = function(index, Itemhtml){
            if (index == -1) {
                index = this.maxIndex;
            }
            if (this.itemEl.length) {
                this.itemEl.eq(this.nIndex).hide();
                this.itemEl.eq(index).after('<li>'+Itemhtml+'</li>');
                this.nIndex = index + 1;
            }else{
                this.El.html('<li>'+Itemhtml+'</li>');
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
            this.itemEl = $('li', this.El);
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

