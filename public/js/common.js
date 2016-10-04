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

// Delete shop product
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


function deleteUsersAndShop()
{
    var deleteUserArr = [];
    $('.user-checkbox-row:checked, .cust-checkbox-row:checked').each(function(){ //iterate all listed checkbox items
        deleteUserArr.push($(this).val());
    });
    if(deleteUserArr.length>0){
        var tFalse = confirm("Are you sure ?");
        if(tFalse){
            $.ajax({
                type: "POST",
                url: "/user/delete-users-shop",
                data: { deleteUserArr:deleteUserArr },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    window.location.reload(true);
                },
                error: function(data){
                    console.log(data);
                } 
            });
        }
    }else{
        confirm("Please select atleast one item");
    }
   
}