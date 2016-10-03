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

function deleteShopProducts()
{
    var deleteProductArr = [];
    $('.checkbox-row:checked').each(function(){ //iterate all listed checkbox items
        deleteProductArr.push($(this).val());
    });
    if(deleteProductArr.length>0){
        var tFalse = confirm("Are you sure ?");
        if(tFalse){
            $.ajax({
                type: "POST",
                url: "/product/delete-shop-product",
                data: { deleteProductArr:deleteProductArr },
                dataType: 'json',
                success: function(res){
                    window.location.reload(true);
                }
            });
        }
    }else{
        confirm("Please select atleast one item");
    }
   
}