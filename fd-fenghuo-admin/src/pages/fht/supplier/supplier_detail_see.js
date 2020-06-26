import React, { PureComponent } from 'react';
import styles from './supplier_list.css';
import { Card, Row, Col, Typography, Table, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

const { Text } = Typography;

@connect(({ common_model, supplier_model }) => ({
    supplierDetail: supplier_model.supplierDetail,
}))

class supplier_details_see extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {};

    render() {
        const { supplierDetail } = this.props;
        // 生命周期, 防止没有加载.
        const provider = supplierDetail.provider || {};
        const xzhmd = supplierDetail.xzhmd || {};
        const zxgg = supplierDetail.zxgg || {};
        const shixin = supplierDetail.shixin || {};
        const bgt = supplierDetail.bgt || {};

        const columns_xzhmd = [
            {
                title: '受惩黑名单ID',
                dataIndex: 'entryId',
                key: 'entryId',
                width: "30%",
            },
            {
                title: '内容概要',
                dataIndex: 'body',
                key: 'body',
                width: "30%",
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: "20%",
            },
            {
                title: '发布时间',
                dataIndex: 'sortTime',
                key: 'sortTime',
                width: "20%",
                render: sortTime => (
                    <span>
                        {
                            moment(sortTime).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
        ];

        const columns_zxgg = [
            {
                title: '执行公告ID',
                dataIndex: 'entryId',
                key: 'entryId',
                width: "30%",
            },
            {
                title: '内容概要',
                dataIndex: 'body',
                key: 'body',
                width: "30%",
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: "20%",
            },
            {
                title: '发布时间',
                dataIndex: 'sortTime',
                key: 'sortTime',
                width: "20%",
                render: sortTime => (
                    <span>
                        {
                            moment(sortTime).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
        ];

        const columns_shixin = [
            {
                title: '失信公告ID',
                dataIndex: 'entryId',
                key: 'entryId',
                width: "30%",
            },
            {
                title: '内容概要',
                dataIndex: 'body',
                key: 'body',
                width: "30%",
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: "20%",
            },
            {
                title: '决定时间',
                dataIndex: 'sortTime',
                key: 'sortTime',
                width: "20%",
                render: sortTime => (
                    <span>
                        {
                            moment(sortTime).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
        ];

        const columns_bgt = [
            {
                title: '曝光台ID',
                dataIndex: 'entryId',
                key: 'entryId',
                width: "30%",
            },
            {
                title: '内容概要',
                dataIndex: 'body',
                key: 'body',
                width: "30%",
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                width: "20%",
            },
            {
                title: '决定时间',
                dataIndex: 'sortTime',
                key: 'sortTime',
                width: "20%",
                render: sortTime => (
                    <span>
                        {
                            moment(sortTime).format('YYYY-MM-DD')
                        }
                    </span>
                )
            },
        ];
        return (
            <div>
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
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <Row type="flex" justify="space-around" align="middle" gutter={16}>
                        <Col span={24}>
                            <p style={{ fontSize: 15 }}><b>{provider.name}</b></p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            <label className={styles.title_style}>企业注册号：</label><label>{provider.reg_code}</label>
                        </Col>
                        <Col span={6}>
                            <label className={styles.title_style}>是否合法企业：</label><label>{provider.is_legal === '0' ? '是' : '否'}</label>
                        </Col>
                        <Col span={6}>
                            <label className={styles.title_style}>供应商评分：</label><label>{provider.score}分</label>
                        </Col>
                        <Col span={6}>
                            <label className={styles.title_style}>更新日期：</label><label>{moment(provider.ent_update_time).format('YYYY-MM-DD')}</label>
                        </Col>
                    </Row>
                </Card>
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
                        <Text style={{ color: '#000000' }} strong>企业注册登记风险</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <Row type="flex" justify="start" align="middle" gutter={16}>
                        <Col span={6}>
                            <label className={styles.title_style}>企业注册日期：</label>
                            <Text type={((moment(moment().valueOf() - moment(provider.reg_date).valueOf()).format('YYYY')) - 1970) >= 2 ? '' : 'danger'}>{moment(provider.reg_date).format('YYYY-MM-DD')}</Text>
                        </Col>
                        <Col span={6}>
                            <label className={styles.title_style}>企业注册资本：</label>
                            <Text type={provider.reg_capital - 100 >= 0 ? '' : 'danger'}>{provider.reg_capital > 0 ? parseFloat(provider.reg_capital) : 0}万</Text>
                        </Col>
                    </Row>
                </Card>
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
                        <Text style={{ color: '#000000' }} strong>受惩黑名单</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <Table rowKey={record => record.entryId} columns={columns_xzhmd} dataSource={xzhmd.list} />
                </Card>
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
                        <Text style={{ color: '#000000' }} strong>法院执行公告</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <Table rowKey={record => record.entryId} columns={columns_zxgg} dataSource={zxgg.list} />
                </Card>
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
                        <Text style={{ color: '#000000' }} strong>法院失信公告</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ marginTop: '10px' }}
                >
                    <Table rowKey={record => record.entryId} columns={columns_shixin} dataSource={shixin.list} />
                </Card>
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
                        <Text style={{ color: '#000000' }} strong>曝光台</Text>
                    </span>
                </Row>
                <Card
                    bordered={false}
                    bodyStyle={{
                        boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                        borderRadius: '7px',
                    }}
                    style={{ margin: '10px 0 40px 0' }}
                >
                    <Table rowKey={record => record.entryId} columns={columns_bgt} dataSource={bgt.list} />
                </Card>
            </div>

        )
    }
}

export default supplier_details_see;



