(function process(/*RESTAPIRequest*/ request, /*RESTAPIResponse*/ response) {
	// 	gs.info(request.body.dataString);
	info = request.body.dataString;
	update(info);
})(request, response);

function update(info) {
	var request = new sn_ws.RESTMessageV2();
	var parser = new JSONParser();
	var parsed = parser.parse(info);
	var user = 'admin';
	var password = 'xxxxx!';
	var snurl = 'https://dev64613.service-now.com/api/now/table/u_scalr_servers';
	var obj = {"u_id": parsed.data.SCALR_SERVER_ID,
		"u_status": parsed.eventName,
		"u_environment_id": parsed.data.SCALR_ENV_ID,
		"u_account_id": parsed.data.SCALR_ACCOUNT_ID,
		"u_cloud_platform": parsed.data.SCALR_CLOUD_PLATFORM,
		"u_cloud_location": parsed.data.SCALR_CLOUD_LOCATION,
		"u_farm_role_alias": parsed.data.SCALR_FARM_ROLE_ALIAS,
		"u_farm_role_id": parsed.data.SCALR_FARM_ROLE_ID,
		"u_hostname": parsed.data.SCALR_SERVER_HOSTNAME,
		"u_public_ip": parsed.data.SCALR_EXTERNAL_IP,
		"u_private_ip": parsed.data.SCALR_INTERNAL_IP,
		"u_instance_type": parsed.data.SCALR_SERVER_TYPE,
		"u_farm": parsed.data.SCALR_FARM_NAME};
		var requestbody =  JSON.stringify(obj);
		request.setBasicAuth(user,password);
		request.setRequestHeader("Accept","application/json");
		request.setRequestHeader('Content-Type','application/json');

		if (parsed.eventName == "HostUp"){
			request.setEndpoint(snurl);
			request.setHttpMethod('POST');
		}
		else
			{
			request.setEndpoint(snurl + '?u_id=' + parsed.data.SCALR_SERVER_ID);
			request.setHttpMethod('GET');
			var sysinfo = request.execute();
			var sysid = parser.parse(sysinfo.getBody());
			var serversys_id = sysid.result[0].sys_id;
			request.setEndpoint( snurl + "/" + serversys_id);
			request.setHttpMethod('PATCH');
		}
		request.setRequestBody(requestbody);
		var response = request.execute();
	}
