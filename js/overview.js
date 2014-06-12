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
	
	var url_type = document.URL;
	url_type = url_type.split("/");
	var l= url_type.length;
	var page_number=0;
	
	var hide;
	var lista_len=$(".lista").length;
	
	if(page_number==0){
		$("#home-back").hide();
	}
	if(page_number==(lista_len-1)){
		$("#home-next").hide();
	}
	for(var l=lista_len;l>1;l--){
		hide=4*(l-1);
		$("#"+hide).hide();
	}
	
	$("#home-next").click(function(){
		$("#home-back").show();
		$("#"+(page_number*4)).hide();
		page_number++;
		$("#"+(page_number*4)).show();
		if(page_number==(lista_len-1)){
			$("#home-next").hide();
		}
	});
	$("#home-back").click(function(){
		$("#home-next").show();
		$("#"+(page_number*4)).hide();
		page_number--;
		$("#"+(page_number*4)).show();
		if(page_number==0){
			$("#home-back").hide();
		}
	});
	
	
	load_status(function(status){
		for(var n=0; n<status.length; n++){
 			 if(status[n].type=="OnOff"){
 				 if(status[n].value==true){
 					 console.log(status[n]);
 					 //è accesso
 					 $('#'+status[n].id+">div.sswitch" ).removeClass("sswitch-bckgnd");
 					 $('#'+status[n].id+">div.sswitch" ).children("#img-cont").animate({left:'91px'});
 				 }
 			 }
 		 }
	});
		
	//switch
		$(".sswitch").click(function(){
			console.log('click on switch')
			var device_id=$(this).parent().attr("id");
			var room_id = $(this).attr("id").split("_")[0];
			
			console.log(device_id);
			console.log(room_id);
			click_on_switch_room($(this), room_id);
		});
	});
