$(document).ready(function() {
 
  // Place JavaScript code here...

});

function deleteAttribute(id)
{
	$.ajax({
		type: "GET",
		url: "/attribute/delete/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".attrTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function make_sure_for_brand(id)
{
	$.ajax({
		type: "GET",
		url: "/removeBrand/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".brandTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function make_sure_for_color(id)
{
	$.ajax({
		type: "GET",
		url: "/removeColor/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".colorTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function make_sure_for_size(id)
{
	$.ajax({
		type: "GET",
		url: "/removeSize/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".sizeTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}


function deleteRow(row)
{
	var x = document.getElementById('POITable');
    var len = x.rows.length;
   	if(len == '2' )
   	{
   		alert('You can not delete all fields.');
   		return false;
   	}
   	else 
   	{
	    var i=row.parentNode.parentNode.rowIndex;
	    document.getElementById('POITable').deleteRow(i);
   	}
}


function add_more_size()
{
    //console.log( 'hi');
    var x = document.getElementById('POITable');
    var new_row = x.rows[1].cloneNode(true);
    var len = x.rows.length;
    new_row.cells[0].innerHTML = 'Size';
    
    var inp1 = new_row.cells[1].getElementsByTagName('input')[0];
    inp1.id += len;
    inp1.value = '';
    var inp2 = new_row.cells[2].getElementsByTagName('input')[0];
    inp2.id += len;
    inp2.value = '';
    x.appendChild( new_row );
}
