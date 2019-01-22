class framework{
	constructor() {
		//this.serverUrl = "http://192.168.1.35:8070/api/"
		//this.serverUrl = "http://ec2-54-199-248-151.ap-northeast-1.compute.amazonaws.com:8089/api/"
		//this.serverUrl = "https://timebird.vantec-gl.com:8443/api/";//本番
		this.serverUrl = "https://timebird.vantec-gl.com:7443/api/"//テスト
		this.httpHelper = {
			httpToken: "",
			Post: function (url, data, success, failure) {
				(fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
					body: data
                }).then(response => response.json()))
				.then(function (response) {
					success(response);
				})
				.catch(function (error) {
					failure(error);
				})
			},
			Get: function (url, success, failure) {
				(fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(response => response.json()))
				.then(function (response) {
					success(response);
				})
				.catch(function (error) {
					failure(error);
				})
			}
		};
	}
	static Shared(){
		return new framework();
	}
    
    
    //ログイン
    UserLogin(userInfo,success,failure){
        //var jsonData = JsonHelper.ToJson(userInfo)
        let url = this.serverUrl + "Login";
        this.httpHelper.Post(url, userInfo, success, failure);
    }
    //作業実績送信
    SendNewResultToServer(newResult,success,failure){
        let url = this.serverUrl + "UpdateTMeasures";
        this.httpHelper.Post(url, newResult, success, failure);
    }
    //作業実績取得
    GetTMeasures(mAccount_id,WorkDate,success,failure){
        var url = this.serverUrl + "GetTMeasures/";
        url += mAccount_id + "/";
        url += WorkDate;
        this.httpHelper.Get(url, success, failure);
    }
    //日報出力
    DailyOutput(mAccount_id,WorkDate,success,failure){
        var url = this.serverUrl + "PrintReport/";
    	url += mAccount_id + "/";
    	url += WorkDate;
    	this.httpHelper.Get(url, success, failure);
    }
}
