import React from 'react';
import { Row, Col, Form, Input, Button,Tag } from 'antd';
import { connect } from 'dva';
const { CheckableTag } = Tag;

@connect(({ contractTag_model }) => ({
}))
@Form.create()
class contract_add extends React.Component {
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
                this.props.handleContract(values);
                this.props.form.resetFields();
                this.setState({
                    selectedTags: [],
                });
            }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleCancel();
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
                    <Form.Item label="合同编号">
                        {getFieldDecorator('contract_code', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入合同编号!',
                                },
                            ],
                        })(<Input placeholder="请输入合同编号" allowClear={true} />)}
                    </Form.Item>
                    <Form.Item label="合同名称">
                        {getFieldDecorator('contract_name', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入合同名字!',
                                },
                            ],
                        })(<Input placeholder="请输入合同名字" allowClear={true} />)}
                    </Form.Item>
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

export default contract_add;