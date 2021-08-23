const jenkinsApi = require('jenkins-api');
const JenkinsConfig = require('../config/jenkins.config');

module.exports = jenkinsApi.init(JenkinsConfig.remoteUrl);
