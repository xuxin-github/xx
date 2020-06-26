import React from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { connect } from 'dva';


@connect(({ common_model, reimburseType_model }) => ({
    type_name: reimburseType_model.type_name
}))

@Form.create()
class reimburseTypeEdit extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            tag_detail: {},
        };
    }
    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburseType_model/get',
            payload: { type_name: this.props.type_name },
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
                this.props.getUpdateData(values, this.state.tag_detail.type_code);
                this.props.form.resetFields();
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleUpdateCancel();
        this.props.form.resetFields();
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        const { tag_detail } = this.state;
        return(
            <div>
                <Form>
                    <Row>
                        <Col>
                            <Form.Item label="修改报销类别">
                                {getFieldDecorator('type_name',{
                                   initialValue:tag_detail.type_name,
                                   rules: [
                                       {
                                           required: true,
                                           message: '请填写报销类别名称',
                                       },
                                   ],
                                })(<Input placeholder="请填写报销类别名称" allowClear={true}/>)
                                }
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
        )
    }
}
export default reimburseTypeEdit;