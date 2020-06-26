import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/table.css';
import React from 'react';
import BraftEditor from 'braft-editor';
import Table from 'braft-extensions/dist/table';

const optionTable = {
    defaultColumns: 3, // 默认列数
    defaultRows: 3, // 默认行数
    withDropdown: true, // 插入表格前是否弹出下拉菜单
    exportAttrString: 'border=1', // 指定输出HTML时附加到table标签上的属性字符串
    includeEditors: ['editor-id-1'], // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
    // excludeEditors: ['editor-id-2']  // 指定该模块对哪些BraftEditor无效
}
BraftEditor.use(Table(optionTable))

export default class Editor extends React.Component {
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
                'link', 'separator', 'hr', 'separator', 'table',
                'media', 'separator',
                'clear', 'fullscreen',
            ],
            editorState: BraftEditor.createEditorState(null, { editorId: 'editor-id-1' }),
            do: this.props.do, // do为true是, 可以编辑; false时, controls为空, 自己设置.
            read: false,
        }
    }

    componentDidMount() {
        let defauletValue = this.props.defauletValue || '';
        this.setState({
            editorState: BraftEditor.createEditorState(defauletValue)
        })
        if (!this.state.do) {
            this.setState({ 
                controls: [], 
                read: true, 
            })
        }
    }

    render() {
        const { editorState, controls, read } = this.state;

        return (
            <div key={Math.random()}>
                <BraftEditor
                    value={editorState}
                    onChange={this.handleChange}
                    onSave={this.handleSave}
                    controls={controls}
                    initialContent=""
                    id="editor-id-1"
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

    handleSave = (editorState) => {
        let htmlString = editorState.toHTML();
        console.log("返回数据", htmlString);
        //处理富文本放过一对空标签问题
        this.setState({ editorState: editorState }, () => {
            if (this.state.do) {
                this.props.onChange(htmlString)
            }
        })
    }
}