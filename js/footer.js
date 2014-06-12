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

		var hour_foot = moment().format('HH:mm');
		var day_foot = moment().format('DD');
		var month_foot = moment().format('MMMM');
		var year_foot = moment().format('YYYY');
		
		switch (month_foot) {
	    case 'January': 
	    	month_foot="Gennaio";
			break; 
	    case 'February': 
	    	month_foot="Febbraio";
			break;
	    case 'March': 
	    	month_foot="Marzo";
			break;
	    case 'April': 
	    	month_foot="Aprile";
			break;
	    case 'May': 
	    	month_foot="Maggio";
			break;
	    case 'June': 
	    	month_foot="Giugno";
			break; 
	    case 'July': 
	    	month_foot="Luglio";
			break;
	    case 'August': 
	    	month_foot="Agosto";
			break;
	    case 'September': 
	    	month_foot="Settembre";
			break;
	    case 'October': 
	    	month_foot="Ottobre";
			break;
	    case 'November': 
	    	month_foot="Novembre";
			break;
	    case 'December': 
	    	month_foot="Dicembre";
			break;
	    };
		
	    var day_total=day_foot+" "+month_foot+" "+year_foot;
		$('#ora_foot').text(hour_foot);
		$('#data').text(day_total);
		 
		setInterval(function(){
			var now_foot = moment().format('HH:mm');
			$('#ora_foot').text(now_foot);
			}, 30000);   
	});
