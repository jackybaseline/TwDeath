$(function(){
	var sidebar_out=false;
	var range_begin;
	var range_end;
	/*init*/
		
	/*
	$('#comment').click(function(){
		if(!sidebar_out)
		{
			sidebar_out=true;
			comment_open();
		}
		else{
			sidebar_out=false;
			comment_close();
		}
	});*/

	$('#comment_cancel').click(function(){
		$( "#dialog-form" ).dialog( "close" );
	});
	$('#want_comment').click(function(){
		$( "#dialog-form" ).dialog( "open" );
		$('#input_begin').val(range_begin);
		$('#input_end').val(range_end);
	});
	$('#positive').click(function(){
		$('#comment_list').html("");
		$('#middle').removeClass("active");
		$('#negative').removeClass("active");
		$('#positive').addClass("active");
		displayall(2);
	});
	$('#negative').click(function(){
		$('#comment_list').html("");
		$('#middle').removeClass("active");
		$('#negative').addClass("active");
		$('#positive').removeClass("active");
		displayall(0);
	});
	$('#middle').click(function(){
		$('#positive').removeClass("active");
		$('#negative').removeClass("active");
		$('#middle').addClass("active");
		$('#comment_list').html("");
		displayall(1);
	});

	$( "#dialog-form" ).dialog({
	      autoOpen: false,
	      height: 300,
	      width: 350,
	      modal: true,
	    });
	function getSelText() {
	  var txt = '';
	  if (window.getSelection) {
		txt = window.getSelection();
	  } else if (document.getSelection) {
		txt = document.getSelection();
	  } else if (document.selection) {
		txt = document.selection.createRange().text;
	  }
	   return txt;
	}
	function refresh(comment_index)
	{
		var sum=[0,0,0];
		for(i=0;i<comment.length;++i)
			if(!((range_begin<comment[i].begin&&range_end<comment[i].begin)||(comment[i].end<range_end&&comment[i].end<range_begin)))
				++sum[comment[i].kind];
		$('#positive a span').html(sum[2]);
		$('#middle a span').html(sum[1]);
		$('#negative a span').html(sum[0]);
		switch(parseInt(comment_index))
		{
			case 0:
				$('#middle').removeClass("active");
				$('#negative').addClass("active");
				$('#positive').removeClass("active");
				break;
			case 1:
				$('#middle').addClass("active");
				$('#negative').removeClass("active");
				$('#positive').removeClass("active");
				break;
			case 2:
				$('#middle').removeClass("active");
				$('#negative').removeClass("active");
				$('#positive').addClass("active");
			 	break;
			default:
				console.log("error~~~");
				break;
		}

	}
	function displayall(comment_index){
		for(i=0;i<comment.length;++i)
			if(!((range_begin<comment[i].begin&&range_end<comment[i].begin)||(comment[i].end<range_end&&comment[i].end<range_begin)))
			{
				if(comment[i].kind==comment_index)
				{
					var content=comment[i].content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					var name=comment[i].name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
					var string="<a href=\"#\" class=\"list-group-item\">"+content+"<div class=\"little_name\">"+name+"</div></a>";
					$('#comment_list').append(string);			
				}
			}	
	}
	var has_hover=false;
	$('#article').hover(function(){
		if(!has_hover)
		{
			$('#article_alert').html("<strong>選取想要評論的文字，<br/>可於左側評論</strong>");
			$('#article_alert').fadeIn(500,function(){
				has_hover=true;
			});
		}
	},function(){
		if(has_hover)
		{
			$('#article_alert').fadeOut(500,function(){
				has_hover=false;
			});
		}
	});
	$("#article").mouseup(
	function () {
		$('#article_alert').html("<strong>選取想要評論的文字，<br/>可於左側評論</strong>");
		$('#comment_list').html("");
		var t = getSelText().toString();
		var has_create=false;
		$("#selectedText").text(t);
		var re = new RegExp("\\s", "g");
		t=t.replace(re,"");
		//content=content.replace(re,"");
		range_begin=content.search(t);
		range_end=range_begin+t.length-1;
		if(content.indexOf(t,range_begin+1)!=-1)
		{
			console.log("Too many same string!");
			$('#article_alert').html("<strong>太多相同文字!<br/>請選取更大文字範圍!</strong>");
			sidebar_out=false;
			comment_close();
			return;
		}	
		if(!sidebar_out)
		{
			sidebar_out=true;
			comment_open();
		}
		refresh(1);
		displayall(1);
	}
	);
});

function comment_open(){
		$('#gohome').animate(
			{marginLeft:"255px"},700,function(){

			}
		);
		$('#sidebar').animate(
			{marginLeft:"0px",height:$(window).height()},700,function(){
			}
		);
}
function comment_close(){
		$('#gohome').animate(
			{marginLeft:"0px"},700,function(){

			}
		);
		$('#sidebar').animate(
			{marginLeft:"-320px",height:"40px"},700,function(){
			}
		);
}

function createPie(push,post,boo){
	var pieData;
	if(push)
		push=parseInt(push);
	if(post)
		post=parseInt(post);
	if(boo)
		boo=parseInt(boo);
	pieData = [
			{
				value: push,
				color:"#77b300",
				label : '正面',
				labelColor : 'white',
            	labelFontSize : '22'
			},
			{
				value : post,
				color : "#9933cc",
				label : '保留',
				labelColor : 'white',
            	labelFontSize : '22'
			},
			{
				value : boo,
				color : "#cc0000",
				label : '反面',
				labelColor : 'white',
            	labelFontSize : '22'
			}
		
		];
	var myPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
}
function colorfulArticle(){
      for(var i=0;i<content.length;++i)
      {
        if(articleComment[i][3]>3)
        	$('#word-'+i).attr('style', 'font-weight: '+900+' !important');
        else
        	$('#word-'+i).attr('style', 'font-weight: '+(articleComment[i][3]*300)+' !important');
        if(articleComment[i][0]>articleComment[i][2])
        {
        	$('#word-'+i).addClass("bad_comment");
	        if(articleComment[i][0]>7)
	        	$('#word-'+i).css("border-width","7px");
	    	else
	    		$('#word-'+i).css("border-width",articleComment[i][0]+"px");
        }
        else if(articleComment[i][0]<=articleComment[i][2])
        {
        	$('#word-'+i).addClass("good_comment");
	        if(articleComment[i][2]>7)
	        	$('#word-'+i).css("border-width","7px");
	    	else
	    		$('#word-'+i).css("border-width",articleComment[i][2]+"px");
        }
        else if(articleComment[i][1]>0)
        {
        	$('#word-'+i).addClass("same_comment");
	        if(articleComment[i][1]>7)
	        	$('#word-'+i).css("border-width","7px");
	    	else
	    		$('#word-'+i).css("border-width",articleComment[i][1]+"px");
        }
      }
}