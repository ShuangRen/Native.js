import $ from './jquery.js';
var yhcmsApp = {
	rem : function () {
		$('html').css('fontSize', $(window).width()/20);
		$(window).on('resize', function () {
			$('html').css('fontSize', $(window).width()/20);
		});
		return this;
	},
	slidebar : function () {
		var t = this;
		t.timer = null;
		t.slideOB = true;
		$('#slideBtn').on('click', function () {
			if(t.slideOB) {
				t.slideOB = false;
				$('.slidebar').css('transform', 'translate(0, 0)');
				$('.content-container').css('transform', 'translate(60%, 0)');
				$('.topheader').css('transform', 'translate(60%, 0)');
			}else {
				t.slideOB = true;
				$('.slidebar').css('transform', 'translate(-100%, 0)');
				$('.content-container').css('transform', 'translate(0, 0)');
				$('.topheader').css('transform', 'translate(0, 0)');
			}
			setTimeout(function () {
				//t.addEnd(t._$('slidebar'), end);
				end();
			}, 100);
		});

		function end() {
			if(!t.slideOB) {
				for(var i = 0; i<$('.slidebar').find('li').length;i++) {
					timeout($('.slidebar').find('li'),i)
				}
			}else {
				$('.slidebar').find('li').css('transform', 'translate(-100%, 0)');
			}
		}

		function timeout(obj,i) {
			 setTimeout(function() {
				obj.eq(i).css('transform', 'translate(0, 0)');
			}, i*100);
		}

		return this;
	},
	/*addEnd : function (obj,fn)
	{
		obj.addEventListener('WebkitTransitionEnd',fn,false);
		obj.addEventListener('transitionend',fn,false);
	},*/
	_$ : function (obj) {
		return document.getElementById(obj);
	},
	
	searchBtn : function () {
		$('#searchBtn').on('focus', function () {
			$('.search-form').css({
				'height' : $(window).height(),
				'opacity' : 1,
				'top' : 0
			})
		})

		$('#searchClose').on('click', function () {
			$('.search-form').css({
				'height' : 0,
				'opacity' : 0,
				'top' : '50%'
			});
		})

		$('#searchSub').on('click', function () {
			$('.search-form').find('form').submit();
		})
		return this;
	},
	cateBar: function() {
		if($('.catelist').height() < $(window).height()) {
			$('.catelist').css('height', $(window).height());
		}

		$('#catBtn-s').on('click', function () {
			$('.catelist').css('transform', 'translate(0, 0)');
		});
		$('#cateBtn').on('click', function () {
			$('.catelist').css('transform', 'translate(100%, 0)');
		});
		return this;
	},
	windowSize : function () {
		if($('.container').height() < $(window).height()) {
				$('.container').css('height', $(window).height());
			}

		$('.catelist').children('.list').css('height', $(window).height()-45);
		$('.container').on('resize',function () {
			if($('.container').height() < $(window).height()) {
				$('.container').css('height', $(window).height());
			}
			$('.catelist').children('.list').css('height', $(window).height()-45);
		})

		this.active();

		return this;
	},
	tab : function () {
		$('.show_pro').find('ul').eq(0).children('li').on('click', function () {
			$('.show_pro').find('ul').eq(0).children('li').removeClass('active');
			$(this).addClass('active');
			$('.show_pro').find('ul').eq(1).css('transform', 'translate('+ ($(this).index() * -50) +'%, 0)')
		})
	},
	touchSlid : function () {
		TouchSlide({ 
			slideCell:"#slideBox",
			titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
			mainCell:".bd ul", 
			effect:"leftLoop", 
			autoPage:true,//自动分页
			autoPlay:true //自动播放
		});
	},
	active : function () {
		$('.slidebar').find('li').each(function(i, v) {
			if($(this).children('a').attr('href') == window.location.href) {
				$(this).children('a').addClass('active');
			}
		});
	},
	getProList : function (cid) {
		var oUrl = 'http://demo.yhcms.cn/index.php/Api/getlist';
		var page = 2;
		$('.btns').on('click', function () {
			$.ajax({
				'type' : 'post',
				'url' : oUrl,
				'data' : 'type=product&cid=' + cid +  '&page=' + page + '&count=10&fn=nocallback',
				success : function (data) {
					var data = JSON.parse(data);
					if(data['status'] == 'success') {
						if(data['data'] != null) {
							for(var i=0; i<data['data'].length;i++) {
								var html = '<dd>';
								html+= '<a href="'+data['data'][i]['url']+'"><img src="'+ data['data'][i]['img']+ '" width="100%"></a>';
								html+= '<a href="'+data['data'][i]['url']+'">'+data['data'][i]['title']+'</a>';
								html+='</dd>';
								$('.dllist').append(html);
							}
							page++;
						}else {
							$('.btns').html('没有更多了');
							$('.btns').unbind('click');
							$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
						}
					}else {
						$('.btns').html('加载出错,请稍后再试');
						$('.btns').unbind('click');
						$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
					}
				} 
			});
		})
	},
	getArtList : function (cid) {
		var oUrl = 'http://demo.yhcms.cn/index.php/Api/getlist';
		var page = 2;
		$('.btns').on('click', function () {
			$.ajax({
				'type' : 'post',
				'url' : oUrl,
				'data' : 'type=article&cid=' + cid +  '&page=' + page + '&count=10&fn=nocallback',
				success : function (data) {
					var data = JSON.parse(data);
					if(data['status'] == 'success') {
						if(data['data'] != null) {
							for(var i=0; i<data['data'].length;i++) {
								var html = '<li>';
								html+= '<a href="'+data['data'][i]['url']+'"><p>'+data['data']['title']+'</p><i class="fa fa-angle-right fa-gray"></i></a>';
								html+='</li>';
								$('.dllist').append(html);
							}
							page++;
						}else {
							$('.btns').html('没有更多了');
							$('.btns').unbind('click');
							$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
						}
					}else {
						$('.btns').html('加载出错,请稍后再试');
						$('.btns').unbind('click');
						$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
					}
				} 
			});
		})
	},
	getPicList : function (cid) {
		var oUrl = 'http://demo.yhcms.cn/index.php/Api/getlist';
		var page = 2;
		$('.btns').on('click', function () {
			$.ajax({
				'type' : 'post',
				'url' : oUrl,
				'data' : 'type=picture&cid=' + cid +  '&page=' + page + '&count=10&fn=nocallback',
				success : function (data) {
					var data = JSON.parse(data);
					if(data['status'] == 'success') {
						if(data['data'] != null) {
							for(var i=0; i<data['data'].length;i++) {
								var html = '<dd>';
								html+= '<a href="'+data['data'][i]['url']+'"><img src="'+ data['data'][i]['img']+ '" width="100%"></a>';
								html+= '<a href="'+data['data'][i]['url']+'">'+data['data'][i]['title']+'</a>';
								html+='</dd>';
								$('.dllist').append(html);
							}
							page++;
						}else {
							$('.btns').html('没有更多了');
							$('.btns').unbind('click');
							$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
						}
					}else {
						$('.btns').html('加载出错,请稍后再试');
						$('.btns').unbind('click');
						$('.btns').css({'background': 'none', 'color' : '#6e6e6e'});
					}
				} 
			});
		})
	}
}


export default yhcmsApp;