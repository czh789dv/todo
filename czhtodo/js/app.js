(function (window) {


	// Your starting point. Enjoy the ride!


	new Vue({
		el: '#czh',
		data: {
			list_data: []
		},
		methods: {
			add(ev) {
				var input = ev.target;
				// 获取数据
				if (input.value.trim() == '') {
					return;
				}
				// 如果数据为空 不添加
				var todo_data = {
					id: this.list_data.length+Date.now(),
					title: input.value,
					stat: false
				};
				// 组装数据
				// this.list_data.push(todo_data);
				// //添加到数组
				let url = 'http://localhost:3000/list_data';
				//将数据保存到服务器
				axios.post(url, todo_data).then((backdata) => {
					let {
						data,
						status
					} = backdata;
					//获取数据和状态码
					if (status == 201) {
						this.list_data.push(data);
					}
				})


				input.value = '';
				//清空文本框

				// this 代表当前的Vue实例
			},
			toggle_all(ev) {
				var input = ev.target;
				// 获取点击元素
				for (i = 0; i < this.list_data.length; i++) {
					this.list_data[i].stat = input.checked;
				}
				// 循环为所有数据重新赋值
				// 元素使用v-model赋值  所有会双向改变数据


			},
			// 完成任务 事件处理器(新添加，原案例中没有)
done(key,id){
    let url = 'http://localhost:3000/list_data/'+id;
    // 组装数据准备修改服务器数据
    setdata = {};
    // 注意：事件优先于浏览器渲染执行，获取当前状态
    var chestat = this.list_data[key].stat;
    // 状态取反
    setdata.stat = !chestat;
    setdata.title = this.list_data[key].title;
    // console.log(setdata);
    axios.put(url,setdata).then((backdata)=>{
        var {data,status} = backdata;
        // 如果服务器修改失败,则重新渲染DOM节点样式，改回原始状态
        // 服务器返回状态有误
        if(status != 200){
           	// 具体修改任务列表中那个任务的那个数据值  
            this.list_data[key].stat = chestat;
        }
        // 如果异步执行失败失败,则重新渲染DOM节点样式，改回原始状态
    }).catch((err)=>{
        if(err){
            this.list_data[key].stat = chestat;
        }
    })
},

			remove(key, id) {
				let url = 'http://localhost:3000/list_data/'+id;
				axios.delete(url).then((backdata) => {
					let {
						data,
						status
					} = backdata;
					if (status == 200) {
						this.list_data.splice(key, 1);
					}
				})



				// this.list_data.splice(key,1);
				//移除数据
			},

			// removeall(){
			// 	for(let i=0;i<list_data.length;i++){
			// 		if(list_data[i].stat == true){
			// 			this.list_data.splice(i,1);
			// 		}
			// 	}//循环遍历 如果等于ture则删除
			// },
			//精简写法
			removeall() {
				

				this.list_data = this.list_data.filter((v) => !v.stat);
				//filter根据条件返回一个新的数组
				//这里直接将stat.取反
			},
		},
		computed: {
			getNu() {
				return (this.list_data.filter(v => !v.stat)).length;
			}
		},
		//计算属性 计算剩余的任务
		directives: {
			getfocus: {
				inserted: function (el) {
					el.focus()
				}
			}
		},
		//自定义属性 自动获取焦点
		mounted: function () {
			let url = 'http://localhost:3000/list_data';
			axios.get(url).then((backdata) => {
				this.list_data = backdata.data;
			})
		},
		//生命周期的钩子函数   获取全部任务
	})


})(window);
