import React from 'react';
import { Form, Input, Row, Col, Button, Tag } from 'antd';
import { connect } from 'dva';

const { CheckableTag } = Tag;

@connect(({ projectTag_model }) => ({
}))

@Form.create()
class contract_add_form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTags: [],
            tagsFromServer: [],
        };
    }

    componentDidMount(){
        const { dispatch } = this.props;
        dispatch({
            type: 'contractTag_model/tagList',
            callback: data => {
                this.setState({
                    tagsFromServer: data,
                });
            }
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values["contract_tag"] = this.state.selectedTags;
                this.props.getContractAddData(values, this.props.project_code, this.props.project_name);
                // 重置所有值.
                this.props.form.resetFields();
                this.setState({
                    selectedTags: [],
                });
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleContractCancel();
        this.setState({
            selectedTags: [],
        });
    }

    handleChange(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        this.setState({ selectedTags: nextSelectedTags });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { selectedTags, tagsFromServer } = this.state;
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="合同编号">
                                {getFieldDecorator('contract_code', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入合同编号',
                                        },
                                    ],
                                })(<Input placeholder="填写合同编号" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="合同名称">
                                {getFieldDecorator('contract_name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入合同名称',
                                        },
                                    ],
                                })(<Input placeholder="给合同起个名字" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="合同标签">
                                {getFieldDecorator('contract_tag', {
                                })(
                                    <div>
                                        {tagsFromServer.map(tag => (
                                            <CheckableTag
                                                key={tag}
                                                checked={selectedTags.indexOf(tag) > -1}
                                                onChange={checked => this.handleChange(tag, checked)}
                                            >
                                                {tag}
                                            </CheckableTag>
                                        ))}
                                    </div>
                                )}
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

export default contract_add_form;