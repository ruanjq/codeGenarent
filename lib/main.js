$(function() {

    var is_pc = $(".J_pc").length > 0 ? true : false;

    var font_size = is_pc ? 1 : parseFloat($("html").css("fontSize"));

    var linkItem = {
        rotate: 0,
        top: 0,
        left: 0,
        width: 75,
        height: 75,
        borderRadius: 0,
        link: ""
    }



    var loadState = "";

    var clipboard = new Clipboard('#J_copy_code');

    clipboard.on('success', function(e) {
        msgShow("代码复制成功!!!");
    });

    clipboard.on('error', function(e) {
        msgShow("代码复制失败");
    });


    var fixed_nav = function() {
        var mainPanel = document.getElementById("J_main_wrap");
        $(window).scroll(function(event) {
            var fp_rect = mainPanel.getBoundingClientRect();
            if (fp_rect.top <= -75) {
                $("#J_form_panel").addClass("fixed-form-panel");
            } else {
                $("#J_form_panel").removeClass("fixed-form-panel");
            }
        });
    }
    var formValid = function(cb) {
        $("#J_add_link").click(function() {
        	if(loadState == ""){
        		msgShow("请输入图片地址!");
        		return;
        	}else if(loadState == "loading"){
        		msgShow("图片加载中,请稍后!");
        		return;
        	} else if(loadState == "error"){
        		msgShow("图片加载失败,请重新输入!");
        		return;
        	}


            var isOk = true;
            if ($("#J_img_src").val() == "") {
                isOk = false;
                $("#J_img_src").addClass("error");
            } else {
                isOk = true;
                $("#J_img_src").removeClass("error");
            }
            if ($("#J_link").val() == "") {
                isOk = false;
                $("#J_link").addClass("error");
            } else {
                isOk = true;
                $("#J_link").removeClass("error");
            }

            if (isOk && typeof cb == "function") {
                cb();
            }

            if($("#J_img_src").val() == ""){
            	msgShow("请输入图片地址!");
            	return;
            }
            if($("#J_link").val() == ""){
            	msgShow("请输入跳转链接地址!");
            	return;
            }
        });
        $("#J_img_src").blur(function() {
            if ($(this).val() == "") {
                $(this).addClass("error");
            } else {
                $(this).removeClass("error");
            }
        });
        $("#J_link").blur(function() {
            if ($(this).val() == "") {
                $(this).addClass("error");
            } else {
                $(this).removeClass("error")
            }
        });
    }


    var checkImg = function() {
        var val_src = $("#J_img_src").val();
        $("#J_img_src").blur(function() {
            var _val = $(this).val();
            if (_val == $(".J_banner").attr("src")) {
                return;
            }
            if (_val != "" && (_val.match("http") != null || _val.match("https") != null)) {
                loadImg(_val);
            } else {
                loadError('input');
            }
        });


        function loadImg(src) {
            loadInit();
            var img = new Image();
            var _src = src + "?t=" + new Date().getTime();
            img.src = _src
            img.onload = function() {
                $(".J_banner").attr("src", _src).show();
            }
            img.onerror = function() {
            	loadError('load');
            }
        }
        if(val_src != ""){
        	loadImg(val_src);
        }
        

        $("#J_img_wrap .J_banner").load(function(){
            loadSuccess();
        });

        function loadSuccess(){
        	loadState = "success";
        	$('#draggable').show();
            dragInit();
            dragResize();
            $("#J_loading_panel").hide();
            $(".J_disabled").removeClass("disabled");
        }

        function loadInit(){
        	loadState = "loading";
        	$("#J_loading_txt").hide();
            $("#J_loading_panel").show();
            $(".J_banner").hide();
            $(".J_disabled").addClass("disabled");
            $('#draggable').hide();
            clear();
        }

        function loadError(type){
        	clear();
        	loadState = "error";
        	$(".J_banner").hide();
            $('#draggable').hide();
            $("#J_loading_panel").hide();
        	if(type == "input"){
        		msgShow("请输入正确图片地址!");
        		$("#J_loading_txt").show().html("请输入正确图片地址!");
        	}else{
        		msgShow("图片加载失败!");
        		$("#J_loading_txt").show().html("图片加载失败!");
        	}
        }
    }

    var dragInit = function() {
        $('#draggable').julyuiDrag({
            isLimit: true,
            position: 'absolute',
            scroll: false,
            onStop: function(rs) {
                $(this).attr('PosX', rs.left).attr('PosY', rs.top);
                linkItem.left = rs.left;
                linkItem.top = rs.top;
            }
        });
    }

    var dragResize = function() {
        $('#draggable').julyuiDragResize({
            onStop: function(rs) {
            	dragInit();
                linkItem.left = rs.left;
                linkItem.top = rs.top;
                linkItem.width = rs.width;
                linkItem.height = rs.height;

            }
        });
    }

    var setShap = function() {
        $("input[name=shape]").on('change', function() {
            var _val = $(this).val();
            if (_val == 1) {
                linkItem.borderRadius = 0;
            } else {
                linkItem.borderRadius = "50%";
            }
            $("#draggable").css({ borderRadius: linkItem.borderRadius });
        });
    }

    var range = function() {
        $("#rangeRotate").on('change mousemove touchmove', function() {
            var _val = $(this).val();
            $("#J_rotate").html('(' + _val + ')');
            linkItem.rotate = _val;
            $("#draggable").css({ transform: 'rotate(' + _val + 'deg)' });
        });

        $("#J_reset").click(function() {
            var _val = 0;
            $("#J_rotate").html('(' + _val + ')');
            linkItem.rotate = _val;
            $("#rangeRotate").val(_val);
            $("#draggable").css({ transform: 'rotate(' + _val + 'deg)' });
        });
    }


    var createLinkElem = function(item) {

        var top = (item.top / font_size).toFixed(6);
        var left = (item.left / font_size).toFixed(6);
        var height = (item.height / font_size).toFixed(6);
        var width = (item.width / font_size).toFixed(6);
        var id = new Date().getTime();
        if(is_pc){
            top = parseInt(top);
            left = parseInt(left);
            height = parseInt(height);
            width = parseInt(width);
            id = parseInt(id);
            var s = "";
            if($("#J_blank_forward").prop("checked")){
                s = "target='_blank'";
            }
            return "<a " + s + " class='r-link-block J_link" + id + "' data-id=" + id + " style='display:block;transform:rotate(" + item.rotate + "deg);position:absolute;left:" + left + "px;top:" + top + "px;width:" + width + "px;height:" + height + "px;z-index:2;border-radius:" + item.borderRadius + "' href='" + item.link + "'></a>";
        } else {

            return "<a class='r-link-block J_link" + id + "' data-id=" + id + " style='display:block;transform:rotate(" + item.rotate + "deg);position:absolute;left:" + left + "rem;top:" + top + "rem;width:" + width + "rem;height:" + height + "rem;z-index:2;border-radius:" + item.borderRadius + "' href='" + item.link + "'></a>";
        }
        
    }

    var appendLinkElem = function(item) {
        $(".J_banner_link_code").append(createLinkElem(item));
        createCodeStr();
    }

    var removeLink = function() {
        $(document).on("click", ".J_banner_link_code .r-link-block", function(e) {
            e.stopPropagation();
            e.preventDefault();
            var id = $(this).data("id");
            $(".J_link" + id).remove();
            createCodeStr();
            return false;
        });
    }


    var createCodeStr = function() {
        if($("#J_code .r-link-block").length == 0){
        	$("#J_copy_code").attr("data-clipboard-text", "");
		}else{
			var codeStr = $("#J_code").html();
			$("#J_copy_code").attr("data-clipboard-text", codeStr);
		}
        

    }

    var clear = function() {
        $(".r-link-block").remove();
        $("#J_copy_code").attr("data-clipboard-text", "");
    }

    var stopScroll = function() {
        // $(".J_stop_scroll").bind("touchmove", function(e) {
            // e.preventDefault();
        // });
    }

    var setApp = function() {
        $(".J_app").click(function() {
            $("#J_app_list").addClass("leave");
        });

        $(".J_close").click(function() {
            $(".J_article").removeClass('enter').addClass("leave");
        });

        $(".J_read").click(function() {
            $(".J_article").removeClass("leave").addClass('enter');
        });

        $(".J_close_tool").on("click",function(){
            $(".J_tool_wrap").removeClass('enter').addClass("leave");
            $(".J_tool_panpel_btn").removeClass('enter').addClass("leave");
        });

        $(".J_tool_panpel_btn").on("click",function(){
            $(".J_tool_wrap").removeClass('leave').addClass("enter");
            $(".J_tool_panpel_btn").removeClass('leave').addClass("enter");
        });


    }

    var msgShow = function(msg){

    	var $layerDom = $('<div class="msg-content J_msg_content"><p class="J_msg msg">'+msg+'</p> </div>');
    	$("body").append($layerDom);
    	setTimeout(function(){
    		$layerDom.addClass("enter");
    	},10);
   		setTimeout(function(){
   			$layerDom.removeClass("enter");
   			setTimeout(function(){
   				$layerDom.remove();
   			},800)
   		},2000);
    }

    var resizeCb = function(){
        if($(".J_pc").length == 0){
            $(window).on("resize",refreshFontSize);
            function refreshFontSize(){
                setTimeout(function(){
                    font_size = parseFloat($("html").css("fontSize")); 
                },400);
            }
        }
        
    }

    var eventBind = function(){
    	$("#J_copy_code").click(function(){
    		if($(this).attr("data-clipboard-text") == "" || $("#J_code .r-link-block").length == 0){
    			msgShow("至少添加一个跳转链接");
    		}
    	});
    }

    ;
    (function() {
        fixed_nav();
        range();
        setShap();
        checkImg();
        formValid(function() {
            linkItem.link = $("#J_link").val();
            console.log(font_size);
            appendLinkElem(linkItem);
        });
        stopScroll();
        removeLink();
        setApp();
        eventBind();
        resizeCb();
    })();
})