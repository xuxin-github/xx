import React from 'react';
import { Row, Button, Form, Input, DatePicker, Card } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ market_model }) => ({
    marketDetail: market_model.marketDetail,
}))

@Form.create()
class risk_market_edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            type: 'market_model/marketDetail',
            payload: {
                market_name: location.query.market_name,
            },
        });
    }

    // 保存.
    getForm = (id, is_release) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                dispatch({
                    type: 'market_model/updateMarket',
                    payload: { values, id, is_release },
                    callback: (code) =>{
                        if(code == 0){
                            router.push({
                                pathname: '/fht/risk/risk_list',
                                query: {
                                    key: "市场监管违法案例检索",
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    // 保存并发布.
    getFormToRelease = (id) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                dispatch({
                    type: 'market_model/updateMarket',
                    payload: { values, id, is_release: "01" },
                    callback: (code) =>{
                        if(code == 0){
                            router.push({
                                pathname: '/fht/risk/risk_list',
                                query: {
                                    key: "市场监管违法案例检索",
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    gotoBack = () => {
        router.push({
            pathname: '/fht/risk/risk_list',
            query: {
                key: "市场监管违法案例检索",
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { marketDetail } = this.props;
        const market = marketDetail || {};
        return (
            <div>
                <Row>
                    <Button onClick={this.gotoBack}>取消</Button>
                    <div style={{ float: 'right' }}>
                        <Button type="primary" style={{ margin: '0 10px 0 0' }} onClick={this.getForm.bind(this, market.id, market.is_release)}>保存</Button>
                        <Button type="primary" onClick={this.getFormToRelease.bind(this, market.id)}>保存并发布</Button>
                    </div>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ margin: '10px 0 40px 0' }}>
                    <Form>
                        <Form.Item label="处罚文书书号">
                            {getFieldDecorator('name', {
                                initialValue: market.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入处罚文书书号" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="违法行为类型">
                            {getFieldDecorator('type', {
                                initialValue: market.type,
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入违法行为类型" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="案件当事人">
                            {getFieldDecorator('party', {
                                initialValue: market.party,
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入案件当事人" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="处罚结果">
                            {getFieldDecorator('result', {
                                initialValue: market.result,
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入处罚结果" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="处罚作出日期">
                            {getFieldDecorator('date', {
                                initialValue: moment(market.data),
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <DatePicker placeholder="请输入处罚作出日期" style={{ width: '100%' }} />,
                            )}
                        </Form.Item>
                        <Form.Item label="违法行为类型细分">
                            {getFieldDecorator('type_subsection', {
                                initialValue: market.type_subsection,
                            })(
                                <Input placeholder="请输入违法行为类型细分" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="违法行为具体类型">
                            {getFieldDecorator('specific_type', {
                                initialValue: market.specific_type,
                            })(
                                <Input placeholder="请输入违法行为具体类型" allowClear={true} />,
                            )}
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default risk_market_edit;