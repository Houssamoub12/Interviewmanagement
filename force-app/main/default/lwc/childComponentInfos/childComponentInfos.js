import { LightningElement,api, track, wire } from 'lwc';
import getJob from '@salesforce/apex/InfosClass.getJob';
import profileimage from '@salesforce/resourceUrl/profileimage';



export default class ChildComponentInfos extends LightningElement {
    pfimage =profileimage;
    @api leadName;
    @api interviewDate;
    @api interviewerName;
    @api interviewerTitle;
    @api interviewLeadId;
    @track jobs;
    @track job;

    @wire(getJob,{leadId : '$interviewLeadId'})
    function({ data, error }) {
        if (data) {
            console.log(data);
            this.jobs = data.map(job => {
                return {jobName : job.JobName__r.Name};
            });
            console.log(JSON.stringify(this.jobs));
            console.log(this.interviewLeadId);

            this.job = this.jobs[0].jobName;
        } else if (error) {
            console.log(error);
        }
    }
}