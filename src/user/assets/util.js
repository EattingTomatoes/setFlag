import CONFIG from './config'
import eventBus from './eventBus'

const { extUuid, baseUrl, port } = CONFIG;

var util = {
    hy_request({service, method='GET', param={}}) {
        var requestParam = {};
        if(method=='GET'){
            var url = baseUrl + `/${service}?`;
            for(var key in param){
                url += `${key}=${param[key]}&`;
            }
            requestParam = {
                header:{},
                url: url,
                data: {},
                dataType: 'json',
                method: method,
            };
        }

        else if(method=='POST'){
            requestParam = {
                header:{},
                url: baseUrl + `/${service}`,
                data: param,
                dataType: 'json',
                method: method,
            };
        }


        return new Promise((resolve, reject) => {
            hyExt.request(requestParam)
                .then(({ data, statusCode, header }) => {
                    if(statusCode==200){
                        resolve(data)
                    }
                    else if(statusCode!=200){
                        reject(statusCode)
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
            if(time<3600){
                time = "0" + ":" + parseInt(time/60.0) + ":" + parseInt((parseFloat(time/60.0)
                    - parseInt(time/60.0)) * 60);
            }
            //计算大于一小时，小于一天
            else if(time>=3600 && time<=3600*24) {
                time = parseInt(time / 3600.0) + ":" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + ":" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60);
            }
        }

        let curtime = '';
        curtime = time.split(':');

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


        return curArr;
    },

    showToast(text){
        eventBus.$emit('showToast', text);
    },

    showMention(text){
        eventBus.$emit('showMention', text);
    },

    giftGetRandomNum(luckNum,init_count1){
        var ranNum = Math.random();
        if(ranNum<init_count1){
            return true;
        }
        else {
            return false;
        }
    },

    barrageGetRandomNum(luckNum,init_count2){
        var ranNum = Math.random();
        if(ranNum<init_count2){
            return true;
        }
        else {
            return false;
        }
    }
};

export default util;