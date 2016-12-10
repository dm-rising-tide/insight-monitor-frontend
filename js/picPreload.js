/*
 * 调用方法：
 	preload({
		files : [],
		progress : function(precent, currentImg) {
			具体代码
		},
		complete : function() {
			具体代码
		}
 	})
 *
 */
(function(){
	function filePreLoad(obj) {
		this.files = obj.files;
		// 正在加载的函数
		this.progress = obj.progress;
		// 加载完成后的函数
		this.complete = obj.complete;
		// 当前加载数量为0
		this.current = 0;
		// 容器设置
		this.box = document.createElement('div');
		this.box.style.cssText = 'overflow:hidden; position: absolute; left: -9999px; top: 0; width: 1px; height: 1px;';
		document.body.appendChild(this.box);
		this.getFiles();
	}

	// 获取每一个图片
	filePreLoad.prototype.getFiles = function() {
		var fileArr = [];
		for (var i = 0; i < this.files.length; i++) {
			fileArr[i] = this.files[i];
			this.loadImg(fileArr[i]);
		};
	}

	// 加载图像
	filePreLoad.prototype.loadImg = function(file) {
		var _this = this;
		var newImg = new Image();

		newImg.onload = function(){
            // 避免循环引用（解决低端浏览器内存泄露的问题）
            // 解决当我们遇到gif这种动态图的加载时，可能会多次触发onload
			newImg.onload = null;
			_this.loadFtn(newImg);
		}

		newImg.src = file;
	}

	// 执行相关回调
	filePreLoad.prototype.loadFtn = function(currentImg) {
		this.current++;
		// 解决页面闪屏的问题
		this.box.appendChild(currentImg);

		if (this.progress) {
			var precentage = parseInt(this.current / this.files.length * 100);
			this.progress(precentage, currentImg);
		};
		if (this.current == this.files.length) {
			if (this.complete) {
				this.complete();
			};
		};
	}

	function preload(obj) {
		return new filePreLoad(obj);
	}
	
	// 暴露接口
	window.preload = preload;
})();