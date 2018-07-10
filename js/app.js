var AJAX_PATH = 'http://bj.ecosysnet.com:7098/api';
var app = {
	name:"易惠停",
	pushServer:"http://demo.dcloud.net.cn/push/?",
	isNetwork:true, //客户端网络状态  false无网络，true有网络
	createLocalPushMsg:function(msg){ //创建本地推送消息
		var options = {cover:false};
			var str = '2018/7/5';
			str += ":"+str;
			plus.push.createMessage( msg, "LocalMSG", options );
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
	pushEvent:function(){ //绑定全局事件
		// 监听点击消息事件
		plus.push.addEventListener( "click", function( msg ) {
			// 判断是从本地创建还是离线推送的消息
			switch( msg.payload ) {
				case "LocalMSG":
					alert( "点击本地创建消息启动：" +JSON.stringify(msg));
				break;
				default:
					alert( "点击离线推送消息启动："+ +JSON.stringify(msg));
				break;
			}
			// 提示点击的内容
			//plus.nativeUI.alert( msg.content );
		},false);
		// 监听在线消息事件
		plus.push.addEventListener( "receive", function( msg ) {
			if ( msg.aps ) {  // Apple APNS message
				alert( "接收到在线APNS消息：" +JSON.stringify(msg));
			} else {
				alert( "接收到在线透传消息：" +JSON.stringify(msg));
			};
		},false);
	},
	init:function(){
		this.pushEvent();
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
				mui.alert(res.msg,'系统提示','确定',null);
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
	mui.alert(str,'系统提示','去登录',function(){
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
	if(!app.isNetwork){
		xhr.abort();
		return false;
	};
	console.log('beforeSend:' + JSON.stringify(setting));
};
//设置ajax全局的complete
mui.ajaxSettings.complete = function(xhr, status) {
	console.log('complete:' + status,xhr,xhr.response);
	if(xhr.response&&xhr.response!=''){
		var res = mui.parseJSON(xhr.response);
		if(res.code==502 || res.code==503){
			login('登录已过期')
		}else if(res.code==509){
			plus.storage.setItem('token',res.data.newToken);
		};
	};
};
