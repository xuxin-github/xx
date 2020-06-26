import React from 'react';
import { connect } from 'dva';
import { Table, Button, Row, Card, Modal } from 'antd';
import ProjectTagAdd from './projectTag_add';
import ProjectTagEdit from './projectTag_edit';

@connect(({ common_model, projectTag_model }) => ({
    projectTagData: projectTag_model.projectTagData,
    page: projectTag_model.page,
    pageSize: projectTag_model.pageSize,
    updateVisible: projectTag_model.updateVisible,
}))

class projectTag_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 控制对话框的显示.
            visible: false,
            // 标签名称.
            tag: '',
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '系统管理', href: '/fht/systemManagement/projectTag/projectTag_list.html', detail: '项目标签' },
                menu: {
                    selectedKeys: ['projectTag'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'projectTag_model/tagList',
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
            type: 'projectTag_model/add',
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
            type: 'projectTag_model/updateState',
            payload: { tag_name: value, updateVisible: true },
        });
        this.setState({
            tag: value,
        });
    }

    // 修改项目标签名称.
    getUpdateData = (value, tag_code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'projectTag_model/update',
            payload: { formdata: value, tag_code },
            callback: (code) => {
                if (code === 0 || code === 2) {
                    dispatch({
                        type: 'projectTag_model/updateState',
                        payload: { updateVisible: false },
                    });
                } else {
                    dispatch({
                        type: 'projectTag_model/updateState',
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
            type: 'projectTag_model/updateState',
            payload: { updateVisible: false },
        });
    };

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'projectTag_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'projectTag_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { projectTagData, page, pageSize, updateVisible } = this.props;
        const { tag } = this.state;
        const projectTag = projectTagData || [];
        const columns = [
            {
                title: '标签名称',
                dataIndex: 'tag_name',
                key: 'tag_name',
                width: '70%',
            },
            {
                title: '操作',
                key: 'action',
                width: '70%',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.showUpdateModal.bind(this, record.tag_name)}>编辑</Button>
                    </span>
                )
            },
        ];
        return (
            <div>
                <div>
                    <Row>
                        <Button style={{ float: 'right' }} type="primary" onClick={this.showModal}>新增</Button>
                    </Row>
                    <Modal
                        title="项目标签"
                        visible={this.state.visible}
                        closable={false}
                        footer={null}
                    >
                        <ProjectTagAdd getAddData={this.getAddData} handleAddCancel={this.handleAddCancel} />
                    </Modal>
                    <Modal
                        title="项目标签"
                        visible={updateVisible}
                        closable={false}
                        footer={null}
                    >
                        <ProjectTagEdit key={tag} getUpdateData={this.getUpdateData} handleUpdateCancel={this.handleUpdateCancel} />
                    </Modal>
                    <Card style={{ margin: '20px 0 40px 0' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                            padding: '0 5px 0 5px',
                        }}
                        bordered={false}
                    >
                        <Table rowKey={record => record.tag_name} columns={columns} dataSource={projectTag.datalist} pagination={{
                            pageSize: pageSize,
                            "showQuickJumper": true,
                            current: page,
                            "showSizeChanger": true,
                            "total": projectTag.totalSize,
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

export default projectTag_list;