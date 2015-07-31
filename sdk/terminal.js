var terminal = {};
terminal.run=false;


terminal.init=function(){
}


terminal.log=function(str){
	if(terminal.run)$('.terminal>ul').append(str);
}

terminal.logRequest=function(url, data){
	var o = '<li>'+url+'</li>';
	var d = JSON.stringify(data);
	o+='<li><code>'+d+'</code></li>';
	terminal.log(o);
}

terminal.logResponse=function(result, data){
	if(result=='success'){
		var o = '';
		//var d = objetToLi(data);
		o+='<li class="text-right"><code>'+JSON.stringify(data)+'</code></li>';
		terminal.log(o);
	}
}

terminal.error=function(message){
	terminal.log('<li><span style="color:#ff0000">ERROR: '+message+'</span></li>');
}

terminal.comment=function(text){
	terminal.log('<li>//'+text+'</li>')
}