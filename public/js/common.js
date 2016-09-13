$(document).ready(function() {
 
  // Place JavaScript code here...

});
//-- Delete Customer
function deleteCustomer(id)
{
	var tFalse = confirm("Are you sure ?");
	if(tFalse){
		window.location = '/customer/delete/'+id;
		// $.ajax({
		// 	type: "GET",
		// 	url: "/customer/delete/"+id,
		// 	async: false,
		// 	success: function(result)
		// 	{
		// 		if(result.status == 'success')
		// 		{
		// 			window.location = '/customer/list';
		// 		}  
		// 	},
		// 	cache: false,
		// 	contentType: false,
		// 	processData: false
		// });
	}
}

//-- Delete User
function deleteUser(id)
{
	var tFalse = confirm("Are you sure ?");
	if(tFalse){
		window.location = '/user/delete/'+id;
	}
}