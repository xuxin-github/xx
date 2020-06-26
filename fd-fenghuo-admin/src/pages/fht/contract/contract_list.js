import React from 'react';
import { Form, Input, Table, Button, Modal, Select, Card, Divider, Row, Col } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import ContractAdd from './list_modal_form/contract_add';
const { confirm } = Modal;
const { Option } = Select;

@connect(({ common_model, contract_model }) => ({
    datalist: contract_model.datalist,
    pageSize: contract_model.pageSize,
    page: contract_model.page,
    totalSize: contract_model.totalSize
}))

@Form.create()
class contract_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            user_id:'',
            role_code:''
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        let ROLE = localStorage.getItem("ROLE");
        let roledata = JSON.parse(ROLE);
        let SUB = localStorage.getItem("SUB");
        let sub = JSON.parse(SUB);
        let user_id = sub.substring(0,sub.lastIndexOf("\|"));   
        this.setState({
            user_id: user_id,
            role_code: roledata[0].authority,
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '合同管理' },
                menu: {
                    selectedKeys: ['contract'],
                },
                username: userdata.username,
            }
        });
        if(roledata[0].authority == 'ROLE_DIRECTOR'){
            dispatch({
                type: 'contract_model/tableList',
                payload: { company_id: "1",user_id:user_id }
            });
        }else{
            dispatch({
                type: 'contract_model/tableList',
                payload: { company_id: "1",user_id:'' }
            });
        }
        
    }

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            console.log(values);
            let qx = this.state.role_code;
            if(qx == 'ROLE_DIRECTOR'){
                dispatch({
                    type: 'contract_model/query',
                    payload: { values, company_id: "1",user_id:this.state.user_id }
                });
            }else{
                dispatch({
                    type: 'contract_model/query',
                    payload: { values, company_id: "1",user_id:'' }
                });
            }
           
        });
    }

    // 查看合同详情.
    handleDetails = (contract_code, contract_name) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/contract/total/total_detail',
            query: {
                contract_code: contract_code,
                contract_name: contract_name,
                company_id: "1",
            },
        });
    };

    // 编辑合同状态
    handleUpdateStatus = (contract_name) => {
        const { dispatch } = this.props;
        confirm({
            title: '关闭后，修改风控设置将不受影响',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch({
                    type: 'contract_model/updateContractStatus',
                    payload: { contract_name },
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }

    // 显示添加发票框.
    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    // 获取添加表单的值.
    handleContract = (value) => {
        const { dispatch } = this.props;
        let qx = this.state.role_code;
        if(qx == 'ROLE_DIRECTOR'){
            dispatch({
                type: 'contract_model/addContract',
                payload: { queryParams: value, company_id: "1",user_id:this.state.user_id }
            });
            this.setState({
                visible: false,
            });
        }else{
        dispatch({
            type: 'contract_model/addContract',
            payload: { queryParams: value, company_id: "1",user_id:'' }
        });
        this.setState({
            visible: false,
        });
    }
    }

    // 点击取消后执行的操作.
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        let qx = this.state.role_code;
        if(qx == 'ROLE_DIRECTOR'){      
        dispatch({
            type: 'contract_model/changePageOrPageSize',
            payload: { page: current, pageSize,user_id:this.state.user_id }
        });
    }else{
        dispatch({
            type: 'contract_model/changePageOrPageSize',
            payload: { page: current, pageSize,user_id:'' }
        });
    }
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;    
        let qx = this.state.role_code;
        if(qx == 'ROLE_DIRECTOR'){      
        dispatch({
            type: 'contract_model/changePageOrPageSize',
            payload: { page, pageSize,user_id:this.state.user_id }
        });
    }else{
        dispatch({
            type: 'contract_model/changePageOrPageSize',
            payload: { page, pageSize,user_id:'' }
        });
    }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { datalist, pageSize, totalSize, page } = this.props;
        const { username, role_code } = this.state;
        const columns = [
            {
                title: '合同编号',
                dataIndex: 'contract_code',
                key: 'contract_code',
                width: 150,
            },
            {
                title: '合同名称',
                dataIndex: 'contract_name',
                key: 'contract_name',
                width: 180,
            },
            {
                title: '关联项目名称',
                dataIndex: 'project_name',
                key: 'project_name',
                width: 180,
                render: (project_name) => (
                    <span>
                        {project_name ? project_name : '--'}
                    </span>
                )
            },
            {
                title: '销方名称',
                dataIndex: 's_name',
                key: 's_name',
                width: 230,
                render: (s_name) => (
                    <span>
                        {s_name ? s_name : '--'}
                    </span>
                )
            },
            {
                title: '发票',
                dataIndex: 'invoice_number',
                key: 'invoice_number',
                render: (invoice_number) => (
                    <span>
                        {invoice_number ? invoice_number : 0}
                    </span>
                )
            },
            {
                title: '开票总额',
                dataIndex: 'price_amount',
                key: 'price_amount',
                render: (price_amount) => (
                    <span>
                        {price_amount ? price_amount : 0}
                    </span>
                )
            },
            {
                title: '综合',
                key: 'comprehensive',
                render: (text, record, key) => (
                    <span >
                        <div key={key}>
                            {datalist[key].p2_4 != null ? Number(datalist[key].p2_1) + Number(datalist[key].p2_2) + Number(datalist[key].p2_3) + Number(datalist[key].p2_4) : 25 + Number(datalist[key].p2_2) + Number(datalist[key].p2_3)}
                        </div>
                    </span>
                )

            },
            {
                title: '税务',
                dataIndex: 'p2_1',
                key: 'p2_1',
                render: (p2_1,key) => (
                    <span>
                        {p2_1 ? p2_1 : 25} 
                    </span>
                )

            },
            {
                title: '市监',
                dataIndex: 'p2_2',
                key: 'p2_2',

            },
            {
                title: '内控',
                dataIndex: 'p2_3',
                key: 'p2_3',

            },
            {
                title: '供应商',
                dataIndex: 'p2_4',
                key: 'p2_4',
                render: (p2_4) => (
                    <span>
                        {p2_4 != null ? p2_4 : '--'}
                    </span>
                )
            },
            {
                title: '风险状态',
                dataIndex: 'risk_level',
                key: 'risk_level',
                render: (risk_level) => (
                    <span>
                        {risk_level === '01' ? <b style={{ color: '#539E00' }}>正常</b> : <b style={{ color: '#DD5364' }}>高风险</b>}
                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record, key) => (
                    <span >
                        <div key={key}>
                            <Button type="link" onClick={this.handleDetails.bind(this, record.contract_code, record.contract_name)}>
                                查看</Button>
                            <Divider type="vertical" />                           
                            {record.STATUS == '02' ? '' : <Button style={{ color: 'red' }} type="link" onClick={this.handleUpdateStatus.bind(this, record.contract_name)} >结束</Button>}
                        </div>
                    </span>
                )
            },
        ];


        return (
            <div>
                <div>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Form.Item >
                                {getFieldDecorator('risk_level', {
                                })(
                                    <Select style={{ width: 150 }} placeholder="请选择风险状态" allowClear={true}>
                                        <Option value="01">正常</Option>
                                        <Option value="02">高风险</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item >
                                {getFieldDecorator('contract_params')(
                                    <Input style={{ width: 300 }} placeholder="请输入合同编号、合同名称、销售方名称" allowClear={true} />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" icon="search" htmlType="submit">
                                    查 询
                                </Button>
                            </Form.Item>
                            {/*role_code != 'DIRECTOR' && role_code != 'COMMON' ?
                                <Button type="primary" style={{ marginTop: 4 }} onClick={this.showModal}>新增</Button>:''*/}
                        </Form>

                    </Row>
                    <Modal
                        title="创建合同"
                        visible={this.state.visible}
                        closable={false}
                        footer={null}
                    >
                        <ContractAdd handleContract={this.handleContract} handleCancel={this.handleCancel} />
                    </Modal>
                </div>
                <div>
                    <Card style={{ marginTop: '20px', marginBottom: '40px' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                            padding: '0px 5px 0px 20px',
                        }}
                        bordered={false}>
                        <Table rowKey={record => record.id} style={{ marginTop: '15px' }} columns={columns} dataSource={datalist} pagination={{
                            pageSize: pageSize,
                            "showQuickJumper": true,
                            "defaultCurrent": page,
                            "showSizeChanger": true,
                            "total": totalSize,
                            "onChange": this.pageChange,
                            "onShowSizeChange": this.pageSizeChange
                        }} />
                    </Card>
                </div>
            </div>
        );
    }
}

export default contract_list;