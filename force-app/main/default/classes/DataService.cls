public with sharing class DataService {
    @AuraEnabled(cacheable=true)
    public static List<sObject> getQuestionsBasedOnTheirSubsection(string subsection){
        String querystring = 'SELECT Id, Name,Answer__c, Section__c, Subsection__c, Level__c, Type__c FROM Question__c WHERE Subsection__C =:subsection'  ;
        return Database.query(querystring);
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getQuestionsBasedOnTheirSection(string section){
        String querystring = 'SELECT Id, Name, Answer__c, Section__c,  Level__c, Type__c FROM Question__c WHERE Section__c =:section'  ;
        return Database.query(querystring);
    }
    @AuraEnabled(cacheable=true)
    public static List<sObject> getQuestionsFromBundles(string BundleId){
        String querystring = 'SELECT Name, Answer__c FROM Question__c WHERE Id IN (SELECT Question__c FROM bundleQuestion__c WHERE Bundle__c =:BundleId)';
        return Database.query(querystring);
    }   
}