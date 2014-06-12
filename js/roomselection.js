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
		$("#" + id).attr("href", context_path+"room_selection/" + id);			
	}
	
	
	// ROOM DETAILS
	var original_temp = $("#current_temp").val();
	var color_bkgrd=$(".sswitch").css("background");
	var c=0;
	
	var active = $(".li_opt.active>a.option").attr("id");
	if(active!="manuale"){
		$(".sswitch").addClass("sswitch-dis-bckgnd");
		if($(".sswitch").hasClass("sswitch-bckgnd")){
			$(".sswitch").removeClass("sswitch-bckgnd");
			c=1;
		}
	}
	
	var device_id=$(".sswitch").attr("id");
	
	load_status(function(status){
		for(var n=0; n<status.length; n++){
 			 if(status[n].id==device_id){
 				 if(status[n].value==true){
 					 
 					$('#'+device_id).removeClass("sswitch-bckgnd");
					$('#'+device_id).children("#img-cont").animate({left:'91px'});
 					
 					$('#reset').attr("disabled","true");
 					$('#confirm').attr("disabled","true");
 				 }
 			 }
 		 }
	});
	
	//non devo fare il comando, devo solo cambiare lo sfondo
	//switch
	$(".sswitch").click(function(){
		var device_id=$(this).attr('id');
		$(this).toggleClass("sswitch-bckgnd");
		
		if($(this).hasClass("sswitch-bckgnd")){
			$(this).children("#img-cont").animate({ left:'0px'});
		}else{
			$(this).children("#img-cont").animate({left:'91px'});
		}

	});
	
	
	//quando clicco una checkbox, devo disabilitare tutte le altre


	$(".li_opt").click(function(){
	
		$(".li_opt").removeClass("active");
		$(this).addClass("active");
		
		var opt = $(".li_opt.active>a.option").attr("id");
	
		$("#reset").attr("disabled",false);
		$("#confirm").attr("disabled",false);
		

		switch(opt){
		case "manuale":
			//devo abilitare i bottoni modifica e rimuovi
			$("#minus_button").prop('disabled', true);
			$("#plus_button").prop('disabled', true);
			$("#ora").prop('disabled', true);
			$("#current_temp").prop('disabled',true);
			$("#unit").css("background","#EEE");
			$("#unit").css("color","#333");
			$(".sswitch").removeClass("sswitch-dis-bckgnd");
			if(c==1){
				$(".sswitch").addClass("sswitch-bckgnd");
				c=0;
			}
			break;
		case "automatica":
			$("#minus_button").prop('disabled', false);
			$("#plus_button").prop('disabled', false);
			$("#ora").prop('disabled', true);
			$("#current_temp").prop('disabled',false);
			$("#unit").css("background","#009f95");
			$("#unit").css("color","white");
			$(".sswitch").addClass("sswitch-dis-bckgnd");
			if($(".sswitch").hasClass("sswitch-bckgnd")){
				$(".sswitch").removeClass("sswitch-bckgnd");
				c=1;
			}
			break;
		case "oraria":
			$("#minus_button").prop('disabled', true);
			$("#plus_button").prop('disabled', true);
			$("#ora").prop('disabled', false);
			$("#current_temp").prop('disabled',true);
			$("#unit").css("background","#EEE");
			$("#unit").css("color","#333");
			$(".sswitch").removeClass("sswitch-bckgnd");
			$(".sswitch").addClass("sswitch-dis-bckgnd");
			if($(".sswitch").hasClass("sswitch-bckgnd")){
				$(".sswitch").removeClass("sswitch-bckgnd");
				c=1;
			}
			break;
		}
	});
	
	//automatica
	$("#plus_button").click(function(){
		$("#current_temp").val( parseInt($("#current_temp").val())+1 );
	});
	
	$("#minus_button").click(function(){
		$("#current_temp").val( parseInt($("#current_temp").val())-1 );
	});
	
	$("#confirm").click(function(){
		var room=$(".row_details").attr("id");
		var opt = $(".li_opt.active>a.option").attr("id");
		switch(opt){
		case "manuale":
			var switch_id=$(".sswitch").attr("id");
			if($(".sswitch").hasClass("sswitch-bckgnd")){
				switchoff_room(room, function(fail){
					if(!fail){
						//chiamata per disattivare tutte le programmazioni di una stanza
						$.ajax({
						  	  type : "GET",
						  	  dataType : "json",
						  	  url : url_logic,
						  	  async:false,
						  	  }).done(function(data){
						  		 data=data['logics'];
						  		 for(var n=0; n<data.length; n++){
						  			 if(data[n]["room"]==room){
						  				 if(data[n]["enabled"]==true){
						  					var log=data[n]["id"];
						  					console.log("Deactive"+log);
							  				 $.ajax({
							  					 type : "POST",
							  					 dataType : "json",
							  					 url : url_logic+"/"+log+"/commands/disable"
							  				 	});
						  				 }
						  			 }
						  		 }
						  		alert("Impostazioni aggiornate");
						  	  }).fail(function(xhr, status, error) {
						  		 console.log("Error, sending the vote");
						  		 console.log(xhr);
						  	  });
					}			
				});
			}else{
				warmup_room(room,function(fail){
					if(!fail){
						//chiamata per disattivare tutte le programmazioni di una stanza
						$.ajax({
						  	  type : "GET",
						  	  dataType : "json",
						  	  url : url_logic,
						  	  async:false,
						  	  }).done(function(data){ 
						  		 data=data['logics'];
						  		 
						  		 for(var n=0; n<data.length; n++){
						  			 if(data[n]["room"]==room){
						  				 if(data[n]["enabled"]==true){
						  					var log=data[n]["id"];
							  				 $.ajax({
							  					 type : "POST",
							  					 dataType : "json",
							  					 url : url_logic+"/"+log+"/commands/disable"
							  				 	});
						  				 }
						  			 }
						  		 }
						  		alert("Impostazioni aggiornate");
						  	  }).fail(function(xhr, status, error) {
						  		 console.log("Error, sending the vote");
						  		 console.log(xhr);
						  	  });
					}
				});
			}
			
			break;
		case "automatica":
			var logica_aut=false;
			//chiamata per disattivare tutte le programmazioni orarie di una stanza
			$.ajax({
			  	  type : "GET",
			  	  dataType : "json",
			  	  url : url_logic
			  	  }).done(function(data){
			  		 data=data['logics'];
			  		 
			  		 for(var n=0; n<data.length; n++){
			  			 if(data[n]["room"]==room){
			  				 if(data[n]["type"]=="TimeProgramming"){
			  					 if(data[n]["enabled"]==true){
				  					 var log=data[n]["id"];
				  					console.log("Deactive"+log);
				  					disable_logic(log);
			  					  }
			  				 }else if (data[n]["type"]=="ThresholdTemperature"){
			  					 
			  					 	logica_aut=true;
			  					 	//attivo la logica aut se esiste
				  					var log=data[n]["id"];
				  				
				  					var tm=$("#current_temp").val();
						  		
						  			
				  					if(tm!='ND'){
						  				tm=parseInt(tm);
					  					var data_t={"type": "ThresholdTemperature",
					  							"room":room,
					  							"temp":{"value":tm}, "enabled" : true};
					  					var d = JSON.stringify(data_t);
					  					
					  					
					  					$.ajax({
					  					  	  type : "PUT",
					  					  	  dataType : "json",
					  					  	  url : url_logic+"/"+log,
					  					  	  data : JSON.stringify(data_t),
					  					  	  async: false
					  					  	 }).done(function(data) {
					  					  		 //enable logic
							  					  	$.ajax({
								  						 type : "POST",
								  						 dataType : "json",
								  						 url : url_logic+"/"+log+"/commands/enable"
								  					 	}).done(function(data){
								  					 		console.log('success enable logic');
								  					 		console.log(data);
								  					 	});
					  					  		
							  					  alert("Impostazioni aggiornate");
					  					  	 }).fail(function(xhr, status, error) {
					  					  		 console.log(xhr);
					  					  		 console.log("Error, sending the vote");
					  					  		 errorMessage(xhr.responseJSON);
					  					  		 location.reload();
					  					  	 });
					  					
					  				
						  			}
				  				 }
			  			 }
			  		 }
			  	
			  		 //se non esiste logica automatica, devo aggiungerla
			  		if(!logica_aut){
			  			var tm=$("#current_temp").val();
			  			
			  			//controllo che tm sia != da 'nd'
			  			
			  			if(tm!='ND'){
			  				tm=parseInt(tm);
		  					var data_t={"type": "ThresholdTemperature",
		  							"room":room,
		  							"temp":{"value":tm}, "enabled":"true"};
		  					
		  					$.ajax({
		  					  	  type : "POST",
		  					  	  dataType : "json",
		  					  	  url : url_logic,
		  					  	  data : JSON.stringify(data_t)
		  					  	 }).done(function(data_t) {
		  					  		var id = data_t.id;
		  					  		enable_logic(id);
		  					  		alert("Impostazioni aggiornate");
		  					  		location.reload();
		  					  	 }).fail(function(xhr, status, error) {
		  					  		errorMessage(xhr.responseJSON);
		  					  		
		  					  	 });
			  			}
			  			else{
			  				alert('Nessuna temperatura settata');
			  				location.reload();
			  			}
			  			
	  					
			  		}
			  		
			  		
			  	  }).fail(function() {
			  		 console.log("Error");
			  	  });
			break;
		case "oraria":
			var logic_ora=false;
			var fail=false;
			//chiamata per disattivare tutte le programmazioni automatiche di una stanza
			$.ajax({
			  	  type : "GET",
			  	  dataType : "json",
			  	  url : url_logic,
			  	  async:false
			  	  }).done(function(data){
			  		 data=data['logics'];
			  		 for(var n=0; n<data.length; n++){
			  			
			  			 if(data[n]["room"]==room){
			  	
			  				 if(data[n]["type"]=="ThresholdTemperature"){
			  					 if(data[n]["enabled"]==true){
			  						
 		  						 //disattivo le logiche automatiche attive
				  					var log=data[n]["id"];
				  					disable_logic(log, function(f){
				  						
				  					});
			  					  }
			  				 }else if(data[n]["type"]=="TimeProgramming"){
			  					 
			  					 	logic_ora=true;
			  					 	//attive la logica oraria ... e se non esistono?
				  					var log=data[n]["id"];
				  					enable_logic(log, function(f){
				  					
				  					});
				  				 }
			  			 }
			  			
			  		 }
			  		 
			  		 
			  		 if(!logic_ora){
			  			 alert('Logica orararia non esistente!');
			  			 //devo rimettere attivo la modalità precedente
			  			 location.reload();
			  			
			  		 }
			  		 else{
			  			// location.reload();
			  		 }
			  		
			  		 
			  	  }).fail(function(xhr, status, error) {
			  		  console.log(xhr);
			  		  console.log("Error, sending the vote");
			  	  });
			break;
		}
		$("#reset").attr("disabled",true);
		$("#confirm").attr("disabled",true);
	});
	
	$("#reset").click(function(){
		alert('Impostazioni resettate');
		location.reload();
	});
	
});
