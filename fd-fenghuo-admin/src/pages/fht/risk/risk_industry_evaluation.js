import React from 'react';
import { connect } from 'dva';
import Editor from '../../../components/Editor/Editor1';
import { Row, Button, Form } from 'antd';
import editerUtil from '../../../utils/editerUtil';

@connect(({ industry_model }) => ({}))

@Form.create()
class risk_industry_evaluation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'industry_model/query',
            callback: data => {
                this.setState({
                    content: editerUtil.replaceImg(data.content),
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { content } = this.state;
        return (
            <div key={Math.random()}>
                <Form>
                    <Form.Item>
                        {getFieldDecorator('content', {
                            valuePropName: 'defauletValue',
                            initialValue: content,
                            rules: [],
                        })(<Editor do={false}></Editor>)}
                    </Form.Item>
                </Form>
                {/* <div style={{height: '100vh', width: '100%'}} dangerouslySetInnerHTML={{__html: content}} /> */}
            </div>
        );
    }
}

export default risk_industry_evaluation;