/*******************************************************************************
* 
*  Copyright (c) 2014 Proxima Centauri srl <info@proxima-centauri.it>.
*  All rights reserved. This program and the accompanying materials
*  are made available under the terms of the GNU Public License v3.0
*  which accompanies this distribution, and is available at
*  http://www.gnu.org/licenses/gpl.html
*  
*  Contributors:
*      Proxima Centauri srl <info@proxima-centauri.it> - initial API and implementation
* 
*******************************************************************************/
$(document).ready(function(){
	
	//get now
	var now = moment().unix();
	
	
	//get yesterday
	var last_data = moment().subtract('days', 1).unix();
	
	
	var stanza_selezionata=$(".active>a.hr_ef>div").attr('id');
	var drain;
	
	
	load_room(function(){
		for(var n=0; n<maps.length; n++){
			if(maps[n].name == stanza_selezionata){
				for(var d=0; d<maps[n].devices.length; d++){
 					 var split = maps[n].devices[d].split("_");
 					 var len = split.length;
 					 if(split[len-1]=="T"){
 						 drain = maps[n].devices[d];
 					 }
 				 }
			}
		}
		var url_grafico=graph_path+last_data+"/"+now+"/"+drain;
		
 	   	$('.grafico').attr("src",url_grafico);
	});
	
	$('#last_day').css('background','#009f95');
	$('#last_day').css('color','white');
	
	$("#last_day").click(function(){		
		//get yesterday
		var last_data = moment().subtract('days', 1).unix();
		
		url_grafico=graph_path+last_data+"/"+now+"/"+drain;	   		
	   	$('.grafico').attr("src",url_grafico);
	   	
	   	$('.graph_btn').css('background','white');
	   	$('.graph_btn').css('color','black');
	   	$('#last_day').css('background','#009f95');
	   	$('#last_day').css('color','white');
	});
	
	$("#last_week").click(function(){
		var last_data = moment().subtract('days', 7).unix();
		
		
		url_grafico=graph_path+last_data+"/"+now+"/"+drain;	   		
	   	$('.grafico').attr("src",url_grafico);
	   	
	   	$('.graph_btn').css('background','white');
	   	$('.graph_btn').css('color','black');
	   	$('#last_week').css('background','#009f95');
	   	$('#last_week').css('color','white');
	});

	$("#last_month").click(function(){
		var last_data = moment().subtract('month', 1).unix();
		
		url_grafico=graph_path+last_data+"/"+now+"/"+drain;	   		
	   	$('.grafico').attr("src",url_grafico);
	   	
	   	$('.graph_btn').css('background','white');
	   	$('.graph_btn').css('color','black');
	   	$('#last_month').css('background','#009f95');
	   	$('#last_month').css('color','white');
	});
	
	$("#last_year").click(function(){
		
		var last_data = moment().subtract('year', 1).unix();
		
		url_grafico=graph_path+last_data+"/"+now+"/"+drain;
	   	$('.grafico').attr("src",url_grafico);
	   	
	   	$('.graph_btn').css('background','white');
	   	$('.graph_btn').css('color','black');
	   	$('#last_year').css('background','#009f95');
	   	$('#last_year').css('color','white');
	});

});
