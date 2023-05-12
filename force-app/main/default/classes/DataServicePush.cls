public with sharing class DataServicePush {
    
    @AuraEnabled
    public static void createQuestionsResponses(List<questionResponse__c> selectedEntries, String evaluationId){
        System.debug(selectedEntries);
        List<questionResponse__c> listToInsert = new List<questionResponse__c>();
        try {
            for(questionResponse__c entry : selectedEntries) {
                
                questionResponse__c questRep = new questionResponse__c(Question__c=entry.Id, Mark__c = entry.Mark__c, Comment__c = entry.Comment__c, Evaluation__c=evaluationId);
                listToInsert.add(questRep);
            }
            if(!listToInsert.isEmpty()){
                insert listToInsert;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void changeEvaluationStatus( String evaluationId){
        try {
            Evaluation__c eval = [SELECT Id, Status__c FROM Evaluation__c WHERE Id =:evaluationId];
            eval.Status__c = 'Passed';
            update eval;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void createBundle(List<bundleQuestion__c> selectedEntries, String interviewer, String bundleName, String bundleDesc){
        
        List<bundleQuestion__c> listToInsert = new List<bundleQuestion__c>();
        
        try {
            Bundle__c bund = new Bundle__c(Interviewer__c = interviewer, bundleDescription__c = bundleDesc, Name = bundleName);
            insert bund;
            
            for(bundleQuestion__c entry : selectedEntries) {
                
                bundleQuestion__c bundQuest = new bundleQuestion__c(Question__c=entry.Id, Bundle__c	= bund.Id);
                listToInsert.add(bundQuest);
            }
            if(!listToInsert.isEmpty()){
                insert listToInsert;
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}