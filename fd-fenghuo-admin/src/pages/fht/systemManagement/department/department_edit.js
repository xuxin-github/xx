import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { connect } from 'dva';

@connect(({ common_model, department_model }) => ({
    dept_name: department_model.dept_name,
}))

@Form.create()
class department_edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dept_detail: {},
        };
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'department_model/get',
            payload: { dept_name: this.props.dept_name },
            callback: data => {
                this.setState({
                    dept_detail: data,
                });
            }
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getUpdateData(values, this.state.dept_detail.dept_code);
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
        const { dept_detail } = this.state;
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="部门名称">
                                {getFieldDecorator('dept_name', {
                                    initialValue: dept_detail.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写部门名称',
                                        },
                                    ],
                                })(<Input placeholder="请填写部门名称" allowClear={true} />)}
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

export default department_edit;