import control_centerApi from '../../../api/control_center/control_centerApi';


export default {
    namespace: 'control_center_model',
    state: {
        // tabel
        datalist:[],
        // 进项票据统计值
        q1:{},
        // 已处理票据
        q2_1:{},
        q2_2:{},
        // 未处理票据
        q3_1:{},
        q3_2:{},
        // 高风险发票增长趋势数据
        highDataList:[],
        // 消息提醒中心
        messageList:[],
        // 用户公司
        user_company_name:''
 
    },
    effects: {
        /**
         * 进项票据统计.
         */
        * InvoiceCount1({ payload, callback }, { select, call, put }){          
            let reportData = yield call(control_centerApi.InvoiceCountAll1, { company_name:payload.company_name });           
            if (reportData.code == 0 || reportData.code == '0') {
                yield put({
                    type: 'updateState',
                    payload: { q1: reportData.data.addInvoice},
                }); 
            }
            callback(reportData.code);
        },
        
        /**
         * 已处理/待处理票据统计.
         */
        * InvoiceCount2({ payload }, { select, call, put }){          
            let reportData = yield call(control_centerApi.InvoiceCountAll2, {});           
            if (reportData.code == 0 || reportData.code == '0') {
                yield put({
                    type: 'updateState',
                    payload: { q2_1: reportData.data.invoiceFinishCount[0] ,q2_2: reportData.data.invoiceFinishCount[1],
                        q3_1:reportData.data.invoiceUnFinishCount[0],q3_2:reportData.data.invoiceUnFinishCount[1]},
                });               
            }
        },
        /**
         * 高风险发票增长趋势数据.
         */
        * HighInvoice({ payload }, { select, call, put }){          
            let reportData = yield call(control_centerApi.highInvoiceChartList, {});           
            if (reportData.code == 0 || reportData.code == '0') {
                // reportData.data.rs.map((value, key) => {
                //     value.month = value.month == '01' ? "1月" :value.month == '02' ? "2月": value.month == '03' ? "3月" : value.month == '04' ? "4月" : value.month == '05' ? "5月" : value.month == '06' ? "6月" : value.month == '07' ? "7月" : value.month == '08' ? "8月" : value.month == '09' ? "9月" : value.month == '10' ? "10月" : value.month == '11' ? "11月" :  value.month == '12' ? "12月" :12;
                //    })
                yield put({
                    type: 'updateState',
                    payload: { highDataList:reportData.data.rs}
                    });                                
                console.log("high-model",reportData.data.rs);
            }
        },
        
        
        /**
         * Tabel数据.
         */
        * List({ payload }, { select, call, put }){          
            let reportData = yield call(control_centerApi.tableDataList, { company_name:payload.company_name });           
            if (reportData.code == 0 || reportData.code == '0') {
                yield put({
                    type: 'updateState',
                    payload: { datalist: reportData.data.highRiskInvoice},
                }); 
            }
            console.log("tabel",reportData)
        },
        /**
         * 高风险发票增长趋势.
         */
        * highRiskList({ payload, callback }, { call }){
            let rs = yield call(control_centerApi.highRiskList, { catalog: payload.catalog });
            if (rs.code === 0 || rs.code === '0') {
                callback(rs);
            }
        },
        
         /**
         * 消息提醒中心数据
         */
        * messageList({ payload }, { call ,put}){
            let rs = yield call(control_centerApi.messageList, {});
            if (rs.code === 0 || rs.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { messageList: rs.data},
                });              
            }
        },


        /**
         * 页面大小发生改变.
         */
        * pageSizeChange({ payload }, { put }) {
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize, }
            });
            //重新获取一次数据
            yield put({
                type: 'tableList',
                payload: {}
            });
        },
    },

    // 用来保存更新state值, 上面的put方法调用这里的方法.
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}