/**
 * Api Version: 57.0
 * Author: Shivam Barya
 * fetchSObjectRecord: function to fetch the respective object record
 * Date: 15 June 2023
 */

public with sharing class DynamicTableController {
    @AuraEnabled(cacheable=true)
    public static List<Object> fetchSObjectRecord(String objectName, String fields){
        try {
            String queryStr = 'SELECT '+ fields + ' FROM ' + objectName + ' LIMIT 10';
            List<Object> sobjList = Database.query(queryStr);
            System.debug('+++++++sobjList+++++++ ' + sobjList);
            return sobjList;
        } 
        catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<DynamicTable__mdt> fetchSObjectFieldName(){

        try {
            List<DynamicTable__mdt> queryValues = [SELECT Id,Object_Type__c,Query__c FROM DynamicTable__mdt];
            System.debug('____________queryValues____________'+queryValues);
            return queryValues;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
