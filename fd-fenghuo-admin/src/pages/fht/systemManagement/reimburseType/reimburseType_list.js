import { connect } from "dva";
import React from "react";
import { Form, Table, Button, Row, Card, Modal } from 'antd';
import ReimburseTypeAdd from './reimburseType_add';
import ReimburseTypeEdit from './reimburseType_edit';

@connect(({ common_model, reimburseType_model }) => ({
    reimburseTypeData: reimburseType_model.reimburseTypeData,
    page: reimburseType_model.page,
    pageSize: reimburseType_model.pageSize,
    updateVisible: reimburseType_model.updateVisible,
}))

@Form.create()
class reimburseType_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            //报销类别名称
            tag: ''
        }
    }
    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: {
                    name: '系统管理',
                    href: '/fht/systemManagement/reimburseType/reimburseType_list.html',
                    detail: '报销类别'
                },
                menu: {
                    selectedKeys: ['reimburseType'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'reimburseType_model/reimburseTypeList',
        });
    }
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    handleAddCancel = (e) => {

        this.setState({
            visible: false
        })
    }

    //新增合同标签
    getAddDate = value => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/add',
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
    }


    // 显示修改对话框.
    showUpdateModal = (value) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/updateState',
            payload: { type_name: value, updateVisible: true },
        });
        this.setState({
            tag: value
        });

    }


    // 修改
    getUpdateData = (value, tag_code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/update',
            payload: { formdata: value, type_code: tag_code },
            callback: (code) => {
                if (code === 0 || code === 2) {
                    dispatch({
                        type: 'reimburseType_model/updateState',
                        payload: { updateVisible: false },
                    });
                } else {
                    dispatch({
                        type: 'reimburseType_model/updateState',
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
            type: 'reimburseType_model/updateState',
            payload: { updateVisible: false },
        });
    };


    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };
    render() {
        const { reimburseTypeData, pageSize, page, updateVisible } = this.props;
        const { tag } = this.state;
        const reimburseType = reimburseTypeData || [];
        const columns = [
            {
                title: '报销类别',
                dataIndex: 'type_name',
                key: 'type_name',
                width: '70%',
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: '30%',
                render: (text, record) => (
                    <span>
                        <Button type="link" size="small" onClick={this.showUpdateModal.bind(this, record.type_name)}>编辑</Button>
                    </span>
                )

            }
        ];

        return (
            <div>
                <Row>
                    <Button type="primary" style={{ float: 'right' }} onClick={this.showModal}>新增</Button>
                </Row>
                <Modal
                    visible={this.state.visible}
                    title="新增报销类别"
                    closable={false}
                    footer={null}
                >
                    <ReimburseTypeAdd getAddDate={this.getAddDate} handleAddCancel={this.handleAddCancel} />
                </Modal>
                <Modal
                    visible={updateVisible}
                    title="修改报销类别"
                    closable={false}
                    footer={null}
                >
                    <ReimburseTypeEdit key={tag} getUpdateData={this.getUpdateData} handleUpdateCancel={this.handleUpdateCancel} />
                </Modal>
                <Card
                    style={{ marginTop: '20px' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}
                >
                    <Table columns={columns} dataSource={reimburseType.datalist} rowKey={record => record.type_name} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": reimburseType.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }}>

                    </Table>
                </Card>

            </div>

        )
    }
}
export default reimburseType_list;