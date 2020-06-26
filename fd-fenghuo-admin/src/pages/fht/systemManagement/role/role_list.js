import React from "react";
import { connect } from 'dva';
import { Table, Button, Row, Card } from 'antd';

@connect(({ common_model, role_model }) => ({
    roleData: role_model.roleData,
    page: role_model.page,
    pageSize: role_model.pageSize,
}))

class role_list extends React.Component {
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
                breadcrumb: { name: '系统管理', href: '/fht/systemManagement/role/role_list.html', detail: '角色管理' },
                menu: {
                    selectedKeys: ['role'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'role_model/roleList',
        });
    }

    render() {
        const { roleData, pageSize, page } = this.props;
        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                width: '70%',
            },
            {
                title: '操作',
                key: 'action',
                width: '70%',
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link">编辑</Button>
                    </span>
                )
            },
        ];
        return (
            <div>
                <Row>
                    <Button style={{ float: 'right' }} type="primary" onClick={this.showModal}>新增</Button>
                </Row>
                <Card style={{ margin: '20px 0 40px 0' }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0 5px 0 5px',
                    }}
                    bordered={false}
                >
                    <Table rowKey={record => record.name} columns={columns} dataSource={roleData.datalist} pagination={{
                        pageSize: pageSize,
                        "showQuickJumper": true,
                        current: page,
                        "showSizeChanger": true,
                        "total": roleData.totalSize,
                        "onChange": this.pageChange,
                        "onShowSizeChange": this.pageSizeChange
                    }}
                    />
                </Card>
            </div>
        );
    }
}

export default role_list;