$(document).ready(function() {

	  var selectedColors = $('.selectedColors').val();
	  if(selectedColors !== undefined)
	  {
	  	//alert(selectedColors);
	  }

});

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

function make_sure_for_product(id)
{
	$.ajax({
		type: "GET",
		url: "/removeproduct/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".productTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function make_sure_for_category(id)
{
	$.ajax({
		type: "GET",
		url: "/removecategory/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".categoryTr_"+id).remove();
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function make_sure_for_subcategory(id)
{
	$.ajax({
		type: "GET",
		url: "/removesubcategory/"+id,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{
				$(".subCategoryTr_"+id).remove();
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

function remove_row(id)
{
	$('#tableToModify tr#'+id).remove();
}



 function add_more_size() 
 {
	var row 	= document.getElementById("rowToClone"); // find row to copy
	var table 	= document.getElementById("tableToModify"); // find table to append to
	var rowCount = $('#tableToModify >tr').length
	var clone 	= row.cloneNode(true); // copy children too
	clone.id 	= rowCount+1; // change id or other attributes/contents

	table.appendChild(clone); // add new row to end of table

	$('#tableToModify >tr#'+clone.id+' >td >select').attr("id",clone.id);
	$('#tableToModify >tr#'+clone.id+' >td >.removeAttrRow').attr("id",clone.id);
}

function loadSelectedsubCategory(catId)
{
	if(catId == '' || catId == 0)
	{
		return false;
	}
	$.ajax({
		type: "GET",
		url: "/product/fetchselectedcategory/"+catId,
		async: false,
		success: function(result)
		{
			if(result.status == 'success')
			{	
				var optionArray = [];
				var selected = '';
				var selectedSubCat = $('.selectedSubCat').val();
				$(".subCategoryError").remove();
				var fetchSubCategoryOptions = result.fetchSubCategory.length;
				optionArray.push('<option value="0">Select Sub Category</option>');
				if(fetchSubCategoryOptions > 0)
				{
					for (var i=0;  i < fetchSubCategoryOptions; i++) 
					{
						if(selectedSubCat == result.fetchSubCategory[i]._id)
						{
							selected = 'selected="selected"'
						}
						else 
						{
							selected = '';
						}
						optionArray.push('<option '+selected+' value="'+result.fetchSubCategory[i]._id+'">'+result.fetchSubCategory[i].name+'</option>');
					}
				}
				else
				{
					$(".product_sub_category").after('<span class="subCategoryError">Not any sub category.</span>');
				}
				$(".product_sub_category option").remove();
				$(".product_sub_category").append(optionArray);
			}  
		},
		cache: false,
		contentType: false,
		processData: false
	});
}

function loadAttrValues(attrId,id)
{
	if(attrId == '' || attrId == 0)
	{
		return false;
	}
	$('#tableToModify >tr#'+id+' #attrValuesDisplay').html('');
	$.ajax({
		type: "GET",
		url: "/product/loadattrvalues/"+attrId,
		async: false,
		success: function(result)
		{
			//console.log(result.fetchAttrValues)
			if(result.status == 'success')
			{
				var optionArray = [];
				var AttrLen = result.fetchAttrValues.length;
				if(AttrLen > 0)
				{
					var createSpan = '';
					for (var a=0; a<AttrLen; a++) 
					{
						createSpan += '<span class="attrSpans">';
						//createSpan += '<input type="checkbox" name="selectedAttr['+result.fetchAttrValues[a].attribute_id+'][]" value="'+result.fetchAttrValues[a]._id+'">';
						createSpan += '<input type="checkbox" name="selectedAttr[]" value="'+result.fetchAttrValues[a]._id+'">';
						createSpan += result.fetchAttrValues[a].value;
						createSpan += '</span>';
						optionArray.push(createSpan);

					}

					$('#tableToModify >tr#'+id+' #attrValuesDisplay').append(optionArray);
				}
				else
				{
					$(this).after('<span class="attrError">Not found any value.</span>');
				}
			}  
			
		},
		cache: false,
		contentType: false,
		processData: false
	});
}
