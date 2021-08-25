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
      clonePath='/usr/local/code/${folderName}' # the folder that saves the clone code

      # clone specified repository with branch
      sudo git clone -b ${branch} ${git} $clonePath

      # compile
      cd $clonePath
      sudo npm install && sudo npm run build 
    `;

		/**
		 * <?xml version="1.0" encoding="UTF-8"?><project><description>description11112</description></project>
		 * 开始的是传入是如上，创建 job 的时候包含 description
		 */
		const builders = jsonObject.project?.builders || {};
		const buildShell = {
			'hudson.tasks.Shell': {
				command: buildContent,
			},
		};
		jsonObject.project.builders = { ...builders, ...buildShell }; // 只可以有一个 Shell

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
