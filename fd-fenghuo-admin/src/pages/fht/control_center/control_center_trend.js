import React from 'react';
import { Form, Card, Button, Row, Col,Tag } from 'antd';
import { connect } from 'dva';
import styles from './control_center_list.css';
import router from 'umi/router';

// 引入图标组件
import { Chart, Geom, Axis, Tooltip, Legend, Coord, Guide } from 'bizcharts';
const { Line } = Guide;


@connect(({ common_model, control_center_model }) => ({
}))

@Form.create()
class control_center_trend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            managementList: [],
            consultingList: [],
            meetList: [],
            trainList: [],
            travelList: [],
            formalitiesList: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '控制中心', detail: '高风险发票增长趋势', href: "/bfht/fht/control_center/control_center_list.html" },
                menu: {
                    selectedKeys: ['control_center'],
                }
            }
        });
        dispatch({
            type: 'control_center_model/highRiskList',
            payload: { catalog: '01' },
            callback: rs => {
                this.setState({
                    managementList: rs.data,
                });
                if(rs.code === 0){
                    dispatch({
                        type: 'control_center_model/highRiskList',
                        payload: { catalog: '02' },
                        callback: rs => {
                            this.setState({
                                consultingList: rs.data,
                            });
                        }
                    });
                    dispatch({
                        type: 'control_center_model/highRiskList',
                        payload: { catalog: '03' },
                        callback: rs => {
                            this.setState({
                                meetList: rs.data,
                            });
                        }
                    });
                    dispatch({
                        type: 'control_center_model/highRiskList',
                        payload: { catalog: '04' },
                        callback: rs => {
                            this.setState({
                                trainList: rs.data,
                            });
                        }
                    });
                    dispatch({
                        type: 'control_center_model/highRiskList',
                        payload: { catalog: '05' },
                        callback: rs => {
                            this.setState({
                                travelList: rs.data,
                            });
                        }
                    });
                    dispatch({
                        type: 'control_center_model/highRiskList',
                        payload: { catalog: '06' },
                        callback: rs => {
                            this.setState({
                                formalitiesList: rs.data,
                            });
                        }
                    });
                }
            }
        });
        
    }

    render() {
        const { managementList, consultingList, meetList, trainList, travelList, formalitiesList } = this.state;
        const management = managementList.rs || [];
        const consulting = consultingList.rs || [];
        const meet = meetList.rs || [];
        const train = trainList.rs || [];
        const travel = travelList.rs || [];
        const formalities = formalitiesList.rs || [];
        // 管理费风险票趋势监控.
        const managementData = management;
        const managementCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 咨询费风险票趋势监控.
        const consultingData = consulting;
        const consultingCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 咨会议费风险票趋势监控.
        const meetData = meet;
        const meetCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 培训费风险票趋势监控.
        const trainData = train;
        const trainCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 旅游费风险票趋势监控.
        const travelData = travel;
        const travelCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };
        // 手续费风险票趋势监控.
        const formalitiesData = formalities;
        const formalitiesCols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };

        return (
            
            <div>
                <Row>                 
                    <Button style={{ float: 'right', marginBottom:20 }} class="particles-button" onClick={() => router.goBack()}>返 回</Button>
                </Row>
                <Row type="flex" justify="center" align="top" gutter={16}>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>管理费风险票趋势监控</b>{/*managementData.num2 > managementData.num ? <Tag className={styles.tag} color="#FFDCE1">高风险</Tag>:''*/}</p>
                            <div className={styles.line}></div>
                            <Chart data={managementData} scale={managementCols} padding= "auto" height={230} style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10} />

                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="#5396DB" /> {/** 柱形图颜色 */}
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide>
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>咨询费风险票趋势监控</b></p>
                            <div className={styles.line}></div>
                            <Chart data={consultingData} scale={consultingCols} padding= "auto" height={230} style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10} />

                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="#539E00" />
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide>
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top" gutter={16} style={{ marginTop: 20 }}>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>会议费风险票趋势监控</b></p>
                            <div className={styles.line}></div>
                            <Chart data={meetData} scale={meetCols} padding= "auto" height={230} style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10} />

                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="rgb(87, 42, 107)" />  {/** 柱形图颜色 */}
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide>
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>培训费风险票趋势监控</b></p>
                            <div className={styles.line}></div>
                            <Chart data={trainData} scale={trainCols} padding= "auto" height={230} style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10} />

                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="rgb(230, 192, 89)" />
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide>
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="top" gutter={16} style={{ marginTop: 20, marginBottom:40 }}>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>旅游费风险票趋势监控</b>{/*travelData.num2 > travelData.num ?<Tag className={styles.tag} color="#FFDCE1">高风险</Tag>:''*/}</p>
                            <div className={styles.line}></div>
                            <Chart data={travelData} height={230} scale={travelCols} padding="auto" style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10} />

                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="rgb(228, 105, 166)" />
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide>
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card bordered={false}
                            bodyStyle={{
                                boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                                borderRadius: '7px',
                                height:320
                            }}
                            headStyle={{ padding: '0' }}
                        >
                            <p className={styles.title3}><b>手续费风险票趋势监控</b></p>
                            <div className={styles.line}></div>
                            <Chart data={formalitiesData} height={230} scale={formalitiesCols} padding="auto" style={{marginTop:15}} forceFit>
                                <Axis title />
                                <Axis title />
                                <Legend position="bottom" dy={-10}  />
                                <Tooltip showTitle={false} />
                                <Geom type="interval" position="month*num" color="rgb(35, 36, 141)" />
                                <Geom type="line" position="month*num2" size={2} color="#F08F4E" />
                                {/* <Geom type="line" position="month*num2" size={2} color="#F08F4E" style={{
                        lineDash: [4, 4]
                        }}/> */}

                                <Guide >                                
                                    <Line
                                        top // {boolean} 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                                        start={{ month: '1月', num2: 600 }} // {object} | {function} | {array} 辅助线结束位置，值为原始数据值，支持 callback
                                        end={{ month: '12月', num2: 100 }} // 同 start
                                        lineStyle={{
                                            stroke: '#F08F4E', // 线的颜色
                                            lineDash: [0, 4, 4], // 虚线的设置
                                            lineWidth: 1, // 线的宽度
                                        }} // 图形样式配置 https://bizcharts.net/products/bizCharts/api/graphic
                                        text={{
                                            position: 'start', // 'start' | 'center' | 'end' | '39%' | 0.5 文本的显示位置
                                            autoRotate: true, // {boolean} 是否沿线的角度排布，默认为 true
                                            style: { fill: 'black', fontSize: '13' }, // {object}文本图形样式配置
                                            // content: {string}, // {string} 文本的内容
                                            offsetX: 20, // {number} x 方向的偏移量
                                            offsetY: -10, // {number} y 方向的偏移量
                                            content: '线性风险系数',
                                        }}
                                    />
                                </Guide>
                            </Chart>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default control_center_trend;