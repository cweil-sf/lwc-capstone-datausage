public with sharing class deviceUsageController {

    class PlanWrapper {
        @AuraEnabled public List<Plan__c> plans {get;set;}
        @AuraEnabled public Map<Id,Usage__c> usageMap {get;set;}

        public PlanWrapper(List<Plan__c> plans, Map<Id,Usage__c> usageMap) {
            this.plans = plans;
            this.usageMap = usageMap;
        }
    }

    @AuraEnabled
    public static PlanWrapper getPlans(Id inputId, String usageType) {
        try {
            String query = 'SELECT Id, Product__c, (SELECT Id, Make_and_Model__c, User__c, Phone_Number_Display__c, Device_Type__c, Unlimited_Data__c, Unlimited_Talk__c, Unlimited_Text__c FROM Assets__r) FROM Plan__c';
            if (inputId.getSObjectType() == Schema.Plan__c.getSObjectType()) {
                query = query + ' WHERE Id = :inputId';
            } else {
                query = query + ' WHERE Billing_Account_Number__c = :inputId';
            }

            List<Plan__c> plans =  Database.query(query);

            Set<Id> assetIds = new Set<Id>();
            for (Plan__c plan : plans) {
                for (Asset asset : plan.Assets__r) {
                    assetIds.add(asset.Id);
                }
            }

            List<Usage__c> usageInfo = [SELECT Id, Allotted_Usage__c, Current_Usage__c, Asset__c, Unit_of_Measure__c, Usage_Type__c
                                        FROM Usage__c
                                        WHERE Asset__c IN :assetIds
                                        AND Usage_Type__c = :usageType];

            Map<Id,Usage__c> usageMap = new Map<Id,Usage__c>();
            for (Usage__c usage : usageInfo) {
                usageMap.put(usage.Asset__c, usage);
            }

            PlanWrapper wrapper = new PlanWrapper(plans, usageMap);
            return wrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}