mui.init();
var newParkSpace = {
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
		nature:'1'
	},
	addOff:false,
	floorSwitch:0,
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
	validateData:function(){
		var spaceData = this.spaceData,str='';
		spaceData.nature = mui('[name="nature"]:checked')[0].value;
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
		if(str!=''){
			mui.toast(str);
			return false;
		}else{
			return true;
		};
	},
	bindeEvent:function(){
		var mc = mui('.mui-content'),_this = this;
		mc.on('tap','#openChooseParkSpace',function(){
			mui.openWindow('chooseParkSpace.html','chooseParkSpace.html',_this.webviewOptions);
		});
		//点击显示时间选择器
		mc.on('tap','#valid_time',function(){
			var _self = this;
			_this.dtPicker.show(function(selectItems) { 
		        _self.value = selectItems.text;
		    })
		});
		//发布接口
		mc.on('tap','#spaceAdd',function(){
			var _seif = this;
			if(!_this.validateData()){
				if(_this.addOff){
						
				};
			};
		});
		//切换楼层信息是否为地下
		mui('#floorSwitch')[0].addEventListener("toggle",function(event){
			var $switchZf = mui('.switch-zf')[0];
			if(event.detail.isActive){
				_this.floorSwitch = 1;
				$switchZf.innerHTML = '地下';
			    console.log("你启动了开关");
			}else{
				_this.floorSwitch=0;
				$switchZf.innerHTML = '地上'
			    console.log("你关闭了开关");  
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
			    fileNumLimit:1,
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