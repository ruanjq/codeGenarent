$(function(){var t=37.5,e={rotate:0,top:0,left:0,width:75,height:75,borderRadius:0,link:""},n=new Clipboard(".J_copy_code");n.on("success",function(t){alert("代码复制成功!!!")}),n.on("error",function(t){alert("代码复制失败")});var o=function(t){$("#J_add_link").click(function(){var e=!0;""==$("#J_img_src").val()?(e=!1,$("#J_img_src").addClass("error")):(e=!0,$("#J_img_src").removeClass("error")),""==$("#J_link").val()?(e=!1,$("#J_link").addClass("error")):(e=!0,$("#J_link").removeClass("error")),e&&"function"==typeof t&&t()}),$("#J_img_src").blur(function(){""==$(this).val()?$(this).addClass("error"):$(this).removeClass("error")}),$("#J_link").blur(function(){""==$(this).val()?$(this).addClass("error"):$(this).removeClass("error")})},a=function(){function t(t){$("#J_loading_txt").hide(),$("#J_loading_panel").show(),$(".J_banner").hide(),$("#draggable").hide(),f();var e=new Image(t);e.src=t,e.onload=function(){$(".J_banner").attr("src",t).show(),$("#draggable").show(),r(),i(),$("#J_loading_panel").hide()},e.onerror=function(){$("#J_loading_panel").hide(),$("#J_loading_txt").show().html("图片加载失败!")}}var e=$("#J_img_src").val();$("#J_img_src").blur(function(){var n=$(this).val();n!=e&&(""==n||null==n.match("http")&&null==n.match("https")?($(".J_banner").hide(),$("#draggable").hide(),f(),$("#J_loading_txt").show().html("请输入正确图片地址!")):t(n))}),t(e)},r=function(){$("#draggable").julyuiDrag({isLimit:!0,position:"absolute",scroll:!0,onStop:function(t){$(this).attr("PosX",t.left).attr("PosY",t.top),e.left=t.left,e.top=t.top}})},i=function(){$("#draggable").julyuiDragResize({onStop:function(t){e.left=t.left,e.top=t.top,e.width=t.width,e.height=t.height}})},l=function(){$("input[name=shape]").on("change",function(){var t=$(this).val();e.borderRadius=1==t?0:"50%",$("#draggable").css({borderRadius:e.borderRadius})})},s=function(){$("#rangeRotate").on("change mousemove touchmove",function(){var t=$(this).val();$("#J_rotate").html("("+t+")"),e.rotate=t,$("#draggable").css({transform:"rotate("+t+"deg)"})}),$("#J_reset").click(function(){$("#J_rotate").html("(0)"),e.rotate=0,$("#rangeRotate").val(0),$("#draggable").css({transform:"rotate(0deg)"})})},c=function(e){var n=(e.top/t).toFixed(6),o=(e.left/t).toFixed(6),a=(e.height/t).toFixed(6),r=(e.width/t).toFixed(6),i=(new Date).getTime();return"<a class='r-link-block J_link"+i+"' data-id="+i+" style='display:block;transform:rotate("+e.rotate+"deg);position:absolute;left:"+o+"rem;top:"+n+"rem;width:"+r+"rem;height:"+a+"rem;z-index:2;border-radius:"+e.borderRadius+"' href='"+e.link+"'></a>"},d=function(t){$(".J_banner_link_code").append(c(t)),_()},u=function(){$(document).on("click",".J_banner_link_code .r-link-block",function(t){t.stopPropagation(),t.preventDefault();var e=$(this).data("id");return $(".J_link"+e).remove(),_(),!1})},_=function(){var t=$("#J_code").html();$("#J_copy_code").attr("data-clipboard-text",t)},f=function(){$(".r-link-block").remove()},h=function(){$(".J_stop_scroll").bind("touchmove",function(t){t.preventDefault()})},g=function(){$(".J_app").click(function(){t=$(this).data("size"),$("#J_app_list").addClass("leave")}),$(".J_close").click(function(){$(".J_article").removeClass("enter").addClass("leave")}),$(".J_read").click(function(){$(".J_article").removeClass("leave").addClass("enter")})};(function(){var t=document.getElementById("J_main_wrap");$(window).scroll(function(e){t.getBoundingClientRect().top<=-75?$("#J_form_panel").addClass("fixed-form-panel"):$("#J_form_panel").removeClass("fixed-form-panel")})})(),s(),l(),a(),o(function(){e.link=$("#J_link").val(),d(e)}),h(),u(),g()});