public class PanneClass {
    @AuraEnabled(cacheable=true)
    public static List<Evaluation__c> getPannes(){
        List<Evaluation__c> EvaluationList = [SELECT Id,Name,AssignedTo__r.Name,AssignedTo__r.Title,Lead__c,Lead__r.Name,Date__c FROM Evaluation__c WHERE Status__c = 'Scheduled' AND Lead__r.Name != null AND Date__c > TODAY];
        if(!EvaluationList.isEmpty()){
            return EvaluationList;
        }
        return null;
    }
    
    @AuraEnabled(cacheable=true)
    public static List<JobApplication__c> getJob(String leadId){
            List<JobApplication__c> JobList = [select Id, Name,JobName__r.Name from JobApplication__c  where Lead__r.Id=:leadId];
            if(!JobList.isEmpty()){
            return JobList;
        }
        return null;
    }
  
}