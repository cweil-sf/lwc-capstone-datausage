@isTest
public with sharing class DeviceUsageControllerTest {
  @TestSetup
  static void makeData() {
    Account account = new Account();
    account.Name = 'Test Account';
    insert account;

    Billing_Account__c billingAccount = new Billing_Account__c();
    billingAccount.Name = 'Test Account';
    billingAccount.Billing_Account_Number__c = '1';
    insert billingAccount;

    Plan__c plan = new Plan__c();
    plan.Name = 'Test Plan';
    plan.Billing_Account_Number__c = billingAccount.Id;
    insert plan;

    Asset asset = new Asset();
    asset.Name = 'Test Asset';
    asset.AccountId = account.Id;
    asset.Make_and_Model__c = 'iPhone X';
    asset.User__c = 'Test User';
    asset.Phone_Number_Display__c = '(123) 456-7890';
    asset.Device_Type__c = 'Phone';
    asset.Unlimited_Data__c = false;
    asset.Unlimited_Talk__c = false;
    asset.Unlimited_Text__c = false;
    asset.Plan__c = plan.Id;
    insert asset;

    Set<String> types = new Set<String>{ 'Data', 'Text', 'Talk' };
    List<Usage__c> usages = new List<Usage__c>();
    for (String type : types) {
      Usage__c usage = new Usage__c();
      usage.Allotted_Usage__c = 100;
      usage.Current_Usage__c = 50;
      usage.Asset__c = asset.Id;
      usage.Usage_Type__c = type;
      usages.add(usage);
    }
    insert usages;
  }

  @isTest
  static void getPlans_givenBillingAccountId_shouldReturnAllPlans() {
    Billing_Account__c billingAccount = [
      SELECT Id
      FROM Billing_Account__c
      LIMIT 1
    ];
    Test.startTest();
    DeviceUsageController.PlanWrapper wrapper = DeviceUsageController.getPlans(
      billingAccount.Id,
      'Data'
    );
    Test.stopTest();
    System.assertEquals(1, wrapper.plans.size(), 'Should only be one plan');
    System.assertEquals(
      1,
      wrapper.plans[0].Assets__r.size(),
      'Should only be one asset'
    );
    System.assertEquals(
      1,
      wrapper.usageMap.keySet().size(),
      'Should only be one usage'
    );
    System.assertEquals(
      'Data',
      wrapper.usageMap.get(wrapper.plans[0].Assets__r[0].Id).Usage_Type__c,
      'Should have gotten only usages with type of data'
    );
  }

  @isTest
  static void getPlans_givenPlanId_shouldReturnUsageOfSpecifiedType() {
    Plan__c plan = [SELECT Id FROM Plan__c LIMIT 1];
    Test.startTest();
    DeviceUsageController.PlanWrapper wrapper = DeviceUsageController.getPlans(
      plan.Id,
      'Text'
    );
    Test.stopTest();
    System.assertEquals(1, wrapper.plans.size(), 'Should only be one plan');
    System.assertEquals(
      1,
      wrapper.plans[0].Assets__r.size(),
      'Should only be one asset'
    );
    System.assertEquals(
      1,
      wrapper.usageMap.keySet().size(),
      'Should only be one usage'
    );
    System.assertEquals(
      'Text',
      wrapper.usageMap.get(wrapper.plans[0].Assets__r[0].Id).Usage_Type__c,
      'Should have gotten only usages with type of data'
    );
  }
}
