var AJAX_PATH = 'http://bj.ecosysnet.com:7098/api';
var isNetwork = true; //客户端网络状态  false无网络，true有网络
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
	if(str || str==''){
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
	if(!isNetwork){
		xhr.abort();
		return false;
	};
	console.log('beforeSend:' + JSON.stringify(setting));
};
//设置ajax全局的complete
mui.ajaxSettings.complete = function(xhr, status) {
	console.log('complete:' + status,xhr);
	if(xhr.response&&xhr.response!=''){
		var res = mui.parseJSON(xhr.response);
		if(res.code==502 || res.code==503){
			login('登录已过期')
		};
	};
};
