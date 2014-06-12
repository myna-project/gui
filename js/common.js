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

function setup_url(base_url){
	url_map = base_url + "/maps";
	url_device = base_url + "/devices";
	url_status = base_url + "/status";
	url_config = base_url + "/config";
	url_logic = base_url + "/logics";
}

function setup_context_path(contex_path_){
	context_path = contex_path_;
}

function setup_graph_path(graph_path_){
	graph_path = graph_path_;
}

var maps;
var devices;
var room;
var logic;

function load_room(func) {
	$.get(url_map, function(data) {
		maps = data.maps;
		console.log("Load maps DONE");
		func();
	});
}

function load_room_by_id(roomid, func) {
	$.get(url_map+"/"+roomid, function(data) {
		console.log("Load room by id DONE");
		func(data);
	});
}

function edit_room_by_id(room_data, func){
	$.ajax({
		url: url_map,
		type: "POST",
		dataType : "json",
		data: JSON.stringify(room_data)
	}).done(function(data){
		func(data);
	}).fail(function(xhr, status, error){
		console.log('edit room error');
		console.log(xhr.responseJSON.error.message);
		errorMessage(xhr.responseJSON);
	});
}

function load_status(func) {
	$.get(url_status, function(data) {
		func(data.status);
	});
}

function load_logics(func) {
	$.get(url_logic, function(data) {
		func(data.logics);
	});
}

function load_logic_by_id(logic_id, func) {
	$.get(url_logic+"/"+logic_id, function(data) {
		func(data);
	});
}

function load_config(func){
	$.get(url_config, function(data){
		func(data.config);
	});
}

function edit_config(data_config, func){
	$.ajax({
		url: url_config,
		type: "POST",
		dataType : "json",
	  	data : JSON.stringify(data_config)
	}).done(function(data){
		func(data);
	}).fail(function(xhr, status, error){
		console.log('edit config error');
		console.log(xhr.responseJSON.error.message);
		errorMessage(xhr.responseJSON);
	});
}

function edit_logic_by_id(logic_id, data_t, func) {
	$.ajax({
		url: url_logic+"/"+logic_id,
		type : "PUT",
	  	dataType : "json",
	  	data : JSON.stringify(data_t)
	}).done(function(data){
		func(data);
	}).fail(function(xhr, status, error){
		console.log('edit logic error');
		console.log(xhr.responseJSON.error.message);
		errorMessage(xhr.responseJSON);
	});
}

function create_logic(data_t, func) {
	$.ajax({
		url: url_logic,
		type : "POST",
	  	dataType : "json",
	  	data : JSON.stringify(data_t)
	}).done(function(data){
		func(data);
	}).fail(function(xhr, status, error){
		console.log('create logic error');
		console.log(xhr.responseJSON);
		errorMessage(xhr.responseJSON);
	});
}

function enable_logic(logic_id, func){
	var fail = false;
	console.log('enabled logic ' + logic_id);
	$.post(url_logic+"/"+logic_id+"/commands/enable").fail(function(xhr, status, error){
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail=true;
		func(fail);
	});
}

function disable_logic(logic_id, func){
	var fail = false;
	console.log('disabled logic ' + logic_id);
	$.post(url_logic+"/"+logic_id+"/commands/disable").fail(function(xhr, status, error){
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail=true;
		func(fail);
	});
}
	
function switch_on(device_id, func){
	var fail = false;
	$.post(url_device+"/"+device_id+"/commands/on").fail(function(xhr, error, status){
		console.log('Switch on room error');
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail = true;
		func(fail);
	});
}

function switch_off(device_id, func){
	var fail = false;
	$.post(url_device+"/"+device_id+"/commands/off").done(function(data){
		console.log('done');
		func(fail);
	}).fail(function(xhr, error, status){
		console.log('switch off room error');
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail = true;
		func(fail);
	});
}

function warmup_room(room_id, func){
	console.log('warm up room');
	var fail = false;
	$.post(url_map+"/"+room_id+"/commands/warmup").done(function(data){
		
		func(fail);
	}).fail(function(xhr, error, status){
		console.log('Warm up room error');
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail = true;
		func(fail);
	});
}

function switchoff_room(room_id, func){
	var fail = false;
	$.post(url_map+"/"+room_id+"/commands/off").done(function(data){
		func(fail);
	}).fail(function(xhr, error, status){
		console.log('off room error');
		console.log(xhr);
		errorMessage(xhr.responseJSON);
		fail = true;
		func(fail);
	});
}

function click_on_switch_room(el, room_id){
	
	
	
	if(el.hasClass("sswitch-bckgnd")){
		
		warmup_room(room_id, function(fail){
			if(!fail){
				el.toggleClass("sswitch-bckgnd");
				el.children("#img-cont").animate({left:'91px'});
				
				$('h4#mode_'+room_id).text('Manual');
				after_click_on_switch(el, room_id);
			}
		})
	}else{
		switchoff_room(room_id, function(fail){
			if(!fail){
				el.toggleClass("sswitch-bckgnd");
				el.children("#img-cont").animate({ left:'0px'});
				$('h4#mode_'+room_id).text('Manual');
				after_click_on_switch(el, room_id);
			}
		})
	}
	
	
	
}

function after_click_on_switch(el, room_id){
	//disable all logic in any case
	$.ajax({
  	  type : "GET",
  	  dataType : "json",
  	  url : url_logic,
  	  async:false,
	  	}).done(function(data){
  		 data=data['logics'];
  		 for(var n=0; n<data.length; n++){
  			 if(data[n]["room"]==room_id){
  				 if(data[n]["enabled"]==true){
  					var log=data[n]["id"];
  					console.log("Deactive"+log);
  					disable_logic(log);
  				 }
  			 }
  		 }
  		 $("#mode").text('Manuale');
  	  }).fail(function(xhr, status, error) {
  		 errorMessage(xhr.responseJSON);
  		 console.log("Error disabling logic");
  		 console.log(log);
  	  });	
}

function errorMessage(responseJson){
	$("#alert_window").removeClass('hidden');
	$("#alert_window").removeClass('alert-success');
	$("#alert_window").addClass('alert-danger');
	$("#alert_window>span#message").html(responseJson.error.message);
}

function confirmMessage(message){
	$("#alert_window").removeClass('hidden');
	$("#alert_window").removeClass('alert-danger');
	$("#alert_window").addClass('alert-success');
	$("#alert_window>span#message").html(message);
}

$(function(){
    $("[data-hide]").on("click", function(){
        $("." + $(this).attr("data-hide")).addClass('hidden');
        /*
         * The snippet above will hide all elements with the class specified in data-hide,
         * i.e: data-hide="alert" will hide all elements with the alert property.
         *
         * Xeon06 provided an alternative solution:
         * $(this).closest("." + $(this).attr("data-hide")).hide();
         * Use this if are using multiple alerts with the same class since it will only find the closest element
         * 
         * (From jquery doc: For each element in the set, get the first element that matches the selector by
         * testing the element itself and traversing up through its ancestors in the DOM tree.)
        */
    });
});
