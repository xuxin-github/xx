import React, { PureComponent } from 'react';
import styles from './bill_list.css';
import { Form, Button, Card, Modal, Select, Row, Col, Typography } from 'antd';
import { connect } from 'dva';
import FreeScrollBar from 'react-free-scrollbar';
import ContractChange from './bill_form/contract_change';
import { BackTop } from 'antd';
import moment from 'moment';
import router from 'umi/router';
const { Option } = Select;
const { Text } = Typography;

@connect(({ bill_model, contract_model, project_model }) => ({
    bill_details: bill_model.bill_details,
    auditModelShow: bill_model.auditModelShow,
    invoice_code: bill_model.invoice_code
}))
@Form.create()
class bill_details extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            select_value: ''  // 关联合同时下拉框的值            
        };
    }

    componentDidMount() {
        const { dispatch, location } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '进项发票管理', detail: '票据详情', href: "/bfht/fht/bill/bill_list.html" },
                menu: {
                    selectedKeys: ['bill'],
                }
            }
        });
        dispatch({
            type: 'bill_model/queryDataOneList',
            payload: {
                invoice_code: location.query.invoice_code,
                invoice_no_short: location.query.invoice_no_short
            }
        });
    };

    // 打开页面对话框
    auditModelOpen = (s_name, invoice_no) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/updateState',
            payload: { "auditModelShow": true }
        });
    };

    // 变更关联.
    auditModelOk = (value, contract_before_code, invoice_code, invoice_no_short, s_name) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/updateInvoiceContract',
            payload: { value, contract_before_code, invoice_code, invoice_no_short, s_name }
        });
    };

    // 关闭页面对话框
    auditModelClose = e => {
        const { dispatch } = this.props;
        dispatch({
            type: 'bill_model/updateState',
            payload: { "auditModelShow": false }
        });
    };

    // 跳转到相关合同
    linkToSupplier = (name, code) => {
        // 使用router以url传参，避免页面刷新导致访问不到数据,在详情页面去取值，然后传给model
        router.push({
            pathname: '/fht/contract/total/total_detail',
            query: {
                contract_code: code,
                contract_name: name,
                company_id: "1",
            },
        });
    }

    // 跳转到相关项目
    linkTosubject = (project_name, project_code) => {
        router.push({
            pathname: '/fht/project/project_detail',
            query: {
                project_name: project_name,
                project_code: project_code,
            },
        });
    }

    // 跳转到相关报销.
    linkToReimburse = (reimburse_code) => {
        router.push({
            pathname: '/fht/project/reimburse/reimburse_detail',
            query: {
                id: reimburse_code,
            },
        });
    }

    // 转换
    changePrice = () => {
        // 转换大小写   
        const { bill_details } = this.props;
        const bd_list = bill_details.invoice || [];
        var num = bd_list.amout;
        var strOutput = "",
            strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0) {
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        }
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i = 0; i < num.length; i++) {
            strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
        }
        return strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    }

    render() {

        const { auditModelShow, bill_details } = this.props;
        const bd_list = bill_details.invoice || [];
        const servicesList = bill_details.services || [];


        return (
            <div>
                <div>              
                    <Row>
                        <Button style={{ float: 'right', margin: '0 12px' }} onClick={() => router.goBack()}>返 回</Button>
                    </Row>
                    <Row style={{ marginTop: '23px' }}>
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
                        {/* <Button type="link" style={{ float: 'right' }} onClick={this.auditModelOpen}>合同关联变更</Button> */}
                    </Row>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ margin: '20px 0 0 0' }}
                    >
                        <Row type="flex" align="middle" gutter={16}>
                            {bd_list.reimburse_code && bd_list.audit_status == '1' ?
                                <Col span={6}>
                                    <label className={styles.title_style}>关联报销：</label><Button type='link' onClick={this.linkToReimburse.bind(this, bd_list.reimburse_code)}>{bd_list.reimburse_code}</Button>
                                </Col> : <Col span={6}>
                                    <label className={styles.title_style}>关联报销：</label><span>--</span>
                                </Col>
                            }

                            {bd_list.contract_name && bd_list.audit_status == '1' ?
                                <Col span={6}>
                                    <label className={styles.title_style}>关联合同：</label><Button type='link' onClick={this.linkToSupplier.bind(this, bd_list.contract_name, bd_list.contract_code)}>{bd_list.contract_name}</Button>
                                </Col> : <Col span={6}>
                                    <label className={styles.title_style}>关联合同：</label><span>--</span>
                                </Col>
                            }

                            {bd_list.project_name ?
                                <Col span={8}>
                                    <label className={styles.title_style}>关联项目：</label><Button type='link' onClick={this.linkTosubject.bind(this, bd_list.project_name, bd_list.project_code)}>{bd_list.project_name}</Button>
                                </Col> : <Col span={8}>
                                    <label className={styles.title_style}>关联项目：</label><span>--</span>
                                </Col>
                            }

                            <Col span={4}>
                                <label className={styles.title_style}>创建日期：</label><label>{moment(bd_list.create_time).format('YYYY.MM.DD')}</label>
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        bordered={false}
                        bodyStyle={{
                            boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                            borderRadius: '7px',
                        }}
                        style={{ margin: '10px 0 40px 0px' }}
                    >
                        <div className={styles.bill_div}>
                            <div>
                                <div>
                                    <Row type="flex" justify="space-around" align="middle" gutter={16} style={{ marginTop: 10, marginBottom: 10 }}>
                                        <Col >
                                            <Row type="flex" justify="center" align="middle" gutter={16} style={{ marginLeft: '4%' }}>
                                                <Col>
                                                    {/**  <img className={styles.bill_img} src={yay} /> */}
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" gutter={16} style={{ marginTop: 3 }}>
                                                <Col>
                                                    <label className={styles.all_title}>机器编号：</label><span>{bd_list.machine_no}</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col >
                                            <div>
                                                <h1 style={{ color: '#D18200', fontSize: 26, textAlign: "center" }}>{bd_list.invoice_type == '01' ? '增值税专用发票' : bd_list.invoice_type == '04' ? '增值税普通发票' : bd_list.invoice_type == '10' ? '增值税普通发票(电子)' : bd_list.invoice_type == '11' ? '增值税普通发票(卷式)' : '--'}</h1>
                                                <div style={{ border: '1px solid rgba(234,144,155,1)', marginTop: 20, width: '22vw' }}></div>
                                                <div style={{ border: '1px solid rgba(234,144,155,1)', marginTop: 3, width: '22vw' }}></div>

                                            </div>
                                        </Col>
                                        <Col >
                                            <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>发票代码： </label><span>{bd_list.invoice_code}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>发票号码： </label><span>{bd_list.invoice_no_short}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" style={{ marginTop: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>开票日期： </label><span>{moment(bd_list.invoice_time).format('YYYY年MM月DD日')}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" gutter={16} style={{ marginTop: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>校&nbsp;&nbsp;验&nbsp; 码： </label><span>{bd_list.check_code}</span>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className={styles.content_div}>
                                    <div className={styles.content_div1}>
                                        <div className={styles.content_div1_1}><br />购<br />买<br />方<br /><br />
                                        </div>
                                        <div className={styles.content_div1_2}>
                                            <Row type="flex" align="middle" style={{ marginTop: 3, marginLeft: 8 }}>
                                                <Col>
                                                    <label className={styles.all_title}>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label><span>{bd_list.b_name}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" style={{ marginTop: 5, marginLeft: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>纳税人识别号：</label><span>{bd_list.b_tax_id}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" style={{ marginTop: 5, marginLeft: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>地址、&nbsp;&nbsp;&nbsp;电话：</label><span>{bd_list.b_link_info}</span>
                                                </Col>
                                            </Row>
                                            <Row type="flex" align="middle" style={{ marginTop: 3, marginLeft: 10 }}>
                                                <Col>
                                                    <label className={styles.all_title}>开户行及账号：</label><span>{bd_list.b_account}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={styles.content_div1_3}><br />密<br />码<br />区<br /><br /></div>
                                        <div className={styles.content_div1_4}>
                                            <Row type="flex" justify='start' align="middle" style={{ marginTop: '5%', marginLeft: '3%', wordWrap: 'break-word' }}>
                                                <Col span={22} >
                                                    <span style={{ marginTop: -20 }}>{bd_list.key_area}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className={styles.content_div2}>                                   
                                        <div className={styles.content_table}>
                                            <div style={{ height: '300px' }}>
                                                <FreeScrollBar style={{ height: "100%" }} autohide={true} fixed={true}>
                                                    <Row type="flex" justify="center" align="middle" style={{ marginTop: '1%' }}>
                                                        <Col span={6} push={1}><label className={styles.all_title}>货物或应税劳务、服务名称</label></Col>
                                                        <Col span={3} push={1}><label className={styles.all_title}>规格型号</label></Col>
                                                        <Col span={2} push={1}><label className={styles.all_title}>单位</label></Col>
                                                        <Col span={2} push={1}><label className={styles.all_title}>数&nbsp;&nbsp;量</label></Col>
                                                        <Col span={3} push={1}><label className={styles.all_title}>单&nbsp;&nbsp;价</label></Col>
                                                        <Col span={3} push={1}><label className={styles.all_title}>金&nbsp;&nbsp;额</label></Col>
                                                        <Col span={2} push={1}><label className={styles.all_title}>税率</label></Col>
                                                        <Col span={3} push={1}><label className={styles.all_title}>税&nbsp;&nbsp;额</label></Col>
                                                    </Row>                                                    
                                                    {
                                                        servicesList.map((value, key) => {
                                                            return (
                                                                <Row type="flex" justify="center" align="middle" key={key} >
                                                                    <Col span={6} push={1} ><label style={{ wordWrap: 'break-word' }}>{value.name ? value.name : value.item}</label></Col>
                                                                    <Col span={3} push={1} ><label style={{ wordWrap: 'break-word' }}>{value.type}</label></Col>
                                                                    <Col span={2} push={1} ><label style={{ wordWrap: 'break-word' }}>{value.unit}</label></Col>
                                                                    <Col span={2} push={1} ><label style={{ wordWrap: 'break-word' }}>{value.count}</label></Col>
                                                                    <Col span={3} push={1} style={{ paddingRight: '20px' }}><label style={{ wordWrap: 'break-word' }} >{value.unit_price}</label></Col>
                                                                    <Col span={3} push={1} style={{ paddingRight: '20px' }}><label style={{ wordWrap: 'break-word' }}>{value.amount}</label></Col>
                                                                    <Col span={2} push={1} ><label style={{ wordWrap: 'break-word' }}>{value.tax_rate}%</label></Col>
                                                                    <Col span={3} push={1} ><label style={{ wordWrap: 'break-word' }} >{value.tax}</label></Col>
                                                                </Row>
                                                            );
                                                        })
                                                    }                                    
                                                </FreeScrollBar>
                                            </div>
                                        </div>
                                        <div className={styles.content_div2}>
                                            <div>
                                                <Row style={{ paddingBottom: '1%', marginTop: '1%', wordWrap: 'break-word' }}>
                                                    <Col span={17} push={2} style={{ marginLeft: '-20px' }}>
                                                        <label className={styles.all_title}>合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</label>
                                                    </Col>
                                                    <Col span={5} style={{ paddingRight: '30px' }}>
                                                        <label style={{ wordWrap: 'break-word' }}>{bd_list.price_amount}</label>
                                                    </Col>
                                                    <Col sapn={2} style={{ width: "8%", float: "left" }}>
                                                        <label style={{ wordWrap: 'break-word' }}>{bd_list.tax_amount}</label>
                                                    </Col>
                                                </Row>
                                            </div>

                                        </div>
                                        
                                       
                                    </div>
                                    <div className={styles.content_div3}>
                                        <div className={styles.content_div3_1}>
                                            <Row type="flex" justify="center" align="middle" style={{ marginTop: '3%', marginBottom: '3%' }}>
                                                <Col>
                                                    <label className={styles.all_title} >价税合计（大写）</label>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div className={styles.content_div3_2}>
                                            <Row type="flex" justify="center" align="middle" style={{ marginTop: '1%', marginBottom: '1%' }}>
                                                <Col span={12} pull={3}>
                                                    <label style={{ letterSpacing: '3px', paddingLeft: 50 }}>{this.changePrice()}</label>
                                                </Col>
                                                <Col span={12} >
                                                    <label className={styles.all_title}>（小写） </label><span>{bd_list.amout}</span>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className={styles.content_div4}>
                                        <div className={styles.content_div4_1}><br />销<br />售<br />方<br /><br />
                                        </div>
                                        <div className={styles.content_div4_2}>
                                            <Row style={{ marginTop: 3, marginLeft: 8 }}>

                                                <label className={styles.all_title}>名&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</label><span>{bd_list.s_name}</span>

                                            </Row>
                                            <Row style={{ marginTop: 5, marginLeft: 10 }}>

                                                <label className={styles.all_title}>纳税人识别号：</label><span>{bd_list.s_tax_id}</span>

                                            </Row>
                                            <Row style={{ marginTop: 5, marginLeft: 10 }}>

                                                <label className={styles.all_title}>地址、&nbsp;&nbsp;&nbsp;电话：</label><span>{bd_list.s_link_info}</span>

                                            </Row>
                                            <Row style={{ marginTop: 3, marginLeft: 10 }}>

                                                <label className={styles.all_title}>开户行及账号：</label><span>{bd_list.s_account}</span>

                                            </Row>
                                        </div>
                                        <div className={styles.content_div4_3}><br />备<br /><br />注<br /><br /></div>
                                        <div className={styles.content_div4_4}>
                                            <Row type="flex" justify='start' align="middle" style={{ marginTop: '5%', marginLeft: '3%', wordWrap: 'break-word' }}>
                                                <Col span={22} >
                                                    <div>{bd_list.remark}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                    <div className={styles.content_div5}></div>
                                </div>
                                <Row type="flex" justify="center" align="middle" gutter={16} style={{ marginTop: 10, marginBottom: 30 }}>
                                    <Col span={5}>
                                        <label className={styles.all_title}>收款人：</label><span>{bd_list.payee}</span>
                                    </Col>
                                    <Col span={5}>
                                        <label className={styles.all_title}>复核：</label><span>{bd_list.recheck}</span>
                                    </Col>
                                    <Col span={5}>
                                        <label className={styles.all_title}>开票人：</label><span>{bd_list.drawer}</span>
                                    </Col>
                                    <Col span={5}>
                                        <label className={styles.all_title}>销售方：（章）</label><span>{bd_list.s_stamp}</span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                    <Modal
                        title="关联设置"
                        visible={auditModelShow}
                        footer={null}
                        closable={false}
                    >
                        <ContractChange
                            auditModelOk={this.auditModelOk}
                            auditModelClose={this.auditModelClose}
                            s_name={bd_list.s_name}
                            contract_before_code={bd_list.contract_code}
                            invoice_code={bd_list.invoice_code}
                            invoice_no_short={bd_list.invoice_no_short}
                            contract_name={bd_list.contract_name}
                        />
                    </Modal>
                </div>
            </div>
        )
    }
}

export default bill_details;



