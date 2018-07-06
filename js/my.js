mui.init();
document.getElementById('openLogin').addEventListener('tap',function(){
	var options = {
		styles:{
			popGesture: "close", //popGesture窗口的侧滑返回功能。可取值"none"：无侧滑返回功能；"close"：侧滑返回关闭Webview窗口；"hide"：侧滑返回隐藏webview窗口
			statusbar:{  //statusbar窗口状态栏样式。仅在应用设置为沉浸式状态栏样式下有效，设置此属性后将自动保留系统状态栏区域不被Webview窗口占用。http://www.dcloud.io/docs/api/zh_cn/webview.html#plus.webview.WebviewStatusbarStyles
				background:"#fff" 
			}
		},
		extras:{}
	};
	mui.openWindow('login.html','login.html',options);
},false);
mui('.park-nav').on('tap','a',function(){
	var href = this.getAttribute('href');
	var token = plus.storage.getItem('token');
	//非plus环境，直接走href跳转
	if(!mui.os.plus) {
		location.href = href;
		return;
	}
	if(href=='#'){
		mui.alert('敬请期待','系统提示','确定',null)
		return false;
	};
	//判断要跳转的页面是否需要登录才能跳转
	if(href.indexOf('setting')==-1){
		if(!token || token==''){
			login();
			return false;
		};
	};
	var options = {
		styles:{
			bottom:0,
			top:0,
			width:'100%',
			popGesture: "close",
			statusbar:{
				background:"#fff" 
			}
		},
		extras:{}
	};
	mui.openWindow(href,href,options);
});
