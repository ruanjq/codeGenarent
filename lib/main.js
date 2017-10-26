$(function() {

    var font_size = 37.5;
    var linkItem = {
        rotate: 0,
        top: 0,
        left: 0,
        width: 75,
        height: 75,
        borderRadius: 0,
        link: ""
    }

    var clipboard = new Clipboard('.J_copy_code');

    clipboard.on('success', function(e) {
        alert("代码复制成功!!!");
    });

    clipboard.on('error', function(e) {
        alert("代码复制失败");
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
            if (_val == val_src) {
                return;
            }
            if (_val != "" && (_val.match("http") != null || _val.match("https") != null)) {
                loadImg(_val);
            } else {
                $(".J_banner").hide();
                $('#draggable').hide();
                clear();
                $("#J_loading_txt").show().html("请输入正确图片地址!");
            }
        });


        function loadImg(src) {
            $("#J_loading_txt").hide();
            $("#J_loading_panel").show();
            $(".J_banner").hide();
            $('#draggable').hide();
            clear();
            var img = new Image(src);
            img.src = src;
            img.onload = function() {
                $(".J_banner").attr("src", src).show();
                $('#draggable').show();
                dragInit();
                dragResize();
                $("#J_loading_panel").hide();
            }
            img.onerror = function() {
                $("#J_loading_panel").hide();
                $("#J_loading_txt").show().html("图片加载失败!");
            }
        }
        loadImg(val_src);
    }

    var dragInit = function() {
        $('#draggable').julyuiDrag({
            isLimit: true,
            position: 'absolute',
            scroll: true,
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
        return "<a class='r-link-block J_link" + id + "' data-id=" + id + " style='display:block;transform:rotate(" + item.rotate + "deg);position:absolute;left:" + left + "rem;top:" + top + "rem;width:" + width + "rem;height:" + height + "rem;z-index:2;border-radius:" + item.borderRadius + "' href='" + item.link + "'></a>";
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
        var codeStr = $("#J_code").html();
        $("#J_copy_code").attr("data-clipboard-text", codeStr);

    }

    var clear = function() {
        $(".r-link-block").remove();
    }

    var stopScroll = function() {
        $(".J_stop_scroll").bind("touchmove", function(e) {
            e.preventDefault();
        });
    }

    var setApp = function() {
        $(".J_app").click(function() {
            font_size = $(this).data("size");
            $("#J_app_list").addClass("leave");
        });

        $(".J_close").click(function() {
            $(".J_article").removeClass('enter').addClass("leave");
        });

        $(".J_read").click(function() {
            $(".J_article").removeClass("leave").addClass('enter');
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
            appendLinkElem(linkItem);
        });
        stopScroll();
        removeLink();
        setApp();
    })();
})