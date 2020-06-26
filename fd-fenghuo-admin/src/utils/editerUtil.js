import config from "./config";
import util from "./util";
const editerUtil = {
    /**
     * 将图片使用相对路径
     */
    replaceImgBase(content) {
        let filePrefix = config.filePrefix;
        let htmlString = content;
        while(true){
            htmlString = htmlString.replace(filePrefix, "");
            if(htmlString.indexOf(filePrefix) == -1){
                break;
            }
        }
        return htmlString;
    },
    /**
     * 将图片src替换成完整
     */
    replaceImg(content) {
        var reContent = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, reSrc) {
            return match.replace(new RegExp(reSrc, "g"), (config.filePrefix || "") + reSrc);
        });
        return reContent;
    }
}

export default editerUtil;