import CONFIG from './config';
import eventBus from './eventBus';

const { extUuid, baseUrl, port } = CONFIG;

var util = {
    hy_request({service, method = 'GET', param = {}}) {
        var requestParam = {
            host: baseUrl,
            param: {extUuid, ...param},
            port: port,
            httpMethod: method,
            path: `/vent/api/v1/${service}`
        }

        console.log('请求', requestParam);

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
    showToast(text){
        eventBus.$emit('showToast', text);
    },
    trimHttp(url) {
        if(url) {
            return url.replace(/^http\:/, 'https:');
        }
    },
    xssFilter: function (msg) {
        if (typeof msg !== 'string') return msg;

        msg = msg.replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\'/g, '&#39;')
                .replace(/\"/g, '&quot;');

        return msg;        
    },
    checkNum: function (str) {
        var reg = '^\\+?[1-9][0-9]*$';
        var pattern = new RegExp(reg);
        if(pattern.test(str)){
            return true
        }
        return false
    }
    
}

export default util;
