mui.init();
var newParkSpace = {
	ws:null,
	wo:null,
	dtPicker:null,
	spaceData:{
		p_s_sn:'',
		p_img:'/upload/AppImg/2018-07-12/20180712141329289.jpg',
		file_img:'/upload/AppImg/2018-07-12/20180712141329289.jpg',
		card_img:'/upload/AppImg/2018-07-12/20180712141329289.jpg',
		p_s_num:'',
		p_s_f:'',
		p_s_area:'',
		p_s_length:'',
		p_s_width:'',
		park_id:'',
		valid_time:'',
		nature:''
	},
	addOff:false,
	floorZF:0,
	floorJC:0,
	upPBtn:null,
	upCardBtn:null,
	upFileBtn:null,
	webviewOptions:{
		styles:{
			bottom:0,
			top:0,
			width:'100%',
			popGesture: "close",
			statusbar:{
				background:"#fff" 
			}
		}
	},
	validateData:function(status,value){
		var spaceData = this.spaceData,str='';
		spaceData.nature = mui('[name="nature"]:checked')[0].value;
		var p1 = /^[0-9a-zA-Z]+$/,p2 = /^\d*$/,p3 = /^[1-9]+(\.\d+)?$/;
		if(status && status!='all'){
			if(status=='p_s_num' && !p1.test(value)){
				str='楼栋位置只能为字母和数字';
			}else if(status=='p_s_f' && !p2.test(value)){
				str='楼层位置只能为数字';
			}else if(status=='p_s_area' && !p1.test(value)){
				str='楼区位置只能为字母和数字';
			}else if(status=='p_s_sn' && !p2.test(value)){
				str='车位编号只能为数字';
			}else if(status=='p_s_length' && !p3.test(value)){
				str='车位长度只能为小数或整数';
			}else if(status=='p_s_width' && !p3.test(value)){
				str='车位宽度只能为小数或整数';
			}
		}else{
			if(spaceData.park_id==''){
				str='请选择车场';
			}else if(spaceData.p_s_num==''){
				str='请填写楼栋位置';
			}else if(spaceData.p_s_f==''){
				str='请填写楼层位置';
			}else if(spaceData.p_s_area==''){
				str='请填写楼区位置';
			}else if(spaceData.p_s_sn==''){
				str='请填写车位编号';
			}else if(spaceData.p_s_length==''){
				str='请填写车位长度';
			}else if(spaceData.p_s_width==''){
				str='请填写车位宽度';
			}else if(spaceData.valid_time==''){
				str='请选择发布有效期';
			}else if(spaceData.p_img==''){
				str='请添加车位图片';
			}else if(spaceData.file_img==''){
				str='请添加车位产权证明';
			}else if(spaceData.file_img==''){
				str='请添加身份证照片';
			};
		};
		if(str!=''){
			mui.toast(str);
			return false;
		}else{
			return true;
		};
	},
	spaceAdd:function(){
		var token = plus.storage.getItem('token'),_this=this;
		if(_this.spaceData['p_s_f'].length==1){
			_this.spaceData['p_s_f']=_this.floorZF+_this.spaceData['p_s_f']+_this.floorJC;
		};
		mui.ajax(AJAX_PATH+'/user/park/space/add?token='+token,{
			data:JSON.stringify(_this.spaceData),
			dataType:'json',
			type:'post',
			success:function(res,textStatus,xhr){
				_this.addOff = false;
				if(res.code==200){
					mui.toast('添加成功');
					//更新车位列表页面数据
					mui.fire(_this.wo,'upDate');
					setTimeout(function(){
						_this.ws.close();
					},100);
				}else if(res.code==509){
					_this.spaceAdd();
				}else if(res.code!=502 && res.code!=503){
					mui.alert(res.msg,app.name+'提示','确定',null);
				};
			}
		});
	},
	bindeEvent:function(){
		var mc = mui('.mui-content'),_this = this;
		mui.plusReady(function(){
			_this.ws = plus.webview.currentWebview();
			_this.wo = _this.ws.opener();
		});
		mc.on('tap','#openChooseParkSpace',function(){
			mui.openWindow('chooseParkSpace.html','chooseParkSpace.html',_this.webviewOptions);
		});
		//点击显示时间选择器
		mc.on('tap','#valid_time',function(){
			var _self = this;
			var inps = mui('.input-change');
			for(var i=0;i<inps.length;i++){
				inps[i].blur();
			};
			_this.dtPicker.show(function(selectItems) { 
		        _self.value = selectItems.text;
		        _this.spaceData['valid_time'] = selectItems.text;
		    })
		});
		//判断并设置属性值
		mc.on('change','.input-change',function(){
			var name = this.name;
			var val = app.trim(this.value);
			if(_this.validateData(name,val)){
				_this.spaceData[name]=val.toUpperCase();
			}else{
				this.value='';
			};
		});
		//权属切换
		mc.on('tap','.user-defined',function(){
			var o = 0,n = 1;
			if(this.id=='rent'){
				o=1;
				n=0;
			};
			mui('[name="nature"]')[o].checked = true;
			mui('[name="nature"]')[n].checked = false;
		});
		//发布接口
		mc.on('tap','#spaceAdd',function(){
			var _seif = this;
			if(_this.validateData()){
				if(!_this.addOff){
					_this.addOff=true;
					_this.spaceAdd();
				};
			};
		});
		//切换楼层信息是否为地下
		mui('.floorSwitch')[0].addEventListener("toggle",function(event){
			var $switchZf = mui('.switch-zf')[0];
			if(event.detail.isActive){
				_this.floorZF = 1;
				$switchZf.innerHTML = '地下';
			}else{
				_this.floorZF=0;
				$switchZf.innerHTML = '地上'
			};
		});
		//切换楼层信息是否为夹层
		mui('.floorSwitch')[1].addEventListener("toggle",function(event){
			if(event.detail.isActive){
				_this.floorJC = 1;
			}else{
				_this.floorJC=0;
			};
		});
		//接收用户选择的数据
		window.addEventListener('getParking',function(event){
			var data = event.detail;
			_this.spaceData.park_id = data.id;
			_this.spaceData.park_lot_num = data.num;
			mui('.parkName')[0].innerHTML = '已选择: '+data.name;
		});
	},
	createWebuploader:function(){
		var _this = this;
		$('.upfileBtn').each(function(i,ele){
			var id = $(ele).attr('id');
			_this[id] = WebUploader.create({
			    // swf文件路径
			    swf: '../js/webuploader/Uploader.swf',
			    // 选完文件后，是否自动上传
			    auto:true,
			    // 文件接收服务端。
			    server: AJAX_PATH+'/upload',
			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: '#'+id,
			    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			    resize: false,
			    // 只允许选择图片文件。
			    accept: {
			        title: 'Images',
			        extensions: 'jpg,jpeg,png',
			        mimeTypes: 'image/*'
			    },
//			    fileNumLimit:1,
			    fileVal:'photo'
			});
			_this[id].on( 'uploadSuccess',function(file,response) {
			    console.log(file,response)
			});
		});
	},
	setDtPicker:function(){
		//获取30天以后的时间
		var now = new Date();
		now.setDate(now.getDate()+30);
		//初始化时间选择器
		this.dtPicker = new mui.DtPicker({
			type:'date',
			beginDate:now
		});
	},
	init:function(){
		this.createWebuploader();
		this.setDtPicker();
		this.bindeEvent();
	}
}
newParkSpace.init();