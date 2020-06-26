import { connect } from "dva";
import React from "react";
import { Form, Table, Button, Row, Card, Modal } from 'antd';
import ContractTagAdd from './contractTag_add';
import ContractTagEdit from './contractTag_edit';

@connect(({ common_model, contractTag_model }) => ({
    contractTagData: contractTag_model.contractTagData,
    page: contractTag_model.page,
    pageSize: contractTag_model.pageSize,
    updateVisible: contractTag_model.updateVisible,
}))

@Form.create()
class contractTag_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            //标签合同名称
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
                    href: '/fht/systemManagement/contractTag/contractTag_list.html',
                    detail: '合同标签'
                },
                menu: {
                    selectedKeys: ['contractTag'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'contractTag_model/contractTagList',
        });
    }

    //显示新增对话框
    showModal = () => {
        this.setState({
            visible: true
        })
    }
    //隐藏新增对话框
    handleAddCancel = (e) => {

        this.setState({
            visible: false
        })
    }

    //新增合同标签
    getAddDate = value => {
        console.log(value)
        const { dispatch } = this.props;
        dispatch({
            type: 'contractTag_model/add',
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
            type: 'contractTag_model/updateState',
            payload: { tag_name: value, updateVisible: true },
        });
        this.setState({
            tag: value
        });

    }


    // 修改
    getUpdateData = (value, tag_code) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contractTag_model/update',
            payload: { formdata: value, tag_code },
            callback: (code) => {
                if (code === 0 || code === 2) {
                    dispatch({
                        type: 'contractTag_model/updateState',
                        payload: { updateVisible: false },
                    });
                } else {
                    dispatch({
                        type: 'contractTag_model/updateState',
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
            type: 'contractTag_model/updateState',
            payload: { updateVisible: false },
        });
    };


    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contractTag_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contractTag_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };
    render() {
        const { contractTagData, pageSize, page, updateVisible } = this.props;
        const { tag } = this.state;
        const contractTag = contractTagData || [];
        const columns = [
            {
                title: '合同名称',
                dataIndex: 'tag_name',
                key: 'tag_name',
                width: '70%',
            },
            {
                title: '操作',
                dataIndex: 'action',
                width: '30%',
                render: (text, record) => (
                    <span>
                        <Button type="link" size="small" onClick={this.showUpdateModal.bind(this, record.tag_name)}>编辑</Button>
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
                    title="新增合同标签"
                    closable={false}
                    footer={null}
                >
                    <ContractTagAdd getAddDate={this.getAddDate} handleAddCancel={this.handleAddCancel} />
                </Modal>
                <Modal
                    visible={updateVisible}
                    title="修改合同类别"
                    closable={false}
                    footer={null}
                >
                    <ContractTagEdit key={tag} getUpdateData={this.getUpdateData} handleUpdateCancel={this.handleUpdateCancel} />
                </Modal>
                <Card
                    style={{ margin: '20px 0' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}
                >
                    <Table columns={columns} dataSource={contractTag.datalist} rowKey={record => record.tag_name} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": contractTag.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }}>

                    </Table>
                </Card>

            </div>

        )
    }
}
export default contractTag_list;