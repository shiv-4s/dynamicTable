public with sharing class DynamicTableController {
    @AuraEnabled(cacheable=true)
    public static List<SObject> fetchSObjectRecord(){
        try {
            DynamicTable__mdt dynamicMdt = DynamicTable__mdt.getInstance('recordv1');   
            String queryStr = 'SELECT '+ dynamicMdt.Query__c + ' FROM ' + dynamicMdt.Object_Type__c + ' LIMIT 10';
            System.debug('++++++++queryStr+++++++ ' + queryStr);
            List<sObject> sobjList = Database.query(queryStr);
            System.debug('++++sobjList++++ ' + sobjList);
            return sobjList;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<String> fetchSObjectFieldName(){
        try {
            DynamicTable__mdt dynamicMdt = DynamicTable__mdt.getInstance('recordv1');            
            List<String> reqFields = dynamicMdt.Query__c.split(',');
            return reqFields;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
