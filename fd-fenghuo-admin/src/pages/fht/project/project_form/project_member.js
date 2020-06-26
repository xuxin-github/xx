import React from 'react';
import { Form, Row, Col, Button, TreeSelect, Select } from 'antd';
import { connect } from 'dva';
import FreeScrollBar from 'react-free-scrollbar';
import styles from './project_member.css';
import util from '../../../../utils/notification';

const { Option } = Select;

@connect(({ common_model, personnel_model, project_member_model }) => ({
    deptData: personnel_model.deptData,
}))

class project_member extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personnelData: [],
            deptCode: '',
            personnel: '',
            // 项目成员列表.
            list: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'personnel_model/deptList',
        });
        dispatch({
            type: 'project_member_model/memberList',
            payload: { project_code: this.props.project_code },
            callback: data => {
                this.setState({
                    list: data,
                });
            }
        });
    }

    // 改变组织部门.
    changeDept = (value) => {
        const { dispatch } = this.props;
        let arr = value.split("-");
        if (arr[arr.length - 1] !== undefined) {
            dispatch({
                type: 'personnel_model/personnelByDept',
                payload: { dept_code: arr[arr.length - 1] },
                callback: data => {
                    this.setState({
                        personnelData: data,
                    });
                }
            });
        }
        this.setState({
            deptCode: arr[arr.length - 1],
        })
    }

    // 改变人员.
    changePersonnel = (value) => {
        this.setState({
            personnel: value,
        });
    }

    // 新增项目成员.
    addProjectMember = () => {
        let personnel_id = this.state.personnel;
        if (personnel_id === '' || personnel_id === undefined) {
            util.error("请选择项目成员！")
        } else {
            // 获取人员id查询人员信息.
            const { dispatch } = this.props;
            dispatch({
                type: 'project_member_model/add',
                payload: { personnel_id, project_code: this.props.project_code },
                callback: data => {
                    this.setState({
                        list: data,
                    });
                },
            });
        }
    }

    // 删除项目成员.
    deleteMember = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project_member_model/delete',
            payload: { id, project_code: this.props.project_code },
            callback: data => {
                this.setState({
                    list: data,
                });
            },
        });
    }

    // 获取表单信息.
    getForm = (e) => {
        e.preventDefault();
        this.props.getProjectMemberData();
    }

    // 取消.
    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleProjectCancel();
    }

    render() {
        const { deptData } = this.props;
        const { personnelData, deptCode, list } = this.state;
        const dept = deptData || [];
        const treeData = dept;
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle" gutter={16}>
                    <Col span={4}>
                        <span className={styles.member_font}>项目成员：</span>
                    </Col>
                    <Col span={11}>
                        <TreeSelect
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={treeData}
                            placeholder="请选择人员所在组织部门"
                            onChange={this.changeDept}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            key={deptCode}
                            defaultValue=""
                            style={{ width: '100%' }}
                            onChange={this.changePersonnel}
                            allowClear={true}>
                            {
                                personnelData.map((value, key) => {
                                    return (
                                        <Option key={key} value={value.id}>{value.name}</Option>
                                    );
                                })
                            }
                        </Select>
                    </Col>
                    <Col span={3}>
                        <Button style={{ float: 'right' }} type="primary" onClick={this.addProjectMember}>添加</Button>
                    </Col>
                </Row>
                <Row>
                    <div className={styles.member_div} key={Math.random()}>
                        <FreeScrollBar style={{ height: "100%" }} autohide={true} fixed={true}>
                            {
                                list.map((value, key) => {
                                    return (
                                        <div key={key}>
                                            <Row style={{margin: '20px 0 20px 0'}}>
                                                <Col span={6}>
                                                    <span className={styles.div_font}>{value.name}</span>
                                                </Col>
                                                <Col span={15}>
                                                    <span className={styles.div_font}>{value.dept_names}</span>
                                                </Col>
                                                <Col span={3}>
                                                    <Button type="link" className={styles.button_font} onClick={this.deleteMember.bind(this, value.id)}>删除</Button>
                                                </Col>
                                            </Row>
                                            <div className={styles.div_line} />
                                        </div>
                                    );
                                })
                            }
                        </FreeScrollBar>
                    </div>
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
            </div>
        );
    }
}

export default project_member;