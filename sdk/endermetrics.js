/* 
Copyright (c) 2015 LilyMedia.cc
Licensed under the MIT license.
*/

/*!
 * Javascript EnderMetrics library for jQuery, version 0.8.3.
 * Version: 1.0.0
 * Built: Fri Jul 10 2015 17:05:46
 * http://endermetrics.com
 *
 * Copyright 2015 LilyMedia S.L.
 *
 */


var em=em||{};
(function () {
'use strict';
em.version = 'v1';
em.domain = 'http://api.endermetrics.com';
em.debug=false;
em.url = '';

em.app_token='';
em.account={};
em.child={};



em.session='';
em.set = {};



em.init=function(token){
	if(token==undefined || token==null || token==''){console.error('Token not defined');}
	else{em.app_token=token;}

	em.url = em.domain+'/'+em.version;
}



/*----------------------------------------------ACCOUNT-------------------------------------------------*/

em.account.register=function(custom_id, callback, callback_error){
	callback=callback||function(){};
	callback_error=callback_error||function(){};
	if(em.debug)console.log('creating Account');
	$.ajax({
			url: em.url+'/account/register',
			type: 'POST',
			dataType: 'json',
			data: { params:{'app_token':em.app_token, 'custom_id':custom_id}},
		})
		.done(function(data) {
			callback(data.data.account_id, data);
			//terminal.logResponse('success', data);
		})
		.fail(function(data) {
			callback_error(data);
			//terminal.logResponse('fail', data);
		});

}


em.account.auth = function(callback, callback_error){
	callback=callback||function(){};
	callback_error=callback_error||function(){};
	$.ajax({
		url: em.url+'/auth/token',
		type: 'POST',
		dataType: 'json',
		data: { params:{'app_token':em.app_token, 'account_id':em.account.id,  'child_id':em.child.id }},
	})
	.done(function(data) {
		callback(data.session_token);
	})
	.fail(function(d) {
		callback_error(d);
	});
}

/*--------------------------------------------END ACCOUNT-----------------------------------------------*/

/*-----------------------------------------------CHILD--------------------------------------------------*/

em.child.register = function(custom_id, nick, birthdate, gender, callback, callback_error){
	custom_id=custom_id||null;
	callback_error=callback_error||function(){};
	callback=callback||function(){};
	if(em.debug)console.log('Register Child');
	$.ajax({
			url: em.url+'/child/register',
			type: 'POST',
			dataType: 'json',
			data: { params:{'app_token':em.app_token, 'account_id':em.account.id, 'custom_id':custom_id, 'nick':nick, 'birthdate':birthdate, 'gender':gender}},
		})
		.done(function(data) {
			callback(data.data.account_id, data);
			//terminal.logResponse('success', data);
		})
		.fail(function(data) {
			callback_error(data);
			//terminal.logResponse('fail', data);
		});
}


em.child.getAll = function(callback, callback_error){
	callback=callback||function(){};
	callback_error=callback_error||function(){};
	if(em.debug)console.log('load children list');
	$.ajax({
		url: em.url+'/child/getall',
		type: 'POST',
		dataType: 'json',
		data: { params:{'account_id':em.account.id}},
	})
	.done(function(data) {
		if(data.meta.code==400)callback_error(d.meta.message);
		callback(data.data.list);
	})
	.fail(function(data) {
		callback_error(data);
	});	
}
/*-------------------------------------------END CHILD--------------------------------------------------*/
	
/*------------------------------------------------- SET-------------------------------------------------*/

em.set.init=function(activity_token, level){
	em.set.start_time=new Date().getTime();
	em.set.activity_token=activity_token;
	em.set.level=level;
	em.set.hits=[];
	em.set.result="FAILED";
}

em.set.addHit=function(skill_token, result){
	if(result==true || result=='SUCCESS')result='SUCCESS';
	else result  = 'FAILED';
	em.set.hits.push({skill_token:skill_token, result:result});
}

em.set.track=function(result, callback, callback_error){
	callback=callback||function(){};
	callback_error=callback_error||function(){};

	if(result || result == 'SUCCESS')em.set.result = "SUCCESS";
	else em.set.result = "FAILED";
	
	$.ajax({
		url: em.url+'/track/set',
		type: 'POST',
		dataType: 'json',
		data: {params:{session_token:em.session,
				data:{
					activity_token:em.set.activity_token,
					level:em.set.level,
					result:em.set.result,
					hits:em.set.hits,
					time:(new Date().getTime()-em.set.start_time)/1000}}},
	})
	.done(function(d) {
		callback(d);
	})
	.fail(function(e) {
		callback_error(e);
	});
}

/*----------------------------------------------END SET-------------------------------------------------*/
}());