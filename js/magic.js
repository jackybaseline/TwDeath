$(function(){
	/*first*/
	var data =[];
	var fulldata=[];
	var now_disease=-1;
	var now_year=0; 
	var now_year2=0; 
	var now_name;
	var interval=400;
   d3.json("json/twCounty2010.topo.json", function (error, data) {

    topo = topojson.feature(data, data.objects.layer1);
    prj = d3.geo.mercator().center([120.979531, 23.978567]).scale(5000);

    path = d3.geo.path().projection(prj);

    locks = d3.select("svg#map").selectAll("path").data(topo.features).enter()
    .append("path").attr("d", path).attr("fill","gray");

    locks2 = d3.select("svg#map_2").selectAll("path").data(topo.features).enter()
    .append("path").attr("d", path).attr("fill","gray");
    locks2.on("click",mouseclick);

   });



	d3.json("dierank.json", function (popData) { 
	  for(var i = 0, len = popData.length; i < len; i+=22)
	  {
	  	  var dataperyear =[];
	  	  for(j=0;j<22;++j)
	  	  	dataperyear[j]=new Dataperyear(popData[i+j].name,popData[i+j].place1,popData[i+j].value1,popData[i+j].place2,popData[i+j].value2,popData[i+j].place3,popData[i+j].value3);
	  	  data.push(dataperyear);
	  }
	});

	d3.json("fulldie.json", function (popData) { 

	  for(var i = 0, len = popData.length; i < len; i+=22)
	  {
	  		var fulldataperyear=[];
	  	  for(j=0;j<22;++j)
	  	  	fulldataperyear[j]=new FullDataperyear(popData[i+j]);
	  		fulldata.push(fulldataperyear);
	  }
	});
	var has_click=false;
   for(var d=0;d<15;++d)
   {
	   $('#disease_'+d).click(function(){
	   		if(!has_click)
		   	{
		   		has_click=true;
		   		for(var i=0;i<15;++i)
		   			$('#disease_'+i).removeClass("selected");
		   		$(this).addClass("selected");
		   		now_disease=$(this).attr('id').replace("disease_","");
				$('#moving').css("left","0px");
				for(y=0,real_y=0;y<22;++y)
				{
				  	renewmap(true,y);
				  	if(y!=0)
				  	{
						$( "#moving" ).animate({
						left: "+=40",
						}, interval, function() {
							now_year=++real_y;
							locks.on("mouseover",mouseover).on("mouseout",function(){
				   			d3.select("#tooltip1")
							.style("display","none");
				   			});
				   			if(real_y==21)
				   				has_click=false;
						});
					}
				}
			}
		});
	}
      //colorMap = d3.scale.linear().domain([0,5000000]).range(["#000","#f00"]);



	function mouseover(event)
	{
		var myElement = document.querySelector("#map");
	    var rect = myElement.getBoundingClientRect();  
		var tooltip_line_length = 20;
		var centroid;
		var party;
		var elected;
		var candidate;
		var name;
		d3.select(this)
			.each(function(d){
				centroid = path.centroid(d);
				name = d.properties.COUNTYNAME;
			});
		//var centroid = this.centroid();
		var x = d3.event.pageX;
		var y = d3.event.pageY;

		if(data[now_disease][now_year].rank[name])
		{	
			d3.select("#tooltip1")
				.style("display","block")
				.style("top",y+"px")
				.style("left",x-450+"px")
				.html(name+"死亡人口數（每十萬人口）:"+(data[now_disease][now_year].rank[name]*100000).toFixed(2));
		}
		else
		{
			d3.select("#tooltip1").html("");
		}
	}

	function renewmap(isdelay,year)
	{
		if(isdelay)
		{
	      for(var i = 0, len = topo.features.length; i < len; i+=1)
	      {
	      	  if(data[now_disease][year].rank[topo.features[i].properties.COUNTYNAME])
	          	topo.features[i].properties.value = true;
	          else
	          	topo.features[i].properties.value =false;
	      }
	      locks.transition().attr("fill",function(d){  
	      	if(d.properties.value)    
	        	return "#C96361";
	        else
	        	return "gray";
	        }).duration(interval).delay(interval*year); 
		}
		else
		{
	      for(var i = 0, len = topo.features.length; i < len; i+=1)
	      {
	      	  if(data[now_disease][year].rank[topo.features[i].properties.COUNTYNAME])
	          	topo.features[i].properties.value = true;
	          else
	          	topo.features[i].properties.value =false;
	      }
	      locks.transition().attr("fill",function(d){  
	      	if(d.properties.value)    
	        	return "#C96361";
	        else
	        	return "gray";
	        }).duration(500); 
		}
	}
	function set_play_onclick()
	{	
	   $('#turn_left').click(function(){
	   		if(--now_year>=0)
	   		{
	   			$( "#moving" ).css("left","-=40");
	   			renewmap(false,now_year);
				locks.on("mouseover",mouseover).on("mouseout",function(){
	       			d3.select("#tooltip1")
					.style("display","none");
	   			});   	
	   		}
	   		else
	   			now_year=0;
	   });
	   $('#turn_right').click(function(){

	   		if(++now_year<=21)
	   		{
	   			$( "#moving" ).css("left","+=40");
	   			renewmap(false,now_year);
				locks.on("mouseover",mouseover).on("mouseout",function(){
	       			d3.select("#tooltip1")
					.style("display","none");
	   			});   		
	   		}else
	   			now_year=21;
	   });
	   $('#turn_left2').click(function(){
	   		if(--now_year2>=0)
	   		{
	   			$( "#moving2" ).css("left","-=40");
	   			for(var i=0;i<15;++i)
	   			{
	   				renewmap2(false,now_year2,i,now_name);
	   				svg=d3.select('#svg_'+i);
					svg.property({'COUNTYNAME':now_name,'kind':i,'year':now_year2});
					svg.on("mouseover",mouseover2).on("mouseout",function(){
						d3.select("#tooltip1")
					.style("display","none");
						});
	   			}
	   		}
	   		else
	   			now_year2=0;
	   });
	   $('#turn_right2').click(function(){

	   		if(++now_year2<=21)
	   		{
	   			$( "#moving2" ).css("left","+=40");
	   			for(var i=0;i<15;++i)
	   			{
	   				renewmap2(false,now_year2,i,now_name); 		
	   				svg=d3.select('#svg_'+i);
					svg.property({'COUNTYNAME':now_name,'kind':i,'year':now_year2});
					svg.on("mouseover",mouseover2).on("mouseout",function(){
						d3.select("#tooltip1")
					.style("display","none");
						});
	   			}
	   		}else
	   			now_year2=21;
	   });
	}
	function set_player(svg){
		var con_width = 400;
		var width = 12;
		var height = 25;
		var src = "play_bar.png";
		var img = document.createElement("img");
		img.id='moving';
		img.src = src;
		img.width = width;
		img.height = height;
		img.style.position = "absolute";
		document.querySelector("#bar_container").appendChild(img);
		var img = document.createElement("img");
		img.id='moving2';
		img.src = src;
		img.width = width;
		img.height = height;
		img.style.position = "absolute";
		document.querySelector("#bar_container2").appendChild(img);
		set_play_onclick(svg,img);
	}

    set_player(d3.select("#map"));
    /*first end*/

    var has_click2=false;
	function mouseclick(event)
	{
		if(!has_click2)
		{
			has_click2=true;
			var myElement = document.querySelector("#map_2");
		    var rect = myElement.getBoundingClientRect();  
			var tooltip_line_length = 20;
			var centroid;
			var party;
			var elected;
			var candidate;
			var name;
			d3.select(this)
				.each(function(d){
					centroid = path.centroid(d);
					name = d.properties.COUNTYNAME;
				});
			d3.selectAll("path").attr("fill","gray");
			d3.select(this).transition().attr("fill","#C96361");
			d3.select("#circle_block").selectAll("svg").remove();
			$( "#moving2" ).css("left","0px");
			now_year2=21;
			now_name=name;
			for(var k=0;k<15;++k)
			{
				for(var y=0,year=0;y<22;++y)
				{
					if(k==0&&y!=0)
					{
						$( "#moving2" ).animate({
						left: "+=40",
						}, interval, function() {
							++year;
							for(var kind=0;kind<15;++kind){
								svg=d3.select('#svg_'+kind);
								svg.property({'COUNTYNAME':name,'kind':kind,'year':year});
								svg.on("mouseover",mouseover2).on("mouseout",function(){
									d3.select("#tooltip1")
								.style("display","none");
									});
								if(kind==14&&year==21)
									has_click2=false;
							}
						});
					}
					if(fulldata[k][y].rank[name])
					{
						if(y==0||((name=="連江縣"||name=="金門縣")&&y==3))
						{
							var radius=fulldata[k][y].rank[name]*250000;
							var svg=d3.select("#circle_block").append("svg").attr("width",radius*(100+Math.random()*10)/100).attr("height",radius*(100+Math.random()*10)/100);
							svg.attr("id",'svg_'+k);
							var circles = svg.append("circle")
											.attr("cx",radius/2)
							                .attr("cy", radius/2)
							                .attr("r", radius/2)
							                .style("fill",getColor(k));
							var text=svg.append("text").attr("x",radius/4).attr("y",radius/2).attr("fill","black")
											.text(fulldata[k][y].name).style("font-size",radius/10);
							svg.property({'COUNTYNAME':name,'kind':k,'year':y});
							svg.on("mouseover",mouseover2).on("mouseout",function(){
			       			d3.select("#tooltip1")
							.style("display","none");
			       			});
						}
						else
					      renewmap2(true,y,k,name);
					}
				}
			}
		}
	}

	function mouseover2(e)
	{
		var x = d3.event.pageX;
		var y = d3.event.pageY;
		d3.select("#tooltip1")
			.style("display","block")
			.style("top",y+"px")
			.style("left",x-450+"px")
			.html(fulldata[this.kind][this.year].name+"死亡人口數（每十萬人口）: "+(fulldata[this.kind][this.year].rank[this.COUNTYNAME]*100000).toFixed(2));
	}
	function renewmap2(isdelay,year,kind,name)
	{
		$('#where').html(name);
		if(isdelay)
		{
			var radius=fulldata[kind][year].rank[name]*250000;
			svg=d3.select('#svg_'+kind);
			svg.transition().attr("width",radius*(100+Math.random()*10)/100).attr("height",radius*(100+Math.random()*10)/100)
					.duration(interval).delay(interval*year);
			svg.select('circle').transition()
				.attr("cx",radius/2)
			    .attr("cy", radius/2)
			    .attr("r", radius/2)
			    .duration(interval).delay(interval*year); 
			svg.select('text').transition().attr("x",radius/4).attr("y",radius/2).style("font-size",radius/10).duration(interval).delay(interval*year);			
		}
		else
		{
			var radius=fulldata[kind][year].rank[name]*250000;
			svg=d3.select('#svg_'+kind);
			svg.transition().attr("width",radius*(100+Math.random()*10)/100).attr("height",radius*(100+Math.random()*10)/100)
					.duration(interval);
			svg.select('circle').transition()
				.attr("cx",radius/2)
			    .attr("cy", radius/2)
			    .attr("r", radius/2)
			    .duration(interval); 
			svg.select('text').transition().attr("x",radius/4).attr("y",radius/2).style("font-size",radius/10).duration(interval);
		}
	}
});
function Dataperyear(name,p1,v1,p2,v2,p3,v3)
{
	this.name=name;
	this.rank=new Array();
	this.rank[p1]=v1;
	this.rank[p2]=v2;
	this.rank[p3]=v3;
}

function FullDataperyear(popData)
{
	this.name=popData["name"];
	this.rank=new Array();
	for(var t=1;t<=22;++t)
		if(popData["v"+t]!=null)
			this.rank[popData["p"+t]]=popData["v"+t];
}
function getColor(kind)
{
	switch(kind)
	{
		case 0:
			return "#c96361";
			break;
		case 1:
			return "#c0986F";
			break;
		case 2:
			return "#720D2B";
			break;
		case 3:
			return"#6C4F3F";
			break;
		case 4:
			return"#F3E9DF";
			break;
		case 5:
			return"#CCCCCC";
			break;	
		case 6:
			return"#404040";
			break;	
		case 7:
			return"#D6D9C1";
			break;	
		case 8:
			return"#B8BF80";
			break;	
		case 9:
			return"#EFF288";
			break;	
		case 10:
			return"#8EADC0";
			break;	
		case 11:
			return"#C3BBB9";
			break;	
		case 12:
			return"#DBDCC3";
			break;	
		case 13:
			return"#6B6C70";
			break;			
	}
}