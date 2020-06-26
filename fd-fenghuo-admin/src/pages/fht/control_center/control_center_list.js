import React from 'react';
import { Form, Card, Table, Row, Col, Icon } from 'antd';
import { connect } from 'dva';
import styles from './control_center_list.css';
import router from 'umi/router';
import moment from 'moment';
import c from '../../../assets/c1.svg';
import c1 from '../../../assets/1.png';
import c2 from '../../../assets/2.png';
import c3 from '../../../assets/3.png';
import c4 from '../../../assets/4.png';
import c5 from '../../../assets/5.png';
import { Empty } from 'antd';


// 引入图标组件
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Guide } from 'bizcharts';
import { Record } from 'immutable';
const { Line } = Guide;


@connect(({ common_model, control_center_model, auth_model }) => ({
    value1: control_center_model.q1,
    value2_1: control_center_model.q2_1,
    value2_2: control_center_model.q2_2,
    value3_1: control_center_model.q3_1,
    value3_2: control_center_model.q3_2,
    table_list: control_center_model.datalist,
    high_list: control_center_model.highDataList,
    message_List: control_center_model.messageList,
    company_name: auth_model.user_company_name,
}))

@Form.create()
class control_center_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        const company_name = this.props.company_name;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '控制中心' },
                menu: {
                    selectedKeys: ['control_center'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'control_center_model/InvoiceCount1',
            payload: { company_name },
            callback: code => {
                if(code === 0){
                    dispatch({
                        type: 'control_center_model/InvoiceCount2',
                        payload: {}
                    });
                    dispatch({
                        type: 'control_center_model/List',
                        payload: { company_name }
                    });
                    dispatch({
                        type: 'control_center_model/HighInvoice',
                        payload: {}
                    });
                    dispatch({
                        type: 'control_center_model/messageList',
                        payload: {}
                    });
                    dispatch({
                        type: 'auth_model/getUserCompanyName',
                        payload: { username: userdata.username }
                    });
                }
            }
        });
    }

    // 进入高风险票趋势图
    inToTrend = () => {
        router.push({ pathname: '/fht/control_center/control_center_trend' });
    }
    // 进入项目管理
    toProjectList = () => {
        router.push({ pathname: '/fht/project/project_list' });
    }
    // 进入合同管理
    toContractList = () => {
        router.push({ pathname: '/fht/contract/contract_list' });
    }
    // 进入发票管理
    toInvoiceList = () => {
        router.push({ pathname: '/fht/bill/bill_list' });
    }
    // 进入供应商管理
    toSupplierList = () => {
        router.push({ pathname: '/fht/supplier/supplier_list' });
    }
    // 进入风控中心
    toRiskControlSetList = () => {
        router.push({ pathname: '/fht/risk/risk_list' });
    }
    // 进入分控设置
    toSystemList = () => {
        router.push({ pathname: '/fht/system/system_list' });
    }

    // 跳转到对应的供应商详情 
    linkToSupplier = (s_name) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/supplier/supplier_detail',
            query: {
                company_name: s_name
            },
        });
    }



    render() {
        const { DataList } = this.state;
        const { value1, value2_1, value2_2, value3_2, value3_1, high_list, table_list, message_List } = this.props;
        const v1 = value1 || [];
        const h_list = high_list || [];
        const b_list = table_list || [];
        const m_list = message_List || [];

        // 重命名
        const cols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 表格
        const columns = [
            {
                title: '开票抬头',
                dataIndex: 's_name',
                key: 's_name',
                render: s_name => <a type="link" onClick={this.linkToSupplier.bind(this, s_name)}>{s_name}</a>,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 180,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                }
            },
            {
                title: '风险票据数量',
                dataIndex: 'single_count',
                key: 'single_count',
                render: single_count => (
                    <span>
                        {
                            single_count ? single_count : ""
                        }
                    </span>
                )
            },
            {
                title: '累计票据数量',
                dataIndex: 'total_count',
                key: 'total_count',
                render: total_count => (
                    <span>
                        {
                            total_count ? total_count : ""
                        }
                    </span>
                )
            },
            {
                title: '占比',
                dataIndex: 'proportion',
                key: 'proportion',
                render: (proportion, b_list) => (
                    <span>
                        {
                            b_list.total_count == 0 ? "" : b_list.single_count == null ? '' : Number(b_list.single_count) / Number(b_list.total_count) * 100 + "%"
                        }
                    </span>
                )
            }]

        return (
            <div>
                <Card bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                >
                    <Row type="flex" justify="space-around" align="middle" >
                        <Col span={8} >
                            <div className={styles.div1}>
                                <Row className={styles.t1}><b>进项票据统计</b></Row>
                                <Row className={styles.t11}>本月新增： <span style={{ fontSize: '25px' }}>{v1.m_time ? v1.m_time : 0}</span></Row>
                                <Row className={styles.t111}>当年累计： <span style={{ fontSize: '25px' }}>{v1.y_time ? v1.y_time : 0}</span></Row>
                            </div>
                        </Col>
                        <Col span={8} ><div className={styles.div2}>
                            <Row className={styles.t2}><b>已处理风险票据统计</b></Row>
                            <Row className={styles.t11}>本月新增： <span style={{ fontSize: '25px' }}>{value2_1.count}</span></Row>
                            <Row className={styles.t111}>当年累计： <span style={{ fontSize: '25px' }}>{value2_2.count}</span></Row>
                        </div></Col>
                        <Col span={8} ><div className={styles.div3}>
                            <Row className={styles.t3}><b>待处理风险票据统计</b></Row>
                            <Row className={styles.t11}>本月新增： <span style={{ fontSize: '25px' }}>{value3_1.count}</span></Row>
                            <Row className={styles.t111}>
                                <span>当年累计：</span> <span style={{ fontSize: '25px' }}>{value3_2.count}</span>{/** <a style={{ float: "right", marginTop: 10, marginRight: 30 }} > <img className={styles.cc_img1} src={c} /></a>*/}
                            </Row>
                        </div></Col>
                    </Row>
                </Card>

                <Row type="flex" justify="start" align="middle" gutter={20} style={{ marginTop: '20px' }}>
                    <Col span={4} style={{ width: '20%' }}>
                        <a type="link" onClick={this.toRiskControlSetList}>
                            <img className={styles.cc_img} src={c1} />
                        </a>

                    </Col>

                    <Col span={4} style={{ width: '20%' }} >
                        <a type="link" onClick={this.toInvoiceList}>
                            <img className={styles.cc_img} src={c2} />
                        </a>
                    </Col>

                    <Col span={4} style={{ width: '20%' }} >
                        <a type="link" onClick={this.toContractList}>
                            <img className={styles.cc_img} src={c3} />
                        </a>
                    </Col>

                    <Col span={4} style={{ width: '20%' }} >
                        <a type="link" onClick={this.toProjectList}>
                            <img className={styles.cc_img} src={c4} />
                        </a>
                    </Col>

                    <Col span={4} style={{ width: '20%' }} >
                        <a type="link" onClick={this.toSupplierList}>
                            <img className={styles.cc_img} src={c5} />
                        </a>
                    </Col>
                </Row>

                <Row type="flex" justify="center" align="top" gutter={16} style={{ marginBottom: 40 }}>
                    <Col span={14}>
                        <Row>
                            <Card style={{ marginTop: 20 }} bordered={false}
                                bodyStyle={{
                                    boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                    borderRadius: '7px',
                                    height: 320
                                }}
                            >
                                <a style={{ color: '#4A4A4A' }}><p className={styles.title3} onClick={this.inToTrend}><b>高风险发票增长趋势</b></p></a>
                                <div className={styles.line}></div>
                                <Chart data={h_list} scale={cols} padding="auto" height={230} style={{ marginTop: '15px' }} onClick={this.inToTrend} forceFit>
                                    <Axis title />
                                    <Axis title />
                                    <Legend position="bottom" dy={-10} />

                                    <Tooltip showTitle={false} />  {/*除去title*/}
                                    <Geom type="interval" position="month*num" color="#5396DB" />
                                    <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                    {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                    <Guide>
                                        <Line
                                            top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                            start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                            end={{ month: '12月', num2: 100 }} // 同 start
                                            lineStyle={{
                                                stroke: '#F08F4E', // 线的颜色
                                                lineDash: [0, 4, 4], // 虚线的设置
                                                lineWidth: 1, // 线的宽度
                                            }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                            text={{
                                                position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                                autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                                style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                                // content: {string}, // {string} 文本的内容
                                                offsetX: 20, // {number} x 方向的偏移量
                                                offsetY: -10, // {number} y 方向的偏移量
                                                content: '线性风险系数',
                                            }}
                                        />
                                    </Guide>
                                </Chart>
                            </Card>

                        </Row>
                        <Row>
                            <Card style={{ marginTop: 20 }} bordered={false}
                                bodyStyle={{
                                    boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                    borderRadius: '7px',
                                    height: 320
                                }}
                            >
                                <p className={styles.title3}><b>高风险发票来源</b></p>
                                <div className={styles.line}></div>
                                <Table rowKey={record => record.id} size={"small"} columns={columns} dataSource={b_list} scroll={{ y: 200 }} pagination={false} style={{ marginTop: 15 }} />
                            </Card>
                        </Row>
                    </Col>
                    <Col span={10}>
                        <Card style={{ marginTop: 20 }} bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height: 660
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>消息提醒中心</b></p>
                            <div className={styles.line}></div>
                            <div style={{ overflow: 'scroll', height: 561, marginTop: 15 }}>
                                {
                                    m_list != "" ?
                                        m_list.map((value, key) => {
                                            // 通过/将字符串划分为多个对象
                                            let v = value.content.split('/');
                                            return (
                                                <Row key={key} style={{ marginBottom: 20 }}>
                                                    <Col style={{ marginBottom: 5 }}><span style={{ color: '#DD5364' }}>{v[0]}</span>{v[1]}<span style={{ color: '#DD5364' }}>{v[2]}</span>{v[3]}</Col>
                                                    <Col><span style={{ color: '#9B9B9B', fontSize: '14px' }}>{moment(value.create_time).format('YYYY.MM.DD')}</span></Col>
                                                </Row>
                                            )
                                        })
                                        : <Col style={{ marginTop: 180 }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></Col>
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default control_center_list;