function showresult(type) {

	jQuery('ul.searchtab li').removeClass('active');	
	jQuery('.showresults li').hide();	
	
	switch(type)
	{
		case 'tabusers' :
			jQuery('#'+type).addClass('active');	
			jQuery('.'+type).show();	
		break;

		case 'tabproducts' :
			jQuery('#'+type).addClass('active');	
			jQuery('.'+type).show();
		break;

		case 'taborders' : 
			jQuery('#'+type).addClass('active');
			jQuery('.'+type).show();	
		break;
	}
}