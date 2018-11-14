//时间戳转换为时间格式
function timestampToTime(timestamp,str) {
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
    if(str=='start'){
    	return Y+M+p(D)+p(h)+p(m);
    }else{
    	return p(h)+p(m);
    };
}
mui.init();
var vm = new Vue({
	el:'.box-main',
	data:{
		items:[],
	},
	methods:{
		getData:function(){
			this.token = plus.storage.getItem('token');
			if(this.token && this.token!=''){
				this.readData();
			}else{
				login('尚未登录或登录已过期')
			};
		},
		readData:function(){
			var this_ = this,total='';
			token = plus.storage.getItem('token');
			plus.nativeUI.showWaiting('正在获取...',{back:'none'});
			mui.ajax(AJAX_PATH+'/user/code/list/person?token='+token,{
				type:'get',
				dataType:'json',
				success:function(res){
					plus.nativeUI.closeWaiting();
					if(res.code==200){
						total = res.data.codetotle;
						$(".Total h3").html(total);
						console.log(JSON.stringify(res),'资产数据');
						var codelist = res.data.codelist;
						for(var i=0;i<codelist.length;i++){
							if(codelist[i].cardtype!='0'){
								codelist[i].time ='<span>截至日期：</span><span>'+codelist[i].usertime+'</span>';
							}else{
								codelist[i].time ='<span>有效时间：</span><span>'+timestampToTime(codelist[i].start_time,'start')+'~'+timestampToTime(codelist[i].end_time,'end')+'</span>';
							};
						};
						this_.items = codelist;
					}else if(res.code==509){
						this_.readData();
					}else if(res.code!=502 && res.code!=503){
						mui.alert(res.msg,app.name+'提示','确定',null);
					}
				}
			})
		}
	}
});
function toTrade(){
	mui.openWindow({
		url:'Register_change.html',
		id:'Register_change.html',
		styles:{
			bottom:0,
			top:0,
			width:'100%',
			popGesture: "close",
			statusbar:{
				background:"#fff" 
			}
		}
	})
}
mui.plusReady(function(){
	vm.getData();
	//跳转
	document.getElementById("footer").addEventListener('tap',function(){
		if(vm.items && vm.items.length!=0){
			toTrade()
		}else{
			mui.alert('您没有资产，无法进行交换！',app.name+'提示');
		};
	});
	mui('.g-content').on('tap','#openList',function(){
		mui.openWindow('Register.html','Register.html',{
			styles:{
				bottom:0,
				top:0,
				width:'100%',
				popGesture: "close",
				statusbar:{
					background:"#6d93ff" 
				}
			}
		});
	});
});

//设置更新事件
window.addEventListener('readData',function(){
	vm.readData();
});

