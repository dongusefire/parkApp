mui.init();
var orderPay = {
	ws:null,
	wo:null,
	pays:[],
	order_sn:'',
	park_id:'',
	pay_channel:'',
	payBtn:false,
	payId:'',
	paylink:null,
	resultOff:false,
	mweb_url:'',
	order_belong_user:'',
	getChannels:function(){//获取支付通道
		var _this = this;
		// 获取支付通道
	    plus.payment.getChannels(function(channels){
	    	for(var i in channels){
	    		var channel=channels[i];
				if(channel.id=='qhpay'||channel.id=='qihoo'){	// 过滤掉不支持的支付通道：暂不支持360相关支付
					continue;
				}
				_this.pays[channel.id] = channel;
				console.log(channel.id+':'+JSON.stringify(channel))
	    	};
	    },function(e){
	    	console.log("获取支付通道失败："+e.message);
	    });
	},
	promptInstall:function(channel){//提示安装客户端支付工具
		var txt=null;
		switch(channel.id){
			case 'alipay':
			txt='检测到系统未安装“支付宝”，无法完成支付操作，是否立即安装？';
			break;
			default:
			txt='系统未安装“'+channel.description+'”服务，无法完成支付，是否立即安装？';
			break;
		}
		plus.nativeUI.confirm(txt, function(status){
			if(status.index==0){
				channel.installService();
			}
		}, {
			title:app.name+'提示',
			buttons:['是','否']
		});
	},
	payResult:function(){//查询支付状态
		var loding = plus.nativeUI.showWaiting('正在查询支付状态',{
			modal:true,
			padlock:true
		});
		var token = plus.storage.getItem('token');
		var _this = this,order_sn=_this.order_sn;
		if(this.ws.t_order_num){
			order_sn = this.ws.t_order_num;
		};
		mui.ajax(AJAX_PATH+'/pay/result?token='+token,{
			data:{
				"order_sn":order_sn,
			},
			dataType:'json',
			type:'get',
			success:function(res,textStatus,xhr){
				loding.close();
				_this.resultOff = false;
				if(res.code==200){
					//支付成功之后的回调
					mui.openWindow({
						url:'paySuccess.html',
						id:'paySuccess.html',
						styles:{
							popGesture: "close",
							statusbar:{
								background:"#fff" 
							}
						},
						extras:{
							order_sn:_this.order_sn,
							park_id:_this.park_id
						}
					});
				}else if(res.code==509){
					_this.payResult();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				}
			}
		});
	},
	getPayInfo:function(){//获取支付签名
		var _this = this;
		var token = plus.storage.getItem('token'),order_sn=_this.order_sn;
		var pay_type = 1;
		if(_this.order_belong_user==1){
			pay_type = 2;
		};
		if(this.ws.t_order_num){
			order_sn = this.ws.t_order_num;
		};
		mui.ajax(AJAX_PATH+'/pay?token='+token,{
			data:{
				"order_sn":order_sn,
				"pay_channel":_this.pay_channel,
				"pay_type":pay_type   //支付方式 1 h5 2 APP 3 公众号
			},
			dataType:'json',
			type:'POST',
			success:function(res,textStatus,xhr){
				_this.payBtn = false;
				if(res.code==200){
//					var _text = '微信支付'
//					if(_this.pay_channel==1){
//						_text = '支付宝支付'
//					};
					if(_this.order_belong_user!=1){
						_this.mweb_url = res.data['mweb_url'];
						_this.openPaylink();
						return false;
					};
					var order = JSON.stringify(res.data);
					plus.payment.request(_this.pays[_this.payId],order,function(result){
						mui.openWindow({
							url:'paySuccess.html',
							id:'paySuccess.html',
							styles:{
								popGesture: "close",
								statusbar:{
									background:"#fff" 
								}
							},
							extras:{
								order_sn:_this.order_sn,
								park_id:_this.park_id
							}
						});
					},function(e){
//						alert(JSON.stringify(e))
						var str = '';
						if(_this.payId=='wxpay'){
							if(e.message.indexOf('-1')!=-1){
								str='一般错误';
							};
							if(e.message.indexOf('-2')!=-1){
								str='您已取消支付';
							};
							if(e.message.indexOf('-3')!=-1){
								str='发送失败';
							};
							if(e.message.indexOf('-4')!=-1){
								str='认证被否决';
							};
							if(e.message.indexOf('-5')!=-1){
								str='不支持错误';
							};
						}else{
							if(e.message.indexOf('62000')!=-1){
								str='尚未安装支付通道依赖的服务';
							};
							if(e.message.indexOf('62001')!=-1){
								str='您已取消支付';
							};
							if(e.message.indexOf('62002')!=-1){
								str='此设备不支持支付';
							};
							if(e.message.indexOf('62003')!=-1){
								str='数据格式错误';
							};
							if(e.message.indexOf('6204')!=-1){
								str='支付账号状态错误';
							};
							if(e.message.indexOf('62005')!=-1){
								str='订单信息错误';
							};
							if(e.message.indexOf('62006')!=-1){
								str='支付操作内部错误';
							};
							if(e.message.indexOf('62007')!=-1){
								str='支付服务器错误';
							};
							if(e.message.indexOf('62008')!=-1){
								str='网络问题引起的错误';
							};
							if(e.message.indexOf('62009')!=-1){
								str='网络问题引起的错误';
							};
						};
						mui.alert(str,app.name+'提示');
					});
				}else if(res.code==509){
					_this.getPayInfo();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			}
		});
	},
	openPaylink:function(){
		this.paylink = plus.webview.create(this.mweb_url,'paylink',{
			popGesture:'none',
			backButtonAutoControl:'none',
			additionalHttpHeaders:{
				"Referer":"http://www.ecosysnet.com/"
			},
			bottom:0,
			top:'46px',
			left:0,
			right:0
		});
		mui('#prompt-box')[0].style.display='block';
	},
	closePaylink:function(off){
		if(off){
			mui('#prompt-box')[0].style.display='none';
		};
		this.paylink.close();
		this.paylink = null;
	},
	bindEvent:function(){
		var _this = this;
		mui('.mui-content').on('tap','#payBtn',function(){
			if(_this.pay_channel!=''){
				if(!_this.payBtn){
					_this.payBtn = true;
					_this.getPayInfo();
				};
			}else{
				mui.alert('请选择支付类型',app.name+'提示');
			};
		});
		mui('.mui-content').on('tap','.btn-success',function(){
			_this.closePaylink(true);
			setTimeout(function(){
				_this.payResult();
			},500);
		});
		mui('.mui-content').on('tap','.btn-fail',function(){
			_this.closePaylink(false);
			setTimeout(function(){
				_this.openPaylink();
			},500);
		});
		mui('.mui-content').on('tap','.radio_inline',function(){
			//如果支付通道不需要依赖系统安装服务，则永远返回true。例如支付宝，如果设备上未安装支付宝客户端则调用Wap页面进行支付，因此值固定返回true；
			//而微信支付则依赖微信客户端，如果设备上未安装微信客户端则serviceReady值为false，此时应该提示用户安装微信客户端才能进行支付操作
			var val = $(this).find('.pay-type').val();
			var id = 'alipay';
			if(val==2){
				id = 'wxpay';
			};
			_this.payId = id;
			_this.pay_channel = val;
		});
	},
	orderDetail:function(){
		var _this = this;
		var token = plus.storage.getItem('token');
		mui.ajax(AJAX_PATH+'/user/order/detail?token='+token,{
			data:{
				"order_num":_this.order_sn,
				"park_id":_this.park_id,
			},
			dataType:'json',
			type:'get',
			success:function(res,textStatus,xhr){
				if(res.code==200){
					console.log(JSON.stringify(res.data));
//					_this.order_belong_user = res.data.order_info.order_belong_user;
					_this.order_belong_user = 2;//强制使用h5支付
					var order_info = res.data.order_info;
					var parkType = '',start='',end='';
					//类型判断
					if(order_info.flag == 'D'){
						parkType = '固定'
					}else if(order_info.flag == 'C'){
						parkType = '不固定'
					};
					//出入场时间判断
					//入场时间
					if(order_info.start_time&&order_info.start_time!=''){
						start = _this.timestampToTime(order_info.start_time);
					}else{
						start = '暂无数据';
					}
					//出场时间
					if(order_info.end_time&&order_info.end_time!=''){
						end = _this.timestampToTime(order_info.end_time);
					}else{
						end = '暂无数据';
					};
					//如果是超时订单，调整离场时间
					if(order_info.t_o_id!=null){
						if(order_info.t_o_end_time && order_info.t_o_end_time!=''){
							end = _this.timestampToTime(order_info.t_o_end_time);
						};
					};
					var bookFee = order_info.order_amount; //订单金额
					if(order_info.t_o_id!=null){
						status = '超时订单';
						bookFee = order_info.t_o_order_amount
					};
					document.getElementById('parkName').innerHTML = res.data.park_info.parking_lot_name;
					document.getElementById('parkAddress').innerHTML = res.data.park_info.parking_lot_address;
					document.getElementById('parkType').innerHTML = parkType;
					document.getElementById('plateNum').innerHTML = order_info.car_num;
					document.getElementById('stateTime').innerHTML = start;
					document.getElementById('endTime').innerHTML = end;
					
					document.getElementById('parkPrice').innerHTML = bookFee/100;
					$('[v-cloak]').removeAttr('v-cloak');
				}else if(res.code==509){
					_this.orderDetail();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			}
		});
	},
	//时间戳转换为时间格式
	timestampToTime:function(timestamp){
		function p(s) {
		    return s < 10 ? '0' + s: s;
		}
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes();
        s = date.getSeconds();
        return Y+M+p(D)+p(h)+p(m);
    },
	init:function(){
		this.ws = plus.webview.currentWebview();
		this.wo = this.ws.opener();
		this.order_sn = this.ws.order_sn;
		this.park_id = this.ws.park_id;
		this.orderDetail();
		this.getChannels();
		this.bindEvent();
	}
}
mui.plusReady(function(){
	orderPay.init();
});