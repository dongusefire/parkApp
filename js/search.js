mui.init();
var vm = new Vue({
	el:'.mui-content',
	data:{
		isRecord:false,
		items:[]
	},
	created:function(){
		this.readData();
	},
	methods:{
		readData:function(){
			var search = plus.storage.getItem('search');
			if(search && search!=''){
				this.items = JSON.parse(search);
			};
		}
	}
})
