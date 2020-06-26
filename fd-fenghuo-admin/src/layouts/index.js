import styles from './index.css';
import React from 'react';
import { Layout, Menu, Breadcrumb, ConfigProvider, Row, Col, Button } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import zhCN from 'antd/es/locale/zh_CN';
import 'ant-design-pro/dist/ant-design-pro.css'; // 统一引入样式.
import logo from '../assets/编组 10.svg';
import authutil from '../utils/authutil';
//引入解析token的方法
import jwt_decode from 'jwt-decode'
import util from '../utils/util';
import ReactCanvasNest from 'react-canvas-nest';
const { SubMenu } = Menu;

@connect(({ common_model }) => ({
    breadcrumb: common_model.breadcrumb,
    menu: common_model.menu,
    username: common_model.username,
    menuRoles: common_model.menuRoles,
}))

class BasicLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
        };
    }

    componentWillMount() {
        const { dispatch } = this.props;
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
    }

    menuOpenChange = (openKeys) => {
        const { dispatch, menu } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                menu: {
                    selectedKeys: menu.selectedKeys
                }
            }
        });
    }

    // 验证权限菜单.checkRole(menuRoles, "ROLE_ADMIN")
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
        const { Header, Content, Sider, Footer } = Layout;
        const props = this.props;
        const {
            breadcrumb, menu, username, menuRoles
        } = this.props;
        const { checkRole } = this;
        if (props.location.pathname.indexOf('fht/auth/login') > -1 || props.location.pathname.indexOf('fht/auth/login') > -1) {
            return (<ConfigProvider locale={zhCN}><Layout style={{ background: "transparent" }}>{props.children}</Layout></ConfigProvider>);
        } else {
            return (
                <ConfigProvider locale={zhCN} >
                <div><ReactCanvasNest className = "canvasNest" config = {{ pointColor: '20,124,236 ',lineColor:'20,124,236',pointR:0.5,count:70 }} style={{zIndex:1,opacity:'0.8'}} />
                    <Layout style={{ height: '100vh' }}>
                        <Header className={styles.fht_header} >
                            <Link to="/fht/risk/risk_list">
                                <Row>
                                    <Col span={18} >
                                        <div className={styles.fdDiv1}>
                                            <img className={styles.fdlogo} src={logo} />
                                        </div>
                                        {/* <div className={styles.fdDiv2}>
                                            <span className={styles.fht_font}>财税法合规AI大数据平台</span><br></br>
                                            <span className={styles.fht_remark}>FHT  Fiscal  and  Tax  Law  AI  Big  Data  Platform</span>
                                        </div> */}
                                    </Col>
                                    <Col span={6} style={{ textAlign: 'right' }}>
                                        <div className={styles.fdDiv3}>
                                            <span className={styles.fht_company}>欢迎您，{username}！</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                        </Header>
                        <Layout>
                            <Sider style={{ background: '#fff', overflow: 'auto',zIndex:99  }}>
                                {
                                    !checkRole(menuRoles, "ROLE_DIRECTOR") && (
                                        <Menu
                                            mode="inline"
                                            selectedKeys={menu.selectedKeys}
                                            onOpenChange={this.menuOpenChange}
                                            style={{ height: '100%' }}
                                        >
                                            <Menu.Item key="risk">
                                                <Link to="/fht/risk/risk_list"><span className={styles.fht_menu_font}>风控中心</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="control_center">
                                                <Link to="/fht/control_center/control_center_list"><span className={styles.fht_menu_font}>业务处理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="bill">
                                                <Link to="/fht/bill/bill_list"><span className={styles.fht_menu_font}>票据管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="contract">
                                                <Link to="/fht/contract/contract_list"><span className={styles.fht_menu_font}>合同管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="project">
                                                <Link to="/fht/project/project_list"><span className={styles.fht_menu_font}>项目管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="supplier">
                                                <Link to="/fht/supplier/supplier_list"><span className={styles.fht_menu_font}>供应商管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="system">
                                                <Link to="/fht/system/system_list"><span className={styles.fht_menu_font}>风控设置</span></Link>
                                            </Menu.Item>
                                            <SubMenu key="systemManagement" title={<span className={styles.fht_menu_font}>系统设置</span>}>
                                                <Menu.Item key="department">
                                                    <Link to="/fht/systemManagement/department/department_list"><span className={styles.fht_menu_font}>组织部门管理</span></Link>
                                                </Menu.Item>
                                                {/* <Menu.Item key="role">
                                            <Link to="/fht/systemManagement/role/role_list"><span className={styles.fht_menu_font}>角色管理</span></Link>
                                        </Menu.Item> */}
                                                <Menu.Item key="personnel">
                                                    <Link to="/fht/systemManagement/personnel/personnel_list"><span className={styles.fht_menu_font}>人员管理</span></Link>
                                                </Menu.Item>
                                                <Menu.Item key="projectTag">
                                                    <Link to="/fht/systemManagement/projectTag/projectTag_list"><span className={styles.fht_menu_font}>项目标签</span></Link>
                                                </Menu.Item>
                                                <Menu.Item key="contractTag">
                                                    <Link to="/fht/systemManagement/contractTag/contractTag_list"><span className={styles.fht_menu_font}>合同标签</span></Link>
                                                </Menu.Item>
                                                <Menu.Item key="reimburseType">
                                                    <Link to="/fht/systemManagement/reimburseType/reimburseType_list"><span className={styles.fht_menu_font}>报销类别</span></Link>
                                                </Menu.Item>
                                            </SubMenu>
                                            <Menu.Item key="logout">
                                                <Button type="link" onClick={authutil.logout} style={{ padding: '0', marginLeft: '-1px' }}>
                                                    <span className={styles.fht_menu_logout_font}>退出账户</span>
                                                </Button>
                                            </Menu.Item>
                                        </Menu>
                                    )
                                }
                                {
                                    checkRole(menuRoles, "ROLE_DIRECTOR") && (
                                        <Menu
                                            mode="inline"
                                            selectedKeys={menu.selectedKeys}
                                            onOpenChange={this.menuOpenChange}
                                            style={{ height: '100%' }}
                                        >
                                            <Menu.Item key="bill">
                                                <Link to="/fht/bill/bill_list"><span className={styles.fht_menu_font}>票据管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="contract">
                                                <Link to="/fht/contract/contract_list"><span className={styles.fht_menu_font}>合同管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="project">
                                                <Link to="/fht/project/project_list"><span className={styles.fht_menu_font}>项目管理</span></Link>
                                            </Menu.Item>
                                            <Menu.Item key="logout">
                                                <Button type="link" onClick={authutil.logout} style={{ padding: '0', marginLeft: '-1px' }}>
                                                    <span className={styles.fht_menu_logout_font}>退出账户</span>
                                                </Button>
                                            </Menu.Item>
                                        </Menu>
                                    )
                                }
                            </Sider>
                            <Layout className={styles.fht_contains}>
                                <Breadcrumb style={{ margin: '0 0 20px 0' ,zIndex:99}}>
                                    <Breadcrumb.Item href="/bfht">首页</Breadcrumb.Item>
                                    {
                                        breadcrumb.href === '' ? (<Breadcrumb.Item>{breadcrumb.name}</Breadcrumb.Item>) : (<Breadcrumb.Item href={breadcrumb.href}>{breadcrumb.name}</Breadcrumb.Item>)
                                    }
                                    {
                                        breadcrumb.href01 === '' ? (<Breadcrumb.Item>{breadcrumb.name01}</Breadcrumb.Item>) : (<Breadcrumb.Item href={breadcrumb.href01}>{breadcrumb.name01}</Breadcrumb.Item>)
                                    }
                                    {
                                        breadcrumb.href02 === '' ? (<Breadcrumb.Item>{breadcrumb.name02}</Breadcrumb.Item>) : (<Breadcrumb.Item href={breadcrumb.href02}>{breadcrumb.name02}</Breadcrumb.Item>)
                                    }
                                    {
                                        breadcrumb.href03 === '' ? (<Breadcrumb.Item>{breadcrumb.name03}</Breadcrumb.Item>) : (<Breadcrumb.Item href={breadcrumb.href03}>{breadcrumb.name03}</Breadcrumb.Item>)
                                    }
                                    {
                                        breadcrumb.href04 === '' ? (<Breadcrumb.Item>{breadcrumb.name04}</Breadcrumb.Item>) : (<Breadcrumb.Item href={breadcrumb.href04}>{breadcrumb.name04}</Breadcrumb.Item>)
                                    }
                                    <Breadcrumb.Item>{breadcrumb.detail}</Breadcrumb.Item>
                                </Breadcrumb>
                                <Content
                                    className={styles.fht_content}
                                >
                                    {props.children}
                                </Content>
                            </Layout>
                        </Layout>
                        <Footer className={styles.fht_footer}>
                            <Row className={styles.fht_footer_font}>
                                <span style={{ float: 'left' }}>version 3.1</span>
                                Copyright 2018-2019 上海潜竹信息科技有限公司 版权所有 沪ICP备15040140号-2
                            {/* <Col span={8} className={styles.fht_footer_font}>全国服务热线-400 882 1119     地址：上海市长宁区金钟路631弄新虹桥中央大厦</Col> */}
                            </Row>
                        </Footer>
                    </Layout >
                    </div>
                </ConfigProvider>
            );
        }
    }
}

export default BasicLayout;