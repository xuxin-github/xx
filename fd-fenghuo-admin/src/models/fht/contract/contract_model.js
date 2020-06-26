import contractApi from '../../../api/contract/contractApi';
import billApi from '../../../api/bill/billApi';
import util from '../../../utils/notification';
import { callbackify } from 'util';

export default {
    namespace: 'contract_model',
    state: {
                
        // 合同列表.
        datalist: [],
        // 列表数据总条数.
        totalSize: 0,  
        // 详情页面列表
        showDetailList:{},
        // 发票信息
        invoiceList:[],
        // 参数.
        queryParams: {},
        // 合同名
        contract_name: {},
        // 编号
        contract_code:{},
        // 对方联系方式的暂存地址
        // model暂存的
        contractList:[],
        // 数据库中的
        contractList1:[],
        // 放在取消编辑后清空model时丢失联系人
        c_list:[],
        // 合同详情页的项目名称       
        project_name:{},
        // 合同每页显示的数量.
        pageSize: 10,
        // 合同当前页.
        page: 1,
        // 发票每页显示的数量.
        f_pageSize: 10,
        // 发票当前页.
        f_page: 1,
        // 发票总数
        f_totalSize: 0, 

    },
    effects: {
        /**
         * 查询列表.
         */
        * tableList({ payload }, { select, call, put }){
            const { queryParams, pageSize, page } = yield select(_ => _.contract_model);          
            let contract_list = yield call(contractApi.queryContractList, { pageSize, page, queryParams,company_id:payload.company_id ,user_id:payload.user_id});
            if (contract_list.code == 0 || contract_list.code == '0') {
                yield put({
                    type: 'updateState',
                    payload: { datalist: contract_list.data.datalist, totalSize: contract_list.data.totalSize },
                });
            }
        },
        /**
         * 搜索.
         */
        * query({ payload }, { put,select }) {
            const { datalist } = yield select(_ => _.contract_model);
            console.log("list",datalist);
                yield put({
                    type: 'updateState',
                    payload: { "queryParams": payload.values,page:1,user_id:payload.user_id}
                });
                yield put({
                    type: 'tableList',
                    payload: {company_id:payload.company_id,user_id:payload.user_id }
                });         
        },
        /**
         * 添加合同.
         */
       * addContract({ payload }, { put,select,call }){ 
            const { datalist } = yield select(_ => _.contract_model);                 
            // 请求的参数   
            payload.queryParams["company_id"]=payload.company_id;
            let contract_add = yield call(contractApi.addContractList, payload.queryParams);
            if (contract_add.code == 0 || contract_add.code == '0') {
                yield put({
                    type: 'tableList',
                    payload: {company_id:payload.company_id,user_id:payload.user_id }               
                }); 
                util.success(contract_add.msg);
            }else{
                util.error(contract_add.msg);
            }                          
        },
        /**
         * 跳转到详情页面.
         * 根据传过来的编号名称, 查询到详情页面所需要的数据.
         */
        * showDetail({ payload }, { call,select, put}) { 
            const { c_List,f_page,f_pageSize,f_totalSize,contractList1} = yield select(_ => _.contract_model);
            // 请求的参数，重定义参数名为code，name，用于后台接参      
            console.log("cans",payload.contract_code,payload.contract_name,payload.company_id);    
            let contract_showDetailList = yield call(contractApi.queryContractByCodeList,{code:payload.contract_code,name:payload.contract_name,company_id:payload.company_id});           
            if (contract_showDetailList.code == 0 || contract_showDetailList.code == '0') {             
                yield put({
                    type: 'updateState',
                    payload: {contract_name: contract_showDetailList.data.contract.contract_name,
                        contract_code: contract_showDetailList.data.contract.contract_code,project_name:contract_showDetailList.data.contract.project_name,
                        contractList1:contract_showDetailList.data.t_link_info,c_list: contract_showDetailList.data.t_link_info}
                });
                yield put({
                    type: 'updateState',
                    payload: {showDetailList: contract_showDetailList.data  }
                });  
            } 
            // 获取发票
            let invoice_list = yield call(contractApi.queryinvoiceList,{f_page,f_pageSize,f_totalSize,name:payload.contract_name});
            if (invoice_list.code == 0 || invoice_list.code == '0') {
                yield put({
                    type: 'updateState',
                    payload: {invoiceList: invoice_list.data ,f_totalSize: invoice_list.data.totalSize}
                }); 
            }                     
        },

        /**
         * 编辑合同状态(正常or结束)
         */
        * updateContractStatus({ payload }, { call,select, put}){ 
            const { datalist} = yield select(_ => _.contract_model);      
            // 请求的参数           
            let contract_updateStatus = yield call(contractApi.updateContractStatus, {name:payload.contract_name});
            if (contract_updateStatus.code == 0 || contract_updateStatus.code == '0') {
                yield put({
                    type: 'tableList',
                    payload: {company_id:datalist[0].company_id }                                    
                });
                util.success("结束成功");
            }else{
                util.error("结束失败");             
            }
        },
        /**
         * 变更合同关联.
         */
       * detailChangeContract({ payload }, { call, put }){  
            payload.value["contract_name"]=payload.c_name;
            const company_id = 1;
            let contract_changeProject = yield call(contractApi.updateContractProject,payload.value);
            if (contract_changeProject.code == 0 || contract_changeProject.code == '0') {
                yield put({
                    type: 'showDetail',
                    payload: {contract_name: payload.c_name,contract_code:payload.c_code,company_id:company_id }          
                }); 
                util.success("关联成功");
            }else{
                util.error("关联失败");
            }                 
        },


        /**
         * 发票取消关联合同.
         */
       * updateInvoice({ payload }, { call,select, put }){
            console.log("发票号码",payload.invoice_no_short);
            // 公司编号，目前暂作死的
            const company_id = 1;
            const { contract_name,contract_code } = yield select(_ => _.contract_model);
            let updateInvoiceList = yield call(contractApi.updateInvoiceChange,{invoice_no_short:payload.invoice_no_short, contract_code, contract_name});
            if (updateInvoiceList.code == 0 || updateInvoiceList.code == '0') {
                yield put({
                    type: 'showDetail',
                    payload: { contract_name: payload.c_name,contract_code:payload.c_code,company_id:company_id}          
                }); 
                util.success("取消关联成功");
            }else{
                util.error("取消关联失败");
            }
            
        },

        /**
         * 
         * @param 合同编辑按钮 
         * 把从数据库的c_list联系人传给model临时存放的contractList中去，用于编辑时展示
         */
        * edit({ payload }, { call,select, put }){
            const { c_list } = yield select(_ => _.contract_model);
            yield put({
                type: 'updateState',
                payload: { contractList: c_list}          
            }); 
        },

        /**
         * 添加联系方式.
         */
       * detailContact({ payload }, { call,select, put }){
        const { contractList,contractList1 } = yield select(_ => _.contract_model);
            // 把新加的数据放进model临时存放数组中 
            contractList.push(payload.contact);                 
                yield put({
                    type: 'updateState',
                    payload: {contractList:contractList}          
                });             
        },
        /**
         * 删除联系方式.
         * 删除临时model中的数据
         */
        * deleteContact({ payload }, { select, call, put }){
            const { contractList,contract_name,contract_code } = yield select(_ => _.contract_model); 
            const company_id = 1;
                for (var i = 0; i < contractList.length;  i++){
                    if (contractList[i].name == payload.name)
                        contractList.splice(i,1);
                }
                             
            console.log("NewcontactList2",contractList);
            contractList["contract_name"]=contract_name;
                yield put({
                    type: 'updateState',
                    payload: {contractList:contractList}          
                });
                yield put({
                    type: 'showDetail',
                    payload: {contract_name,contract_code,company_id}          
                });
        },
        /**
         * 保存.
         */
        * detailSave({ payload }, { select, call, put }){                             
            const { contract_name,contract_code,contractList,c_list} = yield select(_ => _.contract_model); 
            const company_id = 1;
            // 传入合同名字
            payload.values["name"]=contract_name; 
            payload.values["code"]=contract_code;                   
            payload.values["t_link_info"]=contractList;            
            // 拿到上传文件
            let x = (payload.arr_files).join(',');
            payload.values["contract_files"] = x;                   
            let y = (payload.arr_link_info).join(',');
            payload.values["contract_business1"] = y;
            let z = (payload.arr_docs).join(',');
            payload.values["contract_business2"] = z;
            let a = (payload.arr_b_link_info).join(',');
            payload.values["contract_finish1"] = a;
            let b = (payload.arr_f_docs).join(',');
            payload.values["contract_finish2"] = b;
            let c = (payload.arr_f_record).join(',');
            payload.values["contract_record1"] = c;
            let d = (payload.arr_b_record).join(',');
            payload.values["contract_record2"] = d;
            let e = (payload.arr_s_record).join(',');
            payload.values["contract_record3"] = e;                      
            
            console.log("res",payload.values);
            let updateContractList = yield call(contractApi.updateContract,payload.values);
            if (updateContractList.code == 0 || updateContractList.code == '0') {
                yield put({
                    type: 'showDetail',
                    payload: {contract_name,contract_code,company_id} 
                }); 
                yield put({
                    type: 'updateState',
                    payload: {contractList:[]} 
                }); 
                util.success("保存成功");
            }else{
                util.error("编辑失败");
            }

        },
        /**
         * 取消编辑.
         * 并把c_list的数据传给contractList用于下次的展示，防止数据内容丢失
         */
        * cancelEdit({ payload }, { select,put }) { 
          const { c_list} = yield select(_ => _.contract_model);           
            yield put({
                type: 'updateState',
                payload: { contractList:c_list }
            });                
        },

        /**
         * 页面大小发生改变.
         */
        * changePageOrPageSize({ payload }, { put }) {
            const company_id = 1;
            yield put({
                type: 'updateState',
                payload: { page: payload.page, pageSize: payload.pageSize }
            });
            //重新获取一次数据
            yield put({
                type: 'tableList',
                payload: {company_id:company_id,user_id:payload.user_id}
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