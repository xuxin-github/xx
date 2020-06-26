import React from 'react';
import { Row, Form, Button, Input, Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';

@connect(({ market_model }) => ({
    marketReleaseData: market_model.marketReleaseData,
    page: market_model.page,
    pageSize: market_model.pageSize,
}))

@Form.create()
class risk_market_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/marketReleaseList',
        });
    }

    // 查询.
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { dispatch } = this.props;
            dispatch({
                type: 'market_model/queryRelease',
                payload: { values }
            });
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/changeReleasePageOrPageSize',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'market_model/changeReleasePageOrPageSize',
            payload: { page, pageSize }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { marketReleaseData, page, pageSize } = this.props;
        const market = marketReleaseData || {};
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
                width: 120,
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
            },
            {
                title: '违法行为具体类型',
                dataIndex: 'specific_type',
                key: 'specific_type',
            },
        ];
        return (
            <div>
                <Row type="flex" align="middle">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item >
                            {getFieldDecorator('risk_market_name', {
                            })(
                                <Input placeholder="请输入处罚文书书号、违法行为类型、案件当事人、违法行为类型细分、违法行为具体类型" style={{ width: 800 }} allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" icon="search" htmlType="submit" >
                                查 询
                                </Button>
                        </Form.Item>
                    </Form>
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

export default risk_market_list;