---
layout: post
title: "Spring MVC 处理文件上传"
tagline: ""
description: ""
category: 经验总结
tags: [SpringMVC, Java, Web, File]
last_updated: 
---


Spring MVC 处理文件上传

## 添加Maven依赖

	<dependency>
	   <groupId>commons-io</groupId>
	   <artifactId>commons-io</artifactId>
	   <version>2.4</version>
	</dependency>
	<dependency>
	   <groupId>commons-fileupload</groupId>
	   <artifactId>commons-fileupload</artifactId>
	   <version>1.3.1</version>
	</dependency>


## 添加界面显示

	<form method="POST" action="uploadFile" enctype="multipart/form-data">
		File to upload: <input type="file" name="file"> 
		Name: <input type="text" name="name"> 
		<input type="submit" value="Upload"> Press here to upload the file! 
	</form>

form 的 enctype 应该是 `multipart/form-data`

在 WEB-INF 目录下 servlet-context.xml 中添加配置

    <bean id="multipartResolver"
          class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
        <property name="maxUploadSize" value="104857600"/>
    </bean>

注意这里的 size 单位是 B，所以上面的大小限制是 100MB = `1024 * 1024 * 100`。

## 添加上传逻辑
Controller 中代码

	import org.slf4j.Logger;
	import org.slf4j.LoggerFactory;
	import org.springframework.stereotype.Controller;
	import org.springframework.web.bind.annotation.RequestMapping;
	import org.springframework.web.bind.annotation.RequestMethod;
	import org.springframework.web.bind.annotation.RequestParam;
	import org.springframework.web.bind.annotation.ResponseBody;
	import org.springframework.web.multipart.MultipartFile;

	import java.io.File;
	import javax.servlet.http.HttpServletRequest;
	import javax.servlet.http.HttpServletResponse;

	@Controller
	@RequestMapping("/upload")
	public class FileController {
		private static Logger logger = LoggerFactory.getLogger(FileController.class);

		@RequestMapping(value = "/zip", method = RequestMethod.POST)
		@ResponseBody
		public CommonResponse<ZipResponse> upload(@RequestParam("file") MultipartFile file,
														HttpServletRequest req,
														HttpServletResponse resp) throws BaseApiException {
			// deal with CSRF
			CommonResponse<ZipResponse> commonResponse = new CommonResponse<>();
			ZipResponse response = new ZipResponse();
			try {
				File cFile = new File("/tmp/" + file.getOriginalFilename());
				file.transferTo(cFile);

				FdsFileService fdsFileService = new FdsFileService();
				// store some where
				String url = "";
				response.setUrl(url);
				commonResponse.setData(response);
				cFile.delete();
			} catch (Exception e) {
				commonResponse.fail("fail");
				logger.error("上传ZIP失败", e);
			}
			return commonResponse;
		}
	}

## 遇到问题

Spring 在处理文件上传的时候报错：

> the request was rejected because no multipart boundary was found

解决方法：不要手动设置 Content-Type ，让 Chrome 或者其他浏览器处理， Postman 同理不需要设置  Content-Type。 [Refer](https://stackoverflow.com/a/38013585/1820217)


## reference

- <http://www.journaldev.com/2573/spring-mvc-file-upload-example-single-multiple-files>



