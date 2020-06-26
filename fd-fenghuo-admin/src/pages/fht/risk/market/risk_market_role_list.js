import React from 'react';
import { Row, Form, Button, Input, Table, Popconfirm } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';

@connect(({ market_model }) => ({
    marketData: market_model.marketData,
    page: market_model.page,
    pageSize: market_model.pageSize,
}))

@Form.create()
class risk_market_role_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/marketList',
        });
    }

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            dispatch({
                type: 'market_model/query',
                payload: { values }
            });
        });
    }

     // 跳转到新增页面.
     toAdd = () => {
        router.push({ pathname: '/fht/risk/market/risk_market_add' });
    }

    // 跳转到修改页面.
    toEditView = (name) => {
        router.push({
            pathname: '/fht/risk/market/risk_market_edit',
            query: {
                market_name: name,
            }
        });
    }

    // 修改企业状态.
    handleTypes = (name, is_release) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/updateStatus',
            payload: { name, is_release },
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/changePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/changePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { marketData, page, pageSize } = this.props;
        const market = marketData || {};
        const columns = [
            {
                title: '处罚文书书号',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '违法行为类型',
                dataIndex: 'type',
                key: 'type',
                width: "10%",
            },
            {
                title: '案件当事人',
                dataIndex: 'party',
                key: 'party',
            },
            {
                title: '处罚结果',
                dataIndex: 'result',
                key: 'result',
            },
            {
                title: '处罚作出日期',
                dataIndex: 'date',
                key: 'date',
                width: "10%",
                render: date => (
                    <span>
                        {
                            moment(date).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
            {
                title: '违法行为类型细分',
                dataIndex: 'type_subsection',
                key: 'type_subsection',
                width: "10%",
            },
            {
                title: '违法行为具体类型',
                dataIndex: 'specific_type',
                key: 'specific_type',
            },
            {
                title: '发布状态',
                dataIndex: 'is_release',
                key: 'is_release',
                width: "7%",
                render: (is_release) => (
                    <span>
                        {is_release === '01' ? <b>已发布</b> : <b>未发布</b>}
                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                width: "15%",
                render: (text, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.toEditView.bind(this, record.name)}>编辑</Button>
                        {
                            <Popconfirm placement="top" title="确定要修改发布状态？"
                                onConfirm={this.handleTypes.bind(this, record.name, record.is_release)} okText="确定" cancelText="取消">
                                <Button size="small" type="link">
                                    {record.is_release === '01' ? <span>取消发布</span> : <span>发布</span>}
                                </Button>
                            </Popconfirm>
                        }
                    </span>
                )
            },
        ];
        return (
            <div>
                <Row type="flex" align="middle">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item >
                            {getFieldDecorator('risk_market_name', {
                            })(
                                <Input placeholder="请输入处罚文书书号、违法行为类型、案件当事人、违法行为类型细分、违法行为具体类型" style={{ width: 700 }} allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" icon="search" htmlType="submit" >
                                查 询
                                </Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" onClick={this.toAdd}>新增</Button>
                </Row>

                <Table style={{ margin: '20px 0 0 0' }} rowKey={record => record.name} columns={columns} dataSource={market.datalist} pagination={{
                    pageSize: pageSize,
                    "showQuickJumper": true,
                    current: page,
                    "showSizeChanger": true,
                    "total": market.totalSize,
                    "onChange": this.pageChange,
                    "onShowSizeChange": this.pageSizeChange
                }} />
            </div>
        );
    }
}

export default risk_market_role_list;