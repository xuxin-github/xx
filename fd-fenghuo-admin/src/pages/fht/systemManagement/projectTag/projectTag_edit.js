import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { connect } from 'dva';

@connect(({ common_model, projectTag_model }) => ({
    tag_name: projectTag_model.tag_name,
}))

@Form.create()
class projectTag_edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag_detail: {},
        };
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'projectTag_model/get',
            payload: { tag_name: this.props.tag_name },
            callback: data => {
                this.setState({
                    tag_detail: data,
                });
            }
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getUpdateData(values, this.state.tag_detail.tag_code);
                this.props.form.resetFields();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleUpdateCancel();
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { tag_detail } = this.state;
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="标签名称">
                                {getFieldDecorator('tag_name', {
                                    initialValue: tag_detail.tag_name,
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

export default projectTag_edit;