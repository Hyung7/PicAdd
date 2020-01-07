$(function () {

  var initHeight = 200, // 木桶布局初始高度
    initWidth = 150, // 瀑布流布局初始宽度
    usedWidth = 0, // 当前行已占用宽度
    winWidth = $(window).width() - 20, // 可视区的宽(减去滚动条的宽)
    num = 0, // 木桶布局当前行图片数量
    column = 0, // 瀑布流布局图片列数
    cate = 'animals', // 图片类别
    arr = 'barrel', // 布局
    img = []; // 图片

  var left = []; // 每列图片left值
  var top = []; // 每列图片top值
  var needWidth = [0, 237, 391, 545, 699]; // 列数需要的宽度

  var wrapper = $(".wrapper");


  // 初始化
  function init() {
    usedWidth = 0; // 当前行已占用宽度
    num = 0; // 当前行图片数量
    img = []; // 图片
    $(".wrapper").html('');
    for (var i = 0; i < 30; i++) {
      addPic();
    }
  }

  init();

  // 图片分类改变
  $('input[type=radio][name=cate]').change(function () {
    cate = this.id;
    init();
  });

  // 布局改变
  $('button').click(function () {
    arr = arr === 'barrel' ? 'waterFall' : arr = 'barrel';
    wrapper.toggleClass('waterFall');
    $('img').toggleClass('barrel');
    $('img').toggleClass('waterFall');
    reset();
  });

  // 页面滚动事件
  $(window).scroll(function () {
    // 如果文档高度 - 滚动条距离 < 1500,则添加图片
    if ($(document).height() - $(window).scrollTop() < 1500) {
      addPic();
    }
  })

  // 窗口可视区宽度改变事件
  $(window).resize(function () {
    // 当可视区宽度改变时重新排列图片，并回到顶部
    if (winWidth !== $(window).width()) {
      winWidth = $(window).width(); // 重新获取可视区的宽
      reset();
    }
  })

  function reset() {
    $(document).scrollTop(0);
    if (arr === 'barrel') {
      usedWidth = 0; // 重新设置当前行已占用宽度
      num = 0; // 重新设置当前行图片数量
      wrapper.attr('style', ''); // 清除wrapper宽度
    } else {
      WFInit(); // 瀑布流初始化
    }
    for (var i = 0; i < img.length; i++) {
      setPic(i);
    }
  }

  // 添加新图片
  function addPic() {
    var len = img.length;
    var width = parseInt(Math.random() * 100 + 100); // 图片的宽，100 - 200 之间随机数
    var height = parseInt(Math.random() * 100 + 100); // 图片的高，100 - 200 之间随机数
    var url = "http://placeimg.com/" + width + "/" + height + "/" + cate; // 图片的url
    img[len] = $("<img src='" + url + "'>"); // 创建图片
    img[len].addClass(arr);
    img[len].w = width; // 当前图片的宽
    img[len].h = height; // 当前图片的高
    wrapper.append(img[len]); // 插入图片
    setPic(len);
  }

  // 瀑布流布局初始化
  function WFInit() {
    winWidth = $(window).width(); // 获取可视区的宽
    // 设置图片列数
    for (var i = 4; i >= 0; i--) {
      if ((winWidth - 16) > needWidth[i]) {
        column = i + 1; // 图片列数
        top = [0, 0, 0, 0, 0]; // 设置每列图片top值
        left[0] = 0; // 第一列图片left
        // 如果winWidth < 782，则重新设置图片宽
        if (winWidth < 782) {
          initWidth = (winWidth - 16 - 4 * (column - 1)) / column; // 重新设置图片宽
        }
        for (var j = 1; j < column; j++) {
          left[j] = left[j - 1] + initWidth + 4;
        }
        wrapper.css("width", (initWidth + 4) * column - 4); // 改变wrapper的宽
        break;
      }
    }
  }

  function setPic(index) {
    // 木桶布局排列图片
    if (arr === 'barrel') {
      var canUseWidth = winWidth - 17 - num * 4; //当前行可用宽度（可视区宽度 - margin）
      var width = img[index].w * initHeight / img[index].h; // 当height为initHeight时，当前图片将占用的宽度
      var lastWidth = canUseWidth - usedWidth; // 当前行剩余宽度
      // 如果该图片不是第一张图片并且当前行有足够宽度放下这张图片
      if (num && width < lastWidth) {
        num++;
        usedWidth += width; // 更新已占有宽度
      } else {
        var height = initHeight * canUseWidth / usedWidth; // 重新设置当前行高度
        // 遍历当前行
        for (var i = index - num; i < index; i++) {
          img[i].height(height); // 设置图片高
          img[i].width(img[i].w * height / img[i].h); // 设置图片宽
        }
        num = 1;
        usedWidth = width; // 更新已用宽
      }
    } else { // 瀑布流
      var min = 0; // top值最小的列索引
      // 找到top值最小列的索引
      for (var i = 0; i < column; i++) {
        if (top[i] < top[min]) {
          min = i;
        }
      }
      var height = img[index].h * initWidth / img[index].w; // 当图片宽为初始宽时，图片的高
      img[index].width(initWidth); // 设置图片宽
      img[index].height(height); // 设置图片高
      // 设置图片位置
      img[index].css({
        "left": left[min],
        "top": top[min]
      })
      top[min] += height + 4; //修改当前列的top值
    }
  }

})