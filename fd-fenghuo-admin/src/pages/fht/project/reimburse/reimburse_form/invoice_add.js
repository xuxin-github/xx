import React from 'react';
import { Form, Row, Col, Input, Select, DatePicker, Button, Steps } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { Option } = Select;
const { Step } = Steps;

@connect(({ bill_model }) => ({}))

@Form.create()
class invoice_add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            // 加载状态.
            isLoading: false,
            // 发票查找内容.
            invoice_detail: {},
            // 发票类型.
            invoice_type: '',
        };
    }

    // 查找发票.
    getForm = (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true,
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                dispatch({
                    type: 'bill_model/querySubmit',
                    payload: { values },
                    callback: rs => {
                        this.setState({
                            invoice_detail: rs.data,
                        });
                        // 如果返回0或者4, 则继续下一步.
                        if (rs.code === 0 || rs.code === 4) {
                            const current = this.state.current + 1;
                            this.setState({ current, isLoading: false });
                        }
                        this.setState({ isLoading: false });
                    }
                });
            }
        })
    }

    // 确定.
    determine = (invoice_detail) => {
        this.props.getInvoiceData(invoice_detail);
        // 清空输入的内容
        this.props.form.resetFields();
        this.setState({
            current: 0,
        })
    }

    // 点击取消后, 关闭对话框.
    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleCancel();
        // 清空输入的内容
        this.props.form.resetFields();
        this.setState({
            current: 0,
        })
    }

    // 选择发票类型.
    handleChange = (value) => {
        this.setState({
            invoice_type: value,
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { current, isLoading, invoice_detail } = this.state;
        const steps = [
            {
                title: '查找发票',
                content: <div>
                    <Form>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="发票类型">
                                    {getFieldDecorator('bill_type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择发票类型!',
                                            },
                                        ],
                                    })(
                                        <Select placeholder="请选择发票的类型" allowClear={true} onChange={this.handleChange}>
                                            <Option value='01'>增值税专用发票</Option>
                                            <Option value='04'>增值税普通发票</Option>
                                            <Option value='10'>增值税普通发票（电子）</Option>
                                            <Option value='11'>增值税普通发票（卷式）</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="发票代码">
                                    {getFieldDecorator('bill_id', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入发票代码!',
                                            },
                                        ],
                                    })(<Input placeholder="请输入发票代码" allowClear={true} />)}
                                </Form.Item>
                                {
                                    this.state.invoice_type === "01" ?
                                        <Form.Item label="发票金额">
                                            {getFieldDecorator('bill_money', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入发票金额!',
                                                    },
                                                ],
                                            })(<Input placeholder="请输入发票金额（不含税）" allowClear={true} />)}
                                        </Form.Item>
                                        :
                                        <Form.Item label="发票金额">
                                            {getFieldDecorator('bill_money')(
                                                <Input placeholder="请输入发票金额（不含税）" allowClear={true} />)}
                                        </Form.Item>

                                }
                                <Form.Item style={{ float: 'right' }}>
                                    <Button type="primary" onClick={this.getForm} loading={isLoading}>查找</Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="发票号码">
                                    {getFieldDecorator('bill_number', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入发票号码!',
                                            },
                                        ],
                                    })(<Input placeholder="请输入发票号码" allowClear={true} />)}
                                </Form.Item>
                                {
                                    this.state.invoice_type === "01" ?
                                        <Form.Item label="校验码后6位">
                                            {getFieldDecorator('bill_xy_id')
                                                (<Input placeholder="请输入发票检验码后6位" allowClear={true} />)}
                                        </Form.Item>
                                        :
                                        <Form.Item label="校验码后6位">
                                            {getFieldDecorator('bill_xy_id', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请输入发票检验码后6位!',
                                                    },
                                                ],
                                            })(<Input placeholder="请输入发票检验码后6位" allowClear={true} />)}
                                        </Form.Item>
                                }
                                <Form.Item label="开票日期">
                                    {getFieldDecorator('bill_time', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择开票日期!',
                                            },
                                        ],
                                    })(<DatePicker style={{ width: '100%' }} allowClear={true} />)}
                                </Form.Item>
                                <Form.Item>
                                    <Button onClick={this.handleCancel}>取消</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>,
            },
            {
                title: '发票详情',
                content: <div>
                    <Form>
                        <Row style={{ marginTop: '10px' }}>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>发票号码：</span><span>{invoice_detail.invoice_no_short}</span></Col>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>销方名称：</span><span>{invoice_detail.s_name}</span></Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>发票类型：</span><span>{
                                invoice_detail.invoice_type === '01' ? '增值税专用发票' :
                                    (invoice_detail.invoice_type === '04' ? '增值税普通发票' :
                                        (invoice_detail.invoice_type === '10' ? '增值税普通发票（电子）' : invoice_detail.invoice_type === '11' ? '增值税普通发票（卷式）' : ''))
                            }</span></Col>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>发票类别：</span><span>{invoice_detail.invoice_catalog === '01' ? "管理费类" : invoice_detail.invoice_catalog === '02' ? "咨询费类" :
                                invoice_detail.invoice_catalog === '03' ? "会议费类" : invoice_detail.invoice_catalog === '04' ? "培训费类" : invoice_detail.invoice_catalog === '05' ? "旅游费类" : invoice_detail.invoice_catalog === '06' ? "手续费类" : '其他费类'
                            }</span></Col>
                        </Row>
                        <Row style={{ marginTop: '10px' }}>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>开票日期：</span><span>{moment(invoice_detail.invoice_time).format('YYYY-MM-DD')}</span></Col>
                            <Col span={12}><span style={{ color: '#AFADAC' }}>开票金额：</span><span>{invoice_detail.price_amount}</span></Col>
                        </Row>
                        <Row gutter={16} style={{ marginTop: '30px' }}>
                            <Col span={12}>
                                <Form.Item style={{ float: 'right' }}>
                                    <Button type="primary" onClick={this.determine.bind(this, invoice_detail)}>确定</Button>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <Button onClick={this.handleCancel}>取消</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>,
            },
        ];
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <Steps current={current}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div>{steps[current].content}</div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default invoice_add;