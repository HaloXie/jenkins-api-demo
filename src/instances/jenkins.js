import jenkinsApi from 'jenkins-api';
import { JenkinsConfig } from '../config/jenkins.config';

export default jenkinsApi.init(JenkinsConfig.remoteUrl);
