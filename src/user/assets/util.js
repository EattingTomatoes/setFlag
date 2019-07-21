import CONFIG from './config'
import eventBus from './eventBus'

const { extUuid, baseUrl, port } = CONFIG;

var util = {
    request(url,obj) {
        obj = obj || {};
        obj.methods = obj.methods.toUpperCase() || 'GET';
        obj.async = obj.async || true;
        obj.data = obj.data || {};

        return new Promise(function (resolve, reject) {
            let xhr = null; //判断是否支持ajax，else一般给IE浏览器
            if(window.XMLHttpRequest){
                xhr = new XMLHttpRequest()
            }
            else {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            }
            let params = [];
            //遍历请求参数对象，拼接请求参数
            for(let param in obj.data){
                params.push(param+'='+obj.data[param])
            }
            let requestData = params.join('&');
            //请求类型
            let requestType = obj.methods.toUpperCase();
            console.log(requestType);
            //如果是GET请求
            if(requestType == 'GET'){
                xhr.open(requestType,url+'?'+requestData,obj.async);
                xhr.send();
            }
            else if(requestType == 'POST'){
                xhr.open(requestType,url,obj.async);
                xhr.setRequestHeader("Content-type",
                    "application/x-www-form-urlencoded;charset=utf-8")
                xhr.send(requestData)
            }

            xhr.onreadystatechange = function () {
                if(xhr.readyState==4 && xhr.status==200){
                    resolve(JSON.parse(xhr.responseText),this)
                }
                else if(xhr.status!=200){
                    reject({code:400,message:"请求失败"},this)
                }
            }
        })
    },
    hy_request({service, method = 'GET', param = {}}) {
        var requestParam = {
            host: baseUrl,
            param: {},
            port: port,
            httpMethod: method,
            path: `/vent/api/v1/${service}`
        };
        console.log('请求',requestParam);

        return new Promise((resolve, reject) => {
            hyExt.requestEbs(requestParam)
                .then(({ res, msg, ebsResponse }) => {
                    if(res == 0) {
                        const { entity, statusCode, header } = ebsResponse;

                        if(statusCode != 200 || !entity) {
                            console.log('接口异常', res, msg, ebsResponse);
                        }

                        console.log('响应', res, entity, statusCode, header);
                        const resp = typeof entity == 'string' ? JSON.parse(entity) : entity;
                        resolve(resp);
                    }else{
                        reject(new Error(msg));
                    }
                }).catch(err => {
                reject(err);
            })
        })
    },
    SecondToData(msd){
        let curTime = msd - new Date().getTime();
        let time = curTime / 1000;
        if(time!=null && time!=""){
            //计算小于一小时
            if(time>60 && time<3600){
                time = parseInt(time/60.0) + ":" + parseInt((parseFloat(time/60.0)
                    - parseInt(time/60.0)) * 60);
            }
            //计算大于一小时，小于一天
            else if(time>=3600 && time<3600*24) {
                time = parseInt(time / 3600.0) + ":" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + ":" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
            }
            else if(time>=3600*24){
                time = parseInt(time / 3600.0 / 24) + "天" + parseInt((parseFloat(time / 3600.0 / 24) -
                    parseInt(time / 3600.0 / 24)) * 24) + ":" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + ":" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
            }
            else{
                time = parseInt(time);
            }
        }

        let curtime = '';

        if (time.indexOf('天') == -1) {
            curtime = time.split(':');
        } else {
            curtime = time.split('天')[1].split(':');
        }

        let curArr = '';
        for (let a = 0; a < curtime.length; a++) {
            let item = curtime[a];
            if (item < 10) {
                item = '0' + item;
            }
            if (a < curtime.length - 1) {
                curArr += item + ':';
            } else {
                curArr += item;
            }

        }

        if (time.indexOf('天') != -1) {
            curArr = time.split('天')[0] + '天' + curArr;
            if (time.split('天')[0] < 10) {
                curArr = '0' + curArr;
            }
        }

        return curArr;
    }
};

export default util;