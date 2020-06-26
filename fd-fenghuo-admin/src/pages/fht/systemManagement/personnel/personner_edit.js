import React from 'react';
import { Form, Input, Row, Col, Button, Select, TreeSelect } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ common_model, personnel_model }) => ({
    roleData: personnel_model.roleData,
    deptData: personnel_model.deptData,
    id: personnel_model.id,
}))

@Form.create()
class personner_edit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personnelDetail: {},
        };
    }

    componentDidMount() {
        const { dispatch, id } = this.props;
        dispatch({
            type: 'personnel_model/roleList',
        });
        dispatch({
            type: 'personnel_model/deptList',
        });
        dispatch({
            type: 'personnel_model/get',
            payload: { id },
            callback: data => {
                this.setState({
                    personnelDetail: data,
                });
            }
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getUpdateData(values, this.state.personnelDetail.id);
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
        const { roleData, deptData } = this.props;
        const role = roleData || [];
        const dept = deptData || [];
        const treeData = dept;
        const { personnelDetail } = this.state;
        const personnel = personnelDetail || {};
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="登录账号">
                                {getFieldDecorator('username', {
                                    initialValue: personnel.username,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写登录账号(字母或数字)',
                                        },
                                        {
                                            pattern: /^[A-Za-z0-9]+$/,
                                            message: '账号由字母或数字组成',
                                        },
                                    ],
                                })(<Input placeholder="请填写登录账号(字母或数字)" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="登录密码">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写登录密码',
                                        },
                                        {
                                            min: 6,
                                            message: '密码最少6位',
                                        }
                                    ],
                                })(<Input.Password
                                    type="password"
                                    placeholder="请填写登录密码"
                                    allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="人员姓名">
                                {getFieldDecorator('name', {
                                    initialValue: personnel.name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请填写人员姓名',
                                        },
                                    ],
                                })(<Input placeholder="请填写人员姓名" allowClear={true} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="角色权限">
                                {getFieldDecorator('role_id', {
                                    initialValue: personnel.role_id,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择角色权限',
                                        },
                                    ],
                                })(
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        allowClear={true}
                                        placeholder="请选择角色权限"
                                        style={{ width: '100%' }}
                                    >
                                        {
                                            role.map((value, key) => {
                                                return (<Option key={key} value={value.id}>{value.name}</Option>)
                                            })
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="组织部门">
                                {getFieldDecorator('dept', {
                                    initialValue: personnel.dept_names,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择人员所在组织部门',
                                        },
                                    ],
                                })(
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={treeData}
                                        placeholder="请选择人员所在组织部门"
                                    />,
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

export default personner_edit;