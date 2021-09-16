const express = require('express');
const assert = require('assert');
const xmlConvert = require('xml-js');

const jobManager = require('../controllers/jobController.js');
const { callbackHandler } = require('../utils/callback');

const router = express.Router();

// enable
router.post('/:name/enable', (req, res) => {
	jobManager.enableJob(req.params.name, callbackHandler(res));
});

// disable
router.post('/:name/disable', (req, res) => {
	jobManager.disableJob(req.params.name, callbackHandler(res));
});

// createJob
router.post('/', (req, res) => {
	const { name, description } = req.body;
	assert(!!name, 'Job name could not be empty');

	jobManager.createJob(
		name,
		description,
		callbackHandler(res, result => {
			// 没有做额外配置，当前 name = fullName = displayName = fullDisplayName
			const { name, url } = result;
			res.json({ success: true, name, description, url });
		})
	);
});
router.post('/V1', async (req, res) => {
	/**
   * 失败，暂时不考虑了
  * TypeError: Cannot read property 'job_info' of undefined
    at /Users/ezt.xieminghao/Documents/my-code/jenkins-auto-build-demo/node_modules/jenkins-api/lib/main.js:741:14
  */
	const { name, description } = req.body;
	assert(!!name, 'Job name could not be empty');

	const { result, success, error } = await jobManager.createJobPromise(name, description);
	if (!success) {
		console.error(error);
		return res.json({ error, success });
	}

	const { url } = result;
	res.json({ success: true, name, description, url });
});

// queryJobs
router.get('/', (req, res) => {
	jobManager.queryJobs(callbackHandler(res));
});

// query job config
router.get('/:name/config', (req, res) => {
	jobManager.queryJobConfig(
		req.params.name,
		callbackHandler(res, result => {
			res.set('Content-Type', 'text/xml');
			res.send(result);
		})
	);
});

/**
 * https://github.com/jenkinsci/configuration-as-code-plugin/blob/master/README.md
 * 这里才是实际的更新 配置的信息
 */
router.put('/:name/config', (req, res) => {
	const { git, branch } = req.body;
	const jobName = req.params.name;

	const updateFn = xmlData => {
		const jsonData = xmlConvert.xml2json(xmlData, { compact: true });
		const jsonObject = JSON.parse(jsonData);

		const folderName = jobName + '-' + Date.now();
		// sudo 没有输入密码是因为 docker 环境中将 jenkins 用户添加到 sudo profile 同时免密
		const buildContent = `
      # !/bin/sh -l
      # export PATH=/Users/ezt.xieminghao/.nvm/versions/node/v16.4.0/bin/:$PATH
      # clonePath='/usr/local/code/${folderName}' # the folder that saves the clone code

      # clone specified repository with branch
      # sudo git clone -b ${branch} ${git} $clonePath

      # compile
      # cd $clonePath
      # sudo npm install && sudo npm run build 
      #!/bin/bash  

      # start time  
      date +"%H:%M:%S"  

      echo "wait for 10 seconds"  

      # sleep for 10 seconds  
      sleep 10s   
      # you can also use "sleep 9" in place of "sleep 9s" because if there is no suffix, it is considered as "seconds".  

      # end time  
      date +"%H:%M:%S"  

      echo "Task Completed"
    `;
		// 编译之后运行的，注意需要提前安装 groovy post-build 插件
		// https://www.notion.so/Send-the-callback-to-info-server-the-build-result-in-post-build-action-80b1f0a1d2364053aaae3c2294c17bd3#6045e9e5ef6b4cc99f385fc202d77dce
		// manager.listener.logger.println 不能简写为 println
		const postBuildContent = `
      manager.listener.logger.println "--------------post-build Start--------------"
      def buildResult = manager.getResult()
      manager.listener.logger.println "运行结果" + buildResult

      manager.listener.logger.println "--------------call back--------------"
      // http://10.13.152.164:5888/offapi/cons/template 测试 API
      def proc = "curl -I -X GET -H 'Content-Type:application/json' http://10.13.152.164:5888/offapi/cons/template".execute()
      // cURL uses error output stream for progress output.
      Thread.start { System.err << proc.err } 
      // Wait until cURL process finished and continue with the loop.
      proc.waitFor()

      manager.listener.logger.println "--------------post-build End--------------"
    `;

		/**
		 * <?xml version="1.0" encoding="UTF-8"?><project><description>description11112</description></project>
		 * 开始的是传入是如上，创建 job 的时候包含 description
		 */
		const buildShell = {
			'hudson.tasks.Shell': {
				command: buildContent,
			},
		};
		jsonObject.project.builders = buildShell; // 目前只有一个 Shell

		//
		const postBuildShell = {
			'org.jvnet.hudson.plugins.groovypostbuild.GroovyPostbuildRecorder': {
				_attributes: {
					plugin: 'groovy-postbuild@2.5',
				},
				script: {
					_attributes: {
						plugin: 'script-security@1.78',
					},
					script: postBuildContent,
					sandbox: false, // Use Groovy Sandbox
				},
				behavior: 2, // 当执行失败的之后，标记任务为 [do nothing, mark as unstable, mark as failed]
				runForMatrixParent: false, // dont know
			},
		};
		jsonObject.project.publishers = postBuildShell; // 目前只有一个 Shell

		console.log('====== 修改后的 JSON ======');
		console.log(jsonObject);

		const newXml = xmlConvert.json2xml(JSON.stringify(jsonObject), { compact: true });
		console.log('====== 修改后的 XML ======');
		console.log(newXml);

		return newXml;
	};

	jobManager.updateJobConfig(jobName, updateFn, callbackHandler(res));
});

// query job detail
router.get('/:name', (req, res) => {
	jobManager.queryJob(req.params.name, callbackHandler(res));
});

// deleteJob
router.delete('/:name', (req, res) => {
	jobManager.deleteJob(req.params.name, callbackHandler(res));
});

module.exports = router;
