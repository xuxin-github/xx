import React from 'react';
import { connect } from 'dva';
import { Card, Typography, Form, Row, Col, Input, Button } from 'antd';
import util from '../../../utils/notification';
const { Text } = Typography;

@connect(({ common_model, system_model }) => ({
}))

@Form.create()
class system_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            risk: {},
            // 市场监管.
            p3_2_1: 0, p3_2_2: 0, p3_2_3: 0, p3_2_4: 0, p3_2_5: 0, p3_2_6: 0,
            // 内部合规.
            p3_3_1: 0, p3_3_2: 0, p3_3_3: 0, p3_3_4: 0, p3_3_5: 0, p3_3_6: 0,
            p3_3_7: 0, p3_3_8: 0, p3_3_9: 0, p3_3_10: 0, p3_3_11: 0, p3_3_12: 0,
            p3_3_13: 0, p3_3_14: 0, p3_3_15: 0, p3_3_16: 0, p3_3_17: 0, p3_3_18: 0,
            p3_3_19: 0, p3_3_20: 0, p3_3_21: 0,
            // 供应商.
            p3_4_1: 0, p3_4_2: 0, p3_4_3: 0, p3_4_4: 0, p3_4_5: 0, p3_4_6: 0,
            // 加载状态.
            isLoading: false,
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '风控设置' },
                menu: {
                    selectedKeys: ['system'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'system_model/query',
            callback: (data) => {
                if(data != null){
                    this.setState({
                        risk: data,
                        // 市场监管.
                        p3_2_1: data.p3_2_1, p3_2_2: data.p3_2_2, p3_2_3: data.p3_2_3, p3_2_4: data.p3_2_4, p3_2_5: data.p3_2_5, p3_2_6: data.p3_2_6,
                        // 内部合规.
                        p3_3_1: data.p3_3_1, p3_3_2: data.p3_3_2, p3_3_3: data.p3_3_3, p3_3_4: data.p3_3_4, p3_3_5: data.p3_3_5, p3_3_6: data.p3_3_6,
                        p3_3_7: data.p3_3_7, p3_3_8: data.p3_3_8, p3_3_9: data.p3_3_9, p3_3_10: data.p3_3_10, p3_3_11: data.p3_3_11, p3_3_12: data.p3_3_12,
                        p3_3_13: data.p3_3_13, p3_3_14: data.p3_3_14, p3_3_15: data.p3_3_15, p3_3_16: data.p3_3_16, p3_3_17: data.p3_3_17, p3_3_18: data.p3_3_18,
                        p3_3_19: data.p3_3_19, p3_3_20: data.p3_3_20, p3_3_21: data.p3_3_21,
                        // 供应商.
                        p3_4_1: data.p3_4_1, p3_4_2: data.p3_4_2, p3_4_3: data.p3_4_3, p3_4_4: data.p3_4_4, p3_4_5: data.p3_4_5, p3_4_6: data.p3_4_6,
                    })
                }
            }
        });
    }

    // 更新.
    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            isLoading: true,
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const marketScore = Number(values.p3_2_1) + Number(values.p3_2_2) + Number(values.p3_2_3)
                    + Number(values.p3_2_4) + Number(values.p3_2_5) + Number(values.p3_2_6);
                const internalBusiness = Number(values.p3_3_11) + Number(values.p3_3_12) + Number(values.p3_3_13)
                    + Number(values.p3_3_14) + Number(values.p3_3_15)
                    + Number(values.p3_3_16) + Number(values.p3_3_17);
                const internalContract = Number(values.p3_3_1) + Number(values.p3_3_2) + Number(values.p3_3_3)
                    + Number(values.p3_3_4) + Number(values.p3_3_5) + Number(values.p3_3_6);
                const internalDelivery = Number(values.p3_3_18) + Number(values.p3_3_19)
                    + Number(values.p3_3_20) + Number(values.p3_3_21);
                const internalInternal = Number(values.p3_3_7) + Number(values.p3_3_8)
                    + Number(values.p3_3_9) + Number(values.p3_3_10);
                const internalScore = internalBusiness + internalContract + internalDelivery + internalInternal;
                const supplierScore = Number(values.p3_4_1) + Number(values.p3_4_2) + Number(values.p3_4_3)
                    + Number(values.p3_4_4) + Number(values.p3_4_5) + Number(values.p3_4_6);
                if (marketScore === 25 && internalScore === 40 && supplierScore === 10) {
                    const { dispatch } = this.props;
                    dispatch({
                        type: 'system_model/update',
                        payload: { riskData: values },
                        callback: code => {
                            if (code === 0) {
                                this.setState({
                                    isLoading: false,
                                });
                            }
                        }
                    });
                } else {
                    util.error("市场监管风险: 总分25分!内部合规风险: 总分40分!供应商评分: 总分10分!");
                }
            }
        });
    };

    // 市场监管.
    changeMarket1 = (e) => {
        this.setState({
            p3_2_1: e.target.value,
        });
    }
    changeMarket2 = (e) => {
        this.setState({
            p3_2_2: e.target.value,
        });
    }
    changeMarket3 = (e) => {
        this.setState({
            p3_2_3: e.target.value,
        });
    }
    changeMarket4 = (e) => {
        this.setState({
            p3_2_4: e.target.value,
        });
    }
    changeMarket5 = (e) => {
        this.setState({
            p3_2_5: e.target.value,
        });
    }
    changeMarket6 = (e) => {
        this.setState({
            p3_2_6: e.target.value,
        });
    }
    // 内部合规.
    changeInternal1 = (e) => {
        this.setState({
            p3_3_1: e.target.value,
        });
    }
    changeInternal2 = (e) => {
        this.setState({
            p3_3_2: e.target.value,
        });
    }
    changeInternal3 = (e) => {
        this.setState({
            p3_3_3: e.target.value,
        });
    }
    changeInternal4 = (e) => {
        this.setState({
            p3_3_4: e.target.value,
        });
    }
    changeInternal5 = (e) => {
        this.setState({
            p3_3_5: e.target.value,
        });
    }
    changeInternal6 = (e) => {
        this.setState({
            p3_3_6: e.target.value,
        });
    }
    changeInternal7 = (e) => {
        this.setState({
            p3_3_7: e.target.value,
        });
    }
    changeInternal8 = (e) => {
        this.setState({
            p3_3_8: e.target.value,
        });
    }
    changeInternal9 = (e) => {
        this.setState({
            p3_3_9: e.target.value,
        });
    }
    changeInternal10 = (e) => {
        this.setState({
            p3_3_10: e.target.value,
        });
    }
    changeInternal11 = (e) => {
        this.setState({
            p3_3_11: e.target.value,
        });
    }
    changeInternal12 = (e) => {
        this.setState({
            p3_3_12: e.target.value,
        });
    }
    changeInternal13 = (e) => {
        this.setState({
            p3_3_13: e.target.value,
        });
    }
    changeInternal14 = (e) => {
        this.setState({
            p3_3_14: e.target.value,
        });
    }
    changeInternal15 = (e) => {
        this.setState({
            p3_3_15: e.target.value,
        });
    }
    changeInternal16 = (e) => {
        this.setState({
            p3_3_16: e.target.value,
        });
    }
    changeInternal17 = (e) => {
        this.setState({
            p3_3_17: e.target.value,
        });
    }
    changeInternal18 = (e) => {
        this.setState({
            p3_3_18: e.target.value,
        });
    }
    changeInternal19 = (e) => {
        this.setState({
            p3_3_19: e.target.value,
        });
    }
    changeInternal20 = (e) => {
        this.setState({
            p3_3_20: e.target.value,
        });
    }
    changeInternal21 = (e) => {
        this.setState({
            p3_3_21: e.target.value,
        });
    }
    // 供应商.
    changeSupplier1 = (e) => {
        this.setState({
            p3_4_1: e.target.value,
        });
    }
    changeSupplier2 = (e) => {
        this.setState({
            p3_4_2: e.target.value,
        });
    }
    changeSupplier3 = (e) => {
        this.setState({
            p3_4_3: e.target.value,
        });
    }
    changeSupplier4 = (e) => {
        this.setState({
            p3_4_4: e.target.value,
        });
    }
    changeSupplier5 = (e) => {
        this.setState({
            p3_4_5: e.target.value,
        });
    }
    changeSupplier6 = (e) => {
        this.setState({
            p3_4_6: e.target.value,
        });
    }

    render() {
        const {
            risk,
            p3_2_1, p3_2_2, p3_2_3, p3_2_4, p3_2_5, p3_2_6,
            p3_3_1, p3_3_2, p3_3_3, p3_3_4, p3_3_5, p3_3_6,
            p3_3_7, p3_3_8, p3_3_9, p3_3_10, p3_3_11, p3_3_12,
            p3_3_13, p3_3_14, p3_3_15, p3_3_16, p3_3_17, p3_3_18,
            p3_3_19, p3_3_20, p3_3_21,
            p3_4_1, p3_4_2, p3_4_3, p3_4_4, p3_4_5, p3_4_6,
            isLoading,
        } = this.state;
        const { getFieldDecorator } = this.props.form;
        // 从数据库获取值.
        const taxScore = Number(risk.p3_1_1) + Number(risk.p3_1_2) + Number(risk.p3_1_3)
            + Number(risk.p3_1_4) + Number(risk.p3_1_5);
        const marketScore = Number(p3_2_1) + Number(p3_2_2) + Number(p3_2_3)
            + Number(p3_2_4) + Number(p3_2_5) + Number(p3_2_6);
        const internalBusiness = Number(p3_3_11) + Number(p3_3_12) + Number(p3_3_13)
            + Number(p3_3_14) + Number(p3_3_15)
            + Number(p3_3_16) + Number(p3_3_17);
        const internalContract = Number(p3_3_1) + Number(p3_3_2) + Number(p3_3_3)
            + Number(p3_3_4) + Number(p3_3_5) + Number(p3_3_6);
        const internalDelivery = Number(p3_3_18) + Number(p3_3_19)
            + Number(p3_3_20) + Number(p3_3_21);
        const internalInternal = Number(p3_3_7) + Number(p3_3_8)
            + Number(p3_3_9) + Number(p3_3_10);
        const internalScore = internalBusiness + internalContract + internalDelivery + internalInternal;
        const supplierScore = Number(p3_4_1) + Number(p3_4_2) + Number(p3_4_3)
            + Number(p3_4_4) + Number(p3_4_5) + Number(p3_4_6);
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row >
                        <Form.Item>
                            <Button style={{ float: 'right' }} type="primary" htmlType="submit" ghost loading={isLoading}>更新</Button>
                        </Form.Item>
                    </Row>
                    <Row>
                        <span style={{ fontSize: '16px' }}>
                            <div style={{
                                width: '4px',
                                height: '14px',
                                background: 'rgba(20,124,236,1)',
                                borderRadius: '2px',
                                display: 'inline-block',
                                margin: '0 10px 0 0'
                            }} />
                            <Text style={{ color: '#000000' }} strong>整体评分预警触发值</Text>
                        </span>
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        <Row>
                            <Form.Item label="整体预警分值">
                                {getFieldDecorator('p1', {
                                    initialValue: risk.p1,
                                    rules: [
                                        {
                                            pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                            message: '请输入正确的格式!',
                                        },
                                        {
                                            required: true,
                                            message: '请输入整体预警分值',
                                        },
                                    ],
                                })(
                                    <Input style={{ width: 300 }} placeholder="请输入整体预警分值" allowClear={true} />,
                                )}
                            </Form.Item>
                        </Row>
                    </Card>
                    <Row style={{ marginTop: '23px' }}>
                        <span style={{ fontSize: '16px' }}>
                            <div style={{
                                width: '4px',
                                height: '14px',
                                background: 'rgba(20,124,236,1)',
                                borderRadius: '2px',
                                display: 'inline-block',
                                margin: '0 10px 0 0'
                            }} />
                            <Text style={{ color: '#000000' }} strong>四大评估模块预警触发分值</Text>
                        </span>
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="税务合规风险">
                                    {getFieldDecorator('p2_1', {
                                        initialValue: risk.p2_1,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入税务合规风险预警分值',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入税务合规风险预警分值" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="市场监管风险">
                                    {getFieldDecorator('p2_2', {
                                        initialValue: risk.p2_2,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入市场监管风险预警分值',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入市场监管风险预警分值" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="内部风控风险">
                                    {getFieldDecorator('p2_3', {
                                        initialValue: risk.p2_3,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入内部风控风险预警分值',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入内部风控风险预警分值" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                <Form.Item label="供应商评分">
                                    {getFieldDecorator('p2_4', {
                                        initialValue: risk.p2_4,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入供应商评分预警分值',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入供应商评分预警分值" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Row style={{ marginTop: '23px' }}>
                        <Col span={21}>
                            <span style={{ fontSize: '16px' }}>
                                <div style={{
                                    width: '4px',
                                    height: '14px',
                                    background: 'rgba(20,124,236,1)',
                                    borderRadius: '2px',
                                    display: 'inline-block',
                                    margin: '0 10px 0 0'
                                }} />
                                <Text style={{ color: '#000000' }} strong>评估项扣分标准设置</Text>
                            </span>
                        </Col>
                        <Col span={3}>
                            <Text style={{ fontSize: '16px' }}>
                            当前分数：{(taxScore + marketScore + internalScore + supplierScore) ? (taxScore + marketScore + internalScore + supplierScore) : 0}分
                            </Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '23px' }}>
                        <span style={{ fontSize: '16px' }}><div style={{
                            width: '4px',
                            height: '4px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0',
                        }} /><Text style={{ color: '#000000' }}>税务合规风险（{taxScore ? taxScore : 0}分，不可修改）</Text></span>
                    </Row>
                    {/* <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="列支凭证存疑问">
                                        {getFieldDecorator('p3_1_1', {
                                            initialValue: risk.p3_1_1,
                                            rules: [
                                                {
                                                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                                                    message: '请输入正确的格式!',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入扣分分数',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} disabled={true} />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="交易流水不一致">
                                        {getFieldDecorator('p3_1_2', {
                                            initialValue: risk.p3_1_2,
                                            rules: [
                                                {
                                                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                                                    message: '请输入正确的格式!',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入扣分分数',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} disabled={true} />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="经营活动不真实">
                                        {getFieldDecorator('p3_1_3', {
                                            initialValue: risk.p3_1_3,
                                            rules: [
                                                {
                                                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                                                    message: '请输入正确的格式!',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入扣分分数',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} disabled={true} />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item label="关联交易不独立">
                                        {getFieldDecorator('p3_1_4', {
                                            initialValue: risk.p3_1_4,
                                            rules: [
                                                {
                                                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                                                    message: '请输入正确的格式!',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入扣分分数',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} disabled={true} />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="项目列支违规">
                                        {getFieldDecorator('p3_1_5', {
                                            initialValue: risk.p3_1_5,
                                            rules: [
                                                {
                                                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                                                    message: '请输入正确的格式!',
                                                },
                                                {
                                                    required: true,
                                                    message: '请输入扣分分数',
                                                },
                                            ],
                                        })(
                                            <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} disabled={true} />,
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row> */}
                    <Row style={{ marginTop: '23px' }}>
                        <span style={{ fontSize: '16px' }}><div style={{
                            width: '4px',
                            height: '4px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0',
                        }} /><Text style={{ color: '#000000' }}>市场监管风险（{marketScore} 分）</Text></span>
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="管理发票类">
                                    {getFieldDecorator('p3_2_1', {
                                        initialValue: risk.p3_2_1,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket1} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="咨询发票类">
                                    {getFieldDecorator('p3_2_2', {
                                        initialValue: risk.p3_2_2,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket2} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="会议发票类">
                                    {getFieldDecorator('p3_2_3', {
                                        initialValue: risk.p3_2_3,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket3} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="培训发票类">
                                    {getFieldDecorator('p3_2_4', {
                                        initialValue: risk.p3_2_4,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket4} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="旅游费用类">
                                    {getFieldDecorator('p3_2_5', {
                                        initialValue: risk.p3_2_5,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket5} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="手续费类">
                                    {getFieldDecorator('p3_2_6', {
                                        initialValue: risk.p3_2_6,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeMarket6} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Row style={{ marginTop: '23px' }}>
                        <span style={{ fontSize: '16px' }}><div style={{
                            width: '4px',
                            height: '4px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0',
                        }} /><Text style={{ color: '#000000' }}>内部合规风险（{internalScore}分）</Text></span>
                    </Row>
                    <Card style={{ marginTop: '10px' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        headStyle={{ padding: '0' }}
                        bordered={false}>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="合同文件未上传">
                                    {getFieldDecorator('p3_3_1', {
                                        initialValue: risk.p3_3_1,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal1} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="对方企业名称未填写">
                                    {getFieldDecorator('p3_3_2', {
                                        initialValue: risk.p3_3_2,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal2} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="货物或应税劳务、服务名称未填写">
                                    {getFieldDecorator('p3_3_3', {
                                        initialValue: risk.p3_3_3,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal3} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="合同金额未填写">
                                    {getFieldDecorator('p3_3_4', {
                                        initialValue: risk.p3_3_4,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal4} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="签约时间未填写">
                                    {getFieldDecorator('p3_3_5', {
                                        initialValue: risk.p3_3_5,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal5} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="争议解决方式未填写">
                                    {getFieldDecorator('p3_3_6', {
                                        initialValue: risk.p3_3_6,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal6} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card style={{ marginTop: '10px' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        headStyle={{ padding: '0' }}
                        bordered={false}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="业务主办人未填写">
                                    {getFieldDecorator('p3_3_7', {
                                        initialValue: risk.p3_3_7,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal7} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="业务主管未填写">
                                    {getFieldDecorator('p3_3_8', {
                                        initialValue: risk.p3_3_8,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal8} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="财务核审人未填写">
                                    {getFieldDecorator('p3_3_9', {
                                        initialValue: risk.p3_3_9,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal9} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="业务审核人未填写">
                                    {getFieldDecorator('p3_3_10', {
                                        initialValue: risk.p3_3_10,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal10} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card style={{ marginTop: '10px' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        headStyle={{ padding: '0' }}
                        bordered={false}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="业务发起无邮件、短信或其他信息">
                                    {getFieldDecorator('p3_3_11', {
                                        initialValue: risk.p3_3_11,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal11} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="业务发起无发起文档">
                                    {getFieldDecorator('p3_3_12', {
                                        initialValue: risk.p3_3_12,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal12} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="业务完成无邮件、短信或其他信息">
                                    {getFieldDecorator('p3_3_13', {
                                        initialValue: risk.p3_3_13,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal13} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="业务完成无完成文档">
                                    {getFieldDecorator('p3_3_14', {
                                        initialValue: risk.p3_3_14,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal14} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="真实交易无记账凭证记录">
                                    {getFieldDecorator('p3_3_15', {
                                        initialValue: risk.p3_3_15,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal15} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="真实交易无银行流水记录">
                                    {getFieldDecorator('p3_3_16', {
                                        initialValue: risk.p3_3_16,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal16} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="真实交易无交易账册记录">
                                    {getFieldDecorator('p3_3_17', {
                                        initialValue: risk.p3_3_17,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal17} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card style={{ marginTop: '10px' }}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        headStyle={{ padding: '0' }}
                        bordered={false}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="交付信息无完成时间">
                                    {getFieldDecorator('p3_3_18', {
                                        initialValue: risk.p3_3_18,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal18} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="交付是否顺利未填写">
                                    {getFieldDecorator('p3_3_19', {
                                        initialValue: risk.p3_3_19,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal19} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="交付争议信息未填写">
                                    {getFieldDecorator('p3_3_20', {
                                        initialValue: risk.p3_3_20,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal20} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="交付信息无对方联系方式">
                                    {getFieldDecorator('p3_3_21', {
                                        initialValue: risk.p3_3_21,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeInternal21} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Row style={{ marginTop: '23px' }}>
                        <span style={{ fontSize: '16px' }}><div style={{
                            width: '4px',
                            height: '4px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0',
                        }} /><Text style={{ color: '#000000' }}>供应商评分（{supplierScore}分）</Text></span>
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ margin: '10px 0 40px 0' }}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="企业注册少于2年">
                                    {getFieldDecorator('p3_4_1', {
                                        initialValue: risk.p3_4_1,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier1} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="企业注册资本少于100万">
                                    {getFieldDecorator('p3_4_2', {
                                        initialValue: risk.p3_4_2,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier2} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="出现受惩黑名单">
                                    {getFieldDecorator('p3_4_3', {
                                        initialValue: risk.p3_4_3,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier3} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="出现法院执行公告">
                                    {getFieldDecorator('p3_4_4', {
                                        initialValue: risk.p3_4_4,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier4} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="出现法院失信公告">
                                    {getFieldDecorator('p3_4_5', {
                                        initialValue: risk.p3_4_5,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier5} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="出现处罚曝光台">
                                    {getFieldDecorator('p3_4_6', {
                                        initialValue: risk.p3_4_6,
                                        rules: [
                                            {
                                                pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                                message: '请输入正确的格式!',
                                            },
                                            {
                                                required: true,
                                                message: '请输入扣分分数',
                                            },
                                        ],
                                    })(
                                        <Input style={{ width: 300 }} placeholder="请输入扣分分数" allowClear={true} onChange={this.changeSupplier6} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>
        );
    }
}

export default system_list;