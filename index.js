(function () {
  var dt = {
    init() {
      this.bigImg = document.querySelector(".bigImg img");
      this.textWrap = document.querySelector(".bigImg .text");
      this.text = "";
      this.textColor = "";
      this.textSize = 30;
      //选项卡
      this.tab();
      //编辑文本信息
      this.edit();
      //拖拽
      this.darg(this.bigImg);
      //画布
      // this.draw();
      //下载
      this.download();
      //上传
      this.upload();
    },
    tab() {
      var lis = document.querySelectorAll(".tool li");
      this.last = lis[0]; //上一个li
      lis.forEach(
        (li) =>
          (li.onclick = () => {
            this.last.className = "";
            li.className = "active";
            this.bigImg.src = li.children[0].src; //更新大图
            this.last = li; //把上次更新的元素替换成当前的元素

            //拖拽后图片改变了位置，所以点击新图后要把位置删除
            this.bigImg.style.left = this.bigImg.style.top = "auto";
          })
      );
    },
    edit() {
      //文字编辑
      var input = document.querySelector(".edit>input");
      input.oninput = () => (this.textWrap.innerHTML = this.text = input.value);
      //字体大小
      var number = document.querySelector(".fontStyle input");
      number.onchange = () => {
        this.textWrap.style.fontSize = number.value + "px";
        this.textSize = number.value;
      };
      this.darg(this.textWrap);
     
    },
    darg(obj){
      //鼠标按下的位置
      var startX=0,
          startX=0,
          //鼠标按下时元素的位置
          startL=0,
          startT=0,
          //元素要到的位置
          curX=0,
          curY=0;
      var maxWidth =obj.parentNode.clientWidth-obj.offsetWidth;
      var maxHeight =obj.parentNode.clientHeight-obj.offsetHeight;
      
          obj.onmousedown = ev =>{
            startX=ev.clientX,
            startY=ev.clientY,
            //鼠标按下时元素的位置
            startL=obj.offsetLeft,
            startT=obj.offsetTop,
            document.onmousemove =ev =>{
              curX=ev.clientX-startX+startL,
              curY=ev.clientY-startY+ startT;
              //左右
              if(curX<0){
                curX=0
              }
              if(curX>=maxWidth){
                curX=maxWidth
              }
              //上下
              if(curY<0){
                curY=0
              }
              if(curY>=maxHeight){
                curY=maxHeight
              }
              obj.style.left=curX+'px';
              obj.style.top=curY+'px';
              ev.preventDefault();
            }
              document.onmouseup=()=>document.onmousemove =null;
          }
    },
    draw(cd){
      var canvas =document.createElement('canvas');
      var context =canvas.getContext('2d');
      canvas.width=500;
      canvas.height=500;
      //背景问题
      context.fillStyle ='#fff';
      context.fillRect(0,0,canvas.width,canvas.height);

      var img =new Image();
      img.src = this.bigImg.src;
      img.onload = () =>{
        var imgX =parseFloat(getComputedStyle(this.bigImg).left); 
        var imgY =parseFloat(getComputedStyle(this.bigImg).top);
        var textX =parseFloat(getComputedStyle(this.textWrap).left); 
        var textY =parseFloat(getComputedStyle(this.textWrap).top);
        console.log(imgX,imgY);
        context.drawImage(img,imgX,imgY);
        //画文本
        
        context.font = `bold ${this.textSize}px 微软雅黑`;
        context.fillStyle='#000'
        //文字对齐方式
        context.textBaseline="top";
        context.fillText(this.text,textX,textY+10);
        //画水印
        context.font = `14px 仿宋`;
        context.fillStyle='f00';
        context.fillText('小贾制作',420,480);
        cd(canvas.toDataURL());
      }

    },
    download(){
      var downBtn = document.querySelector('.downBtn');
      downBtn.onclick=()=>{
        var a =document.createElement('a');
        a.style.display= 'none';
        a.download ='jias';
        document.body.appendChild(a);
        this.draw(url =>{
          a.href = url;
          a.click();
          document.body.removeChild(a);
        });
      }
    },
    upload(){
      var upBtn = document.querySelector('.upBtn');
      var input = document.createElement('input');
      input.type ='file';
      input.accept ='imgs/gif,imgs/png,imgs/jpeg';
      input.style.display = 'none';
      upBtn.onclick =() =>{
        document.body.appendChild(input);
        input.click();
      };
      input.onchange = e =>{
        var file =e.target.files[0];
        //通过地址读取文件
        var fr= new FileReader();
        fr.readAsDataURL(file);
        fr.onload = e =>{
            this.bigImg.src = e.target.result;
            this.bigImg.style.left = this.bigImg.style.top = "auto";
            this.last.className = '';
            document.body.removeChild(input);
        }

      }

    }
  };
  dt.init();
})();
