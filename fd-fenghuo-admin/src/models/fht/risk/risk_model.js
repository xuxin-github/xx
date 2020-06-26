// 引入接口.
import riskApi from '../../../api/risk/riskApi';

export default {
    namespace: 'risk_model',
    state: {
        // 总体经营风险.
        totalList: {},
        // 总体经营风险中的税务合规风险.
        totalTaxList: {},
        // 总体经营风险中的市场监管风险.
        totalMarketList: {},
        // 总体经营风险中的内部风控风险.
        totalInternalList: {},
        // 总体经营风险中的供应商风险.
        totalSupplierList: {},

        // 市场监管风险.
        marketList: {},
        // 风险发票金额统计.
        invoiceMoneyList: {},
        // 内部风控风险.
        internalList: {},
        // 供应商风险.
        supplierList: {},
        // 风控指标趋势图(月度).
        indicatorsList: {},

        // 风控中心查询所有合同.
        contractList: [],
        // 风控中心查询所有票据.
        invoiceList: [],
        // 风控中心查询所有供应商.
        providerList: [],
        // 风控中心查询所有项目.
        projectList: [],
    },
    effects: {
        /**
         * 总体经营风险.
         */
        * total({ payload, callback }, { call, put }) {
            let total = yield call(riskApi.totalRisk, { ym: payload.totalym });
            if (total.code === 0 || total.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { totalList: total.data },
                });
            }
            callback(total.code);
        },
        /**
         * 总体经营风险中的税务合规风险.
         */
        * totalTax({ payload }, { call, put }) {
            let totalTax = yield call(riskApi.totalTaxRisk, { ym: payload.totalTaxym });
            if (totalTax.code === 0 || totalTax.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { totalTaxList: totalTax.data },
                });
            }
        },
        /**
         * 总体经营风险中的市场监管风险.
         */
        * totalMarket({ payload }, { call, put }) {
            let totalMarket = yield call(riskApi.marketRisk, { ym: payload.marketym });
            if (totalMarket.code === 0 || totalMarket.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { totalMarketList: totalMarket.data },
                });
            }
        },
        /**
         * 总体经营风险中的内部风控风险.
         */
        * totalInternal({ payload }, { call, put }) {
            let totalInternal = yield call(riskApi.internalRisk, { ym: payload.internalym });
            if (totalInternal.code === 0 || totalInternal.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { totalInternalList: totalInternal.data },
                });
            }
        },
        /**
         * 总体经营风险中的供应商风险.
         */
        * totalSupplier({ payload }, { call, put }) {
            let totalSupplier = yield call(riskApi.supplierRisk, { ym: payload.supplierym });
            if (totalSupplier.code === 0 || totalSupplier.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { totalSupplierList: totalSupplier.data },
                });
            }
        },
        /**
         * 市场监管风险列表.
         */
        * market({ payload }, { call, put }) {
            let market = yield call(riskApi.marketRisk, { ym: payload.marketym });
            if (market.code === 0 || market.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { marketList: market.data },
                });
            }
        },
        /**
         * 风险发票金额统计.
         */
        * invoiceMoney({ payload }, { call, put }) {
            let invoiceMoney = yield call(riskApi.invoiceMoneyRisk, { ym: payload.invoiceMoneyym });
            if (invoiceMoney.code === 0 || invoiceMoney.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { invoiceMoneyList: invoiceMoney.data },
                });
            }
        },
        /**
         * 内部风控风险.
         */
        * internal({ payload }, { call, put }) {
            let internal = yield call(riskApi.internalRisk, { ym: payload.internalym });
            if (internal.code === 0 || internal.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { internalList: internal.data },
                });
            }
        },
        /**
         * 供应商风险.
         */
        * supplier({ payload }, { call, put }) {
            let supplier = yield call(riskApi.supplierRisk, { ym: payload.supplierym });
            if (supplier.code === 0 || supplier.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { supplierList: supplier.data },
                });
            }
        },
        /**
         * 风控指标趋势图(月度).
         */
        * indicators({ payload }, { call, put }) {
            let indicators = yield call(riskApi.indicatorsRisk, { ym: payload.indicatorsym });
            if (indicators.code === 0 || indicators.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { indicatorsList: indicators.data },
                });
            }
        },
        /**
         * 风控中心查询所有合同.
         */
        * allContract({ payload, callback }, { call, put }) {
            let contract = yield call(riskApi.allContract);
            if (contract.code === 0 || contract.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { contractList: contract.data },
                });
            }
            callback(contract.code);
        },
        /**
         * 风控中心查询所有票据.
         */
        * allInvoice({ payload }, { call, put }) {
            let invoice = yield call(riskApi.allInvoice);
            if (invoice.code === 0 || invoice.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { invoiceList: invoice.data },
                });
            }
        },
        /**
         * 风控中心查询所有供应商.
         */
        * allProvider({ payload }, { call, put }) {
            let provider = yield call(riskApi.allProvider);
            if (provider.code === 0 || provider.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { providerList: provider.data },
                });
            }
        },
        /**
         * 风控中心查询所有项目.
         */
        * allProject({ payload }, { call, put }) {
            let project = yield call(riskApi.allProject);
            if (project.code === 0 || project.code === '0') {
                yield put({
                    type: 'updateState',
                    payload: { projectList: project.data },
                });
            }
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