import React from 'react';
import { connect } from 'dva';
import { Tabs, Select } from 'antd';
import styles from './risk_list.css';
import router from 'umi/router';

//引入解析token的方法
import jwt_decode from 'jwt-decode';
import util from '../../../utils/util';

import RiskVisualCenter from './risk_visual_center';
import RiskIndustryEvaluation from './risk_industry_evaluation';
import RiskMarketList from './risk_market_list';
import RiskTaxList from './risk_tax_list';

import TotalDetailSee from '../contract/total/total_detail_see';
import BillDetailSee from '../bill/bill_detail_see';
import SupplierDetailSee from '../supplier/supplier_detail_see';
import ProjectDetailSee from '../project/project_detail_see';

import RiskMarketRoleList from './market/risk_market_role_list';
import RiskTaxRoleList from './tax/risk_tax_role_list';
import RiskIndustryRoleEvaluation from './assess/risk_industry_role_evaluation';

const { TabPane } = Tabs;
const { Option } = Select;

@connect(({ risk_model, common_model }) => ({
    contractList: risk_model.contractList,
    invoiceList: risk_model.invoiceList,
    providerList: risk_model.providerList,
    projectList: risk_model.projectList,
    menuRoles: common_model.menuRoles,
}))

class risk_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contract_detail: '',
            invoice_detail: '',
            project_detail: '',
            provider_detail: '',
        };
    }

    componentDidMount() {
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '风控中心', detail: "风控数据可视化中心", href: '' },
                menu: {
                    selectedKeys: ['risk'],
                },
                username: userdata.username,
            }
        });

        //读取本地token，获取到权限,这一步主要是为了解决页面刷新问题
        let token = localStorage.getItem("jwToken") || "";
        if (!util.isEmpty(token)) {
            try {
                const decoded = jwt_decode(token.replace("fdkey ", ""));
                if (!util.isEmpty(decoded)) {
                    dispatch({
                        type: 'common_model/updateState',
                        payload: { menuRoles: decoded.auth || [] }
                    });
                }
            } catch (error) {

            }
        }

        dispatch({
            type: 'risk_model/allContract',
            callback: code => {
                this.setState({
                    code: code,
                });
                if(code === 0){
                    dispatch({
                        type: 'risk_model/allInvoice',
                    });
                    dispatch({
                        type: 'risk_model/allProvider',
                    });
                    dispatch({
                        type: 'risk_model/allProject',
                    });
                }
            }
        });
    }

    // 改变面包屑导航.
    changePage = (key) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '风控中心', detail: key, href: '' },
                menu: {
                    selectedKeys: ['risk'],
                }
            }
        });
        router.push({
            pathname: '/fht/risk/risk_list',
            query: {
                key: key,
            }
        });
    }

    // 改变选择的合同.
    changeContract = (value) => {
        if (value !== undefined) {
            let contract_code = value.split(",")[0];
            let contract_name = value.split(",")[1];
            const { dispatch } = this.props;
            dispatch({
                type: 'contract_model/showDetail',
                payload: {
                    contract_code: contract_code,
                    contract_name: contract_name,
                    company_id: "1",
                },
            });
        }
        this.setState({
            contract_detail: value,
            invoice_detail: '',
            project_detail: '',
            provider_detail: '',
        });
    }

    // 改变选择的票据.
    changeInvoice = (value) => {
        if (value !== undefined) {
            let invoice_code = value.split(",")[0];
            let invoice_no_short = value.split(",")[1];
            const { dispatch } = this.props;
            dispatch({
                type: 'bill_model/queryDataOneList',
                payload: {
                    invoice_code: invoice_code,
                    invoice_no_short: invoice_no_short,
                }
            });
        }
        this.setState({
            contract_detail: '',
            invoice_detail: value,
            project_detail: '',
            provider_detail: '',
        });
    }

    // 改变选择的项目.
    changeProject = (value) => {
        if (value !== undefined) {
            let project_name = value.split(",")[0];
            let project_code = value.split(",")[1];
            const { dispatch } = this.props;
            dispatch({
                type: 'project_model/showDetail',
                payload: {
                    project_name: project_name,
                    project_code: project_code,
                },
            });
        }
        this.setState({
            contract_detail: '',
            invoice_detail: '',
            project_detail: value,
            provider_detail: '',
        });
    }

    // 改变选择的供应商.
    changeProvider = (value) => {
        if (value !== undefined) {
            let company_name = value;
            const { dispatch } = this.props;
            dispatch({
                type: 'supplier_model/detailDataList',
                payload: { company_name: company_name },
            });
        }
        this.setState({
            contract_detail: '',
            invoice_detail: '',
            project_detail: '',
            provider_detail: value,
        });
    }

    // 验证权限菜单.
    checkRole = (roleList, value) => {
        let retb = false;
        for (var i = 0; i < roleList.length; i++) {
            if (roleList[i].authority == value) {
                retb = true;
                break;
            }
        }
        return retb;
    }

    render() {
        const { checkRole } = this;
        const { contractList, invoiceList, providerList, projectList, menuRoles } = this.props;
        const { contract_detail, invoice_detail, provider_detail, project_detail } = this.state;
        const contract = contractList || [];
        const invoice = invoiceList || [];
        const provider = providerList || [];
        const project = projectList || [];
        return (
            <div>
                <div className={styles.card_container}>
                    <Tabs defaultActiveKey="票据可视化中心">
                        <TabPane tab="票据可视化中心" key="票据可视化中心">
                            <Select
                                showSearch
                                style={{ width: '100%', margin: '0 0 15px 0' }}
                                showArrow={false}
                                onChange={this.changeInvoice}
                                size="large"
                                placeholder="请输入发票号码、供应商名称、合同名称"
                                optionFilterProp="children"
                                allowClear={true}
                            >
                                {
                                    invoice.map((value, key) => {
                                        return <Option key={key} className={styles.select_content_font} value={value.invoice_code + "," + value.invoice_no_short}>
                                            {value.invoice_no_short + "\xa0\xa0\xa0"}
                                            <span style={{ color: '#DFDFDF' }}>|</span>
                                            {"\xa0\xa0\xa0" + (value.invoice_type === '01' ? '增值税专用发票' : value.invoice_type === '04' ?
                                                '增值税普通发票' : value.invoice_type === '10' ? '增值税普通发票(电子)' : '增值税普通发票(卷式)')
                                                + "\xa0\xa0\xa0"}
                                            <span style={{ color: '#DFDFDF' }}>|</span>
                                            {"\xa0\xa0\xa0" + value.s_name + "\xa0\xa0\xa0"}
                                            {value.contract_name ? <span style={{ color: '#DFDFDF' }}>|</span> : ''}
                                            {(value.contract_name ? "\xa0\xa0\xa0" + value.contract_name : '')}
                                        </Option>
                                    })
                                }
                            </Select>
                        </TabPane>
                        <TabPane tab="合同可视化中心" key="合同可视化中心">
                            <Select
                                showSearch
                                style={{ width: '100%', margin: '0 0 15px 0' }}
                                showArrow={false}
                                onChange={this.changeContract}
                                size="large"
                                placeholder="请输入合同编号、合同名称、供应商名称"
                                optionFilterProp="children"
                                allowClear={true}
                            >
                                {
                                    contract.map((value, key) => {
                                        return <Option key={key} className={styles.select_content_font} value={value.contract_code + "," + value.name}>
                                            {value.contract_code + "\xa0\xa0\xa0"}
                                            <span style={{ color: '#DFDFDF' }}>|</span>
                                            {"\xa0\xa0\xa0" + value.name + "\xa0\xa0\xa0"}
                                            {value.s_name ? <span style={{ color: '#DFDFDF' }}>|</span> : ''}
                                            {(value.s_name ? "\xa0\xa0\xa0" + value.s_name : '')}
                                        </Option>
                                    })
                                }
                            </Select>
                        </TabPane>
                        <TabPane tab="项目可视化中心" key="项目可视化中心">
                            <Select
                                showSearch
                                style={{ width: '100%', margin: '0 0 15px 0' }}
                                showArrow={false}
                                onChange={this.changeProject}
                                size="large"
                                placeholder="请输入项目名称"
                                optionFilterProp="children"
                                allowClear={true}
                            >
                                {
                                    project.map((value, key) => {
                                        return <Option key={key} className={styles.select_content_font} value={value.project_name + ',' +  value.project_code}>
                                            {
                                                value.project_name
                                            }
                                        </Option>
                                    })
                                }
                            </Select>
                        </TabPane>
                        <TabPane tab="供应商可视化中心" key="供应商可视化中心">
                            <Select
                                showSearch
                                style={{ width: '100%', margin: '0 0 15px 0' }}
                                showArrow={false}
                                onChange={this.changeProvider}
                                size="large"
                                placeholder="请输入供应商名称"
                                optionFilterProp="children"
                                allowClear={true}
                            >
                                {
                                    provider.map((value, key) => {
                                        return <Option key={key} className={styles.select_content_font} value={value.company_name}>
                                            {
                                                value.company_name
                                            }
                                        </Option>
                                    })
                                }
                            </Select>
                        </TabPane>
                    </Tabs>
                </div>
                {/* 为组件添加一个唯一的key值, 每次重新加载 */}
                {
                    contract_detail ? <TotalDetailSee key={contract_detail} />
                        :
                        (
                            invoice_detail ? <BillDetailSee key={invoice_detail} />
                                :
                                (
                                    provider_detail ? <SupplierDetailSee key={provider_detail} />
                                        :
                                        project_detail ? <ProjectDetailSee />
                                            :
                                            (
                                                <div className={styles.card_container} style={{ margin: '20px 0 40px 0' }}>
                                                    <Tabs defaultActiveKey={this.props.location.query.key} onChange={this.changePage} type="card" style={{ margin: '20px 0 0 0' }}>
                                                        <TabPane tab="风控数据可视化中心" key="风控数据可视化中心">
                                                            <RiskVisualCenter />
                                                        </TabPane>
                                                        <TabPane tab="市场监管违法案例检索" key="市场监管违法案例检索">
                                                            {checkRole(menuRoles, "ROLE_ADMIN") && <RiskMarketRoleList />}
                                                            {!checkRole(menuRoles, "ROLE_ADMIN") && <RiskMarketList />}
                                                        </TabPane>
                                                        <TabPane tab="税收违法案例检索" key="税收违法案例检索">
                                                            {checkRole(menuRoles, "ROLE_ADMIN") && <RiskTaxRoleList />}
                                                            {!checkRole(menuRoles, "ROLE_ADMIN") && <RiskTaxList />}
                                                        </TabPane>
                                                        <TabPane tab="行业评估" key="行业评估">
                                                            {checkRole(menuRoles, "ROLE_ADMIN") && <RiskIndustryRoleEvaluation />}
                                                            {!checkRole(menuRoles, "ROLE_ADMIN") && <RiskIndustryEvaluation />}
                                                        </TabPane>
                                                    </Tabs>
                                                </div>
                                            )
                                )
                        )
                }
            </div >
        );
    }
}

export default risk_list;