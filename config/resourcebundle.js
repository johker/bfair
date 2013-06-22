/**
 * Resource Bundles
 */
module.exports = {
    en: {      
      title: {
      	  login: "Be Fair: Login"
        , overview: "Be Fair: Terminal Overview"
        , account: "Be Fair: Account Settings"
        , data: "Be Fair: Data Export"
        , markets: "Be Fair: Market Monitor"
      },
      validation: {
       	errtitle: "Your request contains errors:"
       	, novalidid: "Invalid event ID."
		, novaliddate: "Invalid date."     
		, novalidtimerange: "Invalid time range: End date is smaller than start date."  	   
      },
      messages: {
      	logs: {
      		title: "Operation executed successfully."
      		, confirmation: "Number of removed log entries: "
      	}
      },
      label: {
      	eventId : "Event ID"
      	, startDate : "Start Date"
      	, endDate : "End Date" 
      }      
    }  
}