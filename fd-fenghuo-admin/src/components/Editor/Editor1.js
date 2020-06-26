import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import uploadApi from '../../api/uploadApi'
import config from '../../utils/config'
const { filePrefix } = config;
class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // 创建一个空的editorState作为初始值
            controls: [
                'undo', 'redo', 'separator',
                'font-size', 'line-height', 'letter-spacing', 'separator',
                'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
                'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                'link', 'separator', 'hr', 'separator',
                'media', 'separator',
                'clear', 'fullscreen'
            ],
            editorState: BraftEditor.createEditorState(null),
            do: this.props.do,//do为true是，可以编辑
            read: false,
        }
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        let defauletValue = this.props.defauletValue || '';
        this.setState({
            editorState: BraftEditor.createEditorState(defauletValue)
        })
        if (!this.state.do) {
            this.setState({ controls: [], read: true, })
        }
    }
    render() {
        const { editorState, controls, read } = this.state

        return (
            <div key={Math.random()}>
                <BraftEditor
                    ref="BraftEditor"
                    media={{ uploadFn: myUploadFn }}
                    value={editorState}
                    onChange={this.handleChange}
                    onSave={this.onSave}
                    controls={controls}
                    initialContent=""
                    readOnly={read}
                />
            </div>
        )
    }

    handleChange = (editorState) => {
        let htmlString = editorState.toHTML();
        // console.log("返回数据", htmlString)
        //处理富文本放过一对空标签问题
        // if (htmlString != '<p size="0" _root="undefined" __ownerID="undefined" __hash="undefined" __altered="false"></p>') {
        // this.setState({ editorState: editorState }, () => {
        //     if (this.state.do) {
        //         this.props.onChange(htmlString)
        //     }
        // })
        // }
    }

    onSave = (editorState) => {
        let htmlString = editorState.toHTML();
        console.log("html", htmlString);
        // //处理富文本放过一对空标签问题
        this.setState({ editorState: editorState }, () => {
            if (this.state.do) {
                this.props.onChange(htmlString)
            }
        })
    }

    handleSave = (funtName) => {
        let editorState = this.refs.BraftEditor.state.editorState;
        let htmlString = editorState.toHTML();
        // console.log("html", htmlString);
        // //处理富文本放过一对空标签问题
        this.setState({ editorState: editorState }, () => {
            if (this.state.do) {
                this.props.onChange(htmlString);
                if (funtName) {
                    setTimeout(funtName(), 200)
                }
            }
        })
    }
}

export default Editor;

function myUploadFn(param) {
    var reader = new FileReader();
    reader.readAsDataURL(param.file);
    reader.onload = function () {
        //读取完成后，数据保存在对象的result属性中
        uploadApi.uploadFile({ file: param.file }).then(rs => {
            //成功
            // console.log("上传结果", rs);
            if (rs.code == 0) {
                param.success({
                    url: filePrefix + rs.data.path,
                    meta: {}
                })
            } else {
                param.error({
                    msg: 'unable to upload.'
                })
            }
        }).catch(err => {
            //失败
            param.error({
                msg: 'unable to upload.'
            })
        });
    }
    //param.progress(event.loaded / event.total * 100)
}