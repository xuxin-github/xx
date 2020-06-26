import React from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Card, Modal, Popconfirm } from 'antd';
import router from 'umi/router';
import DepartmentAdd from './department_add';
import DepartmentEdit from './department_edit';

@connect(({ common_model, department_model }) => ({
    departmentData: department_model.departmentData,
    page: department_model.page,
    pageSize: department_model.pageSize,
    updateVisible: department_model.updateVisible,
}))

class department_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 控制对话框的显示.
            visible: false,
            // 部门名称.
            dept: '',
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '系统管理', href: '/fht/systemManagement/department/department_list.html', detail: '组织部门管理' },
                menu: {
                    selectedKeys: ['department'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'department_model/departmentList',
        });
    }

    // 显示新增对话框.
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    // 新增组织部门.
    getAddData = value => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/add',
            payload: { formdata: value },
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

    // 点击新增对话框取消之后执行的操作.
    handleAddCancel = e => {
        this.setState({
            visible: false,
        });
    };

    // 显示修改对话框.
    showUpdateModal = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/updateState',
            payload: { dept_name: value, updateVisible: true },
        });
        this.setState({
            dept: value,
        });
    }

    // 修改组织部门.
    getUpdateData = (value, dept_code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/update',
            payload: { formdata: value, dept_code },
            callback: (code) => {
                if (code === 0 || code === 2) {
                    dispatch({
                        type: 'department_model/updateState',
                        payload: { updateVisible: false },
                    });
                } else {
                    dispatch({
                        type: 'department_model/updateState',
                        payload: { updateVisible: true },
                    });
                }
            }
        });
    };

    // 点击修改对话框取消之后执行的操作.
    handleUpdateCancel = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/updateState',
            payload: { updateVisible: false },
        });
    };

    // 删除组织部门.
    deleteDept = (dept_code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/delete',
            payload: { dept_code },
        });
    }

    // 下级部门.
    toOneView = (code, name) => {
        router.push({
            pathname: '/fht/systemManagement/department/department_list01',
            query: {
                p_dept_no: code,
                dept_name: name,
            },
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { departmentData, pageSize, page, updateVisible } = this.props;
        const { dept } = this.state;
        const columns = [
            {
                title: '组织部门名称',
                dataIndex: 'name',
                key: 'name',
                width: '70%',
            },
            {
                title: '操作',
                key: 'action',
                width: '30%',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.toOneView.bind(this, record.dept_code, record.name)}>下级部门</Button>
                        <Button size="small" type="link" onClick={this.showUpdateModal.bind(this, record.name)}>编辑</Button>
                        {
                            <Popconfirm placement="top" title="确定要删除此部门？"
                                onConfirm={this.deleteDept.bind(this, record.dept_code)} okText="确定" cancelText="取消">
                                <Button size="small" type="link" style={{ color: "#DD5364" }}>删除</Button>
                            </Popconfirm>
                        }
                    </span>
                )
            },
        ];
        return (
            <div>
                <Row>
                    <Button style={{ float: 'right' }} type="primary" onClick={this.showModal}>新增</Button>
                </Row>
                <Modal
                    title="组织部门"
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                >
                    <DepartmentAdd getAddData={this.getAddData} handleAddCancel={this.handleAddCancel} />
                </Modal>
                <Modal
                    title="组织部门"
                    visible={updateVisible}
                    closable={false}
                    footer={null}
                >
                    <DepartmentEdit key={dept} getUpdateData={this.getUpdateData} handleUpdateCancel={this.handleUpdateCancel} />
                </Modal>
                <Card style={{ margin: '20px 0 40px 0' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}
                >
                    <Table rowKey={record => record.name} columns={columns} dataSource={departmentData.datalist} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": departmentData.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }}
                    />
                </Card>
            </div>
        );
    }
}

export default department_list;