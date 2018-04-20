$(function(){
	var num=0;
	var mouse=0;
	var score=0;
	var timer;
	var level=0;
	
	(function(){
		$('#start button').animate({top:0},1500,'easeOutBounce')
	})()

	function show(speed,animate,arr){
		score=0;	//分数重置
		timer=setInterval(function(){
			var random=Math.floor(Math.random()*$('td').length);//获取老鼠钻出的随机洞
			if(num==random)random+=1;	//当生成的随机数和上次相同时，让其+1
			num=random;

			var active=$('td').eq(num).find('span'); //找到老鼠钻出的洞		

			mouse=arr[Math.floor(Math.random()*arr.length)];//获取随机生成的老鼠种类 1-5

			var css='';
			switch (mouse){  //根据生成老鼠的数字，通过改变类名改变图片的位置
				case 1:
					css='one';
					break;
				case 2:
					css='two';
					break;
				case 3:
					css='three';
					break;
				case 4:
					css='four';
					break;
				case 5:
					css='five';
					break;
			}
			active.attr('class',css)
			active.animate({top:40},animate);		
			
			setTimeout(function(){
				active.animate({top:140},animate);
			},animate);
		},speed);
	};
	
	
	//点击事件，客户端用click，移动端用touchstart
	$('span').on('click',function(){
		$(this).addClass('hit');//添加hit类,显示打中的状态

		$('#dazhong').get(0).play();//添加打中音效

		var scoreCss = $(this).attr('class');	//获取点击的类名
		$(this).siblings('s').attr('class',scoreCss);	//给同级的s同样的类，显示对应的分数
		$(this).siblings('s').show();
		//判断分数值得改变
		switch (scoreCss){
			case 'one hit':
				score+=100;
				break;
			case 'two hit':
				score+=500;
				break;
			case 'three hit':
				score*=1.2;
				break;
			case 'four hit':
				score-=100;
				break;
			case 'five hit':
				score/=2;
				break;
		}
		if(score<0)score=0
		score=Math.floor(score)
		$('#score span').text(score)

		//1s后分数消失
		var _this=$(this);
		setTimeout(function(){
			_this.siblings('s').hide();
		},1000)
	});

	//鼠标图片的设置
	$('body').mousedown(function () {
		$('body').css('cursor','url(images/cursor-down.png),auto');    
	}).mouseup(function () {
		$('body').css('cursor','url(images/cursor.png),auto');
	});

	//模态层
	function modal(){
		var oM=$('<div class="modal"></div>');
		$(document.body).append(oM);
		return function(){
			$('.modal').remove();
		};
	};

	//开始游戏
	$('#start button').eq(0).click(function(){
		$('#start').hide();
		$('#level').show();
		$('#level button').animate({left:0,opacity:1},1000)
	});

	//难度选择，事件委派
	$('#level').click(function(ev){
		var oEv=$(ev.target);
		if(oEv.prop('id')=='sim'){
			show(1500,1000,[1,1,1,1,1,2,2,2,3,3,4,5]);  //简单
			level=1;
			fnClick();
		}
		if(oEv.prop('id')=='mid'){
			show(1000,800,[1,1,1,2,2,3,4,5]);//一般
			level=2;
			fnClick();
		}
		if(oEv.prop('id')=='dif'){
			show(600,600,[1,2,3,4,5])//困难
			level=3;
			fnClick();
		}
	});

	var delModal = modal();
	function fnClick(){
		runPro(); //进度条
		delModal();
		$('#level').hide();
	};

	//进度条
	function runPro(){
		$('.progress span').css('width',200);
		var progress=$('.progress span').width();
		var newTimer=setInterval(function(){
			progress-=4;
			$('.progress span').css('width',progress);
			if(progress==0){
				clearInterval(timer);
				clearInterval(newTimer);
				$('#end').show();
				modal();
			}
		},1000);
	};

	//游戏结束时弹出的页面
	$('#end').click(function(ev){
		var oEv=$(ev.target);
		if(oEv.prop('id')=='again'){
			delModal();
			$(this).hide();
			runPro();
			switch (level){
				case 1:
					show(1500,1000,[1,1,1,1,1,2,2,2,3,3,4,5]);  //简单
					break;
				case 2:
					show(1000,800,[1,1,1,2,2,3,4,5]);//一般
					break;
				case 3:
					show(600,600,[1,2,3,4,5])//困难
					break;
			}
		}
		if(oEv.prop('id')=='back'){
			$(this).hide();
			$('#start').show();
		}
	});


})