import React from 'react';
import { Form, Row, Col, Button, Select } from 'antd';
import { connect } from 'dva';
const { Option } = Select;

@connect(({ common_model, bill_model }) => ({
    
}))

@Form.create()
class contract_change extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contract_list: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/findAllContractList',
            payload: { seller_name: this.props.s_name, contract_code: this.props.contract_before_code },
            callback: data => {
                this.setState({
                    contract_list: data,
                })
            }
            
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                const { contract_before_code, invoice_code, invoice_no_short, s_name } = this.props;
                this.props.auditModelOk(value, contract_before_code, invoice_code, invoice_no_short, s_name);
                this.props.form.resetFields();
                this.props.auditModelClose();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.auditModelClose();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { contract_list } = this.state;
        const { contract_name } = this.props;
        return (
            <div>
                <Form>
                    <Form.Item label="关联合同">
                        {getFieldDecorator('contract_code', {
                            initialValue: contract_name,
                            rules: [{ required: true, message: '内容不能为空!' }],
                      
                        })(
                            <Select showSearch placeholder="请选择需要关联的合同" allowClear={true}>
                                {
                                    contract_list.map((item, key) => {
                                        return (
                                            <Option key={key} value={item.contract_code}>{item.NAME}</Option>
                                        )
                                    })
                                }
                            </Select>,
                        )}
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{ float: 'right' }}>
                                <Button type="primary" onClick={this.getForm}>确认</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item>
                                <Button onClick={this.handleCancel}>取消</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default contract_change;