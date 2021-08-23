const express = require('express');
const assert = require('assert');
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

/**
 * queryJobs
*{
  "_class": "hudson.model.FreeStyleProject",
  "name": "test",
  "url": "http://localhost:8080/job/test/",
  "color": "notbuilt"
  },
*/
router.get('/', (req, res) => {
	jobManager.queryJobs(callbackHandler(res));
});

// query job config
router.get('/:name/config', (req, res) => {
	jobManager.queryJobConfig(req.params.name, callbackHandler(res));
});

// update job config
router.put('/:name/config', (req, res) => {
	// todo： 这里有问题，因为 trigger 和 action 等信息需要更新， 如果只是通过 string 的方式肯定不行
	jobManager.updateJobConfig(
		req.params.name,
		// data 是 xml 的字符串，直接替换的了
		data => {
			return data.replace(/<>/);
		},
		callbackHandler(res)
	);
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
