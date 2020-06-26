import React from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

@Form.create()
class contract_add_contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getContactData(values);
                this.props.form.resetFields();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleContactCancel();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form>
                    <Form.Item label="联系人">
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入联系人姓名!',
                                },
                            ],
                        })(<Input placeholder="请输入联系人姓名" />)}
                    </Form.Item>
                    <Form.Item label="联系电话">
                        {getFieldDecorator('phone', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入联系电话!',
                                },
                            ],
                        })(<Input placeholder="请输入联系电话" />)}
                    </Form.Item>
                    <Form.Item label="联系地址">
                        {getFieldDecorator('address', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入联系地址!',
                                },
                            ],
                        })(<Input placeholder="请输入联系地址" />)}
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

export default contract_add_contact;