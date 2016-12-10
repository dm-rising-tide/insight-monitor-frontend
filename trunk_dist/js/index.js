/* 
* @Author: 陈能堡 - 梦幻雪冰
  @GitHub: https://github.com/chennengbao
* @Date:   2016-12-09 11:57:37
* @Last Modified by:   陈能堡 - 梦幻雪冰
* @Last Modified time: 2016-12-10 11:30:05
*/
/***********标签对象************/
var eleObj = {
    navEle: $('.nav'),
    selPageTypeEle: $('.con-opt > strong > a'),
    conOuterEle: $('.con-outer > div'),
    conInnerEle: $('.con-inner'),
    tbodyEle: $('.web-outer tbody'),
    webInnerEle: $('.web-inner')
},
/***********临时数据************/
paraObj = {
    pageType: 1,
    stackgrid: $.stackgrid,
    navIndex: 0
},
/***********功能函数************/
tide = {
    /*
     * [selModuleHandler 选择模块]
     * @param  {[type]} element [标签对象]
     * @return {[type]}         [description]
     */
    selModuleHandler: function (element) {
        var $targetEle = element;
        
        if ($targetEle[0].nodeName == 'A') {
            $targetEle.addClass('sel-module-nav').siblings('a').removeClass('sel-module-nav');

            $.ajax({
                url: 'http://insight.moxz.cn/index.php?r=monitor/getmonitors',
                dataType: 'json',
                data: {
                    moduleId: $targetEle[0].id,
                    type: paraObj.pageType
                }
            })
            .done(function(dataObj) {
                var len         = dataObj.data.length,
                    resultArr   = [],
                    requestStr;

                eleObj.conInnerEle.find('.layout-top').html('');
                eleObj.conInnerEle.find('.layout-bot').html('');
                if (!len) {
                    return;
                };
                for (var i = 0; i < len; i++) {
                    requestStr = '';
                    if (dataObj.data[i].type == '2') {
                        requestStr = 'http://insight.moxz.cn/index.php?r=stats/getarrivalstats&&startPageId=' + dataObj.data[i].startPageId + '&endPageId=' + dataObj.data[i].endPageId;
                    } else if(dataObj.data[i].type == '1') {
                        requestStr = 'http://insight.moxz.cn/index.php?r=stats/getaccessstats&startPageId=' + dataObj.data[i].startPageId;                            
                    } else if(dataObj.data[i].type == '3') {
                        requestStr = 'http://insight.moxz.cn/index.php?r=stats/getdurationstat&startPageId=' + dataObj.data[i].startPageId;                            
                    } else {
                        requestStr = 'http://insight.moxz.cn/index.php?r=stats/getoptionsstats&startPageId=' + dataObj.data[i].startPageId + '&index=5';                                                    
                    }

                    if (requestStr) {
                        // 根据startPageId获取监测数据
                        $.getJSON(requestStr)
                        .done(function(dataObj) {
                            var eleStr;

                            if (dataObj.data.type == '1') {
                                eleStr = $cnb.resolveString(function() {
                                 /*<div class="small-module con-visit">
                                        <h3>模块入口-访问统计</h3>
                                        <p>{{pv}}</p>
                                        <p>{{uv}}</p>
                                        <p>{{mpv}}</p>
                                        <p>{{muv}}</p>
                                    </div>*/
                                }, {
                                    pv: dataObj.data.pv,
                                    uv: dataObj.data.uv,
                                    mpv: dataObj.data.mpv,
                                    muv: dataObj.data.muv
                                });
                                eleObj.conInnerEle.find('.layout-top').append(eleStr);  
                            } else if(dataObj.data.type == '2') {
                                eleStr = $cnb.resolveString(function() {
                                  /*<div class="small-module con-arrive">
                                        <h3>上传到完成的成功率-到达统计</h3>
                                        <p class="clearfix"><span>计数：{{startValue}}</span><em>计数：{{endValue}}</em></p>
                                        <p>{{value}}</p>
                                    </div>*/
                                    }, {
                                        value: (Number(dataObj.data.value) * 100).toFixed(2),
                                        startValue: dataObj.data.startValue,
                                        endValue: dataObj.data.endValue
                                });
                                eleObj.conInnerEle.find('.layout-top').append(eleStr);  
                            } else if(dataObj.data.type == '3') {
                                eleStr = $cnb.resolveString(function() {
                                  /*<div class="big-module con-time">
                                        <h3>上传到完成-时长统计</h3>
                                        <div id="conTime"></div>
                                    </div>*/
                                    }, {
                                        type: 3
                                    });
                                eleObj.conInnerEle.find('.layout-bot').append(eleStr);  
                                ringChart();
                            } else {
                                eleStr = $cnb.resolveString(function() {
                                /*<div class="big-module con-checkbox">
                                    <h3>复选框选项-统计</h3>
                                     <div id="conCheckbox"></div>
                                  </div>*/
                                    }, {
                                        type: 3
                                    });
                                eleObj.conInnerEle.find('.layout-bot').append(eleStr);  
                                Histogram(dataObj.data);
                            }
                        })
                        .fail(function() {
                            alert("亲，网络不行哦~");
                        });
                    };
                };
            })
            .fail(function() {
                alert("亲，网络不行哦~");
            })
        };
    },
    /*
     * [getModuleByAjaxFn 获取模块列表]
     * @return {[type]} [description]
     */
    getModuleByAjaxFn: function() {
        $.ajax({
            url: 'http://insight.moxz.cn/index.php?r=module/getmodulelist',
            dataType: 'json'
        })
        .done(function(dataObj) {
            var temp    = dataObj.data,
                len     = temp.length,
                eleStr  = '';

            for (var i = 0; i < len; i++) {
                if (!i) {
                    eleStr += $cnb.resolveString(function() {
                        /*<a href="javascript:;" id="{{id}}" class="sel-module-nav">{{name}}</a>*/
                    }, {
                        name: temp[i].name,
                        id: temp[i].id
                    });
                } else {
                    eleStr += $cnb.resolveString(function() {
                        /*<a href="javascript:;" id="{{id}}">{{name}}</a>*/
                    }, {
                        name: temp[i].name,
                        id: temp[i].id
                    }); 
                }
            };

            eleObj.navEle.append(eleStr);
            tide.selModuleHandler(eleObj.navEle.find('a').eq(0));
        })
        .fail(function() {
            alert("亲，网络不行哦~");
        })
    },
    /*
     * [getWebConfigByAjaxFn 获取控件统计]
     * @return {[type]} [description]
     */
    getWebConfigByAjaxFn: function() {
        $.getJSON('http://insight.moxz.cn/index.php?r=stats/getbuttoninfo&url=http://10.0.0.206:54321/rtb/video/add')
        .done(function(dataObj) {
            var resultStr = '',
                startStr = '',
                endStr = '';

            eleObj.webInnerEle.html('');
            for (var prop in dataObj) {
                resultStr = '';
                startStr = $cnb.resolveString(function() {
                    /*<div class="con-element table-module grid-item">
                        <h3>{{name}}类</h3>
                        <div class="con-element-list">
                            <table>
                                <colgroup>
                                    <col class="name-col">
                                    <col class="uv-col">
                                    <col class="pv-col">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>UV</th>
                                        <th>PV</th>
                                    </tr>
                                </thead>
                                <tbody>*/
                }, {
                    name: prop
                });
                for (var temp in dataObj[prop]) {
                    resultStr += $cnb.resolveString(function() {
                      /*<tr>
                            <td><div>{{name}}</div></td>
                            <td><div>{{uv}}</div></td>
                            <td><div>{{pv}}</div></td>
                        </tr>*/
                    }, {
                        name: dataObj[prop][temp].className + '-' + dataObj[prop][temp].btnText,
                        uv: dataObj[prop][temp].uv,
                        pv: dataObj[prop][temp].value
                    });
                };
                endStr = $cnb.commentHandleToString(function() {
                            /*  </tbody>
                            </table>
                        </div>
                    </div>    */              
                });
                eleObj.webInnerEle.append(startStr + resultStr + endStr);  
                paraObj.stackgrid.restack();
            };
        })
        .fail(function() {
            alert("亲，网络不行哦~");
        });
    },
    /*
     * [selModuleShowDataFn 选择模块获取信息]
     * @return {[type]} [description]
     */
    selModuleShowDataFn: function() {
        eleObj.navEle.on('click', 'a', function(e) {
            paraObj.navIndex = $(e.target).index() - 1;
            tide.selModuleHandler($(e.target));
        });
    },
    /*
     * [selPageTypeFn 点击内容区导航获取信息]
     * @return {[type]} [description]
     */
    selPageTypeFn: function() {
        eleObj.selPageTypeEle.on('click', function() {
            $(this).addClass('sel-config').siblings().removeClass('sel-config');
            eleObj.conOuterEle.eq($(this).index()).addClass('cnb-show').siblings().removeClass('cnb-show');

            eleObj.conInnerEle.find('.layout-top').html('');
            eleObj.conInnerEle.find('.layout-bot').html('');
            if ($(this).index()) {
                paraObj.stackgrid.restack();
                paraObj.pageType = 5;
                tide.getWebConfigByAjaxFn();
            } else {
                paraObj.pageType = 1;
                tide.selModuleHandler(eleObj.navEle.find('a').eq(paraObj.navIndex));
            }
        });
    }
}
tide.getModuleByAjaxFn();
tide.selModuleShowDataFn();
tide.selPageTypeFn();
/***********环形图表************/
function ringChart() {
    var data = [
        {time:'3-5s', count: 5},
        {time:'5-7s', count: 2},
        {time:'7-9s', count: 1},
        {time:'9-11s', count: 2},
        {time:'11-13s', count: 3}
    ];

    function formatter(text,item){
        var point = item.point; // 每个弧度对应的点
        var percent = point['..percent']; // ..proportion 字段由Stat.summary.proportion统计函数生成
        percent = (percent * 100).toFixed(2) + '%';
        return percent;
    }
    var Stat = G2.Stat;

    var chart = new G2.Chart({
        id: 'conTime',
        width: 414,
        height: 280,
        plotCfg: {
            margin: [40, 100, 50, 10]
        }
    });

    chart.source(data);
    chart.legend('bottom');
    chart.coord('theta', {radius: 0.8, inner: 0.65});
    chart.intervalStack().position(Stat.summary.percent('count')).color('time').label('time', {renderer: formatter});
    chart.render();
}
/***********横向柱状图************/
function Histogram(paraData) {
    var data = [];

    paraData.forEach(function(item, index) {
        data.push({
            "btnText": item.btnText,
            "count": item.count
        });
    });

    var Stat = G2.Stat;
    var Frame = G2.Frame;
    var frame = new Frame(data);
    frame = Frame.sort(frame, 'count'); // 将数据按照population 进行排序，由大到小
    var chart = new G2.Chart({
        id : 'conCheckbox',
        width: 414,
        height: 280,
        plotCfg: {
          margin: [20, 80, 50, 100]
        }
    });
    chart.source(frame);
    chart.axis('btnText',{
        title: null
    });
    chart.coord('rect').transpose();
    chart.interval().position('btnText*count');
    chart.render();
}
/***********瀑布流************/
!function() {            
    var options = {
      column_width: 378,
      is_fluid: false
    };

    var $window = $(window);
    $window.on('load', function(){
        paraObj.stackgrid('#grid-container', '.grid-item', options);
    });                 
}();