import React from 'react';
import { Button, Modal } from 'antd';
import { serverUrl } from '../../utils/config'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
const baseurl = serverUrl + "/common/file/readimg?img=";

class Sfile extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 图片上传数量
            previewImage: '',
            previewVisible: false,
            thumbUrl: '',
        };

    }
    // 文件下载或预览
    cloudDownload = (value) => {
        console.log("cloudDownload==", value);
        var suffixIndex = value.lastIndexOf(".");
        var suffix = value.substring(suffixIndex + 1).toUpperCase();
        if (suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF") {
            window.open(baseurl + value);    // 下载       
        } else {
            this.setState({
                previewVisible: true,  // 预览
                previewImage: baseurl + value,
            })
        }
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
    };

    render() {
        const { file } = this.props;
        let { previewImage, previewVisible } = this.state;
        previewVisible = previewVisible || false;
        const fileType = file.substring(file.lastIndexOf(".") + 1).toUpperCase()
        return (
            <div>
               
                <Button size="small" onClick={this.cloudDownload.bind(this, file)} type="link" icon="cloud-download">
                    {(fileType == "BMP" || fileType == "JPG" || fileType == "JPEG" || fileType == "PNG" || fileType == "GIF") ? "预览" : "下载"}
                </Button>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default Sfile;

