mui.init();
var orderPay = {
	ws:null,
	wo:null,
	pays:[],
	order_sn:'',
	pay_channel:'',
	payBtn:false,
	payId:'',
	paylink:null,
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
	getPayInfo:function(){//获取支付签名
		var _this = this;
		alert('wx62d3f78776978c14')
		var token = plus.storage.getItem('token');
		mui.ajax(AJAX_PATH+'/pay?token='+token,{
			data:{
				"order_sn":_this.order_sn,
				"pay_channel":_this.pay_channel,
			},
			dataType:'json',
			type:'POST',
			success:function(res,textStatus,xhr){
				_this.payBtn = false;
				if(res.code==200){
					var order = JSON.stringify(res.data);
					if(_this.pay_channel==1){
						order = res.data;
					};
					mui.alert(order,'支付信息');
					alert(res.data['mweb_url']);
//					plus.runtime.openURL(res.data['mweb_url']);
					_this.paylink = mui.openWindow(res.data['mweb_url'],'paylink',{
						styles:{
							popGesture: "close",
							titleNView:{
								buttons:[
									{
										color:'#292929',
										colorPressed:'#292929',
										float:'left',
										text:'返回',
										onclick:function(){
											_this.paylink.close();
										}
									}
								],
								backgroundColor:'#f7f7f7',
								titleText:'微信支付',
								splitLine: {
									color: '#cccccc'
								}
							}
						},
						show:{
							event:'loaded'
						},
						waiting:{
							autoShow:false
						},
						extras:{}
					});
//					plus.payment.request(_this.pays[_this.payId],order,function(result){
//						mui.alert('支付成功',"20180711114835598",'确定',null);
//					},function(e){
//						mui.alert('['+e.code+']：'+e.message,"20180711114835598",'确定',null);
//					});
				}else if(res.code==509){
					_this.getPayInfo();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(JSON.stringify(res),'系统提示','确定',null);
				};
			}
		});
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
				mui.alert('请选择支付类型','系统提示');
			};
		});
		mui('.mui-content').on('tap','.radio_inline',function(){
			//如果支付通道不需要依赖系统安装服务，则永远返回true。例如支付宝，如果设备上未安装支付宝客户端则调用Wap页面进行支付，因此值固定返回true；
			//而微信支付则依赖微信客户端，如果设备上未安装微信客户端则serviceReady值为false，此时应该提示用户安装微信客户端才能进行支付操作
			var val = $(this).find('.pay-type').val();
			var id = 'alipay';
			if(val==2){
				id = 'wxpay';
			};
			if(!(_this.pays[id].serviceReady)){
				_this.promptInstall(_this.pays[id]);
			}else{
				_this.payId = id;
				_this.pay_channel = val;
			};
		});
	},
	init:function(){
		this.ws = plus.webview.currentWebview();
		this.wo = this.ws.opener();
		this.order_sn = this.ws.order_sn;
		this.getChannels();
		this.bindEvent();
	}
}
mui.plusReady(function(){
	orderPay.init();
});