import React from 'react';
import { Form, Icon, Input, Button, Layout, Checkbox } from 'antd';
import styles from './auth.css';
import logo from '../../../assets/位图.svg';
import util from '../../../utils/util';
import { connect } from 'dva';
import ReactCanvasNest from 'react-canvas-nest';
// 与model建立连接
@connect(({ auth_model,control_center_model }) => ({}))

@Form.create()
class login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      remember: false
    };
  }

  componentDidMount() {
    //构建数据
    let USER_P = localStorage.getItem("USER_P");
    if (!util.isEmpty(USER_P)) {
      let userdata = JSON.parse(USER_P);
      this.setState({
        username: userdata.username,
        password: userdata.password,
        remember: true
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const formData = values;
        dispatch({
          type: 'auth_model/login',
          payload: formData,
        });     
      }
    });
  };

  render() {
    const { username, password, remember } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
      <ReactCanvasNest className = "canvasNest" config = {{ pointColor: '20,124,236  ',lineColor:'20,124,236 ',pointR:0.5,count:70 }} style={{zIndex:1,opacity:'0.6'}} />
        <Layout style={{ background: 'url(../../../assets/beijing.png)' }} className={[styles.loginBox, "centerXY"].join(" ")}>
          <div className="centerX" style={{zIndex:99}}>
            <div style={{ margin: '0 0 15px 0' }}>
              <img className={styles.loginLogo} src={logo} />
            </div>
            <span className={styles.loginTitle}>锦信</span>
            <span className={styles.loginFont}>财税法合规AI大数据平台</span>
            <div>
              <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                  {getFieldDecorator('username', {
                    initialValue: username,
                    rules: [{ required: true, message: '请输入用户名!' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="账户"
                      size="large"
                      className={styles.loginInput}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    initialValue: password,
                    rules: [{ required: true, message: '请输入密码!' }],
                  })(
                    <Input.Password
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="密码"
                      size="large"
                      className={styles.loginInput}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: remember,
                  })(<Checkbox>自动登录</Checkbox>)}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: "100%" }} className={styles.loginButton}>
                    <span className={styles.loginButtonFont}>登录</span>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

export default login;