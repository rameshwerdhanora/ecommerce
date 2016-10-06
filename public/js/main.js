function getSizeOptions(gender,frmID){
    $("#"+frmID+" .sizeRow:gt(0)").remove();// To delete all the row accept first 
    if(gender != ''){
        $.ajax({
            type: "POST",
            url: "/product/getSize",
            data: {gender:gender},
            dataType: 'json',
            success: function(res){
                $("#"+frmID+" .size-0").remove();// To delete previous options
                if(res.status == 'success'){
                    var selectList = $("#"+frmID+" #size-0");
                    selectList.find("option:gt(0)").remove();
                    for(var i=0; i < res.data.length;i++){
                        var option = new Option(res.data[i].size_name, res.data[i].id);
                        selectList.append($(option));
                    }
                }else{
                    //res.data.
                }
            }
        });
    }else{
        alert("Please select gender first!");
    }
}
$(document).ready(function() {
    $(".addProduct").on('change','select[name="attribute[]"]',function(n){
        
        var selectElement = $(this);
        var formId = $(this).closest('form').attr('id');
        parentDivId = selectElement.closest('.sizeRow').attr('id');
        $.ajax({
            type: "POST",
            url: "/product/getAttrib",
            data: {size:$(this).val()},
            dataType: 'json',
            success: function(res){
                $("."+parentDivId).remove();// To delete all it's previous options to reset
                if(res.status == 'success'){
                    var html = '';
                    for(var i=0; i < res.data.length;i++){//size
                        var attribCount = res.data[i].attributes.length; 
                        for(var j= 0; j < attribCount;j++){
                            var bbCls = '';
                            if((j+1) == attribCount){
                                bbCls = 'b_b';
                            }
                            html+='<div class="sizeRow sizeOptions profile-frm-row product_size '+bbCls+' '+parentDivId+'"><div class="sg-row"><span class="sz-txt">';
                            //html+= res.data[i].size;
                            //html+= ' ('+res.data[i].attributes[j].attribute +') ';
                            html+= res.data[i].attributes[j].attribute +' ';
                            if(res.data[i].attributes[j].type == 'select' || res.data[i].attributes[j].type == 'multiselect'){
                                if(res.data[i].attributes[j].options.length){
                                    for(var k = 0; k < res.data[i].attributes[j].options.length; k++){
                                        //html+= '<a href="#">'+ res.data[i].attributes[j].options[k].value+'</a>';
                                        
                                        if(attributeOptions.indexOf(res.data[i].attributes[j].options[k].id) == -1 || formId == 'addproduct'){
                                             html+= '<input type="checkbox" value="'+res.data[i].attributes[j].options[k].id+'" name="size[]" /><span>'+ res.data[i].attributes[j].options[k].value+'</span>';//'+res.data[i].attributes[j].attributeId+'
                                        }else{
                                             html+= '<input checked="checked" type="checkbox" value="'+res.data[i].attributes[j].options[k].id+'" name="size[]" /><span>'+ res.data[i].attributes[j].options[k].value+'</span>';//'+res.data[i].attributes[j].attributeId+'
                                        }
                                    }
                                    html+='</span></div></div>';
                                }else{
                                    html+='No option found</span></div></div><div class="clearfix"></div>';
                                }
                            }else{
                                // textbox or textarea
                                // But not required this option
                                //html+= '<input type="'+res.data[i].attributes[j].type+'"  name="size['+res.data[i].attributes[j].attributeId+']" />';//'+res.data[i].attributes[j].attributeId+'
                            }
                        }
                        //html+='</span></div></div>';
                    }
                    $("#"+formId+" #"+parentDivId).after(html);
                }else{
                    //res.data.
                }
            }
        });                 
    });
    
    $(".addProduct").on('click','#addMoreSize',function(n){
        var formId  = $(this).closest('form').attr('id');
        console.log(formId);
        var gender = $("#"+formId+" select[name='gender']").val();
        console.log(gender);
        if(gender != ''){
            var sizeCount = $("#"+formId+" .sizeRowDropDown").length;
            console.log('sizeRow->'+sizeCount);
            var totalOption = parseInt($("#"+formId+" #size-0 option").length);
            console.log('totalOption->'+totalOption);
            if(sizeCount < (totalOption -1 )){
                $.ajax({
                    type: "POST",
                    url: "/product/getSize",
                    data: {gender:gender},
                    dataType: 'json',
                    success: function(res){
                        var cln = $("#"+formId+" .sizeRow:first").clone();
                        cln.attr('id','sizeRow-'+sizeCount);
                        cln.find('select').attr('id','size-'+sizeCount);
                        cln.find("option:gt(0)").remove();
                        cln.find('.color-right').remove();
                        if(res.status == 'success'){
                            for(var i=0; i < res.data.length;i++){
                                var option = new Option(res.data[i].size_name, res.data[i].id);
                                cln.find('select').append($(option));
                            }
                            $("#"+formId+" .sizeRow:last").after(cln);
                        }else{
                            //res.data.
                        }
                    }
                });
            }else{
                alert('Max attribute limit is over');
            }
            
        }else{
            alert("Please select gender first!");
        }
    });
    
    $('#p_add_dis_btn').click(function(n){
        if($("#p_add_dis_name").val() == '' || $("#p_add_dis_type").val() == '' || $("#p_add_dis_amount").val() == ''){
            alert('All the fields are required!');
        }else{
            $("#add_dis_name").val($("#p_add_dis_name").val());
            $("#add_dis_type").val($("#p_add_dis_type").val());
            $("#add_dis_amount").val($("#p_add_dis_amount").val());
            $('#modal-container-702679').modal('hide');
            
        }
    });
    $('#p_edit_dis_btn').click(function(n){ 
        if($("#p_edit_dis_name").val() == '' || $("#p_edit_dis_type").val() == '' || $("#p_edit_dis_amount").val() == ''){
            alert('All the fields are required!');
        }else{
            $("#edit_dis_name").val($("#p_edit_dis_name").val());
            $("#edit_dis_type").val($("#p_edit_dis_type").val());
            $("#edit_dis_amount").val($("#p_edit_dis_amount").val());
            $('#modal-container-7026790').modal('hide');
            
        }
    });
    $('#product_gender').change(function(n){
        var frmId = $(this).closest('form').attr('id');
        getSizeOptions($(this).val(),frmId);
    });
        
    $(".tableCheckbox").change(function(n){
        var checkedProp = $(this).is(':checked');
        $(".rowCheckbox").each(function(){
           $(this).prop('checked',checkedProp); 
        });
    });
    
    $(".addProduct").on('click','#addMoreColor',function(n){
        var formId = $(this).closest('form').attr('id');
        var colorLength = $("form#"+formId+" .slctClr").length;  
        if($('#'+formId+' .slctClr').length < $("#"+formId+" #color option").length){
            var cln = $("#"+formId+" #lastColorSelect .profile-frm-cl2").clone();
            cln.find('select').attr('id','color-'+colorLength);
            
            html='<div class="profile-frm-row product_select slctClr"><div class="profile-frm-cl1">COLOR</div><div class="profile-frm-cl2">';
            html+=cln.html();
            html+='</div></div>';
            $("#"+formId+" .slctClr:last").after(html);
        }else{
            alert("Color drop down are reached to the number of option available in it");
        }
        /*$('select[name="color[]"]').each(function(n){
            console.log($(this).val());
        });*/
    });
	var selectedColors = $('.selectedColors').val();
	if(selectedColors !== undefined)
	{
	  	//alert(selectedColors);
	}
 
    // Place JavaScript code here...
  
    /* Attribut Page:  To add more attribut Row */
    $("input[type='button'][name='addMoreAttribBtn']").click(function(n){
          var rowHtml =  '<div class="profile-frm-row attribOptionRow"><div class="profile-frm-cl1"><input type="text" value="" name="optionName[]" required="required" /></div><div class="profile-frm-cl2"><span class="yes-cl"><input type="button" name="delOptionBtn[]" value="Delete" class="css-checkbox other-btn"/></span></div></div>';
          $(".addAttribOptionHeaderRow").after(rowHtml);
    });
    $(".attributeType").change(function(){
        var attibuteTypeValue = $(this).val();
        if(attibuteTypeValue == 'select' || attibuteTypeValue == 'multiselect'){
            $(".addAttribOptionHeaderRow").show('slow');
        }else{
            $(".addAttribOptionHeaderRow").hide('slow');
            $(".attribOptionRow").remove();
        }
    });
    
    
    
    $(".profile-cl").on('click','input[name="delOptionBtn[]"]',function(){
        $(this).closest('.attribOptionRow').remove();
    });
    $(".profile-cl").on('keyup','input[name="editOptionName[]"]',function(){
        $(this).closest('.attribOptionRow').find('.optionUpdateButton').show();
    });
    
    $(".profile-cl").on('click','input[name="editDelOptionBtn[]"]',function(){
        var attrbOptionId = $(this).attr('id');
        if(attrbOptionId == ''){
            $(this).closest('.attribOptionRow').remove();
        }else{
            if(confirm('Are you sure to delete?')){
                //$(this).closest('.attribOptionRow').remove();

                var attribVal = attrbOptionId.split('_');
                attribVal = attribVal[1];
                $.ajax({
                    type: "POST",
                    url: "/attribute/deleteAttibOption",
                    data: {attributeOptionId:attribVal},
                    dataType: 'json',
                    success: function(res){
                        if(parseInt(res.flag) == 1){
                            $('#'+attrbOptionId).closest('.attribOptionRow').remove();
                            alert(res.msg);
                        }else{

                        }
                    }
                });

            }else{

            }
        }
    });
    
    $(".profile-cl").on('click','.optionUpdateButton',function(){
        var attrbOptionId = $(this).attr('id');
        if(attrbOptionId == ''){
            var optionName = $(this).closest('div.attribOptionRow').find('input[name="editOptionName[]"]').val();
            var updateButton = $(this);
            var attributeId = $("#attribute_id").val();
            $.ajax({
                type: "POST",
                url: "/attribute/addAttribOption",
                data: {attributeId:attributeId,optionNm:optionName},
                dataType: 'json',
                success: function(res){
                    if(parseInt(res.flag) == 1){
                        updateButton.attr('id','update_'+res.attribOptionId);
                        updateButton.closest('div.attribOptionRow').find('input[name="editDelOptionBtn[]"]').attr('id','del_'+res.attribOptionId);
                        updateButton.closest('div.attribOptionRow').find('input[name="editOptionName[]"]').attr('id','option_'+res.attribOptionId);
                        updateButton.attr('value','Update');
                    }else{

                    }
                }
            });
        }else{
            if(confirm('Are you sure you want to update?')){
                var attribVal = attrbOptionId.split('_');
                attribVal = attribVal[1];
                var optionName = $("#option_"+attribVal).val();
                $.ajax({
                    type: "POST",
                    url: "/attribute/updateAttribOption",
                    data: {attributeOptionId:attribVal,optionNm:optionName},
                    dataType: 'json',
                    success: function(res){
                        if(parseInt(res.flag) == 1){
                            alert(res.msg);
                        }else{

                        }
                    }
                });

            }else{

            }
        }
    });
    $("input[type='button'][name='editaddMoreAttribBtn']").click(function(n){
           var rowHtml =  '<div class="profile-frm-row attribOptionRow"><div class="profile-frm-cl1"><input id=""  type="text" value="" name="editOptionName[]" required="required" /></div><div class="profile-frm-cl2"><span class="yes-cl"><input id="" type="button" name="editDelOptionBtn[]" value="Delete" class="css-checkbox"/> &nbsp; <input id="" type="button" name="update" value="Save" class="optionUpdateButton" /> </span></div></div>';
            $(".addAttribOptionHeaderRow").after(rowHtml);
    });
    
    /*$('#editAttributeFrm').load('',function(){
        
        var attributeType = $("#attributeType").val();
        if(attributeType == 'select' || attributeType == 'multiselect'){
            
        }
    });*/
});

