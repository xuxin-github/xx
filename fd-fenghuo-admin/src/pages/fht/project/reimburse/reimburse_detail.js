import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Typography, Card, Table, Popconfirm } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import SFile from '../../../../components/upload/sfile';
import styles from "./reimburse_detail.css";

const { Text } = Typography;

@connect(({ common_model, reimburse_model }) => ({
    reimburseDetail: reimburse_model.reimburseDetail,
}))

class reimburse_detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch, location } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: {
                    name: '项目管理', href: '',
                    name01: '项目详情', href01: '',
                    detail: '报销详情',
                },
                menu: {
                    selectedKeys: ['project'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'reimburse_model/reimburseDetail',
            payload: {
                reimburse_code: location.query.id,
            },
        });
    }

    // 查看发票详情.
    toInvoiceDetail = (key) => {
        router.push({
            pathname: '/fht/bill/bill_details',
            query: {
                invoice_code: key.invoice_code,
                invoice_no_short: key.invoice_no_short,
            },
        });
    }

    // 取消关联.
    cancelConnectInvoice = (invoice_no_short, invoice_code, code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburse_model/cancelConnectInvoice',
            payload: { invoice_no_short, invoice_code, code },
        });
    }

    render() {
        const { reimburseDetail } = this.props;
        const reimburse = reimburseDetail || {};
        console.log("sss",reimburse);
        const files = reimburse.reimburse_files || [];
        const invoiceList = reimburse.invoice || [];
        // 发票总额.
        let invoice_amount = 0;
        for (let index = 0; index < invoiceList.length; index++) {
            invoice_amount += invoiceList[index].price_amount;
        }
        const columns = [
            {
                title: '发票号码',
                dataIndex: 'invoice_no_short',
                key: 'invoice_no_short',
            },
            {
                title: '发票类型',
                dataIndex: 'invoice_type',
                key: 'invoice_type',
                render: invoice_type => (
                    <span>
                        {
                            invoice_type === '01' ? '增值税专用发票' : invoice_type === '04' ? '增值税普通发票' : invoice_type === '10' ? '增值税普通发票(电子)' : invoice_type === '11' ? '增值税普通发票(卷式)' : '--'
                        }
                    </span>
                )
            },
            {
                title: '销方名称',
                dataIndex: 's_name',
                key: 's_name',
            },
            {
                title: '发票分类',
                dataIndex: 'invoice_catalog',
                key: 'invoice_catalog',
                render: invoice_catalog => (
                    <span>
                        {
                            invoice_catalog === '01' ? '管理费类' : invoice_catalog === '02' ? '咨询费类' : invoice_catalog === '03' ? '会议费类' : invoice_catalog === '04' ? '培训费类' : invoice_catalog === '05' ? '旅游费类' : invoice_catalog === '06' ? '手续费类' : '其他类'
                        }
                    </span>
                )
            },
            {
                title: '发票代码',
                dataIndex: 'invoice_code',
                key: 'invoice_code',
            },
            {
                title: '发票金额',
                dataIndex: 'price_amount',
                key: 'price_amount',
            },
            {
                title: '开票日期',
                dataIndex: 'invoice_time',
                key: 'invoice_time',
                render: invoice_time => (
                    <span>
                        {
                            moment(invoice_time).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                width: 170,
                render: (key, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.toInvoiceDetail.bind(this, key)}>查看</Button>
                        {reimburse.audit_status == 0 ?
                        <Popconfirm placement="top" title="确定取消关联此发票？"
                            onConfirm={this.cancelConnectInvoice.bind(this, record.invoice_no_short, record.invoice_code, record.code)} okText="确定" cancelText="取消">
                            <Button size="small" type="link" style={{ color: '#DD5364' }}>取消关联</Button>
                        </Popconfirm>
                        :""}
                    </span>
                )
            },
        ];
        return (
            <div style={{ margin: '0 0 40px 0' }}>
                <Row>
                    <Button style={{ float: 'right', margin: '0 12px' }} onClick={() => router.goBack()}>返回</Button>
                </Row>
                <Row style={{ margin: '20px 0 0 0' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>报销信息</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ margin: '20px 0 0 0' }}
                >
                    <Row>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>报销编号：<Text style={{ color: '#4A4A4A' }}>{reimburse.code}</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>报销类别：<Text style={{ color: '#4A4A4A' }}>{reimburse.type_name}</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>报销人：<Text style={{ color: '#4A4A4A' }}>{reimburse.reimburse_name} | {reimburse.dept_name}</Text></Text>
                        </Col>
                    </Row>
                    <Row style={{ margin: '20px 0 0 0' }}>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>报销金额：<Text style={{ color: '#4A4A4A' }}>{reimburse.money}元</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>发票金额：<Text style={{ color: '#4A4A4A' }}>{reimburse.invoice_money}元</Text></Text>
                        </Col>
                        <Col span={8}>
                            <Text className={styles.reimburse_font}>无票金额：<Text style={{ color: '#4A4A4A' }}>{reimburse.not_invoice_monet <= 0 ? 0 : reimburse.not_invoice_monet}元</Text></Text>
                        </Col>
                    </Row>
                    <Row style={{ margin: '20px 0 0 0' }}>
                        <Text className={styles.reimburse_font}>备注信息：<Text style={{ color: '#4A4A4A' }}>{reimburse.note}</Text></Text>
                    </Row>
                    <Row style={{ margin: '20px 0 0 0' }}>
                        <Col span={2}><Text className={styles.reimburse_font}>附件文件：</Text></Col>
                        <Col span={22}>
                        {
                            files.map((value, key) => {
                                let v = value;
                                value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                return (
                                    <Row key={key} style={{ margin: '0 0 0 -25px' }}>
                                        <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 16 }}><span>{value}</span></Col>
                                        <Col span={10}>
                                            <SFile file={v}></SFile>
                                        </Col>
                                    </Row>
                                );
                            })
                        }
                        </Col>
                    </Row>
                </Card>

                <Row style={{ margin: '20px 0 0 0' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>报销发票</Text>
                        <div style={{ float: 'right' }}>
                            <Text className={styles.invoice_font} style={{ margin: '0 20px 0 0' }}>发票数量：<span style={{ color: '#000000' }}>{invoiceList.length}</span></Text>
                            <Text className={styles.invoice_font} style={{ margin: '0 20px 0 0' }}>发票总额：<span style={{ color: '#000000' }}>{invoice_amount.toFixed(2)}</span></Text>
                        </div>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0'
                    }}
                    style={{ margin: '20px 0 0 0' }}
                >
                    <Table rowKey={record => record.id} columns={columns} dataSource={invoiceList} pagination={{
                        "defaultPageSize": 5,
                        "defaultCurrent": 1,
                        "showQuickJumper": true,
                    }} />
                </Card>
            </div>
        );
    }
}

export default reimburse_detail;