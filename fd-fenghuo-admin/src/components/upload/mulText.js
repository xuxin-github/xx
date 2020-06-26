import { Upload, Icon, Modal, notification ,Button } from 'antd';
import React from 'react';
import { serverUrl } from '../../utils/config'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function fttMaxSize(maxSize) {
    console.log("初始化大小", maxSize);
    if (!maxSize) {
        return 2 * 1024 * 1024;
    }
    maxSize = String(maxSize);
    if (/^[0-9]+$/.test(maxSize)) {
        return maxSize * 1024;
    }
    let unit = maxSize.substring(maxSize.length - 1);
    let maxNum = maxSize.substring(0, maxSize.length - 1);
    unit = unit.toUpperCase();
    if (unit == "K") {
        maxNum = maxNum * 1024;
    } else if (unit == "M") {
        maxNum = maxNum * 1024 * 1024;
    }
    console.log({ maxSize, unit, maxNum });
    return maxNum
}

class mulText extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            // 图片上传数量
            previewImage: '',
            previewVisible: false,
            fileList: []
        };
        console.log("mulPic初始化",props);
        this.valuesSetToList(props.value, true);
    }

    // componentWillReceiveProps(props) {
    //     //监听props变化
    //     console.log("监听数据变化", props);
    // }

    valuesSetToList = (values, source) => {
        
        let defaultFileList = [];
        if ((values instanceof Array)) {
            for (let i = 0; i < values.length; i++) {
                let val = values[i]
                let url = serverUrl+"/common/file/readimg?img=" + val;
                let name = val.substr(val.lastIndexOf('.', val.lastIndexOf('.') - 1) + 1);
                let item = {
                    status: "done",
                    name: name,
                    thumbUrl: url,
                    preview: url,
                    uid: values[i],
                    response: {
                        code: 0,
                        data: {
                            id: values[i],
                            path: url,
                            url: url
                        }
                    }
                }
                defaultFileList.push(item);
            }
            if (source == true) {
                this.state = {
                    // 图片上传数量
                    fileList: defaultFileList,
                    values: values,
                    previewImage: '',
                    previewVisible: false
                }

            } else {
                this.setState({
                    // 图片上传数量
                    fileList: defaultFileList,
                    values: values,
                    previewImage: '',
                    previewVisible: false
                })

            }
        }
    }

    beforeUpload = (file, fileList) => {
        // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        // if (!isJpgOrPng) {
        //     notification.error({
        //         message: '温馨提示',
        //         description: '图片格式错误'
        //     });
        // }

        // const isLt2M = file.size < fttMaxSize(this.props.maxsize);
        // if (!isLt2M) {
        //     notification.error({
        //         message: '温馨提示',
        //         description: '图片过大，上传失败!'
        //     });
        // }

        // fileList.splice(fileList.length - 1, 1);
        //return isJpgOrPng && isLt2M;
        return 1;
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log("预览", file);
        if ((file.thumbUrl.indexOf(";base64,") > -1) && (file.thumbUrl.indexOf("http") == -1)) {
            //该图片是base64格式
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj);
            }
            this.setState({
                previewImage: file.url || file.preview,
                previewVisible: true,
            });
        } else {
            
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
            
            var suffixIndex=file.thumbUrl.lastIndexOf(".");  
            var suffix=file.thumbUrl.substring(suffixIndex+1).toUpperCase();  
            if(suffix!="BMP"&&suffix!="JPG"&&suffix!="JPEG"&&suffix!="PNG"&&suffix!="GIF"){  
                var link = document.createElement('a');
                link.href = file.thumbUrl;
                link.download = file.name;
                //此写法兼容可火狐浏览器
                document.body.appendChild(link);
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", false, false);
                link.dispatchEvent(evt);
                document.body.removeChild(link);
                
            }else{
                this.setState({
                    previewImage: file.thumbUrl,
                    previewVisible: true,
                });
            }

        }

    };

    handleChange = (e) => {

        let { fileList } = e;
        console.log("图片列表=", fileList);
        //完成
        let succList = [];
        for (var i = 0; i < fileList.length; i++) {
            let fileItem = fileList[i];
            if (fileItem.status == "done" && fileItem.response) {
                //代表成功
                let ret = fileItem.response;
                console.log("response=", ret);
                if (ret.code == 0) {
                    succList.push(ret.data.url);
                    //替换原路径，防止出现浏览器卡死
                    fileList[i].thumbUrl = ret.data.url;
                    fileList[i].preview = ret.data.url;
                } else {
                    //移除上传失败的图片
                    fileList.splice(i, 1);
                    i--;
                    notification.error({
                        message: '温馨提示',
                        description: '上传失败，自动移除！'
                    });
                }
            } else if (fileItem.status == "error") {
                //移除上传失败的图片
                fileList.splice(i, 1);
                i--;
                notification.error({
                    message: '温馨提示',
                    description: '上传失败，自动移除！'
                });

            }
        }
        this.setState({ fileList: [...fileList] });
        //this.setState({ fileList });
        // 向外传递数据
        this.props.onChange(succList);
    };

    render() {
       
        const { beforeUpload } = this;
        let { picnum, medium, defaultFileList,value } = this.props;
        let { previewImage, fileList, previewVisible } = this.state;
        previewVisible = previewVisible || false;
        picnum = picnum || 1;
        medium = medium || 1;
        const uploadurl = serverUrl+"/common/file/upload"

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        
        return (
            
            <div style={{width:"100%",minWidth:"100%"}}>
                <Upload                
                    action={uploadurl}
                    style={{width:"100%"}}
                    fileList={fileList}
                    listType="text"
                    showUploadList={true}
                    data={
                        { "mediumType": medium }
                    }
                    beforeUpload={beforeUpload}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    defaultFileList={defaultFileList}
                >
                    <Button>
                        <Icon type="upload" /> Upload
                    </Button>
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default mulText;