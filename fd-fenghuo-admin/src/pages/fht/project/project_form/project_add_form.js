import React from 'react';
import { Form, Input, Row, Col, Button, Tag } from 'antd';
import { connect } from 'dva';

const { CheckableTag } = Tag;

@connect(({ projectTag_model }) => ({
}))

@Form.create()
class project_add_form extends React.Component {
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
            type: 'projectTag_model/tag',
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
                values["project_tag"] = this.state.selectedTags;
                this.props.getAddData(values);
                this.props.form.resetFields();
                this.setState({
                    selectedTags: [],
                });
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleAddCancel();
        this.props.form.resetFields();
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
                            <Form.Item label="项目名称">
                                {getFieldDecorator('project_name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入项目名称',
                                        },
                                    ],
                                })(<Input placeholder="给项目起个名字" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="项目预算">
                                {getFieldDecorator('project_budget', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入项目预算（数字）',
                                        },
                                        {
                                            pattern: /^-?(0|[1-9][0-9]*)(\[0-9]*)?$/,
                                            message: '请输入项目预算（数字）',
                                        },
                                    ],
                                })(<Input placeholder="请输入项目预算（数字）" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="项目标签">
                                {getFieldDecorator('project_tag', {
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

export default project_add_form;
