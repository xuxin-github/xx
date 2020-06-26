
import React from 'react';
import {Form,Input,Row,Col,Button} from "antd";

@Form.create()
class reimburseTypeAdd extends React.Component{
        constructor(props){
            super(props);
            this.state={
                
            }
        }
        handleCancel=(e)=>{
           e.preventDefault();
            this.props.handleAddCancel();
            this.props.form.resetFields();
        }
        getForm=e=>{
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.props.getAddDate(values);
                    this.props.form.resetFields();
                }
            });
        }
        render(){
            const {getFieldDecorator}=this.props.form;
            return(
                <Form>
                    <Row>
                        <Form.Item label="新增报销类别">
                            {
                                getFieldDecorator('type_name',{
                                    rules:[
                                        {
                                            required:true,
                                            message:"请输入报销类别"
                                        }
                                    ]
                                })(<Input placeholder="请输入报销类别"/>)
                            }
                        </Form.Item>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item  style={{float:'right'}}>
                            <Button type="primary" onClick={this.getForm}>确定</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item>
                            <Button type='ghost' onClick={this.handleCancel}>取消</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            )
        }

}
export default reimburseTypeAdd;