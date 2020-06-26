import React from 'react';
import { connect } from 'dva';
import { Row, Col, Button, Typography, Input, Select, Card, Form, Table, Modal, Popconfirm } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import styles from './reimburse_add.css';
import MulText from '../../../../components/upload/mulText';
import util from '../../../../utils/notification';
import InvoiceAdd from './reimburse_form/invoice_add';

const { Text } = Typography;
const { Option } = Select;

@connect(({ common_model, reimburse_model, personnel_model }) => ({
    invoiceList: reimburse_model.invoiceList,
    // 报销人.
    reimburse_name: reimburse_model.reimburse_name,
    // 报销类别.
    reimburse_type: reimburse_model.reimburse_type,
    // 报销金额.
    reimburse_money: reimburse_model.reimburse_money,
    // 备注信息.
    reimburse_note: reimburse_model.reimburse_note,
    // 附件文件.
    arr_files: reimburse_model.arr_files,
}))

@Form.create()
class reimburse_add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visiable: false,
            reimburse: [],
            list: [],
            invoiceList: this.props.invoiceList || [],
            username: '',
            role_code: '',
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
        const { dispatch, location } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: {
                    name: '项目管理', href: '',
                    name01: '项目详情', href01: '',
                    detail: '添加报销',
                },
                menu: {
                    selectedKeys: ['project'],
                },
                username: userdata.username,
            }
        });
        dispatch({
            type: 'reimburseType_model/reimburse',
            callback: data => {
                this.setState({
                    reimburse: data,
                });
            }
        });
        dispatch({
            type: 'project_member_model/memberList',
            payload: { project_code: location.query.project_code, username: userdata.username, role_code: roledata[0].authority },
            callback: data => {
                this.setState({
                    list: data,
                });
            }
        });

    }

    // 获取表单数据.
    getFormData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let invoiceList = this.state.invoiceList;
                const { dispatch, location } = this.props;
                // 附件文件.
                const v_files = values.reimburse_file || [];
                let arr_files = [];
                v_files.map((value) => {
                    if (value.indexOf(",") != -1) {
                        util.error("附件文件名不能含有 , 字符");
                    } else {
                        arr_files.push(value);
                    }
                })
                // console.log(values, location.query.project_code, invoiceList);
                dispatch({
                    type: 'reimburse_model/addReimburse',
                    payload: { values, project_code: location.query.project_code, arr_files, invoiceList },
                    callback: code => {
                        if (code === 0) {
                            router.push({
                                pathname: '/fht/project/project_detail',
                                query: {
                                    project_name: location.query.project_name,
                                    project_code: location.query.project_code,
                                },
                            });
                        }
                    }
                });
                this.props.form.resetFields();
            }
        });
    }

    // 显示添加发票窗口.
    showModal = () => {
        this.setState({
            visiable: true,
        });
    }

    // 获取添加发票的参数.
    getInvoiceData = (value) => {
        const { dispatch } = this.props;
        let invoiceList = this.props.invoiceList;
        const { username, role_code } = this.state;
        dispatch({
            type: 'personnel_model/get',
            payload: { id: value.create_by },
            callback: data => {
                if (role_code === "ROLE_DIRECTOR") {
                //    if (username === data.username) {
                        if (invoiceList.length > 0) {
                            invoiceList.forEach(function (item, index, arr) {
                                if (item.id == value.id) {
                                    util.error("请勿重复添加！");
                                } else {
                                    invoiceList.push(value);
                                }
                            });
                        } else {
                            invoiceList.push(value);
                        }
                        dispatch({
                            type: 'reimburse_model/updateState',
                            payload: { invoiceList },
                        });
                        this.setState({
                            visiable: false,
                         });
                    // } else {
                    //     util.error("权限不足！");
                    // }
                } else {
                    if (invoiceList.length > 0) {
                        invoiceList.forEach(function (item, index, arr) {
                            if (item.id == value.id) {
                                util.error("请勿重复添加！");
                            } else {
                                invoiceList.push(value);
                            }
                        });
                    } else {
                        invoiceList.push(value);
                    }
                    dispatch({
                        type: 'reimburse_model/updateState',
                        payload: { invoiceList },
                    });
                    this.setState({
                        visiable: false,
                    });
                }
            }
        });
    }

    // 取消添加发票.
    handleCancel = () => {
        this.setState({
            visiable: false,
        });
    }

    // 查看发票详情.
    toInvoiceDetail = (key) => {
        const { dispatch } = this.props;
        this.props.form.validateFields((err, values) => {
            // 报销人.
            let reimburse_name = values.reimburse_name;
            // 报销类别.
            let reimburse_type = values.reimburse_type;
            // 报销金额.
            let reimburse_money = values.reimburse_money;
            // 备注信息.
            let reimburse_note = values.reimburse_note;
            // 附件文件.
            const v_files = values.reimburse_file || [];
            let arr_files = [];
            v_files.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("附件文件名不能含有 , 字符");
                } else {
                    arr_files.push(value);
                }
            })
            dispatch({
                type: 'reimburse_model/updateState',
                payload: { reimburse_name, reimburse_type, reimburse_money, reimburse_note, arr_files },
            });
        });

        router.push({
            pathname: '/fht/bill/bill_details',
            query: {
                invoice_code: key.invoice_code,
                invoice_no_short: key.invoice_no_short,
            },
        });
    }

    // 删除发票.
    deletenvoice = (id) => {
        let invoiceList = this.props.invoiceList;
        invoiceList.forEach(function (item, index, arr) {
            if (item.id == id) {
                arr.splice(index, 1);
            }
        });
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburse_model/updateState',
            payload: { invoiceList },
        });
        this.setState({
            invoiceList,
        });
    }

    // 返回.
    go2Back = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'reimburse_model/updateState',
            payload: { invoiceList: [], reimburse_name: '', reimburse_type: '', reimburse_money: '', reimburse_note: '', arr_files: [] },
        });
        router.goBack();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { reimburse, list, invoiceList } = this.state;
        var pa = 0;
        for(let i = 0;i < invoiceList.length;i++){
            pa += invoiceList[i].price_amount
        }
        
        console.log("发票信息",invoiceList);
        const columns = [
            {
                title: '发票号码',
                dataIndex: 'invoice_no_short',
                key: 'invoice_no_short',
            },
            {
                title: '发票类型',
                dataIndex: 'invoice_type',
                key: 'invoice_type',
                render: invoice_type => (
                    <span>
                        {
                            invoice_type === '01' ? '增值税专用发票' : invoice_type === '04' ? '增值税普通发票' : invoice_type === '10' ? '增值税普通发票(电子)' : invoice_type === '11' ? '增值税普通发票(卷式)' : '--'
                        }
                    </span>
                )
            },
            {
                title: '销方名称',
                dataIndex: 's_name',
                key: 's_name',
            },
            {
                title: '发票分类',
                dataIndex: 'invoice_catalog',
                key: 'invoice_catalog',
                render: invoice_catalog => (
                    <span>
                        {
                            invoice_catalog === '01' ? '管理费类' : invoice_catalog === '02' ? '咨询费类' : invoice_catalog === '03' ? '会议费类' : invoice_catalog === '04' ? '培训费类' : invoice_catalog === '05' ? '旅游费类' : invoice_catalog === '06' ? '手续费类' : '其他类'
                        }
                    </span>
                )
            },
            {
                title: '发票代码',
                dataIndex: 'invoice_code',
                key: 'invoice_code',
            },
            {
                title: '发票金额',
                dataIndex: 'price_amount',
                key: 'price_amount',
            },
            {
                title: '开票日期',
                dataIndex: 'invoice_time',
                key: 'invoice_time',
                render: invoice_time => (
                    <span>
                        {
                            moment(invoice_time).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                width: 170,
                render: (key, record) => (
                    <span>
                        <Button size="small" type="link" onClick={this.toInvoiceDetail.bind(this, key)}>查看</Button>
                        <Popconfirm placement="top" title="确定删除此发票？"
                            onConfirm={this.deletenvoice.bind(this, record.id)} okText="确定" cancelText="取消">
                            <Button size="small" type="link" style={{ color: '#DD5364' }}>删除</Button>
                        </Popconfirm>
                    </span>
                )
            },
        ];
        return (
            <div style={{ margin: '0 0 40px 0' }}>
                <Row>
                    <div style={{ float: 'right' }}>
                        <Button onClick={this.go2Back}>返回</Button>
                        <Button type="primary" style={{ margin: '0 12px' }} onClick={this.getFormData}>确定</Button>
                    </div>
                </Row>
                <Row style={{ margin: '20px 0 0 0' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>报销信息</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ margin: '20px 0 0 0' }}
                >
                    <Form>
                        <Row gutter={16}>
                            <Col span={8}>
                                {
                                    this.props.reimburse_name ?
                                        <Form.Item label="报销人">
                                            {getFieldDecorator('reimburse_name', {
                                                initialValue: this.props.reimburse_name,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择报销人',
                                                    },
                                                ],
                                            })(
                                                <Select placeholder="请选择报销人" allowClear={true} style={{ width: 300 }}>
                                                    {
                                                        list.map((value, key) => {
                                                            return (
                                                                <Option key={key} value={value.id}>{value.name}</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                        :
                                        <Form.Item label="报销人">
                                            {getFieldDecorator('reimburse_name', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择报销人',
                                                    },
                                                ],
                                            })(
                                                <Select placeholder="请选择报销人" allowClear={true} style={{ width: 300 }}>
                                                    {
                                                        list.map((value, key) => {
                                                            return (
                                                                <Option key={key} value={value.id}>{value.name}</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                }
                            </Col>
                            <Col span={8}>
                                {
                                    this.props.reimburse_type ?
                                        <Form.Item label="报销类别">
                                            {getFieldDecorator('reimburse_type', {
                                                initialValue: this.props.reimburse_type,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择报销类别',
                                                    },
                                                ],
                                            })(
                                                <Select placeholder="请选择报销类别" allowClear={true} style={{ width: 300 }}>
                                                    {
                                                        reimburse.map((value, key) => {
                                                            return (
                                                                <Option key={key} value={value.type_code}>{value.type_name}</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                        :
                                        <Form.Item label="报销类别">
                                            {getFieldDecorator('reimburse_type', {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择报销类别',
                                                    },
                                                ],
                                            })(
                                                <Select placeholder="请选择报销类别" allowClear={true} style={{ width: 300 }}>
                                                    {
                                                        reimburse.map((value, key) => {
                                                            return (
                                                                <Option key={key} value={value.type_code}>{value.type_name}</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            )}
                                        </Form.Item>
                                }

                            </Col>
                            <Col span={8}>
                                <Form.Item label="报销金额">
                                    {getFieldDecorator('reimburse_money', {
                                        initialValue: this.props.reimburse_money,
                                        rules: [
                                            {
                                                required: true,
                                                message: '请填写报销金额',
                                            },
                                            {
                                                pattern: /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/,                                             
                                                message: '报销金额为两位小数',
                                            },
                                        ],
                                    })(
                                        <Input placeholder="请填写报销金额" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={16}>
                                <Form.Item label="备注信息">
                                    {getFieldDecorator('reimburse_note', {
                                        initialValue: this.props.reimburse_note,
                                    })(
                                        <Input placeholder="请输入备注信息" allowClear={true} />,
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="附件文件">
                                    {getFieldDecorator('reimburse_file', {
                                        initialValue: this.props.arr_files,
                                    })(<MulText picnum={99}></MulText>)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Row style={{ margin: '20px 0 0 0' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>报销发票</Text>
                        <div style={{ float: 'right' }}>
                            <Text className={styles.invoice_font} style={{ margin: '0 20px 0 0' }}>发票数量：<span style={{ color: '#000000' }}>{invoiceList.length}</span></Text>
                            <Text className={styles.invoice_font}>发票总额：<span style={{ color: '#000000' }}>{pa}</span></Text>
                            <Button type="link" style={{ color: '#539E00' }} onClick={this.showModal}>添加发票</Button>
                        </div>
                    </span>
                </Row>
                <Modal
                    title="添加发票"
                    visible={this.state.visiable}
                    closable={false}
                    footer={null}
                    width={600}
                >
                    <InvoiceAdd getInvoiceData={this.getInvoiceData} handleCancel={this.handleCancel} />
                </Modal>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                        padding: '0'
                    }}
                    style={{ margin: '20px 0 0 0' }}
                >
                    <Table rowKey={record => record.id} columns={columns} dataSource={invoiceList} pagination={{
                        "defaultPageSize": 5,
                        "defaultCurrent": 1,
                        "showQuickJumper": true,
                    }} />
                </Card>
            </div>
        );
    }
}

export default reimburse_add;