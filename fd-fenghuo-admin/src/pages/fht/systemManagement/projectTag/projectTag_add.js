import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';

@Form.create()
class projectTag_add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getAddData(values);
                this.props.form.resetFields();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleAddCancel();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="标签名称">
                                {getFieldDecorator('tag_name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写标签名称',
                                        },
                                    ],
                                })(<Input placeholder="请填写标签名称" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
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

export default projectTag_add;