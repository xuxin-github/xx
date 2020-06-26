import React from 'react';
import { Row, Button, Form } from 'antd';
import Editor from '../../../../components/Editor/Editor1';
import util from '../../../../utils/notification';
import { connect } from 'dva';
import editerUtil from '../../../../utils/editerUtil';


@connect(({ industry_model }) => ({}))

@Form.create()
class risk_industry_role_evaluation extends React.Component {
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

    handleSave = () => {
        //首先调用一次富文本保存方法
        if (this.braftEditor) {
            this.braftEditor.handleSave(() => {
                //富文本保存成功后，进行数据提交
                this.saveContent();
            });
        } else {
            //富文本保存成功后，进行数据提交
            this.saveContent();
        }
    }

    // 保存内容.
    saveContent = () => {
        const { dispatch } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.content == undefined || values.content == "<p></p>" || values.content == "") {
                    util.error("内容不能为空！")
                } else {
                    values.content = editerUtil.replaceImgBase(values.content);
                    dispatch({
                        type: 'industry_model/saveContent',
                        payload: { values },
                    });
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { content } = this.state;
        return (
            <div key={Math.random()}>
                <Row style={{ margin: '0 0 10px 0' }}>
                    <div style={{ float: 'right' }}>
                        <Button type="primary" onClick={this.handleSave}>保存</Button>
                    </div>
                </Row>
                <Form>
                    <Form.Item>
                        {getFieldDecorator('content', {
                            valuePropName: 'defauletValue',
                            initialValue: content,
                            rules: [],
                        })(<Editor onRef={(editor) => this.braftEditor = editor} do={true}></Editor>)}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default risk_industry_role_evaluation;