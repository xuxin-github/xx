import React, { PureComponent } from 'react';
import { Table, Form, Input, Button, Modal, Select, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import InvoiceAdd from './bill_form/invoice_add';
import { Record } from 'immutable';
import router from 'umi/router';
import moment from 'moment';
const { Option } = Select;

@connect(({ bill_model }) => ({
    invoiceData: bill_model.invoiceData,
    addModelShow: bill_model.addModelShow,
    pageSize: bill_model.pageSize,
    page: bill_model.page,
}))

@Form.create()
class bill_list extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            role_code: '',
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        let ROLE = localStorage.getItem("ROLE");
        let roledata = JSON.parse(ROLE);
        this.setState({
            username: userdata.username,
            role_code: roledata[0].authority,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '进项发票管理' },
                menu: {
                    selectedKeys: ['bill'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'bill_model/queryDataList',
            payload: { username: userdata.username, role_code: roledata[0].authority },
        });
    };

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            const { username, role_code } = this.state;
            dispatch({
                type: 'bill_model/query',
                payload: { values, username, role_code }
            })
        });
    };

    // 新增发票, 打开model对话框.
    handleAdd = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/updateState',
            payload: { addModelShow: true },
        });
    };

    // 查看发票详情.
    handleDetails = (invoice_code, invoice_no_short) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/bill/bill_details',
            query: {
                invoice_code: invoice_code,
                invoice_no_short: invoice_no_short,
            },
        });
    };

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'bill_model/pageSizeChange',
            payload: { page: current, pageSize, username, role_code }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'bill_model/pageSizeChange',
            payload: { page, pageSize, username, role_code }
        });
    };

    render() {
        const { invoiceData, addModelShow, pageSize, page } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { username, role_code } = this.state;
        const columns = [
            {
                title: '项目名称',
                dataIndex: 'project_name',
                key: 'project_name',
                render: (project_name,key) => (
                    <span>
                        {
                            project_name && key.audit_status == '1' ? project_name : '--'
                        }
                    </span>
                )
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
                            invoice_type == '01' ? '增值税专用发票' : invoice_type == '04' ? '增值税普通发票' : invoice_type == '10' ? '增值税普通发票(电子)' : invoice_type == '11' ? '增值税普通发票(卷式)' : '--'
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
                            invoice_catalog == '01' ? '管理费类' : invoice_catalog == '02' ? '咨询费类' : invoice_catalog == '03' ? '会议费类' : invoice_catalog == '04' ? '培训费类' : invoice_catalog == '05' ? '旅游费类' : invoice_catalog == '06' ? '手续费类' : '其他类'
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
                            moment(invoice_time).format('YYYY.MM.DD')
                        }
                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                align: 'center',
                render: (key,record) => (
                    <div key={key}>
                        <Button type="link" onClick={this.handleDetails.bind(this, key.invoice_code, key.invoice_no_short)}>
                            查看</Button>
                    </div>
                ),
            },
        ];

        return (
            <div>
                <div>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item label="请选择发票分类">
                                {getFieldDecorator('invoice_catalog')(
                                    <Select placeholder='请选择发票分类' allowClear={true} style={{ width: 150 }}>
                                        <Option value='01'>管理费类</Option>
                                        <Option value='02'>咨询费类</Option>
                                        <Option value='03'>会议费类</Option>
                                        <Option value='04'>培训费类</Option>
                                        <Option value='05'>旅游费类</Option>
                                        <Option value='06'>手续费类</Option>
                                        <Option value='07'>其他类</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('invoice_criteria')(
                                    <Input type="text" placeholder="请输入项目名称、合同名称、发票号码" style={{ width: 300 }} allowClear={true} />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                            </Form.Item>
                            { role_code == 'DIRECTOR' ? 
                            <Button type="primary" style={{ marginTop: 4 }} onClick={this.handleAdd}>新增</Button>
                            :''}
                        </Form>

                    </Row>
                    <Modal
                        title="添加发票"
                        visible={addModelShow}
                        closable={false}
                        footer={null}
                        width={600}
                    >
                        <InvoiceAdd />
                    </Modal>

                </div>
                <Card style={{ marginTop: '20px', marginBottom: '40px' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}>
                    <Table rowKey={record => record.id} style={{ marginTop: 20 }} columns={columns} dataSource={invoiceData.datalist} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        "defaultCurrent": page,
                        "showSizeChanger": true,
                        "total": invoiceData.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }} />
                </Card>
            </div>
        )
    }
}

export default bill_list;