function getOptions(attrbid){
    var attributeType = $("#attributeType").val();
    if(attributeType == 'select' || attributeType == 'multiselect' ){
        $.ajax({
            type: "POST",
            url: "/attribute/getOptions",
            data: {'attribId':attrbid},
            dataType: 'json',
            success: function(res){
                $(".addAttribOptionHeaderRow").show('slow');
                $.each(res.data,function(index,val){
                    var rowHtml =  '<div class="profile-frm-row attribOptionRow"><div class="profile-frm-cl1"><input id="option_'+val._id+'"  type="text" value="'+val.value+'" name="editOptionName[]" required="required" /></div><div class="profile-frm-cl2"><span class="yes-cl"><input id="del_'+val._id+'" type="button" name="editDelOptionBtn[]" value="Delete" class="css-checkbox"/> &nbsp; <input id="update_'+val._id+'" type="button" name="update" value="update" class="dnone optionUpdateButton" /> </span></div></div>';
                    $(".addAttribOptionHeaderRow").after(rowHtml);
                });
            }
        });
    }
}



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

function make_sure_for_product(id)
{
	$.ajax({
		type: "GET",
		url: "/product/delete/"+id,
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
 	/*
	var row 	= document.getElementById("rowToClone"); // find row to copy
	var table 	= document.getElementById("tableToModify"); // find table to append to
	var rowCount = $('#tableToModify >tr').length
	var clone 	= row.cloneNode(true); // copy children too
	clone.id 	= rowCount+1; // change id or other attributes/contents
	table.appendChild(clone); // add new row to end of table
	$('#tableToModify >tr#'+clone.id+' >td >select').attr("id",clone.id);
	$('#tableToModify >tr#'+clone.id+' >td >.removeAttrRow').attr("id",clone.id);
	*/
	var row 	= document.getElementById("rowToClone"); // find row to copy
	var rowCount = $(".clonedRow").length;
	//var clone 	= row.cloneNode(true); // copy children too
	//clone.id 	= rowCount+1; // change id or other attributes/contents
	$(".clonedRow").append(row);
	//AttributesTr
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
					//$(".product_sub_category").after('<span class="subCategoryError">Not any sub category.</span>');
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
						createSpan += '<input type="checkbox" name="selectedAttr['+result.fetchAttrValues[a].attribute_id+'][]" value="'+result.fetchAttrValues[a]._id+'">';
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
