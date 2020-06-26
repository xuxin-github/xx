import React from 'react';
import { Form, Input, Table, Button, Modal, Row, Card, Popconfirm } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import ProjectAddForm from './project_form/project_add_form';

@connect(({ common_model, project_model }) => ({
    projectList: project_model.projectList,
    page: project_model.page,
    pageSize: project_model.pageSize,
}))

@Form.create()
class project_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 控制对话框的显示.
            visible: false,
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
                breadcrumb: { name: '项目管理', href: '' },
                menu: {
                    selectedKeys: ['project'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'project_model/tableList',
            payload: { username: userdata.username, role_code: roledata[0].authority },
        });
    }

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            const { username, role_code } = this.state;
            dispatch({
                type: 'project_model/query',
                payload: { values, username, role_code }
            });
        });
    }

    // 显示对话框.
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    // 新增项目.
    getAddData = value => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'project_model/add',
            payload: { formdata: value, username, role_code },
            callback: (code) => {
                if (code === 0) {
                    this.setState({
                        visible: false,
                    })
                } else {
                    this.setState({
                        visible: true,
                    })
                }
            }
        });
    };

    // 点击取消之后执行的操作.
    handleAddCancel = e => {
        this.setState({
            visible: false,
        });
    };

    // 点击查看后, 携带数据跳转页面.
    toDetailView = (project_name, project_code) => {
        router.push({
            pathname: '/fht/project/project_detail',
            query: {
                project_name: project_name,
                project_code: project_code,
            },
        });
    }

    // 通过.
    handlePass = (project_name) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'project_model/updateStatus',
            payload: { project_name, status: '1', username, role_code }
        });
    }

    // 驳回.
    handleReject = (project_name) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'project_model/updateStatus',
            payload: { project_name, status: '2', username, role_code }
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'project_model/changePageOrPageSize',
            payload: { page: current, pageSize, username, role_code }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'project_model/changePageOrPageSize',
            payload: { page, pageSize, username, role_code }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { projectList, pageSize, page } = this.props;
        const { role_code } = this.state;

        const columns = [
            {
                title: '项目名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '发起人',
                dataIndex: 'initiator',
                key: 'initiator',
            },
            {
                title: '发起部门',
                dataIndex: 'dept_name',
                key: 'dept_name',
            },
            {
                title: '合同支出',
                dataIndex: 'contract_spend',
                key: 'contract_spend',
                render: contract_spend => (
                    <span>{contract_spend.toFixed(2)}</span>
                ),
            },
            {
                title: '报销支出',
                dataIndex: 'reimburse_spend',
                key: 'reimburse_spend',
                render: reimburse_spend => (
                    <span>{reimburse_spend.toFixed(2)}</span>
                ),
            },
            {
                title: '项目总支出',
                dataIndex: 'project_total_spend',
                key: 'project_total_spend',
                render: (text, record) => (
                    record.project_total_spend > record.project_budget ? <span style={{ color: '#DD5364' }}>{record.project_total_spend.toFixed(2)}</span> :
                        <span style={{ color: '#539E00' }}>{record.project_total_spend.toFixed(2)}</span>
                ),
            },
            {
                title: '项目预算',
                dataIndex: 'project_budget',
                key: 'project_budget',
                render: project_budget => (
                    <span>{project_budget ? project_budget.toFixed(2) : ''}</span>
                ),
            },
            {
                title: '创建日期',
                dataIndex: 'create_time',
                key: 'create_time',
                render: create_time => (
                    <span>
                        {
                            moment(create_time).format('YYYY.MM.DD')
                        }
                    </span>
                ),
            },
            {
                title: '报销审核',
                dataIndex: 'reimburse_audit',
                key: 'reimburse_audit',
            },
            {
                title: '合同审核',
                dataIndex: 'contract_audit',
                key: 'contract_audit',
            },
            {
                title: '项目审核',
                dataIndex: 'project_audit',
                key: 'project_audit',
                render: project_audit => (
                    project_audit == '0' ? <span style={{ color: '#F5A623' }}>待审核</span> : project_audit == '1' ?
                        <span style={{ color: '#539E00' }}>已通过</span> :
                        <span style={{ color: '#DD5364' }}>已驳回</span>
                ),
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        {
                            record.project_audit == '0' ?
                                (role_code != 'ROLE_DIRECTOR' ?
                                    <span>
                                    <Button size="small" type="link" onClick={this.toDetailView.bind(this, record.name, record.project_code)}>查看</Button>
                                        <Popconfirm placement="top" title="确定审核通过？"
                                            onConfirm={this.handlePass.bind(this, record.name)} okText="确定" cancelText="取消">
                                            <Button size="small" type="link" style={{ color: '#539E00' }}>通过</Button>
                                        </Popconfirm>
                                        <Popconfirm placement="top" title="确定审核驳回？"
                                            onConfirm={this.handleReject.bind(this, record.name)} okText="确定" cancelText="取消">
                                            <Button size="small" type="link" style={{ color: '#DD5364' }}>驳回</Button>
                                        </Popconfirm>
                                    </span>
                                    :
                                    ''
                                )
                                :
                                (
                                    record.project_audit == '1' ?
                                        <Button size="small" type="link" onClick={this.toDetailView.bind(this, record.name, record.project_code)}>查看</Button>
                                        :
                                        ''
                                )
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
                            <Form.Item >
                                {getFieldDecorator('project_name', {
                                    initialValue: projectList.project_name
                                })(
                                    <Input placeholder="请输入项目名称" allowClear={true} />,
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" icon="search" htmlType="submit" >
                                    查 询
                                </Button>
                            </Form.Item>
                        </Form>
                        <Button type="primary" onClick={this.showModal}>新增</Button>
                    </Row>
                    <Modal
                        title="创建项目"
                        visible={this.state.visible}
                        closable={false}
                        footer={null}
                    >
                        <ProjectAddForm getAddData={this.getAddData} handleAddCancel={this.handleAddCancel} />
                    </Modal>
                </div>
                <div>
                    <Card style={{ margin: '20px 0 40px 0' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                            padding: '0 5px 0 5px',
                        }}
                        bordered={false}
                    >
                        <Table rowKey={record => record.id} columns={columns} dataSource={projectList.datalist} pagination={{
                            pageSize: pageSize,
                            "showQuickJumper": true,
                            current: page,
                            "showSizeChanger": true,
                            "total": projectList.totalSize,
                            "onChange": this.pageChange,
                            "onShowSizeChange": this.pageSizeChange
                        }}
                        />
                    </Card>
                </div>
            </div>
        );
    }
}

export default project_list;