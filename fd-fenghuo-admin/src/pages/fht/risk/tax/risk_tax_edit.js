import React from 'react';
import { Row, Button, Form, Input, DatePicker, Card } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';

const { TextArea } = Input;

@connect(({ tax_model }) => ({
    taxDetail: tax_model.taxDetail,
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
            type: 'tax_model/taxDetail',
            payload: {
                tax_name: location.query.tax_name,
            },
        });
    }

    // 保存.
    getForm = (id, is_release) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                dispatch({
                    type: 'tax_model/updateTax',
                    payload: { values, id, is_release },
                    callback: (code) =>{
                        if(code == 0){
                            router.push({
                                pathname: '/fht/risk/risk_list',
                                query: {
                                    key: "税收违法案例检索",
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
                    type: 'tax_model/updateTax',
                    payload: { values, id, is_release: "01" },
                    callback: (code) =>{
                        if(code == 0){
                            router.push({
                                pathname: '/fht/risk/risk_list',
                                query: {
                                    key: "税收违法案例检索",
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
                key: "税收违法案例检索",
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { taxDetail } = this.props;
        const tax = taxDetail || {};
        return (
            <div>
                <Row>
                    <Button onClick={this.gotoBack}>取消</Button>
                    <div style={{ float: 'right' }}>
                        <Button type="primary" style={{ margin: '0 10px 0 0' }} onClick={this.getForm.bind(this, tax.id, tax.is_release)}>保存</Button>
                        <Button type="primary" onClick={this.getFormToRelease.bind(this, tax.id)}>保存并发布</Button>
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
                                initialValue: tax.name,
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
                                initialValue: tax.type,
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
                                initialValue: tax.party,
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
                                initialValue: tax.result,
                                rules: [
                                    {
                                        required: true,
                                        message: '请完善信息',
                                    },
                                ],
                            })(
                                <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入处罚结果" allowClear={true} />,
                            )}
                        </Form.Item>
                        <Form.Item label="处罚作出日期">
                            {getFieldDecorator('date', {
                                initialValue: moment(tax.data),
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
                        <Form.Item label="违法行为具体类型">
                            {getFieldDecorator('specific_type', {
                                initialValue: tax.specific_type,
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