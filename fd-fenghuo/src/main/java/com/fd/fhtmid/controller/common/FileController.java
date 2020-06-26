package com.fd.fhtmid.controller.common;
import java.io.File;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fd.fhtmid.bean.ApiResult;
import com.fd.fhtmid.common.constant.MediumTypeEnum;
import com.fd.fhtmid.domain.MFlFile;
import com.fd.fhtmid.service.impl.FileServiceImpl;
import com.fd.fhtmid.utils.Convert;
import com.fd.fhtmid.utils.IoUtil;
import com.fd.fhtmid.utils.StringUtils;


/**
 * 文件上传接口
 * 
 * @author ZhouKaiDong
 *
 */
@Controller
@RequestMapping("/common/file")
public class FileController {
	@Autowired
	private FileServiceImpl fileApi;
	
	@Value("${common.file.basePath}")
	private String basePath;
	
	@Value("${local.file.path}")
	private String localPath;
	
	// 查询列表
	@RequestMapping(value = "/upload", method = RequestMethod.POST)
	@ResponseBody
	public ApiResult upload(@RequestParam(value = "mediumType", required = false) Integer mediumType,
			@RequestParam(value = "file", required = true) MultipartFile file) {
		mediumType = Convert.toInt(mediumType, 1);
		// 构建参数
		String fileName ="";
		// 将文件类型转换为base64
		String base64Data = "";
		try {
			
			if (file.equals("") || file.getSize() <= 0) {
				file = null;
			} else {
				final Base64.Encoder encoder = Base64.getEncoder();
				base64Data = encoder.encodeToString(file.getBytes());
				
				String[] suffixArra = file.getOriginalFilename().split("\\.");
				System.out.println("Original "+file.getOriginalFilename());
				System.out.println("Original "+suffixArra[suffixArra.length - 1]);
				fileName 
						= 
						//UUID.randomUUID().toString().replaceAll("-", "") + "." + suffixArra[suffixArra.length - 1];
								file.getOriginalFilename();
				
			}
			
		} catch (Exception e) {
			return new ApiResult(-1, "文件不符合规范", null);
		}
		
		int status = 1;
		String category = "category";
		
		MFlFile mf = null;
		// 存储介质类型
		System.out.println("类型==" + (mediumType == 1)+fileName+category);
		if (mediumType == 1) {
			try {
				mf = fileApi.writeBase64(MediumTypeEnum.LOCAL.getCode(), fileName, category, base64Data, status);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		} else {
			
		}
//		System.out.println(mf);
		String path = mf.getContent();
		path = path.replaceAll("\\\\", "\\/");
		String url = path;
		if(!StringUtils.isHttpUrl(path)) {
			url = basePath+"/common/file/readimg?img="+path;
		}
		Map rmap = new HashMap<>();
		rmap.put("id", mf.getId());
		rmap.put("path", path);
		rmap.put("url", url);
		ApiResult ap = new ApiResult(0, "", rmap);
		return ap;
	}

	/**
	 * 利用OutputStream在页面输出图片
	 * @param img
	 * @param response
	 * @throws Exception 
	 */
	@RequestMapping(value = "/readimg", method = RequestMethod.GET)
	@ResponseBody
	public void readimg(@RequestParam(value = "img", required = true) String img, HttpServletResponse response) throws Exception {
		
			// 构建参数			
//		System.out.println(localPath+img);
//		BufferedImage image = ImageIO.read(new File(localPath+img));		
		String fileFtt = img.trim().substring(img.trim().lastIndexOf(".") + 1);
//		ImageIO.write(image, fileFtt, response.getOutputStream());
		
		response.addHeader("Content-Disposition", "attachment;filename=download." + fileFtt);
		response.setContentType("multipart/form-data");
		IoUtil.writeFile(new File(localPath+img), response.getOutputStream());
			
		
	}
	
	
	/**
	 * 构建完整路径并显示图片
	 * @param img
	 * @param response
	 * @throws Exception 
	 */
	@RequestMapping(value = "/readpath", method = RequestMethod.GET)
	@ResponseBody
	public void readpath(@RequestParam(value = "img", required = true) String img, HttpServletResponse response) throws Exception {
			// 构建参数
			
			MFlFile mf = fileApi.readAsPath(img);
			
			// 构建完整路径
			System.out.println("**********构建完整路径***********");
			System.out.println(mf);
			String path = Convert.toStr(mf.getUrl(), "404.png").replace("\\", "/");
			path = Convert.toStr(mf.getContent(), "404.png").replace("\\", "/");
			path = path.replaceAll("\\\\", "/");
			//判断本身是否为http路径
			if(!StringUtils.isHttpUrl(path)) {
				path = basePath+path;
			}
			System.out.println("url===="+path);
			System.out.println("**********构建完整路径***********");
			//重定向到完成路径
			
			response.setHeader("location",path);		
	}
	
	/**
	 * 下载文件
	 * @param id 文件ID
	 * @param response
	 */
	@RequestMapping(value = "/download", method = RequestMethod.GET)
	@ResponseBody
	public void download(@RequestParam(value = "id", required = true) String id, HttpServletResponse response) {
		
	}
}
