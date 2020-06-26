import React from 'react';
import { Row, Col, Divider, Select } from 'antd';
import styles from './risk_visual_center.css';
import {
    G2,
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Guide,
    Shape,
    Facet,
    Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import { connect } from 'dva';
import moment from 'moment';

const { Option } = Select;
const { Line, Html, Arc, Text } = Guide;

@connect(({ risk_model }) => ({
    totalList: risk_model.totalList,
    totalTaxList: risk_model.totalTaxList,
    totalMarketList: risk_model.totalMarketList,
    totalInternalList: risk_model.totalInternalList,
    totalSupplierList: risk_model.totalSupplierList,
    marketList: risk_model.marketList,
    invoiceMoneyList: risk_model.invoiceMoneyList,
    internalList: risk_model.internalList,
    supplierList: risk_model.supplierList,
    indicatorsList: risk_model.indicatorsList,
}))

class risk_visual_center extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 总体经营风险中的风险类型标识.
            totalRiskTypeNo: '税务合规风险',
            // 风控指标趋势线标识.
            riskTypeNo: "1",
            // 风控设置分数.
            risk: {},
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // 总体经营风险.
        dispatch({
            type: 'risk_model/total',
            payload: { totalym: moment().format('YYYYMM') },
            callback: code => {
                if (code === 0) {
                    // 对应的风险预警值.
                    dispatch({
                        type: 'system_model/query',
                        callback: (data) => {
                            this.setState({
                                risk: data,
                            });
                        }
                    });
                    // 税务合规风险.
                    dispatch({
                        type: 'risk_model/totalTax',
                        payload: { totalTaxym: moment().format('YYYYMM') }
                    });
                    // 总体经营风险中的市场监管风险.
                    dispatch({
                        type: 'risk_model/totalMarket',
                        payload: { marketym: moment().format('YYYYMM') }
                    });
                    // 总体经营风险中的内部风控风险.
                    dispatch({
                        type: 'risk_model/totalInternal',
                        payload: { internalym: moment().format('YYYYMM') }
                    });
                    // 总体经营风险中的供应商风险.
                    dispatch({
                        type: 'risk_model/totalSupplier',
                        payload: { supplierym: moment().format('YYYYMM') }
                    });
                    // 市场监管风险.
                    dispatch({
                        type: 'risk_model/market',
                        payload: { marketym: moment().format('YYYYMM') }
                    });
                    // 风险发票金额统计.
                    dispatch({
                        type: 'risk_model/invoiceMoney',
                        payload: { invoiceMoneyym: moment().format('YYYYMM') }
                    });
                    // 内部风控风险.
                    dispatch({
                        type: 'risk_model/internal',
                        payload: { internalym: moment().format('YYYYMM') }
                    });
                    // 供应商风险.
                    dispatch({
                        type: 'risk_model/supplier',
                        payload: { supplierym: moment().format('YYYYMM') }
                    });
                    // 风控指标趋势图(月度).
                    dispatch({
                        type: 'risk_model/indicators',
                        payload: { indicatorsym: moment().format('YYYY') }
                    });
                }
            }
        });
    }

    // 总体经营风险(重新请求数据).
    changeTotalMonth = (value) => {
        let year = value.split(".")[0];
        let month = value.split(".")[1];
        let time = year + month
        const { dispatch } = this.props;
        // 总体经营风险.
        dispatch({
            type: 'risk_model/total',
            payload: { totalym: time },
        });
        // 税务合规风险.
        dispatch({
            type: 'risk_model/totalTax',
            payload: { totalTaxym: time }
        });
        // 市场监管风险.
        dispatch({
            type: 'risk_model/totalMarket',
            payload: { marketym: time }
        });
        // 内部风控风险.
        dispatch({
            type: 'risk_model/totalInternal',
            payload: { internalym: time }
        });
        // 供应商风险.
        dispatch({
            type: 'risk_model/totalSupplier',
            payload: { supplierym: time }
        });
    }
    // 修改总体经营风险的风险类型.
    changeTotalRiskType = (ev) => {
        let value = ev.target._id;
        if (value != undefined) {
            let type = value.split("-")[3];
            if (type != '' && type != '扣分' && type != '综合评分') {
                this.setState({
                    totalRiskTypeNo: type,
                });
            }
        }
    }

    // 市场监管风险(重新请求数据).
    changeMarketMonth = (value) => {
        let year = value.split(".")[0];
        let month = value.split(".")[1];
        let time = year + month;
        // 市场监管风险.
        const { dispatch } = this.props;
        dispatch({
            type: 'risk_model/market',
            payload: { marketym: time }
        });
    }

    // 风险发票金额统计(重新请求数据).
    changeInvoiceMonth = (value) => {
        let year = value.split(".")[0];
        let month = value.split(".")[1];
        let time = year + month;
        // 风险发票金额统计.
        const { dispatch } = this.props;
        dispatch({
            type: 'risk_model/invoiceMoney',
            payload: { invoiceMoneyym: time }
        });
    }

    // 内部风控风险(重新请求数据).
    changeInternalMonth = (value) => {
        let year = value.split(".")[0];
        let month = value.split(".")[1];
        let time = year + month;
        // 内部风控风险.
        const { dispatch } = this.props;
        dispatch({
            type: 'risk_model/internal',
            payload: { internalym: time }
        });
    }

    // 供应商风险(重新请求数据).
    changeSupplierMonth = (value) => {
        let year = value.split(".")[0];
        let month = value.split(".")[1];
        let time = year + month;
        // 供应商风险.
        const { dispatch } = this.props;
        dispatch({
            type: 'risk_model/supplier',
            payload: { supplierym: time }
        });
    }

    // 风控指标趋势图(月度).
    // 选择风控指标趋势线.
    changeRiskType = (value) => {
        this.setState({
            riskTypeNo: value,
        })
    }
    // 风控指标趋势图(月度), 改变年份.
    changeYear = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'risk_model/indicators',
            payload: { indicatorsym: value + '' }
        });
    }

    render() {
        const { totalList, totalTaxList, totalMarketList, totalInternalList, totalSupplierList, marketList, invoiceMoneyList, internalList, supplierList, indicatorsList } = this.props;
        const { riskTypeNo, totalRiskTypeNo, risk } = this.state;
        const p1 = risk.p1 || 0;
        const p2_1 = risk.p2_1 || 0;
        const p2_2 = risk.p2_2 || 0;
        const p2_3 = risk.p2_3 || 0;
        const p2_4 = risk.p2_4 || 0;
        // 计算年份(从2019年开始, 把下面的2017改为2019就可以了).
        const year = [];
        for (let i = (moment().format('YYYY') - 2019); i >= 0; i--) {
            let arr = 2019 + i;
            year.push(arr);
        }
        // 计算年月(把年月分开算, 到当前年月结束, 从2019年开始, 把下面的2018换成2019就行了).
        const month = [];
        for (let i = (moment().format('YYYY') - 2019); i >= 0; i--) {
            let arrY = 2019 + i;
            if (arrY === 2019) {
                for (let i = 12; i >= 11; i--) {
                    let arrM = i;
                    month.push(arrY + "." + arrM);
                }
            } else if (arrY > 2019 && arrY < Number(moment().format('YYYY'))) {
                for (let i = 12; i > 0; i--) {
                    if (i < 10) {
                        month.push(arrY + ".0" + i);
                    } else {
                        month.push(arrY + "." + i);
                    }
                }
            } else if (arrY === Number(moment().format('YYYY'))) {
                for (let i = Number((moment().format('MM'))); i > 0; i--) {
                    if (i < 10) {
                        month.push(arrY + ".0" + i);
                    } else {
                        month.push(arrY + "." + i);
                    }
                }
            }
        }
        // 总体经营风险.
        // 下面的代码会被作为 cdn script 注入 注释勿删
        // CDN START
        Shape.registerShape('point', 'pointer', {
            drawShape(cfg, group) {
                let point = cfg.points[0]; // 获取第一个标记点
                point = this.parsePoint(point);
                const center = this.parsePoint({ // 获取极坐标系下画布中心点
                    x: 0,
                    y: 0,
                });
                // 绘制指针
                group.addShape('line', {
                    attrs: {
                        x1: center.x,
                        y1: center.y,
                        x2: point.x,
                        y2: point.y,
                        stroke: cfg.color,
                        lineWidth: 5,
                        lineCap: 'round',
                    },
                });
                return group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 12,
                        stroke: cfg.color,
                        lineWidth: 4.5,
                        fill: '#fff',
                    },
                });
            },
        });
        const { DataView } = DataSet;
        const total = totalList.overallBusinessRisk || [];
        const totalData = total;
        let total_p1 = 1;
        let total_p2_1 = 0;
        let total_p2_2 = 0;
        let total_p2_3 = 0;
        let total_p2_4 = 0;
        if (totalData.length != 0) {
            total_p1 = totalData[4].value;
            total_p2_1 = totalData[0].value;
            total_p2_2 = totalData[1].value;
            total_p2_3 = totalData[2].value;
            total_p2_4 = totalData[3].value;
        }
        let total_value = Number((100 - total_p1).toFixed(2));
        const totalMeterData = [
            { value: total_value },
        ];
        const totalMeterCols = {
            value: {
                min: 0,
                max: 100,
                tickInterval: 20,
                nice: false,
            },
        };
        // 总体经营风险中的税务合规风险.
        // 下面的代码会被作为 cdn script 注入 注释勿删
        // CDN START
        // 构造数据
        const totalMeterTaxData1 = [];
        for (let i = 0; i <= 25; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            totalMeterTaxData1.push(item);
        }

        const totalMeterTaxData2 = [];
        for (let i = 0; i <= 25; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            if (total_p2_1 - i <= 0) {
                item.value = 40;
            }
            if (i - total_p2_1 >= 1) {
                item.value = 0;
            }
            totalMeterTaxData2.push(item);
        }
        const totalMeterTaxCols = {
            type: {
                tickCount: 2,
            },
            value: {
                sync: true,
            },
        };
        const totalTax = totalTaxList.shuiwuheguifengxiantongji || {};
        // 总体经营风险中的市场监管风险.
        const totalMeterMarketData1 = [];
        for (let i = 0; i <= 25; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            totalMeterMarketData1.push(item);
        }

        const totalMeterMarketData2 = [];
        for (let i = 0; i <= 25; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            if (total_p2_2 - i <= 0) {
                item.value = 40;
            }
            if (i - total_p2_2 >= 1) {
                item.value = 0;
            }
            totalMeterMarketData2.push(item);
        }
        const totalMeterMarketCols = {
            type: {
                tickCount: 2,
            },
            value: {
                sync: true,
            },
        };
        const totalMarket = totalMarketList.overallBusinessRisk || [];
        let market_p3_2_1 = 0;
        let market_p3_2_2 = 0;
        let market_p3_2_3 = 0;
        let market_p3_2_4 = 0;
        let market_p3_2_5 = 0;
        let market_p3_2_6 = 0;
        let market_p3_2_7 = 0;
        let market_total = 1;
        if (totalMarket.length != 0) {
            market_p3_2_1 = totalMarket[0].num;
            market_p3_2_2 = totalMarket[1].num;
            market_p3_2_3 = totalMarket[2].num;
            market_p3_2_4 = totalMarket[3].num;
            market_p3_2_5 = totalMarket[4].num;
            market_p3_2_6 = totalMarket[5].num;
            market_p3_2_7 = totalMarket[6].num;
            market_total = Number(market_p3_2_1) + Number(market_p3_2_2) + Number(market_p3_2_3)
                + Number(market_p3_2_4) + Number(market_p3_2_5) + Number(market_p3_2_6) + Number(market_p3_2_7);
        }
        // 总体经营风险中的内部风控风险.
        const totalMeterInternalData1 = [];
        for (let i = 0; i <= 40; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            totalMeterInternalData1.push(item);
        }
        const totalMeterInternalData2 = [];
        for (let i = 0; i <= 40; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            if (total_p2_3 - i <= 0) {
                item.value = 40;
            }
            if (i - total_p2_3 >= 1) {
                item.value = 0;
            }
            totalMeterInternalData2.push(item);
        }
        const totalMeterInternalCols = {
            type: {
                tickCount: 2,
            },
            value: {
                sync: true,
            },
        };
        const totalInternal = totalInternalList.neibufengkongfengxiantongji || {};
        // 总体经营风险中的供应商风险.
        const totalMeterProviderData1 = [];
        for (let i = 0; i <= 10; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            totalMeterProviderData1.push(item);
        }
        const totalMeterProviderData2 = [];
        for (let i = 0; i <= 10; i++) {
            const item = {};
            item.type = `${i}`;
            item.value = 20;
            if (total_p2_4 - i <= 0) {
                item.value = 40;
            }
            if (i - total_p2_4 >= 1) {
                item.value = 0;
            }
            totalMeterProviderData2.push(item);
        }
        const totalMeterProviderCols = {
            type: {
                tickCount: 2,
            },
            value: {
                sync: true,
            },
        };
        const totalSupplier = totalSupplierList.gongyingshangfenxiantongji || {};
        // 市场监管风险.
        const market = marketList.overallBusinessRisk || [];
        const marketData = market;
        const marketCols = {};
        // 风险发票金额统计.
        const invoiceMoney = invoiceMoneyList.fengxianfapiaotongji || [];
        const riskMoneyData = invoiceMoney;
        const riskMoneyDv = new DataView();
        riskMoneyDv.source(riskMoneyData).transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent',
        });
        const riskMoneyCols = {};
        const riskMoneyDv1 = new DataView();
        riskMoneyDv1.source(riskMoneyData).transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent',
        });
        // 内部风控风险.
        const internal = internalList.neibufengkongfengxiantongji || {};
        const internalData = [
            {
                type: "交付信息",
                count: internal.jiaofu ? internal.jiaofu : 0,
            },
            {
                type: "业务流程",
                count: internal.yewu ? internal.yewu : 0,
            },
            {
                type: "内部审批",
                count: internal.neibu ? internal.neibu : 0,
            },
            {
                type: "合同相关",
                count: internal.hetong ? internal.hetong : 0,
            },
        ];
        const internalDs = new DataSet();
        const internalDv = internalDs.createView().source(internalData);
        const internalTotal = internal.total;
        // 供应商风险.
        const supplier = supplierList.gongyingshangfenxiantongji || {};
        const supplierData = [
            {
                name: '企业注册年限风险',
                count: supplier.p3_4_1 ? supplier.p3_4_1 : 0,
            },
            {
                name: '企业注册资本风险',
                count: supplier.p3_4_2 ? supplier.p3_4_2 : 0,
            },
            {
                name: '企业受惩黑名单',
                count: supplier.p3_4_3 ? supplier.p3_4_3 : 0,
            },
            {
                name: '法院执行公告',
                count: supplier.p3_4_4 ? supplier.p3_4_4 : 0,
            },
            {
                name: '法院失信公告',
                count: supplier.p3_4_5 ? supplier.p3_4_5 : 0,
            },
            {
                name: '处罚曝光台',
                count: supplier.p3_4_6 ? supplier.p3_4_6 : 0,
            },
        ];
        const supplierDs = new DataSet();
        const supplierDv = supplierDs.createView().source(supplierData);
        const supplierTotal = supplier.total;
        // 风控指标趋势图(月度).
        const indicators = indicatorsList.fengkongzhibiaoqushitu || [];
        const riskData = indicators;
        const riskTotalCols = {
            month: {
                range: [0, 1],
                alias: '综合得分'
            },
            p_total: {
                min: 0,
                max: 100,
            },
        };
        const riskTaxCols = {
            month: {
                range: [0, 1],
                alias: '税务合规风险'
            },
            p2_1: {
                min: 0,
                max: 25,
            },
        };
        const riskMarketCols = {
            month: {
                range: [0, 1],
                alias: '市场监管风险'
            },
            p2_2: {
                min: 0,
                max: 25,
            },
        };
        const riskInternalCols = {
            month: {
                range: [0, 1],
                alias: '内部风控风险'
            },
            p2_3: {
                min: 0,
                max: 40,
            },
        };
        const riskSupplierCols = {
            month: {
                range: [0, 1],
                alias: '供应商风险'
            },
            p2_4: {
                min: 0,
                max: 10,
            },
        };
        return (
            <div>
                {/* 总体经营风险. */}
                <Row className={styles.risk_visual_tital}>
                    <span className={styles.risk_visual_tital_font}>总体经营风险</span>
                    <span style={{ float: 'right' }}>统计月份：
                                <Select defaultValue={moment().format('YYYY.MM')} onChange={this.changeTotalMonth}>
                            {
                                month.map((value, key) => {
                                    return <Option key={key} value={value}>{value}</Option>
                                })
                            }
                        </Select>
                    </span>
                </Row>
                <Row className={styles.risk_total_meter}>
                    <Row className={styles.risk__meter_title}>
                        <div style={{ margin: '9px 0 0 0' }}>
                            <span className={styles.risk_title_meter_font}>本月综合风险概览</span>
                        </div>
                    </Row>
                    <Row gutter={40}>
                        <Col span={12}>
                            <Chart height={244} data={totalMeterData} scale={totalMeterCols} padding="auto" forceFit>
                                <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
                                <Axis
                                    name="value"
                                    zIndex={2}
                                    line={null}
                                    label={{
                                        offset: -16,
                                        textStyle: {
                                            fontSize: 15,
                                            textAlign: 'center',
                                            textBaseline: 'middle',
                                        },
                                    }}
                                    subTickCount={4}
                                    subTickLine={{
                                        length: -8,
                                        stroke: '#fff',
                                        strokeOpacity: 1,
                                    }}
                                    tickLine={{
                                        length: -18,
                                        stroke: '#fff',
                                        strokeOpacity: 1,
                                    }}
                                />
                                <Axis name="1" visible={false} />
                                <Guide>
                                    <Arc
                                        zIndex={0}
                                        start={[p1, 0.965]}
                                        end={[100, 0.965]}
                                        style={{ // 底灰色
                                            stroke: '#37B500',
                                            lineWidth: 25,
                                        }}
                                    />
                                    <Arc
                                        zIndex={0}
                                        start={[0, 0.965]}
                                        end={[p1, 0.965]}
                                        style={{
                                            stroke: '#DD5364',
                                            lineWidth: 25,
                                        }}
                                    />
                                    <Html
                                        position={['50%', '95%']}
                                        html=
                                        {() => (
                                            `<div style="text-align: center;font-size: 10px!important;">
                                                    <p style="font-size: 2.5em;color: ${totalMeterData[0].value > p1 ? '#37B500' : '#DD5364'};margin: 0;">
                                                    ${totalMeterData[0].value}</p>
				                                </div>`
                                        )}
                                    />
                                </Guide>
                                <Geom
                                    type="point"
                                    position="value*1"
                                    shape="pointer"
                                    color={['value', (value) => {
                                        if (value > p1)
                                            return '#37B500';
                                        else
                                            return '#DD5364';
                                    }]}
                                    active={false}
                                />
                            </Chart>
                        </Col>
                        <Col span={12}>
                            <div className={styles.risk_meter_div}>
                                <Row>
                                    <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险评估项</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险得分</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>标准分</span></div></Col>
                                </Row>
                                <Row style={{ color: ((total_p2_1) <= p2_1) ? '#DD5364' : '#4A4A4A' }}>
                                    <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>税务合规风险</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{total_p2_1.toFixed(2)}</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>25</span></div></Col>
                                </Row>
                                <Row style={{ color: ((total_p2_2) <= p2_2) ? '#DD5364' : '#4A4A4A' }}>
                                    <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>市场监管风险</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{total_p2_2.toFixed(2)}</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>25</span></div></Col>
                                </Row>
                                <Row style={{ color: ((total_p2_3) <= p2_3) ? '#DD5364' : '#4A4A4A' }}>
                                    <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>内部风控风险</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{total_p2_3.toFixed(2)}</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>40</span></div></Col>
                                </Row>
                                <Row style={{ color: ((total_p2_4) <= p2_4) ? '#DD5364' : '#4A4A4A' }}>
                                    <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>供应商风险</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{total_p2_4.toFixed(2)}</span></div></Col>
                                    <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>10</span></div></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Row style={{ margin: '20px 0 0 0' }}>
                    <Col span={12} style={{ padding: '0 20px 0 0' }}>
                        <Row className={styles.risk__meter_title}>
                            <div style={{ margin: '9px 0 0 0' }}>
                                <span className={styles.risk_title_meter_font}>税务合规风险</span>
                            </div>
                        </Row>
                        <div style={{ background: 'rgba(246,246,246,1)' }}>
                            <Row>
                                <Chart height={148} scale={totalMeterTaxCols} padding="auto" forceFit>
                                    <View data={totalMeterTaxData1}>
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_1)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Axis
                                            name="type"
                                            grid={null}
                                            line={null}
                                            tickLine={null}
                                            label={{
                                                offset: -15,
                                                textStyle: {
                                                    fontSize: 12,
                                                    fill: '#CBCBCB',
                                                    textAlign: 'center',
                                                },
                                            }}
                                        />
                                        <Axis name="value" visible={false} />
                                    </View>
                                    <View data={totalMeterTaxData2} >
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_1)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Guide>
                                            <Text
                                                position={['50%', '65%']}
                                                content={total_p2_1.toFixed(2)}
                                                style={{
                                                    fill: total_p2_1 > p2_1 ? '#37B500' : '#DD5364',
                                                    fontSize: 20,
                                                    textAlign: 'center',
                                                    textBaseline: 'middle',
                                                }}
                                            />
                                        </Guide>
                                    </View>
                                </Chart>
                            </Row>
                            <Row>
                                <div className={styles.risk_meter_div} style={{ margin: '10px 20px 20px 20px' }}>
                                    <Row>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险子评估项</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险合同数</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>月占比</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalTax.canyuxukai ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>参与虚开</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}> {totalTax.canyuxukai ? totalTax.canyuxukai : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalTax.canyuxukai / totalTax.total * 100 ? totalTax.canyuxukai / totalTax.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalTax.weifashourang ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>违法受让</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalTax.weifashourang ? totalTax.weifashourang : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalTax.weifashourang / totalTax.total * 100 ? totalTax.weifashourang / totalTax.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalTax.qudeyichang ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>取得异常</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalTax.qudeyichang ? totalTax.qudeyichang : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalTax.qudeyichang / totalTax.total * 100 ? totalTax.qudeyichang / totalTax.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>善意取得</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>0</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>0.00%</span></div></Col>
                                    </Row>
                                    <Row style={{ color: '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>未取得凭证</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>0</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>0.00%</span></div></Col>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Col>
                    <Col span={12} style={{ padding: '0 0 0 20px' }}>
                        <Row className={styles.risk__meter_title}>
                            <div style={{ margin: '9px 0 0 0' }}>
                                <span className={styles.risk_title_meter_font}>内部风控风险</span>
                            </div>
                        </Row>
                        <div style={{ background: 'rgba(246,246,246,1)' }}>
                            <Row>
                                <Chart height={148} scale={totalMeterInternalCols} padding="auto" forceFit>
                                    <View data={totalMeterInternalData1}>
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_3)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Axis
                                            name="type"
                                            grid={null}
                                            line={null}
                                            tickLine={null}
                                            label={{
                                                offset: -15,
                                                textStyle: {
                                                    fontSize: 12,
                                                    fill: '#CBCBCB',
                                                    textAlign: 'center',
                                                },
                                            }}
                                        />
                                        <Axis name="value" visible={false} />
                                    </View>
                                    <View data={totalMeterInternalData2} >
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_3)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Guide>
                                            <Text
                                                position={['50%', '65%']}
                                                content={total_p2_3.toFixed(2)}
                                                style={{
                                                    fill: total_p2_3 > p2_3 ? '#37B500' : '#DD5364',
                                                    fontSize: 20,
                                                    textAlign: 'center',
                                                    textBaseline: 'middle',
                                                }}
                                            />
                                        </Guide>
                                    </View>
                                </Chart>
                            </Row>
                            <Row>
                                <div className={styles.risk_meter_div} style={{ margin: '10px 20px 20px 20px' }}>
                                    <Row>
                                        <Col className={styles.risk_meter_size_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险子评估项</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险合同数</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>月占比</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalInternal.hetong ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_size_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>合同相关</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalInternal.hetong ? totalInternal.hetong : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalInternal.hetong / totalInternal.total * 100 ? totalInternal.hetong / totalInternal.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalInternal.neibu ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_size_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>内部审核</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalInternal.neibu ? totalInternal.neibu : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalInternal.neibu / totalInternal.total * 100 ? totalInternal.neibu / totalInternal.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalInternal.yewu ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_size_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>业务流程</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalInternal.yewu ? totalInternal.yewu : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalInternal.yewu / totalInternal.total * 100 ? totalInternal.yewu / totalInternal.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalInternal.jiaofu ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_size_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>交付信息</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalInternal.jiaofu ? totalInternal.jiaofu : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_size_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalInternal.jiaofu / totalInternal.total * 100 ? totalInternal.jiaofu / totalInternal.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row style={{ margin: '20px 0 0 0' }}>
                    <Col span={12} style={{ padding: '0 20px 0 0' }}>
                        <Row className={styles.risk__meter_title}>
                            <div style={{ margin: '9px 0 0 0' }}>
                                <span className={styles.risk_title_meter_font}>市场监管风险</span>
                            </div>
                        </Row>
                        <div style={{ background: 'rgba(246,246,246,1)' }}>
                            <Row>
                                <Chart height={148} scale={totalMeterMarketCols} padding="auto" forceFit>
                                    <View data={totalMeterMarketData1}>
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_2)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Axis
                                            name="type"
                                            grid={null}
                                            line={null}
                                            tickLine={null}
                                            label={{
                                                offset: -15,
                                                textStyle: {
                                                    fontSize: 12,
                                                    fill: '#CBCBCB',
                                                    textAlign: 'center',
                                                },
                                            }}
                                        />
                                        <Axis name="value" visible={false} />
                                    </View>
                                    <View data={totalMeterMarketData2} >
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_2)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Guide>
                                            <Text
                                                position={['50%', '65%']}
                                                content={total_p2_2.toFixed(2)}
                                                style={{
                                                    fill: total_p2_2 > p2_2 ? '#37B500' : '#DD5364',
                                                    fontSize: 20,
                                                    textAlign: 'center',
                                                    textBaseline: 'middle',
                                                }}
                                            />
                                        </Guide>
                                    </View>
                                </Chart>
                            </Row>
                            <Row>
                                <div className={styles.risk_meter_div} style={{ margin: '10px 20px 20px 20px' }}>
                                    <Row>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险子评估项</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险合同数</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>月占比</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_1 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>管理费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}> {market_p3_2_1}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_1 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_2 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>咨询费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{market_p3_2_2}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_2 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_3 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>会议费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{market_p3_2_3}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_3 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_4 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>培训费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{market_p3_2_4}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_4 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_5 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>旅游费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{market_p3_2_5}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_5 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: market_p3_2_6 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>手续费类发票</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{market_p3_2_6}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(market_p3_2_6 / market_total * 100).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Col>
                    <Col span={12} style={{ padding: '0 0 0 20px' }}>
                        <Row className={styles.risk__meter_title}>
                            <div style={{ margin: '9px 0 0 0' }}>
                                <span className={styles.risk_title_meter_font}>供应商风险</span>
                            </div>
                        </Row>
                        <div style={{ background: 'rgba(246,246,246,1)' }}>
                            <Row>
                                <Chart height={148} scale={totalMeterProviderCols} padding="auto" forceFit>
                                    <View data={totalMeterProviderData1}>
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_4)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Axis
                                            name="type"
                                            grid={null}
                                            line={null}
                                            tickLine={null}
                                            label={{
                                                offset: -15,
                                                textStyle: {
                                                    fontSize: 12,
                                                    fill: '#CBCBCB',
                                                    textAlign: 'center',
                                                },
                                            }}
                                        />
                                        <Axis name="value" visible={false} />
                                    </View>
                                    <View data={totalMeterProviderData2} >
                                        <Coord type="polar" startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.8} innerRadius={0.75} />
                                        <Geom
                                            type="interval"
                                            position="type*value"
                                            color={['type', (type) => {
                                                if (type > p2_4)
                                                    return '#37B500';
                                                else
                                                    return '#DD5364';
                                            }]}
                                            size={3}
                                        />
                                        <Guide>
                                            <Text
                                                position={['50%', '65%']}
                                                content={total_p2_4.toFixed(2)}
                                                style={{
                                                    fill: total_p2_4 > p2_4 ? '#37B500' : '#DD5364',
                                                    fontSize: 20,
                                                    textAlign: 'center',
                                                    textBaseline: 'middle',
                                                }}
                                            />
                                        </Guide>
                                    </View>
                                </Chart>
                            </Row>
                            <Row>
                                <div className={styles.risk_meter_div} style={{ margin: '10px 20px 20px 20px' }}>
                                    <Row>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险子评估项</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>风险合同数</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_th_meter_font}>月占比</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_1 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>企业注册年限风险</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_1 ? totalSupplier.p3_4_1 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_1 / totalSupplier.total * 100 ? totalSupplier.p3_4_1 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_2 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>企业注册资本风险</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_2 ? totalSupplier.p3_4_2 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_2 / totalSupplier.total * 100 ? totalSupplier.p3_4_2 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_3 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>受惩黑名单</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_3 ? totalSupplier.p3_4_3 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_3 / totalSupplier.total * 100 ? totalSupplier.p3_4_3 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_4 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>法院执行公告</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_4 ? totalSupplier.p3_4_4 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_4 / totalSupplier.total * 100 ? totalSupplier.p3_4_4 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_5 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>法院失信公告</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_5 ? totalSupplier.p3_4_5 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_5 / totalSupplier.total * 100 ? totalSupplier.p3_4_5 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                    <Row style={{ color: totalSupplier.p3_4_6 ? '#DD5364' : '#4A4A4A' }}>
                                        <Col className={styles.risk_meter_row_col} span={10}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>处罚曝光台</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{totalSupplier.p3_4_6 ? totalSupplier.p3_4_6 : 0}</span></div></Col>
                                        <Col className={styles.risk_meter_row_col} span={7}><div style={{ margin: '9px 0 0 0' }}><span className={styles.risk_td_meter_font}>{`${(totalSupplier.p3_4_6 / totalSupplier.total * 100 ? totalSupplier.p3_4_6 / totalSupplier.total * 100 : 0).toFixed(2)}%`}</span></div></Col>
                                    </Row>
                                </div>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '50px 0' }} />
                {/* 市场监管风险和风险发票统计. */}
                <div className={styles.risk_visual_tital}>
                    <Row gutter={40}>
                        <Col span={12}>
                            <Row>
                                <span className={styles.risk_visual_tital_font}>市场监管风险</span>
                                <span style={{ float: 'right' }}>统计月份：
                                        <Select defaultValue={moment().format('YYYY.MM')} onChange={this.changeMarketMonth}>
                                        {
                                            month.map((value, key) => {
                                                return <Option key={key} value={value}>{value}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </Row>
                            <Row>
                                <div style={{ background: 'rgba(246,246,246,1)', margin: '20px 0 0 0', height: '240px' }}>
                                    <Chart height={240} data={marketData} padding="auto" scale={marketCols} forceFit>
                                        <Axis name="month" position="bottom" line={null} tickLine={null}
                                            label={{
                                                formatter(text) {
                                                    if (text == "01") {
                                                        return "管理";
                                                    } else if (text == "02") {
                                                        return "咨询";
                                                    } else if (text == "03") {
                                                        return "会议";
                                                    } else if (text == "04") {
                                                        return "培训";
                                                    } else if (text == "05") {
                                                        return "旅游";
                                                    } else if (text == "06") {
                                                        return "手续";
                                                    } else if (text == "07") {
                                                        return "其他";
                                                    }
                                                }
                                            }}
                                        />
                                        <Axis name="num" visible={false} />
                                        <Tooltip
                                            crosshairs={{
                                                type: "y"
                                            }}

                                        />
                                        <Geom type="interval" position="month*num"
                                            tooltip={['month*num', (month, num) => {
                                                return {
                                                    //自定义 tooltip 上显示的 title 显示内容等。
                                                    title: month == '01' ? '管理费类发票' : month == '02' ? '咨询费类发票' : month == '03' ? '会议费类发票' : month == '04' ?
                                                        '培训费类发票' : month == '05' ? '旅游费类发票' : month == '06' ? '手续费类发票' : '其他费类发票',
                                                    name: '数量',
                                                    value: num
                                                };
                                            }]}
                                        />
                                    </Chart>
                                </div>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <span className={styles.risk_visual_tital_font}>风险发票金额统计</span>
                                <span style={{ float: 'right' }}>统计月份：
                                        <Select defaultValue={moment().format('YYYY.MM')} onChange={this.changeInvoiceMonth}>
                                        {
                                            month.map((value, key) => {
                                                return <Option key={key} value={value}>{value}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </Row>
                            <Row>
                                <div style={{ margin: '20px 0 0 0', height: '244px' }}>
                                    <Chart
                                        height={244}
                                        data={riskMoneyDv}
                                        scale={riskMoneyCols}
                                        padding="auto"
                                        forceFit
                                    >
                                        <Coord type="theta" radius={0.5} />
                                        <Geom
                                            type="intervalStack"
                                            position="percent"
                                            color={['type', ['#FF6363', '#9400D3', '#F5A623']]}
                                            style={{
                                                lineWidth: 1,
                                                stroke: '#fff',
                                            }}
                                            select={false}
                                        >
                                            <Label
                                                content="type"
                                                offset={-7}
                                                // textStyle={{
                                                //     fontSize: '10', // 文本大小
                                                //     fill: '#fff', // 文本的颜色
                                                // }}
                                                textStyle={(type, percent) => {
                                                    const style = { fontSize: '10' };
                                                    if (percent._origin.value > 0) {
                                                        style.fill = '#fff';
                                                    } else {
                                                        style.fill = 'transparent';
                                                    }
                                                    return style;
                                                }}
                                            />
                                        </Geom>
                                        <View data={riskMoneyDv1} scale={riskMoneyCols}>
                                            <Coord type="theta" radius={0.85} innerRadius={0.5 / 0.65} />
                                            <Geom
                                                type="intervalStack"
                                                position="percent"
                                                color={[
                                                    'name',
                                                    [
                                                        '#F8E71C',
                                                        '#FF9933',
                                                        '#ABF5F5',
                                                        '#56A4FF',
                                                        '#50E3C2',
                                                    ],
                                                ]}
                                                style={{
                                                    lineWidth: 1,
                                                    stroke: '#fff',
                                                }}
                                                select={false}
                                            >
                                                <Label
                                                    content={["name*percent", (item, value) => {
                                                        if (value > 0) {
                                                            return `${item}\n${(value * 100).toFixed(2)}%`;
                                                        }
                                                    }]}
                                                    textStyle={{
                                                        fontSize: '11', // 文本大小
                                                        fontWeight: 'bold', // 文本粗细
                                                    }}
                                                    offset={10}
                                                />
                                            </Geom>
                                        </View>
                                    </Chart>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Divider style={{ margin: '50px 0' }} />
                {/* 内部控制风险和供应商风险. */}
                <div className={styles.risk_visual_tital}>
                    <Row gutter={40}>
                        <Col span={12}>
                            <Row>
                                <span className={styles.risk_visual_tital_font}>内部风控风险</span>
                                <span style={{ float: 'right' }}>统计月份：
                                        <Select defaultValue={moment().format('YYYY.MM')} onChange={this.changeInternalMonth}>
                                        {
                                            month.map((value, key) => {
                                                return <Option key={key} value={value}>{value}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </Row>
                            <Row>
                                <div style={{ margin: '20px 0 0 0', background: 'rgba(246,246,246,1)', height: '240px' }}>
                                    <Chart height={240} padding="auto" data={internalDv} forceFit >
                                        <Coord transpose />
                                        <Tooltip showTitle={false} />
                                        <Axis name="type" position="left" visible={false} />
                                        <Axis name="count" visible={false} />
                                        <Geom
                                            type="interval"
                                            position="type*count"
                                            tooltip={['type*count', (type, count) => {
                                                return {
                                                    //自定义 tooltip 上显示的 title 显示内容等。
                                                    name: '数量',
                                                    value: count
                                                };
                                            }]}
                                        >
                                            <Label
                                                content={["type*count", (type, count) => {
                                                    return `${type}(${count}件\xa0\xa0|\xa0\xa0${(count / internalTotal * 100 ? count / internalTotal * 100 : 0).toFixed(2)}%)`;
                                                }]}
                                                offsetX={-10}
                                                offsetY={16}
                                                textStyle={{
                                                    textAlign: 'start', // 文本对齐方向，可取值为： start middle end
                                                    fill: '#4A4A4A', // 文本的颜色
                                                    fontSize: '12', // 文本大小
                                                    textBaseline: 'bottom' // 文本基准线，可取 top middle bottom，默认为middle
                                                }}
                                                position="bottom"
                                            />
                                        </Geom>
                                    </Chart>
                                </div>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <span className={styles.risk_visual_tital_font}>供应商风险</span>
                                <span style={{ float: 'right' }}>统计月份：
                                        <Select defaultValue={moment().format('YYYY.MM')} onChange={this.changeSupplierMonth}>
                                        {
                                            month.map((value, key) => {
                                                return <Option key={key} value={value}>{value}</Option>
                                            })
                                        }
                                    </Select>
                                </span>
                            </Row>
                            <Row>
                                <div style={{ margin: '20px 0 0 0', background: 'rgba(246,246,246,1)', height: '240px' }}>
                                    <Chart height={240} padding="auto" data={supplierDv} forceFit>
                                        <Coord transpose />
                                        <Axis name="name" position="left" grid={null} line={{
                                            fill: '#DFDFDF',
                                            lineWidth: 1
                                        }} />
                                        <Axis name="count" visible={false} />
                                        <Tooltip showTitle={false} />
                                        <Geom type="interval" position="name*count"
                                            tooltip={['name*count', (name, count) => {
                                                return {
                                                    //自定义 tooltip 上显示的 title 显示内容等。
                                                    name: '数量',
                                                    value: count
                                                };
                                            }]}
                                        >
                                            <Label
                                                content={["name*count", (name, count) => {
                                                    return `${count}件\xa0\xa0|\xa0\xa0${(count / supplierTotal * 100 ? count / supplierTotal * 100 : 0).toFixed(2)}%`;
                                                }]}
                                                textStyle={(name, count) => {
                                                    const style = { textAlign: 'center', textBaseline: 'middle', padding: 'auto' };
                                                    if (name == "0件  |  0.00%") {
                                                        style.fill = 'transparent';
                                                    } else {
                                                        style.fill = '#fff';
                                                    }
                                                    return style;
                                                }}
                                                offset={-37.5} // 设置坐标轴文本 label 距离坐标轴线的距离
                                                position="top"
                                            />
                                        </Geom>
                                    </Chart>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <Divider style={{ margin: '50px 0' }} />
                {/* 风控指标趋势图(月度). */}
                <Row className={styles.risk_visual_tital} style={{ margin: '0 0 40px 0' }}>
                    <Row>
                        <span className={styles.risk_visual_tital_font}>风控指标趋势图(月度)</span>
                        <div style={{ float: 'right' }}>
                            <span>风控指标趋势线：
                                    <Select defaultValue="1" style={{ width: 150 }} onChange={this.changeRiskType}>
                                    <Option value="1">综合得分</Option>
                                    <Option value="2">税务合规风险</Option>
                                    <Option value="3">市场监管风险</Option>
                                    <Option value="4">内部风控风险</Option>
                                    <Option value="5">供应商风险</Option>
                                </Select>
                            </span>
                            <span style={{ marginLeft: '20px' }}>统计年度：
                                    <Select defaultValue={moment().format('YYYY') + "年"} onChange={this.changeYear}>
                                    {
                                        year.map((value, key) => {
                                            return <Option key={key} value={value}>{value + "年"}</Option>
                                        })
                                    }
                                </Select>
                            </span>
                        </div>
                    </Row>
                    <Row>
                        <div style={{ margin: '20px 0 0 0', background: 'rgba(246,246,246,1)', height: '240px' }}>
                            {
                                riskTypeNo === "1" ?
                                    (
                                        <Chart height={240} data={riskData} scale={riskTotalCols} padding="auto" forceFit>
                                            <Legend />
                                            <Axis name="p_total" visible={false} />
                                            <Axis name="month" line={null} tickLine={null}
                                                label={{
                                                    formatter(text) {
                                                        if (text == "01") {
                                                            return "1月";
                                                        } else if (text == "02") {
                                                            return "2月";
                                                        } else if (text == "03") {
                                                            return "3月";
                                                        } else if (text == "04") {
                                                            return "4月";
                                                        } else if (text == "05") {
                                                            return "5月";
                                                        } else if (text == "06") {
                                                            return "6月";
                                                        } else if (text == "07") {
                                                            return "7月";
                                                        } else if (text == "08") {
                                                            return "8月";
                                                        } else if (text == "09") {
                                                            return "9月";
                                                        } else if (text == "10") {
                                                            return "10月";
                                                        } else if (text == "11") {
                                                            return "11月";
                                                        } else if (text == "12") {
                                                            return "12月";
                                                        }
                                                    }
                                                }}
                                                title={{
                                                    textStyle: {
                                                        fontSize: '16',
                                                        textAlign: 'center',
                                                        fill: '#DD5364',
                                                    }, // 坐标轴文本属性配置
                                                    position: 'center', // 标题的位置，**新增**
                                                }}
                                            />
                                            <Tooltip
                                                crosshairs={{
                                                    type: 'y',
                                                }}
                                                showTitle={false}
                                            />
                                            <Geom type="line" position="month*p_total" color="#DD5364"
                                                tooltip={['month*p_total', (month, p_total) => {
                                                    return {
                                                        //自定义 tooltip 上显示的 title 显示内容等。
                                                        name: '平均分',
                                                        value: p_total.toFixed(2)
                                                    };
                                                }]}
                                            />
                                            <Guide>
                                                <Line
                                                    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                                    start={{ month: '01', p_total: p1 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                                    end={{ month: '12', p_total: p1 }} // 同 start
                                                    lineStyle={{
                                                        stroke: '#DD5364', // 线的颜色
                                                        lineDash: [0, 2, 2], // 虚线的设置
                                                        lineWidth: 1, // 线的宽度
                                                    }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
                                                    text={{
                                                        position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                        style: { fill: '#DD5364' }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                                                        offsetY: -10, // {number} y 方向的偏移量
                                                        content: p1, // {string} 文本的内容
                                                    }}
                                                />
                                            </Guide>
                                        </Chart>
                                    )
                                    :
                                    ''
                            }
                            {
                                riskTypeNo === "2" ?
                                    (
                                        <Chart height={240} data={riskData} scale={riskTaxCols} padding="auto" forceFit>
                                            <Legend />
                                            <Axis name="p2_1" visible={false} />
                                            <Axis name="month" line={null} tickLine={null}
                                                label={{
                                                    formatter(text) {
                                                        if (text == "01") {
                                                            return "1月";
                                                        } else if (text == "02") {
                                                            return "2月";
                                                        } else if (text == "03") {
                                                            return "3月";
                                                        } else if (text == "04") {
                                                            return "4月";
                                                        } else if (text == "05") {
                                                            return "5月";
                                                        } else if (text == "06") {
                                                            return "6月";
                                                        } else if (text == "07") {
                                                            return "7月";
                                                        } else if (text == "08") {
                                                            return "8月";
                                                        } else if (text == "09") {
                                                            return "9月";
                                                        } else if (text == "10") {
                                                            return "10月";
                                                        } else if (text == "11") {
                                                            return "11月";
                                                        } else if (text == "12") {
                                                            return "12月";
                                                        }
                                                    }
                                                }}
                                                title={{
                                                    textStyle: {
                                                        fontSize: '16',
                                                        textAlign: 'center',
                                                        fill: '#00D3A4',
                                                    }, // 坐标轴文本属性配置
                                                    position: 'center', // 标题的位置，**新增**
                                                }}
                                            />
                                            <Tooltip
                                                crosshairs={{
                                                    type: 'y',
                                                }}
                                                showTitle={false}
                                            />
                                            <Geom type="line" position="month*p2_1" color="#00D3A4"
                                                tooltip={['month*p2_1', (month, p2_1) => {
                                                    return {
                                                        //自定义 tooltip 上显示的 title 显示内容等。
                                                        name: '平均分',
                                                        value: p2_1.toFixed(2)
                                                    };
                                                }]}
                                            />
                                            <Guide>
                                                <Line
                                                    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                                    start={{ month: '01', p2_1: p2_1 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                                    end={{ month: '12', p2_1: p2_1 }} // 同 start
                                                    lineStyle={{
                                                        stroke: '#00D3A4', // 线的颜色
                                                        lineDash: [0, 2, 2], // 虚线的设置
                                                        lineWidth: 1, // 线的宽度
                                                    }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
                                                    text={{
                                                        position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                        style: { fill: '#00D3A4' }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                                                        offsetY: -10, // {number} y 方向的偏移量
                                                        content: p2_1, // {string} 文本的内容
                                                    }}
                                                />
                                            </Guide>
                                        </Chart>
                                    )
                                    :
                                    ''
                            }
                            {
                                riskTypeNo === "3" ?
                                    (
                                        <Chart height={240} data={riskData} scale={riskMarketCols} padding="auto" forceFit>
                                            <Legend />
                                            <Axis name="month" line={null} tickLine={null}
                                                label={{
                                                    formatter(text) {
                                                        if (text == "01") {
                                                            return "1月";
                                                        } else if (text == "02") {
                                                            return "2月";
                                                        } else if (text == "03") {
                                                            return "3月";
                                                        } else if (text == "04") {
                                                            return "4月";
                                                        } else if (text == "05") {
                                                            return "5月";
                                                        } else if (text == "06") {
                                                            return "6月";
                                                        } else if (text == "07") {
                                                            return "7月";
                                                        } else if (text == "08") {
                                                            return "8月";
                                                        } else if (text == "09") {
                                                            return "9月";
                                                        } else if (text == "10") {
                                                            return "10月";
                                                        } else if (text == "11") {
                                                            return "11月";
                                                        } else if (text == "12") {
                                                            return "12月";
                                                        }
                                                    }
                                                }}
                                                title={{
                                                    textStyle: {
                                                        fontSize: '16',
                                                        textAlign: 'center',
                                                        fill: '#9013FE',
                                                    }, // 坐标轴文本属性配置
                                                    position: 'center', // 标题的位置，**新增**
                                                }}
                                            />
                                            <Tooltip
                                                crosshairs={{
                                                    type: 'y',
                                                }}
                                                showTitle={false}
                                            />
                                            <Axis name="p2_2" visible={false} />
                                            <Geom type="line" position="month*p2_2" color="#9013FE"
                                                tooltip={['month*p2_2', (month, p2_2) => {
                                                    return {
                                                        //自定义 tooltip 上显示的 title 显示内容等。
                                                        name: '平均分',
                                                        value: p2_2.toFixed(2)
                                                    };
                                                }]}
                                            />
                                            <Guide>
                                                <Line
                                                    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                                    start={{ month: '01', p2_2: p2_2 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                                    end={{ month: '12', p2_2: p2_2 }} // 同 start
                                                    lineStyle={{
                                                        stroke: '#9013FE', // 线的颜色
                                                        lineDash: [0, 2, 2], // 虚线的设置
                                                        lineWidth: 1, // 线的宽度
                                                    }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
                                                    text={{
                                                        position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                        style: { fill: '#9013FE' }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                                                        offsetY: -10, // {number} y 方向的偏移量
                                                        content: p2_2, // {string} 文本的内容
                                                    }}
                                                />
                                            </Guide>
                                        </Chart>
                                    )
                                    :
                                    ''
                            }
                            {
                                riskTypeNo === "4" ?
                                    (
                                        <Chart height={240} data={riskData} scale={riskInternalCols} padding="auto" forceFit>
                                            <Legend />
                                            <Axis name="month" line={null} tickLine={null}
                                                label={{
                                                    formatter(text) {
                                                        if (text == "01") {
                                                            return "1月";
                                                        } else if (text == "02") {
                                                            return "2月";
                                                        } else if (text == "03") {
                                                            return "3月";
                                                        } else if (text == "04") {
                                                            return "4月";
                                                        } else if (text == "05") {
                                                            return "5月";
                                                        } else if (text == "06") {
                                                            return "6月";
                                                        } else if (text == "07") {
                                                            return "7月";
                                                        } else if (text == "08") {
                                                            return "8月";
                                                        } else if (text == "09") {
                                                            return "9月";
                                                        } else if (text == "10") {
                                                            return "10月";
                                                        } else if (text == "11") {
                                                            return "11月";
                                                        } else if (text == "12") {
                                                            return "12月";
                                                        }
                                                    }
                                                }}
                                                title={{
                                                    textStyle: {
                                                        fontSize: '16',
                                                        textAlign: 'center',
                                                        fill: '#56A4FF',
                                                    }, // 坐标轴文本属性配置
                                                    position: 'center', // 标题的位置，**新增**
                                                }}
                                            />
                                            <Tooltip
                                                crosshairs={{
                                                    type: 'y',
                                                }}
                                                showTitle={false}
                                            />
                                            <Axis name="p2_3" visible={false} />
                                            <Geom type="line" position="month*p2_3" color="#56A4FF"
                                                tooltip={['month*p2_3', (month, p2_3) => {
                                                    return {
                                                        //自定义 tooltip 上显示的 title 显示内容等。
                                                        name: '平均分',
                                                        value: p2_3.toFixed(2)
                                                    };
                                                }]}
                                            />
                                            <Guide>
                                                <Line
                                                    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                                    start={{ month: '01', p2_3: p2_3 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                                    end={{ month: '12', p2_3: p2_3 }} // 同 start
                                                    lineStyle={{
                                                        stroke: '#56A4FF', // 线的颜色
                                                        lineDash: [0, 2, 2], // 虚线的设置
                                                        lineWidth: 1, // 线的宽度
                                                    }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
                                                    text={{
                                                        position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                        style: { fill: '#56A4FF' }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                                                        offsetY: -10, // {number} y 方向的偏移量
                                                        content: p2_3, // {string} 文本的内容
                                                    }}
                                                />
                                            </Guide>
                                        </Chart>
                                    )
                                    :
                                    ''
                            }
                            {
                                riskTypeNo === "5" ?
                                    (
                                        <Chart height={240} data={riskData} scale={riskSupplierCols} padding="auto" forceFit>
                                            <Legend />
                                            <Axis name="month" line={null} tickLine={null}
                                                label={{
                                                    formatter(text) {
                                                        if (text == "01") {
                                                            return "1月";
                                                        } else if (text == "02") {
                                                            return "2月";
                                                        } else if (text == "03") {
                                                            return "3月";
                                                        } else if (text == "04") {
                                                            return "4月";
                                                        } else if (text == "05") {
                                                            return "5月";
                                                        } else if (text == "06") {
                                                            return "6月";
                                                        } else if (text == "07") {
                                                            return "7月";
                                                        } else if (text == "08") {
                                                            return "8月";
                                                        } else if (text == "09") {
                                                            return "9月";
                                                        } else if (text == "10") {
                                                            return "10月";
                                                        } else if (text == "11") {
                                                            return "11月";
                                                        } else if (text == "12") {
                                                            return "12月";
                                                        }
                                                    }
                                                }}
                                                title={{
                                                    textStyle: {
                                                        fontSize: '16',
                                                        textAlign: 'center',
                                                        fill: '#F5A623',
                                                    }, // 坐标轴文本属性配置
                                                    position: 'center', // 标题的位置，**新增**
                                                }}
                                            />
                                            <Tooltip
                                                crosshairs={{
                                                    type: 'y',
                                                }}
                                                showTitle={false}
                                            />
                                            <Axis name="p2_4" visible={false} />
                                            <Geom type="line" position="month*p2_4" color="#F5A623"
                                                tooltip={['month*p2_4', (month, p2_4) => {
                                                    return {
                                                        //自定义 tooltip 上显示的 title 显示内容等。
                                                        name: '平均分',
                                                        value: p2_4.toFixed(2)
                                                    };
                                                }]}
                                            />
                                            <Guide>
                                                <Line
                                                    top={true} // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                                    start={{ month: '01', p2_4: p2_4 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                                    end={{ month: '12', p2_4: p2_4 }} // 同 start
                                                    lineStyle={{
                                                        stroke: '#F5A623', // 线的颜色
                                                        lineDash: [0, 2, 2], // 虚线的设置
                                                        lineWidth: 1, // 线的宽度
                                                    }} // {object} 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic#线条样式
                                                    text={{
                                                        position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                        style: { fill: '#F5A623' }, // {object}文本图形样式配置,https://bizcharts.net/products/bizCharts/api/graphic#文本属性
                                                        offsetY: -10, // {number} y 方向的偏移量
                                                        content: p2_4, // {string} 文本的内容
                                                    }}
                                                />
                                            </Guide>
                                        </Chart>
                                    )
                                    :
                                    ''
                            }
                        </div>
                    </Row>
                </Row>
            </div >
        );
    }
}

export default risk_visual_center;