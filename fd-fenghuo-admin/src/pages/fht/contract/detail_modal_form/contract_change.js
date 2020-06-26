import React from 'react';
import { Form, Select, Row, Col, Button } from 'antd';
import { connect } from 'dva';
const { Option } = Select;


@connect(({ common_model ,project_model,contract_model}) => ({
    selectData:project_model.projectList,
    p_name:contract_model.project_name
}))

@Form.create()
class contract_change extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount(){
        let ROLE = localStorage.getItem("ROLE");
        let roledata = JSON.parse(ROLE);
        let USER_P = localStorage.getItem("USER_P");
        let userdata = JSON.parse(USER_P);
        const { dispatch } = this.props;
        const company_id = 1;
        dispatch({
            type: 'project_model/tableList',
            payload: { company_id,username:userdata.username,role_code: roledata[0].authority }
        });
    }

    getForm = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.getContractData(values);
                this.props.form.resetFields();
            }
        });        
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.handleContractCancel();
        this.props.form.resetFields();
    }

     onChange=(value)=> {
        console.log(`selected ${value}`);
      }
      
       onBlur=()=> {
        console.log('blur');
      }
      
       onFocus=()=> {
        console.log('focus');
      }
      
       onSearch=(val)=> {
        console.log('search:', val);
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { selectData,p_name } = this.props;
        const data = selectData.datalist || [];
        console.log('data',data);
        return (
            <div>
                <Form>
                    <Row>
                        <Col span={24}>
                            <Form.Item label="关联项目">
                                {getFieldDecorator('project_code', {
                                    initialValue: p_name,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择变更关联的项目!',
                                        },
                                    ],
                                })(
                                    <Select showSearch showSearch="true"  placeholder="请选择需要关联的项目" allowClear={true}
                                    optionFilterProp="children"
                                    onChange={this.onChange}
                                    onFocus={this.onFocus}
                                    onBlur={this.onBlur}
                                    onSearch={this.onSearch}
                                    filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {data.map(text => (
                                        <Option key={text.project_code}>{text.name}</Option>
                                      ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item style={{float: 'right'}}>
                                <Button type="primary" onClick={this.getForm}>确认</Button>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item>
                                <Button onClick={this.handleCancel}>取消</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default contract_change;
