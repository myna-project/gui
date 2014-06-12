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
	
	// NAVIGATION 
	for (var n = 0; n < document.getElementsByClassName("hr_ef").length; n++) {
		var id = document.getElementsByClassName("hr_ef")[n].getAttribute('id');
		$("#" + id).attr("href", context_path+"timer/" + id);
	}
	
	
	var ifedit=false;
	var checked;
	var url_room = document.URL;
	url_room = url_room.split("/");
	var leng= url_room.length;
	var roomId = url_room[leng-2];
	if(roomId=="edit"){
		roomId=url_room[leng-3];
		ifedit=true;
		var log=url_room[leng-1];
	};
	
	//get rooms id, current selected opt
	var roomId = $('.roomnavigation li.active>a').attr('id');
	
	//vettore con le stanze aggiunte, così controllo se è già stata aggiunta
	var rooms = new Array();
	var n,logic,x;
	
	var logic_id;
	
	if(ifedit==true){
		logic_id = log.split('_')[0];
		var index = log.split('_')[1];
 		$.ajax({
		  	  type : "GET",
		  	  dataType : "json",
		  	  url : url_logic+"/"+logic_id
		  	 }).done(function(data){
		  		$("#ora-inizio>div>div.col-md-6>div.input-groupT>input#current_tempT").val(data.time[index].start.split(":")[0]);
		  		$("#minuti-inizio>div>div.col-md-6>div.input-groupT>input#current_tempT").val(data.time[index].start.split(":")[1]);
		  		$("#ora-fine>div>div.col-md-6>div.input-groupT>input#current_tempT").val(data.time[index].stop.split(":")[0]);
		 		$("#minuti-fine>div>div.col-md-6>div.input-groupT>input#current_tempT").val(data.time[index].stop.split(":")[1]);
		 		$("#temperatura>div.col-md-8>div.input-group>input#current_tempT").val(data.time[index].temp.value);
	  		 
		 		 for(var j = 0 ; j<data.time[index].days.length; j++){
	  				 var d = data.time[index].days[j];
	  				 $("div#"+d).addClass('day-selected');
	  			 }
		  		
		  	 });
	}else{
		
		//prendo la logica in questione
		
		if($(".logics").length>0){
			logic_id = $(".logics")[0].getAttribute("id").split('_')[0];
			
			//get logic by id
			load_logic_by_id(logic_id, function(data){
				
				for (var i = 0; i < data.time.length; i++){
					var start = data.time[i].start;
					var stop = data.time[i].stop;
					var row_id = logic_id+"_"+i;
					//ciclo sui giorni
					
					for( var j = 0 ; j <data.time[i].days.length; j++ ){
						var day = data.time[i].days[j];
						$("#"+row_id).children("div.col-md-5").children('div#'+day).css("background","#C4C4C4");
					}
					
				}
			});
		}
		else{
			console.log('non sono presenti logiche');
		}

		
	}
	
	$("#set-temp").val('20');
	
	$("input[type='radio']").change(function(){
		//devo abilitare i bottoni modifica e rimuovi
		$("#edit-btn").prop('disabled', false);
		$("#del-btn").prop('disabled', false);
	})
	
	//handle  crud button
	$("#add-btn").click(function(){
		var loc=context_path+"timer/"+roomId+"/add";
		window.location = loc; //url --> timer/ROOM?OPT  modifica gui.py per far funzionare tutto
		
	});
	
	$("#edit-btn").click(function(){
		var logic = $(".active>a.logics").attr("id");
		var loc=context_path+"timer/"+roomId+"/edit/"+logic;
		window.location = loc; //url --> timer/ROOM?OPT  modifica gui.py per far funzionare tutto
	});
	
	$("#del-btn").click(function(){
		window.location = context_path+"timer/delete?"+checked;
	});
	
	$(".timer_sel").click(function(){
		$("#delete").attr("disabled",false);
		$("#edit-btn").attr("disabled",false);
		$(".timer_sel").removeClass("active");
		$(this).addClass("active");
	});
	
	//handle timepicker
	$("#start-time").timepicker({
		showMeridian : false
	});
	$("#end-time").timepicker({
		showMeridian : false
	});
	
	//handle plus and minus temperature
	$("#temp-plus").click(function(){
		$("#set-temp").val( parseInt($("#set-temp").val())+1 );
	});
	
	$("#temp-minus").click(function(){
		$("#set-temp").val( parseInt($("#set-temp").val())-1 );
	});
	
	//handle submit form
	$("#submit").click(function(){
		
		//get all data
		var days = new Array();
		var time_array = new Array();
		var tmp, r=0;
		
		if(document.getElementsByClassName("day-selected").length==0){
			alert("Selezionare almeno un giorno");
			return;
		}
		for(var n=0; n<document.getElementsByClassName("day-selected").length; n++){
			days[r] = document.getElementsByClassName("day-selected")[n].getAttribute("id");
			r++;
		}
		
		var start = $("#ora-inizio>div>div.col-md-6>div>input").val() +":"+$("#minuti-inizio>div>div.col-md-6>div>input").val();
		var stop = $("#ora-fine>div>div.col-md-6>div>input").val() +":"+$("#minuti-fine>div>div.col-md-6>div>input").val();
		var temp = parseInt($("#temperatura>div.col-md-8>div>input").val());
		
		var data_t;
		var time_obj = {"start":start, "stop":stop, "days":days, "temp":{"value":temp, "unit":"C"}};
		
		if(typeof log == 'undefined'){
			
			logic_exist=false;
			
			//sto aggiugendo
			//get the logic id by requesting it
			$.ajax({
				url : url_logic+"?filterByRoom="+roomId,
				async:false
			}).done(function(data){
				//get timeprogramming logic id
				for(var i = 0 ; i < data.logics.length; i++){
					if(data.logics[i].type == "TimeProgramming"){
						logic_exists = true;
						var current_logic = data.logics[i].id;
						time_array = data.logics[i].time;
						time_array.push(time_obj);
						data_t={
								"type": "TimeProgramming",
								"room":roomId,
								"time": time_array
						};
						edit_logic_by_id(current_logic, data_t, function(data){
							confirmMessage('Logica aggiunta con successo');
							//redirect
							window.location = context_path+"timer/"+roomId;
						});
						
					}
				}
				
				if(!logic_exist){
					data_t={
							"type": "TimeProgramming",
							"room":roomId,
							"time": [time_obj]
					};
					create_logic(data_t, function(data){
						confirmMessage('Logica aggiunta con successo');
						//redirect
						window.location = context_path+"timer/"+roomId;
					});
				}
			
			});
		}
		else{
			//sto modificando
			var logic_id = log.split('_')[0];
			var index = log.split('_')[1];
			
			//get time obj of the current logic id
			load_logic_by_id(logic_id, function(data){
				time_array = data.time;
				//modifico la posizione index
				time_array[index] = time_obj;
				data_t={
						"type": "TimeProgramming",
						"room":roomId,
						"time": time_array
				};
				
				edit_logic_by_id(logic_id, data_t, function(data){
					confirmMessage('Logica aggiornata con successo');
					//redirect
					window.location = context_path+"timer/"+roomId;
				});
			});
			
		}
	});

	//cancella programma orario
	$("#delete").click(function(){
		var logic = $(".active>a.logics").attr("id");
		
		var logic_id = logic.split("_")[0];
		var index = logic.split("_")[1];
		
		load_logic_by_id(logic_id, function(data){
			time_array = data.time;
			//elimino la posizione index
			
			if(index!=0){
				time_array.splice(index, 1);
				
				data_t={
						"type": "TimeProgramming",
						"room":roomId,
						"time": time_array
				};
				
				edit_logic_by_id(logic_id, data_t, function(data){
					//redirect
					window.location = context_path+"timer/"+roomId;
				});
			}
			else {
				//significa che ho solo una logica, chiamo la delete
				$.ajax({
				  	  type : "DELETE",
				  	  dataType : "json",
				  	  url : url_logic+"/"+logic_id
				  	 }).done(function() {
				  		window.location = context_path+"timer/"+roomId;
				  	 }).fail(function() {
				  	  console.log("Delete error");
				  	 });
			}
			
			
		});
	});

	
	//salva il programma selezionato
	$("#lista_prog").click(function(){
		var tmp;
		for(var n=0 ; n<document.getElementsByTagName('input').length ; n++){
			tmp = document.getElementsByTagName('input')[n].value;
			if(($("input[value="+tmp+"]").is(":checked"))==true){
				checked=tmp;
			}
		}
	});
	
	function checkDay(day){
		switch(day){
			case "Monday":
				break;
			case "Tuesday":
				break;
			case "Wednesday":
				break;
			case "Thursday":
				break;
			case "Friday":
				break;
			case "Saturday":
				break;
			case "Sunday":
				break;
		}
			
	};
	
	$(".cont-big").click(function(){
		$("#submit").attr("disabled",false);
	});
	
	$("#reset").click(function(){
		window.location = context_path+"timer/"+roomId;
	});
	
	//FIREFOX FIX
	$(".click-listener").click(function(){
		//search the brother of current element
		var sib = $(this).siblings();
		//se sibling è  disabled=false, propago il click
		var disabled = sib.prop('disabled');
		
		if(!disabled){
			console.log('sib is enabled');
			sib.click();
		}
		else{
			console.log('sib is disabled');
			//sib.click();
		}
	});
	
	
	$(".impostazioni").click(function(){
		//disabilito tutto
		$(".impostazioni>div>div.col-md-3>button").attr("disabled",true);
		$(".impostazioni>div>div.col-md-6>div.input-groupT>input").attr("disabled",true);
		$("#temperatura>div>button").attr("disabled",true);
		$("#temperatura>div.col-md-8>div.input-group>input").attr("disabled",true);
		$(".input-group-addon").css("background","#EEE");
		$(".input-group-addon").css("color","#333");
		//abilito solo quello cliccato
		$(this).children().children(".col-md-3").children("button").attr("disabled",false);
		$(this).children().children(".col-md-6").children(".input-groupT").children("input").attr("disabled",false);
	});
	
	$("#temperatura").click(function(){
		$(".impostazioni>div>div>button").attr("disabled",true);
		$(".impostazioni>div>div.col-md-6>div.input-groupT>input").attr("disabled",true);
		$(this).children(".col-md-2").children("button").attr("disabled",false);
		$(this).children(".col-md-8").children(".input-group").children("input").attr("disabled",false);
		$(".input-group-addon").css("background","#009f95");
		$(".input-group-addon").css("color","white");
	});
	
	$(".dayT").click(function(){
		$(this).toggleClass("day-selected");
	});
	
	$(".min-hour").click(function(){
		var value=$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val();
		if(value==0)value=24;
		value--;
		$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val(value);
	});
	$(".plus-hour").click(function(){
		var value=$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val();
		if(value==23){value=0;}
		else{value++;}
		$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val(value);
	});
	$(".min-minute").click(function(){
		var value=$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val();
		
		switch(value){
		case "00":
			value="45";
		break;
		case "45":
			value="30";
		break;
		case "30":
			value="15";
		break;
		case "15":
			value="00";
		break;
		}
		$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val(value);
	});
	$(".plus-minute").click(function(){
		var value=$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val();
		switch(value){
		case "00":
			value="15";
		break;
		case "15":
			value="30";
		break;
		case "30":
			value="45";
		break;
		case "45":
			value="00";
		break;
		}
		$(this).parent().parent(".col-md-12").children(".col-md-6").children(".input-groupT").children("input").val(value);
	});
	
	$("#temperatura>div.col-md-2>button#minus_buttonT").click(function(){
		var value=$("#temperatura>div.col-md-8>div>input").val();
		value--;
		$("#temperatura>div.col-md-8>div>input").val(value);
	});
	
	$("#temperatura>div.col-md-2>button#plus_buttonT").click(function(){
		var value=$("#temperatura>div.col-md-8>div>input").val();
		value++;
		$("#temperatura>div.col-md-8>div>input").val(value);
	});
	
});
