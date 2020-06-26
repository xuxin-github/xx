import React, { PureComponent } from 'react';
import { Table, Form, Input, Button, Modal, Select, Popconfirm, Row, Card } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import SupplierAdd from './supplier_form/supplier_add';
const { Option } = Select;

@connect(({ common_model, supplier_model }) => ({
    supplierList: supplier_model.supplierList,
    addModelShow: supplier_model.addModelShow,
    page: supplier_model.page,
    pageSize: supplier_model.pageSize,
}))
@Form.create()
class supplier_list extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '供应商管理', href: '' },
                menu: {
                    selectedKeys: ['supplier'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'supplier_model/tableList',
        });
    };

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            dispatch({
                type: 'supplier_model/query',
                payload: { values }
            });
        });
    };

    // 查看详情.
    handleDetails = (company_name) => {
        router.push({
            pathname: '/fht/supplier/supplier_detail',
            query: {
                company_name: company_name,
            },
        });
    };

    // 修改企业状态.
    handleTypes = (company_name, company_status) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/edit',
            payload: { company_name, company_status },
        });
    }

    // 显示新增.
    handleAdd = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/updateState',
            payload: { addModelShow: true },
        });
    };

    // 新增.
    auditModelOk = values => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/add',
            payload: { values },
        });
    };

    // 关闭页面对话框
    auditModelClose = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/updateState',
            payload: { "addModelShow": false },
        });
    };

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'supplier_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { supplierList, addModelShow, pageSize, page } = this.props;

        const columns = [
            {
                title: '企业名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '企业注册号',
                dataIndex: 'reg_code',
                key: 'reg_code',
            },
            {
                title: '供应商评分',
                dataIndex: 'score',
                key: 'score',
            },
            {
                title: '更新日期',
                dataIndex: 'ent_update_time',
                key: 'ent_update_time',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.handleDetails.bind(this, record.name)}>查看</Button>
                        {
                            <Popconfirm placement="top" title="确定要修改供应商的合法性？"
                                onConfirm={this.handleTypes.bind(this, record.name, record.is_legal)} okText="确定" cancelText="取消">
                                <Button size="small" type="link">
                                    {record.is_legal === '0' ? <span style={{ color: "#9B9B9B" }}>设为不合法企业</span> : <span>设为合法企业</span>}
                                </Button>
                            </Popconfirm>
                        }
                    </span>
                ),
            },
        ];

        return (
            <div>
                <div>
                    <Row type="flex" align="middle">
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item label="状态">
                                {getFieldDecorator('supplier_status', {
                                })(
                                    <Select placeholder='选择是否为合法企业' allowClear={true} style={{ width: 200 }}>
                                        <Option value='0'>是</Option>
                                        <Option value='1'>否</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('supplier_id', {
                                })(
                                    <Input type="text" placeholder="请输入企业名称、企业注册号" style={{ width: 300 }} allowClear={true} />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" icon="search" htmlType="submit">查询</Button>
                            </Form.Item>
                        </Form>
                        <Button type="primary" onClick={this.handleAdd}>新增</Button>
                    </Row>
                    <Modal
                        title="添加供应商"
                        visible={addModelShow}
                        footer={null}
                        closable={false}
                    >
                        <SupplierAdd auditModelOk={this.auditModelOk} auditModelClose={this.auditModelClose} />
                    </Modal>
                </div>
                <Card style={{ margin: '20px 0 40px 0' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}>
                    <Table rowKey={record => record.id} columns={columns} dataSource={supplierList.datalist} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": supplierList.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }} />
                </Card>
            </div>
        )
    }
}

export default supplier_list;



