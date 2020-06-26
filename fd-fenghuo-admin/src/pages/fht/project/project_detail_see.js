import React from 'react';
import styles from './project_detail.css';
import { Card, Button, Row, Col, Table, Typography, Divider, Tag } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';

const { Text } = Typography;

@connect(({ common_model, project_model, contract_model }) => ({
    projectDetail: project_model.projectDetail,
    projectInvoice: project_model.projectInvoice,
}))

class project_detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { }

    // 查看合同详情.
    toContractDetailView = (contract_code, contract_name) => {
        router.push({
            pathname: '/fht/contract/total/total_detail',
            query: {
                contract_code: contract_code,
                contract_name: contract_name,
                company_id: "1",
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

    // 查看报销详情.
    toDoReimburseDetail = (id) => {
        router.push({
            pathname: '/fht/project/reimburse/reimburse_detail',
            query: {
                id: id,
            },
        });
    }

    render() {
        const { projectDetail } = this.props;
        // 生命周期, 防止没有加载.
        const project = projectDetail.project || {};
        const project_tag = project.project_tag || [];
        const contractList = projectDetail.contract || [];
        const invoiceList = projectDetail.invoice || [];
        const score = projectDetail.score || {};
        const reimburse = projectDetail.reimburse || [];
        const reimburse_count_money = projectDetail.reimburse_count_money || {};
        const pass_reimburse = projectDetail.passReimburse || [];
        // 发票总额.
        let invoice_amount = 0;
        for (let index = 0; index < invoiceList.length; index++) {
            invoice_amount += invoiceList[index].price_amount;
        }
        // 通过的报销记录中的发票总额.
        let pass_invoice_amount = 0;
        for (let index = 0; index < pass_reimburse.length; index++) {
            pass_invoice_amount += pass_reimburse[index].price_amount;
        }
        const columns = [
            {
                title: '关联合同编号',
                dataIndex: 'contract_code',
                key: 'contract_code',
            },
            {
                title: '关联合同名称',
                dataIndex: 'contract_name',
                key: 'contract_name',
            },
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
                title: '审核状态',
                dataIndex: 'audit_status',
                key: 'audit_status',
                render: audit_status => (
                    audit_status == '0' ? <span style={{ color: '#F5A623' }}>待审核</span> : audit_status == '1' ?
                        <span style={{ color: '#539E00' }}>已通过</span> :
                        <span style={{ color: '#DD5364' }}>已驳回</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                width: 120,
                render: (key, record) => (
                    record.audit_status == '1' ?
                        <Button size="small" type="link" onClick={this.toInvoiceDetail.bind(this, key)}>查看</Button>
                        :
                        ''
                )
            },
        ];
        const reimburse_columns = [
            {
                title: '报销编号',
                dataIndex: 'reimburse_id',
                key: 'reimburse_id',
            },
            {
                title: '报销类别',
                dataIndex: 'type_name',
                key: 'type_name',
            },
            {
                title: '报销人',
                dataIndex: 'reimburse_man',
                key: 'reimburse_man',
            },
            {
                title: '所属部门',
                dataIndex: 'dept',
                key: 'dept',
            },
            {
                title: '报销金额',
                dataIndex: 'reimburse_money',
                key: 'reimburse_money',
            },
            {
                title: '发票金额',
                dataIndex: 'invoice_money',
                key: 'invoice_money',
            },
            {
                title: '无票金额',
                dataIndex: 'not_invoice_monet',
                key: 'not_invoice_monet',
                render: not_invoice_monet => (
                    not_invoice_monet <= 0 ? 0 : not_invoice_monet
                ),
            },
            {
                title: '备注信息',
                dataIndex: 'note',
                key: 'note',
            },
            {
                title: '审核状态',
                dataIndex: 'audit_status',
                key: 'audit_status',
                render: audit_status => (
                    audit_status == '0' ? <span style={{ color: '#F5A623' }}>待审核</span> : audit_status == '1' ?
                        <span style={{ color: '#539E00' }}>已通过</span> :
                        <span style={{ color: '#DD5364' }}>已驳回</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                width: 170,
                render: (key, record) => (
                    record.audit_status == '1' ?
                        <Button size="small" type="link" onClick={this.toDoReimburseDetail.bind(this, record.reimburse_id)}>查看</Button>
                        :
                        ''
                )
            },
        ];
        const pass_reimburse_columns = [
            {
                title: '报销编号',
                dataIndex: 'reimburse_id',
                key: 'reimburse_id',
            },
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
                render: (key, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.toInvoiceDetail.bind(this, key)}>查看</Button>
                    </span>
                )
            },
        ];
        return (
            <div style={{ margin: '0 0 40px 0' }}>
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
                        <Text style={{ color: '#000000' }} strong>基本信息</Text>
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
                    <div>
                        <Row>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>项目名称：</span><span style={{ color: '#4A4A4A' }}>{project.name}</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>发起人：</span><span style={{ color: '#4A4A4A' }}>{project.initiator}</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>组织部门：</span><span style={{ color: '#4A4A4A' }}>{project.dept_name}</span></Col>
                        </Row >
                        <Row style={{ margin: '20px 0 0 0' }}>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>项目预算：</span><span style={{ color: '#4A4A4A' }}>{project.project_budget}元</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>项目总支出：</span><span style={{ color: '#4A4A4A' }}>{project.project_total_spend}元</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>报销支出：</span><span style={{ color: '#4A4A4A' }}>{project.reimburse_spend}元</span></Col>
                        </Row>
                        <Row style={{ margin: '20px 0 0 0' }}>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>合同总额：</span><span style={{ color: '#4A4A4A' }}>{project.contract_money}元</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>合同支出：</span><span style={{ color: '#4A4A4A' }}>{project.contract_spend}元</span></Col>
                            <Col span={8}><span style={{ color: '#9B9B9B' }} className={styles.info_font}>创建日期：</span><span style={{ color: '#4A4A4A' }}>{moment(project.create_time).format('YYYY.MM.DD')}</span></Col>
                        </Row>
                        <Row style={{ margin: '20px 0 0 0' }}>
                            <span style={{ color: '#9B9B9B' }} className={styles.info_font}>项目标签：</span>
                            {
                                project_tag.map((value, key) => {
                                    return (
                                        <span key={key}><Tag color="#CEE2F7"><span className={styles.tag_font}>{value}</span></Tag></span>
                                    );
                                })
                            }
                        </Row>
                    </div >
                </Card >

                {
                    contractList.map((value, key) => {
                        return (
                            value.contract_code ?
                                (
                                    <div key={key}>
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
                                                <Text style={{ color: '#000000' }} strong>{value.contract_name}（{value.contract_code}）</Text>
                                            </span>
                                            <div style={{ float: 'right' }}>
                                                <Button type="link" onClick={this.toContractDetailView.bind(this, value.contract_code, value.contract_name)}>查看</Button>
                                            </div>
                                        </Row>
                                        <Card
                                            bordered={false}
                                            bodyStyle={{
                                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                                borderRadius: '7px',
                                            }}
                                            style={{ margin: '20px 0 0 0' }}
                                        >
                                            <Row gutter={16}>
                                                <Col span={6}><span style={{ color: '#AFADAC' }}>供应商：</span><span>{value.s_name ? value.s_name : '--'}</span></Col>
                                                <Col span={4}><span style={{ color: '#AFADAC' }}>票据：</span><span>{value.invoice_number}张</span></Col>
                                                <Col span={6}><span style={{ color: '#AFADAC' }}>开票总额：</span><span>{value.price_amount ? value.price_amount : 0}元</span></Col>
                                                <Col span={8}><span style={{ color: '#AFADAC' }}>创建日期：</span><span>{moment(value.create_time).format('YYYY-MM-DD HH:mm:ss')}</span></Col>
                                            </Row>
                                            <Divider />
                                            <Row style={{ margin: '50px 0 0 0' }} type="flex" justify="space-around" align="middle">
                                                <Col span={4}>
                                                    <Pie color={((Number(value.p2_1) + Number(value.p2_2) + Number(value.p2_3) + Number(value.p2_4)) <= score.p1) ? '#DD5364' : '#37B500'}
                                                        percent={(Number(value.p2_1) + Number(value.p2_2) + Number(value.p2_3) + Number(value.p2_4)) / (Number(score.tax) + Number(score.market) + Number(score.internal) + Number(score.supplier)) * 100}
                                                        subTitle={<span style={{ color: ((Number(value.p2_1) + Number(value.p2_2) + Number(value.p2_3) + Number(value.p2_4)) <= score.p1) ? '#DD5364' : '' }}>综合得分</span>}
                                                        total={<span style={{ color: ((Number(value.p2_1) + Number(value.p2_2) + Number(value.p2_3) + Number(value.p2_4)) <= score.p1) ? '#DD5364' : '' }}>
                                                            {(Number(value.p2_1) + Number(value.p2_2) + Number(value.p2_3) + Number(value.p2_4)) +
                                                                "/" +
                                                                (Number(score.tax) + Number(score.market) + Number(score.internal) + Number(score.supplier))}
                                                        </span>}
                                                        height={150}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Pie color={(value.p2_1 <= score.p2_1) ? '#DD5364' : '#37B500'}
                                                        percent={Number(value.p2_1) / Number(score.tax) * 100}
                                                        subTitle={<span style={{ color: (value.p2_1 <= score.p2_1) ? '#DD5364' : '' }}>税务合规</span>}
                                                        total={<span style={{ color: (value.p2_1 <= score.p2_1) ? '#DD5364' : '' }}>{value.p2_1 + "/" + score.tax}</span>}
                                                        height={150}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Pie color={(value.p2_2 <= score.p2_2) ? '#DD5364' : '#37B500'}
                                                        percent={Number(value.p2_2) / Number(score.market) * 100}
                                                        subTitle={<span style={{ color: (value.p2_2 <= score.p2_2) ? '#DD5364' : '' }}>市场监管</span>}
                                                        total={<span style={{ color: (value.p2_2 <= score.p2_2) ? '#DD5364' : '' }}>{value.p2_2 + "/" + score.market}</span>}
                                                        height={150}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Pie color={(value.p2_3 <= score.p2_3) ? '#DD5364' : '#37B500'}
                                                        percent={Number(value.p2_3) / Number(score.internal) * 100}
                                                        subTitle={<span style={{ color: (value.p2_3 <= score.p2_3) ? '#DD5364' : '' }}>内部合规</span>}
                                                        total={<span style={{ color: (value.p2_3 <= score.p2_3) ? '#DD5364' : '' }}>{value.p2_3 + "/" + score.internal}</span>}
                                                        height={150}
                                                    />
                                                </Col>
                                                <Col span={4}>
                                                    <Pie color={(value.p2_4 <= score.p2_4 || value.is_legal === "1") ? '#DD5364' : '#37B500'}
                                                        percent={value.p2_4 ? (Number(value.p2_4) / Number(score.supplier) * 100) : 0}
                                                        subTitle={<span style={{ color: (value.p2_4 <= score.p2_4 || value.is_legal === "1") ? '#DD5364' : '' }}>供应商评分</span>}
                                                        total={<span style={{ color: (value.p2_4 <= score.p2_4 || value.is_legal === "1") ? '#DD5364' : '' }}>{(value.p2_4 + "/" + score.supplier)}</span>}
                                                        height={150}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                    </div>
                                )
                                :
                                ''
                        );
                    })
                }

                {/* TODO 获取该项目下的所有票据 */}
                {
                    invoiceList.length ?
                        (
                            <div>
                                <Row style={{ margin: '20px 0 0 0', height: '32px' }}>
                                    <span style={{ fontSize: '16px' }}>
                                        <div style={{
                                            width: '4px',
                                            height: '14px',
                                            background: 'rgba(20,124,236,1)',
                                            borderRadius: '2px',
                                            display: 'inline-block',
                                            margin: '0 10px 0 0'
                                        }} />
                                        <Text style={{ color: '#000000' }} strong>所有合同发票</Text>
                                    </span>
                                    <div style={{ float: 'right' }}>
                                        <Text style={{ margin: '0 20px 0 0' }} className={styles.invoice_font}>发票数量：<span style={{ color: '#000000' }}>{invoiceList.length}</span></Text>
                                        <Text style={{ margin: '0 20px 0 0' }} className={styles.invoice_font}>发票总额：<span style={{ color: '#000000' }}>{invoice_amount}</span></Text>
                                    </div>
                                </Row>
                                <Card
                                    bordered={false}
                                    bodyStyle={{
                                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                        borderRadius: '7px',
                                        padding: '0',
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
                        )
                        :
                        ''
                }

                {/* TODO 获取该项目下的所有报销记录 */}
                <div>
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
                            <Text style={{ color: '#000000' }} strong>所有报销记录</Text>
                        </span>
                        <div style={{ float: 'right' }}>
                            <Text style={{ margin: '0 20px 0 0' }} className={styles.invoice_font}>报销记录：<span style={{ color: '#000000' }}>{reimburse_count_money.total_amount}</span></Text>
                            <Text className={styles.invoice_font}>报销支出：<span style={{ color: '#000000' }}>{reimburse_count_money.total_money ? reimburse_count_money.total_money : 0}</span></Text>
                        </div>
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                            padding: '0',
                        }}
                        style={{ margin: '20px 0 0 0' }}
                    >
                        <Table rowKey={record => record.reimburse_id} columns={reimburse_columns} dataSource={reimburse} pagination={{
                            "defaultPageSize": 5,
                            "defaultCurrent": 1,
                            "showQuickJumper": true,
                        }} />
                    </Card>
                </div>

                {/* TODO 获取该项目下的已通过的报销记录 */}
                {
                    pass_reimburse.length ?
                        (
                            <div>
                                <Row style={{ margin: '20px 0 0 0', height: '32px' }}>
                                    <span style={{ fontSize: '16px' }}>
                                        <div style={{
                                            width: '4px',
                                            height: '14px',
                                            background: 'rgba(20,124,236,1)',
                                            borderRadius: '2px',
                                            display: 'inline-block',
                                            margin: '0 10px 0 0'
                                        }} />
                                        <Text style={{ color: '#000000' }} strong>已通过的报销发票</Text>
                                    </span>
                                    <div style={{ float: 'right' }}>
                                        <Text className={styles.invoice_font} style={{ margin: '0 20px 0 0' }}>发票数量：<span style={{ color: '#000000' }}>{pass_reimburse.length}</span></Text>
                                        <Text className={styles.invoice_font} style={{ margin: '0 20px 0 0' }}>发票总额：<span style={{ color: '#000000' }}>{pass_invoice_amount.toFixed(2)}</span></Text>
                                    </div>
                                </Row>
                                <Card
                                    bordered={false}
                                    bodyStyle={{
                                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                        borderRadius: '7px',
                                        padding: '0',
                                    }}
                                    style={{ margin: '20px 0 0 0' }}
                                >
                                    <Table rowKey={record => record.invoice_no_short} columns={pass_reimburse_columns} dataSource={pass_reimburse} pagination={{
                                        "defaultPageSize": 5,
                                        "defaultCurrent": 1,
                                        "showQuickJumper": true,
                                    }} />
                                </Card>
                            </div>
                        )
                        :
                        ''
                }
            </div >
        );
    }
}

export default project_detail;