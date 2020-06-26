import React from 'react';
import { Form, Row, Col, Button, Input } from 'antd';

@Form.create()
class supplier_add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.auditModelOk(values);
                this.props.form.resetFields();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.auditModelClose();
    }
   
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form>
                    <Form.Item label="企业名称：">
                        {getFieldDecorator('company_name', {
                            rules: [{ required: true, message: '内容不能为空!' }],
                        })(
                            <Input type='text' placeholder='请填写企业名称' />,
                        )}
                    </Form.Item>
                    <Form.Item label="注册号码：" style={{ marginTop: 5 }}>
                        {getFieldDecorator('register_id', {
                            rules: [{ required: true, message: '内容不能为空!' }],
                        })(
                            <Input type='text' placeholder='请填写企业注册号码' />,
                        )}
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{float: 'right'}}>
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

export default supplier_add;