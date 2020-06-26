import React from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Card, Modal, Popconfirm } from 'antd';
import PersonnelAdd from './personner_add';
import PersonnelEdit from './personner_edit';
import authutil from '../../../../utils/authutil';

@connect(({ common_model, personnel_model }) => ({
    personnelData: personnel_model.personnelData,
    page: personnel_model.page,
    pageSize: personnel_model.pageSize,
    updateVisible: personnel_model.updateVisible,
}))

class personnel_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 控制对话框的显示.
            visible: false,
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '系统管理', href: '/fht/systemManagement/personnel/personnel_list.html', detail: '人员管理' },
                menu: {
                    selectedKeys: ['personnel'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'personnel_model/personnelList',
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
            type: 'personnel_model/add',
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
            type: 'personnel_model/updateState',
            payload: { id: value, updateVisible: true },
        });
    }

    // 修改组织部门.
    getUpdateData = (value, id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'personnel_model/update',
            payload: { formdata: value, id },
            callback: (code) => {
                if (code === 0) {
                    dispatch({
                        type: 'personnel_model/updateState',
                        payload: { updateVisible: false },
                    });
                } else {
                    dispatch({
                        type: 'personnel_model/updateState',
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
            type: 'personnel_model/updateState',
            payload: { updateVisible: false },
        });
    };

    // 改变禁启用状态.
    changeStatus = (id, disable) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'personnel_model/change',
            payload: { id, disable },
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'personnel_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'personnel_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { personnelData, pageSize, page, updateVisible } = this.props;
        const columns = [
            {
                title: '登录账号',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '人员姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '角色权限',
                dataIndex: 'role_name',
                key: 'role_name',
            },
            {
                title: '组织部门',
                dataIndex: 'dept_names',
                key: 'dept_names',
                render: dept_names => (
                    <span>{dept_names ? dept_names : '--'}</span>
                )
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.showUpdateModal.bind(this, record.id)}>编辑</Button>
                        {
                            <Popconfirm placement="top" title={record.is_disable == '0' ? "确定要禁用此用户？" : "确定要启用此用户？"}
                                onConfirm={this.changeStatus.bind(this, record.id, record.is_disable)} okText="确定" cancelText="取消">
                                <Button size="small" type="link" style={{ color: record.is_disable == '1' ? "#DD5364" : "#37B500" }}>
                                    {record.is_disable == '1' ? '禁用' : '启用'}
                                </Button>
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
                    title="人员信息"
                    visible={this.state.visible}
                    closable={false}
                    footer={null}
                >
                    <PersonnelAdd getAddData={this.getAddData} handleAddCancel={this.handleAddCancel} />
                </Modal>
                <Modal
                    title="人员信息"
                    visible={updateVisible}
                    closable={false}
                    footer={null}
                >
                    <PersonnelEdit key={Math.random()} getUpdateData={this.getUpdateData} handleUpdateCancel={this.handleUpdateCancel} />
                </Modal>
                <Card style={{ margin: '20px 0 40px 0' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}
                >
                    <Table rowKey={record => record.name} columns={columns} dataSource={personnelData.datalist} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": personnelData.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }}
                    />
                </Card>
            </div>
        );
    }
}

export default personnel_list;