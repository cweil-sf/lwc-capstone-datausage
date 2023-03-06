public with sharing class deviceUsageController {

    class PlanWrapper {
        @AuraEnabled public List<Plan__c> plans {get;set;}
        @AuraEnabled public Map<Id,List<Usage__c>> usageMap {get;set;}

        public PlanWrapper(List<Plan__c> plans, Map<Id,List<Usage__c>> usageMap) {
            this.plans = plans;
            this.usageMap = usageMap;
        }
    }

    @AuraEnabled
    public static PlanWrapper getPlans(Id billingAccountId) {
        try {
            List<Plan__c> plans =  [SELECT Id, Product__c, 
                                        (SELECT Id, Make_And_Model__c, User__c, Phone_Number_Display__c, Device_Type__c, Unlimited_Data__c, Unlimited_Talk__c, Unlimited_Text__c
                                        FROM Assets__r)
                                    FROM Plan__c
                                    WHERE Billing_Account_Number__c = :billingAccountId];

            Set<Id> assetIds = new Set<Id>();
            for (Plan__c plan : plans) {
                for (Asset asset : plan.Assets__r) {
                    assetIds.add(asset.Id);
                }
            }

            List<Usage__c> usageInfo = [SELECT Id, Allotted_Usage__c, Current_Usage__c, Asset__c, Unit_of_Measure__c, Usage_Type__c
                                        FROM Usage__c
                                        WHERE Asset__c IN :assetIds];

            Map<Id,List<Usage__c>> usageMap = new Map<Id,List<Usage__c>>();
            for (Usage__c usage : usageInfo) {
                if (!usageMap.containsKey(usage.Asset__c)) {
                    usageMap.put(usage.Asset__c, new List<Usage__c>());  
                }
                usageMap.get(usage.Asset__c).add(usage);
            }

            PlanWrapper wrapper = new PlanWrapper(plans, usageMap);
            return wrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}