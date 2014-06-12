/*******************************************************************************
* 
* Copyright (c) 2014 Proxima Centauri srl <info@proxima-centauri.it>.
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the GNU Public License v3.0
* which accompanies this distribution, and is available at
* http://www.gnu.org/licenses/gpl.html
*  
* Contributors:
*     Proxima Centauri srl <info@proxima-centauri.it> - initial API and implementation
*******************************************************************************/

$(document).ready(function(){
	
	//setup navigation link
	for (var n = 0; n < document.getElementsByClassName("hr_ef").length; n++) {
		console.log(document.getElementsByClassName("hr_ef")[n]);
		var id = document.getElementsByClassName("hr_ef")[n].getAttribute('id');
		$("#" + id).attr("href", context_path+"alerting/" + id);
	}
	
	var temp_email="";
	var temp_sms="";
	var unable_email="";
	var unable_sms="";
	var ifedit=false;
	
	var url_room = document.URL;
	url_room = url_room.split("/");
	var leng= url_room.length;
	console.log(leng);
	console.log(url_room);
	var roomId = url_room[leng-2];
	if(roomId=="edit"){
		console.log('is edit');
		roomId=url_room[leng-3];
		ifedit=true;
	}
	else{
		console.log('is not edit');
		roomId=url_room[leng-1];
	}
	console.log(roomId);
	
	if(roomId=="global_settings" || roomId=="alerting"){
		
		//global setting is the selected item
		$("#global_settings").addClass('active');
		
		console.log('i am here');
		//load general config
		load_config(function(data){
			console.log(data);
			// set correct value in visualization
			console.log(data.alert.temperature_tlower);
			console.log($("#min-alert-temp"));
			$("#min-alert-temp").text(data.alert.temperature_tlower);
			$("#max-alert-temp").text(data.alert.temperature_tupper);
			
			//get all sms and mails
			var tmp = data.alert.temperature_mail_to;
			var result_temp = splitMailFromNumber(tmp);
			$("#mail-alert-temp").text(result_temp[1]);
			$("#sms-alert-temp").text(result_temp[0]);
			
			if(data.alert.temperature_enable==true){
				$("#enable-alert-temp>img").attr('alt','true');
				$("#enable-alert-temp>img").attr('src',context_path+'images/active.png');
			}
			else{
				$("#enable-alert-temp>img").attr('alt','false');
				$("#enable-alert-temp>img").attr('src',context_path+'images/inactive.png');
			}
			
			
			var unable = data.alert.unable_mail_to;
			var result_unable = splitMailFromNumber(unable);
			$("#mail-alert-unable").text(result_unable[1]);
			$("#sms-alert-unable").text(result_unable[0]);
			
			if(data.alert.unable_enable==true){
				$("#enable-alert-unable>img").attr('alt','true');
				$("#enable-alert-unable>img").attr('src',context_path+'images/active.png');
			}
			else{
				$("#enable-alert-unable>img").attr('alt','false');
				$("#enable-alert-unable>img").attr('src',context_path+'images/inactive.png');
			}
			
		});
	}
	else{
		//load room by id
		load_room_by_id(roomId, function(data){
			console.log(data);
			
			var max="--"; 
			var min="--";
			
			if(ifedit){
				max=30;
				min=10;
			}
			
			if(data.alert.tlower!=null && data.alert.tlower!="" && data.alert.tlower!=-100){
				min=data.alert.tlower
			}
			if(data.alert.tupper!=null && data.alert.tupper!="" && data.alert.tupper!=100){
				max = data.alert.tupper;
			}
			//set value of view
			$("#min-alert-temp").text(min);
			$("#max-alert-temp").text(max);
			
			//set max and min also in edit
			$("#current_min-temp").val(min);
			$("#current_max-temp").val(max);
			
			
			
		});
	}
	
	//click on global settings button
	$("#global_settings").click(function(){
		//remove active class from room navigation
		$(".nav>li.active").removeClass('active');
		window.location = context_path+"alerting/global_settings";
	});
	
	
	
	//handle click on items
	$("li.config_sel").click(function(){
		$("#reset").attr("disabled",false);
		$("#edit-btn").attr("disabled",false);
		$(".config_sel").removeClass("active");
		$(this).addClass("active");
	});
	
	//handle click on edit
	$("#edit-btn").click(function(){
		//from active element get section to edit and room, if present
		var selected_config = $("li.config_sel.active").attr('id');
		var config = selected_config.split('-')[0];
		var room_id = selected_config.split('-')[1];
		var loc = context_path+"alerting/"+room_id+"/edit/"+config;
		console.log("selected config is ");
		console.log(selected_config);
		console.log(loc);
		window.location = loc;
	});
	
	//FIREFOX FIX
	$(".click-listener").click(function(){
		console.log('click on click listener');
		//serach the brother of current element
		var sib = $(this).siblings();
		console.log("sib is ");
		console.log(sib);
		//se sibling è  disabled=false, propago il click
		var disabled = sib.prop('disabled');
		
		if(!disabled){
			console.log('sib is enabled');
			sib.click();
		}
		else{
			console.log('sib is disabled');
			
		}
	});
	
	//edit operation
	//click on impostazion, alle input disabled became enabled
	$(".impostazioni").click(function(){
		console.log($(this));
		console.log('cliccato impostazioni');
		//disabilito tutto
		$("button[id^='minus']").attr("disabled",true);
		$("button[id^='plus']").attr("disabled",true);
		$("input:not(:radio)").attr("disabled",true);
		//abilito solo quello cliccato
		$(this).find("button").attr("disabled",false);
		$(this).find(".input-groupT").children("input").attr("disabled",false);
		$(this).find(".input-groupT").children("input").focus();
		
		//attivo submit
		$("button#submit").attr("disabled", false);
		
		return true;
	});
	
	$("#email").click(function(){
		console.log('email click');
		$(".impostazioni").find("button").attr("disabled",true);
		$("input:not(:radio)").attr("disabled",true);
		console.log($(this).find("input"));
		$(this).find("input").attr("disabled",false);
		$(this).find("input").focus();
		
		$("button#submit").attr("disabled", false);
	});
	
	$("#mobile").click(function(){
		console.log('mobile click');
		$(".impostazioni").find("button").attr("disabled",true);
		$("input:not(:radio)").attr("disabled",true);
		$(this).find("input").attr("disabled",false);
		$(this).find("input").focus();
		
		$("button#submit").attr("disabled", false);
	});
	
	$("div.radiobutton").click(function(){
		$("button#submit").attr("disabled", false);
	});
	
	
	
	//plus and minus button
	$("button[id^='plus']").click(function(){
		console.log('hai cliccato un plus');
		var current_val = parseInt($(this).parent().parent().find("input[type='text']").val());
		var new_val = current_val + 1 ;
		$(this).parent().parent().find("input[type='text']").val(new_val);
	});
	
	$("button[id^='minus']").click(function(){
		console.log('hai cliccato un minus');
		var current_val = parseInt($(this).parent().parent().find("input[type='text']").val());
		var new_val = current_val - 1 ;
		$(this).parent().parent().find("input[type='text']").val(new_val);
	});
	
	//submit button
	$("#submit").click(function(){
		console.log("submit on " + roomId);
		var data_to_send;
		if(roomId=="global_settings"){
			
			//temp or unable?
			//get last position of url
			
			var operation = document.URL;
			operation = operation.split('/');
			var length = operation.length;
			operation = operation[length-1];
			console.log(operation);
			
			load_config(function(data){
				
				if(operation=="temp"){
					if($("#current_min-temp").val()!=null && $("#current_max-temp").val() != null){
						data.alert.temperature_tlower = parseInt($("#current_min-temp").val());
						data.alert.temperature_tupper = parseInt($("#current_max-temp").val());
					}
					
					
					if($("#current_temp-mail").val()!=null && $("#current_temp-sms").val()!=null){
						//get mail and sms number
						var mail_sms = $("#current_temp-mail").val() + " " + $("#current_temp-sms").val();
						//replace first space
						mail_sms = mail_sms.substring(1, mail_sms.length-1);
						mail_sms =  mail_sms.replace(/\ /g,', ');
						
						data.alert.temperature_mail_to = mail_sms;
					}
					
					var boolean;
					if($("input[name='isActive']:checked").val() == "true"){
						boolean = true;
					}
					else{
						boolean = false;
					}
					console.log(boolean);
					
					data.alert.temperature_enable = boolean;
				}
				else {
					console.log($("#current_unable-mail").val());
					console.log($("#current_unable-sms").val());
					
					if($("#current_unable-mail").val()!=null && $("#current_unable-sms").val()!=null){
						console.log("sono dentro");
						//get mail and sms number
						var mail_sms = $("#current_unable-mail").val() + " " + $("#current_unable-sms").val();
						//replace first space
						mail_sms = mail_sms.substring(1, mail_sms.length-1);
						mail_sms =  mail_sms.replace(/\ /g,', ');
						
						data.alert.unable_mail_to = mail_sms;
					}
					
					
					var boolean;
					if($("input[name='isActive']:checked").val() == "true"){
						boolean = true;
					}
					else{
						boolean = false;
					}
					console.log(boolean);
					
					data.alert.unable_enable = boolean;
				}
				

				
				//send data
				edit_config(data, function(data){
					console.log('sent new config');
					window.location = context_path+"alerting";
				});
			});
			
		}
		else{
			//change room config
			//get current configiguration of room
			load_room_by_id(roomId, function(data){
				
				//get tlower and tupper
				if($("#current_min-temp").val()!=null && $("#current_max-temp").val()!=null){
					data.alert.tlower = parseInt($("#current_min-temp").val());
					data.alert.tupper = parseInt($("#current_max-temp").val());
				}
				
				edit_room_by_id(data, function(data){
					console.log('yeeee');
					window.location = context_path+"alerting/"+roomId;
				});
			})
		}
	});
	
	//reset button
	$("#reset").click(function(){
		//send -100 and +100 to room edit
		load_room_by_id(roomId, function(data){
			data.alert.tupper=100;
			data.alert.tlower=-100;
			
			edit_room_by_id(data, function(data){
				
				location.reload();
			});
		});
		
	});
	
	//cancel button
	$("#delete").click(function(){
		window.location = context_path+"alerting/"+roomId;
	});
	
	
	
});


function splitMailFromNumber(tmp){
	var sms="";
	var email="";
	var result = [];
	
	tmp = tmp.split(', ');
	console.log(tmp);
	console.log(tmp.length);
	for(var i = 0; i < tmp.length; i++){
		console.log(tmp[i][0]);
		if(tmp[i][0]=='+'){
			//it's a number
			sms = sms + " " + tmp[i];
		}
		else{
			email = email + " " + tmp[i];
		}
	}
	result[0] = sms;
	result[1] = email;
	console.log(sms);
	console.log(email);
	
	return result;
}
