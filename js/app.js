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
	console.log('complete:' + status);
};
