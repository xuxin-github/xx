import React from 'react';
import { Form, Steps, Input, Button, DatePicker, Select, Tag, Row, Col } from 'antd';
import styles from '../bill_list.css';
import { connect } from 'dva';
import moment from 'moment';
import util from '../../../../utils/notification';
const { Option } = Select;
const { Step } = Steps;
const { CheckableTag } = Tag;

@connect(({ bill_model }) => ({
    addModelShow: bill_model.addModelShow,
    add_invoice_detail: bill_model.bill_model,
}))

@Form.create()
class invoice_add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 步骤条
            display_name1: 'block', // 控制关联的display状态
            display_name2: 'none',
            input_values1: '', // 新建合同编号值
            input_values2: '', // 新建合同名称值
            contract_select_value: '', // 合同下拉框值
            k: 1, // 参数
            // 发票类型.
            invoice_type: '',
            // 发票查找内容.
            invoice_detail: '',
            // 该发票能关联的合同(下拉列表).
            contract_list: [],
            // 获取返回的code值.
            code: '',
            // 加载状态.
            isLoading: false,
            // 账号信息.
            username: '',
            role_code: '',
            // 合同标签.
            selectedTags: [],
            tagsFromServer: [],
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        let ROLE = localStorage.getItem("ROLE");
        let roledata = JSON.parse(ROLE);
        this.setState({
            username: userdata.username,
            role_code: roledata[0].authority,
        });
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

    // 新建合同编号
    InputChange1 = (e) => {
        const value = e.target.value;
        this.setState({
            input_values1: value,
        });
        console.log('合同编号：', value);
    }

    // 新建合同名称
    InputChange2 = (e) => {
        const value = e.target.value;
        this.setState({
            input_values2: value,
        });
        console.log('合同名称：', value);
    }

    // 选择发票类型.
    handleChange = (value) => {
        this.setState({
            invoice_type: value,
        })
    }

    // 查找发票
    bill_select = (e) => {
        e.preventDefault();
        this.setState({
            isLoading: true,
        });
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { dispatch } = this.props;
                dispatch({
                    type: 'bill_model/querySubmit',
                    payload: { values },
                    callback: rs => {
                        this.setState({
                            invoice_detail: rs.data,
                            code: rs.code,
                        });
                        // 如果返回0, 则继续下一步.
                        if (rs.code === 0 || rs.code === 4) {
                            const current = this.state.current + 1;
                            this.setState({ current, isLoading: false });
                        }
                        this.setState({ isLoading: false });
                    }
                });
            }
        });
    }

    // 下一步
    next = (seller_name) => {
        const { dispatch } = this.props;
        const { username, role_code } = this.state;
        dispatch({
            type: 'bill_model/queryConnectContract',
            payload: { seller_name, username, role_code },
            callback: data => {
                this.setState({
                    contract_list: data,
                })
            }
        });
        const current = this.state.current + 1;
        this.setState({ current });
    }

    // 上一步
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    // 关联至合同搜索下拉框.
    onChange = (value) => {
        console.log('下拉框的值：', value);
        this.setState({
            contract_select_value: value,
        });
    }

    // 关联已有合同.
    handleRelevance = (k) => {
        this.setState({
            display_name1: 'block',
            display_name2: 'none',
            k: k,
        });
    };

    // 创建合同关联.
    handleCreate = (k) => {
        this.setState({
            display_name1: 'none',
            display_name2: 'block',
            k: k,
        });
    };

    // 选择合同标签.
    handleTagChange(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
        this.setState({ selectedTags: nextSelectedTags });
    }

    // 关联按钮.
    handleGuanLian = (invoice_code, s_name, invoice_no_short) => {
        const { dispatch } = this.props;
        const { username, role_code, contract_select_value, input_values1, input_values2, selectedTags } = this.state;
        const k = this.state.k;
        const i1 = input_values1;
        const i2 = input_values2;
        const contract_tag = selectedTags;
        const c_s_value = contract_select_value;
        // 根据K值来判断所选按钮.
        if (k === 1) {
            if (c_s_value === '') {
                util.error('请选择需要关联的合同')
            } else {
                const { dispatch } = this.props;
                dispatch({
                    type: 'bill_model/addSupplier',
                    payload: { connect_contract: c_s_value, invoice_code, s_name, invoice_no_short, username, role_code },
                });
                // 清空输入内容.
                this.setState({
                    contract_select_value: '',
                    current: 0,
                });
                this.auditModelClose();
            }
        }
        if (k === 2) {
            if (i1 === '' || i2 === '') {
                util.error('内容不能为空')
            } else {
                dispatch({
                    type: 'bill_model/createAddSupplier',
                    payload: { contract_code: i1, contract_name: i2, invoice_code, invoice_no_short, contract_tag, username, role_code }
                });
                // 清空输入内容.
                this.setState({
                    input_values1: '',
                    input_values2: '',
                    current: 0,
                    selectedTags: [],
                });
                this.auditModelClose();
            }
        }
    }

    auditModelClose = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/updateState',
            payload: { "addModelShow": false }
        });
        this.props.form.resetFields();
        this.setState({
            selectedTags: [],
        });
    };

    render() {
        const { current, display_name1, display_name2, input_values1,
            input_values2, invoice_detail, contract_list, isLoading,
            selectedTags, tagsFromServer } = this.state;
        const { getFieldDecorator } = this.props.form;
        const steps = [
            {
                title: '查找发票',
                content: <Form layout="inline">
                    <Row type="flex" justify="space-around" align="middle" gutter={16} style={{ marginTop: 20 }}>
                        <Col span={10}>
                            <Form.Item label="发票类型：" >
                                {getFieldDecorator('bill_type', {
                                    rules: [{ required: true, message: '发票类型不能为空!' }],
                                })(
                                    <Select placeholder='请选择发票的类型' style={{ width: 200 }} onChange={this.handleChange}>
                                        <Option value='01'>增值税专用发票</Option>
                                        <Option value='04'>增值税普通发票</Option>
                                        <Option value='10'>增值税普通发票（电子）</Option>
                                        <Option value='11'>增值税普通发票（卷式）</Option>
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item label="发票号码：">
                                {getFieldDecorator('bill_number', {
                                    rules: [{ required: true, message: '发票号码不能为空!' }],
                                })(
                                    <Input type='text' placeholder='请填写发票号码' style={{ width: 200 }} />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" gutter={16}>
                        <Col span={10}>
                            <Form.Item label="发票代码：">
                                {getFieldDecorator('bill_id', {
                                    rules: [{ required: true, message: '发票代码不能为空!' }],
                                })(
                                    <Input type='text' placeholder='请输入发票代码' style={{ width: 200 }} />,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            {
                                this.state.invoice_type === "01" ?
                                    (
                                        <Form.Item label="效验码后6位：">
                                            {getFieldDecorator('bill_xy_id')(
                                                <Input type='text' placeholder='请输入发票号码效验码后6位' style={{ width: 200 }} />,
                                            )}
                                        </Form.Item>
                                    )
                                    :
                                    (
                                        <Form.Item label="效验码后6位：">
                                            {getFieldDecorator('bill_xy_id', {
                                                rules: [{ required: true, message: '效验码不能为空!' }],
                                            })(
                                                <Input type='text' placeholder='请输入发票号码效验码后6位' style={{ width: 200 }} />,
                                            )}
                                        </Form.Item>
                                    )
                            }

                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={10}>
                            {
                                this.state.invoice_type === "01" ?
                                    (
                                        <Form.Item label="发票金额：">
                                            {getFieldDecorator('bill_money', {
                                                rules: [{ required: true, message: '金额不能为空' }],
                                            })(
                                                <Input type='text' placeholder='请输入发票金额（不含税）' style={{ width: 200 }} />,
                                            )}
                                        </Form.Item>
                                    )
                                    :
                                    (
                                        <Form.Item label="发票金额：">
                                            {getFieldDecorator('bill_money')(
                                                <Input type='text' placeholder='请输入发票金额（不含税）' style={{ width: 200 }} />,
                                            )}
                                        </Form.Item>
                                    )
                            }
                        </Col>
                        <Col span={10}>
                            <Form.Item label="开票日期：">
                                {getFieldDecorator('bill_time', {
                                    rules: [{ required: true, message: '日期不能为空!' }],
                                })(
                                    <DatePicker style={{ width: 200 }} />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>,
            },
            {
                title: '发票信息',
                content: <div>
                    <Row type="flex" justify="space-around" align="middle" gutter={16} style={{ marginTop: 20 }}>
                        <Col span={10} pull={1}>
                            <label className={styles.title_style}>发票号码：</label><span>{invoice_detail.invoice_no_short}</span>
                        </Col>
                        <Col span={14} push={1}>
                            <label className={styles.title_style}>销方名称：</label><span>{invoice_detail.s_name}</span>
                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" gutter={16}>
                        <Col span={10} pull={1}>
                            <label className={styles.title_style}>发票类型：</label><span>{
                                invoice_detail.invoice_type === '01' ? '增值税专用发票' :
                                    (invoice_detail.invoice_type === '04' ? '增值税普通发票' :
                                        (invoice_detail.invoice_type === '10' ? '增值税普通发票（电子）' : '增值税普通发票（卷式）'))
                            }</span>
                        </Col>
                        <Col span={14} push={1}>
                            <label className={styles.title_style}>发票类别：</label><span>{invoice_detail.invoice_catalog === '01' ? "管理费类" : invoice_detail.invoice_catalog === '02' ? "咨询费类" :
                                invoice_detail.invoice_catalog === '03' ? "会议费类" : invoice_detail.invoice_catalog === '04' ? "培训费类" : invoice_detail.invoice_catalog === '05' ? "旅游费类" : invoice_detail.invoice_catalog === '06' ? "手续费类" : '其他费类'
                            }</span>
                        </Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" gutter={16} style={{ marginBottom: 20 }}>
                        <Col span={10} pull={1}>
                            <label className={styles.title_style}>开票日期：</label><span>{moment(invoice_detail.invoice_time).format('YYYY-MM-DD')}</span>
                        </Col>
                        <Col span={14} push={1}>
                            <label className={styles.title_style}>发票金额：</label><span>{invoice_detail.price_amount}</span>
                        </Col>
                    </Row>
                </div>,
            },
            {
                title: '关联合同',
                content:
                    <div>
                        <Row type="flex" justify="center" align="middle" gutter={16} style={{ marginTop: 20 }}>
                            <Col span={12}>
                                <Row type="flex" justify="start" align="middle" gutter={16}>
                                    <Col><Button type='primary' onClick={this.handleRelevance.bind(this, 1)}>关联已有合同</Button></Col>
                                </Row>
                                <Row type="flex" justify="start" align="middle" gutter={16} style={{ marginTop: 10, marginBottom: 20 }}>
                                    <Col><Button type='primary' onClick={this.handleCreate.bind(this, 2)}>创建合同关联</Button></Col>
                                </Row>
                            </Col>
                            <Col span={12} >
                                <div style={{ display: display_name1 }}>
                                    <Row type="flex" justify="space-around" align="top" gutter={16} style={{ marginBottom: 60 }}>
                                        <Col>
                                            <Select
                                                showSearch
                                                style={{ width: 220 }}
                                                placeholder="请选择需要关联的合同"
                                                optionFilterProp="children"
                                                onChange={this.onChange}
                                            >
                                                {
                                                    contract_list.map((item, key) => {
                                                        return (
                                                            <Option key={key} value={item.contract_code}>{item.NAME}</Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ display: display_name2 }}>
                                    <Row type="flex" justify="space-around" align="top" gutter={16}>
                                        <Col>
                                            <Input type='text' placeholder='请输入合同编号' value={input_values1} onChange={this.InputChange1} style={{ width: 250 }} />
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="space-around" align="top" gutter={16} style={{ marginTop: 10, marginBottom: 20 }}>
                                        <Col>
                                            <Input type='text' placeholder='请输入合同名称' value={input_values2} onChange={this.InputChange2} style={{ width: 250 }} />
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="space-around" align="top" gutter={16} style={{ marginTop: 10, marginBottom: 20 }}>
                                        <Col>
                                            {tagsFromServer.map(tag => (
                                                <CheckableTag
                                                    key={tag}
                                                    checked={selectedTags.indexOf(tag) > -1}
                                                    onChange={checked => this.handleTagChange(tag, checked)}
                                                >
                                                    {tag}
                                                </CheckableTag>
                                            ))}
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                    </div>,
            },
        ];
        return (
            <div className="centerX">
                <Steps progressDot current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 2 && (
                        <Button type="primary" style={{ width: 58 }} size='small' onClick={e => this.bill_select(e)} loading={isLoading}>
                            查找
                      </Button>
                    )}
                    {current < steps.length - 2 && (
                        <Button style={{ width: 60, marginLeft: 20 }} size='small' onClick={() => this.auditModelClose()}>
                            取消
                        </Button>
                    )}
                    {current === steps.length - 2 && (
                        <Button type="primary" size='small' onClick={this.next.bind(this, invoice_detail.s_name)}>
                            下一步
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" size='small' style={{ width: 58 }} onClick={this.handleGuanLian.bind(this, invoice_detail.invoice_code, invoice_detail.s_name, invoice_detail.invoice_no_short)}>
                            关联
                      </Button>
                    )}
                    {current > 0 && (
                        <Button size='small' style={{ width: 60, marginLeft: 20 }} onClick={() => this.prev()}>
                            上一步
                      </Button>
                    )}
                </div>
            </div>
        );
    }
}

export default invoice_add;