/**
 * Author Shivam Barya
 * API Version 58.0
 * getProductInfo method to return the list of product record
 * Date June 27 2023
 */
public with sharing class ProductController {
    @AuraEnabled(cacheable=true)
    public static List<Product__c> getProductInfo(){
        try {
            return [SELECT Id, Name,Category__c, Price__c,Image__c FROM Product__c ORDER BY Name];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}