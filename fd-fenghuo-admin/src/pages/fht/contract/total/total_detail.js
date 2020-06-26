import React from 'react';
import { Card, Button, Row, Col, Tag, Table, Divider, Typography, Modal, Tabs, Form, Input, Select, DatePicker, InputNumber } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import { connect } from 'dva';
import InvoiceAdd from '../detail_modal_form/invoice_add';
import ContractChange from '../detail_modal_form/contract_change';
import ContractAddContact from '../detail_modal_form/contract_add_contact';
import moment from 'moment';
import router from 'umi/router';
import MulText from '../../../../components/upload/mulText';
import SFile from '../../../../components/upload/sfile';
import { serverUrl } from '../../../../utils/config';
import { G2, Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape, Facet, Util } from "bizcharts";
import util from '../../../../utils/notification';
import DataSet from "@antv/data-set";
import { Empty } from 'antd';
const { confirm } = Modal;
const { Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;



@connect(({ common_model, contract_model, project_model, bill_model }) => ({
    showDetailList: contract_model.showDetailList,
    // 数据库中的联系人数据
    contactLists: contract_model.contractList1,
    // model临时存放的联系人数据
    contactList: contract_model.contractList,
    c_name: contract_model.contract_name,
    c_code: contract_model.contract_code,
    i_list: contract_model.invoiceList,
    page: contract_model.f_page,
    pageSize: contract_model.f_pageSize,
    totalSize: contract_model.f_totalSize,
}))

@Form.create()
class total_detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 20,
            // 显示对话框.
            invoiceVisible: false,
            contractVisible: false,
            contactVisible: false,
            // 显示编辑页面.
            isEdit: false,
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '合同管理', detail: "合同详情", href: "/bfht/fht/contract/contract_list.html" },
                menu: {
                    selectedKeys: ['contract'],
                }
            }
        });
        dispatch({
            type: 'contract_model/showDetail',
            payload: {
                contract_code: location.query.contract_code,
                contract_name: location.query.contract_name,
                company_id: location.query.company_id,
            },
        });
    }

    // 显示添加发票框.
    showContractModal = () => {
        this.setState({
            contractVisible: true,
        })
    }
    showInvoiceModal = () => {
        this.setState({
            invoiceVisible: true,
        })
    }
    showContactModal = () => {
        this.setState({
            contactVisible: true,
        });
    };

    // 合同页面新加发票时的关联按钮
    handleUpdateInvoice = (invoice_code, no, s_name) => {
        const { dispatch, c_code, c_name } = this.props;
        const company_id = 1;
        console.log("合同详情里的参数", invoice_code, no, s_name);
        dispatch({
            type: 'bill_model/updateInvoiceNowContract',
            payload: { contract_code: c_code, invoice_code: invoice_code, invoice_no_short: no, s_name: s_name }
        });
        dispatch({
            type: 'contract_model/showDetail',
            payload: { contract_code: c_code, contract_name: c_name, company_id: company_id }
        });
        this.setState({
            invoiceVisible: false,
        });

    }

    // 点击取消后执行的操作.
    handleContractCancel = e => {
        this.setState({
            contractVisible: false,
        });
    };
    handleInvoiceCancel = e => {
        this.setState({
            invoiceVisible: false,
        });
    };
    handleContactCancel = e => {
        this.setState({
            contactVisible: false,
        });
    };

    // 得到变更关联的所有值, 提交方法.
    getContractData = (value) => {

        const { dispatch, c_name, c_code } = this.props;
        dispatch({
            type: 'contract_model/detailChangeContract',
            payload: { value, c_name, c_code }
        });
        this.setState({
            contractVisible: false,
        });
    }
    // 得到添加发票的所有值, 查找方法.
    getInvoiceData = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/detailInvoice',
            payload: { values }
        });
    }
    // 获取联系方式信息.
    getContactData = contact => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/detailContact',
            payload: { contact }
        });
        this.setState({
            contactVisible: false,
        });
    };

    // 编辑.
    todoEidt = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/edit',
            payload: {}
        });
        this.setState({
            isEdit: !this.state.isEdit,
        })
    }

    // 保存.
    saveEdit = () => {
        this.props.form.validateFields((err, values) => {
            console.log("合同编辑内容", values);
            const url = serverUrl + "/common/file/readimg?img=";
            // 合同文件
            const v_files = values.contract_files;
            let arr_files = [];
            v_files.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("合同文件名不能含有 , 字符");
                } else {
                    arr_files.push(value);
                }
                console.log("arr", arr_files);
            })

            // 业务发起相关信息及文档--邮件、短信或其他信息
            const v_link_info = values.contract_business1;
            let arr_link_info = [];
            v_link_info.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("业务发起里邮件、短信或其他信息文件名不能含有 , 字符");
                } else {
                    arr_link_info.push(value);
                }
            })
            // 业务发起相关信息及文档--发起文档等材料
            const v_docs = values.contract_business2;
            let arr_docs = [];
            v_docs.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("业务发起里发起文档等材料文件名不能含有 , 字符");
                    arr_docs.push(value);
                } else {
                    arr_docs.push(value);
                }
            })
            // 业务完成信息及文档--邮件、短信或其他信息
            const v_b_link_info = values.contract_finish1;
            let arr_b_link_info = [];
            v_b_link_info.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("业务完成里合邮件、短信或其他信息文件名不能含有 , 字符");
                    arr_b_link_info.push(value);
                } else {
                    arr_b_link_info.push(value);
                }
            })
            // 业务完成信息及文档--发起文档等材料
            const v_f_docs = values.contract_finish2;
            let arr_f_docs = [];
            v_f_docs.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("业务完成里发起文档等材料文件名不能含有 , 字符");
                } else {
                    arr_f_docs.push(value);
                }
            })
            // 记账凭证记录
            const v_f_record = values.contract_record1;
            let arr_f_record = [];
            v_f_record.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("记账凭证记录文件名不能含有 , 字符");
                } else {
                    arr_f_record.push(value);
                }
            })
            // 银行流水记录
            const v_b_record = values.contract_record2;
            let arr_b_record = [];
            v_b_record.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("银行流水记录文件名不能含有 , 字符");
                } else {
                    arr_b_record.push(value);
                }
            })
            // 交易账册记录
            const v_s_record = values.contract_record3;
            let arr_s_record = [];
            v_s_record.map((value) => {
                if (value.indexOf(",") != -1) {
                    util.error("交易账册记录文件名不能含有 , 字符");
                } else {
                    arr_s_record.push(value);
                }
            })

            // 对DPicker组件传过来的时间进行格式化                 
            values.delivery_date = moment(values.delivery_date).format('YYYY-MM-DD');
            // 当为时间组件为空值时，会返回Invalid date，我们传入空值给后台，让后台进行判断处理
            if (values.delivery_date == 'Invalid date') {
                values.delivery_date = ''
            }
            values.contract_date = moment(values.contract_date).format('YYYY-MM-DD');
            if (values.contract_date == 'Invalid date') {
                values.contract_date = ''
            }

            const { dispatch } = this.props;
            dispatch({
                type: 'contract_model/detailSave',
                payload: { values, arr_files, arr_link_info, arr_docs, arr_b_link_info, arr_f_docs, arr_f_record, arr_b_record, arr_s_record }
            });
        });
        this.setState({
            isEdit: !this.state.isEdit,
            contractData: {},
        })

    }

    // 取消编辑
    cancelEdit = () => {
        const { dispatch } = this.props;
        this.setState({
            isEdit: !this.state.isEdit,
            contractData: {},
        });
        dispatch({
            type: 'contract_model/cancelEdit',
            payload: {}
        });

    }

    // 发票列表里的取消关联.
    disassociate = (invoice_no_short) => {
        const { dispatch, c_code, c_name } = this.props;
        confirm({
            title: '确定取消关联此发票?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                dispatch({
                    type: 'contract_model/updateInvoice',
                    payload: { invoice_no_short, c_code, c_name }
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    // 跳转到对应项目详情
    linkToProject = (project_name, project_code) => {
        router.push(
            {
                pathname: '/fht/project/project_detail',
                query: {
                    project_name: project_name,
                    project_code: project_code,
                    company_id: "1",
                },
            });
    }
    // 跳转到对应的发票详情
    LinkToInvoice = (key) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/bill/bill_details',
            query: {
                invoice_code: key.invoice_code,
                invoice_no_short: key.invoice_no_short,
            },
        });
    }
    // 跳转到对应的供应商详情 
    linkToSupplier = (s_name) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/supplier/supplier_detail',
            query: {
                company_name: s_name
            },
        });
    }

    // 删除联系方式.
    deleteContact = (name) => {
        console.log("name", name);
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/deleteContact',
            payload: { name }
        });
    }

    // 获取改变后的页面显示数量.
    pageSizeChange = (current, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/pageSizeChange',
            payload: { page: current, pageSize }
        });
    };

    // 获取改变后的页码.
    pageChange = (page, pageSize) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'contract_model/pageSizeChange',
            payload: { page, pageSize }
        });
    };

    cloudDownload = (v) => {
        console.log("cloudDownload==", v);
    };

    render() {
        const { isEdit } = this.state;
        let { showDetailList, i_list, contactLists, contactList, pageSize, totalSize, page } = this.props;
        console.log("发票信息i_list", i_list,totalSize);
        const total = showDetailList.contract || [];
        const contract_tag = total.contract_tag || [];
        const c1 = contactLists || [];
        const c2 = contactList || [];
        const files = showDetailList.files || [];
        //        console.info("files", files)
        const link_info = showDetailList.link_info || [];
        const docs = showDetailList.docs || [];
        const b_link_info = showDetailList.b_link_info || [];
        const f_docs = showDetailList.f_docs || [];
        const f_record = showDetailList.f_record || [];
        const b_record = showDetailList.b_record || [];
        const s_record = showDetailList.s_record || [];
        const score = showDetailList.score || [];
        // const contractMessage = showDetailList.contractMessage || [];
        // console.log("消息预警", contractMessage);
        console.log("数据库中", c1);
        console.log("model中临时", c2);
        const { getFieldDecorator } = this.props.form;
        console.log("score", score);
        console.log("score.files_number", score.files_number);
        const { DataView } = DataSet;
        // 个边的总分
        const item = {
            '合同相关': score.files_number,
            '内部审核': score.internal_Audit_number,
            '业务沟通': score.communication_number,
            '交付信息': score.deliver_number,
        };
        // 每边的具体分值
        const data = [
            { item: '合同相关', a: total.p_files },
            { item: '内部审核', a: total.p_internal },
            { item: '业务沟通', a: total.p_communication },
            { item: '交付信息', a: total.p_deliver }
        ];

        const titleMap = { aRate: '内部合规风险' };
        const fields = [];
        Object.keys(titleMap).forEach((key, index) => {
            fields[index] = titleMap[key];
        });

        const tmpRadarChartTableData = [];
        data.forEach((value, key) => {
            const v = { ...value };
            const t = item[v.item];

            v.aRate = parseFloat(((v.a / t) * 100).toFixed(2));
            tmpRadarChartTableData[key] = v;
        });
        const dv = new DataView().source(tmpRadarChartTableData);

        dv.transform({
            type: 'map',
            callback(row) {
                const newRow = { ...row };
                Object.keys(titleMap).forEach(key => {
                    newRow[titleMap[key]] = row[key];
                });
                return newRow;
            },
        }).transform({
            type: 'fold',
            fields, // 展开字段集
            key: 'user', // key字段
            value: 'score', // value字段
        });
        const cols = {
            score: {
                min: 0,
                max: 100,
                formatter: (val) => `${val}%`,
            }
        }

        const chartTooltipMap = { 内部合规风险: "a" };
        // 自定义tooltip 的显示内容
        const onTooltipChange = ev => {
            if (chartTooltipMap !== undefined) {
                const item = ev.items; // tooltip显示的项
                item.forEach((value, key) => {
                    const { _origin } = value.point;
                    const ranges = _origin;
                    item[key].name = value.title;   // item[key].name = ranges.user;  原本样式  （现在是将title与name互换了一下）
                    item[key].title = ranges.user;   // item[key].title = value.title;
                    item[key].marker = true;
                    item[key].color = value.color;
                    item[key].value = ranges[chartTooltipMap[value.title]];  //item[key].value = ranges[chartTooltipMap[value.name]];
                });
            }
        };


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
                        {invoice_type == '01' ? '增值税专用发票' : invoice_type == '04' ? '增值税普通发票' : invoice_type == '10' ? '增值税普通发票(电子)' : invoice_type == '11' ? '增值税普通发票(卷式)' : ''}
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
                        {invoice_catalog === '01' ? "管理费类" : invoice_catalog === '02' ? "咨询费类" :
                            invoice_catalog === '03' ? "会议费类" : invoice_catalog === '04' ? "培训费类" : invoice_catalog === '05' ? "旅游费类" : invoice_catalog === '06' ? "手续费类" : '其他费类'
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
                            moment(invoice_time).format('YYYY.MM.DD')
                        }
                    </span>
                )
            },
            {
                title: '审核状态',
                dataIndex: 'audit_status',
                key: 'audit_status',
                render: audit_status => (
                    <span>

                        {audit_status == 0 ? <Tag color="orange">待审核</Tag> : audit_status == 1 ? <Tag color="green">已通过</Tag> : audit_status == 2 ? <Tag color="red">已驳回</Tag> : ''}

                    </span>
                )
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record, key) => (
                    <span>
                        <Button size="small" type="link" onClick={this.LinkToInvoice.bind(this, record)} >查看</Button>
                        <Divider type="vertical" />
                        {total.STATUS == '01' ? <Button size="small" type="link" style={{ color: '#EA909B' }} ghost onClick={this.disassociate.bind(this, record.invoice_no_short)}>取消关联</Button> : ''}
                    </span>

                )
            },
        ];

        return (
            <div>
                <Row>
                    <Button style={{ float: 'right', margin: '0 12px' }} onClick={() => router.goBack()}>返 回</Button>
                </Row>
             
                <Row style={{ marginTop: '23px', marginBottom: '5px' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>基本信息</Text>
                    </span>
                    {total.STATUS == '01' ? <Button type="link" style={{ float: 'right' }} onClick={this.showContractModal}>变更关联</Button> : ''}

                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                >
                    <Row style={{ marginTop: '5px' }}>
                        <Col style={{ marginBottom: 20, fontSize: 16, color: '#4A4A4A', fontWeight: 600 }}><span >{total.contract_code}</span></Col>
                    </Row>
                    <Row style={{ marginTop: '5px' }}>
                        <Col span={6}><span style={{ color: '#AFADAC' }}>合同名称：</span><span>{total.contract_name}</span></Col>
                        <Col span={6} ><span style={{ color: '#AFADAC' }}>风险状态：</span><span>{total.risk_level === '01' ? <b style={{ color: '#539E00' }}>正常</b> : <b style={{ color: '#DD5364' }}>高风险</b>}</span></Col>
                        {total.s_name ?
                            <Col span={12} ><span style={{ color: '#AFADAC' }}>供&nbsp;&nbsp;应&nbsp;&nbsp;商：</span><a type="link" onClick={this.linkToSupplier.bind(this, total.s_name)}>{total.s_name}</a></Col>
                            : <Col span={12} ><span style={{ color: '#AFADAC' }}>供&nbsp;&nbsp;应&nbsp;&nbsp;商：</span><span>--</span>
                            </Col>
                        }
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        {/* 如果有关联项目, 则显示, 无则显示-- */}
                        {total.project_name ?
                            <Col span={6}><span style={{ color: '#AFADAC' }}>关联项目：</span><a type="link" onClick={this.linkToProject
                                .bind(this, total.project_name, total.project_code)}>{total.project_name}</a></Col>
                            : <Col span={6}><span style={{ color: '#AFADAC' }}>关联项目：</span><span>--</span>
                            </Col>
                        }
                        <Col span={6}><span style={{ color: '#AFADAC' }}>票&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;据：</span><span>{total.invoice_number ? total.invoice_number : 0} 张</span></Col>
                        <Col span={6}><span style={{ color: '#AFADAC' }}>开票总额：</span><span>{total.price_amount ? total.price_amount : 0} 元</span></Col>
                        <Col span={6}><span style={{ color: '#AFADAC' }}>创建日期：</span><span>
                            {
                                moment(total.create_time).format('YYYY.MM.DD')
                            }</span></Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col span={8}><span style={{ color: '#AFADAC' }}>合同标签：</span>
                            {contract_tag == [] || contract_tag == '' ? <span >--</span> :
                                contract_tag.map((value, key) => {
                                    return (
                                        <span key={key}><Tag color="#CEE2F7"><span style={{
                                            width: '44px',
                                            height: '16px',
                                            fontSize: '11px',
                                            fontFamily: 'PingFangSC-Medium,PingFang SC',
                                            fontWeight: 500,
                                            color: 'rgba(20,124,236,1)',
                                            lineHeight: '16px'
                                        }}>{value}</span></Tag></span>
                                    );
                                })
                            }</Col>
                    </Row>
                </Card>
                <div>
                    <Modal
                        title="关联设置"
                        visible={this.state.contractVisible}
                        closable={false}
                        footer={null}
                    >
                        <ContractChange getContractData={this.getContractData} handleContractCancel={this.handleContractCancel} />
                    </Modal>
                </div>

                <Row style={{ marginTop: '23px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>风险控制</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                >
                    <Row type="flex" justify="space-around" align="middle">
                        <Col span={4}>
                            <Pie color={((Number(total.p2_1) + Number(total.p2_2) + Number(total.p2_3) + Number(total.p2_4)) <= score.p1) ? '#DD5364' : '#37B500'}
                                percent={(Number(total.p2_1) + Number(total.p2_2) + Number(total.p2_3) + Number(total.p2_4)) / (Number(score.tax) + Number(score.market) + Number(score.internal) + Number(score.supplier)) * 100}
                                subTitle={<span style={{ color: ((Number(total.p2_1) + Number(total.p2_2) + Number(total.p2_3) + Number(total.p2_4)) <= score.p1) ? '#DD5364' : '' }}>综合得分</span>}
                                total={<span style={{ color: ((Number(total.p2_1) + Number(total.p2_2) + Number(total.p2_3) + Number(total.p2_4)) <= score.p1) ? '#DD5364' : '' }}>
                                    {(Number(total.p2_1) + Number(total.p2_2) + Number(total.p2_3) + Number(total.p2_4)) +
                                        "/" +
                                        (Number(score.tax) + Number(score.market) + Number(score.internal) + Number(score.supplier))}
                                </span>}
                                height={150}
                            />
                        </Col>


                        <Col span={4}><Pie
                            color={(total.p2_1 <= score.p2_1) ? '#DD5364' : '#37B500'}
                            percent={Number(total.p2_1) / Number(score.tax) * 100}
                            subTitle={<span style={{ color: (total.p2_1 <= score.p2_1) ? '#DD5364' : '' }}>税务合规</span>}
                            total={<span style={{ color: (total.p2_1 <= score.p2_1) ? '#DD5364' : '' }}>{total.p2_1 + "/" + score.tax}</span>}
                            height={150}
                        />
                        </Col>

                        <Col span={4}><Pie
                            color={(total.p2_2 <= score.p2_2) ? '#DD5364' : '#37B500'}
                            percent={Number(total.p2_2) / Number(score.market) * 100}
                            subTitle={<span style={{ color: (total.p2_2 <= score.p2_2) ? '#DD5364' : '' }}>市场监管</span>}
                            total={<span style={{ color: (total.p2_2 <= score.p2_2) ? '#DD5364' : '' }}>{total.p2_2 + "/" + score.market}</span>}
                            height={150} />
                        </Col>

                        <Col span={4}><Pie
                            color={(total.p2_3 <= score.p2_3) ? '#DD5364' : '#37B500'}
                            percent={Number(total.p2_3) / Number(score.internal) * 100}
                            subTitle={<span style={{ color: (total.p2_3 <= score.p2_3) ? '#DD5364' : '' }}>内部合规</span>}
                            total={<span style={{ color: (total.p2_3 <= score.p2_3) ? '#DD5364' : '' }}>{total.p2_3 + "/" + score.internal}</span>}
                            height={150}
                        /></Col>

                        <Col span={4}><Pie
                            color={(total.p2_4 <= score.p2_4 || total.is_legal === "1") ? '#DD5364' : '#37B500'}
                            percent={total.p2_4 ? (Number(total.p2_4) / Number(score.supplier) * 100) : 0}
                            subTitle={<span style={{ color: (total.p2_4 <= score.p2_4 || total.is_legal === "1") ? '#DD5364' : '' }}>供应商评分</span>}
                            total={<span style={{ color: (total.p2_4 <= score.p2_4 || total.is_legal === "1") ? '#DD5364' : '' }}>{total.p2_4 + "/" + score.supplier}</span>}
                            height={150}
                        /></Col>
                    </Row>
                    <Row type="flex" justify="space-around" align="middle" style={{ borderTop: '1px solid rgb(241,241,241,1)' }}>
                        <Col span={14} push={1} >
                            <Card title={<span style={{ fontSize: '14px' }}>
                                <div style={{
                                    width: '3px',
                                    height: '12px',
                                    background: 'rgba(20,124,236,1)',
                                    borderRadius: '2px',
                                    display: 'inline-block',
                                    margin: '0 10px 0 0'
                                }} />
                                <Text style={{ color: '#000000', fontWeight: 500 }} strong>预警说明</Text>
                            </span>}
                                bordered={false}
                                style={{ borderRight: '1px solid rgb(241,241,241,1)', marginLeft: -60 }}
                                headStyle={{ padding: '0', border: 'none' }}
                            >
                                <div style={{ overflow: 'scroll', height: 200, marginLeft: -20 }}>
                                    {total.p3_1_1 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同供应商股东名单与内部审核人员存在风险关系</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_2 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中发票的购方名称与当前账号公司存在冲突</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_3 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中发票的销方名称与合同相关中的销售方企业名称存在冲突</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_4 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中单张发票金额超过合同相关中的合同金额</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_5 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同发票总金额超过合同相关中的合同金额</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_6 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中发票类型与合同相关中的货物应税劳务服务不一致</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_7 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在居民日常服务或娱乐服务类别的发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_1 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在管理费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_2 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在咨询费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_3 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在会议费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_4 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在培训费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_5 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在旅游费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_2_6 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中存在手续费类发票</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_3_1 == 0 || total.p3_3_2 == 0 || total.p3_3_3 == 0 || total.p3_3_4 == 0 || total.p3_3_5 == 0 || total.p3_3_6 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中内部合规风险-合同相关未完善</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_3_7 == 0 || total.p3_3_8 == 0 || total.p3_3_9 == 0 || total.p3_3_10 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中内部合规风险-内部审核未完善</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_3_11 == 0 || total.p3_3_12 == 0 || total.p3_3_13 == 0 || total.p3_3_14 == 0 || total.p3_3_15 == 0 || total.p3_3_16 == 0 || total.p3_3_17 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中内部合规风险-业务沟通未完善</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_3_18 == 0 || total.p3_3_19 == 0 || total.p3_3_20 == 0 || total.p3_3_21 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中内部合规风险-交付信息未完善</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_1 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商的企业注册少于2年</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_2 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商的企业注册资本少于100万</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_3 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商出现受惩黑名单</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_4 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商出现法院执行公告</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_5 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商出现法院失信公告</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_4_6 == 0 ?
                                        <div>
                                            <Row style={{ marginBottom: 30, fontSize: 14, marginRight: 60, wordWrap: 'break-word' }}>合同中供应商出现处罚曝光台</Row>
                                            <div style={{ borderTop: '1px solid rgba(246,247,248,1)', width: '90%', marginTop: -15, marginLeft: -15, float: "left" }}></div>
                                        </div>
                                        : ''
                                    }
                                    {total.p3_1_1 != 0 && total.p3_1_2 != 0 && total.p3_1_3 != 0 && total.p3_1_4 != 0 && total.p3_1_5 != 0 && total.p3_1_6 != 0 && total.p3_1_7 != 0
                                        && total.p3_2_1 != 0 && total.p3_2_2 != 0 && total.p3_2_3 != 0 && total.p3_2_4 != 0 && total.p3_2_5 != 0 && total.p3_2_6 != 0 && total.p3_3_1 != 0
                                        && total.p3_3_2 != 0 && total.p3_3_3 != 0 && total.p3_3_4 != 0 && total.p3_3_5 != 0 && total.p3_3_6 != 0 && total.p3_3_7 != 0 && total.p3_3_8 != 0
                                        && total.p3_3_9 != 0 && total.p3_3_10 != 0 && total.p3_3_11 != 0 && total.p3_3_12 != 0 && total.p3_3_13 != 0 && total.p3_3_14 != 0 && total.p3_3_15 != 0
                                        && total.p3_3_16 != 0 && total.p3_3_17 != 0 && total.p3_3_18 != 0 && total.p3_3_19 != 0 && total.p3_3_20 != 0 && total.p3_3_21 != 0 && total.p3_4_1 != 0
                                        && total.p3_4_2 != 0 && total.p3_4_3 != 0 && total.p3_4_4 != 0 && total.p3_4_5 != 0 && total.p3_4_6 != 0
                                        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        : ""
                                    }
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Chart
                                height={300}
                                data={dv}
                                padding="auto"
                                scale={cols}
                                onTooltipChange={onTooltipChange}
                                forceFit
                            >
                                <Coord type="polar" radius={0.6} display={true} />
                                <Axis
                                    name="item"
                                    line={null}
                                    tickLine={null}
                                    visible={false}
                                    grid={{
                                        lineStyle: {
                                            lineDash: null
                                        },
                                        hideFirstLine: false
                                    }}
                                />
                                <Tooltip />
                                <Axis
                                    name="score"
                                    line={null}
                                    label={null}   /* 隐藏坐标轴 */
                                    tickLine={null}
                                    visible={false}
                                    grid={{
                                        type: "polygon",
                                        lineStyle: {
                                            lineDash: null
                                        },
                                        alternateColor: "rgba(0, 0, 0, 0.04)"
                                    }}
                                />
                                {/** <Legend name="user" marker="circle" offset={30} />   隐藏名字  */}
                                <Geom type="area" position="item*score" color="user" />
                                <Geom type="line" position="item*score" color="user" size={2} />
                                <Geom
                                    type="point"
                                    position="item*score"
                                    color="user"
                                    shape="circle"
                                    size={4}
                                    style={{
                                        stroke: "#fff",
                                        lineWidth: 1,
                                        fillOpacity: 1
                                    }}
                                />
                            </Chart>
                        </Col>
                    </Row>
                </Card>

                <Row style={{ marginTop: '23px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>发票信息</Text>
                    </span>
                    {total.STATUS == '01' ? <Button onClick={this.showInvoiceModal} style={{ color: '#539E00', float: 'right' }} type="link">添加发票</Button> : ''}
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                >
                    <Table rowKey={record => record.id} style={{ marginTop: '15px' }} columns={columns} dataSource={i_list} 
                    pagination={{
                        "defaultPageSize": 5,
                        "defaultCurrent": 1,
                        "showQuickJumper": true,
                    }} />
                </Card>
                <div>
                    <Modal
                        title="添加发票"
                        visible={this.state.invoiceVisible}
                        closable={false}
                        footer={null}
                        width={600}
                    >
                        <InvoiceAdd handleUpdateInvoice={this.handleUpdateInvoice} handleInvoiceCancel={this.handleInvoiceCancel} />
                    </Modal>
                </div>
                <Row style={{ marginTop: '23px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '16px' }}>
                        <div style={{
                            width: '4px',
                            height: '14px',
                            background: 'rgba(20,124,236,1)',
                            borderRadius: '2px',
                            display: 'inline-block',
                            margin: '0 10px 0 0'
                        }} />
                        <Text style={{ color: '#000000' }} strong>内部风控风险</Text>
                    </span>

                    {total.STATUS == '01' ? (this.state.isEdit ? <span><Button type="link" style={{ float: "right" }} onClick={this.saveEdit}>保存</Button> <Button type="link" style={{ color: "#EA909B", float: "right" }} onClick={this.cancelEdit}>取消</Button></span> : <Button type="link" style={{ float: "right" }} onClick={this.todoEidt}>编辑</Button>) : ''}

                </Row>
                <Card
                    bordered={false} style={{ marginBottom: 50 }}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="合同相关" key="1">
                            <div>
                                {
                                    isEdit ?
                                        (
                                            <div>
                                                <Form>
                                                    <Row gutter={16}>
                                                        <Col span={6}>
                                                            <Form.Item label="合同文件" style={{ marginLeft: 16 }}>
                                                                {getFieldDecorator('contract_files', {
                                                                    initialValue: files,
                                                                    rules: []
                                                                })(<MulText picnum={99}></MulText>)}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={2}>
                                                            <Form.Item label="销售方企业名称">
                                                                {getFieldDecorator('supplier_name', {
                                                                    initialValue: total.sell_name
                                                                })(
                                                                    <Input  placeholder="请输入销售方企业名称" allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={4}>
                                                            <Form.Item label="货物或应税劳务、服务名称">
                                                                {getFieldDecorator('invoice_classification', {
                                                                    initialValue: total.service_name
                                                                })(
                                                                    <Select placeholder="请选择类别"  allowClear={true}>
                                                                        <Option value="01">管理费类</Option>
                                                                        <Option value="02">咨询费类</Option>
                                                                        <Option value="03">会议费类</Option>
                                                                        <Option value="04">培训费类</Option>
                                                                        <Option value="05">旅游费类</Option>
                                                                        <Option value="06">手续费类</Option>
                                                                        <Option value="07">其他类别</Option>
                                                                    </Select>
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={6}>
                                                            <Form.Item label="合同金额" style={{ marginLeft: 16 }}>
                                                                {getFieldDecorator('contract_money', {
                                                                    initialValue: total.total_amount
                                                                })(
                                                                    <InputNumber precision={2} placeholder='请输入金额' style={{ width: '100%' }} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={2}>
                                                            <Form.Item label="签约日期">
                                                                {getFieldDecorator('contract_date', {
                                                                    initialValue: total.sign_date ? moment(total.sign_date) : ''
                                                                })(
                                                                    <DatePicker style={{ width: '100%' }} allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={4}>
                                                            <Form.Item label="争议解决方式">
                                                                {getFieldDecorator('solve_way', {
                                                                    initialValue: total.solve_type
                                                                })(
                                                                    <Select placeholder="请选择争议解决方式"  allowClear={true}>
                                                                        <Option value="01">仲裁</Option>
                                                                        <Option value="02">法院</Option>
                                                                    </Select>
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        ) : (
                                            <div>
                                                <Row>
                                                    <Col span={8}><span style={{ color: '#AFADAC', marginLeft: 16 }}>合同文件</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>销售方企业名称</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>货物或应税劳务、服务名称</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col span={8}>
                                                        {
                                                            files.map((value, key) => {
                                                                let v = value;
                                                                value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                return (
                                                                    <Row key={key}>
                                                                        <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: 16 }}><span>{value}</span></Col>
                                                                        <Col span={3}>
                                                                            <SFile file={v}></SFile>
                                                                        </Col>
                                                                    </Row>
                                                                );
                                                            })
                                                        }
                                                    </Col>
                                                    <Col span={8} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{total.sell_name}</span></Col>
                                                    <Col span={8} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><span>{total.service_name == '01' ? '管理费类' : total.service_name == '02' ? '咨询费类' : total.service_name == '03' ? '会议费类' : total.service_name == '04' ? '培训费类' : total.service_name == '05' ? '旅游费类' :
                                                        total.service_name == '06' ? '手续费类' : total.service_name == '07' ? '其他类别' : ''}</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col span={8}><span style={{ color: '#AFADAC', marginLeft: 16 }}>合同金额</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>签约日期</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>争议解决方式</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col span={8}><span style={{ marginLeft: 16 }}>{total.total_amount}</span></Col>
                                                    <Col span={8}><span>{total.sign_date ? moment(total.sign_date).format('YYYY.MM.DD') : ''}</span></Col>
                                                    <Col span={8}><span>{total.solve_type == '01' ? '仲裁' : total.solve_type == '02' ? '法院' : ''}</span></Col>
                                                </Row>
                                            </div>
                                        )
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="内部审核" key="2">
                            <div>
                                {
                                    isEdit ?
                                        (
                                            <div>
                                                <Form>
                                                    <Row gutter={16}>
                                                        <Col span={6} >
                                                            <Form.Item label="业务主办人" style={{ marginLeft: 16 }}>
                                                                {getFieldDecorator('business_sponsor', {
                                                                    initialValue: total.sponsor
                                                                })(
                                                                    <Input  placeholder="请输入业务主办人姓名" allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={2}>
                                                            <Form.Item label="业务主管">
                                                                {getFieldDecorator('business_director', {
                                                                    initialValue: total.leader
                                                                })(
                                                                    <Input  placeholder="请输入业务主管姓名" allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={4}>
                                                            <Form.Item label="财务审核">
                                                                {getFieldDecorator('financial_audit', {
                                                                    initialValue: total.f_auditor
                                                                })(
                                                                    <Input  placeholder="请输入财务审核人姓名" allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row gutter={16}>
                                                        <Col span={6}>
                                                            <Form.Item label="业务审核人" style={{ marginLeft: 16 }}>
                                                                {getFieldDecorator('business_audit', {
                                                                    initialValue: total.b_auditor
                                                                })(
                                                                    <Input  placeholder="请输入业务审核人姓名" allowClear={true} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        )
                                        :
                                        (
                                            <div>
                                                <Row>
                                                    <Col span={8}><span style={{ color: '#AFADAC', marginLeft: 16 }}>业务主办人</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>业务主管</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>财务审核</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col span={8}><span style={{ marginLeft: 16 }}>{total.sponsor}</span></Col>
                                                    <Col span={8}><span>{total.leader}</span></Col>
                                                    <Col span={8}><span>{total.f_auditor}</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '20px' }}>
                                                    <Col span={24}><span style={{ color: '#AFADAC', marginLeft: 16 }}>业务审核人</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col span={24}><span style={{ marginLeft: 16 }}>{total.b_auditor}</span></Col>
                                                </Row>
                                            </div>
                                        )
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="业务沟通" key="3">
                            <div>
                                {
                                    isEdit ?
                                        (
                                            <div>
                                                <Form>
                                                    <Row>
                                                        <Col span={12}>
                                                            <Card title={<span style={{ fontSize: '14px' }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '14px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0px 10px 0 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>业务发起相关信息及文档</Text>
                                                            </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                                <div style={{ marginTop: -10, marginBottom: 10 }}>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0px 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>邮件、短信或其他信息</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_business1', {
                                                                            initialValue: link_info,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC', marginBottom: 10 }} strong>发起文档等材料</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_business2', {
                                                                            initialValue: docs,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                            <Card title={<span style={{ fontSize: '14px' }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '14px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 0 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>业务完成信息及文档</Text>
                                                            </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                                <div style={{ marginTop: -10 }}>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>邮件、短信或其他信息</Text>

                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_finish1', {
                                                                            initialValue: b_link_info,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>完成文档等材料</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_finish2', {
                                                                            initialValue: f_docs,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Card title={<span style={{ fontSize: '14px' }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '14px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 0 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>真实交易记录材料</Text>
                                                            </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                                <div style={{ marginTop: -10 }}>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>记账凭证记录</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_record1', {
                                                                            initialValue: f_record,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>银行流水记录</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_record2', {
                                                                            initialValue: b_record,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div style={{
                                                                        width: '4px',
                                                                        height: '4px',
                                                                        background: 'rgba(20,124,236,1)',
                                                                        borderRadius: '2px',
                                                                        display: 'inline-block',
                                                                        margin: '0 10px 3px 0'
                                                                    }} />
                                                                    <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>交易账册记录</Text>
                                                                    <div style={{ marginTop: 10, marginLeft: 14, marginBottom: 10 }}>
                                                                        {getFieldDecorator('contract_record3', {
                                                                            initialValue: s_record,
                                                                            rules: []
                                                                        })(<MulText picnum={99}></MulText>)}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                        )
                                        :
                                        (
                                            <div>
                                                <Row>
                                                    <Col span={12}>
                                                        <Card title={<span style={{ fontSize: '14px' }}>
                                                            <div style={{
                                                                width: '4px',
                                                                height: '14px',
                                                                background: 'rgba(20,124,236,1)',
                                                                borderRadius: '2px',
                                                                display: 'inline-block',
                                                                margin: '0 10px 0 0'
                                                            }} />
                                                            <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>业务发起相关信息及文档</Text>
                                                        </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                            <div style={{ marginTop: -10 }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>邮件、短信或其他信息</Text>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    {
                                                                        link_info.map((value, key) => {
                                                                            let v = value;
                                                                            value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                            //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                            return (
                                                                                <Row key={key}>
                                                                                    <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                    <Col span={3}>
                                                                                        <SFile file={v}></SFile>
                                                                                    </Col>
                                                                                </Row>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400 }} strong>发起文档等材料</Text>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    {
                                                                        docs.map((value, key) => {
                                                                            let v = value;
                                                                            value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                            //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                            return (
                                                                                <Row key={key}>
                                                                                    <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                    <Col span={3}>
                                                                                        <SFile file={v}></SFile>
                                                                                    </Col>
                                                                                </Row>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Card>
                                                        <Card title={<span style={{ fontSize: '14px' }}>
                                                            <div style={{
                                                                width: '4px',
                                                                height: '14px',
                                                                background: 'rgba(20,124,236,1)',
                                                                borderRadius: '2px',
                                                                display: 'inline-block',
                                                                margin: '0 10px 0 0'
                                                            }} />
                                                            <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>业务完成信息及文档</Text>
                                                        </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                            <div style={{ marginTop: -10 }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>邮件、短信或其他信息</Text>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    {
                                                                        b_link_info.map((value, key) => {
                                                                            let v = value;
                                                                            value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                            //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                            return (
                                                                                <Row key={key}>
                                                                                    <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                    <Col span={3}>
                                                                                        <SFile file={v}></SFile>
                                                                                    </Col>
                                                                                </Row>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>完成文档等材料</Text>

                                                                {
                                                                    f_docs.map((value, key) => {
                                                                        let v = value;
                                                                        value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                        //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                        return (
                                                                            <Row key={key}>
                                                                                <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                <Col span={3}>
                                                                                    <SFile file={v}></SFile>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Card title={<span style={{ fontSize: '14px' }}>
                                                            <div style={{
                                                                width: '4px',
                                                                height: '14px',
                                                                background: 'rgba(20,124,236,1)',
                                                                borderRadius: '2px',
                                                                display: 'inline-block',
                                                                margin: '0 10px 0 0'
                                                            }} />
                                                            <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 600, fontFamily: 'PingFangSC-Semibold,PingFang SC' }} strong>真实交易记录材料</Text>
                                                        </span>} bordered={false} headStyle={{ border: 'none' }}>
                                                            <div style={{ marginTop: -10 }}>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>记账凭证记录</Text>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    {
                                                                        f_record.map((value, key) => {
                                                                            let v = value;
                                                                            value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                            //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                            return (
                                                                                <Row key={key}>
                                                                                    <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                    <Col span={3}>
                                                                                        <SFile file={v}></SFile>
                                                                                    </Col>
                                                                                </Row>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>银行流水记录</Text>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    {
                                                                        b_record.map((value, key) => {
                                                                            let v = value;
                                                                            value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                            //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                            return (
                                                                                <Row key={key}>
                                                                                    <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                    <Col span={3}>
                                                                                        <SFile file={v}></SFile>
                                                                                    </Col>
                                                                                </Row>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div style={{
                                                                    width: '4px',
                                                                    height: '4px',
                                                                    background: 'rgba(20,124,236,1)',
                                                                    borderRadius: '2px',
                                                                    display: 'inline-block',
                                                                    margin: '0 10px 3px 0'
                                                                }} />
                                                                <Text style={{ color: 'rgba(0,0,0,0.85)', lineHeight: '22px', fontWeight: 400, fontFamily: 'PingFangSC-Regular,PingFang SC' }} strong>交易账册记录</Text>

                                                                {
                                                                    s_record.map((value, key) => {
                                                                        let v = value;
                                                                        value = value.substring(value.lastIndexOf('/', value.lastIndexOf('/')) + 15);
                                                                        //value = value.substring(value.lastIndexOf('.', value.lastIndexOf('.') - 1) + 1);
                                                                        return (
                                                                            <Row key={key}>
                                                                                <Col span={14} style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 10, marginLeft: 13 }}><span>{value}</span></Col>
                                                                                <Col span={3}>
                                                                                    <SFile file={v}></SFile>
                                                                                </Col>
                                                                            </Row>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                }
                            </div>
                        </TabPane>
                        <TabPane tab="交付信息" key="4">
                            <div>
                                {
                                    isEdit ?
                                        (
                                            <div>
                                                <Form>
                                                    <Row gutter={16}>
                                                        <Col span={6} >
                                                            <Form.Item label="完成时间" style={{ marginLeft: 16 }}>
                                                                {getFieldDecorator('delivery_date', {
                                                                    initialValue: total.f_time ? moment(total.f_time) : ''
                                                                })(
                                                                    <DatePicker style={{ width: '100%' }} />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={2}>
                                                            <Form.Item label="收款方及银行流水">
                                                                {getFieldDecorator('bank_water', {
                                                                    initialValue: total.receive_b_record
                                                                })(
                                                                    <Select placeholder="请选择是否收款方及银行流水"  allowClear={true} >
                                                                        <Option value="1">是</Option>
                                                                        <Option value="0">否</Option>
                                                                    </Select>
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6} push={4}>
                                                            <Form.Item label="争议事项">
                                                                {getFieldDecorator('controversial_issues', {
                                                                    initialValue: total.dispute_item
                                                                })(
                                                                    <TextArea placeholder="如有争议，请说明" autosize  />,
                                                                )}
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                                <Card title={<span style={{ fontSize: '14px', marginLeft: 16 }}>
                                                    <div style={{
                                                        width: '4px',
                                                        height: '14px',
                                                        background: 'rgba(20,124,236,1)',
                                                        borderRadius: '2px',
                                                        display: 'inline-block',
                                                        margin: '0 10px 0 0'
                                                    }} />
                                                    <Text style={{ color: '#000000' }} strong>对方联系方式</Text>
                                                </span>}
                                                    bordered={false} extra={<Button type="link" onClick={this.showContactModal} style={{ color: '#539E00' }}>添加新联系方式</Button>}
                                                    headStyle={{ padding: '0' }}
                                                >
                                                    {
                                                        c2.map((value, key) => {
                                                            return (
                                                                <Row type="flex" justify="space-around" align="middle" key={key}>
                                                                    <Col span={3}><span style={{ color: '#AFADAC' }}>姓名：</span><span>{value.name}</span></Col>
                                                                    <Col span={6}><span style={{ color: '#AFADAC' }}>联系电话：</span><span>{value.phone}</span></Col>
                                                                    <Col span={12}><span style={{ color: '#AFADAC' }}>联系地址：</span><span>{value.address}</span></Col>
                                                                    <Col span={3}><Button type="link" style={{ color: '#9B9B9B' }} onClick={this.deleteContact.bind(this, value.name)}>删除</Button></Col>
                                                                </Row>
                                                            );
                                                        })
                                                    }
                                                </Card>
                                                <div>
                                                    <Modal
                                                        title="添加联系方式"
                                                        visible={this.state.contactVisible}
                                                        closable={false}
                                                        footer={null}
                                                    >
                                                        <ContractAddContact getContactData={this.getContactData} handleContactCancel={this.handleContactCancel} />
                                                    </Modal>
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div>
                                                <Row>
                                                    <Col span={8}><span style={{ color: '#AFADAC', marginLeft: 16 }}>完成时间</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>收款方及银行流水</span></Col>
                                                    <Col span={8}><span style={{ color: '#AFADAC' }}>争议事项</span></Col>
                                                </Row>
                                                <Row style={{ marginTop: '10px' }}>
                                                    <Col span={8}><span style={{ marginLeft: 16 }}>{total.f_time ? moment(total.f_time).format('YYYY.MM.DD') : ''}</span></Col>
                                                    <Col span={8}><span>{total.receive_b_record === '1' ? '是' : total.receive_b_record === '1' ? '否' : ''}</span></Col>
                                                    <Col span={8}><span>{total.dispute_item}</span></Col>
                                                </Row>
                                                <Card title={<span style={{ fontSize: '14px', marginLeft: 10 }}>
                                                    <div style={{
                                                        width: '4px',
                                                        height: '10px',
                                                        background: 'rgba(20,124,236,1)',
                                                        borderRadius: '2px',
                                                        display: 'inline-block',
                                                        margin: '0 10px 0 0'
                                                    }} />
                                                    <Text style={{ color: '#000000' }} strong>对方联系方式</Text></span>}
                                                    bordered={false}
                                                    headStyle={{ padding: '0' }}
                                                >
                                                    {
                                                        c1.map((value, key) => {
                                                            return (
                                                                <Row type="flex" justify="start" align="middle" key={key} >
                                                                    <Col span={6}><span style={{ color: '#AFADAC' }}>姓名：</span><span>{value.name}</span></Col>
                                                                    <Col span={6}><span style={{ color: '#AFADAC' }}>联系电话：</span><span>{value.phone}</span></Col>
                                                                    <Col span={12}><span style={{ color: '#AFADAC' }}>联系地址：</span><span>{value.address}</span></Col>
                                                                </Row>
                                                            );
                                                        })
                                                    }
                                                </Card>
                                            </div>
                                        )
                                }
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}

export default total_detail;