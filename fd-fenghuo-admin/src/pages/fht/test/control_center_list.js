import React from 'react';
import { Form,Card,Typography, Input, Table, Button, Modal, Row, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import styles from './control_center_list.css';


import { Chart, Geom, Axis, Tooltip, Legend, Coord ,Guide} from 'bizcharts';
const { Line } = Guide;

const { Text } = Typography;

@connect(({ common_model, control_center_model }) => ({
    high_list: control_center_model.highDataList

}))

@Form.create()
class control_center_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 控制对话框的显示.
            visible: false,
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'common_model/updateState',
            payload: {
                breadcrumb: { name: '控制中心' },
                menu: {
                    selectedKeys: ['control_center'],
                }
            }
        });
        dispatch({
            type: 'control_center_model/HighInvoice',
            payload: {}
        });
        
    }


    render() {
        const {high_list} = this.props;
        const h_list = high_list || [];
        console.log("ddd",h_list);
        const data = [
            { month: "1月", num: 180, num2:80},
            { month: "2月", num: 130, num2:30 },
            { month: "3月", num: 150, num2:0 },
            { month: "4月", num: 170, num2:60},
            { month: '5月', num: 160, num2:0 },
            { month: '6月', num: 180, num2:80},
            { month: '7月', num: 100, num2:80},
            { month: '8月', num: 35,  num2:0},
            { month: '9月', num: 150, num2:10 },
            { month: '10月', num: 100,num2:20  },
            { month: '11月', num: 150, num2:20 },
            { month: '12月', num: 100,num2:0 },
        ];

        console.log("ddd2",data);

        const cols = {
            num: { alias: '票据总数' },
            month: { alias: '月份' },
            num2: { alias: '风险票据数' },
        };

        return (

            <div>
            <Card  bordered={false}
                bodyStyle={{
                    boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                    borderRadius: '7px',
                }}
                headStyle={{ padding: '0' }}
            >
            <Row >
                <Col span={5} push={2}><div className={styles.div1}>
                    <Row className={styles.t1}>进项票据统计</Row>
                    <Row className={styles.t11}>本月新增： <span style={{fontSize:'25px'}}>164</span></Row>
                    <Row className={styles.t111}>当年累计： <span style={{fontSize:'25px'}}>2778</span></Row>
                </div></Col>
                <Col span={5} push={4}><div className={styles.div2}>
                    <Row></Row>
                    <Row className={styles.t2}>已处理风险票据统计</Row>
                    <Row></Row>
                    <Row className={styles.t11}>本月新增： <span style={{fontSize:'25px'}}>164</span></Row>
                    <Row></Row>
                    <Row className={styles.t111}>当年累计： <span style={{fontSize:'25px'}}>2778</span></Row>
                </div></Col>
                <Col span={5} push={6}><div className={styles.div3}>
                    <Row></Row>
                    <Row className={styles.t3}>待处理风险票据统计</Row>
                    <Row></Row>
                    <Row className={styles.t11}>本月新增： <span style={{fontSize:'25px'}}>164</span></Row>
                    <Row></Row>
                    <Row className={styles.t111}>当年累计： <span style={{fontSize:'25px'}}>3778</span> <span className={styles.biaoqian}></span></Row>
                </div></Col>
            </Row>
            </Card>

            <Card style={{marginTop:20}} bordered={false}
                bodyStyle={{
                    boxShadow: '0px 0px 24px 0px rgba(0,0,0,0.1)',
                    borderRadius: '7px',
                  
                }}
                headStyle={{ padding: '0' }}
            >
            <Row>
                <Col>
                    <Chart  data={data} scale={cols} padding="auto" forceFit >
                        <Axis  title/>
                        <Axis  title/>
                        <Legend position="bottom" dy={-10} />
                        
                        <Tooltip />
                        <Geom type="interval" position="month*num" color="#5396DB" />
                        <Geom type="line" position="month*num2" size={2} color="#F08F4E"/>
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
                            style: { fill: 'black',fontSize:'13' }, // {object}文本图形样式配置
                            // content: {string}, // {string} 文本的内容
                            offsetX: 20, // {number} x 方向的偏移量
                            offsetY: -10, // {number} y 方向的偏移量
                            content: '线性风险系数',
                            }}
                            />
                        </Guide>
                    </Chart>
                </Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
                <Col></Col>
            </Row>
            </Card>
            </div>
        );
    }
}


export default control_center_list;