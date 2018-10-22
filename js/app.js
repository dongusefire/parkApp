var AJAX_PATH = 'http://bj.ecosysnet.com:7106/api';
var AJAX_HOST = 'http://bj.ecosysnet.com:7106';
var app = {
	name:"易惠停",
	netType:null,
	pushServer:"http://demo.dcloud.net.cn/push/?",
	isNetwork:true, //客户端网络状态  false无网络，true有网络
	trim:function(str){
		return str.replace(/(^\s*)|(\s*$)/g,"");
	},
	createLocalPushMsg:function(msg){ //创建本地推送消息
		var options = {cover:false};
			var str = '2018/7/5';
			str += ":"+str;
			plus.push.createMessage( msg, "LocalMSG", options );
	},
	oneAlert:function(opt){
		var _this = this;
		var oAlertId = plus.storage.getItem('oAlertId');
		if(oAlertId!='' && oAlertId){
			if(oAlertId.indexOf('&'+opt.id)==-1){
				oAlertId+=('&'+opt.id);
			};
		}else{
			oAlertId = '';
		};
		plus.storage.setItem('oAlertId',oAlertId);
		mui.alert(opt.msg,this.name+'提示',opt.btn,function(){
			if(opt.callback){
				opt.callback();
			};
			oAlertId = oAlertId.replace('&'+opt.id,'');
			plus.storage.setItem('oAlertId',oAlertId);
		});
	},
	requireNotiMsg:function(){ //发送"普通通知"消息
		if(navigator.userAgent.indexOf('StreamApp')>0){
			plus.nativeUI.toast('当前环境暂不支持发送推送消息');
			return;
		}
		var inf = plus.push.getClientInfo();
		console.log(JSON.stringify(inf))
		var url = app.pushServer+'type=noti&appid='+encodeURIComponent(plus.runtime.appid);
		inf.id&&(url+='&id='+inf.id);
		url += ('&cid='+encodeURIComponent(inf.clientid));
		if(plus.os.name == 'iOS'){
			url += ('&token='+encodeURIComponent(inf.token));
		}
		url += ('&title='+encodeURIComponent('Hello H5+'));
		url += ('&content='+encodeURIComponent(msg));
		url += ('&version='+encodeURIComponent(plus.runtime.version));
		console.log(url,'发送推送的web地址')
		plus.runtime.openURL( url );
	},
	bindEvent:function(){ //绑定全局事件
		var _this = this;
		// 监听点击消息事件
		plus.push.addEventListener( "click", function( msg ) {
			// 判断是从本地创建还是离线推送的消息
			switch( msg.payload ) {
				case "LocalMSG":
					mui.alert(JSON.stringify(msg),'本地创建消息');
				break;
				default:
					mui.alert(JSON.stringify(msg),'离线推送消息');
				break;
			}
			// 提示点击的内容
			//plus.nativeUI.alert( msg.content );
		},false);
		// 监听在线消息事件
		plus.push.addEventListener( "receive", function( msg ) {
			if ( msg.aps ) {  // Apple APNS message
				mui.alert(JSON.stringify(msg),'在线APNS消息');
			} else {
				mui.alert(JSON.stringify(msg),'在线透传消息');
			};
		},false);
		document.addEventListener("netchange",function(){
			_this.getNetType();
		}, false );
	},
	getNetType:function(){ //获取网络状态
		var _this = this;
		var type2 = plus.networkinfo.getCurrentType();
	    _this.netType = {};
	    _this.netType[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
	    _this.netType[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
	    _this.netType[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
	    _this.netType[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
	    _this.netType[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
	    _this.netType[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
	    _this.netType[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
	    if(_this.netType[type2]=='未知' || _this.netType[type2]=='未连接'){
	    	_this.isNetwork = false;
	    }else{
	    	_this.isNetwork = true;
	    };
	},
	init:function(){
		this.getNetType();
		this.bindEvent();
	}
}
document.addEventListener('plusready',function(){
	app.init();
},false);
//发送验证码  resCallback:ajax成功后的回调；completeCallback:ajax完成后的回调
function smsSend(phone,type,resCallback,completeCallback){
	mui.ajax(AJAX_PATH+'/sms/send',{
		data:{
			"phone_number":phone, //手机号
			"code_type":type //验证码类型|必须    （1-注册，2-登录，3-添加车辆，4-提现）
		},
		dataType:'json',
		type:'POST',
		success:function(res,textStatus,xhr){
			if(res.code!=200){
				mui.alert(res.msg,app.name+'提示','确定',null);
			}else{
				resCallback(res,textStatus,xhr)
			};
		},
		complete:function(xhr, status){
			completeCallback(xhr,status);
		}
	});
};
function login(str){
	if(!str || str==''){
		str='尚未登录或登录已过期';
	};
	mui.alert(str,app.name+'提示','去登录',function(){
		mui.openWindow('login.html','login.html',{
			styles:{
				popGesture: "close", //popGesture窗口的侧滑返回功能。可取值"none"：无侧滑返回功能；"close"：侧滑返回关闭Webview窗口；"hide"：侧滑返回隐藏webview窗口
				statusbar:{  //statusbar窗口状态栏样式。仅在应用设置为沉浸式状态栏样式下有效，设置此属性后将自动保留系统状态栏区域不被Webview窗口占用。http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.WebviewStatusbarStyles
					background:"#fff" 
				}
			},
			extras:{}
		});
	});
};
//设置ajax全局的beforeSend
mui.ajaxSettings.beforeSend = function(xhr, setting) {
//	if(!app.isNetwork){
//		var type2 = plus.networkinfo.getCurrentType();
//		app.oneAlert({
//			id:'network',
//			msg:'您当前网络属于'+app.netType[type2],
//			btn:'确定'
//		})
//		xhr.abort();
//		return false;
//	};
//	console.log('beforeSend:' + JSON.stringify(setting));
};
//设置ajax全局的complete
mui.ajaxSettings.complete = function(xhr, status) {
//	console.log('complete:' + status,xhr,xhr.response);
//	if(status=='abort'){
//		app.oneAlert({  
//			id:'network',
//			msg:'当前网络有误，请稍后再试',
//			btn:'确定'
//		});
//	};
	if(xhr.response&&xhr.response!=''){
		var res = mui.parseJSON(xhr.response);
		if(res.code==502 || res.code==503){
			login('登录已过期')
		}else if(res.code==509){ 
			plus.storage.setItem('token',res.data.newToken);
		};
	};
};
   